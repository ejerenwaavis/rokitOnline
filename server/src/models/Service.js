const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String }, // Lucide icon name or URL
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  images: [{ url: String, publicId: String }],
  features: [String],
  startingPrice: { type: String },
  turnaround: { type: String },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
