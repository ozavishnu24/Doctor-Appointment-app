import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDoctors, createAppointment } from '../store/appointmentSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });
  const { doctor, date, time, reason } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, isLoading, error } = useSelector((state) => state.appointments);
  
  useEffect(() => {
    console.log('Fetching doctors...');
    dispatch(getDoctors());
  }, [dispatch]);
  
  useEffect(() => {
    console.log('Doctors loaded:', doctors);
    console.log('Loading state:', isLoading);
    console.log('Error:', error);
  }, [doctors, isLoading, error]);
  
  const onChange = (e) => {
    console.log('Form changed:', e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting appointment:', formData);
    
    if (!doctor || !date || !time || !reason) {
      toast.error('Please fill all fields');
      return;
    }
    
    // Format the date properly before sending
    const formattedDate = new Date(date).toISOString();
    
    const appointmentData = {
      doctor,
      date: formattedDate, // Send as ISO string
      time,
      reason
    };
    
    console.log('Formatted appointment data:', appointmentData);
    
    dispatch(createAppointment(appointmentData))
      .unwrap()
      .then((data) => {
        console.log('Appointment created:', data);
        toast.success('Appointment booked successfully');
        navigate('/my-appointments');
      })
      .catch((err) => {
        console.error('Error creating appointment:', err);
        // Try to extract the error message properly
        const errorMessage = err?.message || err?.response?.data?.message || err || 'Failed to book appointment';
        toast.error(errorMessage);
      });
  };
  
  // Fixed: No need to extract data property since we're handling it in the slice
  const isDoctorsArray = Array.isArray(doctors);
  
  // Debug function to log doctor details
  const logDoctorDetails = (doctor, index) => {
    console.log(`Doctor ${index}:`, {
      id: doctor._id,
      name: doctor.name,
      userName: doctor.user?.name,
      specialization: doctor.specialization,
      user: doctor.user
    });
  };
  
  // Helper function to get doctor name with multiple fallbacks
  const getDoctorName = (doctor) => {
    // First try the direct name field in the doctor model
    if (doctor.name) {
      return doctor.name;
    }
    // Then try to get name from populated user object
    if (doctor.user && doctor.user.name) {
      return doctor.user.name;
    }
    // If user object exists but no name, try email
    if (doctor.user && doctor.user.email) {
      return doctor.user.email.split('@')[0]; // Use part before @ as name
    }
    // Last resort fallback
    return 'Unknown Doctor';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
          
          {isLoading && (!isDoctorsArray || doctors.length === 0) ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor
                  </label>
                  <select
                    id="doctor"
                    name="doctor"
                    value={doctor}
                    onChange={onChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a doctor</option>
                    {isDoctorsArray && doctors.map((doc, index) => {
                      // Log doctor details for debugging
                      logDoctorDetails(doc, index);
                      
                      return (
                        <option key={doc._id} value={doc._id}>
                          {/* Fixed: Use helper function to get doctor name */}
                          {getDoctorName(doc)} - {doc.specialization}
                        </option>
                      );
                    })}
                  </select>
                  {!isLoading && (!isDoctorsArray || doctors.length === 0) && (
                    <p className="text-red-500 text-sm mt-1">No doctors available</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={date}
                    onChange={onChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={time}
                    onChange={onChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Appointment
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={reason}
                    onChange={onChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the reason for your appointment"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;