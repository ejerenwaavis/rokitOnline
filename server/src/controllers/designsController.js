const DesignRequest = require('../models/DesignRequest');

const createDesignRequest = async (req, res) => {
  try {
    const { designType, brief, targetAudience, colorPreferences, stylePreferences, deliverables, deadline } = req.body;
    if (!designType || !brief)
      return res.status(400).json({ message: 'Design type and brief are required' });

    const referenceFiles = req.files ? req.files.map(f => ({ url: f.path, publicId: f.filename, originalName: f.originalname })) : [];

    const request = await DesignRequest.create({
      customer: req.user._id,
      designType, brief, targetAudience, colorPreferences, stylePreferences, deliverables,
      deadline: deadline ? new Date(deadline) : undefined,
      referenceFiles,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyDesignRequests = async (req, res) => {
  try {
    const requests = await DesignRequest.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createDesignRequest, getMyDesignRequests };
