import React, { useState, useEffect } from 'react';
import { useNavigation, router } from 'expo-router';
import { Text, View, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";

export default function Login() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt_token');
        
        if (token) {
          // If token exists, navigate to the main app screen
          console.log('SecureStore', SecureStore)
          router.push('/(tabs)');
        }
      } catch (error) {
        console.error('Error reading JWT token from SecureStore:', error);
      }
    };

    checkTokenAndRedirect();
  }, []);

  const [form, setForm] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.phone || !form.password) {
      Alert.alert('Validation Error', 'Please fill in both phone number and password.');
      return;
    }

    //setLoading(true);

    try {
      
      // Replace with your API endpoint
      const response = await axios.post('https://api.loadmasterth.com/api/login', {
        phone: form.phone,
        password: form.password,
      });
      
      
      // Handle different `verify` statuses
    //  const { success, token, verify, user, refresh_token } = response.data;
      const { success, token, verify, user, refresh_token, message } = response.data || {};
      console.log('success', success)

      if (!success) {
        Alert.alert('Login Failed', message || 'Login unsuccessful. Please check your credentials.');
        return;
      }
      
      if (verify === 0) {
        // The user has not verified their phone number, prompt them to verify OTP
        Alert.alert('Verification Required', 'Please verify your phone number with the OTP.');
        router.push('/verify'); // Redirect to OTP verification screen

        router.push({ pathname: '/(alogin)/verify', params: { phone: '+66'+form.phone } });

      } 
      
      if (verify === 1 && token && user) {
        // User is logged in successfully, save the tokens and user info
        
        try {
          
          await SecureStore.setItemAsync('jwt_token', token);
          await SecureStore.setItemAsync('refresh_token', refresh_token ?? '');
          await SecureStore.setItemAsync('user_profile', JSON.stringify(user));
          
          if (user?.id) {
            await registerForPushNotificationsAsync(user.id);
          }
      
          Alert.alert('Success', 'Login successful!');
          router.push('/(tabs)');
        } catch (storageError) {
          console.error('Storage error:', storageError);
          Alert.alert('Storage Error', 'Unable to save login data. Please try again.');
        }

      } else {
        Alert.alert('Login Error', 'Unexpected response received. Please contact support.');
      }

    } catch (error) {
      if (error.response) {
        Alert.alert('Login Failed', error.response.data.message || 'Server error.');
      } else if (error.request) {
        Alert.alert('Network Error', 'No response from server. Please check internet.');
      } else {
        Alert.alert('Unexpected Error', error.message || 'Unexpected error occurred. Please contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo_write.jpg')}
              style={{ width: 200, height: 200 }}
            />
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                placeholder="092XXXXXXX"
                onChangeText={(phone) => setForm({ ...form, phone })}
                placeholderTextColor="#6b7280"
                keyboardType='number-pad'
                style={styles.inputControl}
                value={form.phone}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleLogin} disabled={loading}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
          onPress={() => router.push('/forgot')}
          style={{ marginTop: 'auto' }}>
            <Text style={styles.formLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={{ marginTop: 'auto' }}>
          <Text style={styles.formFooter}>
            Don't have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  /** Form */
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121F43',
    textAlign: 'center',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#121F43',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#121F43',
    borderColor: '#121F43',
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});