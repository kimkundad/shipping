
import { Image, View, Text, StyleSheet, Platform ,TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function Setting() {


  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
      <StatusBar style="dark"  />
      <ScrollView>
        <View >
          
          <View style={styles.container}> 

            <View style={styles.listItemCon}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={styles.textListHead}>
                  <Text style={{ fontSize:18, fontWeight: 700 }}>Setting</Text>
                </View>
                <View>
                  <Ionicons name="notifications-outline" size={27} color="black" />
                </View>
              </View>
            </View>

            {/* profileMain  */}
            <View style={styles.line_bot}>
            <View style={ styles.profileMain }>
              <View style={ styles.profile }>
                <Image 
                style={ styles.userImage }
                source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }}/>
                <View>
                  <Text style={{ color:Colors.black }}>Welcome,</Text>
                  <Text style={{ color:Colors.black, fontSize:20 }}>Kim kundad,</Text>
                </View>
              </View>
              <View>
                  <Ionicons name="notifications-outline" size={27} color="white" />
              </View>
            </View>

            <View style={styles.credit}>
              <Text style={{ fontWeight: 700, }}>จำนวนเครดิต:</Text>
              <Text style={{ fontWeight: 700, color: '#f47524' }}>150,000 Point</Text>
            </View>
            <View style={styles.creditflex}>
              <Text style={{ fontWeight: 700 }}>วันที่สมัคร:</Text>
              <Text style={{ fontWeight: 700, color: '#f47524' }}> 18-6-2024</Text>
            </View>

            </View>
            {/* profileMain  */}

            {/* Menu Setting */}
            <View style={{ marginTop:0 }}>

              <View style={styles.textListHead2}>
                <View style={styles.profile}>
                  <View>
                    <FontAwesome5 name="user-edit" size={20} color="black" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: 500 }}>Edit Profile</Text>
                  </View>
                </View>
                <View>
                  <AntDesign name="right" size={20} color="gray" />
                </View>
              </View>

              <View style={styles.textListHead2}>
                <View style={styles.profile}>
                  <View>
                  <MaterialIcons name="language" size={26} color="black" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: 500 }}>Language</Text>
                  </View>
                </View>
                <View>
                  <AntDesign name="right" size={20} color="gray" />
                </View>
              </View>
              <View style={styles.textListHead2}>
                <View style={styles.profile}>
                  <View>
                    <Feather name="phone" size={22} color="black" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: 500 }}>Support Team</Text>
                  </View>
                </View>
                <View>
                  <AntDesign name="right" size={20} color="gray" />
                </View>
              </View>
              <View style={styles.textListHead2}>
                <View style={styles.profile}>
                  <View>
                  <AntDesign name="logout" size={22} color="black" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: 500 }}>Log Out</Text>
                  </View>
                </View>
                <View>
                  <AntDesign name="right" size={20} color="gray" />
                </View>
              </View>

            </View>
            {/* Menu Setting */}


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
  userImage: {
    width: 45,
    height: 45,
    borderRadius:99,
  },
  creditflex: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  credit: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  line_bot: {
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 0.5,
    paddingBottom: 20
  },
  profileMain : {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap:10
  },
  listItemCon: {
    marginTop: 15
  },
  textListHead: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textListHead2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 0.5,
    paddingBottom: 20
  },
});
