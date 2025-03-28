// auth.js
import { getSecureItem, setSecureItem, deleteSecureItem } from '@/utils/secureStorage';
import api from './api'; // Axios setup

export const refreshToken = async () => {
  try {
    const refreshToken = await getSecureItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token found');

    const response = await api.post('/refresh-token', { refresh_token: refreshToken });
    const newToken = response.data.token;

    await setSecureItem('jwt_token', newToken);
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await deleteSecureItem('jwt_token');
    await deleteSecureItem('refresh_token');
    await deleteSecureItem('user_profile');
    // 🔄 ใส่ navigation ไปหน้าล็อกอินถ้าต้องการ
  } catch (error) {
    console.error('Failed to log out:', error);
  }
};
