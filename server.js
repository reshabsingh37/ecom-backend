import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'cookie-session';
import passport from 'passport';
import './config/passport.js'; 
import authMiddleware from './middlewares/authMiddleware.js';
import verifyToken from './middlewares/authMiddleware.js';


import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();

const corsOptions = {

  origin: 'https://6a1cd64aa764.ngrok-free.app',
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));



// Middleware
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', paymentRoutes);
app.use('/api/orders', orderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
