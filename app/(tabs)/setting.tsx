
import { Image, View, Text, Switch, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState, useContext } from 'react';
import { Link, useNavigation, router } from 'expo-router';
import { UserContext } from '../../hooks/UserContext';

export default function Setting() {

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const { logout }  = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
      <StatusBar style="dark" />
      <ScrollView>
        <View >

          <View style={styles.container}>

            <View style={styles.listItemCon}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={styles.textListHead}>
                  <Text style={{ fontSize: 18, fontWeight: 700 }}>Setting</Text>
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
            </View>


            <View style={{ alignItems: 'center' }}>
              <Image
                style={styles.userImageCenter}
                source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: Colors.black, fontSize: 18, fontFamily: 'Prompt_500Medium',
                }}>Kim kundad</Text>
                <View style={styles.showflex}>
                  <Text style={{
                    color: Colors.black, fontSize: 14, fontFamily: 'Prompt_500Medium', fontWeight: 700, marginRight: 5
                  }}>รหัสลูกค้า</Text>
                  <Text style={{
                    color: Colors.black, fontSize: 14, fontFamily: 'Prompt_400Regular',
                  }}>430369051</Text>
                </View>
              </View>
            </View>

            <View style={styles.line_bot}></View>

            {/* Menu Setting */}
            <View style={{ marginTop: 8 }}>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <AntDesign name="user" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>Edit Profile</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/modal');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <AntDesign name="creditcard" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>Payment Method</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/language');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <Entypo name="language" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>Language</Text>
                    </View>
                  </View>

                  <View>
                    <View style={styles.showflex}>
                      <View style={{ marginRight: 10 }}>
                        <Text style={styles.textSeting2}>ภาษาไทย (TH)</Text>
                      </View>
                      <Feather name="chevron-right" size={24} color="black" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/helpcen');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <Feather name="phone" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>Help Center</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity>
              <View >
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <Ionicons name="notifications-outline" size={24} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>Notification</Text>
                    </View>
                  </View>
                  <View>
                    <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </View>
                </View>
              </View>
              <View >
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                    router.push('(setting)/policy');
                  }}>
                  <View style={styles.textListHead2}>
                    <View style={styles.profile}>
                      <View>
                        <MaterialIcons name="lock-outline" size={20} color="black" />
                      </View>
                      <View>
                        <Text style={styles.textSeting}>privacy policy</Text>
                      </View>
                    </View>
                    <View>
                      <Feather name="chevron-right" size={24} color="black" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/about');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <Feather name="info" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>About Us</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                >
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <AntDesign name="logout" size={20} color="#dc3545" />
                    </View>
                    <View>
                      <Text style={styles.textSeting3}>Logout</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="#dc3545" />
                  </View>
                </View>
              </TouchableOpacity>

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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginTop: 20
  },
  showflex: {
    display: 'flex',
    flexDirection: 'row',
  },
  textSeting: {
    fontSize: 16,
    fontFamily: 'Prompt_400Regular'
  },
  textSeting2: {
    fontSize: 15,
    fontFamily: 'Prompt_400Regular',
    color: '#3858b1'
  },
  textSeting3: {
    fontSize: 15,
    fontFamily: 'Prompt_400Regular',
    color: '#dc3545'

  },
  userImageCenter: {
    width: 100,
    height: 100,
    borderRadius: 99,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
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
    borderBottomWidth: 0.3,
    paddingBottom: 20
  },
  profileMain: {
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
    gap: 10
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
    marginTop: 12,
    paddingBottom: 12
  },
});
