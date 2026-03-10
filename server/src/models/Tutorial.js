const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true }, // Rich HTML from Tiptap
  thumbnail: { url: String, publicId: String },
  category: {
    type: String,
    enum: ['design-tips', 'printing', 'branding', 'web', 'general'],
    default: 'general',
  },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  views: { type: Number, default: 0 },
  publishedAt: { type: Date },
}, { timestamps: true });

tutorialSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = slugify(this.title) + '-' + Date.now();
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Tutorial', tutorialSchema);
