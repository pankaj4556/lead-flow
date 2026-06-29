const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const { bookingLimiter } = require('../middleware/rateLimiter');

// Public route to submit an appointment request
router.post('/', bookingLimiter, appointmentController.createAppointment);

// Protected Admin CRM routes
router.get('/', auth, appointmentController.getAllAppointments);
router.get('/:id', auth, appointmentController.getAppointmentById);
router.put('/:id', auth, appointmentController.updateAppointment);
router.patch('/:id/status', auth, appointmentController.updateAppointmentStatus);
router.delete('/:id', auth, appointmentController.deleteAppointment);

module.exports = router;
