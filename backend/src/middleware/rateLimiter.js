const rateLimit = require('express-rate-limit');

// Limiter for booking appointments (prevents bot spam)
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 30, // Limit each IP to 30 booking requests per window
  message: {
    success: false,
    message: 'Too many appointment requests from this IP. Please try again after an hour.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Limiter for admin authentication (prevents brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 15, // Limit each IP to 15 login/register attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for other API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 300, // Limit each IP to 300 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  bookingLimiter,
  authLimiter,
  apiLimiter
};
