// backend/middleware/upload.js 
const multer = require('multer'); 
const path = require('path'); 
const fs = require('fs');

// Ensure the path is absolute to avoid "folder not found" errors
const uploadDir = path.join(__dirname, '../uploads');

// Create uploads/ folder if it does not exist yet 
if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create a unique filename
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9); 
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => { 
    const allowedTypes = /jpeg|jpg|png|gif|webp/; 
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase()); 
    const mime = allowedTypes.test(file.mimetype); 
    
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
};

const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 20 * 1024 * 1024 }, // ✅ Increased to 20 MB
}); 

module.exports = upload;