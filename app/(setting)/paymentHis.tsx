import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../hooks/api'; // Axios instance
import PayStatus from '../../components/PayStatus'

const PaymentHis = () => {

    const [userPayment, setUserPayment] = useState(false);
    const [refreshing, setRefreshing] = useState(false); 

    const fetchOrders = async () => {
        try {
            // No need to manually fetch the token, as it's added by the interceptor
            const response = await api.get('/user-pay-history');
            setUserPayment(response.data.payment); // Set the orders from the response
            
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders(); // Fetch once when the component mounts
    }, []);

    const onRefresh = async () => {
        fetchOrders();
    };


    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
            <StatusBar style="dark" />
            <ScrollView
            
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >

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
                                    ประวัติการชำระ
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>

                <View style={styles.container}>

                {userPayment && userPayment.length > 0 && (
                        <View>
                            {userPayment.map(order => (
                                <TouchableOpacity key={order.id} onPress={() => router.push({
                                    pathname: '(setting)/hisDetail',
                                    params: { id: order.id },
                                  })}>
                                <View style={styles.detailBox}>
                                    <View style={styles.showflex2}>

                                        <View style={styles.row}>
                                            <MaterialIcons name="payment" size={25} style={styles.icon} />
                                            <View>
                                                <PayStatus order={order} />
                                                <Text style={styles.subText}>เลขที่แจ้งชำระ {order.code_payment}</Text>
                                                <Text style={styles.subText}>แจ้งชำระวันที่ {order.date_payment} </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.amountDetail}>{order?.total_pay.toFixed(2)}</Text>
                                    </View>
                                </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}


                </View>


            </ScrollView>
        </SafeAreaProvider>
    )
}

export default PaymentHis


const styles = StyleSheet.create({

    container: {
        padding: 20,
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
    textListHead2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderBottomColor: '#bfbfbf',
        borderBottomWidth: 0.5,
        paddingBottom: 20
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
    showflex2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,

    },
    boldText: {
        fontSize: 14,
        fontFamily: 'Prompt_500Medium',
        color: '#333',
    },
    subText: {
        fontSize: 12,
        lineHeight: 13,
        color: '#777',
        marginTop: 4,
    },
    amountDetail: {
        fontSize: 17,
        color: '#333',
        marginTop: 15,

    },
    detailBox: {
        marginTop: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerGradient: {
        height: 85,
        width: '100%',
    },
    

});