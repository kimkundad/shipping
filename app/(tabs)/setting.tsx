
import { Image, View, Text, Switch, Alert, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigation, router, Stack } from 'expo-router';
import { UserContext } from '../../hooks/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../hooks/api'; // Axios instance
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from "react-i18next";

export default function Setting() {

  const [isEnabled, setIsEnabled] = useState(false);
  const { logout }  = useContext(UserContext);
  const { userProfile, setUserProfile } = useContext(UserContext);
  const [files, setFiles] = useState(null); // Holds URI of selected image
  const [loading, setLoading] = useState(false); // Loading state for API call

  const { i18n, t } = useTranslation(); // ใช้ i18n สำหรับการจัดการภาษา
  // ฟังก์ชันแสดงข้อความภาษา
  const getLanguageDisplay = () => {
    switch (i18n.language) {
      case "th-TH":
        return "ภาษาไทย (TH)";
      case "en-US":
        return "English (US)";
      case "zh-CN":
        return "中文 (自动翻译)";
      default:
        return "Language"; // ค่าดีฟอลต์
    }
  };

  useEffect(() => {

    setIsEnabled(userProfile?.noti === 1);
    console.log('API Response userProfile?.noti:', userProfile?.noti);

  }, [userProfile]); // Depend on id to refetch when it changes


  const toggleSwitch = async () => {
    const newStatus = !isEnabled;
    setIsEnabled(newStatus);

    try {
      const response = await api.post('/notiStatus', {
        id: userProfile?.id,
        newStatus: newStatus ? 'เปิด' : 'ปิด' // เปลี่ยนข้อความตามที่คุณต้องการในฐานข้อมูล
      });
      console.log('API Response:', response?.data?.data?.user); // Log ข้อมูลจาก API
      const updatedUser = response?.data?.data?.user;
      await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));


    } catch (error: unknown) { 
      const errorMessage = (error as Error).message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ'; 
      Alert.alert('ข้อผิดพลาด', errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

    // Function to open image picker and set the profile image
    const openImagePicker = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
      if (permissionResult.status !== 'granted' || cameraPermissionResult.status !== 'granted') {
        Alert.alert('Permission required', 'Camera and gallery access are required to upload a profile picture.');
        return;
      }
  
      Alert.alert(
        'Upload Profile Picture', 
        'Choose an option',
        [
          {
            text: 'Take Photo',
            onPress: async () => {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
              });
              if (!result.cancelled) {
                console.log('New Image URI:', result.uri); // Check URI
                setFiles(result.uri || result?.assets?.[0]?.uri);
                await uploadImage(result?.assets?.[0]?.uri);
              }
            },
          },
          {
            text: 'Choose from Gallery',
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
                allowsEditing: true,
                quality: 1,
              });
              if (!result.cancelled) {
                console.log('New Image URI:', result.uri); // Check URI
                setFiles(result.uri || result?.assets?.[0]?.uri);
                await uploadImage(result?.assets?.[0]?.uri);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    };
  
  
     // Function to upload image to the server
     const uploadImage = async (uri) => {
      setLoading(true); // Start loading
  
      try {

        
          const formData = new FormData();
          formData.append('images', {
              uri: uri,
              name: `avatar_${Date.now()}.jpg`, // Generate a unique filename
              type: 'image/jpeg',
          });
  
          // Assuming `api` is configured with your base URL and headers
          const response = await api.post('/UpAvatar', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
  
          // Handle API response
          if (response.data.msgStatus === 200) {
            console.log('user-->', response.data?.user)
            const updatedUser = response.data.user;
            await AsyncStorage.setItem('user_profile', JSON.stringify(updatedUser));
            setUserProfile(updatedUser); // Update UserContext
  
              Alert.alert('Success', 'Profile picture updated successfully');
          } else {
              Alert.alert('Error', 'Failed to update profile picture');
          }
  
      } catch (error) {
          console.error('API Error:', error);
          Alert.alert('Error', error.message || 'An error occurred while uploading');
      } finally {
          setLoading(false); // Stop loading
      }
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
      <Stack.Screen options={{
        headerTransparent: true,
        headerTitle: 'Profile',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#000', // กำหนดสีของ headerTitle
          fontFamily: 'Prompt_500Medium', // กำหนดฟอนต์
          fontSize: 18,
        },
      }} />
      <ScrollView>
        <View >

          <View style={styles.container}>

            


            <View style={{ alignItems: 'center' }}>
              {/* Container for image and edit button */}
              <View style={{ position: 'relative' }}>
                {/* Profile Image */}



                <Image
                  key={files}
                  style={styles.userImageCenter}
                  source={{
                    uri: files || userProfile?.avatar || 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg',
                }}
                />


                {/* Edit Button */}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: '#fff', // Background for better visibility
                    borderRadius: 50,
                    padding: 4,
                  }}
                  onPress={openImagePicker}
                >
                  <MaterialIcons name="edit" size={18} color="black" />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  color: Colors.black, fontSize: 18, fontFamily: 'Prompt_500Medium',
                }}>{userProfile?.name}</Text>
                <View style={styles.showflex}>
                  <Text style={{
                    color: Colors.black, fontSize: 14, fontFamily: 'Prompt_500Medium', fontWeight: 700, marginRight: 5
                  }}>{t("home.codeUser")}</Text>
                  <Text style={{
                    color: Colors.black, fontSize: 14, fontFamily: 'Prompt_400Regular',
                  }}>{userProfile?.code_user}</Text>
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
                      <Text style={styles.textSeting}>{t("setting.profile")}</Text>
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
                  router.push('(setting)/receipt');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <Entypo name="documents" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>{t("setting.Receipt_information")}</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
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
              </TouchableOpacity> */}

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
                        <Text style={styles.textSeting2}>{getLanguageDisplay()}</Text>
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
                      <Text style={styles.textSeting}>{t("help.subHeader")}</Text>
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
                        <Text style={styles.textSeting}>{t("setting.policy")}</Text>
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
                      <Text style={styles.textSeting}>{t("setting.about")}</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity>


              


              {/* <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/maps');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <Feather name="info" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>maps</Text>
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
                  router.push('(setting)/service');
                }}>
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <Feather name="info" size={20} color="black" />
                    </View>
                    <View>
                      <Text style={styles.textSeting}>service</Text>
                    </View>
                  </View>
                  <View>
                    <Feather name="chevron-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity> */}


              <TouchableOpacity
                onPress={handleLogout}
                >
                <View style={styles.textListHead2}>
                  <View style={styles.profile}>
                    <View>
                      <AntDesign name="logout" size={20} color="#dc3545" />
                    </View>
                    <View>
                      <Text style={styles.textSeting3}>{t("setting.Logout")}</Text>
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
    padding: 10,
    paddingHorizontal: 12,
    marginTop: Platform.select({
      ios: 65,
      android: 65,
    }),
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
