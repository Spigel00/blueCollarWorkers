import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { clearAuth } from '../utils/logout';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // This must match backend CORS config
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isExpired = (decodedToken as { exp: number }).exp * 1000 < Date.now();
        if (isExpired) {
          console.warn('Token expired');
          clearAuth();
          return Promise.reject('Token expired');
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Invalid token format:', error);
        clearAuth();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        clearAuth();
      }
    }
    return Promise.reject(error);
  }
);

export default API;
