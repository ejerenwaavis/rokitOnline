const mongoose = require('mongoose');

const BatchItemSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  projectCode: { type: String },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'skipped'], default: 'pending' },
  uploadedCount: { type: Number, default: 0 },
  completedAt: { type: Date },
});

const MediaBatchSessionSchema = new mongoose.Schema({
  sourceFilename: { type: String, required: true },
  fileType: { type: String, enum: ['csv', 'markdown'], required: true },
  totalCount: { type: Number, required: true },
  completedCount: { type: Number, default: 0 },
  currentIndex: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  items: [BatchItemSchema],
}, { timestamps: true });

const MediaBatchSession = mongoose.model('MediaBatchSession', MediaBatchSessionSchema);

module.exports = MediaBatchSession;
module.exports.MediaBatchSession = MediaBatchSession;
