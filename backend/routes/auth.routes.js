// backend/routes/auth.routes.js 
const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware'); 
const upload = require('../middleware/upload'); 
const router = express.Router();

// Helper function — generates a JWT token that expires in 7 days 
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ─────────────────────────────────── 
router.post('/register', async (req, res) => {
    try {
        console.log('Register endpoint hit');
        console.log('Request body:', req.body);
        
        const { 
            name, 
            email, 
            password, 
            username, 
            dob, 
            gender, 
            accountType, 
            experience, 
            sports,
            securityQuestion,
            securityAnswer
        } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields (name, email, password)' 
            });
        }
        
        if (!username) {
            return res.status(400).json({ 
                message: 'Username is required' 
            });
        }
        
        if (!dob) {
            return res.status(400).json({ 
                message: 'Date of birth is required' 
            });
        }
        
        if (!gender) {
            return res.status(400).json({ 
                message: 'Gender is required' 
            });
        }
        
        if (!accountType) {
            return res.status(400).json({ 
                message: 'Account type is required' 
            });
        }
        
        if (!experience) {
            return res.status(400).json({ 
                message: 'Experience level is required' 
            });
        }
        
        // Validate security question
        if (!securityQuestion) {
            return res.status(400).json({ 
                message: 'Security question is required for password recovery' 
            });
        }
        
        if (!securityAnswer || securityAnswer.length < 2) {
            return res.status(400).json({ 
                message: 'Security answer is required (minimum 2 characters)' 
            });
        }
        
        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ 
                message: 'Email is already registered' 
            });
        }
        
        // Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ 
                message: 'Username is already taken' 
            });
        }
        
        // Create user with all fields
        const user = await User.create({ 
            name, 
            email, 
            password,
            username,
            dob: new Date(dob),
            gender,
            accountType,
            experience,
            sports: sports || [],
            securityQuestion,
            securityAnswer
        });
        
        res.status(200).json({ 
            token: generateToken(user._id), 
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                username: user.username,
                role: user.role,
                profilePic: user.profilePic,
                dob: user.dob,
                gender: user.gender,
                accountType: user.accountType,
                experience: user.experience,
                sports: user.sports
            } 
        });
    } catch (err) { 
        console.error('Register error:', err);
        res.status(500).json({ message: err.message }); 
    }
});

// ── POST /api/auth/login ────────────────────────────────────── 
router.post('/login', async (req, res) => {
    try {
        console.log('Login endpoint hit');
        console.log('Request body:', req.body);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password' 
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        if (user.status === 'inactive') {
            return res.status(403).json({ 
                message: 'Your account is deactivated. Please contact the admin.' 
            });
        }
        
        const match = await user.matchPassword(password);
        if (!match) {
            return res.status(400).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        res.json({ 
            token: generateToken(user._id), 
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                username: user.username,
                role: user.role, 
                profilePic: user.profilePic,
                dob: user.dob,
                gender: user.gender,
                accountType: user.accountType,
                experience: user.experience,
                sports: user.sports
            } 
        });
    } catch (err) { 
        console.error('Login error:', err);
        res.status(500).json({ 
            message: err.message 
        }); 
    }
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => { 
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── PUT /api/auth/profile ─────────────────────────────────────
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => { 
    try { 
        const user = await User.findById(req.user._id); 
        
        if (req.body.name) user.name = req.body.name; 
        if (req.body.bio) user.bio = req.body.bio; 
        if (req.file) user.profilePic = req.file.filename;
        
        if (req.body.username) user.username = req.body.username;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.accountType) user.accountType = req.body.accountType;
        if (req.body.experience) user.experience = req.body.experience;
        if (req.body.sports) user.sports = req.body.sports;
        
        await user.save();
        
        const updated = await User.findById(user._id).select('-password'); 
        res.json(updated);
    } catch (err) { 
        console.error('Profile update error:', err);
        res.status(500).json({ 
            message: err.message 
        }); 
    }
});

// ── PUT /api/auth/change-password ──────────────────────────── 
router.put('/change-password', protect, async (req, res) => { 
    try {
        const { currentPassword, newPassword } = req.body; 
        const user = await User.findById(req.user._id); 
        
        const match = await user.matchPassword(currentPassword);
        if (!match) {
            return res.status(400).json({ 
                message: 'Current password is incorrect' 
            });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.json({ 
            message: 'Password updated successfully' 
        });
    } catch (err) { 
        res.status(500).json({ 
            message: err.message 
        }); 
    }
});

// ── POST /api/auth/forgot-password ────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If an account exists, you will be prompted with your security question.' });
    }
    
    // Check if user has security question set
    if (!user.securityQuestion) {
      return res.status(400).json({ 
        message: 'No security question set. Please contact an admin to reset your password.' 
      });
    }
    
    // Generate a temporary reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );
    
    // Save token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 900000;
    await user.save();
    
    // Return the security question
    res.status(200).json({ 
      message: 'Please answer your security question to reset your password.',
      requiresSecurityQuestion: true,
      resetToken: resetToken,
      securityQuestion: user.securityQuestion
    });
    
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/verify-security ────────────────────────────
router.post('/verify-security', async (req, res) => {
  try {
    const { resetToken, securityAnswer } = req.body;
    
    if (!resetToken || !securityAnswer) {
      return res.status(400).json({ message: 'Please provide token and answer' });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Verify security answer
    const isMatch = await user.matchSecurityAnswer(securityAnswer);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect answer to security question' });
    }
    
    // Generate new token for password reset (valid for 5 minutes)
    const passwordResetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );
    
    res.json({
      message: 'Security answer verified. You can now reset your password.',
      passwordResetToken: passwordResetToken
    });
    
  } catch (err) {
    console.error('Verify security error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/reset-password ─────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    
    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    console.log(`Password reset successfully for user: ${user.email}`);
    
    res.json({ message: 'Password has been reset successfully!' });
    
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;