import React, { useState } from 'react';
import { Link, useNavigation, router  } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Register() {

    const navigation = useNavigation();

    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

    
    const [form, setForm] = useState({
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                <View style={styles.topHeader}>
                    <View style={styles.headerBack}>
                        <Link href="(login)">
                            <Ionicons name="chevron-back-outline" size={28} color="black" />
                        </Link>
                    </View>
                </View>
                <View style={styles.headerImg}>
                    <Image source={ require('../../assets/images/logo_write_2.jpg') }
                    style={{width: 180, height: 146}}
                    />
                </View>
                <View style={styles.header}>
                    
                    <Text style={styles.title}>Let's Get Started!</Text>
                    <Text style={styles.subtitle}>
                    Fill in the fields below to get started with your new account.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.input}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                        clearButtonMode="while-editing"
                        onChangeText={name => setForm({ ...form, name })}
                        placeholder="John Doe"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={form.name} />
                    </View>
                    <View style={styles.input}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        keyboardType="number-pad"
                        onChangeText={phone => setForm({ ...form, phone })}
                        placeholder="Phone number"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={form.phone} />
                    </View>
                    <View style={styles.input}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        onChangeText={password => setForm({ ...form, password })}
                        placeholder="********"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        secureTextEntry={true}
                        value={form.password} />
                    </View>
                    <View style={styles.input}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        onChangeText={confirmPassword =>
                        setForm({ ...form, confirmPassword })
                        }
                        placeholder="********"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        secureTextEntry={true}
                        value={form.confirmPassword} />
                    </View>

                    <View style={styles.formAction}>
                    <TouchableOpacity
                        onPress={() => {
                        // handle onPress
                        }}>
                        <View style={styles.btn}>
                        <Text style={styles.btnText}>Get Started</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        // handle link
                        router.push('(login)');
                    }}
                    style={{ marginTop: 'auto' }}>
                    <Text style={styles.formFooter}>
                        Already have an account?{' '}
                        <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
                    </Text>
                </TouchableOpacity>

                </KeyboardAwareScrollView>

                

            </View>
        </SafeAreaView>
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
    fontSize: 26,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  topHeader: {
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  headerImg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
  },
  /** Form */
  form: {
    marginBottom: 14,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
    marginBottom: 50
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
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
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});