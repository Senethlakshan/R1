// routes/orderRoutes.js
const express = require('express');
const authenticate = require('../middleware/authenticate');
const Order = require('../models/orderModel');

const router = express.Router();

// Create a new order
router.post('/order', async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const userId = req.user._id;

    const newOrder = new Order({ userId, products, totalPrice });
    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully!', order: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Update an existing order
router.put('/order/:orderId',  async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { products, totalPrice } = req.body;
    const userId = req.user._id;

    const existingOrder = await Order.findOne({ _id: orderId, userId });
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found or not authorized to update!' });
    }

    existingOrder.products = products;
    existingOrder.totalPrice = totalPrice;
    await existingOrder.save();
    res.status(200).json({ message: 'Order updated successfully!', order: existingOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Cancel an order
router.delete('/order/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user._id;

    const existingOrder = await Order.findOne({ _id: orderId, userId });
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found or not authorized to cancel!' });
    }

    await existingOrder.remove();
    res.status(200).json({ message: 'Order canceled successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

module.exports = router;
