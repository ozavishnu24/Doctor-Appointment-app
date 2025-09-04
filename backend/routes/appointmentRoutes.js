const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

router.route('/all')
  .get(protect, admin, getAllAppointments);

router.route('/:id')
  .put(protect, updateAppointmentStatus)
  .delete(protect, deleteAppointment);

module.exports = router;