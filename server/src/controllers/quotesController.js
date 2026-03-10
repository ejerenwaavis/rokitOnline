const Quotation = require('../models/Quotation');

const createQuotation = async (req, res) => {
  try {
    const { name, email, phone, serviceType, projectDescription, specifications, estimatedBudget, deadline } = req.body;
    if (!name || !email || !serviceType || !projectDescription)
      return res.status(400).json({ message: 'Name, email, service type and description are required' });

    const files = req.files ? req.files.map(f => ({ url: f.path, publicId: f.filename, originalName: f.originalname })) : [];

    const quotation = await Quotation.create({
      name, email, phone, serviceType, projectDescription, specifications,
      estimatedBudget, deadline: deadline ? new Date(deadline) : undefined,
      customer: req.user ? req.user._id : undefined,
      files,
    });
    res.status(201).json(quotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createQuotation, getMyQuotations };
