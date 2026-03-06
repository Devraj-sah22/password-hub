const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -encryptionKey');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    ).select('-password -encryptionKey');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Enable 2FA
router.post('/2fa/enable', auth, async (req, res) => {
  try {

    const secret = speakeasy.generateSecret({
      length: 20,
      name: "PasswordHub"
    });

    const user = await User.findById(req.userId);

    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = false;

    await user.save();

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      qr,
      secret: secret.base32
    });

  } catch (error) {
    res.status(500).json({ message: "2FA setup failed" });
  }
});

// Verify 2FA
router.post('/2fa/verify', auth, async (req, res) => {
  try {

    const { token } = req.body;

    const user = await User.findById(req.userId);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: "2FA enabled successfully" });

  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});
// Disable 2FA
router.post('/2fa/disable', auth, async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;

    await user.save();

    res.json({ message: "2FA disabled successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to disable 2FA" });
  }
});

module.exports = router;