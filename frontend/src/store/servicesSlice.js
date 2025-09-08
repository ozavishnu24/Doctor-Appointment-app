import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunks
export const getServices = createAsyncThunk(
  'services/getServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const getServiceById = createAsyncThunk(
  'services/getServiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service');
    }
  }
);

const initialState = {
  services: [],
  currentService: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all services
      .addCase(getServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Handle both direct array and wrapped response
        state.services = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      })
      .addCase(getServices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single service
      .addCase(getServiceById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentService = action.payload.data || action.payload;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = servicesSlice.actions;
export default servicesSlice.reducer;