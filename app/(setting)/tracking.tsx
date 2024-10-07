import { StyleSheet, Image, Text, View, Platform, ScrollView, Alert, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Timeline from 'react-native-timeline-flatlist';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MapViewDirections from 'react-native-maps-directions';
import { Link, useNavigation, useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { AntDesign } from '@expo/vector-icons';
import api from '../../hooks/api'; // Axios instance
import DeviveryStatus from '../../components/DeviveryStatus'

export default function Tracking() {

  const { id } = useLocalSearchParams(); // รับพารามิเตอร์ id

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0]; // แสดงเวลาในรูปแบบ HH:MM:SS
  };

  interface Order {
    dri_time: string;
    code_order: string;
    dri_phone: string;
    dri_name: string;
    b_name: string;
    amount: string;
    b_recive_name: string;
    dri_type: string;
    dri_no_car: string;
    latitude: number;      // เพิ่ม latitude
    longitude: number;     // เพิ่ม longitude
    latitude2: number;     // เพิ่ม latitude2
    longitude2: number;    // เพิ่ม longitude2
  }

  const [order, setData] = useState<Order | null>(null);
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 }); // เก็บตำแหน่งต้นทาง
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 }); // เก็บตำแหน่งปลายทาง
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCsx9tQ2Mj7WWnunxa8P2blQLcGtjroLVE';

  useEffect(() => {
    // ตรวจสอบว่ามี id หรือไม่ก่อนที่จะดึงข้อมูล
    if (!id) return;

    // ฟังก์ชัน async ที่จะเรียก API
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/getOrderByID/${id}`); // เรียก API เพื่อดึง order ข้อมูลผู้ใช้
        const orderData = response.data.order;

        setData(orderData); // ตั้งค่า order ที่ได้รับจาก API

        // อัพเดทตำแหน่งต้นทางและปลายทาง
        setOrigin({ latitude: orderData.latitude, longitude: orderData.longitude });
        setDestination({ latitude: orderData.latitude2, longitude: orderData.longitude2 });
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder(); // เรียกฟังก์ชันดึงข้อมูลเมื่อ id เปลี่ยนแปลง
  }, [id]); // Depend on id to refetch when it changes


  const handlePress = async () => {
    if (order?.dri_phone) {
      const url = `tel:${order?.dri_phone}`;
      try {
        await Linking.openURL(url);
      } catch (error) {
        Alert.alert('Error', 'Unable to make a phone call');
        console.error('Error:', error);
      }
    } else {
      Alert.alert('Error', 'Phone number is not provided');
    }
  };

  const data = order?.order_status === 0
    ? [
        {
          time: getCurrentTime(), // ใช้เวลาปัจจุบัน
          title: 'กำลังค้นหารถขนส่ง',
          description: 'กำลังค้นหารถขนส่ง',
        },
      ]
    : [
        {
          time: '09:00',
          title: 'กำลังเตรียมพัสดุ',
          description: 'ผู้ส่งกำลังเตรียมพัสดุ',
        },
        {
          time: '10:45',
          title: 'อยู่ระหว่างการขนส่ง',
          description: 'พัสดุออกจากศูนย์คัดแยกสินค้า ไปยัง HSAPA-A - สะพานสูง',
        },
        {
          time: '54:00',
          title: 'การจัดส่งสำเร็จ',
          description: 'พัสดุถูกจัดส่งสำเร็จแล้ว ผู้รับ: กอล์ฟ. ดูหลักฐานการจัดส่งสินค้า.',
        },
      ];

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#f5f5f5' }} >
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.listItemCon}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
                                onPress={() => router.push('(tabs)')}
                            >
                                <View style={{ padding: 10 }}>
                                <Ionicons name="chevron-back" size={28} color="black" />
                                </View>
                            
                            </TouchableOpacity>
            <View style={styles.textListHead} >
              <Text style={{
                fontSize: 16,
                fontFamily: 'Prompt_500Medium',
                paddingTop: 5
              }}>{order?.dri_time}</Text>
            </View>
            <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                    router.push('(setting)/notification');
                  }}>
                  <View>
                    <Ionicons style={{ padding: 10 }} name="notifications-outline" size={27} color="black" />
                  </View>
                </TouchableOpacity>
          </View>
        </View>
        <View>
          <MapView
            initialRegion={{
              latitude: 13.7758339,
              longitude: 100.7054306,
              latitudeDelta: 0.4222,
              longitudeDelta: 0.4221,
            }}
            style={styles.map} >
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"
              mode='WALKING'
              language='th'
            />
            <Marker
              coordinate={destination}
              title="Starting Point"
            />
            <Marker
              coordinate={origin}
              title="Destination Point"
            >
              <Image source={require('../../assets/images/truck.png')} style={{ height: 35, width: 35 }} />
            </Marker>
          </MapView>
        </View>



        <View style={styles.container}>

          <View style={styles.boxItemList}>

            <View style={styles.containerOrderMain}>
              <View style={styles.containerOrder}>
                <View >
                  <Image source={require('../../assets/images/box1.png')}
                    style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                </View>
                <View >
                  <Text style={{ fontWeight: 700, fontSize: 16 }}>#{order?.code_order} </Text>
                  <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>{order?.dri_time}</Text>
                </View>
              </View>
              {/* <View style={styles.textStatus}>
                <Text style={{ color: '#fff', fontSize: 12 }}>On Devivery</Text>
              </View> */}

              <View>
                {/* ส่ง order ทั้งก้อนเข้าไปใน DeviveryStatus */}
                <DeviveryStatus order={order} />
              </View>

            </View>

            {/* profileMain  */}
            <View style={styles.profileMain}>
              <View style={styles.profile}>
                <Image
                  style={styles.userImage}
                  source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }} />
                <View>
                  <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 13, color: '#666' }}>พนักงานขนส่ง,</Text>
                  <View style={styles.showflex}>
                    <Image source={require('../../assets/images/icon_truck.png')}
                      style={{ width: 25, height: 25, marginRight: 2 }} />
                    <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 15 }}>{order?.dri_name}</Text>
                  </View>

                </View>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <Feather style={{ borderWidth: 1, borderRadius: 99, padding: 10, borderColor: '#f47524' }} onPress={handlePress} name="phone" size={20} color="#f47524" />
              </View>
            </View>
            {/* profileMain  */}
            <View style={styles.textBoxDetail}>
              <View style={styles.flexItem}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>{ order?.b_name }</Text>
              </View>
              <View style={styles.flexItem2}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>จำนวน</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>{ order?.weight }</Text>
              </View>
            </View>

            { order?.branch_id === 0 ? (

              <View style={styles.textBoxDetail}>
              <View style={styles.flexItem}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ผู้รับสินค้า</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>{ order?.b_recive_name }</Text>
              </View>
              <View style={styles.flexItem2}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>Type</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}> { order?.type }, size : { order?.size }</Text>
              </View>
              </View>

            ) : (

              <View style={styles.textBoxDetail}>
              <View style={styles.flexItem}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ผู้รับสินค้า</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>{ order?.b_recive_name }</Text>
              </View>
              <View style={styles.flexItem2}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>Type</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}> { order?.dri_type }, { order?.dri_no_car }</Text>
              </View>
            </View>

            )}
            

          </View>


          <View style={styles.boxItemList}>
            <Timeline
              data={data}
              circleSize={20}
              circleColor='#121F43'
              lineColor='#f47524'
              timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
              timeStyle={{
                textAlign: 'center',
                color: '#121F43',
                padding: 5,
                fontWeight: 700,
                borderRadius: 13,
              }}
              descriptionStyle={{ color: 'gray' }}
              options={{
                style: { paddingTop: 10 }
              }}
              innerCircle={'dot'}
            />
          </View>


        </View>
      </ScrollView>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  textBoxDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  flexItem: {

  },
  flexItem2: {
    alignItems: 'flex-end'
  },
  profileMain: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5, // Specifies the width of the bottom border
    borderBottomColor: '#d7d7d7',
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  showflex: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 5
  },
  textListHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    fontFamily: 'Prompt_400Regular',
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
  map: {
    width: '100%',
    height: 300,
  },
  containerOrder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingTop: 2
  },
  containerOrderMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5, // Specifies the width of the bottom border
    borderBottomColor: '#d7d7d7',
    paddingBottom: 5
  },
  textStatus: {
    backgroundColor: '#f47524',
    width: 100,
    borderRadius: 99,
    padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  textStatus2: {
    backgroundColor: '#28a745',
    width: 90,
    borderRadius: 99,
    padding: 6,
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  textStatus3: {
    backgroundColor: '#d9534f',
    width: 90,
    borderRadius: 99,
    padding: 6,
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  boxItemList: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 5,
    marginTop: 12,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow (elevation)
    elevation: 0.8,
  },
});