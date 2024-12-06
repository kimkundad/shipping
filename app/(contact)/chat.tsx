import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Modal, Text, Image, StyleSheet, TextInput, Dimensions, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Button, Keyboard, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router } from 'expo-router';
import { GiftedChat } from 'react-native-gifted-chat';
import api from '../../hooks/api'; // Axios instance
import { UserContext } from '../../hooks/UserContext';
import axios from 'axios';
import socket from '../../hooks/socket'; // Import Socket.IO Instance
import * as ImagePicker from "expo-image-picker";
import Lightbox from "react-native-lightbox-v2";

const { width } = Dimensions.get('window');


const Chats = () => {

    const { userProfile, setUserProfile } = useContext(UserContext);
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState("")
    const [selectedImage, setSelectedImage] = useState(null); // เก็บรูปที่เลือก
    const [isImageViewerVisible, setImageViewerVisible] = useState(false); // ควบคุมการแสดงผล Modal


    useEffect(() => {
        if (room) {
            // เข้าร่วมห้องผ่าน Socket.IO
            socket.emit("join-room", room.id);

            console.log(`Joined room->: ${room.id}`);

            // ฟังข้อความใหม่ในห้อง
            socket.on("new-message", (data) => {

                console.log("Received -> new-message event with data:", data);

                if (data) {
                    const newMessage = {
                        _id: data.id,
                        text: data.message,
                        createdAt: new Date(data.created_at),
                        user: {
                            _id: data.sender_id,
                            name: data.sender_name,
                        },
                    };

                    setMessages((prevMessages) => {
                        // ตรวจสอบว่ามีข้อความนี้อยู่แล้วหรือไม่
                        const exists = prevMessages.some((msg) => msg._id === newMessage._id);
                        if (!exists) {
                            return GiftedChat.append(prevMessages, [newMessage]);
                        }
                        return prevMessages; // ถ้ามีอยู่แล้วไม่ต้องเพิ่ม
                    });
                } else {
                    console.error("No data received in new-message event");
                }

            });

            // Cleanup เมื่อออกจากห้อง
            return () => {
                socket.emit("leave-room", room.id);
                socket.off("new-message");
            };
        }
    }, [room]);

    useEffect(() => {
        // ตรวจสอบหรือสร้างห้อง
        const initializeRoom = async () => {
            try {

                const response = await api.get(`/createRooms`);

                if (response.data.success) {
                    setRoom(response.data.room);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to create or fetch room.');
            } finally {
                setLoading(false);
            }
        };

        initializeRoom();
    }, []);

    useEffect(() => {
        // ข้อความเริ่มต้น

        const fetchChatHistory = async () => {
            try {

                const response = await api.get(`/chat-history`);

                if (response.data.success) {
                    // แปลงข้อมูลให้ตรงกับ GiftedChat
                    const formattedMessages = response.data.messages.map((msg) => ({
                        _id: msg.id,
                        text: msg.message,
                        createdAt: new Date(msg.created_at),
                        user: {
                            _id: msg.sender.id,
                            name: msg.sender.name,
                        },
                        image: msg.image_url || null, // หากมี URL รูปภาพ จะเพิ่ม property image
                    }));
                    setMessages(formattedMessages);
                } else {
                    Alert.alert('Error', 'Failed to fetch chat history.');
                }


            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'An error occurred while fetching chat history.');
            } finally {
                setLoading(false);
            }

        };

        if (room) fetchChatHistory(); // ดึงประวัติแชทเฉพาะเมื่อมีข้อมูลห้อง

    }, [room]);

    // const onSend = async (newMessages = []) => {
    //     if (!newMessages || newMessages.length === 0) {
    //         console.error("No new messages to send");
    //         return;
    //     }

    //     const messageToSend = newMessages[0];

    //     if (!messageToSend._id || !messageToSend.text) {
    //         console.error("Message structure is invalid:", messageToSend);
    //         return;
    //     }

    //     setMessages((prevMessages) => GiftedChat.append(prevMessages, [messageToSend]));

    //     try {
    //         const response = await axios.post('https://api.loadmasterth.com/api/storeMessage', {
    //             room_id: room?.id,
    //             sender_id: userProfile?.id,
    //             message: messageToSend.text,
    //         });

    //         if (response.data.success) {
    //             console.log('Message stored:', response.data.message);
    //         }
    //     } catch (error) {
    //         console.error("Failed to send message:", error);
    //         Alert.alert("Error", "Failed to send message.");
    //     }
    // };



    const onSend = async () => {
        if (inputText.trim().length > 0) {
            // const newMessage = {
            //     _id: Math.random().toString(36).substring(7),
            //     text: inputText,
            //     createdAt: new Date(),
            //     user: {
            //         _id: userProfile?.id,
            //         name: userProfile?.name,
            //     },
            // };

            // setMessages((prevMessages) => {
            //     // ตรวจสอบว่ามีข้อความนี้อยู่แล้วหรือไม่
            //     const exists = prevMessages.some((msg) => msg._id === newMessage._id);
            //     if (!exists) {
            //         return GiftedChat.append(prevMessages, [newMessage]);
            //     }
            //     return prevMessages;
            // });

            console.log('room_id', room?.id, 'sender_id', userProfile, 'message', inputText, 'sender_name', userProfile?.name);
            try {

                const response = await axios.post('https://api.loadmasterth.com/api/storeMessage', {
                    room_id: room?.id,
                    sender_id: userProfile?.id,
                    message: inputText,
                    sender_name: userProfile?.name,
                });

                if (response.data.success) {
                  //  console.log('Message stored:', response.data.message);
                }
            } catch (error) {
                console.error("Failed to send message:", error);
                Alert.alert("Error", "Failed to send message.");
            }
            setInputText(""); // รีเซ็ตข้อความใน input
        }
    };

    const handleUploadImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Denied", "Permission to access gallery is required!");
            return;
        }

        Alert.alert(
            "Upload Image",
            "Choose an option",
            [
                {
                    text: "Take Photo",
                    onPress: async () => {
                        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
                        if (!cameraPermission.granted) {
                            Alert.alert("Permission Denied", "Permission to access camera is required!");
                            return;
                        }

                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 1,
                        });

                        if (!result.canceled) {
                            await handleImageUpload(result.uri || result?.assets?.[0]?.uri);
                        }
                    },
                },
                {
                    text: "Choose from Gallery",
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 1,
                        });

                        if (!result.canceled) {
                            await handleImageUpload(result.uri || result?.assets?.[0]?.uri);
                        }
                    },
                },
                { text: "Cancel", style: "cancel" },
            ]
        );
    };


    // ฟังก์ชันสำหรับอัปโหลดรูปและส่งไป API
    const handleImageUpload = async (imageUri) => {
        try {
            const formData = new FormData();
            formData.append("room_id", room?.id);
            formData.append("sender_id", userProfile?.id);
            formData.append("message", ""); // ไม่มีข้อความในกรณีที่ส่งแค่รูป
            formData.append("image", {
                uri: imageUri,
                type: "image/jpeg", // ประเภทไฟล์
                name: "uploaded_image.jpg", // ชื่อไฟล์
            });

            const response = await axios.post("https://api.loadmasterth.com/api/storeMessage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                console.log("Image message stored:", response.data.message);

                // เพิ่มข้อความใหม่ใน GiftedChat
                const imageMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: "",
                    createdAt: new Date(),
                    user: {
                        _id: userProfile?.id,
                        name: userProfile?.name,
                    },
                    image: imageUri, // แสดงรูปภาพใน GiftedChat
                };

                setMessages((prevMessages) => GiftedChat.append(prevMessages, [imageMessage]));
            }

        } catch (error) {
            console.error("Failed to upload image:", error);
            Alert.alert("Error", "Failed to upload image.");
        }
    };

    useEffect(() => {
        console.log("selectedImage:", selectedImage);
        console.log("isImageViewerVisible:", isImageViewerVisible);
    }, [selectedImage, isImageViewerVisible]);


    const renderInputToolbar = () => (
        <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleUploadImage} style={styles.iconButton}>
                <Ionicons name="image-outline" size={24} color="#7F7F7F" />
            </TouchableOpacity>
            <TextInput
                style={styles.textInput}
                placeholder="Type a message"
                value={inputText}
                onChangeText={setInputText}
            />
            <TouchableOpacity onPress={onSend} style={styles.iconButton}>
                <Ionicons name="send" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );


    const renderMessageImage = (props) => {
        return (
            <Lightbox
                activeProps={{
                    style: {
                        width: "90%",
                        height: "90%",
                        resizeMode: "contain",
                    },
                }}
            >
                <Image
                    source={{ uri: props.currentMessage.image }}
                    style={{
                        width: 150,
                        height: 150,
                        borderRadius: 8,
                    }}
                    resizeMode="cover"
                />
            </Lightbox>
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    return (
        <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={-290} // เพิ่ม Offset สำหรับ Header
    style={{ flex: 1 }}
>
            
          
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
                    <StatusBar style="dark" />
                    <LinearGradient
                        colors={['#1e3c72', '#1e3c72', '#2a5298']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.headerGradient}
                    >
                        <View style={styles.listItemCon}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(tabs)/help')}>
                                    <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 5, borderRadius: 25 }}>
                                        <Ionicons name="chevron-back" size={20} color="black" />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.textListHead}>
                                    <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium', color: '#fff', textAlign: 'center' }}>
                                        ส่งข้อความถึงเรา 
                                    </Text>
                                </View>
                                <View style={{ width: 32 }} />
                            </View>
                        </View>
                    </LinearGradient>

                    <GiftedChat
                        messages={messages}
                        onSend={(messages) => onSend(messages)}
                        user={{
                            _id: userProfile?.id, // ID ผู้ใช้ตัวอย่าง
                        }}
                        renderInputToolbar={renderInputToolbar}
                        scrollToBottom={true} // เลื่อนลงล่างสุดอัตโนมัติ
                        bottomOffset={Platform.OS === "ios" ? 40 : 0} // เพิ่ม Offset สำหรับ iOS
                        messagesContainerStyle={{
                            paddingBottom: Platform.OS === "ios" ? 80 : 80,
                        }}
                        renderMessageImage={renderMessageImage}
                        scrollToBottomComponent={() => (
                            <Ionicons name="chevron-down" size={24} color="#007AFF" />
                        )}
                    />

                    {/* <View>
                <Button title="Upload Image" onPress={handlePickImage} />
                <Button title="Take Photo" onPress={handleTakePhoto} />
            </View> */}


                    {/* <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Message"
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View> */}
                    {/* Modal สำหรับดูรูปภาพขนาดเต็ม */}
                    
                </SafeAreaProvider>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Chats;

const styles = StyleSheet.create({
    headerGradient: {
        height: Platform.select({
            ios: 90,
            android: 65,
        }),
        width: '100%',
    },
    chatImage: {
        width: 150,
        height: 150,
        borderRadius: 8,
        margin: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)", // พื้นหลังสีดำโปร่งใส
        justifyContent: "center",
        alignItems: "center",
    },
    fullScreenImage: {
        width: "90%", // ใช้พื้นที่ 90% ของหน้าจอ
        height: "70%", // ลดขนาดภาพ
    },
    closeButton: {
        position: "absolute",
        top: 30,
        right: 20,
        zIndex: 10, // ให้ปุ่มอยู่เหนือภาพ
    },
    closeIcon: {
        width: 30,
        height: 30,
        tintColor: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#E8E8E8",
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#000",
    },
    textInput: {
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: "#F9F9F9",
        marginHorizontal: 10,
    },
    iconButton: {
        padding: 8,
    },
    gif: {
        paddingBottom: 80
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
    listItemCon: {
        marginTop: Platform.select({
            ios: 35,
            android: 10,
        }),
        paddingHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    messageContainer: {
        maxWidth: '70%',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginVertical: 5,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#8a2be2',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e0e0e0',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Prompt_400Regular',
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#333',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        marginBottom: Platform.select({
            ios: 25,
            android: 10,
        }),
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#8a2be2',
        borderRadius: 20,
        padding: 10,
    },
});
