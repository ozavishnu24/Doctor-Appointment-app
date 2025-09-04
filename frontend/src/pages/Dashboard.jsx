import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaListAlt, FaCog } from 'react-icons/fa';

const Dashboard = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="content-overlay p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center text-overlay">
            Welcome, {user?.name || 'User'}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center card-hover">
              <FaUser className="text-5xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">My Profile</h2>
              <p className="text-gray-600 text-center mb-4">
                View and update your personal information
              </p>
              <Link
                to="/view-profile"
                className="btn-primary"
              >
                View Profile
              </Link>
            </div>
            
            <div className="bg-green-50 rounded-xl p-8 flex flex-col items-center justify-center card-hover">
              <FaCalendarAlt className="text-5xl text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Book Appointment</h2>
              <p className="text-gray-600 text-center mb-4">
                Schedule a new appointment with a doctor
              </p>
              <Link
                to="/book-appointment"
                className="btn-primary"
              >
                Book Now
              </Link>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-8 flex flex-col items-center justify-center card-hover">
              <FaListAlt className="text-5xl text-purple-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">My Appointments</h2>
              <p className="text-gray-600 text-center mb-4">
                View your upcoming and past appointments
              </p>
              <Link
                to="/my-appointments"
                className="btn-primary"
              >
                View Appointments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;