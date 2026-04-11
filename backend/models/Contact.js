// backend/models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'replied', 'closed'], default: 'pending' },
  adminReply: {
    body: { type: String },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    repliedAt: { type: Date },
    isRead: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);