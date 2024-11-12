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
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userProfile }  = useContext(UserContext);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [searchInput, setSearchInput] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Track refresh state
  const [news, setNews] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userOrders, setUserOrders] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Here you can re-fetch data or any other logic for refreshing content
    fetchOrders();
    fetchNews();
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


  const fetchOrders = async () => {
    try {
      // No need to manually fetch the token, as it's added by the interceptor
      const response = await api.get('/user-order-cus');
      setUserOrders(response.data.order); // Set the orders from the response
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchNews = async () => {
    try {
      // No need to manually fetch the token, as it's added by the interceptor
      const response = await api.get('/getNews');
      setNews(response.data.news); // Set the orders from the response
    
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  

  useEffect(() => {
    fetchOrders(); // Fetch once when the component mounts
    fetchNews();
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

  const padding = 20;
  const carouselWidth = screenWidth - padding * 2;

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#f6f6f6' }} >
      <StatusBar style="light" />
      <ScrollView
      
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <View >

          {/* <View style={styles.containerBlue} /> */}
          <LinearGradient
        colors={['#1e3c72', '#1e3c72', '#2a5298']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.containerBlue}
      />
          <View style={styles.container1}>
            {/* profileMain  */}
            <View style={styles.profileMain}>
              <View style={styles.profile}>
                <Image
                  style={styles.userImage}
                  source={{
                    uri: userProfile?.avatar || 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg',
                }} />
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
                    <Text style={{ 
                      color: Colors.white, 
                      fontSize: 16, 
                      fontFamily: 'Prompt_400Regular',
                      marginTop:-2 
                      }}>
                      {userProfile.name},
                      </Text>
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
                    {Array.isArray(news) && news.length > 0 ? (
                      <>
                        <Carousel
                          loop
                          width={carouselWidth}
                          height={175}
                          autoPlay={true}
                          autoPlayInterval={4000}
                          data={news}
                          scrollAnimationDuration={1000}
                          onSnapToItem={(index) => setActiveIndex(index)}  // Track the active slide
                          renderItem={({ index }) => (

                      
                            <View>
                            <TouchableOpacity onPress={() => router.push({
                              pathname: '(setting)/modalNew',
                              params: { 
                                id: news[index].id
                              }, // ส่งพา
                            })}>
                              <Image
                                source={{ uri: news[index].image }}  // นำ URL มาแสดงเป็นภาพ
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  resizeMode: 'cover',
                                  borderRadius: 5,
                                }}
                              />
                          </TouchableOpacity>
                            </View>

                          )}
                        />
                        {/* Custom Pagination Dots */}
                        <View style={styles.pagination}>
                          {news.map((_, index) => (
                            <View
                              key={index}
                              style={[
                                styles.dot,
                                index === activeIndex ? styles.activeDot : styles.inactiveDot, // Different styles for active and inactive dots
                              ]}
                            />
                          ))}
                        </View>
                      </>
                    ) : (
                      <View>
                        <Text style={{ color: Colors.white, fontSize: 20 }}>Loading...</Text>
                      </View>
                    )}
              </View>

            </View>

     
            <LinearGradient
            colors={['#E3FDF5', '#FFE6FA']}
            start={{ x: 0.8, y: 0.1 }} // เริ่มจากมุมด้านซ้ายบน
            end={{ x: 0.2, y: 1 }}     // สิ้นสุดที่มุมด้านล่างขวา
            style={styles.boxItemListPay}
          >
            <View style={styles.showflex2}>
              <View>
                <Text style={styles.TextPay}>ยอดค่าใช้บริการ</Text>
                <Text style={styles.TextPaySum}>685.22</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/payment');
                }}>
              <View style={styles.btnPay}>
                <Text style={styles.btnTextPay}>ชำระค่าบริการ</Text>
              </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>


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
              <Text style={{ fontSize: 17, fontFamily: 'Prompt_500Medium' }}>ใช้บริการล่าสุด</Text>
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
                        <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>กำหนดส่ง : {order.dri_date}</Text>
                      </View>
                    </View>
                    <DeviveryStatus order={order} />
                  </View>
                  <View style={styles.textBoxDetail}>
                    <View style={styles.flexItem}>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                      <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 13 }}>{order.province2}</Text>
                    </View>
                    <View style={styles.flexItem}>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ค่าบรริการ</Text>
                      <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 13, color: '#f47524' }}>{order.price.toFixed(2)} บาท</Text>
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
    height: 425,
    position: 'absolute',
    width: '100%'
  },
  TextPaySum:{
    color: '#000',
    fontFamily: 'Prompt_500Medium',
    fontSize: 22,
    marginTop: -5
  },
  TextPay:{
    color: '#999',
    fontFamily: 'Prompt_400Regular',
    fontSize: 16
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#f47524',  // Color for the active dot
  },
  inactiveDot: {
    backgroundColor: 'gray',  // Color for the inactive dots
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
  showflex2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  } ,
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
    marginBottom: 0,
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
    backgroundColor: 'rgba(000, 000, 000, 0)',
    borderRadius: 10,
    marginTop: 12,
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
  btnPay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    backgroundColor: '#f47524',
    borderColor: '#f47524',
    height: 35,
    marginTop: 8
  },
  btnTextPay: {
    fontSize: 15,
    fontFamily: 'Prompt_500Medium',
    color: '#fff',
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
  boxItemListPay : {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 0.4,
    borderColor: '#999',
    marginTop: 12,
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
