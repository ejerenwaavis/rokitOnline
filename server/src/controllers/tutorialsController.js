const Tutorial = require('../models/Tutorial');
const slugify = require('../utils/slugify');

const getTutorials = async (req, res) => {
  try {
    const filter = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const [tutorials, total] = await Promise.all([
      Tutorial.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit).populate('author', 'name'),
      Tutorial.countDocuments(filter),
    ]);
    res.json({ tutorials, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTutorialBySlug = async (req, res) => {
  try {
    const tutorial = await Tutorial.findOne({ slug: req.params.slug, status: 'published' }).populate('author', 'name');
    if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
    tutorial.views += 1;
    await tutorial.save();
    res.json(tutorial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTutorial = async (req, res) => {
  try {
    const data = { ...req.body, author: req.user._id };
    if (!data.slug) data.slug = slugify(data.title) + '-' + Date.now();
    if (req.file) data.thumbnail = { url: req.file.path, publicId: req.file.filename };
    const tutorial = await Tutorial.create(data);
    res.status(201).json(tutorial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });
    res.json(tutorial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteTutorial = async (req, res) => {
  try {
    await Tutorial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllTutorialsAdmin = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 }).populate('author', 'name');
    res.json(tutorials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTutorials, getTutorialBySlug, createTutorial, updateTutorial, deleteTutorial, getAllTutorialsAdmin };
