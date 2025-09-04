const asyncHandler = require('express-async-handler');
const Doctor = require('../models/doctorModel');

// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = asyncHandler(async (req, res) => {
  const {
    user,
    specialization,
    experience,
    qualification,
    consultationFee,
    availableDays,
    availableTimeSlots,
    about,
    rating,
    reviewsCount
  } = req.body;
  
  const doctorExists = await Doctor.findOne({ user });
  if (doctorExists) {
    res.status(400);
    throw new Error('Doctor profile already exists for this user');
  }
  
  const doctor = await Doctor.create({
    user,
    specialization,
    experience,
    qualification,
    consultationFee,
    availableDays,
    availableTimeSlots,
    about,
    rating,
    reviewsCount
  });
  
  if (doctor) {
    res.status(201).json({
      success: true,
      data: doctor
    });
  } else {
    res.status(400);
    throw new Error('Invalid doctor data');
  }
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = asyncHandler(async (req, res) => {
  // Fixed: Ensure proper population of user fields including name
  const doctors = await Doctor.find({})
    .populate('user', 'name email phone profileImage')
    .sort({ rating: -1, reviewsCount: -1 });
    
  res.json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('user', 'name email phone profileImage');
    
  if (doctor) {
    res.json({
      success: true,
      data: doctor
    });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  
  // Check if the doctor is updating their own profile
  if (doctor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this doctor profile');
  }
  
  const {
    specialization,
    experience,
    qualification,
    consultationFee,
    availableDays,
    availableTimeSlots,
    about
  } = req.body;
  
  doctor.specialization = specialization || doctor.specialization;
  doctor.experience = experience || doctor.experience;
  doctor.qualification = qualification || doctor.qualification;
  doctor.consultationFee = consultationFee || doctor.consultationFee;
  doctor.availableDays = availableDays || doctor.availableDays;
  doctor.availableTimeSlots = availableTimeSlots || doctor.availableTimeSlots;
  doctor.about = about || doctor.about;
  
  const updatedDoctor = await doctor.save();
  
  res.json({
    success: true,
    data: updatedDoctor
  });
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  
  await Doctor.findByIdAndDelete(req.params.id);
  
  res.json({
    success: true,
    message: 'Doctor removed successfully'
  });
});

// @desc    Get doctors by specialization
// @route   GET /api/doctors/specialization/:specialization
// @access  Public
const getDoctorsBySpecialization = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ 
    specialization: { $regex: req.params.specialization, $options: 'i' } 
  })
    .populate('user', 'name email profileImage')
    .sort({ rating: -1 });
    
  res.json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

// @desc    Get available time slots for a doctor
// @route   GET /api/doctors/:id/availability
// @access  Public
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select('availableDays availableTimeSlots');
  
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  
  res.json({
    success: true,
    data: doctor
  });
});

// @desc    Update doctor rating and review count
// @route   PUT /api/doctors/:id/rating
// @access  Private
const updateDoctorRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const doctor = await Doctor.findById(req.params.id);
  
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  
  // Calculate new average rating
  const totalRating = doctor.rating * doctor.reviewsCount;
  const newReviewsCount = doctor.reviewsCount + 1;
  const newRating = (totalRating + rating) / newReviewsCount;
  
  doctor.rating = parseFloat(newRating.toFixed(1));
  doctor.reviewsCount = newReviewsCount;
  
  await doctor.save();
  
  res.json({
    success: true,
    data: doctor
  });
});

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization,
  getDoctorAvailability,
  updateDoctorRating
};