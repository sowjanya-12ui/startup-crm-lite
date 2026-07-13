import axios from 'axios';
import toast from 'react-hot-toast';

console.log('==============================');
console.log('VITE_API_URL =', import.meta.env.VITE_API_URL);
console.log('MODE =', import.meta.env.MODE);
console.log('Current Origin =', window.location.origin);
console.log('==============================');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log('Axios Base URL =', api.defaults.baseURL);

api.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.baseURL + config.url);

    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios Error:', error);

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('crm-token');
      window.location.href = '/login';
    } else if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;