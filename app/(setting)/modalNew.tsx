import { Image, View, Text, StyleSheet, Platform, Dimensions, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useContext ,useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router, Stack, useLocalSearchParams } from 'expo-router';
import api from '../../hooks/api'; // Axios instance
import RenderHTML from 'react-native-render-html';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ModalNew = () => {

    const navigation = useNavigation(); // For Back button functionality
    const { id } = useLocalSearchParams(); // รับพารามิเตอร์ id
    const [news, setNews] = useState(false);

    const fetchNews = async () => {
        try {
          // No need to manually fetch the token, as it's added by the interceptor
          const response = await api.get(`/getNewsById/${id}`);
          setNews(response.data.news); // Set the orders from the response
          
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      
    
      useEffect(() => {
        fetchNews();
      }, [id]);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
 
 
                <LinearGradient
                    colors={['#1e3c72', '#1e3c72', '#2a5298']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.listItemCon}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
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
                                ข่าวสารโปรโมชั่น
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>
      <ScrollView>
        
        

      <View style={styles.container}>
          
            {news && (
            <>
              <Text style={styles.title}>{news.title}</Text>
              <Image
                source={{ uri: news.image }}
                style={styles.image}
              />
              
              <RenderHTML
                contentWidth={width}
                source={{ html: news.detail }} // แสดงผล HTML จาก API
              />
            </>
          )}
        </View>
        
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default ModalNew


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
    backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 3,
        borderRadius: 50,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        // marginTop: Platform.select({
        //     ios: 80,
        //     android: 75,
        // }),
        flex: 1,
    },
    title: {
        fontFamily: 'Prompt_500Medium',
        fontSize: 18,
        marginBottom: 10,
      },
      subTitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
      },
      image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
      },
});