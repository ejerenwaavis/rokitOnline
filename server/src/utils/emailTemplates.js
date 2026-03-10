const orderConfirmationEmail = (order, user) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
  .header { background: #FF9729; padding: 30px 20px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 24px; }
  .content { padding: 30px 20px; }
  .badge { display: inline-block; background: #edecdf; border-radius: 4px; padding: 4px 10px; font-size: 13px; }
  .footer { background: #222; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
  .btn { display: inline-block; background: #FF9729; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
</style></head>
<body>
  <div class="header"><h1>Order Confirmed – rOKIt Media</h1></div>
  <div class="content">
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Your job order has been received and is now pending review by our team.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Order ID</td><td style="padding:8px;border-bottom:1px solid #eee;">${order._id}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.serviceType}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Status</td><td style="padding:8px;border-bottom:1px solid #eee;"><span class="badge">${order.status}</span></td></tr>
    </table>
    <p>We will review your order and contact you within 24 hours.</p>
    <a href="${process.env.CLIENT_URL}/portal" class="btn">View Dashboard</a>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Rokit Media · 4 Gbogan-Ibadan Road, Osogbo, Osun State</div>
</body>
</html>`;

const contactReplyEmail = (msg) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; }
  .header { background: #FF9729; padding: 30px 20px; text-align: center; }
  .header h1 { color: #fff; margin: 0; }
  .content { padding: 30px 20px; }
  .footer { background: #222; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
</style></head>
<body>
  <div class="header"><h1>Thank You – rOKIt Media</h1></div>
  <div class="content">
    <p>Hi <strong>${msg.name}</strong>,</p>
    <p>Thank you for reaching out to Rokit Media. We have received your message and will respond within 24 hours.</p>
    <blockquote style="border-left:4px solid #FF9729;margin:16px 0;padding:10px 16px;background:#fff8f0;">${msg.message}</blockquote>
    <p>If you need immediate assistance, call us on <strong>0706 903 5095</strong>.</p>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Rokit Media · rokitnow@gmail.com</div>
</body>
</html>`;

const newContactNotificationEmail = (msg) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;padding:20px;">
  <h2 style="color:#FF9729;">New Contact Message</h2>
  <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
  <p><strong>Phone:</strong> ${msg.phone || 'N/A'}</p>
  <p><strong>Subject:</strong> ${msg.subject}</p>
  <p><strong>Message:</strong></p>
  <blockquote style="border-left:4px solid #FF9729;padding:10px 16px;background:#f9f9f9;">${msg.message}</blockquote>
</body>
</html>`;

module.exports = { orderConfirmationEmail, contactReplyEmail, newContactNotificationEmail };
