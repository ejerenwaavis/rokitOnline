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
    const [orders, quotations, designs, portfolioCount, tutorials, customers, messages, clients] = await Promise.all([
      JobOrder.countDocuments(),
      Quotation.countDocuments(),
      DesignRequest.countDocuments(),
      Portfolio.countDocuments(),
      Tutorial.countDocuments({ status: 'published' }),
      User.countDocuments({ role: 'customer' }),
      ContactMessage.countDocuments({ read: false }),
      Client.countDocuments({ active: true }),
    ]);
    res.json({ orders, quotations, designs, portfolioCount, tutorials, customers, unreadMessages: messages, messages, clients });
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
    const { status, adminNotes, quotedPrice } = req.body;
    const order = await JobOrder.findById(req.params.id).populate('customer', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status && status !== order.status) {
      order.status = status;
      order.timeline.push({ status, note: adminNotes || `Status updated to ${status}` });
      // Notify customer of status change
      try {
        const { orderStatusUpdateEmail } = require('../utils/emailTemplates');
        await require('../config/email').sendMail({
          to: order.customer.email,
          subject: `Order Update: ${status} – Rokit Media`,
          html: orderStatusUpdateEmail(order, order.customer),
        });
      } catch { /* non-blocking */ }
    }

    if (adminNotes) order.adminNotes = adminNotes;

    if (quotedPrice && Number(quotedPrice) > 0) {
      order.quotedPrice = Number(quotedPrice);
      order.priceStatus = 'quoted';
      order.timeline.push({ status: order.status, note: `Price quoted: ₦${Number(quotedPrice).toLocaleString()}` });
      // Notify customer of price quote
      try {
        const { pricedQuoteEmail } = require('../utils/emailTemplates');
        await require('../config/email').sendMail({
          to: order.customer.email,
          subject: `Price Quote Ready for Your Order – Rokit Media`,
          html: pricedQuoteEmail(order, order.customer),
        });
      } catch { /* non-blocking */ }
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin accepts customer counter-offer
const acceptOffer = async (req, res) => {
  try {
    const order = await JobOrder.findById(req.params.id).populate('customer', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.priceStatus !== 'negotiating')
      return res.status(400).json({ message: 'No counter-offer to accept on this order' });
    const finalPrice = order.customerBudget;
    order.priceStatus = 'accepted';
    order.totalAmount = finalPrice;
    order.timeline.push({ status: order.status, note: `Team accepted customer counter-offer of ₦${Number(finalPrice).toLocaleString()}` });
    await order.save();
    // Notify customer their counter was accepted
    try {
      const { offerAcceptedCustomerEmail } = require('../utils/emailTemplates');
      await require('../config/email').sendMail({
        to: order.customer.email,
        subject: 'Counter-Offer Accepted – Rokit Media',
        html: offerAcceptedCustomerEmail(order, order.customer),
      });
    } catch { /* non-blocking */ }
    // Notify staff
    try {
      const staffEmail = process.env.JOBS_EMAIL || process.env.EMAIL_USER;
      const { orderConfirmedStaffEmail } = require('../utils/emailTemplates');
      await require('../config/email').sendMail({
        to: staffEmail,
        subject: `Order Confirmed – #${order._id.toString().slice(-6).toUpperCase()} – ₦${Number(finalPrice).toLocaleString()}`,
        html: orderConfirmedStaffEmail(order, order.customer, finalPrice),
      });
    } catch { /* non-blocking */ }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    // Return all users (admins and customers) so admin panel can manage roles
    const customers = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be customer or admin.' });
    }
    // Prevent removing your own admin access
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
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
    const { name, website, displayOrder } = req.body;
    if (!name) return res.status(400).json({ message: 'Client name is required' });
    let logoUrl = req.body.logoUrl || '';
    let logoPublicId = '';
    if (req.file) {
      logoUrl = req.file.path;
      logoPublicId = req.file.filename;
    }
    if (!logoUrl) return res.status(400).json({ message: 'Logo is required' });
    const client = await Client.create({ name, logoUrl, logoPublicId, website, displayOrder: displayOrder || 0 });
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const { name, website, displayOrder } = req.body;
    if (name) client.name = name;
    if (website !== undefined) client.website = website;
    if (displayOrder !== undefined) client.displayOrder = displayOrder;
    if (req.file) {
      // Delete old logo from Cloudinary
      if (client.logoPublicId) {
        try {
          const cloudinary = require('../config/cloudinary');
          await cloudinary.uploader.destroy(client.logoPublicId);
        } catch { /* non-blocking */ }
      }
      client.logoUrl = req.file.path;
      client.logoPublicId = req.file.filename;
    }
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    if (client.logoPublicId) {
      try {
        const cloudinary = require('../config/cloudinary');
        await cloudinary.uploader.destroy(client.logoPublicId);
      } catch { /* non-blocking */ }
    }
    await client.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllOrders, updateOrder, acceptOffer, forwardOrder, getAllQuotations, updateQuotation, getAllDesigns, getAllCustomers, updateUserRole, getMessages, markMessageRead, getClients, createClient, updateClient, deleteClient };

const { orderForwardEmail } = require('../utils/emailTemplates');
const { sendMail } = require('../config/email');

async function forwardOrder(req, res) {
  try {
    const { email, note } = req.body;
    if (!email) return res.status(400).json({ message: 'Recipient email is required' });

    const order = await JobOrder.findById(req.params.id).populate('customer', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await sendMail({
      to: email,
      subject: `Job Order #${order._id.toString().slice(-6).toUpperCase()} – ${order.serviceType?.replace(/-/g, ' ')} | Rokit Media`,
      html: orderForwardEmail(order, order.customer, req.user.name, note || ''),
    });

    res.json({ message: 'Order details sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
