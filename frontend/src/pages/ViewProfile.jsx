import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile } from '../store/userProfileSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewProfile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.userProfile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  if (isLoading) {
    return (
      <div className="profile-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="content-overlay p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            My Profile
          </h1>
          
          {user ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">
                    Personal Information
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-lg text-gray-900 font-medium">{user.name}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-lg text-gray-900 font-medium">{user.email}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-lg text-gray-900 font-medium">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="text-lg text-gray-900 font-medium">{user.role}</p>
                    </div>
                  </div>
                </div>
                
                {user.isDoctor && user.doctorProfile && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                      Professional Information
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Specialization</p>
                        <p className="text-lg text-gray-900 font-medium">{user.doctorProfile.specialization}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Experience</p>
                        <p className="text-lg text-gray-900 font-medium">{user.doctorProfile.experience} years</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Qualification</p>
                        <p className="text-lg text-gray-900 font-medium">{user.doctorProfile.qualification}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Consultation Fee</p>
                        <p className="text-lg text-gray-900 font-medium">${user.doctorProfile.consultationFee}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Rating</p>
                        <p className="text-lg text-gray-900 font-medium">
                          {user.doctorProfile.rating} ({user.doctorProfile.reviewsCount} reviews)
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">About</p>
                        <p className="text-gray-900">{user.doctorProfile.about}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Available Days</p>
                          <p className="text-gray-900">
                            {user.doctorProfile.availableDays.join(', ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Available Time Slots</p>
                          <p className="text-gray-900">
                            {user.doctorProfile.availableTimeSlots.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No profile information available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;