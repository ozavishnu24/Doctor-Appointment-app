const express = require('express');
const router = express.Router();
const { 
  getAllDoctors, 
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization,
  getDoctorAvailability,
  updateDoctorRating
} = require('../controllers/doctorController');

// Routes for doctors
router.route('/')
  .get(getAllDoctors)  // Fixed: Changed from getDoctors to getAllDoctors
  .post(createDoctor);

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

router.route('/specialization/:specialization')
  .get(getDoctorsBySpecialization);

router.route('/:id/availability')
  .get(getDoctorAvailability);

router.route('/:id/rating')
  .put(updateDoctorRating);

module.exports = router;