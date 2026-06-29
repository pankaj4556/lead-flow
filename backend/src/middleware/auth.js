const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_token_for_local_development_2026';

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied: No Authorization header provided.' 
    });
  }

  // Expect header format: Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied: Authorization format must be Bearer <token>.' 
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      message: 'Access Denied: Invalid or expired authorization token.' 
    });
  }
};
