// backend/routes/comment.routes.js 
const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware'); 
const { memberOrAdmin, adminOnly } = require('../middleware/role.middleware'); 
const router = express.Router();

// GET /api/comments/:postId — Public: all comments for a post 
router.get('/:postId', async (req, res) => {
    try { 
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name profilePic role')
            .populate('replies.author', 'name profilePic role')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// POST /api/comments/:postId — Member/Admin: add a comment 
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
    try { 
        const comment = await Comment.create({ 
            post: req.params.postId, 
            author: req.user._id, 
            body: req.body.body,
        });
        await comment.populate('author', 'name profilePic role');
        res.status(201).json(comment);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// PUT /api/comments/:id — Edit own comment OR admin
router.put('/:id', protect, async (req, res) => {
    try { 
        const comment = await Comment.findById(req.params.id); 
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        const isOwner = comment.author.toString() === req.user._id.toString(); 
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to edit this comment' });
        }
        
        comment.body = req.body.body;
        comment.edited = true;
        comment.editedAt = new Date();
        await comment.save();
        
        await comment.populate('author', 'name profilePic role');
        res.json(comment);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// DELETE /api/comments/:id — Own comment OR admin
router.delete('/:id', protect, async (req, res) => {
    try { 
        const comment = await Comment.findById(req.params.id); 
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        const isOwner = comment.author.toString() === req.user._id.toString(); 
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
});

// POST /api/comments/:id/reply — Admin only: reply to a comment
router.post('/:id/reply', protect, adminOnly, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        const { body } = req.body;
        if (!body || !body.trim()) {
            return res.status(400).json({ message: 'Reply body is required' });
        }
        
        comment.replies.push({
            author: req.user._id,
            body: body.trim(),
            isAdminReply: true
        });
        
        await comment.save();
        await comment.populate('replies.author', 'name profilePic role');
        await comment.populate('author', 'name profilePic role');
        
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/comments/:commentId/reply/:replyId — Admin only: delete a reply
router.delete('/:commentId/reply/:replyId', protect, adminOnly, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        comment.replies = comment.replies.filter(
            reply => reply._id.toString() !== req.params.replyId
        );
        
        await comment.save();
        res.json({ message: 'Reply deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/comments/user/:userId — Get user's comments (for notification system)
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // Only allow users to see their own comments
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const comments = await Comment.find({ author: req.params.userId })
            .populate('post', 'title _id')
            .populate('replies.author', 'name role')
            .sort({ createdAt: -1 });
        
        // Check for admin replies on user's comments
        const userCommentsWithReplies = comments.filter(comment => comment.replies.length > 0);
        
        res.json({
            comments,
            hasReplies: userCommentsWithReplies
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;