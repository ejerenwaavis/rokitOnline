const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendMail } = require('../config/email');
const { resetPasswordEmail, mfaOtpEmail } = require('../utils/emailTemplates');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    // MFA: admin accounts require a one-time email code
    if (user.role === 'admin') {
      const otp = String(crypto.randomInt(100000, 999999));
      user.mfaOtpHash = crypto.createHash('sha256').update(otp).digest('hex');
      user.mfaOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save({ validateBeforeSave: false });

      await sendMail({
        to: user.email,
        subject: 'Your Rokit Media admin login code',
        html: mfaOtpEmail(user, otp),
      });

      // Issue a short-lived "pending" token (10 min) — cannot be used for API access
      const mfaToken = jwt.sign(
        { id: user._id, mfaPending: true },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );

      return res.json({ mfaPending: true, mfaToken });
    }

    // Non-admin: issue full token immediately
    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/verify-mfa
const verifyMfa = async (req, res) => {
  try {
    const { mfaToken, code } = req.body;
    if (!mfaToken || !code)
      return res.status(400).json({ message: 'Token and code are required' });

    let decoded;
    try {
      decoded = jwt.verify(mfaToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    if (!decoded.mfaPending)
      return res.status(401).json({ message: 'Invalid token type.' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });

    if (!user.mfaOtpHash || !user.mfaOtpExpires || user.mfaOtpExpires < Date.now())
      return res.status(401).json({ message: 'Code has expired. Please log in again.' });

    const hash = crypto.createHash('sha256').update(String(code).trim()).digest('hex');
    if (hash !== user.mfaOtpHash)
      return res.status(401).json({ message: 'Incorrect code. Please try again.' });

    // Clear OTP fields
    user.mfaOtpHash = undefined;
    user.mfaOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, phone: req.user.phone });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond 200 so we don't reveal whether an account exists
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your Rokit Media password',
      html: resetPasswordEmail(user, resetUrl),
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, verifyMfa, getMe, forgotPassword, resetPassword };
