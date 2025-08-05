import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

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
    console.log('userId:', userId);
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('cart:', cart);
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    const products = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));
    const totalAmount = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const order = await Order.create({
      user: userId,
      products,
      totalAmount,
      paymentStatus: "paid",
      orderStatus: "processing"
    });

    product.stock -= quantity;
    await product.save();
    
    // Clear the cart
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order after payment", error });
  }
};


