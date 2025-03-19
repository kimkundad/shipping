// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosRetry from 'axios-retry';

// Create Axios instance
const api = axios.create({
  baseURL: 'https://api.loadmasterth.com/api',
});

// Configure retry logic
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => error.response && error.response.status === 429,
});

// Refresh token function
const refreshToken = async () => {
  try {
    const storedRefreshToken = await AsyncStorage.getItem('refresh_token'); // ดึง refresh_token จาก Storage
    if (!storedRefreshToken) {
      throw new Error('No refresh token found');
    }

    // Request new token using refresh token (ตามโครงสร้าง Laravel API)
    const response = await axios.post(
      'https://api.loadmasterth.com/api/refresh-token',
      { refresh_token: storedRefreshToken }, // ส่ง refresh_token ใน body
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newToken = response.data.access_token; // Laravel ส่งคืนเป็น `access_token`
    if (!newToken) {
      throw new Error('Failed to receive new access token');
    }

    // บันทึก Access Token ใหม่
    await AsyncStorage.setItem('jwt_token', newToken);
    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);
    throw error; // ส่ง error ออกไปให้ handle logout หรือ retry logic
  }
};

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newToken = await refreshToken(); // รีเฟรช token
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config); // รีเทรย์ request เดิม
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
