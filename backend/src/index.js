const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const analyticsRoutes = require('./routes/analytics');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests (supports localhost port mappings in dev and production hosts)
app.use(cors({
  origin: '*', // We can restrict this in production (e.g. to frontend URL)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request payload parsing
app.use(express.json());

// General rate limiter applied across all routes
app.use('/api', apiLimiter);

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Server health check route
app.get('/api/health', (req, res) => {
  const { isDemoMode } = require('./config/supabase');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    databaseMode: isDemoMode ? 'Demo (In-Memory)' : 'Supabase (Postgres)',
    uptime: process.uptime()
  });
});

// Root welcome message
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Smart Appointment & Lead Management CRM API.',
    documentation: 'See API routes for details.'
  });
});

// Global 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred on the server.'
  });
});

// Start Server listening
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🚀 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================`);
});
