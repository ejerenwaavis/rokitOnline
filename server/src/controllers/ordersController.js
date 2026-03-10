const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const JobOrder = require('../models/JobOrder');
const { sendMail } = require('../config/email');
const { orderConfirmationEmail } = require('../utils/emailTemplates');

// POST /api/orders — create order + Stripe PaymentIntent
const createOrder = async (req, res) => {
  try {
    const { serviceType, description, specifications, quantity, dimensions, deadline, depositAmount, totalAmount, currency } = req.body;
    if (!serviceType || !description)
      return res.status(400).json({ message: 'Service type and description are required' });

    const files = req.files ? req.files.map(f => ({ url: f.path, publicId: f.filename, originalName: f.originalname })) : [];

    const order = await JobOrder.create({
      customer: req.user._id,
      serviceType, description, specifications, quantity, dimensions,
      deadline: deadline ? new Date(deadline) : undefined,
      files,
      depositAmount: depositAmount || 0,
      totalAmount: totalAmount || 0,
      currency: currency || 'usd',
      timeline: [{ status: 'pending', note: 'Order received' }],
    });

    let clientSecret = null;
    if (depositAmount && depositAmount > 0) {
      const amountInCents = Math.round(depositAmount * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency || 'usd',
        metadata: { orderId: order._id.toString(), customerId: req.user._id.toString() },
      });
      order.stripePaymentIntentId = paymentIntent.id;
      await order.save();
      clientSecret = paymentIntent.client_secret;
    }

    // Send confirmation email
    try {
      await sendMail({
        to: req.user.email,
        subject: 'Order Received – Rokit Media',
        html: orderConfirmationEmail(order, req.user),
      });
    } catch { /* non-blocking */ }

    res.status(201).json({ order, clientSecret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/mine
const getMyOrders = async (req, res) => {
  try {
    const orders = await JobOrder.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await JobOrder.findById(req.params.id).populate('customer', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Forbidden' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
