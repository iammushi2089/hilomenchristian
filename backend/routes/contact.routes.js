// backend/routes/contact.routes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const jwt = require('jsonwebtoken'); // ✅ We need this to decode the token

// ── POST /api/contact ──
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        // ✅ Check for optional authentication token
        let senderId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                senderId = decoded.id; // Extract the user ID from the valid token
            } catch (tokenError) {
                // If token is expired or invalid, we just ignore it and treat them as a guest
                console.log("Invalid token on contact form, proceeding as guest.");
            }
        }

        const newContact = new Contact({
            sender: senderId, // ✅ Will be an ID if logged in, null if guest
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