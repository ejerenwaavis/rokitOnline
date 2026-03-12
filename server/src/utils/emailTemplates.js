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

const newOrderNotificationEmail = (order, customer) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
  .header { background: #1a1a1a; padding: 20px; text-align: center; }
  .header h1 { color: #FF9729; margin: 0; font-size: 20px; }
  .content { padding: 24px 20px; }
  .badge { display: inline-block; background: #FF9729; color: #fff; border-radius: 4px; padding: 3px 10px; font-size: 13px; }
  .footer { background: #222; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
  .btn { display: inline-block; background: #FF9729; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
  td { padding: 8px; border-bottom: 1px solid #eee; }
</style></head>
<body>
  <div class="header"><h1>🔔 New Job Order Received</h1></div>
  <div class="content">
    <p>A new job order has been submitted and requires review.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="font-weight:bold;">Order ID</td><td>#${order._id}</td></tr>
      <tr><td style="font-weight:bold;">Customer</td><td>${customer.name} (${customer.email})</td></tr>
      <tr><td style="font-weight:bold;">Phone</td><td>${customer.phone || 'N/A'}</td></tr>
      <tr><td style="font-weight:bold;">Service</td><td>${order.serviceType}</td></tr>
      <tr><td style="font-weight:bold;">Description</td><td>${order.description}</td></tr>
      <tr><td style="font-weight:bold;">Customer Budget</td><td>${order.customerBudget ? '\u20a6' + Number(order.customerBudget).toLocaleString() : 'Not specified'}</td></tr>
      <tr><td style="font-weight:bold;">Deadline</td><td>${order.deadline ? new Date(order.deadline).toLocaleDateString() : 'Not specified'}</td></tr>
    </table>
    <a href="${process.env.CLIENT_URL}/admin/orders" class="btn">View in Admin Panel</a>
  </div>
  <div class="footer">Rokit Media Internal Notification</div>
</body>
</html>`;

const orderStatusUpdateEmail = (order, customer) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
  .header { background: #FF9729; padding: 30px 20px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 22px; }
  .content { padding: 24px 20px; }
  .status { display: inline-block; background: #edecdf; border-radius: 4px; padding: 4px 12px; font-size: 14px; font-weight: bold; text-transform: capitalize; }
  .footer { background: #222; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
  .btn { display: inline-block; background: #FF9729; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
</style></head>
<body>
  <div class="header"><h1>Order Update – Rokit Media</h1></div>
  <div class="content">
    <p>Hi <strong>${customer.name}</strong>,</p>
    <p>Your order status has been updated:</p>
    <p><span class="status">${order.status}</span></p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Order ID</td><td style="padding:8px;border-bottom:1px solid #eee;">#${order._id}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.serviceType}</td></tr>
      ${order.adminNotes ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Note from team</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.adminNotes}</td></tr>` : ''}
    </table>
    <a href="${process.env.CLIENT_URL}/portal/orders/${order._id}" class="btn">View Order</a>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Rokit Media · 4 Gbogan-Ibadan Road, Osogbo, Osun State</div>
</body>
</html>`;

const pricedQuoteEmail = (order, customer) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
  .header { background: #FF9729; padding: 30px 20px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 22px; }
  .content { padding: 24px 20px; }
  .price { font-size: 28px; font-weight: bold; color: #FF9729; margin: 12px 0; }
  .footer { background: #222; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
  .btn { display: inline-block; background: #FF9729; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
</style></head>
<body>
  <div class="header"><h1>Price Quote Ready – Rokit Media</h1></div>
  <div class="content">
    <p>Hi <strong>${customer.name}</strong>,</p>
    <p>Our team has reviewed your order and provided a price quote:</p>
    <p class="price">₦${Number(order.quotedPrice).toLocaleString()}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Order</td><td style="padding:8px;border-bottom:1px solid #eee;">#${order._id}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.serviceType}</td></tr>
      ${order.adminNotes ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Notes</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.adminNotes}</td></tr>` : ''}
    </table>
    <p>Please log in to your dashboard to <strong>accept or discuss</strong> this price.</p>
    <a href="${process.env.CLIENT_URL}/portal/orders/${order._id}" class="btn">View &amp; Accept Quote</a>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Rokit Media · 4 Gbogan-Ibadan Road, Osogbo, Osun State</div>
</body>
</html>`;

const offerAcceptedCustomerEmail = (order, customer) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
  .header { background: #16a34a; padding: 30px 20px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 22px; }
  .content { padding: 24px 20px; }
  .price { font-size: 28px; font-weight: bold; color: #16a34a; margin: 12px 0; }
  .footer { background: #222; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
  .btn { display: inline-block; background: #FF9729; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
</style></head>
<body>
  <div class="header"><h1>🎉 Your Counter-Offer Was Accepted!</h1></div>
  <div class="content">
    <p>Hi <strong>${customer.name}</strong>,</p>
    <p>Great news — our team has agreed to your counter-offer. Your order is now confirmed at:</p>
    <p class="price">₦${Number(order.totalAmount).toLocaleString()}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Order ID</td><td style="padding:8px;border-bottom:1px solid #eee;">#${order._id}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.serviceType}</td></tr>
    </table>
    <p>Our team will be in touch shortly to begin work on your project.</p>
    <a href="${process.env.CLIENT_URL}/portal/orders/${order._id}" class="btn">View Order</a>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Rokit Media · 4 Gbogan-Ibadan Road, Osogbo, Osun State</div>
</body>
</html>`;

const orderConfirmedStaffEmail = (order, customer, finalPrice) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;padding:20px;">
  <h2 style="color:#16a34a;">✅ Order Confirmed – Price Agreed</h2>
  <p>A price has been agreed for the following order:</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Order ID</td><td style="padding:8px;border-bottom:1px solid #eee;">#${order._id}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Customer</td><td style="padding:8px;border-bottom:1px solid #eee;">${customer.name} (${customer.email})</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${order.serviceType}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Agreed Price</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:18px;font-weight:bold;color:#16a34a;">₦${Number(finalPrice).toLocaleString()}</td></tr>
  </table>
  <a href="${process.env.CLIENT_URL}/admin/orders" style="display:inline-block;background:#FF9729;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;">View in Admin Panel</a>
  <p style="color:#aaa;font-size:12px;margin-top:24px;">Rokit Media Internal Notification</p>
</body>
</html>`;

module.exports = { orderConfirmationEmail, contactReplyEmail, newContactNotificationEmail, newOrderNotificationEmail, orderStatusUpdateEmail, pricedQuoteEmail, offerAcceptedCustomerEmail, orderConfirmedStaffEmail, resetPasswordEmail };

const resetPasswordEmail = (user, resetUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
  .header { background: #FF9729; padding: 30px 20px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 24px; }
  .content { padding: 30px 20px; }
  .footer { background: #222; color: #aaa; text-align: center; padding: 20px; font-size: 12px; }
  .btn { display: inline-block; background: #FF9729; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; margin-top: 16px; font-weight: bold; }
</style></head>
<body>
  <div class="header"><h1>Reset Your Password</h1></div>
  <div class="content">
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>We received a request to reset your password for your Rokit Media account.</p>
    <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p style="margin-top:24px;color:#888;font-size:13px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
    <p style="color:#888;font-size:13px;">Or copy this link into your browser:<br><a href="${resetUrl}" style="color:#FF9729;">${resetUrl}</a></p>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Rokit Media · 4 Gbogan-Ibadan Road, Osogbo, Osun State</div>
</body>
</html>`;
