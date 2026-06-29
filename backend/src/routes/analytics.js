const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Protected Admin CRM Analytics endpoint
router.get('/stats', auth, analyticsController.getDashboardStats);

module.exports = router;
