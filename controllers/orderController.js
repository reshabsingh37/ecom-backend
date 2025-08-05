import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getUserOrders = async (req, res) => {
  try {
    let orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    if (orders.length === 0) {

      const newOrder = await Order.create({
        user: req.user._id,
        products: [], 
        // orderStatus: 'pending'
      });
      orders = [newOrder];
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error); // Add this for debugging
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

export const createOrderAfterPayment = async (req, res) => {
  try {
    const userId = req.user?._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const productsForOrder = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));

    const totalAmount = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const order = await Order.create({
      user: userId,
      products: productsForOrder,
      totalAmount,
      paymentStatus: "paid",
      orderStatus: "processing"
    });

    
    for (const item of cart.items) {
      await Product.updateOne(
        { _id: item.product._id },
        { $inc: { stock: -item.quantity } } 
      );
    }
    
    
    cart.items = [];
    await cart.save();

    

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order after payment", error: error.message });
  }
};


