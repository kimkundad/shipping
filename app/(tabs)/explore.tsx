import { StyleSheet, Image, Text, View, Platform, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Timeline from 'react-native-timeline-flatlist';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MapViewDirections from 'react-native-maps-directions';

export default function Tracking() {

  const origin = {latitude: 13.7750069, longitude: 100.7072212};
  const destination = {latitude: 13.7709242, longitude: 100.702837};
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
    },{
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
    },{
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
      <StatusBar style="dark"  />
      
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
        <Image source={require('../../assets/images/truck.png')} style={{height: 35, width:35 }} />
        </Marker>
        </MapView>
      </View>
     
     
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.boxItemList}>

          <View style={styles.containerOrderMain}>
            <View style={styles.containerOrder}>
              <View>
                <Image source={ require('../../assets/images/box1.png') }
                  style={{width: 40, height: 40, gap: 10}} />
              </View>
              <View>
                  <Text style={{ fontWeight: 700, fontSize: 18 }}>#ORDR1274663</Text>
              </View>
            </View>
            <View style={styles.textStatus}>
                <Text style={{ color: '#fff' }}>On Devivery</Text>
            </View>
          </View>


        </View>
        <View style={styles.boxItemList}>
          <Timeline
            data={data}
            circleSize={20}
            circleColor='#121F43'
            lineColor='#f47524'
            timeContainerStyle={{minWidth:52, marginTop: -5}}
            timeStyle={{
              textAlign: 'center',
              color: '#121F43',
              padding: 5,
              fontWeight: 700,
              borderRadius: 13,
            }}
            descriptionStyle={{color: 'gray'}}
            options={{
              style: {paddingTop: 10}
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
  map: {
    width: '100%',
    height: 300,
  },
  containerOrder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap:2
  },
  containerOrderMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    elevation: 0.8,
  },
});