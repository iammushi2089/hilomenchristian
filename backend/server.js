// backend/server.js
require('dotenv').config();	// Load .env variables FIRST 
const express = require('express'); 
const cors = require('cors'); 
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');
const uploadRoutes = require('./routes/upload');

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ─────────────────────────────────────────────────
// CORS - Allow React (port 3000) and Vercel to call this server
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    // 'https://thesports-2026-yawg.vercel.app', // uncomment after deployment
  ], 
  credentials: true 
}));

// Parse incoming JSON request bodies 
app.use(express.json());

// Serve uploaded image files as public URLs
// e.g. http://localhost:5000/uploads/my-image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────── 
app.use('/api/auth', authRoutes); 
app.use('/api/posts', postRoutes); 
app.use('/api/comments', commentRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', uploadRoutes);

// ── Start Server ────────────────────────────────────────────── 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
  console.log(`Server is running on http://localhost:${PORT}`); 
});