const mongoose = require('mongoose');

const jobOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: {
    type: String,
    required: true,
    enum: ['large-format', 'graphic-design', 'branding', 'web-design', 'idea-creation', 'roll-up-banners', 'other'],
  },
  description: { type: String, required: true },
  specifications: { type: String },
  quantity: { type: Number, default: 1 },
  dimensions: { type: String },
  deadline: { type: Date },
  files: [{ url: String, publicId: String, originalName: String }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'review', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  stripePaymentIntentId: { type: String },
  depositAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'usd' },
  adminNotes: { type: String },
  customerNotes: { type: String },
  quotedPrice: { type: Number },
  customerBudget: { type: Number },
  priceStatus: { type: String, enum: ['pending', 'quoted', 'accepted', 'negotiating'], default: 'pending' },
  timeline: [{
    status: String,
    note: String,
    date: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('JobOrder', jobOrderSchema);
