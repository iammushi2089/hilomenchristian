// backend/routes/admin.routes.js - MODIFIED VERSION

const express = require('express'); 
const User = require('../models/User'); 
const Post = require('../models/Post');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth.middleware'); 
const { adminOnly } = require('../middleware/role.middleware'); 
const router = express.Router();

// ===== ROUTES FOR REGULAR USERS (NO ADMIN REQUIRED) =====
// These need to be BEFORE router.use(protect, adminOnly)

// GET /api/admin/contacts/user/:userId — Get contact messages for a specific user (user can see their own)
router.get('/contacts/user/:userId', protect, async (req, res) => {
  try {
    // Check if user is requesting their own messages or is admin
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }
    
    const contacts = await Contact.find({ sender: req.params.userId })
      .populate('sender', 'name email')
      .populate('adminReply.repliedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching user contacts:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/contacts/:id/mark-read — Mark reply as read (user can mark their own)
router.put('/contacts/:id/mark-read', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    // Check if user owns this contact message
    if (contact.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (contact.adminReply && contact.adminReply.isRead === false) {
      contact.adminReply.isRead = true;
      await contact.save();
    }
    
    res.json({ message: 'Reply marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== ADMIN ONLY ROUTES =====
router.use(protect, adminOnly);

// GET /api/admin/users — List all non-admin members 
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 }); 
    res.json(users);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// PUT /api/admin/users/:id/status — Toggle member active/inactive 
router.put('/users/:id/status', async (req, res) => { 
  try { 
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    user.status = user.status === 'active' ? 'inactive' : 'active'; 
    await user.save();
    res.json({ message: `User is now ${user.status}`, user: user });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// GET /api/admin/posts — List ALL posts including removed ones 
router.get('/posts', async (req, res) => {
  try { 
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 }); 
    res.json(posts);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// PUT /api/admin/posts/:id/remove — Mark post as removed 
router.put('/posts/:id/remove', async (req, res) => { 
  try { 
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' }); 
    post.status = 'removed'; 
    await post.save();
    res.json({ message: 'Post has been removed', post });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// DELETE /api/admin/posts/:id — Permanently delete a post
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post has been permanently deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/contacts — List all contact messages (admin only)
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('sender', 'name email')
      .populate('adminReply.repliedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/contacts/:id/reply — Admin replies to contact message
router.post('/contacts/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: 'Reply message is required' });
    }
    
    const contact = await Contact.findById(req.params.id)
      .populate('sender', 'name email');
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    // Update the contact with admin reply
    contact.adminReply = {
      body: reply.trim(),
      repliedBy: req.user._id,
      repliedAt: new Date(),
      isRead: false
    };
    contact.status = 'replied';
    
    await contact.save();
    await contact.populate('adminReply.repliedBy', 'name');
    
    res.json({
      message: 'Reply sent successfully',
      contact: contact
    });
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users/:id — Get user details for editing
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id — Update user profile
router.put('/users/:id', async (req, res) => {
  try {
    const { name, bio, profilePic } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.profilePic = profilePic !== undefined ? profilePic : user.profilePic;
    await user.save();
    res.json({ message: 'User profile updated', user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/password — Change user password
router.put('/users/:id/password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;