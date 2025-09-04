import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create a reusable axios instance with full backend URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to dynamically add token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage for each request
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.config.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Get doctors
export const getDoctors = createAsyncThunk(
  'appointments/getDoctors',
  async (_, thunkAPI) => {
    try {
      console.log('Fetching doctors from API...');
      const response = await api.get('/api/doctors');
      console.log('Doctors API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create appointment
export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, thunkAPI) => {
    try {
      console.log('Sending appointment data to API:', appointmentData);
      
      const response = await api.post('/api/appointments', appointmentData);
      console.log('Appointment created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user appointments
export const getAppointments = createAsyncThunk(
  'appointments/getAppointments',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/api/appointments');
      return response.data;
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  doctors: [], 
  appointments: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Get doctors
      .addCase(getDoctors.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Fixed: Access the data property from the response
        state.doctors = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.doctors = [];
      })
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get user appointments
      .addCase(getAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Fixed: Handle structured response
        state.appointments = Array.isArray(action.payload.data) ? action.payload.data : 
                          Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.appointments = [];
      });
  }
});

export const { reset } = appointmentSlice.actions;
export default appointmentSlice.reducer;