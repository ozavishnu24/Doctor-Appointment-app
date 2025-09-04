const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ availability: true });
  
  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  
  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
  const { name, description, price, category, duration, image } = req.body;
  
  const service = await Service.create({
    name,
    description,
    price,
    category,
    duration,
    image,
  });
  
  res.status(201).json({
    success: true,
    data: service,
  });
});

module.exports = {
  getServices,
  getServiceById,
  createService,
};