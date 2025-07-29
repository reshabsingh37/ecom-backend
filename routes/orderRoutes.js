import express from "express";
import { getUserOrders, createOrderAfterPayment } from "../controllers/orderController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

router.get('/my-orders', verifyToken, getUserOrders);
router.post('/create-after-payment', verifyToken, createOrderAfterPayment);

export default router;
