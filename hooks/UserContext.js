import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from './api'; // Axios instance
import { useNavigation } from '@react-navigation/native';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userBranch, setUserBranch] = useState([]);
  const navigation = useNavigation();

  const getSecureItem = async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error(`Error getting ${key}:`, err);
      return null;
    }
  };

  const deleteSecureItem = async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error(`Error deleting ${key}:`, err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getSecureItem('jwt_token');
        const dataUser = await getSecureItem('user_profile');

        if (dataUser) {
          setUserProfile(JSON.parse(dataUser));
        }

        const ordersResponse = await api.get('/user-order');
        setUserOrders(ordersResponse.data.order);

        const branchResponse = await api.get('/user-branch');
        setUserBranch(branchResponse.data.branch);
      } catch (error) {
        console.error('Failed to retrieve user profile:', error);

        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync('jwt_token');
          await SecureStore.deleteItemAsync('refresh_token');
          await SecureStore.deleteItemAsync('user_profile');
          navigation.navigate('(alogin)');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const logout = async () => {
    try {
      await deleteSecureItem('jwt_token');
      await deleteSecureItem('refresh_token');
      await deleteSecureItem('user_profile');
      setUserProfile(null);
      setUserOrders([]);
      setUserBranch([]);
      navigation.navigate('(alogin)');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      userProfile,
      userOrders,
      userBranch,
      setUserProfile,
      setUserOrders,
      setUserBranch,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};
