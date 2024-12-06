import { Image, View, Text, Platform, StyleSheet, RefreshControl ,TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useNavigation, router  } from 'expo-router';
import React, { useEffect, useContext ,useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { UserContext } from '../../hooks/UserContext';
import axios from 'axios';
import api from '../../hooks/api'; // Axios instance
import DeviveryStatus from '../../components/DeviveryStatus'

export default function History() {

  const { userOrders, setUserOrders } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false); // Track refresh state

  const fetchOrders = async () => {
    try {
      const response = await api.get('/user-order');
      setUserOrders(response.data.order); // Set the orders from the response
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders(); // Fetch data again when refreshing
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders(); // Fetch once when the component mounts
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
      <StatusBar style="dark"  />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View >
        <View style={styles.container}>             
      

      {/* list item */}
      <View style={styles.listItemCon}>

        
      <View style={{ alignItems: 'center' }}>
                <View style={styles.headHelp}>
                    <Text style={styles.bigHead}>Activity</Text>
                    <Text style={styles.smallHead}>Always tracking your order</Text>
                </View>
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
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ค่าบรริการ</Text>
                      <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 13, color: '#f47524' }}>{order.price.toFixed(2)} บาท</Text>
                    </View>
                  </View>
                  {order?.order_status === 2 &&
(
  <View>
    {order?.user_re_status === 0 ?
(
                  <View style={styles.textBoxDetailbot}>
                    <Text style={styles.textget}>รอการกดยืนยันรับสินค้า</Text>
                  </View>
):(
  <View style={styles.textBoxDetailbot}>
                    <Text style={styles.textgetsuccess}>กดยืนยันรับสินค้าเสร็จแล้ว</Text>
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
      {/* list item */}
      </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  textget: {
    fontFamily: 'Prompt_500Medium', 
    fontSize: 13, 
    color: '#f47524'
  },
  textgetsuccess: {
    fontFamily: 'Prompt_500Medium', 
    fontSize: 13, 
    color: '#28a745'
  },
  headHelp: {
    marginVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center'
},
smallHead: {
    fontSize: 16, 
    fontFamily: 'Prompt_400Regular',
    color: '#666'
},
bigHead: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 26,
    marginTop: -5
},
  container: {
    padding: 20, 
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25,
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
  containerOrder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,

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
  textBoxDetailbot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    borderTopWidth: 0.5, // Specifies the width of the bottom border
    borderTopColor: '#d7d7d7',
    marginTop: 5
  },
  flexItem: {
    flex: 0.5,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius:99,
  },
  profileMain : {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap:10
  },
  TextInput: {
    padding:7,
    paddingHorizontal:0,
    backgroundColor:Colors.white,
    width: '87%',
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
  },
  searchBar: {
    marginTop:15,
    display: 'flex',
    flexDirection: 'row',
    marginBottom:10,
  },
  iconScan: {
    backgroundColor:Colors.white,
    padding: 10,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
    overflow: 'hidden',
  },
  boxGiff : {
    position: 'static',
    backgroundColor:Colors.white,
    borderRadius:10,
    padding: 10,
    marginTop:12,
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
    color:Colors.gray,
    fontSize:17,
    fontWeight: '700'
  },
  textGifforange: {
    color:'#f47524',
    fontSize:18,
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
    width:80
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
    backgroundColor:Colors.white,
    borderRadius:10,
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
    backgroundColor:Colors.white,
    borderRadius:10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dadee3',
    marginTop:20,
  },
  textListHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemCon: {
    marginTop: Platform.select({
      ios: 10,
      android: 10,
  }),
  },
  innerItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 1
  },
  detailList: {
    padding:5,
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
  }
});

