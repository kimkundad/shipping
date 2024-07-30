import { Image, View, Text, StyleSheet, Platform ,TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useNavigation, router  } from 'expo-router';
import { useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function History() {



  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
      <StatusBar style="dark"  />
      <ScrollView>
        <View >
        <View style={styles.container}>             
      

      {/* list item */}
      <View style={styles.listItemCon}>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <View style={styles.textListHead}>
          <Text style={{ fontSize:18, fontWeight: 700 }}>History</Text>
        </View>
        <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                    router.push('(setting)/notification');
                  }}>
                  <View>
                    <Ionicons name="notifications-outline" size={27} color="black" />
                  </View>
                </TouchableOpacity>
        </View>
        <View>

          
        <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>On Devivery</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus3}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Accident</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus2}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Success</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>


              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>On Devivery</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus3}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Accident</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus2}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Success</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>On Devivery</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus3}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Accident</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.boxItemList}>
                <View style={styles.containerOrderMain}>
                  <View style={styles.containerOrder}>
                    <View >
                      <Image source={require('../../assets/images/icon_truck.png')}
                        style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                    </View>
                    <View >
                      <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                      <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                    </View>
                  </View>
                  <View style={styles.textStatus2}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Success</Text>
                  </View>
                </View>
                <View style={styles.textBoxDetail}>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                  </View>
                  <View style={styles.flexItem}>
                    <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                    <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                  </View>
                </View>
              </View>
          

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

  container: {
    padding: 20, 
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25,
    marginTop:20
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
    padding: 5,
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

