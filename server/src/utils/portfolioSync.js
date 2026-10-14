const Portfolio = require('../models/Portfolio');

function mapToPortfolioCategory(cat) {
  if (!cat) return 'branding';
  const c = String(cat).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  if (['banner-prints', 'branding', 'roll-up-banners', 'web-design', 'graphic-design', 'large-format'].includes(c)) {
    return c;
  }
  if (c.includes('brand') || c.includes('flagship') || c.includes('identity')) return 'branding';
  if (c.includes('web') || c.includes('digital') || c.includes('app')) return 'web-design';
  if (c.includes('banner') || c.includes('print')) return 'banner-prints';
  if (c.includes('roll')) return 'roll-up-banners';
  if (c.includes('large') || c.includes('format') || c.includes('billboard')) return 'large-format';
  if (c.includes('graphic') || c.includes('design') || c.includes('editorial') || c.includes('book')) return 'graphic-design';
  return 'branding';
}

/**
 * Synchronizes a Project (from Media Bridge) into a Portfolio record
 * so that it appears in /admin/portfolio, /gallery, and homepage showcases.
 * @param {Object} project - Project mongoose document
 * @returns {Promise<Object|null>} Synced Portfolio record
 */
async function syncProjectToPortfolio(project) {
  if (!project) return null;

  const images = [];
  const portfolioMilestones = [];

  if (Array.isArray(project.milestones)) {
    project.milestones.forEach((m, mIdx) => {
      const mMedia = Array.isArray(m.media) ? m.media : [];
      let milestoneImage = null;
      if (mMedia.length > 0 && mMedia[0].secureUrl) {
        milestoneImage = {
          url: mMedia[0].secureUrl,
          publicId: mMedia[0].publicId,
        };
      }

      portfolioMilestones.push({
        title: m.title,
        description: m.description || '',
        order: m.order ?? mIdx,
        image: milestoneImage,
      });

      mMedia.forEach((asset) => {
        if (asset && asset.secureUrl) {
          images.push({
            url: asset.secureUrl,
            publicId: asset.publicId,
            isCover: images.length === 0, // First uploaded asset acts as cover
            type: asset.resourceType || 'image',
          });
        }
      });
    });
  }

  // Only publish projects that are finalized (not drafts or pending media)
  if (project.status === 'draft' || project.status === 'pending_media') {
    // If it was previously in Portfolio, remove it so unfinished drafts do not appear live
    await Portfolio.deleteMany({
      $or: [
        { projectCode: project.projectCode },
        { projectId: project._id },
      ],
    });
    return null;
  }

  // If no media is uploaded, we do not create an empty public portfolio entry
  if (images.length === 0) {
    return null;
  }

  const portfolioData = {
    title: project.title,
    category: mapToPortfolioCategory(project.category),
    description: project.description || '',
    client: project.title,
    tags: [project.projectCode, project.category, 'media-bridge'].filter(Boolean),
    images,
    milestones: portfolioMilestones,
    projectCode: project.projectCode,
    projectId: project._id,
  };

  const synced = await Portfolio.findOneAndUpdate(
    {
      $or: [
        { projectCode: project.projectCode },
        { projectId: project._id },
        { title: project.title },
      ],
    },
    portfolioData,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return synced;
}

module.exports = {
  syncProjectToPortfolio,
  mapToPortfolioCategory,
};
