// backend/server.js
require('dotenv').config();
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

const app = express();
connectDB();

// ── FIXED CORS CONFIGURATION ──
app.use(cors({
  origin: [
    'http://localhost:3000', // Keeps local testing working
    'https://hilomenchristian.vercel.app', // Your live Vercel frontend
    'https://thesports-hub.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());
// Serves your images from the backend/uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── MOUNT ROUTES (Fixed paths to stop 404s) ── 
app.use('/api/auth', authRoutes); 
app.use('/api/posts', postRoutes); 
app.use('/api/comments', commentRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/contact', contactRoutes);

// Main Health Check
app.get('/', (req, res) => res.send('HilomenChristian API is Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
  console.log(`Server started on http://localhost:${PORT}`); 
});