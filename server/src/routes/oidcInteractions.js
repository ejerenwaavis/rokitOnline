const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../config/email');
const { mfaOtpEmail } = require('../utils/emailTemplates');

function createInteractionsRouter(provider) {
  const router = express.Router();

  // Helper to render branded Rokit Media OIDC page
  function renderOidcPage({ uid, clientName = 'Yanga Studio', error = null, step = 'login', email = '' }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In – Rokit Media Single Sign-On</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0a;
      color: #ededed;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      width: 100%;
      max-width: 420px;
      background: #141414;
      border: 1px solid #262626;
      border-radius: 16px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.5rem;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      background: #f59e0b;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: #0a0a0a;
      font-size: 20px;
    }
    .logo-text {
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 0.875rem;
      color: #a3a3a3;
      margin-bottom: 1.5rem;
      line-height: 1.4;
    }
    .badge {
      display: inline-block;
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 6px;
      padding: 2px 8px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .error-box {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #a3a3a3;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      background: #0a0a0a;
      border: 1px solid #333333;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #ffffff;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #f59e0b;
    }
    .btn {
      width: 100%;
      background: #f59e0b;
      color: #0a0a0a;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }
    .btn:hover {
      background: #fbbf24;
    }
    .btn:active {
      transform: scale(0.99);
    }
    .footer-note {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.75rem;
      color: #737373;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <div class="logo-icon">⚡</div>
      <div class="logo-text">Rokit Media</div>
    </div>
    <div class="badge">OpenID Connect SSO</div>

    ${step === 'login' ? `
      <h1 class="title">Sign in to Rokit</h1>
      <p class="subtitle">Continue with your Rokit Media account to access <strong>${clientName}</strong>.</p>

      ${error ? `<div class="error-box">${error}</div>` : ''}

      <form method="POST" action="/interaction/${uid}/login">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" value="${email}" required autocomplete="email" autofocus>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn">Sign In &amp; Continue</button>
      </form>
    ` : `
      <h1 class="title">Check your email</h1>
      <p class="subtitle">We sent a 6-digit login verification code to <strong>${email}</strong>.</p>

      ${error ? `<div class="error-box">${error}</div>` : ''}

      <form method="POST" action="/interaction/${uid}/verify-mfa">
        <input type="hidden" name="email" value="${email}">
        <div class="form-group">
          <label for="code">6-Digit Code</label>
          <input type="text" id="code" name="code" pattern="[0-9]{6}" maxlength="6" placeholder="123456" required autocomplete="one-time-code" autofocus style="text-align:center; font-size: 1.5rem; letter-spacing: 4px;">
        </div>
        <button type="submit" class="btn">Verify &amp; Continue</button>
      </form>
    `}

    <div class="footer-note">
      Protected by Rokit Media Security &middot; OAuth 2.0 / OIDC with PKCE
    </div>
  </div>
</body>
</html>`;
  }

  // GET /interaction/:uid
  router.get('/:uid', async (req, res, next) => {
    try {
      const interaction = await provider.interactionDetails(req, res);
      const { prompt, params } = interaction;
      const client = await provider.Client.find(params.client_id);
      const clientName = client?.client_name || params.client_id || 'Yanga Studio';

      // 1. If consent prompt on first-party client, auto-grant and skip
      if (prompt.name === 'consent') {
        const grant = new provider.Grant({
          accountId: interaction.session.accountId,
          clientId: params.client_id,
        });
        grant.addOIDCScope('openid email profile');
        const grantId = await grant.save();
        return await provider.interactionFinished(req, res, { consent: { grantId } });
      }

      // 2. Check if user already has an active Rokit cookie session
      const token = req.cookies?.rokit_sso_token || req.headers['authorization']?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.id && !decoded.mfaPending) {
            const user = await User.findById(decoded.id);
            if (user && user.status !== 'suspended') {
              const grant = new provider.Grant({
                accountId: user._id.toString(),
                clientId: params.client_id,
              });
              grant.addOIDCScope('openid email profile');
              const grantId = await grant.save();
              return await provider.interactionFinished(req, res, {
                login: { accountId: user._id.toString() },
                consent: { grantId },
              });
            }
          }
        } catch {}
      }

      // 3. Render login page
      return res.send(renderOidcPage({ uid: req.params.uid, clientName, step: 'login' }));
    } catch (err) {
      return next(err);
    }
  });

  // POST /interaction/:uid/login
  router.post('/:uid/login', async (req, res, next) => {
    try {
      const interaction = await provider.interactionDetails(req, res);
      const { email, password } = req.body;
      const isJson = req.is('json') || req.headers['accept']?.includes('application/json');

      if (!email || !password) {
        if (isJson) return res.status(400).json({ error: 'Email and password required' });
        return res.status(400).send(renderOidcPage({ uid: req.params.uid, error: 'Email and password are required', step: 'login', email }));
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !(await user.matchPassword(password))) {
        if (isJson) return res.status(401).json({ error: 'Invalid credentials' });
        return res.status(401).send(renderOidcPage({ uid: req.params.uid, error: 'Invalid email or password.', step: 'login', email }));
      }

      // Requirement 7: Suspended user check
      if (user.status === 'suspended') {
        if (isJson) return res.status(403).json({ error: 'Account is suspended' });
        return res.status(403).send(renderOidcPage({ uid: req.params.uid, error: 'Your Rokit account is suspended. Access is blocked.', step: 'login', email }));
      }

      // In test mode or when BYPASS_MFA=true, complete directly
      if (process.env.NODE_ENV === 'test' || process.env.BYPASS_OIDC_MFA === 'true') {
        const grant = new provider.Grant({
          accountId: user._id.toString(),
          clientId: interaction.params.client_id,
        });
        grant.addOIDCScope('openid email profile');
        const grantId = await grant.save();
        return await provider.interactionFinished(req, res, {
          login: { accountId: user._id.toString() },
          consent: { grantId },
        });
      }

      // Trigger MFA OTP
      const otp = String(crypto.randomInt(100000, 999999));
      user.mfaOtpHash = crypto.createHash('sha256').update(otp).digest('hex');
      user.mfaOtpExpires = Date.now() + 10 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      await sendMail({
        to: user.email,
        subject: 'Your Rokit Media login code',
        html: mfaOtpEmail(user, otp),
      });

      if (isJson) {
        return res.json({ mfaPending: true, email: user.email });
      }

      return res.send(renderOidcPage({ uid: req.params.uid, step: 'mfa', email: user.email }));
    } catch (err) {
      return next(err);
    }
  });

  // POST /interaction/:uid/verify-mfa
  router.post('/:uid/verify-mfa', async (req, res, next) => {
    try {
      const interaction = await provider.interactionDetails(req, res);
      const { email, code } = req.body;
      const isJson = req.is('json') || req.headers['accept']?.includes('application/json');

      if (!email || !code) {
        if (isJson) return res.status(400).json({ error: 'Email and code required' });
        return res.status(400).send(renderOidcPage({ uid: req.params.uid, error: 'Code is required', step: 'mfa', email }));
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        if (isJson) return res.status(401).json({ error: 'User not found' });
        return res.status(401).send(renderOidcPage({ uid: req.params.uid, error: 'User not found', step: 'login' }));
      }

      if (user.status === 'suspended') {
        if (isJson) return res.status(403).json({ error: 'Account is suspended' });
        return res.status(403).send(renderOidcPage({ uid: req.params.uid, error: 'Account is suspended.', step: 'login' }));
      }

      if (!user.mfaOtpHash || !user.mfaOtpExpires || user.mfaOtpExpires < Date.now()) {
        if (isJson) return res.status(401).json({ error: 'Code has expired' });
        return res.status(401).send(renderOidcPage({ uid: req.params.uid, error: 'Code has expired. Please try again.', step: 'login', email }));
      }

      const hash = crypto.createHash('sha256').update(String(code).trim()).digest('hex');
      if (hash !== user.mfaOtpHash) {
        if (isJson) return res.status(401).json({ error: 'Incorrect code' });
        return res.status(401).send(renderOidcPage({ uid: req.params.uid, error: 'Incorrect code. Please try again.', step: 'mfa', email }));
      }

      // Clear OTP
      user.mfaOtpHash = undefined;
      user.mfaOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });

      // Grant & complete
      const grant = new provider.Grant({
        accountId: user._id.toString(),
        clientId: interaction.params.client_id,
      });
      grant.addOIDCScope('openid email profile');
      const grantId = await grant.save();

      return await provider.interactionFinished(req, res, {
        login: { accountId: user._id.toString() },
        consent: { grantId },
      });
    } catch (err) {
      return next(err);
    }
  });

  // POST /interaction/:uid/abort
  router.post('/:uid/abort', async (req, res, next) => {
    try {
      return await provider.interactionFinished(req, res, {
        error: 'access_denied',
        error_description: 'End-user aborted the interaction',
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
}

module.exports = { createInteractionsRouter };
