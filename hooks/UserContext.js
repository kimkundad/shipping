import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // Axios instance
import { useNavigation } from '@react-navigation/native'; // React Navigation

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userBranch, setUserBranch] = useState([]);
  const navigation = useNavigation(); // Access navigation
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true); // 👈 เพิ่มตรงนี้
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingUserProfile(true); // 🔄 เริ่มโหลด
        const dataUser = await AsyncStorage.getItem('user_profile');

        if (dataUser) {
          setUserProfile(JSON.parse(dataUser));
        }

        const ordersResponse = await api.get('/user-order');
        setUserOrders(ordersResponse?.data?.order || []);

        const branchResponse = await api.get('/user-branch');
        setUserBranch(branchResponse?.data?.branch || []);
      } catch (error) {
        console.error('Failed to retrieve user profile:', error);
      } finally {
        setIsLoadingUserProfile(false); // ✅ โหลดเสร็จ
      }
    };

    fetchUserProfile();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_profile');
      setUserProfile(null);
      setUserOrders([]);
      // Navigate to login screen or another appropriate action
      navigation.navigate('(alogin)'); // Ensure 'Login' matches your route name
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{
          userProfile,
          userOrders,
          setUserProfile,
          setUserOrders,
          logout,
          userBranch,
          setUserBranch,
          isLoadingUserProfile, // 👈 แชร์ออกไป
        }}>
      {children}
    </UserContext.Provider>
  );
};