import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Link, router } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../hooks/api'; // Axios instance
import provinceData from '../../assets/raw/raw_database.json';

export default function CreateBranch() {

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [province, setProvince] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const pinImage = require('../../assets/images/pin_app.png');

  const [form, setForm] = useState({
    province: '',
    name: '',
    phone: '',
    address: '',
    code: '',
    timer: '',
    admin_branch: '',
    selectedLat2: null, // Initially set to null, will update after selection
    selectedLng2: null, // Initially set to null, will update after selection
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          return;
        }

        // Fetch the current position
        let loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });

        setPickedLocation({
          latitude,
          longitude,
        });

        // Fetch the province name using reverse geocoding
        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (address && address.length > 0) {
          
          const zipcode = address[0].postalCode;

          const addr = address[0];
          const formattedAddress = `${addr.street || ''} ${addr.district || ''} ${addr.subregion || ''} ${addr.region || ''} ${addr.country || ''} ${addr.postalCode || ''}`.trim();

          
          // Find matching province from JSON based on postal code
          const provinceEntry = provinceData.find(
            (entry) => entry.zipcode.toString() === zipcode
          );

          if (provinceEntry) {
          setProvince(provinceEntry.province);
          console.log('Matched Province:', provinceEntry.province);
          }else {
            console.warn('Province not found for this postal code');
          }

          // Update the form with the fetched province and coordinates
          setForm((prevForm) => ({
            ...prevForm,
            province: province, // Set the province
            selectedLat2: latitude, // Set latitude
            selectedLng2: longitude, // Set longitude
            address: formattedAddress,
          }));
        }

      } catch (error) {
        Alert.alert('Error', 'Failed to fetch location');
      }
    })();
  }, []);

  const selectLocationHandler = async (event) => {
    const selectedLat = event.nativeEvent.coordinate.latitude;
    const selectedLng = event.nativeEvent.coordinate.longitude;

    // Update picked location state
    setPickedLocation({
      latitude: selectedLat,
      longitude: selectedLng,
    });

    // Update form state with selected latitude and longitude
    setForm((prevForm) => ({
      ...prevForm,
      selectedLat2: selectedLat,
      selectedLng2: selectedLng,
    }));

    const address = await Location.reverseGeocodeAsync({
      latitude: selectedLat,
      longitude: selectedLng,
    });

    if (address && address.length > 0) {
      
      const addr = address[0];
      const formattedAddress = `${addr.street || ''} ${addr.district || ''} ${addr.subregion || ''} ${addr.region || ''} ${addr.country || ''} ${addr.postalCode || ''}`.trim();

      const zipcode = address[0].postalCode;

      const provinceEntry = provinceData.find(
        (entry) => entry.zipcode.toString() === zipcode
      );

      if (provinceEntry) {
        setProvince(provinceEntry.province);
        console.log('Matched Province:', provinceEntry.province);
      } else {
        console.warn('Province not found for this postal code');
      }

 
      setForm((prevForm) => ({
        ...prevForm,
        province: province,
        address: formattedAddress,
      }));
    }
  };

  const handleCreate = async () => {
    setLoading(true); // Start loading
    console.log('form', form);
    if (!form.address || !form.name || !form.phone || !form.province || !form.admin_branch || !form.selectedLat2 || !form.selectedLng2) {
      Alert.alert('กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน');
      return;
    }

    try {
      // Send POST request to the API
     
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
      setLoading(false); // Stop loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Wrap the entire UI in TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.backButtonContainer}>
              <View style={styles.btnBack}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {location ? (
              <MapView
                style={styles.map}
                initialRegion={location}
                liteMode={false}
                onPress={selectLocationHandler}
              >
                <Marker
                  coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                  title="Your Location"
                  pinColor="blue"
                />

                <Circle
                  center={{ latitude: location.latitude, longitude: location.longitude }}
                  radius={100}
                  strokeColor="rgba(0, 112, 255, 0.5)"
                  fillColor="rgba(0, 112, 255, 0.2)"
                />

                {pickedLocation && (
                  <Marker
                    title="Selected Location"
                    coordinate={pickedLocation}
                    image={pinImage}
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

            {pickedLocation && (
              <View style={styles.botfrom}>
                <View style={styles.form}>
                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={address => setForm({ ...form, address })}
                      placeholder="ระบุที่อยู่"
                      placeholderTextColor="#6b7280"
                      style={[styles.inputControl, { height: 80 }]}
                      value={form.address}
                      multiline={true}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={name => setForm({ ...form, name })}
                      placeholder="ชื่อสาขา"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.name}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={code => setForm({ ...form, code })}
                      placeholder="รหัสสาขา"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.code}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={admin_branch => setForm({ ...form, admin_branch })}
                      placeholder="ชื่อเจ้าหน้าที่รับของ"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.admin_branch}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={timer => setForm({ ...form, timer })}
                      placeholder="ช่วงเวลาส่งของ 09.00 - 17.00"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.timer}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      keyboardType="number-pad"
                      onChangeText={phone => setForm({ ...form, phone })}
                      placeholder="เบอร์ติดต่อ 09578512xxx"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.phone}
                    />
                  </View>

                  {/* {province && (
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>จังหวัด</Text>
                      <TextInput
                        clearButtonMode="while-editing"
                        editable={false}
                        placeholder="จังหวัด"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={province}
                      />
                    </View>
                  )} */}
                </View>

                <TouchableOpacity
                  style={styles.greenButton}
                  onPress={handleCreate}
                  disabled={loading}
                >
                  <Text style={styles.greenButtonText}>สร้างสาขา</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  greenButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Prompt_500Medium',
  },
});
