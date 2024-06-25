import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Shop = () => {

    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
            <StatusBar style="dark" />
            <ScrollView>
                <View style={styles.listItemCon}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Link href="/(branch)" style={{ padding: 10 }}>
                            <Ionicons name="chevron-back" size={30} color="black" />
                        </Link>
                        <View style={styles.textListHead} >
                            <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium' }}>สาขา</Text>
                        </View>
                        <View >
                            <Ionicons style={{ padding: 10 }} name="notifications-outline" size={27} color="black" />
                        </View>
                    </View>
                </View>
                <View>
                    <View >

                        <Image source={require('../../assets/images/shop1.jpg')}
                            style={styles.image}
                            resizeMode="cover" />

                        <View style={styles.card}>

                            <View style={styles.headBox}>



                                <View style={{ width: '100%' }}>
                                    <Text style={styles.headBranch}>สาขาพระราม 9</Text>
                                    <Text style={styles.addressText}>20/426 PRUKSAVILLE รามคำแหง - วงแหวน (ซอยมิสทีน)
                                        ถนนราษฎร์พัฒนา แขวง สะพานสูง
                                        แขวงสะพานสูง, เขตสะพานสูง, จังหวัดกรุงเทพมหานคร, 10240</Text>
                                </View>
                            </View>

                            <View style={{ paddingVertical: 15, }}>
                                {/* profileMain  */}
                                <View style={styles.profileMain}>
                                    <View style={styles.profile}>
                                        <Image
                                            style={styles.userImage}
                                            source={{ uri: 'https://wpnrayong.com/admin/assets/media/avatars/300-12.jpg' }} />
                                        <View>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 13, color: '#666' }}>ผู้ดูแลสาขา,</Text>
                                            <View style={styles.showflex}>
                                                <AntDesign name="star" size={22} color="#f47524" />
                                                <Text style={{ fontFamily: 'Prompt_500Medium', fontSize: 15 }}>Kim kundad</Text>
                                            </View>

                                        </View>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                        <Feather name="phone" size={24} color="black" />
                                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
                                    </View>
                                </View>
                                {/* profileMain  */}

                                <View style={styles.lineUnder}>
                                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 25, justifyContent: 'space-between', }}>
                                        <View>
                                            <Text style={styles.headMenu}>NV145298</Text>
                                            <Text style={styles.subHeadMenu}>หมายเลขสาขา</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headMenu}>095-846-7417</Text>
                                            <Text style={styles.subHeadMenu}>เบอร์ติดต่อ</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.headMenu}>15,500 </Text>
                                            <Text style={styles.subHeadMenu}>ยอดสั่งสินค้า</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>


                            <View>

                                <Text style={{ fontSize: 17, fontFamily: 'Prompt_400Regular', }}>รายการล่าสุด</Text>

                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service1.png')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service2.png')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>

                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service3.png')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>

                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service4.jpg')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>

                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>


                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service1.png')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service2.png')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>

                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service3.png')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>

                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>

                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service4.jpg')}
                                            style={{ width: 120, height: 70, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={styles.detailList}>

                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Price : </Text>
                                            <Text style={styles.textMute}>150,000 บาทv</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Total : </Text>
                                            <Text style={styles.textMute}>50 กล่อง</Text>
                                        </View>
                                        <View style={styles.textDetailRight}>
                                            <Text style={{ fontWeight: 700 }}>Status : </Text>
                                            <Text style={styles.textMute}>อยู่ระหว่างการขนส่ง</Text>
                                        </View>

                                    </View>
                                </View>


                            </View>



                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default Shop


const styles = StyleSheet.create({

    container: {
        padding: 20,
    },
    boxItemList: {
        borderRadius: 10,
        padding: 5,
        marginTop: 12,
        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Android shadow (elevation)
        elevation: 5,
    },
    detailList: {
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    textDetailRight: {
        display: 'flex',
        flexDirection: 'row'
    },
    textMute: {
        color: '#666'
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 99,
    },
    profileMain: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    profile: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
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
        paddingTop: 0,
        marginTop: -5,
        position: 'static',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    headBranch: {
        fontFamily: 'Prompt_500Medium',
        fontSize: 16,
        marginTop: -3
    },
    headMenu: {
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
        height: 30,
        color: '#666'
    },
    subHeadMenu: {
        fontFamily: 'Prompt_400Regular',
        fontSize: 12,
        lineHeight: 15,
        height: 30,
        color: '#666'
    },
    image: {
        width: width, // Full width of the screen
        height: 200,  // Set the height as needed
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
    headBox: {
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#d7d7d7',
    },
    lineUnder: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#d7d7d7',
    },
    showflex: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5
    }
});

