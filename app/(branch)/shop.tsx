import { Image, View, Text, StyleSheet, Platform, TextInput, Alert, TouchableOpacity, FlatList, ScrollView, Dimensions, Linking  } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router ,useRouter , useLocalSearchParams  } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DeviveryStatus from '../../components/DeviveryStatus'
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get('window');

const Shop = () => {

    const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id = 42, other } = params;
    console.log('params' , params?.id)

    const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n, t } = useTranslation();


  useEffect(() => {
    const fetchData = async () => {
   
        try {

            const token1 = await AsyncStorage.getItem('jwt_token');
        
            const response = await axios.get(`https://api.loadmasterth.com/api/user-branch-${id}`, {
              headers: { Authorization: `Bearer ${token1}` },
            });
            console.log('rrrr', response.data.branch)
          setData(response.data.branch);
        } catch (error) {
          setError(error);
          console.error('Failed to fetch data:', error);
        } finally {
          setLoading(false);
        }
      
    };

    fetchData();
  }, [id]); // Depend on id to refetch when it changes

 
  const handlePress = async () => {
    if (data?.phone) {
      const url = `tel:${data?.phone}`;
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


    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
            <StatusBar style="dark" />
            <LinearGradient
                    colors={['#1e3c72', '#1e3c72', '#2a5298']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.listItemCon}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(branch)')}>
                                <View
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        padding: 5,
                                        borderRadius: 25
                                    }}
                                >
                                    <Ionicons name="chevron-back" size={20} color="black" />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.textListHead}>
                                <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium', color: '#fff', textAlign: 'center' }}>
                                {data?.name_branch}
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>
            <ScrollView>
                
                
            <View  >
                    <View >

                        <View style={styles.card}>
                            <View style={styles.headBox}>

                                <View style={{ width: '100%' }}>
                                    <Text style={styles.headBranch}>{data?.name_branch}</Text>
                                    <Text style={styles.addressText}>{data?.address_branch} {data?.subdistrict} {data?.district} {data?.province} {data?.postcode}</Text>
                                </View>
                            </View>

                            <View style={{ paddingVertical: 15, }}>
                                {/* profileMain  */}
                                <View style={styles.profileMain}>
                                    <View style={styles.profile}>
                                        <Image
                                            style={styles.userImage}
                                            source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }} />
                                        <View>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 13, color: '#666' }}>{t("branch.caretaker")},</Text>
                                            <View style={styles.showflex}>
                                                <AntDesign name="star" size={22} color="#f47524" />
                                                <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 15 }}>{data?.admin_branch}</Text>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                        
                                            <Feather name="phone" size={24} color="black" onPress={handlePress} />
                                        
                                        <MaterialCommunityIcons name="tooltip-edit-outline" size={24} color="black" />
                                    </View>
                                </View>
                                {/* profileMain  */}

                                <View style={styles.lineUnder}>
                                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 25, justifyContent: 'space-between', }}>
                                        <View>
                                            <Text style={styles.headMenu}>{data?.code_branch}</Text>
                                            <Text style={styles.subHeadMenu}>{t("branch.code")}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headMenu}>{data?.phone}</Text>
                                            <Text style={styles.subHeadMenu}>{t("profile.phone")}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headMenu}>{data?.province} </Text>
                                            <Text style={styles.subHeadMenu}>{t("branch.province")}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>


                            <View>

                                <Text style={{ fontSize: 14, fontFamily: 'Prompt_400Regular', }}>{t("home.lasrService")}</Text> 



                                {/* {data?.order && data?.order.length > 0 && (
                                <View>
                                    {data?.order.map(order => (
                              <TouchableOpacity
                              key={order.id}
                              onPress={() => {
                                // handle onPress
                                router.push({
                                  pathname: '(setting)/tracking',
                                  params: { id: order.id }, // ส่งพารามิเตอร์ id ของ order
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
                                    <Text style={{ fontWeight: 700, fontSize: 16 }}>#{order.code_order}</Text>
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
                              )} */}



{data && data?.order?.length > 0 && (
                <View>
                  {data?.order.map(order => (
                    <TouchableOpacity
                      key={order.id}
                      onPress={() => {
                        // handle onPress
                        router.push({
                          pathname: '(setting)/tracking',
                          params: {
                            id: order.id,
                            dataOrder: JSON.stringify(order)
                          }, // ส่งพารามิเตอร์ id ของ order
                        });
                      }}>
                      <View style={styles.boxItemList}>
                        <View style={styles.containerOrderMain}>
                          <View style={styles.containerOrder}>
                            <View >
                              <Image source={require('../../assets/images/icon_truck.png')}
                                style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                            </View>
                            <View >
                              <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 14 }}>#{order.code_order}</Text>
                              <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>{t("home.deadline")} : {order.dri_date}</Text>
                            </View>
                          </View>
                          <DeviveryStatus order={order} />
                        </View>
                        <View style={styles.textBoxDetail}>
                          <View style={styles.flexItem}>
                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.destination")}</Text>
                            <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 13 }}>{order.province2}</Text>
                          </View>
                          <View style={styles.flexItem}>
                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>{t("home.price")}</Text>
                            <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 13, color: '#f47524' }}>{order?.price?.toFixed(2)} {t("home.baht")}</Text>
                          </View>
                        </View>
                        {order?.order_status === 2 &&
(
  <View>
    {order?.user_re_status === 0 ?
(
                  <View style={styles.textBoxDetailbot}>
                    <Text style={styles.textget}>{t("home.wait_for_confirmation")}</Text>
                  </View>
):(
  <View style={styles.textBoxDetailbot}>
                    <Text style={styles.textgetsuccess}>{t("home.press_to_confirm")}</Text>
                  </View>
)}

                  </View>
)}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}


                               


                            </View>



                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default Shop


const styles = StyleSheet.create({
    headerGradient: {
        height: 85,
        width: '100%',
    },
    btnBack: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        padding: 4,
        alignItems: 'center',
    },
    textListHead: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        fontFamily: 'Prompt_400Regular',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    listItemCon: {
        marginTop: Platform.select({
            ios: 35,
            android: 35,
        }),
        paddingHorizontal: 0,
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
    container: {
        padding: 20,
    },
    boxItemList: {
        backgroundColor: '#fff',
        borderRadius:10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#dadee3',
        marginTop:20,
      },
    containerOrder: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,

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
    textBoxDetail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5
    },
    flexItem: {
        flex: 0.5,
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
        color: '#666'
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
  
    iconAdd: {
        color: '#f47524',
    },
    addBranch: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 1
    },
    headerPage: {
        padding: 20,
        fontFamily: 'Prompt_500Medium',
        fontSize: 18,
        marginTop: -5
    },
   
    card: {
        paddingTop: 0,
        marginTop: -5,
        position: 'static',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    headBranch: {
        fontFamily: 'Prompt_500Medium',
        fontSize: 18,
        marginTop: -3
    },
    headMenu: {
        fontFamily: 'Prompt_500Medium',
        fontSize: 15,
        marginTop: -3
    },
    phoneText: {
        fontFamily: 'Prompt_400Regular',
        fontSize: 12,
        marginTop: -5
    },
    addressText: {
        fontFamily: 'Prompt_400Regular',
        fontSize: 11,
        lineHeight: 15,
        height: 30,
        color: '#666'
    },
    subHeadMenu: {
        fontFamily: 'Prompt_400Regular',
        fontSize: 12,
        lineHeight: 15,
        height: 30,
        color: '#666'
    },
    image: {
        width: width, // Full width of the screen
        height: 200,  // Set the height as needed
    },
    innerItem: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 1,
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 0.5, // Specifies the width of the bottom border
        borderBottomColor: '#d7d7d7',
    },
    headBox: {
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#d7d7d7',
    },
    lineUnder: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#d7d7d7',
    },
    showflex: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5
    }
});

