const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['banner-prints', 'branding', 'roll-up-banners', 'web-design', 'graphic-design', 'large-format'],
  },
  description: { type: String },
  images: [{
    url: { type: String, required: true },
    publicId: String,
    isCover: { type: Boolean, default: false },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
  }],
  tags: [String],
  client: { type: String },
  completedDate: { type: Date },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  milestones: [{
    title: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
    image: { url: String, publicId: String },
  }],
  obstacles: [{
    challenge: { type: String },
    solution: { type: String },
    image: { url: String, publicId: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
