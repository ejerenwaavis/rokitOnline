import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  Loader2,
  FolderSync,
} from 'lucide-react';

import SessionHeaderBar from '../../components/media-bridge/SessionHeaderBar';
import ProjectMetaEditor from '../../components/media-bridge/ProjectMetaEditor';
import MilestoneTrack from '../../components/media-bridge/MilestoneTrack';
import DropzoneArea from '../../components/media-bridge/DropzoneArea';
import ThumbnailTray from '../../components/media-bridge/ThumbnailTray';
import ProjectActionBar from '../../components/media-bridge/ProjectActionBar';
import BatchCompleteModal from '../../components/media-bridge/BatchCompleteModal';

export default function MediaBridge() {
  // Screen states: 'ingest' | 'focused' | 'complete'
  const [screen, setScreen] = useState('ingest');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Session & Project State
  const [session, setSession] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [projectFormData, setProjectFormData] = useState({});
  const [milestones, setMilestones] = useState([]);
  const [activeMilestoneId, setActiveMilestoneId] = useState('');

  // Resume Banner state
  const [pendingSession, setPendingSession] = useState(null);
  const fileInputRef = useRef(null);

  // Check for active/resumable session on mount
  useEffect(() => {
    checkResumableSession();
  }, []);

  const checkResumableSession = async () => {
    try {
      const storedBatchId = localStorage.getItem('rokit_active_batch_id');

      // Check server for active session
      const res = await api.get('/media-bridge/session/active');
      const serverActive = res.data?.session;

      if (serverActive && serverActive._id) {
        setPendingSession(serverActive);
        // If storedBatchId matches, offer instant resumption
        if (storedBatchId === serverActive._id) {
          resumeSession(serverActive._id);
        }
      } else if (storedBatchId) {
        // Stored ID exists, attempt lookup
        try {
          const detailRes = await api.get(`/media-bridge/session/${storedBatchId}/current`);
          if (detailRes.data?.session && !detailRes.data.isBatchComplete) {
            setPendingSession(detailRes.data.session);
          } else {
            localStorage.removeItem('rokit_active_batch_id');
          }
        } catch {
          localStorage.removeItem('rokit_active_batch_id');
        }
      }
    } catch (err) {
      console.error('Session recovery check failed:', err);
    }
  };

  const resumeSession = async (sessionId) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/media-bridge/session/${sessionId}/current`);
      if (res.data.isBatchComplete) {
        setSession(res.data.session);
        setScreen('complete');
        localStorage.removeItem('rokit_active_batch_id');
      } else {
        hydrateProjectState(res.data.session, res.data.project);
        localStorage.setItem('rokit_active_batch_id', sessionId);
        setScreen('focused');
      }
    } catch (err) {
      console.error('Error resuming session:', err);
      toast.error('Could not resume session');
      localStorage.removeItem('rokit_active_batch_id');
    } finally {
      setIsLoading(false);
    }
  };

  const discardPendingSession = async (sessionId) => {
    try {
      await api.post(`/media-bridge/session/${sessionId}/discard`);
      setPendingSession(null);
      localStorage.removeItem('rokit_active_batch_id');
      toast.success('Session discarded');
    } catch {
      toast.error('Error discarding session');
    }
  };

  const hydrateProjectState = (sessionData, projectDoc) => {
    setSession(sessionData);
    setActiveProject(projectDoc);

    const initial = {
      title: projectDoc.title || '',
      description: projectDoc.description || '',
      flowNotes: projectDoc.flowNotes || '',
      category: projectDoc.category || 'General',
      evidence: projectDoc.evidence || '',
      publicClearance: projectDoc.publicClearance || 'Pending',
      nextAction: projectDoc.nextAction || '',
      projectCode: projectDoc.projectCode || '',
      slug: projectDoc.slug || '',
    };

    setInitialData(initial);
    setProjectFormData({ ...initial });

    const pMilestones = projectDoc.milestones || [];
    setMilestones(pMilestones);

    if (pMilestones.length > 0) {
      setActiveMilestoneId(pMilestones[0].id);
    } else {
      setActiveMilestoneId('');
    }
  };

  // Handle Ingest File (.md or .csv)
  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/media-bridge/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { sessionId, firstProject } = res.data;
      localStorage.setItem('rokit_active_batch_id', sessionId);
      toast.success(
        `Ingested register with ${res.data.totalCount} projects (${res.data.newProjects} new, ${res.data.existingProjects} existing)`
      );

      // Fetch fresh session state and hydrate
      const currentRes = await api.get(`/media-bridge/session/${sessionId}/current`);
      hydrateProjectState(currentRes.data.session, currentRes.data.project || firstProject);
      setScreen('focused');
    } catch (err) {
      console.error('Ingest failed:', err);
      toast.error(err.response?.data?.message || 'Failed to ingest register file');
    } finally {
      setIsLoading(false);
    }
  };

  // Delta changes tracking
  const handleMetaChange = (field, value) => {
    setProjectFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty =
    projectFormData.title !== initialData.title ||
    projectFormData.description !== initialData.description ||
    projectFormData.flowNotes !== initialData.flowNotes ||
    projectFormData.nextAction !== initialData.nextAction ||
    projectFormData.evidence !== initialData.evidence ||
    projectFormData.category !== initialData.category;

  // Milestone management
  const handleAddMilestone = (title) => {
    const cleanId = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newMilestone = {
      id: cleanId || `milestone-${milestones.length + 1}`,
      title,
      description: title,
      order: milestones.length,
      media: [],
    };

    setMilestones((prev) => [...prev, newMilestone]);
    setActiveMilestoneId(newMilestone.id);
  };

  // Delete Milestone
  const handleDeleteMilestone = (milestoneId) => {
    const target = milestones.find((m) => m.id === milestoneId);
    if (!target) return;

    const stagedCount = (target.media || []).length;
    if (stagedCount > 0) {
      const confirmDelete = window.confirm(
        `Milestone "${target.title}" contains ${stagedCount} staged media asset(s). Are you sure you want to delete it?`
      );
      if (!confirmDelete) return;
    }

    const updated = milestones.filter((m) => m.id !== milestoneId);
    setMilestones(updated);

    if (activeMilestoneId === milestoneId) {
      setActiveMilestoneId(updated.length > 0 ? updated[0].id : '');
    }

    toast.success(`Milestone "${target.title}" deleted`);
  };

  // Media staged locally under selected milestone
  const handleMediaUploaded = (milestoneId, mediaAsset) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, media: [...(m.media || []), mediaAsset] } : m
      )
    );
    toast.success('Media asset staged to milestone');
  };

  const handleRemoveMedia = (assetIndex) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === activeMilestoneId
          ? { ...m, media: m.media.filter((_, idx) => idx !== assetIndex) }
          : m
      )
    );
  };

  const handleUpdateCaption = (assetIndex, newCaption) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === activeMilestoneId
          ? {
              ...m,
              media: m.media.map((asset, idx) =>
                idx === assetIndex ? { ...asset, caption: newCaption } : asset
              ),
            }
          : m
      )
    );
  };

  // Commit & Advance
  const handleCommitAndAdvance = async () => {
    if (!activeProject?._id) return;
    setIsSubmitting(true);

    try {
      const deltas = {};
      if (projectFormData.title !== initialData.title) deltas.title = projectFormData.title;
      if (projectFormData.description !== initialData.description) deltas.description = projectFormData.description;
      if (projectFormData.flowNotes !== initialData.flowNotes) deltas.notes = projectFormData.flowNotes;
      if (projectFormData.nextAction !== initialData.nextAction) deltas.nextAction = projectFormData.nextAction;
      if (projectFormData.evidence !== initialData.evidence) deltas.evidence = projectFormData.evidence;
      if (projectFormData.category !== initialData.category) deltas.category = projectFormData.category;

      const payload = {
        sessionId: session?._id,
        deltas,
        milestones,
      };

      const res = await api.put(`/media-bridge/project/${activeProject._id}/commit`, payload);

      if (res.data.isBatchComplete) {
        setScreen('complete');
        localStorage.removeItem('rokit_active_batch_id');
        toast.success('All projects in batch completed!');
      } else if (res.data.nextProject) {
        toast.success('Project committed. Advancing to next...');
        // Refresh session
        const currentRes = await api.get(`/media-bridge/session/${session._id}/current`);
        hydrateProjectState(currentRes.data.session, res.data.nextProject);
      }
    } catch (err) {
      console.error('Commit failed:', err);
      toast.error('Failed to commit project changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip Project
  const handleSkip = async () => {
    if (!session?._id) return;
    setIsSubmitting(true);
    try {
      const res = await api.post(`/media-bridge/session/${session._id}/skip`);
      if (res.data.isBatchComplete) {
        setScreen('complete');
        localStorage.removeItem('rokit_active_batch_id');
      } else if (res.data.nextProject) {
        const currentRes = await api.get(`/media-bridge/session/${session._id}/current`);
        hydrateProjectState(currentRes.data.session, res.data.nextProject);
        toast.success('Skipped project');
      }
    } catch {
      toast.error('Failed to skip project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Draft (does not advance queue)
  const handleSaveDraft = async () => {
    if (!activeProject?._id) return;
    setIsSubmitting(true);
    try {
      const deltas = {
        title: projectFormData.title,
        description: projectFormData.description,
        notes: projectFormData.flowNotes,
        evidence: projectFormData.evidence,
        nextAction: projectFormData.nextAction,
        category: projectFormData.category,
      };

      await api.put(`/media-bridge/project/${activeProject._id}/commit`, {
        deltas,
        milestones,
        status: 'draft',
      });
      setInitialData({ ...projectFormData });
      toast.success('Draft saved');
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setScreen('ingest');
    setSession(null);
    setActiveProject(null);
    setMilestones([]);
    setPendingSession(null);
    localStorage.removeItem('rokit_active_batch_id');
  };

  // Total media assets across all milestones
  const totalStagedMedia = milestones.reduce((acc, m) => acc + (m.media ? m.media.length : 0), 0);
  const currentActiveMilestone = milestones.find((m) => m.id === activeMilestoneId);

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Resumption Banner on Ingest Screen */}
      {screen === 'ingest' && pendingSession && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <FolderSync size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                Pending upload session detected
              </p>
              <p className="text-xs text-amber-700">
                Source: <span className="font-semibold">{pendingSession.sourceFilename}</span> ({pendingSession.completedCount} of {pendingSession.totalCount} completed)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => resumeSession(pendingSession._id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rokit-dark text-white rounded-lg text-xs font-bold hover:bg-black transition"
            >
              <Play size={12} /> Resume Session
            </button>
            <button
              type="button"
              onClick={() => discardPendingSession(pendingSession._id)}
              className="px-3 py-1.5 border border-amber-300 text-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-100 transition"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Ingestion Screen */}
      {screen === 'ingest' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8">
            <div className="w-14 h-14 rounded-2xl bg-rokit-orange/10 text-rokit-orange flex items-center justify-center mx-auto mb-4">
              <Layers size={28} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
              Rapid Project Media Bridge
            </h1>
            <p className="text-xs text-gray-500">
              Upload our production Markdown register (e.g. <span className="font-mono text-gray-700">rOKIt_Project_Portfolio_Upload_Register_2026-10-13.md</span>) or a CSV file. The engine parses, dedupes against MongoDB, and prepares the sequential upload room.
            </p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-rokit-orange rounded-2xl p-10 text-center cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition max-w-xl mx-auto"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 mx-auto flex items-center justify-center text-rokit-orange mb-3">
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <UploadCloud size={24} />
              )}
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">
              {isLoading ? 'Parsing and synchronizing...' : 'Select Markdown or CSV Register'}
            </h3>
            <p className="text-xs text-gray-500">
              Supports .md (standard section headers, JSON image arrays) or .csv
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Focused Single-Project Upload Room */}
      {screen === 'focused' && activeProject && (
        <div className="space-y-6">
          <SessionHeaderBar
            session={session}
            currentIndex={session?.currentIndex || 0}
            totalCount={session?.totalCount || 0}
            completedCount={session?.completedCount || 0}
            onDiscard={() => {
              if (window.confirm('Are you sure you want to discard this batch session?')) {
                discardPendingSession(session._id);
                setScreen('ingest');
              }
            }}
          />

          <ProjectMetaEditor
            formData={projectFormData}
            onChange={handleMetaChange}
            isDirty={isDirty}
          />

          <MilestoneTrack
            milestones={milestones}
            activeMilestoneId={activeMilestoneId}
            onSelectMilestone={setActiveMilestoneId}
            onAddMilestone={handleAddMilestone}
            onDeleteMilestone={handleDeleteMilestone}
          />

          <DropzoneArea
            project={activeProject}
            activeMilestoneId={activeMilestoneId}
            onMediaUploaded={handleMediaUploaded}
          />

          <ThumbnailTray
            media={currentActiveMilestone?.media || []}
            milestoneTitle={currentActiveMilestone?.title || ''}
            onRemoveMedia={handleRemoveMedia}
            onUpdateCaption={handleUpdateCaption}
          />

          <ProjectActionBar
            isSubmitting={isSubmitting}
            onCommitAndAdvance={handleCommitAndAdvance}
            onSkip={handleSkip}
            onSaveDraft={handleSaveDraft}
            mediaCount={totalStagedMedia}
          />
        </div>
      )}

      {/* STEP 3: Complete Screen */}
      {screen === 'complete' && (
        <BatchCompleteModal session={session} onReset={handleReset} />
      )}
    </div>
  );
}
