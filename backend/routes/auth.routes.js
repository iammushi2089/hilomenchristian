// backend/routes/auth.routes.js 
const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware'); 
const upload = require('../middleware/upload'); 
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── REGISTRATION ── 
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, username, dob, gender, accountType, experience, sports, securityQuestion, securityAnswer } = req.body;
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'Email already exists' });
        
        const user = await User.create({ 
            name, email, password, username, dob: new Date(dob), gender, accountType, experience, 
            sports: Array.isArray(sports) ? sports : [], securityQuestion, securityAnswer
        });
        
        res.status(200).json({ token: generateToken(user._id), user });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── LOGIN ── 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({ token: generateToken(user._id), user });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── GET ME ── 
router.get('/me', protect, async (req, res) => { 
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── UPDATE PROFILE (FIXED) ── 
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => { 
    try { 
        const user = await User.findById(req.user._id); 
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.name) user.name = req.body.name; 
        if (req.body.bio !== undefined) user.bio = req.body.bio; 
        if (req.file) user.profilePic = req.file.filename;
        if (req.body.username) user.username = req.body.username;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.accountType) user.accountType = req.body.accountType;
        if (req.body.experience) user.experience = req.body.experience;
        
        // Handling the sports string-to-array conversion
        if (req.body.sports) {
            user.sports = Array.isArray(req.body.sports) 
                ? req.body.sports 
                : req.body.sports.split(',').map(s => s.trim());
        }
        
        await user.save();
        const updated = await User.findById(user._id).select('-password'); 
        res.json(updated);
    } catch (err) { 
        res.status(500).json({ message: 'Update failed: ' + err.message }); 
    }
});

module.exports = router;