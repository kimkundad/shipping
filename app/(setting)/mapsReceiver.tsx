import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native'; // ใช้สำหรับการทำงานของปุ่ม back
import { Stack, router } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function MapsReceiver() {
  const [location, setLocation] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null); // ตำแหน่งที่ผู้ใช้เลือก
  const [province, setProvince] = useState(''); // State to hold province name
  const navigation = useNavigation(); // สำหรับปุ่ม Back
  const route = useRoute(); // ใช้ useRoute เพื่อเข้าถึง route.params
  const pinImage = require('../../assets/images/pin_app.png'); // ระบุตำแหน่งรูปภาพ

  const [form, setForm] = useState({
    adddress: '',
    name: '',
    phone: '',
    remark: '',
    province: ''
  });

  // ขอสิทธิ์การเข้าถึงตำแหน่งและดึงตำแหน่ง GPS
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setPickedLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      // Fetch province name through reverse geocoding
      const address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address && address.length > 0) {
        setProvince(address[0].region); // Save province name from reverse geocode
      }
    })();
  }, []);
  
  // ฟังก์ชันสำหรับการเลือกตำแหน่งจากแผนที่
  const selectLocationHandler = async (event) => {
    const selectedLat = event.nativeEvent.coordinate.latitude;
    const selectedLng = event.nativeEvent.coordinate.longitude;

    setPickedLocation({
      latitude: selectedLat,
      longitude: selectedLng,
    });

    // Fetch province name for selected location
    const address = await Location.reverseGeocodeAsync({
      latitude: selectedLat,
      longitude: selectedLng,
    });

    if (address && address.length > 0) {
      setProvince(address[0].region); // Update province based on selected location
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts behavior based on platform
    keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0} // Adjust if needed to prevent overlapping
  >
    <View style={styles.container}>
      {/* ปุ่ม Back */}
      <View style={styles.backButtonContainer}>
        <View style={styles.btnBack}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
        </View>
      </View>

      {/* แสดงแผนที่ */}
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location}
          liteMode={false}  // ให้แผนที่ทำงานเต็มที่เพื่อตอบสนองต่อการปักหมุด
          onPress={selectLocationHandler} // ให้ผู้ใช้เลือกตำแหน่งเพิ่มเติมได้
        >
          {/* ปักหมุดตำแหน่งปัจจุบัน (จุดสีน้ำเงิน) */}
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Your Location"
            pinColor="blue" // สีหมุดเป็นสีฟ้า
          />

          {/* วงกลมรอบตำแหน่งปัจจุบัน */}
          <Circle
            center={{ latitude: location.latitude, longitude: location.longitude }}
            radius={100} // รัศมี 100 เมตร
            strokeColor="rgba(0, 112, 255, 0.5)" // ขอบสีฟ้า
            fillColor="rgba(0, 112, 255, 0.2)"   // ภายในสีฟ้าจางๆ
          />

          {/* ปักหมุดตำแหน่งที่ผู้ใช้เลือก */}
          {pickedLocation && (
            <Marker
            title="Selected Location"
            coordinate={pickedLocation} // ตรวจสอบว่า pickedLocation มีค่าก่อนใช้งาน
            image={pinImage} // ใช้รูปภาพของคุณสำหรับตำแหน่งที่ผู้ใช้เลือก
            onPress={() => {
              if (pickedLocation) {
                Alert.alert('Selected Location', `Lat: ${pickedLocation.latitude}, Lng: ${pickedLocation.longitude}`);
              } else {
                Alert.alert('Error', 'No location selected');
              }
            }}
          />
          )}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}

      {/* ปุ่มสีเขียวสำหรับยืนยันตำแหน่ง */}
      {pickedLocation && (
        <View style={styles.botfrom}>


<View style={styles.form}>

<View style={styles.input}>
  <Text style={styles.inputLabel}>ที่อยู่</Text>
  <TextInput
    clearButtonMode="while-editing"
    onChangeText={adddress => setForm({ ...form, adddress })}
    placeholder="ระบุบ้านเลขที่"
    placeholderTextColor="#6b7280"
    style={styles.inputControl}
    value={form.adddress}
  />
</View>

<View style={styles.input}>
  <Text style={styles.inputLabel}>ขื่อสำหรับติดต่อ</Text>
  <TextInput
    clearButtonMode="while-editing"
    onChangeText={name => setForm({ ...form, name })}
    placeholder="ชื่อ"
    placeholderTextColor="#6b7280"
    style={styles.inputControl}
    value={form.name}
  />
</View>

<View style={styles.input}>
  <Text style={styles.inputLabel}>เบอร์สำหรับติดต่อ</Text>
  <TextInput
    clearButtonMode="while-editing"
    onChangeText={phone => setForm({ ...form, phone })}
    placeholder="เบอร์โทรศัพท์"
    placeholderTextColor="#6b7280"
    style={styles.inputControl}
    value={form.phone}
  />
</View>

<View style={styles.input}>
  <Text style={styles.inputLabel}>หมายเหตุถึงคนขับรถ</Text>
  <TextInput
    clearButtonMode="while-editing"
    onChangeText={remark => setForm({ ...form, remark })}
    placeholder="หมายเหตุถึงคนขับรถ"
    placeholderTextColor="#6b7280"
    style={styles.inputControl}
    value={form.remark}
  />
</View>

{/* <View>
{province && (
  <View style={styles.input}>
    <Text style={styles.inputLabel}>จังหวัด</Text>
    <TextInput
      clearButtonMode="while-editing"
      editable={false}  // Make this field non-editable, since it's auto-populated
      placeholder="จังหวัด"
      placeholderTextColor="#6b7280"
      style={styles.inputControl}
      value={province}  // Display the province from the reverse geocode
    />
  </View>
)}
</View> */}


</View>
<TouchableOpacity
  style={styles.greenButton}
  onPress={() => {

    // Validate form inputs before submitting
    if (!form.adddress || !form.name || !form.phone ) {
      Alert.alert('กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน');
      return; // Prevent navigation if validation fails
    }

    navigation.navigate('service', {
      ...route.params, // รวมข้อมูลที่มีอยู่แล้ว (ข้อมูลจาก MapsDestination หากมี)
      selectedLat: pickedLocation.latitude,
      selectedLng: pickedLocation.longitude,
      form: {
        ...route.params?.form, // รวมฟอร์มเดิมที่ส่งมาจาก MapsDestination ถ้ามี
        adddress: form.adddress,
        name: form.name,
        phone: form.phone,
        remark: form.remark,
        province: province,
      },
    });
  }}
>
  <Text style={styles.greenButtonText}>เลือกจุดหมายปลายทางนี้</Text>
</TouchableOpacity>
        </View>
      )}
    </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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
  btnBack: {
    backgroundColor: '#fff',
    width: 45,
    borderRadius: 99,
    padding: 6,
    alignItems: 'center'
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  botfrom: {
    position: 'absolute',
    width: '100%',
        bottom: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
  },
  greenButton: {
    
    backgroundColor: '#28a745', // สีเขียว
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  greenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
