const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Password = require('../models/Password');
const User = require('../models/User');
const auth = require('../middleware/auth');
const CryptoJS = require('crypto-js');
const XLSX = require('xlsx');

// Encrypt password
const encrypt = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

// Decrypt password
const decrypt = (encryptedText, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Get all passwords
router.get('/', auth, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.userId })
      .sort({ favorite: -1, updatedAt: -1 });
    
    const user = await User.findById(req.userId);
    const decryptedPasswords = passwords.map(pwd => {
      const pwdObj = pwd.toObject();
      try {
        pwdObj.decryptedPassword = decrypt(pwd.encryptedPassword, user.encryptionKey);
      } catch (error) {
        pwdObj.decryptedPassword = '***';
      }
      return pwdObj;
    });
    
    res.json(decryptedPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new password
router.post('/', [
  auth,
  body('title').notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.userId);
    const encryptedPassword = encrypt(req.body.password, user.encryptionKey);
    
    const password = new Password({
      userId: req.userId,
      title: req.body.title,
      username: req.body.username,
      email: req.body.email,
      encryptedPassword,
      website: req.body.website,
      category: req.body.category,
      notes: req.body.notes,
      favicon: req.body.website ? `https://www.google.com/s2/favicons?domain=${req.body.website}` : null,
      strength: req.body.strength,
      tags: req.body.tags || [],
      favorite: req.body.favorite || false
    });

    await password.save();
    res.status(201).json(password);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const updateData = { ...req.body };
    
    if (req.body.password) {
      updateData.encryptedPassword = encrypt(req.body.password, user.encryptionKey);
      delete updateData.password;
    }

    const password = await Password.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json(password);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete password
router.delete('/:id', auth, async (req, res) => {
  try {
    const password = await Password.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Export to Excel
router.get('/export/excel', auth, async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.userId });
    const user = await User.findById(req.userId);

    const exportData = passwords.map(pwd => ({
      Title: pwd.title,
      Username: pwd.username || '',
      Email: pwd.email || '',
      Password: decrypt(pwd.encryptedPassword, user.encryptionKey),
      Website: pwd.website || '',
      Category: pwd.category,
      Notes: pwd.notes || '',
      Favorite: pwd.favorite ? 'Yes' : 'No',
      Tags: pwd.tags.join(', '),
      Created: new Date(pwd.createdAt).toLocaleDateString()
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Passwords');
    
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', 'attachment; filename=passwords.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Export failed' });
  }
});

// Import from Excel
router.post('/import/excel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const passwords = [];

    // Parse Excel file (assuming file is sent as buffer)
    const wb = XLSX.read(req.files.file.data, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);

    for (const row of data) {
      const encryptedPassword = encrypt(row.Password, user.encryptionKey);
      
      const password = new Password({
        userId: req.userId,
        title: row.Title,
        username: row.Username,
        email: row.Email,
        encryptedPassword,
        website: row.Website,
        category: row.Category || 'Other',
        notes: row.Notes,
        tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
        favorite: row.Favorite === 'Yes'
      });

      await password.save();
      passwords.push(password);
    }

    res.status(201).json({ 
      message: 'Import successful', 
      count: passwords.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Import failed' });
  }
});

// Generate strong password
router.get('/generate', auth, (req, res) => {
  const length = parseInt(req.query.length) || 16;
  const includeNumbers = req.query.numbers !== 'false';
  const includeSymbols = req.query.symbols !== 'false';
  const includeUppercase = req.query.uppercase !== 'false';
  const includeLowercase = req.query.lowercase !== 'false';

  let chars = '';
  if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) chars += '0123456789';
  if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  res.json({ password });
});

module.exports = router;