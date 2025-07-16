import { strict } from "assert";
import mongoose from "mongoose"; 
import { type } from "os";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  stock: {
    type: Number,
    default: 0
  },
  images: [
    {
      url: String,
      public_id: String
    }
  ],
  brand:{
    type: String,
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;