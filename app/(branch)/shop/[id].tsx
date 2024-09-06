import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router ,useRouter  } from 'expo-router';
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
                            <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium' }}>สาขา </Text>
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
                    <View >

                        <Image source={require('../../../assets/images/shop1.jpg')}
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

                                <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/tracking');
                }}>
                                <View style={styles.boxItemList}>
                                    <View style={styles.containerOrderMain}>
                                        <View style={styles.containerOrder}>
                                            <View >
                                                <Image source={require('../../../assets/images/icon_truck.png')}
                                                    style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                                            </View>
                                            <View >
                                                <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                                                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.textStatus}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>On Devivery</Text>
                                        </View>
                                    </View>
                                    <View style={styles.textBoxDetail}>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                                        </View>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                                        </View>
                                    </View>
                                </View>
                                </TouchableOpacity>


                                <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push('(setting)/tracking');
                }}>
                                <View style={styles.boxItemList}>
                                    <View style={styles.containerOrderMain}>
                                        <View style={styles.containerOrder}>
                                            <View >
                                                <Image source={require('../../../assets/images/icon_truck.png')}
                                                    style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                                            </View>
                                            <View >
                                                <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                                                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.textStatus3}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>Accident</Text>
                                        </View>
                                    </View>
                                    <View style={styles.textBoxDetail}>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                                        </View>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                                        </View>
                                    </View>
                                </View>
                                </TouchableOpacity>

                                <View style={styles.boxItemList}>
                                    <View style={styles.containerOrderMain}>
                                        <View style={styles.containerOrder}>
                                            <View >
                                                <Image source={require('../../../assets/images/icon_truck.png')}
                                                    style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                                            </View>
                                            <View >
                                                <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                                                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.textStatus2}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>Success</Text>
                                        </View>
                                    </View>
                                    <View style={styles.textBoxDetail}>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                                        </View>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.boxItemList}>
                                    <View style={styles.containerOrderMain}>
                                        <View style={styles.containerOrder}>
                                            <View >
                                                <Image source={require('../../../assets/images/icon_truck.png')}
                                                    style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                                            </View>
                                            <View >
                                                <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                                                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.textStatus}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>On Devivery</Text>
                                        </View>
                                    </View>
                                    <View style={styles.textBoxDetail}>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                                        </View>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.boxItemList}>
                                    <View style={styles.containerOrderMain}>
                                        <View style={styles.containerOrder}>
                                            <View >
                                                <Image source={require('../../../assets/images/icon_truck.png')}
                                                    style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                                            </View>
                                            <View >
                                                <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                                                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.textStatus3}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>Accident</Text>
                                        </View>
                                    </View>
                                    <View style={styles.textBoxDetail}>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                                        </View>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.boxItemList}>
                                    <View style={styles.containerOrderMain}>
                                        <View style={styles.containerOrder}>
                                            <View >
                                                <Image source={require('../../../assets/images/icon_truck.png')}
                                                    style={{ width: 40, height: 40, gap: 10, marginRight: 8 }} />
                                            </View>
                                            <View >
                                                <Text style={{ fontWeight: 700, fontSize: 16 }}>#ORDR1274663</Text>
                                                <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666', marginTop: 0 }}>06 ก.ค. 2024 15.47 น.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.textStatus2}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>Success</Text>
                                        </View>
                                    </View>
                                    <View style={styles.textBoxDetail}>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>ปลายทาง</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>รามอินทรา กม 8</Text>
                                        </View>
                                        <View style={styles.flexItem}>
                                            <Text style={{ fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#666' }}>น้ำหนัก</Text>
                                            <Text style={{ fontWeight: 700, fontSize: 13 }}>1.3 kg</Text>
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
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 8,
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
    containerOrder: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,

    },
    containerOrderMain: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5, // Specifies the width of the bottom border
        borderBottomColor: '#d7d7d7',
        paddingBottom: 8
    },
    textStatus: {
        backgroundColor: '#f47524',
        width: 90,
        borderRadius: 99,
        padding: 6,
        paddingHorizontal: 8,
        alignItems: 'center'
    },
    textStatus2: {
        backgroundColor: '#28a745',
        width: 90,
        borderRadius: 99,
        padding: 6,
        paddingHorizontal: 8,
        alignItems: 'center'
    },
    textStatus3: {
        backgroundColor: '#d9534f',
        width: 90,
        borderRadius: 99,
        padding: 6,
        paddingHorizontal: 8,
        alignItems: 'center'
    },
    textBoxDetail: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5
    },
    flexItem: {
        flex: 0.5,
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

