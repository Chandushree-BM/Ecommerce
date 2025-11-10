import axios from 'axios';

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Ensure base URL ends with /api
const API_URL = RAW_API_URL.replace(/\/$/, '').endsWith('/api')
  ? RAW_API_URL.replace(/\/$/, '')
  : `${RAW_API_URL.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const reqUrl = error?.config?.url || '';
    const isAuthEndpoint = /\/auth\//.test(reqUrl);
    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      // clear session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // smart redirect based on current location or requested url
      const onAdmin = window.location.pathname.startsWith('/admin') || /\/admin\//.test(reqUrl);
      window.location.href = onAdmin ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
