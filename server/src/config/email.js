const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: Number(process.env.EMAIL_PORT) === 465 || true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  const fromName = process.env.EMAIL_FROM || process.env.EMAIL_FROM_NAME || 'Rokit Media';
  const fromAddr = process.env.EMAIL_USER;
  return transporter.sendMail({
    from: `"${fromName}" <${fromAddr}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendMail };
