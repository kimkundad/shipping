import { Image, View, Text, StyleSheet, Dimensions, RefreshControl, Platform, TextInput, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useNavigation, router, Stack, useRouter  } from 'expo-router';
import React, { useEffect, useContext ,useState, useRef } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../hooks/UserContext';
import axios from 'axios';
import api from '../../hooks/api'; // Axios instance
import { useCameraPermissions } from "expo-camera";
import DeviveryStatus from '../../components/DeviveryStatus'
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';


export default function HomeScreen({ navigation }) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userProfile }  = useContext(UserContext);
  const { userOrders, setUserOrders } = useContext(UserContext);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [searchInput, setSearchInput] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Track refresh state

  const onRefresh = async () => {
    setRefreshing(true);
    // Here you can re-fetch data or any other logic for refreshing content
    try {
      const response = await api.get('/user-order-cus');
      setUserOrders(response.data.order); // Refresh user orders
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
    setRefreshing(false);
  };


  const handleScanPress = async () => {
    if (permission?.granted) {
      // ถ้าได้รับสิทธิ์แล้ว ไปที่หน้า scanner
      router.push('/scanner');
    } else {
      // ถ้ายังไม่ได้รับสิทธิ์, ขอสิทธิ์
      const result = await requestPermission();
      if (result.granted) {
        // ถ้าอนุญาตสิทธิ์, ไปที่หน้า scanner
        router.push('/scanner');
      } else {
        // ถ้าไม่อนุญาต, แสดงแจ้งเตือน
        Alert.alert('Permission Denied', 'Camera permission is required to use the scanner.');
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        navigation.navigate('Login');
      }
    };

    checkAuth();
  }, []);

  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // No need to manually fetch the token, as it's added by the interceptor
        const response = await api.get('/user-order-cus');
        setUserOrders(response.data.order); // Set the orders from the response
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders(); // Fetch once when the component mounts

  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    navigation.navigate('Login');
  };

  const handleSearch = async () => {
    try {
      
      const response = await api.post('/checkQrcode', { qrcode: searchInput });

      if (response.data.success === true) {
        Alert.alert('สำเร็จ', 'กำลังโหลดข้อมูล');
  
        router.push({
          pathname: '(setting)/tracking',
          params: { id: response.data.order.id },
        });
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่พบข้อมูลของท่าน');
      }
    } catch (error) {
      console.error('Error checking QR code:', error);
      Alert.alert('Error', 'Error checking the QR code.');
    }
  };

  if (!isAuthenticated) return null; // Prevent rendering until authenticated

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
      <StatusBar style="light" />
      <ScrollView
      
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <View >

          <View style={styles.containerBlue} />
          <View style={styles.container1}>
            {/* profileMain  */}
            <View style={styles.profileMain}>
              <View style={styles.profile}>
                <Image
                  style={styles.userImage}
                  source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }} />
{userProfile ? (
                <View>
                  <View style={styles.showflex}>
                    <Text style={{
                      color: Colors.white, fontSize: 14, fontFamily: 'Prompt_500Medium', fontWeight: 700, marginRight: 5
                    }}>รหัส</Text>
                    <Text style={{
                      color: Colors.white, fontSize: 14, fontFamily: 'Prompt_400Regular',
                    }}>{userProfile.code_user}</Text>
                  </View>
                    <Text style={{ color: Colors.white, fontSize: 18, fontFamily: 'Prompt_400Regular' }}>{userProfile.name},</Text>
                </View>
                ) : (
                  <Text style={{ color: Colors.white, fontSize: 20 }}>Loading...</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/notification');
                }}>
                <View>
                  <Ionicons name="notifications-outline" size={27} color="white" />
                </View>
                </TouchableOpacity>

            </View>
            {/* profileMain  */}
            {/* search bar */}
            <View style={styles.inputContainer}>
              <AntDesign
                onPress={handleScanPress}
                style={styles.iconScan}
                name="scan1"
                size={24}
                color="black"
              />
              <TextInput
                placeholder="Enter your tracking Number"
                style={styles.TextInput}
                value={searchInput}
                onChangeText={setSearchInput}
              />
              <Feather
                style={styles.searchIcon}
                name="search"
                size={24}
                color="gray"
                onPress={handleSearch}
              />
          </View>
            {/* search bar */}
            
            <View style={styles.boxGiff}>

              <View>
                <Carousel
                  loop
                  width={360}
                  height={100}
                  autoPlay={true}
                  autoPlayInterval={4000}
                  data={[...new Array(6).keys()]}
                  scrollAnimationDuration={1000}
                  renderItem={({ index }) => (

                    <View style={styles.giftContent}>
                      <View style={{ width: '70%' }}>
                        <View style={styles.headGiff}>
                          <Text style={styles.textGifforange}>45% </Text>
                          <Text style={styles.textGiffblack}> Discount</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>Get Great Discounts On All your Shipments
                          in the Summer Seasan.</Text>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              // handle onPress
                            }}>
                            <View style={styles.btn}>
                              <Text style={styles.btnText}>Get Now</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Image source={require('../../assets/images/gift.png')}
                          style={{ width: 100, height: 95 }} />
                      </View>
                    </View>

                  )}
                />
              </View>

            </View>


          </View>
        </View>

        <View style={styles.container}>
          {/* content app */}
          <View style={styles.boxMenoCon}>
            <Link replace href="/(branch)">
              <View style={{ alignItems: 'center' }}>
                <View style={styles.boxItem}>
                  <Image source={require('../../assets/images/box1.png')}
                    style={{ width: 55, height: 55 }} />
                </View>
                <Text style={{ fontSize: 13, marginTop: 5, fontFamily: 'Prompt_400Regular', }}>สาขา</Text>
              </View>
            </Link>
            <Link replace href="/(setting)/service">
              <View style={{ alignItems: 'center' }}>
                <View style={styles.boxItem}>
                  <Image source={require('../../assets/images/box3.png')}
                    style={{ width: 55, height: 55 }} />
                </View>
                <Text style={{ fontSize: 12, marginTop: 5, fontFamily: 'Prompt_400Regular' }}>เรียกรถ</Text>
              </View>
            </Link>
            <Link replace href="/(holiday)">
              <View style={{ alignItems: 'center' }}>
                <View style={styles.boxItem}>
                  <Image source={require('../../assets/images/box2.png')}
                    style={{ width: 55, height: 55 }} />
                </View>
                <Text style={{ fontSize: 12, marginTop: 5, fontFamily: 'Prompt_400Regular' }}>แจ้งวันหยุด</Text>
              </View>
            </Link>
            
            <Link replace href="/(contact)">
              <View style={{ alignItems: 'center' }}>
                <View style={styles.boxItem}>
                  <Image source={require('../../assets/images/box4.png')}
                    style={{ width: 55, height: 55 }} />
                </View>
                <Text style={{ fontSize: 13, marginTop: 5, fontFamily: 'Prompt_400Regular', }}>ติดต่อเรา</Text>
              </View>
            </Link>
          </View>
          {/* content app */}


          {/* list item */}
          <View style={styles.listItemCon}>
            <View style={styles.textListHead}>
              <Text style={{ fontSize: 17, fontWeight: 700 }}>Last Activity</Text>
              <Text style={{ fontSize: 13, color: '#f47524', }}>See All</Text>
            </View>
            <View>

            {userOrders && userOrders.length > 0 && (
              <View>
                {userOrders.map(order => (
                  <TouchableOpacity
                  key={order.id}
                  onPress={() => {
                    // handle onPress
                    router.push({
                      pathname: '(setting)/tracking',
                      params: { 
                        id: order.id ,
                        getLatitude: order.latitude2 ,
                        getLongitude: order.longitude2 
                      }, // ส่งพารามิเตอร์ id ของ order
                    });
                  }}>
                <View  style={styles.boxItemList}>
                  <View style={styles.containerOrderMain}>
                    <View style={styles.containerOrder}>
                      <View >
                        <Image source={require('../../assets/images/icon_truck.png')}
                          style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                      </View>
                      <View >
                        <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 14 }}>#{order.code_order}</Text>
                        <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>{order.dri_time}</Text>
                      </View>
                    </View>
                    <DeviveryStatus order={order} />
                  </View>
                  <View style={styles.textBoxDetail}>
                    <View style={styles.flexItem}>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                      <Text style={{ fontWeight: 700, fontSize: 13 }}>{order.b_name}</Text>
                    </View>
                    <View style={styles.flexItem}>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                      <Text style={{ fontWeight: 700, fontSize: 13 }}>{order.amount} kg</Text>
                    </View>
                  </View>
                </View>
                </TouchableOpacity>
                ))}
              </View>
            )}

           
            </View>

          </View>
          {/* list item */}
        </View>
      </ScrollView>



    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerBlue: {
    backgroundColor: '#121F43',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height: 250,
    position: 'absolute',
    width: '100%'
  },
  searchIcon: {
    padding: 10,
  },
  containerOrderMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5, // Specifies the width of the bottom border
    borderBottomColor: '#d7d7d7',
    paddingBottom: 8
  },
  showflex: {
    display: 'flex',
    flexDirection: 'row',
  },
  textBoxDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5
  },
  flexItem: {
    flex: 0.5,
  },
  container1: {
    padding: 20,
    marginTop: 45
  },
  textStatus: {
    backgroundColor: '#f47524',
    width: 90,
    borderRadius: 99,
    padding: 6,
    paddingHorizontal: 8,
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
  containerOrder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,

  },
  container: {
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,

  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  profileMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  TextInput: {
    flex: 1, // ใช้ flex 1 เพื่อให้ช่องป้อนข้อมูลขยายได้เต็มที่
    paddingHorizontal: 10, // เพิ่ม padding ภายใน TextInput
  },
  searchBar: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  inputContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#999',
    paddingHorizontal: 10, // เพิ่ม padding เพื่อให้มีระยะห่างภายใน container
  },
  iconScan: {
    padding: 10,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
  },
  boxGiff: {
    position: 'static',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
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
    elevation: 10,
  },
  textGiffblack: {
    color: Colors.gray,
    fontSize: 17,
    fontWeight: '700'
  },
  textGifforange: {
    color: '#f47524',
    fontSize: 18,
    fontWeight: '700'
  },
  headGiff: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5
  },
  btn: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: '#f47524',
    borderColor: '#f47524',
    width: 80
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  giftContent: {
    display: 'flex',
    flexDirection: 'row'
  },
  boxMenoCon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -20
  },
  boxItem: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow (elevation)
    elevation: 10,
  },
  boxItemList: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 8,
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
    elevation: 5,
  },
  textListHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemCon: {
    marginTop: 15
  },
  innerItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 1
  },
  detailList: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textDetailRight: {
    display: 'flex',
    flexDirection: 'row'
  },
  textMute: {
    color: '#666',
    fontFamily: 'Prompt_400Regular',
  }
});
