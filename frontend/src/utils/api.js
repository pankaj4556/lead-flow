import axios from 'axios';

// Get API base url from environment, default to local port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if it exists in LocalStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle unauthorized/expired session states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage if auth fails (expired or invalid token)
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      // We don't trigger full redirects here to allow components to handle it cleanly,
      // but we throw the error so callers are aware.
    }
    return Promise.reject(error);
  }
);

export default api;
