import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // นำเข้าจากแพ็กเกจใหม่

import mockAddress from '../../hooks/new_data.json'; // นำเข้าข้อมูลที่อยู่
import api from '../../hooks/api'; // Axios instance


const CreateBranch = () => {

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    province: '',
    postcode: '',
    district: '',
    subdistrict: '',
    code: '',
    timer: '',
    admin_branch: ''
  });

  const MockAddress = mockAddress; // ใช้ข้อมูลที่นำเข้า
  const [provinceIndex, setProvinceIndex] = useState(0); // เก็บ Index ของจังหวัด
  const [amphoeIndex, setAmphoeIndex] = useState(0); // เก็บ Index ของอำเภอ
  const [tambonIndex, setTambonIndex] = useState(0); // เก็บ Index ของตำบล
  const [zipcode, setZipcode] = useState(''); // เก็บ Zipcode

  const handleSelectProvince = (itemValue, itemIndex) => {
    setProvinceIndex(itemIndex);
    setAmphoeIndex(0); // รีเซ็ตอำเภอ
    setTambonIndex(0); // รีเซ็ตตำบล
    setForm({ ...form, province: itemValue }); // อัปเดตฟอร์ม
  };

  const handleSelectAmphoe = (itemValue, itemIndex) => {
    setAmphoeIndex(itemIndex);
    setTambonIndex(0); // รีเซ็ตตำบล
    setForm({ ...form, district: itemValue }); // อัปเดตฟอร์ม
  };

  const handleSelectTambon = (itemValue, itemIndex) => {
    setTambonIndex(itemIndex);
    const selectedTambon = MockAddress[provinceIndex][1][amphoeIndex][1][itemIndex];
    setZipcode(selectedTambon[1][0]); // ตั้งค่า Zipcode
    setForm({ ...form, subdistrict: itemValue, postcode: selectedTambon[1][0] }); // อัปเดตฟอร์ม
  };



  const handleCreate = async () => {
    setLoading(true); // เริ่มการโหลด
    try {
      // ส่งคำขอแบบ POST ไปยัง API
      console.log('form', form)
      const response = await api.post('/user-branch-create', form);
      
      if (response.status === 200) {
        Alert.alert('สำเร็จ', 'สร้างสาขาใหม่สำเร็จแล้ว');
        router.push('(branch)');
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่สามารถสร้างสาขาได้');
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false); // หยุดการโหลด
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.listItemCon}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Link href="/(branch)" style={{ padding: 10 }}>
              <Ionicons name="chevron-back" size={30} color="black" />
            </Link>
            <View style={styles.textListHead}>
              <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium' }}>สร้างสาขาใหม่</Text>
            </View>
            <View>
              <Ionicons style={{ padding: 10 }} name="notifications-outline" size={27} color="black" />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.form}>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>ชื่อสาขา</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={name => setForm({ ...form, name })}
                placeholder="สาขาพระรามเก้า"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.name}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>รหัสสาขา</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={code => setForm({ ...form, code })}
                placeholder="ZX13248384394"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.code}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>ชื่อเจ้าหน้าที่รับของ</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={admin_branch => setForm({ ...form, admin_branch })}
                placeholder="คุณอ้อ"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.admin_branch}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>ช่วงเวลาส่งของ</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={timer => setForm({ ...form, timer })}
                placeholder="09.00 - 17.00"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.timer}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>เบอร์ติดต่อ</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="number-pad"
                onChangeText={phone => setForm({ ...form, phone })}
                placeholder="09578512xxx"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.phone}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>อีเมล</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="email@email.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>ที่อยู่สาขา</Text>
              <TextInput
                clearButtonMode="while-editing"
                onChangeText={address => setForm({ ...form, address })}
                placeholder="บ้านเลขที่ ซอย หมู่ ถนน"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.address}
              />
            </View>

            {/* Picker สำหรับเลือกจังหวัด, อำเภอ, ตำบล */}
            <View style={styles.container}>
              <Text style={styles.label}>กรุณาเลือกจังหวัด</Text>
              <Picker selectedValue={MockAddress[provinceIndex][0]} onValueChange={handleSelectProvince}>
                {MockAddress.map((province, index) => (
                  <Picker.Item key={index} label={province[0]} value={province[0]} />
                ))}
              </Picker>

              <Text style={styles.label}>กรุณาเลือกอำเภอ</Text>
              <Picker selectedValue={MockAddress[provinceIndex][1][amphoeIndex][0]} onValueChange={handleSelectAmphoe}>
                {MockAddress[provinceIndex][1].map((amphoe, index) => (
                  <Picker.Item key={index} label={amphoe[0]} value={amphoe[0]} />
                ))}
              </Picker>

              <Text style={styles.label}>กรุณาเลือกตำบล</Text>
              <Picker selectedValue={MockAddress[provinceIndex][1][amphoeIndex][1][tambonIndex][0]} onValueChange={handleSelectTambon}>
                {MockAddress[provinceIndex][1][amphoeIndex][1].map((tambon, index) => (
                  <Picker.Item key={index} label={tambon[0]} value={tambon[0]} />
                ))}
              </Picker>

              <Text style={styles.label}>รหัสไปรษณีย์: {zipcode}</Text>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleCreate} disabled={loading}>
                <View style={styles.btn}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>สร้าง</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default CreateBranch


const styles = StyleSheet.create({

  container: {
    padding: 20,
  },
  textListHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    fontFamily: 'Prompt_400Regular',
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 45,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#666',
    borderStyle: 'solid',
    marginBottom: 10
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
  listItemCon: {
    paddingTop: 40,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
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