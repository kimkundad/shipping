import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router } from 'expo-router';

const Index = () => {
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
                            <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium' }}>สาขา</Text>
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
                        <Text style={styles.headerPage}>จัดการสาขา</Text>
                        <View style={styles.card}>

                            <Link href="/(branch)/shop" >
                                <View style={styles.innerItem}>
                                    <View>
                                        <Image source={require('../../assets/images/service/list_service3.png')}
                                            style={{ width: 75, height: 75, borderRadius: 8, gap: 10 }} />
                                    </View>
                                    <View style={{ width: '78%' }}>
                                        <Text style={styles.headBranch}>สาขาพระราม 7</Text>
                                        <Text style={styles.phoneText}>(+66) 95 846 7417</Text>
                                        <Text style={styles.addressText}>20/426 PRUKSAVILLE รามคำแหง - วงแหวน (ซอยมิสทีน)
                                            ถนนราษฎร์พัฒนา แขวง สะพานสูง
                                            แขวงสะพานสูง, เขตสะพานสูง, จังหวัดกรุงเทพมหานคร, 10240</Text>
                                    </View>
                                </View>
                            </Link>
                            <Link href="/(branch)/shop" >
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
                            </Link>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Link href="/(branch)/createBranch" >
                                    <View style={styles.addBranch}>
                                        <View >
                                            <Ionicons style={styles.iconAdd} name="add-circle-outline" size={22} color="black" />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 15, color: '#f47524', fontFamily: 'Prompt_400Regular', }}>เพิ่มสาขาใหม่</Text>
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

    container: {
        padding: 20,
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

