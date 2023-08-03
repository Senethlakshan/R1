// routes/paymentRoutes.js
const express = require('express');
const authenticate = require('../middleware/authenticate');
const Payment = require('../models/paymentModel');

const router = express.Router();

// Create a new payment record
router.post('/payment',  async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    const userId = req.user._id;

    const newPayment = new Payment({ userId, amount, paymentMethod, transactionId });
    await newPayment.save();
    res.status(201).json({ message: 'Payment created successfully!', payment: newPayment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Update an existing payment record
router.put('/payment/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const { amount, paymentMethod, transactionId } = req.body;
    const userId = req.user._id;

    const existingPayment = await Payment.findOne({ _id: paymentId, userId });
    if (!existingPayment) {
      return res.status(404).json({ error: 'Payment not found or not authorized to update!' });
    }

    existingPayment.amount = amount;
    existingPayment.paymentMethod = paymentMethod;
    existingPayment.transactionId = transactionId;

    await existingPayment.save();
    res.status(200).json({ message: 'Payment updated successfully!', payment: existingPayment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Delete a payment record
router.delete('/payment/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const userId = req.user._id;

    const existingPayment = await Payment.findOne({ _id: paymentId, userId });
    if (!existingPayment) {
      return res.status(404).json({ error: 'Payment not found or not authorized to delete!' });
    }

    await existingPayment.remove();
    res.status(200).json({ message: 'Payment deleted successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// View payment history for the authenticated user
router.get('/payment/history', async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ userId });
    res.status(200).json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

module.exports = router;
