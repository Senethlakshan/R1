// routes/productRoutes.js
const express = require('express');
const authenticate = require('../middleware/authenticate');
const Product = require('../models/productModel');

const router = express.Router();

// Add a new product
router.post('/product', authenticate, async (req, res) => {
    try {
      const { name, photo, price, manufacturer, expiryDate, manufactureDate, description } = req.body;
  
      // Convert photo data to Base64 and store it as a string
      const photoData = Buffer.from(photo, 'base64').toString('base64');
  
      const newProduct = new Product({
        name,
        photo: photoData,
        price,
        manufacturer,
        expiryDate: new Date(expiryDate),
        manufactureDate: new Date(manufactureDate),
        description,
      });
  
      await newProduct.save();
      res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error!' });
    }
  });
  
  // Update an existing product
  router.put('/product/:productId', authenticate, async (req, res) => {
    try {
      const productId = req.params.productId;
      const { name, photo, price, manufacturer, expiryDate, manufactureDate, description } = req.body;
  
      // Convert photo data to Base64 and store it as a string
      const photoData = Buffer.from(photo, 'base64').toString('base64');
  
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found!' });
      }
  
      existingProduct.name = name;
      existingProduct.photo = photoData;
      existingProduct.price = price;
      existingProduct.manufacturer = manufacturer;
      existingProduct.expiryDate = new Date(expiryDate);
      existingProduct.manufactureDate = new Date(manufactureDate);
      existingProduct.description = description;
  
      await existingProduct.save();
      res.status(200).json({ message: 'Product updated successfully!', product: existingProduct });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error!' });
    }
  });

// Delete a product
router.delete('/product/:productId', authenticate, async (req, res) => {
  try {
    const productId = req.params.productId;

    const existingProduct = await Product.findByIdAndDelete(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found!' });
    }

    res.status(200).json({ message: 'Product deleted successfully!', product: existingProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// View all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Search product by name
router.get('/product/search', async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({ name: { $regex: new RegExp(name, 'i') } });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

module.exports = router;
