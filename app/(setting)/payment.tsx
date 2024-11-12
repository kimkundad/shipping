import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router, useNavigation, Stack } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useEffect } from 'react';

const { width } = Dimensions.get('window');

const Payment = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);


    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: 'ชำระค่าบริการ',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: 'white',
                        fontFamily: 'Prompt_500Medium',
                        fontSize: 17,
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.backIcon}
                            onPress={() => router.push('(tabs)')}>
                            <View style={{ backgroundColor: Colors.white, padding: 6, borderRadius: 50 }}>
                                <Ionicons name="chevron-back" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView>
                <LinearGradient
                    colors={['#1e3c72', '#1e3c72', '#2a5298']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.headerGradient}
                >
                </LinearGradient>
                <View style={styles.container}>
                    {/* Content here */}
                    <View>
                        <Text style={styles.infoText1}>รหัสลูกค้า 430369051</Text>
                        <Text style={styles.infoText}>103 หมู่ที่ 3 ต.ดงขี้เหล็ก อ.เมือง จ.ปราจีนบุรี 25000</Text>
                    </View>

                    <View

                        style={styles.boxItemListPay}
                    >
                        <View style={styles.showflex2}>
                            <View>
                                <Text style={styles.TextPay}>ยอดค่าใช้บริการ</Text>

                            </View>

                            <View>
                                <Text style={styles.TextPaySum}>685.22</Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.detailBox}>
                        <View style={styles.showflex2}>

                            <View style={styles.row}>
                            <Ionicons name="checkmark-circle" size={24} color="black" style={styles.icon} />
                            <View>
                                <Text style={styles.boldText}>กำหนดชำระ: 24 พ.ย. 67</Text>
                                <Text style={styles.subText}>เลขที่ใบแจ้งค่าบริการ 36710240108168</Text>
                                <Text style={styles.subText}>ใช้บริการวันที่ 24 ต.ค. 67 </Text>
                            </View>
                            </View>

                            <Text style={styles.amountDetail}>483.22</Text>
                        </View>
                    </View>

                    <View style={styles.detailBox}>
                        <View style={styles.showflex2}>

                            <View style={styles.row}>
                            <Ionicons name="checkmark-circle" size={24} color="black" style={styles.icon} />
                            <View>
                                <Text style={styles.boldText}>กำหนดชำระ: 24 พ.ย. 67</Text>
                                <Text style={styles.subText}>เลขที่ใบแจ้งค่าบริการ 36710240108168</Text>
                                <Text style={styles.subText}>ใช้บริการวันที่ 24 ต.ค. 67 </Text>
                            </View>
                            </View>

                            <Text style={styles.amountDetail}>483.22</Text>
                        </View>
                    </View>

                    <View style={styles.detailBox}>
                        <View style={styles.showflex2}>

                            <View style={styles.row}>
                            <Ionicons name="checkmark-circle" size={24} color="black" style={styles.icon} />
                            <View>
                                <Text style={styles.boldText}>กำหนดชำระ: 24 พ.ย. 67</Text>
                                <Text style={styles.subText}>เลขที่ใบแจ้งค่าบริการ 36710240108168</Text>
                                <Text style={styles.subText}>ใช้บริการวันที่ 24 ต.ค. 67 </Text>
                            </View>
                            </View>

                            <Text style={styles.amountDetail}>483.22</Text>
                        </View>
                    </View>
                    

                    <View style={styles.contentBox}>
                    <View style={styles.header}>
                        <Image
                        source={require('../../assets/images/kbank.gif')}
                        style={styles.logo}
                        />
                        <Text style={styles.bankName}>ธนาคารกสิกรไทย</Text>
                    </View>

                    {/* ข้อมูลบัญชี */}
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>ชื่อบัญชี: </Text>บรรจุภัณฑ์เพื่อสิ่งแวดล้อม จำกัด (มหาชน)
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>เลขที่บัญชี: </Text>088-1-05999-1
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>ประเภท: </Text>ออมทรัพย์
                    </Text>
                    </View>


                    <View style={styles.boxslip}>
                    <Image
                        source={require('../../assets/images/file.png')}
                        style={styles.iconfile}
                    />
                    <Text style={styles.instruction}>คลิกเพื่อเลือกอัพโหลดสลิปการโอนเงิน</Text>
                    <View style={styles.buttonUp}>
                    <Text style={styles.buttonText}>Browse</Text>
                    </View>
                    </View>


                    <Text style={styles.remark}>**อัพโหลดสลิปการโอนเงินของท่าน</Text>

                    <View style={styles.formAction}>
                    <TouchableOpacity  disabled={loading}>
                        <View style={styles.btn}>
                        <Text style={styles.btnText}>{loading ? 'กำลังแจ้งชำระค่าบริการ...' : 'แจ้งชำระค่าบริการ'}</Text>
                        </View>
                    </TouchableOpacity>
                    </View>


                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

export default Payment;

const styles = StyleSheet.create({
    backIcon: {
        backgroundColor: 'rgba(50, 209, 145, 0.2)',
        padding: 3,
        borderRadius: 50,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',

        flex: 1,
    },
    boxslip:{
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
      iconfile:{
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
