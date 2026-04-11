// backend/routes/contact.routes.js
const express = require('express');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/contact — Send a message to admin
router.post('/', protect, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    // Prevent admins from contacting themselves
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot send contact messages' });
    }

    const contact = await Contact.create({
      sender: req.user._id,
      subject: subject.trim(),
      message: message.trim()
    });

    await contact.populate('sender', 'name email');

    res.status(201).json({
      message: 'Message sent successfully',
      contact
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;