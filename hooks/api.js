import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Create Axios instance
const api = axios.create({
  baseURL: 'https://api.loadmasterth.com/api',
  timeout: 10000,
});

let isRefreshing = false;
let refreshSubscribers = [];

const getSecureItem = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting ${key} from SecureStore:`, error);
    return null;
  }
};

const setSecureItem = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error setting ${key} to SecureStore:`, error);
  }
};

const deleteSecureItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting ${key} from SecureStore:`, error);
  }
};

// ฟังก์ชัน Refresh Token
const refreshToken = async () => {
  try {
    const storedRefreshToken = await getSecureItem('refresh_token');
    if (!storedRefreshToken) throw new Error('No refresh token found');

    const response = await axios.post(
      'https://api.loadmasterth.com/api/refresh-token',
      { refresh_token: storedRefreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newToken = response.data.access_token;
    if (!newToken) throw new Error('Failed to receive new access token');

    await setSecureItem('jwt_token', newToken);
    console.log('refresh token success');

    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];

    return newToken;

  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);

    // เคลียร์ข้อมูล + logout
    await deleteSecureItem('jwt_token');
    await deleteSecureItem('refresh_token');
    await deleteSecureItem('user_profile');

    import('expo-router').then(({ router }) => {
      router.replace('/(alogin)');
    });

    throw error;
  }
};

// ✅ Interceptor เพิ่ม Token ให้ทุก Request
api.interceptors.request.use(
  async (config) => {
    const token = await getSecureItem('jwt_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor จัดการกรณี Token หมดอายุ
api.interceptors.response.use(
  (response) => {
    if (response.data?.message === "Token expired") {
      const originalRequest = response.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return refreshToken().then(newToken => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.data?.message === "Token expired")
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
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
