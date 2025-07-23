import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login } from '../controllers/authController.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter,  login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // --- ADD THIS LINE AND TELL ME WHAT IT PRINTS ---
    console.log('DEBUG: Backend is attempting to redirect to:', `${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    // ------------------------------------------------
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

router.get('/me', authMiddleware, (req, res) => {
    res.json(req.user);
});

export default router;
