const mongoose = require('mongoose');

const designRequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designType: {
    type: String,
    required: true,
    enum: ['logo', 'flyer', 'banner', 'brochure', 'social-media', 'business-card', 'packaging', 'other'],
  },
  brief: { type: String, required: true },
  targetAudience: { type: String },
  colorPreferences: { type: String },
  stylePreferences: { type: String },
  referenceFiles: [{ url: String, publicId: String, originalName: String }],
  deliverables: { type: String },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'review', 'revision', 'completed', 'cancelled'],
    default: 'pending',
  },
  adminNotes: { type: String },
  revisionCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DesignRequest', designRequestSchema);
