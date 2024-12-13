import { Camera, CameraView } from "expo-camera";
import { Stack, Link, useRouter } from "expo-router"; 
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import api from '../../hooks/api'; // เพิ่ม api instance สำหรับเรียก API
import { useTranslation } from "react-i18next";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrData, setQRData] = useState(null);
  const router = useRouter(); 
  const intervalId = useRef(null); // ใช้ Ref เพื่อเก็บ interval id
  const { i18n, t } = useTranslation();

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current); // ล้าง interval เมื่อ component ถูกถอด
      }
      qrLock.current = true; // หยุดการทำงานของการสแกน
    };
  }, [router]);

  // ฟังก์ชันการเรียก API หลังจากสแกน QR code
  const checkQRCode = async (qrcode) => {
    try {
      const response = await api.post('/checkQrcode', { qrcode });
      
      if (response.data.success === true) {
        Alert.alert('สำเร็จ', 'กำลังโหลดข้อมูล');

        // ปลดล็อกการทำงานเพื่อหยุดฟังก์ชันการสแกน
      if (intervalId.current) {
        clearInterval(intervalId.current); // ล้าง interval ที่ตั้งไว้
      }


        router.push({
          pathname: '(setting)/tracking',
          params: { id: response.data.order.id }, 
        });
      } else {
        Alert.alert('ข้อผิดพลาด', 'ไม่พบข้อมูลของท่านหรือ QR Code ผิดพลาด');
      }
    } catch (error) {
      console.error('Error checking QR code:', error);
      Alert.alert('Error', 'Error checking the QR code.');
    }
  };

  // ฟังก์ชันการเลือกรูปภาพจากเครื่อง
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setSelectedImage(selectedUri); 
      processImage(selectedUri); 
    } else {
      console.log('Image selection was canceled or no image selected.');
    }
  };

  // ฟังก์ชันสแกน QR Code จากรูปภาพ
  const processImage = async (imageUri) => {
    try {
      const scannedResults = await Camera.scanFromURLAsync(imageUri, 'qr');
      if (scannedResults.length > 0) {
        const dataNeeded = scannedResults[0].data;
        setQRData(dataNeeded); 
        checkQRCode(dataNeeded); // ตรวจสอบ QR code หลังจากสแกนได้
      } else {
        setQRData("No QR Code Found");
        Alert.alert('No QR code found');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      Alert.alert('Error', 'Error processing the image');
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {/* แสดงกล้อง */}
      {selectedImage === null ? (
        <CameraView
        style={[StyleSheet.absoluteFill, { flex: 1 }]}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true; // ล็อกการสแกนไม่ให้ทำงานซ้ำ
            setTimeout(async () => {
              checkQRCode(data); // ตรวจสอบ QR code หลังจากสแกนได้
            }, 200);
          }
        }}
      />
      ) : (
        <View style={StyleSheet.absoluteFillObject}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </View>
      )}

      <Overlay />

      {/* ปุ่มสำหรับเลือกรูปภาพ */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarstyle}>
          <TouchableOpacity style={styles.galleryButton} onPress={() => router.push('(tabs)')}>
            <Text style={styles.buttonText}>{t("home.back")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Text style={styles.buttonText}>{t("home.file")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {qrData && (
        <Text style={styles.qrText}>QR Code Data: {qrData}</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButton: {
    backgroundColor: '#666',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  qrText: {
    marginTop: 20,
    fontSize: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  bottomBarstyle: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
});