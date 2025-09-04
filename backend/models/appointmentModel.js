const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor',
    required: [true, 'Please select a doctor'],
  },
  date: {
    type: Date,
    required: [true, 'Please add an appointment date'],
  },
  time: {
    type: String,
    required: [true, 'Please add an appointment time'],
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the appointment'],
  },
  reports: [
    {
      filename: String,
      path: String,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Appointment', appointmentSchema);