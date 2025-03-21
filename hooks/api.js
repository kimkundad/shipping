import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Axios instance
const api = axios.create({
  baseURL: 'https://api.loadmasterth.com/api',
  timeout: 10000, // ตั้ง timeout กัน API ค้าง
});

let isRefreshing = false;
let refreshSubscribers = [];

// ฟังก์ชัน Refresh Token
const refreshToken = async () => {
  try {
    const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
    if (!storedRefreshToken) throw new Error('No refresh token found');

    const response = await axios.post(
      'https://api.loadmasterth.com/api/refresh-token',
      { refresh_token: storedRefreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newToken = response.data.access_token;
    if (!newToken) throw new Error('Failed to receive new access token');

    // เก็บ Token ใหม่
    await AsyncStorage.setItem('jwt_token', newToken);

    // แจ้งทุกคำขอที่รออยู่ให้ใช้ Token ใหม่
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];

    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Interceptor เพิ่ม Token ให้ทุก Request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor จัดการกรณี Token หมดอายุ
api.interceptors.response.use(
  (response) => {
    // ✅ ตรวจสอบถ้า API ส่ง `{"message": "Token expired"}`
    if (response.data.message === "Token expired") {
      const originalRequest = response.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return refreshToken().then(newToken => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); // รีเทรย์คำขอเดิม
        });
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ✅ รองรับกรณี API ส่ง HTTP 401
    if (error.response && (error.response.status === 401 || error.response.data.message === "Token expired")) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest)); // รีเทรย์คำขอเดิม
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // รีเทรย์คำขอเดิม
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
