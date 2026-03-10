const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional — for logged-in users
  serviceType: {
    type: String,
    required: true,
    enum: ['large-format', 'graphic-design', 'branding', 'web-design', 'idea-creation', 'roll-up-banners', 'other'],
  },
  projectDescription: { type: String, required: true },
  specifications: { type: String },
  estimatedBudget: { type: String },
  deadline: { type: Date },
  files: [{ url: String, publicId: String, originalName: String }],
  status: {
    type: String,
    enum: ['new', 'reviewing', 'quoted', 'accepted', 'declined'],
    default: 'new',
  },
  adminResponse: { type: String },
  quotedAmount: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
