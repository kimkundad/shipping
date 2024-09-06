import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'https://30b7-58-8-226-86.ngrok-free.app/api',
});

// Configure retry logic
axiosRetry(api, {
    retries: 3, // Number of retries
    retryDelay: axiosRetry.exponentialDelay, // Exponential backoff delay
    retryCondition: (error) => {
      // Retry only if the status code is 429
      return error.response && error.response.status === 429;
    },
  });

const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const response = await axios.post('https://30b7-58-8-226-86.ngrok-free.app/api/refresh-token', {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
  
      const newToken = response.data.token;
      await AsyncStorage.setItem('jwt_token', newToken);
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error; // Ensure the error is thrown to handle it properly
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken(); // Make sure this function is imported or available
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Handle token refresh failure (e.g., redirect to login)
      }
    }

    return Promise.reject(error);
  }
);

export default api;