const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const router = express.Router();

console.log('Auth routes loaded'); // Add this

router.post('/register', (req, res, next) => {
  console.log('Register endpoint hit'); 
  next();
}, registerUser);

router.post('/login', authUser);

module.exports = router;