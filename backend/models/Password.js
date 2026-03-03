const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  username: String,
  email: String,
  encryptedPassword: {
    type: String,
    required: true
  },
  website: String,
  category: {
    type: String,
    enum: ['Social', 'Work', 'Personal', 'Finance', 'Other'],
    default: 'Other'
  },
  notes: String,
  favicon: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: Date,
  strength: {
    type: String,
    enum: ['Weak', 'Medium', 'Strong'],
    default: 'Medium'
  },
  tags: [String],
  favorite: {
    type: Boolean,
    default: false
  }
});

passwordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Password', passwordSchema);