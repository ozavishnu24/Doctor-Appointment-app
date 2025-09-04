const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Add a name field directly to the doctor model
  name: {
    type: String,
    required: [true, 'Please add doctor name']
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  availableDays: {
    type: [String],
    required: true
  },
  availableTimeSlots: {
    type: [String],
    required: true
  },
  about: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// FIX: Check if model already exists before defining
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;