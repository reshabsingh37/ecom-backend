// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'cookie-session';
import passport from 'passport';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


// import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/db.js';
// import './config/passport.js'; // Passport config

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret_key',
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', paymentRoutes);

// Error handler
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
