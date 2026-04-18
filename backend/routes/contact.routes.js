// backend/routes/contact.routes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// ── POST /api/contact ──
// NOTE: We REMOVED 'protect' from here so guests can use it!
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        const newContact = new Contact({
            // If user is logged in, we can save their ID, otherwise it's null (Guest)
            sender: req.user ? req.user._id : null, 
            guestName: name,
            guestEmail: email,
            subject,
            message,
            status: 'pending'
        });

        await newContact.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Contact Error:', err.message);
        res.status(500).json({ message: 'Error sending message.' });
    }
});

module.exports = router;