import { StyleSheet, Image, Text, View, Platform, FlatList, ActivityIndicator, KeyboardAvoidingView, ScrollView, Alert, Linking, TouchableOpacity, RefreshControl } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MapViewDirections from 'react-native-maps-directions';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../hooks/api'; // Axios instance
import DeviveryStatus from '../../components/DeviveryStatus'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';
import { UserContext } from '../../hooks/UserContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import Constants from 'expo-constants';

export default function Tracking() {

  const { userProfile } = useContext(UserContext);
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const currentLanguage = i18n.language;

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

  const { id, dataOrder } = useLocalSearchParams(); // รับพารามิเตอร์ id
  
  let parsedDataOrder = null;

  if (typeof dataOrder === 'string') {
    try {
      parsedDataOrder = JSON.parse(dataOrder);
    } catch (error) {
      console.error('Error parsing dataOrder:', error);
    }
  }

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [timeLine, setTimeLine] = useState([]);

  const [order, setData] = useState<Order | null>(null);

  useEffect(() => {
    if (typeof dataOrder === 'string') {
      try {
        const parsedData: Order = JSON.parse(dataOrder); // แปลง `dataOrder` กลับเป็นวัตถุ
        
        setData(parsedData); // ตั้งค่า `order`
        setTimeLine(parsedData?.data?.timeline || []);
        
      } catch (error) {
        console.error('Error parsing dataOrder:', error);
      }
    } else {
      console.error('dataOrder is not a valid string:', dataOrder);
    }
  }, [dataOrder]); // ทำงานเมื่อ `dataOrder` เปลี่ยน

  

  //const [origin, setOrigin] = useState(null); // เก็บตำแหน่งต้นทาง
  //const [destination, setDestination] = useState(null); // เก็บตำแหน่งปลายทาง
  //const [carTack, setCarTack] = useState(null); // เก็บตำแหน่งปลายทาง

  const [destination, setDestination] = useState({
    latitude: parseFloat(parsedDataOrder?.latitude2) || 13.756331,
    longitude: parseFloat(parsedDataOrder?.longitude2) || 100.501762,
  });


  const [origin, setOrigin] = useState({
    latitude: parseFloat(parsedDataOrder?.latitude) || 13.756331,
    longitude: parseFloat(parsedDataOrder?.longitude) || 100.601762,
  });


  const [carTack, setCarTack] = useState({
    latitude: parseFloat(parsedDataOrder?.d_lat) || 13.756331,
    longitude: parseFloat(parsedDataOrder?.d_long) || 100.701762,
  });



      const GOOGLE_MAPS_APIKEY =
      Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;
  
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/getOrderByID/${id}`);
      const timeline = response?.data?.timeline;
  
      if (timeline) {
        // ตั้งค่าข้อมูลที่ดึงมาจาก API
        setTimeLine(timeline || []);
        console.log('timeline', timeline)
  
      } else {
        console.warn('Invalid order data or missing coordinates');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log('Origin:', origin);
    console.log('Destination:', destination);
    console.log('Car Track:', carTack);
  }, [origin, destination, carTack]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
    setRefreshing(false);
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

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

  const handleCancelInvoice = async (id) => {
    setLoading(true); // Start loading
    try {

      const response = await api.post('/cancelInvoice', { id });

      if (response.data.success === true) {
        Alert.alert('สำเร็จ', 'ระบบได้ทำการยกเลิกบริการนี้แล้ว', [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '(tabs)',
            }),
          },
        ]);

      } else {
        Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการยกเลิกบริการ');
      }

    } catch (error) {
      Alert.alert('ข้อผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false); // Stop loading
    }

  }

  const handleSendInvoice = async (id) => {

    if (userProfile?.ReceiptStatus === 1) {


      setLoading(true); // Start loading
      try {

        const response = await api.post('/generatePDFtoMail', { id });
        console.log('response.data', response.data)

        if (response.data.success === true) {
          Alert.alert('ใบเสร็จรับเงิน', 'ถูกส่งไปยังอีเมลของท่านแล้ว');
        } else {
          Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการส่งอีเมล');
        }

      } catch (error) {
        Alert.alert('ข้อผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      } finally {
        setLoading(false); // Stop loading
      }

    } else {

      Alert.alert(
        'ข้อผิดพลาด',
        'กรุณาเพิ่มข้อมูลการรับใบเสร็จก่อน',
        [
          {
            text: 'กรอกข้อมูลใบเสร็จ',
            onPress: () => router.push({
              pathname: '(setting)/receipt',
              params: { id: id } // Add 'id' parameter here
            }),
          },
        ]
      );

    }

    //  Alert.alert('ใบเสร็จรับเงิน', 'ถูกส่งไปยังอีเมลของท่านแล้ว');
  };

  const handleDownloadPDF = async (id) => {


    if (userProfile?.ReceiptStatus === 1) {

      setLoading(true); // Start loading
      try {
        // Send POST request to the API

        const response = await api.post('/generate-pdf', { id }, { responseType: 'arraybuffer' });
        console.log('-->', response.data)

        // Check if the response is valid
        if (!response || !response.data) {
          throw new Error('Failed to generate PDF');
        }

        // Convert the response data to a base64 string
        const base64Data = Buffer.from(response.data, 'binary').toString('base64');

        // Define the file path to save the PDF
        const fileUri = `${FileSystem.documentDirectory}${id}.pdf`;

        // Save the PDF to the filesystem
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Alert the user and offer to open the PDF
        Alert.alert('PDF Downloaded', 'Do you want to open it?', [
          {
            text: 'Open',
            onPress: () => handleOpenPDF(fileUri),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);

      } catch (error) {
        Alert.alert('ข้อผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      } finally {
        setLoading(false); // Stop loading
      }

    } else {

      Alert.alert(
        'ข้อผิดพลาด',
        'กรุณาเพิ่มข้อมูลการรับใบเสร็จก่อน',
        [
          {
            text: 'กรอกข้อมูลใบเสร็จ',
            onPress: () => router.push({
              pathname: '(setting)/receipt',
              params: { id: id } // Add 'id' parameter here
            }),
          },
        ]
      );

    }


  };

  const handleOpenPDF = async (fileUri) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Use the Sharing API to open the PDF
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert(
        'Error',
        (error instanceof Error ? error.message : 'Failed to open the PDF')
      );
    }
  };

  const TimelineItem = ({ item, isLastItem }) => {
    const icon = item.icon || 'circle';

    let description, status;

    // ตรวจสอบภาษาปัจจุบัน
    if (currentLanguage === 'th-TH') {
      description = item.description;
      status = item.status;
    } else if (currentLanguage === 'zh-CN') {
      description = item.descriptionCn;
      status = item.statusCn;
    } else if (currentLanguage === 'en-US') {
      description = item.descriptionEn;
      status = item.statusEn;
    } else {
      description = item.descriptionEn; // ค่าเริ่มต้นเป็นภาษาอังกฤษ
      status = item.statusEn;
    }

    return (
      <View style={styles.timelineItem}>
        {/* Icon */}
        <View style={[styles.iconContainer, item.active ? styles.activeIcon : styles.inactiveIcon]}>
          <MaterialIcons name={icon} size={24} color={item.active ? '#f47524' : '#cfcfcf'} />
        </View>
        {/* Line */}
        {!isLastItem && (
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
        )}
        {/* Date and Details */}
        <View style={styles.textContainer}>
          <Text style={[styles.dateText, item.active ? styles.activeText : styles.inactiveText]}>
            {item.date} {isLastItem}
          </Text>
          {item.status && (
            <Text style={[styles.statusText, item.active ? styles.activeText : styles.inactiveText]}>
              {status}
            </Text>
          )}
          <Text style={[styles.descriptionText, item.active ? styles.activeText : styles.inactiveText]}>
            {description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#f5f5f5' }} >
      <StatusBar style="dark" />

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

       {/* Place other components here that appear above the FlatList items */}
       {destination && (
          <View>

{origin && destination && (
            <MapView
              initialRegion={{
                latitude: 13.7758339,
                longitude: 100.7054306,
                latitudeDelta: 0.4222,
                longitudeDelta: 0.4221,
              }}
              style={styles.map} >
              {origin && destination && (
                <>
                  <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="hotpink"
                    mode='DRIVING'
                    language='th'
                  />
                  {destination && (
                    <Marker coordinate={destination} title="Destination" />
                  )}
                  {order?.status_dri === 1 ? (
                    <>
                      <MapViewDirections
                        origin={carTack}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                        mode='DRIVING'
                        language='th'
                      />
                      <Marker
                        coordinate={carTack}
                        title="Destination Point"
                      >
                        <Image source={require('../../assets/images/truck.png')} style={{ height: 35, width: 35 }} />
                      </Marker>
                    </>
                  ) : (
                    <Marker
                      coordinate={origin}
                      title="Destination Point"
                    >
                      <Image source={require('../../assets/images/truck.png')} style={{ height: 35, width: 35 }} />
                    </Marker>
                  )}
                </>
              )}


            </MapView>
)}

          </View>
        )}


<View style={styles.boxItemList}>
      <FlatList
        data={timeLine}
        renderItem={({ item, index }) => (
          <TimelineItem item={item} isLastItem={index === timeLine?.length - 1} />
        )}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
           
            <View style={styles.container}>



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
        <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 13, color: '#666' }}>{t("tracking.transportation")}, </Text>
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
      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.destination")}</Text>
      <Text style={{ fontWeight: 700, fontSize: 13 }}>{order?.b_name}</Text>
    </View>
    <View style={styles.flexItem2}>
      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.total")}</Text>
      <Text style={{ fontWeight: 700, fontSize: 13 }}>{order?.weight}</Text>
    </View>
  </View>

  {order?.branch_id === 0 ? (

    <View style={styles.textBoxDetail}>
      <View style={styles.flexItem}>
        <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.recipient")}</Text>
        <Text style={{ fontWeight: 700, fontSize: 13 }}>{order?.b_recive_name}</Text>
      </View>
      <View style={styles.flexItem2}>
        <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.type")}</Text>
        <Text style={{ fontWeight: 700, fontSize: 13 }}> {order?.type}, size : {order?.size}</Text>
      </View>
    </View>

  ) : (

    <View style={styles.textBoxDetail}>
      <View style={styles.flexItem}>
        <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.recipient")}</Text>
        <Text style={{ fontWeight: 700, fontSize: 13 }}>{order?.b_recive_name}</Text>
      </View>
      <View style={styles.flexItem2}>
        <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.type")}</Text>
        <Text style={{ fontWeight: 700, fontSize: 13 }}> {order?.dri_type}, {order?.dri_no_car}</Text>
      </View>
    </View>

  )}


</View>










          </>
        }
      />
      </View>

      <View style={{ paddingHorizontal:10 ,paddingVertical: 10 }}>
      {order?.order_status === 0 && (

<TouchableOpacity
  style={{ marginTop: 15 }}
  onPress={() => handleCancelInvoice(order?.id)}
>
  <View style={styles.btnDanger}>
    <Text style={styles.btnText}>{t("home.Cancel_service")}</Text>
  </View>
</TouchableOpacity>

)}


{order?.order_status === 2 &&
(
  <View>
{order?.user_re_status === 0 &&
(
                <TouchableOpacity
                  style={styles.greenButton}
                  onPress={() => {
                    router.push({
                      pathname: '(setting)/ratting',
                      params: {
                        id: order.id
                      }
                    })
                  }}
                >
                  <Text style={styles.greenButtonText}>{t("home.getProduct")}</Text>
                </TouchableOpacity>
)}

    <TouchableOpacity style={styles.button} onPress={() => handleSendInvoice(order?.id)}>
      {loading ? (
        <ActivityIndicator size="small" color="#e67e22" />
      ) : (
        <MaterialIcons name="email" size={24} color="#e67e22" />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{loading ? 'กำลัง' : ''}{t("home.Send_a_receipt")}</Text> 
        {userProfile?.Receiptemail ? (
          <Text style={styles.subtitle}>{t("home.Send_to")} {userProfile?.Receiptemail}</Text>
        ) : (
          <Text style={styles.subtitle}>{t("home.set_mail")}</Text> 
        )}
      </View>
    </TouchableOpacity>


    {/* Download PDF Button */}
    <TouchableOpacity style={styles.button} onPress={() => handleDownloadPDF(order?.id)}>
      <Feather name="download" size={24} color="#e67e22" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Download PDF</Text>
      </View>
    </TouchableOpacity>

  </View>
)
}
      </View>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  greenButton: {
    
    backgroundColor: '#f44336',
    borderColor: '#f44336',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15
  },
  greenButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Prompt_500Medium',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#f44336',
    borderColor: '#f44336',
    marginBottom: 30
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#fff',
    fontFamily: 'Prompt_500Medium',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
    paddingHorizontal: 8
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  activeIcon: {
    backgroundColor: '#ffe8d9', // Light green background for active items
  },
  inactiveIcon: {
    backgroundColor: '#f0f0f0', // Light gray background for inactive items
  },
  btnBack: {
    backgroundColor: 'rgba(0, 19, 255, 0.2)',
    borderRadius: 10,
    padding: 4,
    alignItems: 'center',
  },
  lineContainer: {
    position: 'absolute',
    left: 19,
    top: 40,
    bottom: -30, // This makes the line stretch to the bottom of the container
    width: 2,
    flexGrow: 1, // Allow the container to grow with the content
  },
  line: {
    flex: 1,
    backgroundColor: '#cfcfcf',
  },
  textContainer: {
    marginLeft: 20,
    flexShrink: 1,
  },
  dateText: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 14,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Prompt_500Medium',
    color: '#1abc9c',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    flexWrap: 'wrap', // Allow wrapping
    flexShrink: 1, // Shrink text to fit within the available space
    fontFamily: 'Prompt_400Regular',
  },
  activeText: {
    color: '#121F43',
  },
  inactiveText: {
    color: '#666',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 0.4,
    borderColor: '#666',
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 8
  },
  title: {
    fontSize: 16,
    fontFamily: 'Prompt_500Medium',
    color: '#000',

  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Prompt_400Regular',
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
    padding: 10,
    borderBottomWidth: 0.5, // Specifies the width of the bottom border
    borderBottomColor: '#d7d7d7',
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
    marginHorizontal: 12
  },
  boxItemList2: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 0,
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