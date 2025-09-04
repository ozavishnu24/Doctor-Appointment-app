const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => { 
  const { name, email, password, phone } = req.body;
  
  console.log('Registration attempt for:', email); // Debug log
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });
  
  if (user) {
    console.log('User registered successfully:', email); // Debug log
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt for:', email); // Debug log
  
  // Explicitly select the password field since it has `select: false` in the schema
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    console.log('User not found:', email); // Debug log
    res.status(401);
    throw new Error('Invalid email or password');
  }
  
  console.log('User found, checking password'); // Debug log
  
  if (await user.matchPassword(password)) {
    console.log('Password matched for:', email); // Debug log
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    console.log('Password mismatch for:', email); // Debug log
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = {
  registerUser,
  authUser,
};