const Project = require('../models/Project');
const MediaBatchSession = require('../models/MediaBatchSession');
const cloudinary = require('../config/cloudinary');
const { parseProjectPortfolioRegister, slugify } = require('../services/markdownParser');
const { syncProjectToPortfolio } = require('../utils/portfolioSync');

/**
 * Helper to parse simple CSV file if user uploads CSV instead of MD
 */
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const projects = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map((c) => c.trim());
    if (row.length === 0 || !row[0]) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = row[idx] || '';
    });

    const projectCode = rowObj.code || rowObj.projectcode || `PRJ-${String(i).padStart(3, '0')}`;
    const title = rowObj.title || `Project ${i}`;
    const slug = `${projectCode.toLowerCase()}-${slugify(title)}`;
    const category = rowObj.category || 'General';
    const description = rowObj.description || '';
    const notes = rowObj.notes || '';

    // Milestones split by semicolon or pipe
    const rawMilestones = (rowObj.milestones || 'General')
      .split(/[;|]/)
      .map((m) => m.trim())
      .filter(Boolean);

    const milestones = rawMilestones.map((mTitle, idx) => ({
      id: slugify(mTitle) || `milestone-${idx + 1}`,
      title: mTitle,
      description: mTitle,
      order: idx,
      media: [],
    }));

    projects.push({
      projectCode,
      title,
      slug,
      category,
      description,
      flowNotes: notes,
      milestones,
      mediaCount: 0,
      status: 'pending_media',
    });
  }

  return projects;
}

/**
 * POST /api/media-bridge/ingest
 * Accepts multipart/form-data containing .csv or .md
 */
const ingestFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filename = req.file.originalname || 'uploaded-file.md';
    const isMarkdown = filename.toLowerCase().endsWith('.md');
    const isCsv = filename.toLowerCase().endsWith('.csv');

    if (!isMarkdown && !isCsv) {
      return res.status(400).json({ message: 'Unsupported file format. Please upload .md or .csv' });
    }

    const fileContent = req.file.buffer.toString('utf-8');
    let parsedProjects = [];

    if (isMarkdown) {
      parsedProjects = parseProjectPortfolioRegister(fileContent);
    } else {
      parsedProjects = parseCSV(fileContent);
    }

    if (!parsedProjects || parsedProjects.length === 0) {
      return res.status(400).json({ message: 'No valid project records found in file' });
    }

    let newCount = 0;
    let existingCount = 0;
    const batchItems = [];

    // Deduplication Key: Upsert based on projectCode (Non-Destructive Sync)
    for (const p of parsedProjects) {
      let existingProj = await Project.findOne({ projectCode: p.projectCode });

      if (existingProj) {
        existingCount++;
        // Update text fields non-destructively
        existingProj.title = p.title || existingProj.title;
        existingProj.category = p.category || existingProj.category;
        existingProj.description = p.description || existingProj.description;
        existingProj.evidence = p.evidence || existingProj.evidence;
        existingProj.publicClearance = p.publicClearance || existingProj.publicClearance;
        existingProj.nextAction = p.nextAction || existingProj.nextAction;
        existingProj.flowNotes = p.flowNotes || existingProj.flowNotes;

        // Non-destructive milestone sync:
        // Do not wipe media. Merge missing milestones.
        const existingMilestoneIds = new Set((existingProj.milestones || []).map((m) => m.id));
        for (const newM of p.milestones || []) {
          if (!existingMilestoneIds.has(newM.id)) {
            existingProj.milestones.push(newM);
          }
        }

        await existingProj.save();

        batchItems.push({
          projectId: existingProj._id,
          projectCode: existingProj.projectCode,
          slug: existingProj.slug,
          title: existingProj.title,
          status: 'pending',
          uploadedCount: existingProj.mediaCount || 0,
        });
      } else {
        newCount++;
        const newProj = new Project({
          ...p,
          status: 'pending_media',
        });
        await newProj.save();

        batchItems.push({
          projectId: newProj._id,
          projectCode: newProj.projectCode,
          slug: newProj.slug,
          title: newProj.title,
          status: 'pending',
          uploadedCount: 0,
        });
      }
    }

    // Create MediaBatchSession
    const session = new MediaBatchSession({
      sourceFilename: filename,
      fileType: isMarkdown ? 'markdown' : 'csv',
      totalCount: batchItems.length,
      completedCount: 0,
      currentIndex: 0,
      status: 'active',
      items: batchItems,
    });

    await session.save();

    // Link session to projects
    const projectIds = batchItems.map((item) => item.projectId);
    await Project.updateMany(
      { _id: { $in: projectIds } },
      { $set: { lastBatchSessionId: session._id } }
    );

    const firstProject = await Project.findById(batchItems[0].projectId);

    return res.status(200).json({
      sessionId: session._id,
      totalCount: session.totalCount,
      newProjects: newCount,
      existingProjects: existingCount,
      firstProject,
    });
  } catch (error) {
    console.error('Ingest error:', error);
    return res.status(500).json({ message: error.message || 'Error ingesting register file' });
  }
};

/**
 * GET /api/media-bridge/session/:sessionId/current
 * Fetches current active project and session progress
 */
const getCurrentSessionItem = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await MediaBatchSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.currentIndex >= session.items.length) {
      session.status = 'completed';
      await session.save();
      return res.json({
        session,
        isBatchComplete: true,
        project: null,
      });
    }

    const currentItem = session.items[session.currentIndex];
    const project = await Project.findById(currentItem.projectId);

    return res.json({
      session,
      isBatchComplete: false,
      currentIndex: session.currentIndex,
      totalCount: session.totalCount,
      completedCount: session.completedCount,
      project,
    });
  } catch (error) {
    console.error('Get current session item error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching session item' });
  }
};

/**
 * GET /api/media-bridge/session/active
 * Finds latest active uncompleted session for banner resumption
 */
const getActiveSession = async (req, res) => {
  try {
    const session = await MediaBatchSession.findOne({ status: 'active' }).sort({ updatedAt: -1 });
    return res.json({ session });
  } catch (error) {
    console.error('Get active session error:', error);
    return res.status(500).json({ message: error.message || 'Error checking active session' });
  }
};

/**
 * POST /api/media-bridge/cloudinary-sign
 * Generates signed payload for direct browser-to-Cloudinary uploads
 */
const generateCloudinarySignature = async (req, res) => {
  try {
    const { folder, projectCode, projectTitle, milestoneId } = req.body;

    let targetFolder = folder;
    if (!targetFolder && projectCode && milestoneId) {
      const slugifiedTitle = slugify(projectTitle || '');
      targetFolder = `rokit/projects/${projectCode.toLowerCase()}-${slugifiedTitle}/${milestoneId}`;
    }

    if (!targetFolder) {
      return res.status(400).json({ message: 'Target folder is required for signature' });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { folder: targetFolder, timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      signature,
      timestamp,
      folder: targetFolder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    return res.status(500).json({ message: error.message || 'Error generating Cloudinary signature' });
  }
};

/**
 * PUT /api/media-bridge/project/:projectId/commit
 * Commits staged Cloudinary media and deltas, then atomically advances session
 */
const commitProjectMedia = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sessionId, deltas = {}, milestones = [], status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Apply text deltas
    if (deltas.title) project.title = deltas.title;
    if (deltas.description !== undefined) project.description = deltas.description;
    if (deltas.notes !== undefined) project.flowNotes = deltas.notes;
    if (deltas.evidence !== undefined) project.evidence = deltas.evidence;
    if (deltas.publicClearance !== undefined) project.publicClearance = deltas.publicClearance;
    if (deltas.nextAction !== undefined) project.nextAction = deltas.nextAction;
    if (deltas.category) project.category = deltas.category;

    // Apply updated milestones with staged media
    if (Array.isArray(milestones) && milestones.length > 0) {
      project.milestones = milestones;
    }

    // Calculate total media count
    const totalMedia = (project.milestones || []).reduce((acc, m) => acc + (m.media ? m.media.length : 0), 0);
    project.mediaCount = totalMedia;

    if (status) {
      project.status = status;
    } else if (totalMedia > 0) {
      project.status = 'ready_for_review';
    }

    await project.save();

    // Synchronize to Portfolio collection so project immediately appears in Gallery & Admin Portfolio
    try {
      await syncProjectToPortfolio(project);
    } catch (syncErr) {
      console.error('Auto-sync to portfolio error:', syncErr);
    }

    // Advance MediaBatchSession
    if (sessionId) {
      const session = await MediaBatchSession.findById(sessionId);
      if (session) {
        const nextIndex = session.currentIndex + 1;
        const isComplete = nextIndex >= session.items.length;

        await MediaBatchSession.updateOne(
          { _id: sessionId, 'items.projectId': projectId },
          {
            $set: {
              'items.$.status': 'completed',
              'items.$.uploadedCount': totalMedia,
              'items.$.completedAt': new Date(),
              currentIndex: nextIndex,
              status: isComplete ? 'completed' : 'active',
            },
            $inc: { completedCount: 1 },
          }
        );

        let nextProject = null;
        if (!isComplete && session.items[nextIndex]) {
          nextProject = await Project.findById(session.items[nextIndex].projectId);
        }

        return res.json({
          success: true,
          isBatchComplete: isComplete,
          nextIndex,
          nextProject,
        });
      }
    }

    return res.json({ success: true, project });
  } catch (error) {
    console.error('Commit project media error:', error);
    return res.status(500).json({ message: error.message || 'Error committing project media' });
  }
};

/**
 * POST /api/media-bridge/session/:sessionId/skip
 * Skips current project and advances to next
 */
const skipProject = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await MediaBatchSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const nextIndex = session.currentIndex + 1;
    const isComplete = nextIndex >= session.items.length;

    await MediaBatchSession.updateOne(
      { _id: sessionId, currentIndex: session.currentIndex },
      {
        $set: {
          'items.$.status': 'skipped',
          currentIndex: nextIndex,
          status: isComplete ? 'completed' : 'active',
        },
      }
    );

    let nextProject = null;
    if (!isComplete && session.items[nextIndex]) {
      nextProject = await Project.findById(session.items[nextIndex].projectId);
    }

    return res.json({
      success: true,
      isBatchComplete: isComplete,
      nextIndex,
      nextProject,
    });
  } catch (error) {
    console.error('Skip project error:', error);
    return res.status(500).json({ message: error.message || 'Error skipping project' });
  }
};

/**
 * POST /api/media-bridge/session/:sessionId/discard
 * Discards or pauses active session
 */
const discardSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await MediaBatchSession.findByIdAndUpdate(sessionId, { status: 'paused' });
    return res.json({ success: true, message: 'Session discarded' });
  } catch (error) {
    console.error('Discard session error:', error);
    return res.status(500).json({ message: error.message || 'Error discarding session' });
  }
};

module.exports = {
  ingestFile,
  getCurrentSessionItem,
  getActiveSession,
  generateCloudinarySignature,
  commitProjectMedia,
  skipProject,
  discardSession,
};
