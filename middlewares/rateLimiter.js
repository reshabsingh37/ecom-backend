import rateLimit from 'express-rate-limit';

// Limit login & register attempts to 5 per 15 minutes per IP

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, 
  legacyHeaders: false   
});
