import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ActivityIndicator, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import provinceData from '../../assets/raw/raw_database.json';

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <Stack.Screen options={{
                    headerTransparent: true,
                    headerTitle: ' ',
                    headerTitleStyle: {
                        color: 'white', // กำหนดสีของ headerTitle
                        fontFamily: 'Prompt_500Medium', // กำหนดฟอนต์
                        fontSize: 18
                    },
                    headerLeft: () => (
                        <TouchableOpacity style={styles.btnBack} onPress={() =>  navigation.goBack()}>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 6,
                                    borderRadius: 10
                                }}
                            >
                                <Ionicons name="chevron-back" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={styles.btnBackText} onPress={() => router.push('(setting)/selectBarnch')}>
                            <View
                                style={{
                                  backgroundColor: '#fff',
                                    padding: 4,
                                    borderRadius: 10,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap:0
                                }}
                            >
                                <MaterialIcons name="bookmark-border" size={20} color="black" />
                                <Text style={styles.inbtnBackText}> เลือกจากสาขาที่สร้างไว้</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }} />
      {/* Wrap the entire UI in TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      

        <View style={styles.container}>
          

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
                    onChangeText={adddress2 => setForm({ ...form, adddress2 })}
                    placeholder="ระบุบ้านเลขที่"
                    placeholderTextColor="#6b7280"
                    style={[styles.inputControl, { height: 80 }]}
                    value={form.adddress2}
                    multiline={true}
                  />
                </View>

                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={name2 => setForm({ ...form, name2 })}
                    placeholder="ชื่อ"
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.name2}
                  />
                </View>

                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={phone2 => setForm({ ...form, phone2 })}
                    placeholder="เบอร์โทรศัพท์"
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.phone2}
                  />
                </View>

                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={remark2 => setForm({ ...form, remark2 })}
                    placeholder="หมายเหตุถึงคนขับรถ"
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
                <Text style={styles.greenButtonText}>เลือกจุดหมายปลายทางนี้</Text>
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
    fontWeight: 'bold',
  },
});
