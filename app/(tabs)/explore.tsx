import { StyleSheet, Image, Text, View, Platform, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Timeline from 'react-native-timeline-flatlist';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MapViewDirections from 'react-native-maps-directions';
import { Link, useNavigation, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { AntDesign } from '@expo/vector-icons';

export default function Tracking() {

  const origin = { latitude: 13.7750069, longitude: 100.7072212 };
  const destination = { latitude: 13.7709242, longitude: 100.702837 };
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCsx9tQ2Mj7WWnunxa8P2blQLcGtjroLVE';

  const data = [
    {
      time: '09:00',
      title: 'กำลังเตรียมพัสดุ',
      description:
        'ผู้ส่งกำลังเตรียมพัสดุ',
    },
    {
      time: '10:45',
      title: 'อยู่ระหว่างการขนส่ง',
      description:
        'พัสดุออกจากศูนย์คัดแยกสินค้า ไปยัง HSAPA-A - สะพานสูง',
    },
    {
      time: '12:00',
      title: 'อยู่ระหว่างการขนส่ง',
      description:
        'พัสดุถูกส่งมอบให้บริษัทขนส่งเรียบร้อยแล้ว: SPX Express - Partner Shop สาขาโครงการอนินทาวน์',
    },
    {
      time: '14:00',
      title: 'การจัดส่งสำเร็จ',
      description:
        'พัสดุถูกจัดส่งสำเร็จแล้ว ผู้รับ: กอล์ฟ. ดูหลักฐานการจัดส่งสินค้า.',
    }, {
      time: '12:00',
      title: 'อยู่ระหว่างการขนส่ง',
      description:
        'พัสดุถูกส่งมอบให้บริษัทขนส่งเรียบร้อยแล้ว: SPX Express - Partner Shop สาขาโครงการอนินทาวน์',
    },
    {
      time: '14:00',
      title: 'การจัดส่งสำเร็จ',
      description:
        'พัสดุถูกจัดส่งสำเร็จแล้ว ผู้รับ: กอล์ฟ. ดูหลักฐานการจัดส่งสินค้า.',
    }, {
      time: '12:00',
      title: 'อยู่ระหว่างการขนส่ง',
      description:
        'พัสดุถูกส่งมอบให้บริษัทขนส่งเรียบร้อยแล้ว: SPX Express - Partner Shop สาขาโครงการอนินทาวน์',
    },
    {
      time: '54:00',
      title: 'การจัดส่งสำเร็จ',
      description:
        'พัสดุถูกจัดส่งสำเร็จแล้ว ผู้รับ: กอล์ฟ. ดูหลักฐานการจัดส่งสินค้า.',
    }
  ];

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#f5f5f5' }} >
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.listItemCon}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Link href="(tabs)" style={{ padding: 10 }}>
              <Ionicons name="chevron-back" size={30} color="black" />
            </Link>
            <View style={styles.textListHead} >
              <Text style={{
                fontSize: 16,
                fontFamily: 'Prompt_500Medium',
                paddingTop: 5
              }}>1 ก.ค. 2024 15.45 หลังเที่ยง</Text>
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
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0221,
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
              coordinate={origin}
              title="Starting Point"
            />
            <Marker
              coordinate={destination}
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
                  <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                  <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>ก่อน 06 ก.ค. 2024 15.47 น.</Text>
                </View>
              </View>
              <View style={styles.textStatus}>
                <Text style={{ color: '#fff', fontSize: 12 }}>On Devivery</Text>
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
                    <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 15 }}>Kim kundad</Text>
                  </View>

                </View>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <Feather style={{ borderWidth: 1, borderRadius: 99, padding: 10, borderColor: '#f47524' }} name="phone" size={20} color="#f47524" />
              </View>
            </View>
            {/* profileMain  */}
            <View style={styles.textBoxDetail}>
              <View style={styles.flexItem}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
              </View>
              <View style={styles.flexItem2}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
              </View>
            </View>
            <View style={styles.textBoxDetail}>
              <View style={styles.flexItem}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ผู้รับสินค้า</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>เจนจิรา ปานชมพู</Text>
              </View>
              <View style={styles.flexItem2}>
                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>Service Type</Text>
                <Text style={{ fontWeight: 700, fontSize: 13 }}>Standard</Text>
              </View>
            </View>

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