import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const getUserOrders = async (req, res) => {
  try {
    // Find all orders associated with the user's ID from the token
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product') // Populate product details within each order
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};


export const createOrderAfterPayment = async (req, res) => {
  try {
    const userId = req.user?._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    // Check if the cart exists or is empty
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ message: "Cannot create order from an empty cart." });
    }

    // Prepare the list of products for the new order
    const productsForOrder = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    }));

    // Calculate the total amount from the cart items
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    // Create the new order document in the database
    const order = await Order.create({
      user: userId,
      products: productsForOrder,
      totalAmount,
      paymentStatus: "paid",
      orderStatus: "processing"
    });

    // Update the stock for each product in the order
    for (const item of cart.items) {
      await Product.updateOne(
        { _id: item.product._id },
        { $inc: { stock: -item.quantity } } 
      );
    }
    

    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order after payment", error: error.message });
  }
};
