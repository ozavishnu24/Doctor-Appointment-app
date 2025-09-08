import axios from 'axios';

// Dynamic base URL based on environment
const getBaseUrl = () => {
  // If we're on a Vercel deployment (production or preview)
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://doctor-appointment-app-d6lg.onrender.com/api';
  }
  // Fallback to environment variable or localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export default api;