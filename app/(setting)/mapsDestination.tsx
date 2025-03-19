import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, ScrollView, Alert, ActivityIndicator, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Circle, PROVIDER_GOOGLE  } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialIcons, EvilIcons  } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import provinceData from '../../assets/raw/raw_database.json';
import axios from 'axios';
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

export default function MapsDestination() {
  const [location, setLocation] = useState<LocationType>(null);
  const [pickedLocation, setPickedLocation] = useState<CoordinatesType>(null);
  const [province, setProvince] = useState('');
  const navigation = useNavigation(); 
  const route = useRoute(); 
  const mapRef = useRef(null); // ใช้สำหรับ MapView
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { i18n, t } = useTranslation();
  const [logapi, setLogapi] = useState('');
  

  const GOOGLE_API_KEY =
  Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;

  const pinImage = require('../../assets/images/pin_app.png');

  const [form, setForm] = useState({
    adddress2: '',
    name2: '',
    phone2: '',
    remark2: '',
    province2: ''
  });

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
      

      try {

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

      const address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address && address.length > 0) {

        const addr = address[0];
        const formattedAddress = `${addr.street || ''} ${addr.district || ''} ${addr.subregion || ''} ${addr.region || ''} ${addr.country || ''} ${addr.postalCode || ''}`.trim();
        const zipcode = address[0].postalCode;


        const provinceEntry = provinceData.find(
          (entry) => entry.zipcode.toString() === zipcode
        );
        console.log('provinceEntry.province', provinceEntry.province)
        if (provinceEntry) {
          setProvince(provinceEntry.province);
        }
        setForm((prevForm) => ({ ...prevForm, adddress2: formattedAddress }));
      }

    } catch (error) {
      console.error("Location Error:", error);
    }

    })();
  }, []);

  const selectLocationHandler = async (event) => {
    const selectedLat = event.nativeEvent.coordinate.latitude;
    const selectedLng = event.nativeEvent.coordinate.longitude;

    setPickedLocation({
      latitude: selectedLat,
      longitude: selectedLng,
    });

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
        }
        setForm((prevForm) => ({ ...prevForm, adddress2: formattedAddress }));
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
      console.log('response.data.predictions', response.data.predictions)
      setLogapi(response?.data);
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

      

      setIsModalVisible(false); // ปิด Modal หลังจากเลือกสถานที่

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


        const address = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });
    
        if (address && address.length > 0) {
          const zipcode = address[0].postalCode;
            const provinceEntry = provinceData.find(
              (entry) => entry.zipcode.toString() === zipcode
            );
    
            if (provinceEntry) {
              setProvince(provinceEntry.province);
            }
          }

      //  setQuery(description);
        setForm((prevForm) => ({
          ...prevForm,
          province: province,
          adddress2: description,
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
    >
 
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
      {/* Wrap the entire UI in TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      

        <View style={styles.container}>

          {location ? (
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

              <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.searchButtonText}>{t("branch.findMap")}</Text>
      </TouchableOpacity>

             
      {/* Modal สำหรับแสดงผลการค้นหา */}
      {/* Modal สำหรับการค้นหา */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Input สำหรับการค้นหา */}
              <TextInput
                placeholder={t("branch.findMap")}
                value={query}
                onChangeText={searchPlaces}
                style={styles.inputControl}
                clearButtonMode="while-editing"
              />
              {/* แสดงรายการผลลัพธ์ */}
              <FlatList
                data={results}
                keyExtractor={(item) => item.place_id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => selectPlace(item.place_id, item.description)}
                  >
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
              {/* ปุ่มปิด Modal */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={adddress2 => setForm({ ...form, adddress2 })}
                    placeholder={t("receipt.ReceiptaddressMark")}
                    placeholderTextColor="#6b7280"
                    style={[styles.inputControl, { height: 80 }]}
                    value={form.adddress2}
                    multiline={true}
                  />
                </View>

                {/* <ScrollView style={{ flex: 1, padding: 10 }}>

  <View style={{ marginBottom: 20 }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Raw Response:</Text>
    <ScrollView
      style={{
        maxHeight: 300, 
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text>{JSON.stringify(logapi, null, 2)}</Text>
    </ScrollView>
  </View>

</ScrollView> */}

                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={name2 => setForm({ ...form, name2 })}
                    placeholder={t("branch.name")}
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.name2}
                  />
                </View>

                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={phone2 => setForm({ ...form, phone2 })}
                    placeholder={t("profile.phone")}
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.phone2}
                  />
                </View>

                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={remark2 => setForm({ ...form, remark2 })}
                    placeholder={t("branch.remarkDri")}
                    placeholderTextColor="#6b7280" 
                    style={styles.inputControl}
                    value={form.remark2}
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
                onPress={() => {
                  if (!form.adddress2 || !form.name2 || !form.phone2) {
                    Alert.alert('กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน');
                    return;
                  }

                  navigation.navigate('service', {
                    ...route.params,
                    selectedLat2: pickedLocation?.latitude,
                    selectedLng2: pickedLocation?.longitude,
                    form: {
                      ...route.params?.form,
                      adddress2: form.adddress2,
                      name2: form.name2,
                      phone2: form.phone2,
                      remark2: form.remark2,
                      province2: province,
                    },
                  });
                }}
              >
                <Text style={styles.greenButtonText}>{t("branch.btnF")} </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  searchButton: {
    backgroundColor: "#f47524",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center'
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnBranch: {
    backgroundColor: '#fff',
    width: 45,
    borderRadius: 99,
    padding: 6,
    alignItems: 'center'
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
    backgroundColor: 'rgba(0, 19, 255, 0.2)',
    width: 45,
    borderRadius: 99,
    padding: 6,
    alignItems: 'center'
  },
  btnBackText: {
    backgroundColor: 'rgba(0, 19, 255, 0.2)',
    width: 200,
    borderRadius: 99,
    padding: 6,
    alignItems: 'center'
  },
  inbtnBackText: {
    fontSize: 15,
    fontFamily: 'Prompt_500Medium',
    color: '#333',
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
    fontFamily: 'Prompt_500Medium',

  },
});
