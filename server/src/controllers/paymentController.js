const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const JobOrder = require('../models/JobOrder');

// POST /api/payment/webhook
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const orderId = intent.metadata.orderId;
    if (orderId) {
      await JobOrder.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        $push: { timeline: { status: 'confirmed', note: 'Payment received via Stripe' } },
        status: 'confirmed',
      });
    }
  }

  res.json({ received: true });
};

module.exports = { stripeWebhook };
