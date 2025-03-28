import * as SecureStore from 'expo-secure-store';

export const setSecureItem = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.error(`SecureStore set error:`, err);
  }
};

export const getSecureItem = async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error(`SecureStore get error:`, err);
      return null;
    }
  };
  
  export const deleteSecureItem = async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error(`SecureStore delete error:`, err);
    }
  };