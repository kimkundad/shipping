import { Image, View, Text, Button, Alert, StyleSheet, Platform, TextInput, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import React, { useEffect, useContext ,useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../hooks/api'; // Axios instance

const { width } = Dimensions.get('window');

const Ratting = () => {

    const { id } = useLocalSearchParams(); // รับพารามิเตอร์ id

    const [rating, setRating] = useState(3); // ค่าคะแนนเริ่มต้น
    const [comment, setComment] = useState(""); // คำแสดงความคิดเห็น
    const stars = [1, 2, 3, 4, 5]; // จำนวนดาว
    const [loading, setLoading] = useState(false);
   
    const handleSubmit = async () => {
        if (rating && comment.trim()) {

            try {
            setLoading(true); // Start loading

            const response = await api.post('/PostRatting', {
                id: id,
                ratting: rating,
                ratting_comment: comment,
            });
            console.log('form', response.data)
            // ส่งข้อมูลไปยัง backend หรือแสดงผลใน console
            setComment("");
            setRating(3);

            if (response.data.success) {
                router.push('(setting)/successRat');
              }

            } catch (error) {
                console.error("Failed to send Ratting:", error);
                Alert.alert("Error", "Failed to send Ratting.");
            }

              
        } else {
            Alert.alert("Error", "Please provide both a rating and a comment.");
        }
    };


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
                                ให้คะแนนบริการ 
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>
            <ScrollView>
                
                <View style={styles.container}>
                <View style={{ marginTop: 20,  }}>

                    {/* Header */}
            <View style={{ alignItems: 'center' }}>
            <Text style={styles.header}>Rate Your Experience {id}</Text>

                {/* Rating Section */}
                <Text style={styles.subHeader}>Give your rating:</Text>
              
                
                <View style={styles.stars}>
                    {stars.map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={30}
                        color={star <= rating ? '#FFD700' : '#DDDDDD'}
                        />
                    </TouchableOpacity>
                    ))}
                </View>


                <Text style={styles.subHeader}>Leave a comment:</Text>
                </View>
                <View style={styles.input}>
                  <TextInput
                    clearButtonMode="while-editing"
                    onChangeText={setComment}
                    placeholder="Write your comment here..."
                    placeholderTextColor="#6b7280"
                    style={[styles.inputControl, { height: 80 }]}
                    value={comment}
                    multiline={true}
                  />
                </View>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.greenButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.greenButtonText}>{loading ? 'กำลังยืนยัน...' : 'ยืนยัน'}</Text>
                </TouchableOpacity>
                </View>
                    
                </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default Ratting

const styles = StyleSheet.create({
    headerGradient: {
        height: 85,
        width: '100%',
    },
    greenButton: {
    
        backgroundColor: '#121F43',
    borderColor: '#121F43',
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20
      },
      greenButtonText: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Prompt_500Medium',
      },
    inputControl: {
        height: 45,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#222',
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
    stars: {
        flexDirection: 'row',
      },
      ratingText: {
        marginTop: 10,
        fontSize: 16,
      },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "500",
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
        width: '100%',
        textAlignVertical: "top", // Aligns text at the top in multiline
    },
    buttonContainer: {
        marginTop: 20,
    },
    
    
});