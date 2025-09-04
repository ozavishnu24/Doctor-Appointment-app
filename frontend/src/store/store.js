import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import appointmentReducer from './appointmentSlice';
import userProfileReducer from './userProfileSlice'; 
import servicesReducer from './servicesSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
    userProfile: userProfileReducer,
    services: servicesReducer,  
  },
});