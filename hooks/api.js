// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosRetry from 'axios-retry';

// Create Axios instance
const api = axios.create({
  baseURL: 'https://api.loadmasterth.com/api',
  timeout: 10000, // เพิ่ม timeout เพื่อป้องกันการค้าง
});

// Configure retry logic
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => error.response && error.response.status === 429,
});

let isRefreshing = false;
let refreshSubscribers = [];

// ฟังก์ชันรีเฟรช Token
const refreshToken = async () => {
  try {
    const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
    if (!storedRefreshToken) throw new Error('No refresh token found');

    // ส่ง request รีเฟรช token
    const response = await axios.post(
      'https://api.loadmasterth.com/api/refresh-token',
      { refresh_token: storedRefreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newToken = response.data.access_token;
    if (!newToken) throw new Error('Failed to receive new access token');

    // บันทึก token ใหม่
    await AsyncStorage.setItem('jwt_token', newToken);

    // แจ้งให้ทุก request ที่รออยู่ใช้ token ใหม่
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];

    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);
    throw error;
  }
};

// Interceptor สำหรับแนบ JWT Token ในทุก request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor สำหรับจัดการเมื่อ token หมดอายุ
api.interceptors.response.use(
  (response) => response, // ผ่าน response ไปตามปกติถ้าไม่มี error
  async (error) => {
    const originalRequest = error.config;

    // ถ้า token หมดอายุ (401 Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest)); // รีเทรย์ request เดิม
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // รีเทรย์ request เดิม
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
