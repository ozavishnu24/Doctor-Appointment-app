// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const { getServices, getServiceById, createService } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getServices).post(protect, admin, createService);
router.route('/:id').get(getServiceById);

module.exports = router;