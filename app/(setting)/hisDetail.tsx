import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, ScrollView, Platform, RefreshControl, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../hooks/api'; // Axios instance
import { UserContext } from '../../hooks/UserContext';
import { StatusBar } from 'expo-status-bar';
import PayStatus from '../../components/PayStatus'
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get('window');
const paddingHorizontal = 20;

const hisDetail = () => {
    const navigation = useNavigation();

    const { id } = useLocalSearchParams(); // รับพารามิเตอร์ id

    const [loading, setLoading] = useState(false);
    const [userOrders, setUserOrders] = useState(false);
    const [payData, setPayData] = useState(false);
    const [getBank, setBank] = useState(false);
    const [getPrice, setGetPrice] = useState(0);
    const { userProfile } = useContext(UserContext);
    const [refreshing, setRefreshing] = useState(false); // Track refresh state
    const [files, setFiles] = useState(null);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const { i18n, t } = useTranslation();

    const fetchOrders = async () => {
        try {
            // No need to manually fetch the token, as it's added by the interceptor
            const response = await api.get(`/user-pay-historyById/${id}`);
            setUserOrders(response.data.order); // Set the orders from the response
            setPayData(response.data.payment)
            setGetPrice(response?.data?.payment?.total_pay)
            setBank(response.data.set)
            
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
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
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
                            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(setting)/paymentHis')}>
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
                                     {t("home.payHis")}
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>
                <View style={styles.container}>
                    {/* Content here */}
                    <View>
                        <View style={{ borderWidth: 0.4,
                                        borderColor: '#999',
                                        padding: 6,
                                        marginVertical: 10,
                                        borderRadius: 10,
                                        alignItems: 'center' }}>
                        <PayStatus order={payData} />
                        </View>
                        <Text style={styles.infoText}>{t("pay.hisDate")} #{payData?.date_payment}</Text>
                        <Text style={styles.infoText1}>{t("pay.hisNo")} #{payData?.code_payment}</Text>
                    </View>

                    <View

                        style={styles.boxItemListPay}
                    >
                        <View style={styles.showflex2}>
                            <View>
                                <Text style={styles.TextPay}>{t("home.pay")}</Text>

                            </View>

                            <View>
                                <Text style={styles.TextPaySum}>{getPrice?.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>


                    {userOrders && userOrders.length > 0 && (
                        <View>
                            {userOrders.map(order => (
                                <View key={order.id} style={styles.detailBox}>
                                    <View style={styles.showflex2}>

                                        <View style={styles.row}>
                                            <Ionicons name="checkmark-circle" size={24} color="black" style={styles.icon} />
                                            <View>
                                                <Text style={styles.boldText}>{t("pay.limit")}: {order?.payDate}</Text>
                                                <Text style={styles.subText}>{t("pay.invo")} {order?.code_order}</Text>
                                                <Text style={styles.subText}>{t("pay.date")} {order?.useDate} </Text>
                                            </View>
                                        </View>

                                        <Text style={styles.amountDetail}>{order?.totalPrice?.toFixed(2)}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}


<View style={styles.contentBox}>
                        <View style={styles.header}>
                            <Image
                                source={{
                                    uri: getBank?.bankImage || 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg',
                                }}
                                style={styles.logo}
                            />
                            <Text style={styles.bankName}>{getBank?.bankMain}</Text>
                        </View>

                        {/* ข้อมูลบัญชี */}
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>{t("pay.bName")}: </Text>{getBank?.bankName}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>{t("pay.bAcc")}: </Text>{getBank?.bankNo}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>{t("pay.bType")}: </Text>{getBank?.bankType}
                        </Text>
                    </View>


                    <View style={{ alignItems: 'center', marginTop: 15, paddingHorizontal }}>
                        <Image
                            source={{ uri: payData?.image_payment }}
                            style={{ width: width - paddingHorizontal * 2 , height: 380 }}
                            resizeMode="contain" // ให้ขนาดอัตโนมัติแบบคงอัตราส่วน
                        />
                    </View>



                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

export default hisDetail;

const styles = StyleSheet.create({
    backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 3,
        borderRadius: 50,
        zIndex: 100,
    },
    textListHead: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        fontFamily: 'Prompt_400Regular',
    },
    btnBack: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        padding: 4,
        alignItems: 'center',
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
    container: {
        padding: 20,
        backgroundColor: '#fff',

        flex: 1,
    },
    boxslip: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        marginVertical: 15
    },
    buttonUp: {
        backgroundColor: '#00b386',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    bankName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4a4a4a',
    },
    iconfile: {
        width: 60,
        height: 65,
        marginBottom: 16,
    },
    formAction: {

        marginTop: 30,
        marginBottom: 50
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#121F43',
        borderColor: '#121F43',
    },
    btnText: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Prompt_500Medium',
    },
    label: {
        fontFamily: 'Prompt_500Medium',
        color: '#333',
    },
    instruction: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
        fontFamily: 'Prompt_500Medium',
        textAlign: 'center',
    },
    boxItemListPay: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 0.4,
        borderColor: '#999',
        marginTop: 12,
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
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 12,
        lineHeight: 13,
        color: '#777',
        marginTop: 4,
    },
    amountDetail: {
        fontSize: 18,
        color: '#333',
        marginTop: 15,

    },
    showflex2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    TextPaySum: {
        color: '#000',
        fontFamily: 'Prompt_400Regular',
        fontSize: 22,
        marginTop: -5
    },
    contentBox: {
        backgroundColor: '#fbf9e6', // สีพื้นหลังอ่อน
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e8dcb2', // สีขอบ
        marginTop: 10
    },
    contentText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22, // เพิ่มความสูงของบรรทัดเพื่อความอ่านง่าย
        fontFamily: 'Prompt_400Regular',
    },
    TextPay: {
        color: '#000',
        fontFamily: 'Prompt_400Regular',
        fontSize: 18
    },
    remark: {
        color: '#4ba3c7',
        fontFamily: 'Prompt_400Regular',
        fontSize: 14
    },
    headerGradient: {
        height: 80,
        width: '100%',
    },
    headerContent: {
        alignItems: 'center',
        paddingTop: 40,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Prompt_500Medium',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeButton: {
        backgroundColor: 'white',
    },
    buttonText: {
        color: 'black',
        fontFamily: 'Prompt_400Regular',
    },
    infoText1: {
        color: 'black',
        fontFamily: 'Prompt_400Regular',
        fontSize: 16
    },
    infoText: {
        color: 'black',
        fontFamily: 'Prompt_400Regular',
        fontSize: 14
    }
});
