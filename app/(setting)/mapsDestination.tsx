import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ActivityIndicator, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function MapsDestination() {
  const [location, setLocation] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);
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
        setProvince(address[0].region);
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
      setProvince(address[0].region);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      {/* Wrap the entire UI in TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  <Text style={styles.inputLabel}>ที่อยู่</Text>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={adddress2 => setForm({ ...form, adddress2 })}
                    placeholder="ระบุบ้านเลขที่"
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.adddress2}
                  />
                </View>

                <View style={styles.input}>
                  <Text style={styles.inputLabel}>ขื่อสำหรับติดต่อ</Text>
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
                  <Text style={styles.inputLabel}>เบอร์สำหรับติดต่อ</Text>
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
                  <Text style={styles.inputLabel}>หมายเหตุ</Text>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={remark2 => setForm({ ...form, remark2 })}
                    placeholder="หมายเหตุถึงคนขับรถ"
                    placeholderTextColor="#6b7280"
                    style={styles.inputControl}
                    value={form.remark2}
                  />
                </View>

                {province && (
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
                )}
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
                    selectedLat2: pickedLocation.latitude,
                    selectedLng2: pickedLocation.longitude,
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
