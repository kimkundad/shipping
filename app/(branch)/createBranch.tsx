import React, { useState, useEffect, useRef  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, ActivityIndicator, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Link, router } from 'expo-router';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../hooks/api'; // Axios instance
import provinceData from '../../assets/raw/raw_database.json';
import axios from 'axios';
import Constants from 'expo-constants';
import { useTranslation } from "react-i18next";

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;

type CoordinatesType = {
  latitude: number;
  longitude: number;
} | null;

type RootStackParamList = {
  service: {
    selectedLat2: number;
    selectedLng2: number;
    form: {
      adddress2: string;
      name2: string;
      phone2: string;
      remark2: string;
      province2: string;
    };
  };
  // Add other routes here
};

export default function CreateBranch() {

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationType>(null);
  const [pickedLocation, setPickedLocation] = useState<CoordinatesType>(null);
  const [province, setProvince] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const mapRef = useRef(null); // ใช้สำหรับ MapView
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { i18n, t } = useTranslation();

  const pinImage = require('../../assets/images/pin_app.png');
  
  
  const GOOGLE_API_KEY =
  Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;


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

        console.log('latitude', latitude, 'longitude', longitude)

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
          
        

          const addr = address[0];
          const formattedAddress = `${addr.street || ''} ${addr.district || ''} ${addr.subregion || ''} ${addr.region || ''} ${addr.country || ''} ${addr.postalCode || ''}`.trim();

          // Find matching province from JSON based on postal code
          const zipcode = address[0].postalCode;
          
          const provinceEntry = provinceData.find(
            (entry) => entry.zipcode.toString() === zipcode
          );
      
          console.log('provinceEntry.province----->', provinceEntry.province)
      if (provinceEntry) {
        setProvince(provinceEntry.province);
        console.log('Matched Province:', provinceEntry.province);
      } else {
        console.warn('Province not found for this postal code');
      }

          // Update the form with the fetched province and coordinates
          setForm((prevForm) => ({
            ...prevForm,
            province: provinceEntry.province, // Set the province
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



    // ใช้ useEffect เพื่อดูการเปลี่ยนแปลงของ isMapVisible
    useEffect(() => {
      const timer = setTimeout(() => setIsMapVisible(true), 2000);
      return () => clearTimeout(timer);
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
      console.log('address[0].postalCode', address[0].postalCode)
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
      setLoading(false);
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



  const searchPlaces = async (text) => {
    setQuery(text); // ตั้งค่าข้อความที่ผู้ใช้พิมพ์ใน TextInput
    if (text.length > 1) {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: text,
            key: GOOGLE_API_KEY,
            language: 'th', // กำหนดภาษาเป็นภาษาไทย
            components: 'country:th',
          },
        }
      );
      console.log('response.data.predictions', response)
      setResults(response.data.predictions); // เก็บผลลัพธ์การค้นหา
    } else {
      setResults([]); // หากข้อความสั้นเกินไป ให้ล้างผลลัพธ์
    }
  };

  const selectPlace = async (placeId, description) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
          },
        }
      );

      console.log('response.data', response.data)

      if (response.data && response.data.result) {
        const { lat, lng } = response.data.result.geometry.location;

        setPickedLocation({ latitude: lat, longitude: lng });

        // เลื่อน MapView ไปยังตำแหน่งที่เลือก
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            1000 // เวลาในหน่วยมิลลิวินาที
          );
        }


      //  setQuery(description);
        setForm((prevForm) => ({
          ...prevForm,
          province: province,
          address: description,
        }));
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      Alert.alert('Error', 'ไม่สามารถดึงข้อมูลสถานที่ได้');
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
          
              <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
                                <View
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                        padding: 5,
                                        borderRadius: 25
                                    }}
                                >
                                    <Ionicons name="chevron-back" size={20} color="black" />
                                </View>
                            </TouchableOpacity>
         
            </View>


            {isMapVisible && location ? (
              <MapView
                ref={mapRef} // อ้างอิงถึง MapView
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
        placeholder={t("branch.findMap")}
        value={query}
        onChangeText={searchPlaces}
        style={[styles.inputControl]}
        clearButtonMode="while-editing"
        multiline={true}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectPlace(item.place_id, item.description)}>
            <Text style={styles.resultItem}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
       </View>


                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={address => setForm({ ...form, address })}
                      placeholder={t("receipt.ReceiptaddressMark")}
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
                      placeholder={t("branch.branch_name")}
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.name}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={code => setForm({ ...form, code })}
                      placeholder={t("branch.code")}
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.code}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={admin_branch => setForm({ ...form, admin_branch })}
                      placeholder={t("branch.receiving")}
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      value={form.admin_branch}
                    />
                  </View>

                  <View style={styles.input}>
                    <TextInput
                      clearButtonMode="while-editing"
                      onChangeText={timer => setForm({ ...form, timer })}
                      placeholder={t("branch.time")}
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
                      placeholder={t("profile.phone")}
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
                  <Text style={styles.greenButtonText}>{t("branch.createBtn")}</Text>
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
  btnBack: {
    backgroundColor: 'rgba(0, 19, 255, 0.2)',
    width: 45,
    borderRadius: 99,
    padding: 6,
    alignItems: 'center'
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    height: 350,
  },
  botfrom: {
 
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
    marginBottom: 20
  },
  greenButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Prompt_500Medium',
  },
});
