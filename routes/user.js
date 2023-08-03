const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/userSchema"); 
const authenticate = require('../middleware/authenticate');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// User registration
router.post('/user/register', async (req, res) => {
    try {
      const { username, email, password, photo, address, fullName, age } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists!' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        photo,
        address,
        fullName,
        age: age || null, // Use provided age or set to null if not provided
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error!' });
    }
  });
  

  
// // User registration
// router.post('/user/register', async (req, res) => {
//     try {
//       const { username, email, password, photo, address, fullName, age } = req.body;
  
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email already exists!' });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Convert photo data to Base64 and store it as a string
//       const photoData = Buffer.from(photo, 'base64').toString('base64');
  
//       const newUser = new User({
//         username,
//         email,
//         password: hashedPassword,
//         photo: photoData, // Save the Base64-encoded photo as a string
//         address,
//         fullName,
//         age: age || null,
//       });
  
//       await newUser.save();
//       res.status(201).json({ message: 'User registered successfully!' });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: 'Internal server error!' });
//     }
//   });

// // User login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password!' });
    }

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ message: 'User logged in successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// User logout
router.post('/user/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'User logged out successfully!' });
});

// Validate user
router.get('/user/validate', authenticate, (req, res) => {
  res.status(200).json({ message: 'Valid user!', role: req.user.role });
});

module.exports = router;
