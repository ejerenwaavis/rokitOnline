const Portfolio = require('../models/Portfolio');

const getPortfolio = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const items = await Portfolio.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeatured = async (req, res) => {
  try {
    const items = await Portfolio.find({ featured: true }).limit(6).sort({ displayOrder: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPortfolioItem = async (req, res) => {
  try {
    const data = { ...req.body };
    // Parse comma-separated tags into an array
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    // featured arrives as a string from FormData
    if (data.featured !== undefined) {
      data.featured = data.featured === 'true' || data.featured === true;
    }
    // milestones and obstacles arrive as JSON strings from FormData
    if (typeof data.milestones === 'string') {
      try { data.milestones = JSON.parse(data.milestones); } catch { data.milestones = []; }
    }
    if (typeof data.obstacles === 'string') {
      try { data.obstacles = JSON.parse(data.obstacles); } catch { data.obstacles = []; }
    }
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f, i) => ({
        url: f.path,
        publicId: f.filename,
        isCover: i === 0,
        type: f.mimetype.startsWith('video/') ? 'video' : 'image',
      }));
    }
    const item = await Portfolio.create(data);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePortfolioItem = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.milestones === 'string') {
      try { data.milestones = JSON.parse(data.milestones); } catch { data.milestones = []; }
    }
    if (typeof data.obstacles === 'string') {
      try { data.obstacles = JSON.parse(data.obstacles); } catch { data.obstacles = []; }
    }
    const item = await Portfolio.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePortfolioItem = async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadStepImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPortfolio, getFeatured, getPortfolioById, createPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadStepImage };
