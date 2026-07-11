import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to automatically attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle global errors (like 401 Unauthorized or Network Errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to unauthorized access (invalid/expired token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('crm-token');
      // Redirect to login page. We use window.location as we are outside React Router context here.
      window.location.href = '/login';
    } 
    // Check for network errors (no response received)
    else if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
