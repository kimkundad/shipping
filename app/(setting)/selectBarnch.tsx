import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router, Stack } from 'expo-router';
import axios from 'axios';
import api from '../../hooks/api'; // Axios instance
import { MaterialIcons } from '@expo/vector-icons';


const POLL_INTERVAL = 555000; // Poll every 5 seconds
const { width } = Dimensions.get('window');

const SelectBarnch = () => {

    const navigation = useNavigation(); 
    const [userBranch, setUserBranch] = useState(null);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/user-branch');
                //  console.log('response', response)
                setUserBranch(response.data.branch);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
     
    }, []);

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
            <StatusBar style="dark" />
            <Stack.Screen options={{
                    headerTransparent: true,
                    headerTitle: ' เลือกสาขาที่ต้องการจัดส่ง',
                    headerTitleStyle: {
                        color: 'black', // กำหนดสีของ headerTitle
                        fontFamily: 'Prompt_500Medium', // กำหนดฟอนต์
                        fontSize: 17
                    },
                    headerLeft: () => (
                        <TouchableOpacity style={styles.btnBack} onPress={() =>  navigation.goBack()}>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 6,
                                    borderRadius: 10
                                }}
                            >
                                <Ionicons name="chevron-back" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    ),
                }} />
            <ScrollView>
                
             
                    <View style={styles.container}>
                       
                       
                        <View style={styles.card}>
                            
                            {userBranch && userBranch.length > 0 && (
                                <View>
                                    {userBranch.map(branch => (
                                        <TouchableOpacity
                                        key={branch.id}
                                        onPress={() => {
                                          // Navigate to Service screen with selected branch details
                                          navigation.navigate('service', {
                                            selectedLat2: branch.latitude,
                                            selectedLng2: branch.longitude,
                                            form: {
                                                adddress2: branch.address_branch,
                                              name2: branch.name_branch,
                                              phone2: branch.phone,
                                              province2: branch.province,
                                            },
                                          });
                                        }}
                                      >

                                            <View style={styles.innerItem}>

                                            <View style={styles.leftSection}>
                                                <View style={styles.iconContainer}>
                                                    <MaterialIcons name="bolt" size={24} color="white" />
                                                </View>
                                                <View>
                                                    <Text style={styles.serviceText}>{branch.name_branch}</Text>
                                                    <Text style={styles.locationText}>{branch.province}</Text>
                                                </View>
                                            </View>


                                                <View style={styles.rightSection}>
                                                    <Text style={styles.dateText}> ผู้ดูแล</Text>
                                                    <Text style={styles.nameText}>{branch.admin_branch}</Text>
                                                </View>
                                                
                                            </View>
                                        </TouchableOpacity>

                                    ))}
                                </View>
                            )}


                         

                       

                        </View>
                    </View>
          
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default SelectBarnch


const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingHorizontal: 12,
        marginTop: Platform.select({
          ios: 100,
          android: 75,
        }),
      },
      btnBack: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        padding: 4,
        alignItems: 'center',
    },
    innerItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
        paddingVertical: 10,
        borderBottomWidth: 0.5, // Specifies the width of the bottom border
        borderBottomColor: '#d7d7d7',
        width: '100%'
    },
    serviceText: {
        fontSize: 16,
        fontFamily: 'Prompt_500Medium',
    },
    locationText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Prompt_400Regular',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#ffc107',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    dateText: {
        fontSize: 14,
        fontFamily: 'Prompt_500Medium',
    },
    nameText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Prompt_400Regular',
    },
    iconShop: {
        backgroundColor: '#f47524',
        padding: 10,
        borderRadius: 10,
        height: 30,
        width: 30
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
        color: '#666',
        width: Platform.OS === 'android' ? 310 : '100%',
    },
    
});

