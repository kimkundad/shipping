import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../hooks/UserContext';
import axios from 'axios';
import api from '../../hooks/api'; // Axios instance
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from "react-i18next";

const POLL_INTERVAL = 555000; // Poll every 5 seconds
const { width } = Dimensions.get('window');

const Index = () => {

    const { userBranch, setUserBranch } = useContext(UserContext);
    const { i18n, t } = useTranslation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token1 = await AsyncStorage.getItem('jwt_token');
                const response = await api.get('/user-branch', {
                    headers: { Authorization: `Bearer ${token1}` },
                });
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
            <LinearGradient
                    colors={['#1e3c72', '#1e3c72', '#2a5298']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.listItemCon}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(tabs)')}>
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
                                {t("branch.title")}
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>
            <ScrollView>
                
                <View>
                    <View style={{ marginTop: 30 }} >
                      
                        <View style={styles.card}>
                            
                            {userBranch && userBranch.length > 0 && (
                                <View>
                                    {userBranch.map(brach => (
                                        <TouchableOpacity key={brach.id}
                                            // href={`/(branch)/shop/${brach.id}`} // Pass ID as part of the URL
                                            onPress={() => {
                                                // Use router.push to navigate to the "(branch)/shop" route with the "id" param
                                                router.push({
                                                  pathname: '(branch)/shop',
                                                  params: { id: brach.id }, // Pass the branch id as a parameter
                                                });
                                              }}
                                        >

                                            <View style={styles.innerItem}>

                                            <View style={styles.leftSection}>
                                                <View style={styles.iconContainer}>
                                                    <MaterialIcons name="bolt" size={24} color="white" />
                                                </View>
                                                <View>
                                                    <Text style={styles.serviceText}>{brach.name_branch}</Text>
                                                    <Text style={styles.locationText}>{t("branch.province")} : {brach.province}</Text>
                                                </View>
                                            </View>


                                                <View style={styles.rightSection}>
                                                    <Text style={styles.dateText}> {t("branch.caretaker")}</Text>
                                                    <Text style={styles.nameText}>{brach.admin_branch}</Text>
                                                </View>
                                                
                                            </View>
                                        </TouchableOpacity>

                                    ))}
                                </View>
                            )}


                            {/* <Link href="/(branch)/shop" >
                            <View style={styles.innerItem}>
                                <View>
                                    <Image source={require('../../assets/images/service/list_service3.png')}
                                        style={{ width: 75, height: 75, borderRadius: 8, gap: 10 }} />
                                </View>
                                <View style={{ width: '65%' }}>
                                    <Text style={styles.headBranch}>สาขาพระราม 9</Text>
                                    <Text style={styles.phoneText}>(+66) 95 846 7410</Text>
                                    <Text style={styles.addressText}>20/426 PRUKSAVILLE รามคำแหง - วงแหวน (ซอยมิสทีน)
                                        ถนนราษฎร์พัฒนา แขวง สะพานสูง
                                        แขวงสะพานสูง, เขตสะพานสูง, จังหวัดกรุงเทพมหานคร, 10240</Text>
                                </View>
                            </View>
                            </Link> */}

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Link href="/(branch)/createBranch" >
                                    <View style={styles.addBranch}>
                                        <View >
                                            <Ionicons style={styles.iconAdd} name="add-circle-outline" size={22} color="black" />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 15, color: '#f47524', fontFamily: 'Prompt_400Regular', }}>{t("branch.addBtn")}</Text>
                                        </View>
                                    </View>

                                </Link>
                            </View>

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default Index


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
    container: {
        padding: 20,
        width: '100%',
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
        gap: 10,
        height: 50
    },
    headerPage: {
        padding: 20,
        fontFamily: 'Prompt_500Medium',
        fontSize: 18,
        marginTop: -5
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

