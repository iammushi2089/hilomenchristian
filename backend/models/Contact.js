// backend/models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allows guests to send messages
  },
  guestName: { type: String, required: false },
  guestEmail: { type: String, required: false },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'replied'],
    default: 'pending'
  },
  adminReply: {
    body: String,
    // ✅ FIX: This is the missing piece that caused the Admin crash!
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    repliedAt: Date,
    isRead: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);