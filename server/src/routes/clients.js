const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Public endpoint — returns client logos for the homepage marquee
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
