import { Image, View, Text, StyleSheet, Platform, TextInput, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useNavigation, router } from 'expo-router';
import React, { useEffect, useContext ,useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import api from '../../hooks/api'; // Axios instance

const { width } = Dimensions.get('window');


const Holiday = () => {

    const [news, setNews] = useState(false);

    const fetchNews = async () => {
        try {
          // No need to manually fetch the token, as it's added by the interceptor
          const response = await api.get('/getHoliday');
          setNews(response.data.news); // Set the orders from the response
        
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      
    
      useEffect(() => {
        fetchNews();
      }, []);


    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
            <StatusBar style="dark" />
            <ScrollView>
                <View style={styles.listItemCon}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Link href="(tabs)" style={{ padding: 10 }}>
                            <Ionicons name="chevron-back" size={30} color="black" />
                        </Link>
                        <View style={styles.textListHead} >
                            <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium' }}>แจ้งวันหยุด</Text>
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
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    {news.length > 0 ? (
                        news.map((item, index) => (
                            <View key={index} style={styles.newsItem}>
                                <Text style={{ fontSize: 17, fontFamily: 'Prompt_400Regular', marginBottom: 5, textAlign: 'center' }}>{item.name}</Text>
                                <Image 
                                    source={{ uri: item.image }} 
                                    style={styles.image} 
                                    resizeMode="cover" 
                                />
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 17, fontFamily: 'Prompt_400Regular', marginBottom: 5 }}>กำลังโหลดข้อมูล...</Text>
                    )}
                </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default Holiday

const styles = StyleSheet.create({

    container: {
        padding: 20,
    },
    newsItem: {
        marginBottom: 20,
        alignItems: 'center',
    },
    image: {
        width: width * 0.9,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    textListHead: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        fontFamily: 'Prompt_400Regular',
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
    card: {
        marginTop: -5,
        position: 'static',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10
    },
    headBranch: {
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
        marginTop: 5,
        height: 30,
        color: '#666'
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
});