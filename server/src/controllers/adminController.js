const JobOrder = require('../models/JobOrder');
const Quotation = require('../models/Quotation');
const DesignRequest = require('../models/DesignRequest');
const Portfolio = require('../models/Portfolio');
const Tutorial = require('../models/Tutorial');
const Service = require('../models/Service');
const Client = require('../models/Client');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');

// Dashboard stats
const getStats = async (req, res) => {
  try {
    const [orders, quotations, designs, portfolioCount, tutorials, customers, messages] = await Promise.all([
      JobOrder.countDocuments(),
      Quotation.countDocuments(),
      DesignRequest.countDocuments(),
      Portfolio.countDocuments(),
      Tutorial.countDocuments({ status: 'published' }),
      User.countDocuments({ role: 'customer' }),
      ContactMessage.countDocuments({ read: false }),
    ]);
    res.json({ orders, quotations, designs, portfolioCount, tutorials, customers, unreadMessages: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Orders
const getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await JobOrder.find(filter).sort({ createdAt: -1 }).populate('customer', 'name email phone');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const order = await JobOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) {
      order.status = status;
      order.timeline.push({ status, note: adminNotes || `Status updated to ${status}` });
    }
    if (adminNotes) order.adminNotes = adminNotes;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Quotations
const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateQuotation = async (req, res) => {
  try {
    const q = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ message: 'Quotation not found' });
    res.json(q);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Design requests
const getAllDesigns = async (req, res) => {
  try {
    const designs = await DesignRequest.find().sort({ createdAt: -1 }).populate('customer', 'name email');
    res.json(designs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Contact messages
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markMessageRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ active: true }).sort({ displayOrder: 1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllOrders, updateOrder, getAllQuotations, updateQuotation, getAllDesigns, getAllCustomers, getMessages, markMessageRead, getClients, createClient, deleteClient };
