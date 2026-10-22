const OidcPayload = require('../models/OidcPayload');

class MongoAdapter {
  constructor(name) {
    this.name = name;
  }

  async upsert(id, payload, expiresIn) {
    const expiresAt = expiresIn ? new Date(Date.now() + (expiresIn * 1000)) : undefined;
    await OidcPayload.findByIdAndUpdate(
      id,
      {
        type: this.name,
        payload,
        grantId: payload.grantId,
        userCode: payload.userCode,
        uid: payload.uid,
        expiresAt,
      },
      { upsert: true, new: true }
    );
  }

  async find(id) {
    const doc = await OidcPayload.findById(id);
    if (!doc || doc.type !== this.name) return undefined;
    if (doc.expiresAt && doc.expiresAt < new Date()) return undefined;
    return doc.payload;
  }

  async findByUserCode(userCode) {
    const doc = await OidcPayload.findOne({ userCode, type: this.name });
    if (!doc) return undefined;
    if (doc.expiresAt && doc.expiresAt < new Date()) return undefined;
    return doc.payload;
  }

  async findByUid(uid) {
    const doc = await OidcPayload.findOne({ uid, type: this.name });
    if (!doc) return undefined;
    if (doc.expiresAt && doc.expiresAt < new Date()) return undefined;
    return doc.payload;
  }

  async destroy(id) {
    await OidcPayload.findByIdAndDelete(id);
  }

  async revokeByGrantId(grantId) {
    await OidcPayload.deleteMany({ grantId });
  }

  async consume(id) {
    await OidcPayload.findByIdAndUpdate(id, {
      'payload.consumed': true,
      consumedAt: new Date(),
    });
  }
}

module.exports = MongoAdapter;
