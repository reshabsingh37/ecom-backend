import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public Routes
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter,  login);

export default router;
