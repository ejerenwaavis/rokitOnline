const ContactMessage = require('../models/ContactMessage');
const { sendMail } = require('../config/email');
const { contactReplyEmail, newContactNotificationEmail } = require('../utils/emailTemplates');

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ message: 'Name, email, subject and message are required' });

    const msg = await ContactMessage.create({ name, email, phone, subject, message });

    // Auto-reply to sender
    try {
      await sendMail({ to: email, subject: `We got your message – Rokit Media`, html: contactReplyEmail(msg) });
    } catch { /* non-blocking */ }

    // Notify admin
    try {
      await sendMail({ to: process.env.EMAIL_USER, subject: `New contact from ${name}`, html: newContactNotificationEmail(msg) });
    } catch { /* non-blocking */ }

    res.status(201).json({ message: 'Your message has been sent!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitContact };
