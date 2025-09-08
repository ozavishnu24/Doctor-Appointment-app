import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Get doctors
export const getDoctors = createAsyncThunk(
  'appointments/getDoctors',
  async (_, thunkAPI) => {
    try {
      console.log('Fetching doctors from API...');
      const response = await api.get('/doctors');
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
      const response = await api.post('/appointments', appointmentData);
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
      const response = await api.get('/appointments');
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
        // Handle both direct array and wrapped response
        state.doctors = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
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
        state.appointments.push(action.payload.data || action.payload);
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
        // Handle both direct array and wrapped response
        state.appointments = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.appointments = [];
      });
  }
);

export const { reset } = appointmentSlice.actions;
export default appointmentSlice.reducer;