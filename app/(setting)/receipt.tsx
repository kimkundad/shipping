import { Image, View, Text, StyleSheet, Platform, Alert, TextInput, TouchableOpacity, FlatList, ScrollView, RefreshControl  } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router, Stack, useLocalSearchParams } from 'expo-router';
import Dropdown from "../../components/DropDown";
import api from '../../hooks/api'; // Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../hooks/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const Receipt = () => {

  const { id } = useLocalSearchParams(); // รับพารามิเตอร์ id
    const navigation = useNavigation(); // For Back button functionality
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // Track refresh state
    const { userProfile, setUserProfile } = useContext(UserContext);

  const [form, setForm] = useState({
    Receiptname: '',
    Receiptphone: '',
    Receiptemail: '',
    Receiptaddress: '',
    Receiptprovice: '',
    Receiptpostcode: '',
    ReceiptTax: ''
  });


  //updateReceipt

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/user-profile`);
      const orderData = response.data.user;
      setData(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setForm({
        Receiptname: data?.Receiptname || '',
        Receiptphone: data?.Receiptphone || '',
        Receiptemail: data?.Receiptemail || '',
        Receiptaddress: data?.Receiptaddress || '',
        ReceiptTax: data?.ReceiptTax || '',
      });
    }
  }, [data]);


  const handleUpdateProfile = async () => {
    if (!form.Receiptname || !form.Receiptphone || !form.Receiptemail || !form.Receiptaddress || !form.ReceiptTax) {
      Alert.alert('Error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true); // Start loading
    try {
        console.log('form', form)
      const response = await api.post('/updateReceipt', form);
      
      if (response.data.msgStatus === 200) {
        const updatedUser = response.data.user;
        console.log('response', response.data.user)
        await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));
        setUserProfile(updatedUser); // Update UserContext
        setData(updatedUser); // Update UserContext

        if(id){

          Alert.alert('Success', 'Profile updated successfully', [
            {
              text: 'OK',
              onPress: () => router.push({
                pathname: '(setting)/tracking',
                params: { id: id } // Navigate to tracking page with 'id' parameter
              }),
            },
          ]);

        }else{
          Alert.alert('Success', 'Profile updated successfully');
        }
        
      //  router.push('(tabs)/setting'); // Navigate to settings page
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the profile');
      console.error('Update Profile Error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
      <StatusBar style="dark" />
      <ScrollView
      
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        
        <LinearGradient
                    colors={['#1e3c72', '#1e3c72', '#2a5298']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.listItemCon}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(tabs)/setting')}>
                                <View
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        padding: 5,
                                        borderRadius: 25
                                    }}
                                >
                                    <Ionicons name="chevron-back" size={20} color="black" />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.textListHead}>
                                <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium', color: '#fff', textAlign: 'center' }}>
                                  ข้อมูลใบเสร็จรับเงิน
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>

        <View style={styles.container}>
          <View style={styles.card}>

            <View style={styles.form}>

              <View>

              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>ชื่อบริษัทหรือในนามบุคคล </Text>
                <TextInput
                  clearButtonMode="while-editing"
                  onChangeText={Receiptname => setForm({ ...form, Receiptname })}
                  placeholder="ชื่อ-นามสกุล"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.Receiptname} />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>โทรศัพท์</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="number-pad"
                  onChangeText={Receiptphone => setForm({ ...form, Receiptphone })}
                  placeholder="09578512xxx"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.Receiptphone} />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>อีเมล (**ที่ใช้รับใบเสร็จ)</Text>
                <TextInput
                  clearButtonMode="while-editing"
                  onChangeText={Receiptemail => setForm({ ...form, Receiptemail })}
                  placeholder="email@email.com"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.Receiptemail} />
              </View>


              <View style={styles.input}>
                <Text style={styles.inputLabel}>ที่อยู่</Text>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={Receiptaddress => setForm({ ...form, Receiptaddress })}
                      placeholder="ระบุที่อยู่"
                      placeholderTextColor="#6b7280"
                      style={[styles.inputControl, { height: 80 }]}
                      value={form.Receiptaddress}
                      multiline={true}
                    />
                  </View>


                  <View style={styles.input}>
                <Text style={styles.inputLabel}>เลขประจำตัวผู้เสียภาษี</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="number-pad"
                  onChangeText={ReceiptTax => setForm({ ...form, ReceiptTax })}
                  placeholder="12543335xxx"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.ReceiptTax} />
              </View>

              <View style={styles.formAction}>
              <TouchableOpacity onPress={handleUpdateProfile} disabled={loading}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>{loading ? 'Updating...' : 'Update'}</Text>
                </View>
              </TouchableOpacity>
            </View>





            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default Receipt


const styles = StyleSheet.create({
headerGradient: {
        height: 85,
        width: '100%',
    },
    btnBack: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        padding: 4,
        alignItems: 'center',
    },
    textListHead: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        fontFamily: 'Prompt_400Regular',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    listItemCon: {
      marginTop: Platform.select({
          ios: 35,
          android: 35,
      }),
      paddingHorizontal: 0,
      // iOS shadow properties
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 1,
      // Android shadow (elevation)
      elevation: 10,
  },
    backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 3,
        borderRadius: 50,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },

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
    fontFamily: 'Prompt_500Medium',
  },
  label: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 14
  },
  formAction: {
  
    marginTop: 10,
    marginBottom: 50
  },
  iconAdd: {
    color: '#f47524',
  },
  addBranch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 1
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  headerPage: {
    padding: 20,
    fontFamily: 'Prompt_500Medium',
    fontSize: 18,
    marginTop: -5
  },
  input: {
    marginBottom: 10,
  },
  inputLabel: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#121F43',
    marginBottom: 8,
  },
  inputControl: {
    height: 45,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'solid',
  },
 
  card: {
    paddingTop: 15,
    position: 'static',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    padding: 10,
  },
  headBranch: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 15,
    marginTop: -3
  },
  phoneText: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 12,
    marginTop: -5
  },
  addressText: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 5,
    height: 30,
    color: '#666'
  },
  innerItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 1,
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.5, // Specifies the width of the bottom border
    borderBottomColor: '#d7d7d7',
  },
});