const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const transporter = require('../config/email');

// Local login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If account created via OAuth
    if (!user.password) {
      return res.status(400).json({
        message: "Please login using Google/Microsoft/GitHub"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // If user has 2FA enabled
    if (user.twoFactorEnabled) {
      return res.json({
        twoFactorRequired: true,
        userId: user._id
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Recover 2FA via email
router.post('/recover-2fa', async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '10m' }
    );

    const recoveryLink = `http://localhost:3000/reset-2fa/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "2FA Recovery Request",
      html: `
        <h2>Password Manager</h2>
        <p>You requested to recover your 2FA access.</p>
        <p>Click the link below to reset your 2FA.</p>
        <a href="${recoveryLink}">${recoveryLink}</a>
        <p>This link expires in 10 minutes.</p>
      `
    });

    res.json({ message: "Recovery email sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Recovery failed" });
  }
});

// Local register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const encryptionKey = crypto.randomBytes(32).toString('hex');
    const user = new User({
      email,
      password,
      name,
      encryptionKey
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);

// Microsoft OAuth routes
router.get('/microsoft', passport.authenticate('microsoft'));

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:3000/?token=${token}`);
  }
);
// Verify 2FA during login
router.post('/login/2fa', async (req, res) => {

  const { userId, token } = req.body;
  if (!userId || !token) {
    return res.status(400).json({ message: "UserId and token required" });
  }

  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA not configured properly" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid code" });
    }
    user.lastLogin = Date.now();
    await user.save();

    const authToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: "7d" }
    );

    res.json({
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(500).json({ message: "2FA login failed" });
  }

});
// Reset 2FA using recovery link
router.post('/reset-2fa/:token', async (req, res) => {

  try {

    const decoded = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET || 'your-jwt-secret'
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;

    await user.save();

    res.json({ message: "2FA reset successfully" });

  } catch (error) {

    res.status(400).json({
      message: "Invalid or expired recovery link"
    });

  }

});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;