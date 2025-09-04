const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, date, time, reason } = req.body;
  
  console.log('Creating appointment with data:', { doctor, date, time, reason });
  
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    res.status(400);
    throw new Error('Invalid doctor ID format');
  }
  
  // Check if doctor exists
  const doctorExists = await Doctor.findById(doctor);
  if (!doctorExists) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  
  // Convert date string to Date object
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    res.status(400);
    throw new Error('Invalid date format');
  }
  
  // Check if the time slot is available
  const existingAppointment = await Appointment.findOne({
    doctor,
    date: appointmentDate,
    time,
    status: { $ne: 'cancelled' }
  });
  
  if (existingAppointment) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }
  
  const appointment = await Appointment.create({
    user: req.user._id,
    doctor,
    date: appointmentDate,
    time,
    reason,
  });
  
  // Populate the doctor details before sending response
  await appointment.populate('doctor', 'specialization consultationFee');
  
  res.status(201).json(appointment);
});

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate({
      path: 'doctor',
      populate: { 
        path: 'user',
        select: 'name email' // Only select necessary fields
      }
    })
    .sort({ date: 1 });
  
  res.json(appointments);
});

// @desc    Get all appointments (admin only)
// @route   GET /api/appointments/all
// @access  Private/Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('user', 'name email')
    .populate({
      path: 'doctor',
      populate: { 
        path: 'user',
        select: 'name email'
      }
    })
    .sort({ date: 1 });
  
  res.json(appointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  // Check if user is authorized to update this appointment
  if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this appointment');
  }
  
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).populate('doctor', 'specialization consultationFee');
  
  res.json(updatedAppointment);
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  // Check if user is authorized to delete this appointment
  if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this appointment');
  }
  
  await Appointment.findByIdAndDelete(req.params.id); // Changed from appointment.remove()
  
  res.json({ message: 'Appointment removed' });
});

module.exports = {
  createAppointment,
  getAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};