const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Verify JWT token
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get fresh user from DB
    const result = await pool.query(
      'SELECT id, name, email, phone, role, status, kyc_status FROM users WHERE id = $1',
      [decoded.id]
    );

    if (!result.rows.length) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (result.rows[0].status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account suspended' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired — please login again' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required: ${roles.join(' or ')}`
      });
    }
    next();
  };
};

// Generate JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = { protect, authorize, generateToken };
