import { Image, View, Text, StyleSheet, Platform, Dimensions, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useContext ,useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router, Stack, useLocalSearchParams } from 'expo-router';
import api from '../../hooks/api'; // Axios instance
import RenderHTML from 'react-native-render-html';

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
      <Stack.Screen
                    options={{
                        headerTransparent: true,
                        headerTitle: 'ข่าวสารโปรโมชั่น',
                        headerTitleAlign: 'center', // Center the header title
                        headerTitleStyle: {
                            color: 'black',
                            fontFamily: 'Prompt_500Medium',
                            fontSize: 17,
                        },
                        headerStyle: {
                            backgroundColor: '#fff', // Set the background color here
                        },
                        headerLeft: () => (
                            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                                <View style={{ backgroundColor: '#fff', padding: 6, borderRadius: 50 }}>
                                    <Ionicons name="chevron-back" size={20} color="black" />
                                </View>
                            </TouchableOpacity>
                        ),
                    }}
                />
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

    backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 3,
        borderRadius: 50,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: Platform.select({
            ios: 80,
            android: 75,
        }),
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