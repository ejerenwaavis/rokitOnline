const mongoose = require('mongoose');

const MediaAssetSchema = new mongoose.Schema({
  publicId: { type: String, required: true },
  secureUrl: { type: String, required: true },
  resourceType: { type: String, enum: ['image', 'video'], default: 'image' },
  format: { type: String },
  bytes: { type: Number },
  width: { type: Number },
  height: { type: Number },
  caption: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const MilestoneSchema = new mongoose.Schema({
  id: { type: String, required: true }, // slugified or uuid
  title: { type: String, required: true },
  description: { type: String, default: '' }, // raw suggested title
  order: { type: Number, default: 0 },
  media: [MediaAssetSchema],
});

const ProjectSchema = new mongoose.Schema({
  projectCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  description: {
    type: String,
    default: '',
  },
  evidence: {
    type: String,
    default: '',
  },
  publicClearance: {
    type: String,
    default: 'Pending',
  },
  nextAction: {
    type: String,
    default: '',
  },
  flowNotes: {
    type: String,
    default: '',
  },
  milestones: [MilestoneSchema],
  mediaCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'pending_media', 'ready_for_review', 'published'],
    default: 'pending_media',
  },
  lastBatchSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaBatchSession',
  },
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
module.exports.Project = Project;
