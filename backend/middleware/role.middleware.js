// backend/middleware/role.middleware.js

const adminOnly = (req, res, next) => { 
    // ✅ FIX: Added .trim() and .toLowerCase() to ensure "Admin" or "admin " still works
    if (req.user && req.user.role && req.user.role.trim().toLowerCase() === 'admin') {
        return next();
    }
    
    console.log(`[AUTH] Access Denied for user: ${req.user?.email}, Role: ${req.user?.role}`);
    return res.status(403).json({ message: 'Access denied — Admins only' });
};

const memberOrAdmin = (req, res, next) => { 
    if (req.user && (req.user.role === 'member' || req.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied — Members only' });
}; 

module.exports = { adminOnly, memberOrAdmin };