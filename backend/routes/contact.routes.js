// backend/routes/contact.routes.js
const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// POST /api/contact — Send a message (ALLOWS GUESTS)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Create contact message without authentication
    // We'll store guest info in a separate way
    const contact = await Contact.create({
      guestName: name,
      guestEmail: email,
      subject: subject.trim(),
      message: message.trim(),
      isGuest: true  // Add this field to distinguish guest messages
    });

    res.status(201).json({
      message: 'Message sent successfully',
      contact
    });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;