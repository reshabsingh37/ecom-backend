import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  // Make sure your authentication middleware runs before this
  // to ensure req.user is available.
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { cartItems } = req.body;

  // Check if cartItems exist and is an array
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty or invalid.' });
  }

  try {
    // --- FIX: Access properties directly from the 'item' object ---
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          // Use item.title (or item.name, depending on your Product model)
          name: item.title, 
          // You can also pass images
          // images: Array.isArray(item.images) ? item.images : [], // Should be array of strings
        },
        // Use item.price directly
        unit_amount: Math.round(item.price * 100), // Price must be in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      // Ensure your .env file has CLIENT_URL set correctly (e.g., http://localhost:5173)
      success_url: `${process.env.CLIENT_URL}/order/success`,
      cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
      // This relies on your auth middleware providing req.user
      customer_email: req.user.email, 
    });

    // Send back the session URL, not the ID
    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err.message); // Log the specific error on the server
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
};
