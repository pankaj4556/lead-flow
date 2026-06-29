const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

// Public route to login
router.post('/login', authLimiter, authController.loginAdmin);

// Public route to register (requires secret administration code)
router.post('/register', authLimiter, authController.registerAdmin);

module.exports = router;
