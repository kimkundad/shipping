import React, { useState, useEffect } from 'react';
import { useNavigation, router } from 'expo-router';
import { Text, View, Image, TouchableOpacity, TextInput, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';

export default function Login() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt_token');
        if (token) {
          router.push('/(tabs)');
        }
      } catch (error) {
        // fallback quietly
      }
    };
    checkTokenAndRedirect();
  }, []);

  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    const trimmedPhone = form.phone.trim();
    const password = form.password.trim();

    if (!trimmedPhone || !password) {
      Alert.alert('Login Failed', 'Please enter both phone and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://api.loadmasterth.com/api/login', {
        phone: trimmedPhone,
        password: form.password,
      });

      console.log('trimmedPhone', trimmedPhone)

      const { token, verify, user, refresh_token } = response.data;

      if (verify === 0) {
        Alert.alert(
          'Verification Required',
          'Please verify your phone number. Contact support if you did not receive the code.'
        );
        return; // Stop here, don't redirect
      }

      if (verify === 1 && token) {
        Alert.alert('Welcome', 'Login successful!');
        router.push('/(tabs)'); // ✅ Navigate immediately
      
        // Save data in background (non-blocking)
        (async () => {
          try {
            await AsyncStorage.setItem('jwt_token', token);
            await AsyncStorage.setItem('refresh_token', refresh_token ?? '');
            await AsyncStorage.setItem('user_profile', JSON.stringify(user));
          } catch (storageError) {
            console.warn('⚠️ Failed to save login data to storage:', storageError);
            // Optional: send to monitoring service
          }
        })();
      
        // Register push token separately (non-blocking too)
        if (user?.id) {
          registerForPushNotificationsAsync(user.id).catch(() => {});
        }
      
      } else {
        Alert.alert('Login Failed', 'Invalid phone number or password.');
      }
      
    } catch (error: any) {
      if (error?.response?.data?.message) {
        Alert.alert('Login Failed', error.response.data.message);
      } else if (error?.request) {
        Alert.alert('Network Error', 'Could not connect to server. Please try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
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