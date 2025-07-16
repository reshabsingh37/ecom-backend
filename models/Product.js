const mongoose = require('mongoose');

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
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
