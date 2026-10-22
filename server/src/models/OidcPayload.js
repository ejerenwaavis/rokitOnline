const mongoose = require('mongoose');

const oidcPayloadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  grantId: { type: String, index: true },
  userCode: { type: String, index: true },
  uid: { type: String, index: true },
  consumedAt: { type: Date },
  expiresAt: { type: Date, expires: 0, index: true }
}, { timestamps: true });

module.exports = mongoose.model('OidcPayload', oidcPayloadSchema);
