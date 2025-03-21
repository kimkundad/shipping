import React, { useState, useEffect  } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native'; // Import useRoute
import { Image, View, Text, TouchableOpacity, StyleSheet, Platform, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import api from '../../hooks/api'; // Axios instance
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from "react-i18next";

// Define the route parameters
type RootStackParamList = {
    Service: {
      selectedLat: number;
      selectedLng: number;
      selectedLat2: number;
      selectedLng2: number;
      form: {
        adddress: string;
        name: string;
        phone: string;
        remark: string;
        province: string;
        adddress2: string;
        name2: string;
        phone2: string;
        remark2: string;
        province2: string
        branch_id: number;
      };
    };
  };
  const { width } = Dimensions.get('window');
  const carouselHeight = width * (6.5 / 16);
const img_height = 110; // ปรับความสูงของภาพตามความต้องการ
const imgsize_height = 160;


    const Service = () => {

    const route = useRoute<RouteProp<RootStackParamList, 'Service'>>();
    const navigation = useNavigation(); // สำหรับปุ่ม Back
    const bg = require('../../assets/images/feature-bg.png'); // ระบุตำแหน่งรูปภาพ

    const img_s = require('../../assets/images/size_s.png');
    const img_m = require('../../assets/images/size_m.png');
    const img_L = require('../../assets/images/size_L.png');
    const img_XL = require('../../assets/images/size_XL.png');

    const [selectedSize, setSelectedSize] = useState('S'); // Default size selection
    const [selectedDeliveryType, setSelectedDeliveryType] = useState('พื้นฐาน'); // Default delivery type
    const [selectedType, setSelectedType] = useState([]); // Default selected type

    const [locationre, setLocationre] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationSend, setLocationSend] = useState<{ latitude: number; longitude: number } | null>(null);
  const [formData, setFormData] = useState(null);
  const [weight, setWeight] = useState(''); // น้ำหนักสินค้า
  const [warb, setWarb] = useState(''); // น้ำหนักสินค้า
  const [machinery, setMachinery] = useState(''); // น้ำหนักสินค้า
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0); // เก็บค่ารวมของราคาที่คำนวณแล้ว
  const [selected, setSelected] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [dataSetting, setDataSetting] = useState(null);
  const [branchId, setBranchId] = useState(0);
  const { i18n, t } = useTranslation();

  const fetchData = async () => {

    try {
      const response = await api.get(`/getSetting`);
      const settingData = response.data.set;
      setDataSetting(settingData);
    } catch (error) {
      console.error('Error fetching order:', error);
    }

  };

  useEffect(() => {
    fetchData();
  }, []);

// ฟังก์ชันเลือก/ยกเลิกบริการยกของชั้น 1
const handleSelect = () => {
    setSelected(prevSelected => !prevSelected); // สลับสถานะของ selected
    if (selected2) setSelected2(false); // ถ้าเลือกชั้น 2 อยู่ ให้ยกเลิก
  };
  
  // ฟังก์ชันเลือก/ยกเลิกบริการยกของชั้น 2
  const handleSelect2 = () => {
    setSelected2(prevSelected2 => !prevSelected2); // สลับสถานะของ selected2
    if (selected) setSelected(false); // ถ้าเลือกชั้น 1 อยู่ ให้ยกเลิก
  };

  // Function to dynamically return the correct image based on the selected size
const getImageForSize = (size) => {
    switch (size) {
      case 'S':
        return img_s;
      case 'M':
        return img_m;
      case 'L':
        return img_L;
      case 'XL':
        return img_XL;
      default:
        return img_s; // Default image if no size is selected
    }
  };

  useEffect(() => {

    setLocationre({
        latitude: 13.5116094,
        longitude: 100.68715,
      });
      setFormData({
        adddress: 'TIP 9 ถ. สุขุมวิท ตำบล บางปูใหม่ อำเภอเมืองสมุทรปราการ สมุทรปราการ 10280',
        name: 'TIP 9 Industrial Project',
        phone: '-',
        remark: '-',
        province: 'จ.สมุทรปราการ',
  });
  console.log('-->', route.params)
    // ตรวจสอบและรวมข้อมูลจาก MapsDestination
    if (route.params?.selectedLat2 && route.params?.selectedLng2 && route.params?.form) {
      setLocationSend({
        latitude: route.params.selectedLat2,
        longitude: route.params.selectedLng2,
      });
      setBranchId(route.params.form.branch_id)
      setFormData((prevData) => ({
        ...prevData,
        adddress2: route.params.form.adddress2,
        name2: route.params.form.name2,
        phone2: route.params.form.phone2,
        remark2: route.params.form.remark2,
        province2: route.params.form.province2,
        branch_id: route.params.form.branch_id,
      }));
    }
  }, [route.params]);


    const sizes = ['S', 'M', 'L', 'XL'];
    const deliveryTypes = [
        { type: 'พื้นฐาน', price: 'ค่าตั้งต้น' },
        { type: 'มาตรฐาน', price: '฿1' },
        { type: 'พรีเมียม', price: '฿2' },
    ];


    const packageTypes = [
    { type: t("ride.nomalProduct"), icon: 'logo-dropbox' },
    { type: t("ride.machineProduct"), icon: 'settings' },
    { type: t("ride.waffle"), icon: 'ice-cream-outline' },
];

    // Toggle package type selection
    const togglePackageType = (type) => {
        if (selectedType.includes(type)) {
            // Remove the type if already selected
            setSelectedType((prevSelectedTypes) =>
                prevSelectedTypes.filter((item) => item !== type)
            );
        } else {
            // Add the type if not selected
            setSelectedType((prevSelectedTypes) => [...prevSelectedTypes, type]);
        }
    };

    const handleCreate = async () => {

        formData?.province2
        if (!formData?.province2) {
            Alert.alert('ขออภัย', 'กรุณาเลือกที่อยู่ในการจัดส่ง');
            return;
        }

        console.log('branchId:', branchId);
        // ตรวจสอบว่ากรอกข้อมูลครบถ้วนหรือไม่
        if (!formData?.adddress || !formData?.name || !formData?.phone || !formData?.adddress2 || !formData?.name2 || !formData?.phone2 || !selectedSize || !weight) {
            Alert.alert('ขออภัย', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        if (selectedType.length === 0) {
            Alert.alert('ขออภัย', 'กรุณาเลือกประเภทพัสดุ');
            return;
        }

        setLoading(true); // เริ่มการโหลด
        try {
          // รวบรวมข้อมูลทั้งหมด
          const orderData = {
            latitude: locationre?.latitude,
            longitude: locationre?.longitude,
            latitude2: locationSend?.latitude,
            longitude2: locationSend?.longitude,
            adddress: formData?.adddress,
            name: formData?.name,
            phone: formData?.phone,
            remark: formData?.remark,
            adddress2: formData?.adddress2,
            name2: formData?.name2,
            phone2: formData?.phone2,
            remark2: formData?.remark2,
            size: selectedSize, // ขนาด
            type: selectedType, // ประเภทพัสดุ
            weight, // น้ำหนักสินค้า
            province2: formData?.province2,
            province: formData?.province,
            price: price,
            warb,
            machinery,
            service: selected,
            service2: selected2,
            branchId: branchId
          };
    
          console.log('Creating order with data:', orderData);
          
        //  // ส่งคำขอแบบ POST ไปยัง API
          const response = await api.post('/createOrdere', orderData);
          console.log('Creating order with data response', response.data)
          if (response.data.success === true) {
            Alert.alert('สำเร็จ', 'สร้างออเดอร์ใหม่สำเร็จแล้ว');
            router.push({
                pathname: '(setting)/tracking',
                params: {
                    id: response.data.order.id,
                    dataOrder: JSON.stringify(response.data.order)
                  }, // ส่งพารามิเตอร์ id ของ order // ส่งพารามิเตอร์ id ของ order
              });
          } else {
            Alert.alert('ข้อผิดพลาด', 'ไม่สามารถสร้างออเดอร์ได้');
          }
        } catch (error) {
          Alert.alert('ข้อผิดพลาด', error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
          setLoading(false); // หยุดการโหลด
        }
    };


     // คำนวณราคาเมื่อเลือกจังหวัดหรือเปลี่ยนจำนวนสินค้า
  useEffect(() => {
    const calculateTotalPrice = async () => {
      if (formData?.province2 && weight) {
        try {
          const response = await api.post('/getProvince', { province2: formData.province2 });
          let pricePerUnit = 0;
          const parsedWeight = parseFloat(weight);

          // เลือกใช้เงื่อนไขตามจำนวนสินค้า
          if (parsedWeight <= 10) {
            pricePerUnit = response?.data?.province?.tenbox || 0;
          } else if (parsedWeight <= 20) {
            pricePerUnit = response?.data?.province?.twentybox || 0;
          } else if (parsedWeight <= 30) {
            pricePerUnit = response?.data?.province?.thirtybox || 0;
          } else if (parsedWeight <= 40) {
            pricePerUnit = response?.data?.province?.fortybox || 0;
          } else if (parsedWeight <= 50) {
            pricePerUnit = response?.data?.province?.fiftybox || 0;
          } else if (parsedWeight <= 60) {
            pricePerUnit = response?.data?.province?.sixtybox || 0;
          } else {
            pricePerUnit = response?.data?.province?.sixtybox || 0;
          }

          // คำนวณราคาเบื้องต้นตามจังหวัด
          let totalProvincePrice = pricePerUnit * parsedWeight;

          // คำนวณราคาบริการเพิ่มเติมตามบริการที่เลือก
          let additionalServicePrice = 0;
          if (selected) {
            additionalServicePrice = (dataSetting?.box_service1 || 0) * parsedWeight;
          } else if (selected2) {
            additionalServicePrice = parsedWeight <= 20
              ? (dataSetting?.box_service2 || 0) * parsedWeight
              : dataSetting?.box_service3 || 0;
          }

          // อัปเดตราคารวมทั้งหมด
          setPrice(totalProvincePrice + additionalServicePrice);
        } catch (error) {
          Alert.alert('Error', error.message || 'เกิดข้อผิดพลาดในการคำนวณราคา');
        }
      }
    };

    calculateTotalPrice();
  }, [formData?.province2, weight, selected, selected2, dataSetting]);
      

    return (
        <>
       <View
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Wrap the entire UI in TouchableWithoutFeedback */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
               

<View>
    <Image source={bg} style={styles.bgImg} />
    <View style={styles.overlay} />

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
                {t("ride.head")}
                </Text>
            </View>

            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('(setting)/selectBarnch')}>
                            <View
                                style={{
                                    backgroundColor: Colors.white,
                                    padding: 6,
                                    borderRadius: 25
                                }}
                            >
                                <MaterialIcons name="bookmark-border" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
        </View>
    </View>
</View>
                <View style={styles.container}>
                    <View style={styles.boxGiff}>

                        <View style={styles.addressContainer}>
                        <View>
                                    <TouchableOpacity >
                                    <View style={styles.row}>
                                        <Ionicons name="location-sharp" size={22} color="#3498db" />
                                        <Text style={styles.addressTitle} numberOfLines={1} ellipsizeMode="tail">
                                        TIP 9 Industrial Project
                                        </Text>
                                    </View>
                                    <Text style={styles.recipient}>ถ.สุขุมวิท บางปูใหม่ สมุทรปราการ 10280</Text>
                                    </TouchableOpacity>
                                </View>
                        </View>

                        <View style={styles.addressContainer2}>
                            {locationSend ? (
                                <View>
                                    <TouchableOpacity onPress={() => router.push('(setting)/mapsDestination')}>
                                    <View style={styles.row}>
                                        <Ionicons name="location-sharp" size={22} color="#e74c3c" />
                                        <Text style={styles.addressTitle} numberOfLines={1} ellipsizeMode="tail">
                                            {formData?.adddress2}
                                        </Text>
                                    </View>
                                    <Text style={styles.recipient}>{formData?.name2} • {formData?.phone2}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View>
                                    <View style={styles.row}>
                                        <Ionicons name="location-sharp" size={22} color="#e74c3c" />
                                        <TouchableOpacity onPress={() => router.push('(setting)/mapsDestination')}>
                                            <Text style={styles.linkTextnull}>{t("ride.addPoint")} *</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                        </View>

                    </View>

                    <Text style={styles.helperText}>
                         {t("ride.title")}
                    </Text>

                    <View style={{ alignItems: 'center' }}>
                    <Image source={getImageForSize(selectedSize)} style={styles.sizeImg} />
                    </View>

                    <View style={styles.rows}>

                    <View style={{ display: 'flex' }}>
                        <Text style={styles.label}>{t("ride.size")}*</Text>
                        <View style={styles.sizeSelector}>
                        {sizes.map((size) => (
                            <TouchableOpacity
                            key={size}
                            style={[
                                styles.sizeOption,
                                size === selectedSize && styles.sizeOptionSelected,
                            ]}
                            onPress={() => setSelectedSize(size)}
                            >
                            <Text
                                style={[
                                styles.sizeText,
                                size === selectedSize && styles.sizeTextSelected,
                                ]}
                            >
                                {size}
                            </Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                        </View>
                        
                        <View style={styles.weightContainer}>
                            <Text style={styles.label2}>{t("ride.total")}*</Text>
                            <TextInput 
                                style={styles.weightInput} 
                                placeholder={t("ride.piece")}
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric" // Ensure only numeric input
                                blurOnSubmit={true}
                            />
                        </View>
                       
                    </View>

                    {/* Type of Package */}
                    {/* Type of Package */}
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.label}>{t("home.type")} </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                            {packageTypes.map((pkg, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.typeOption,
                                        selectedType.includes(pkg.type) && styles.typeOptionSelected, // Highlight multiple selections
                                    ]}
                                    onPress={() => togglePackageType(pkg.type)} // Toggle the selected type
                                >
                                    <Ionicons
                                        name={pkg.icon}
                                        size={16}
                                        color={selectedType.includes(pkg.type) ? '#fff' : '#f47524'} // Change icon color when selected
                                    />
                                    <Text
                                        style={[
                                            styles.typeText2,
                                            selectedType.includes(pkg.type) && styles.typeTextSelected, // Change text color when selected
                                        ]}
                                    >
                                        {pkg.type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>


                        {selectedType.length > 0 && 
                        (

                            <View style={styles.boxNote}>
                            <View style={styles.showflex}>

                        {selectedType.includes('วาฟเฟิล') && (
                            <View style={styles.warbContainer}>
                                <Text style={styles.label3}>{t("ride.sumWaffle")}*</Text> 
                                <TextInput 
                                style={styles.warbInput} 
                                placeholder={t("ride.sumWaffle")}
                                value={warb}
                                onChangeText={setWarb}
                                keyboardType="numeric" // Ensure only numeric input
                                blurOnSubmit={true}
                                />
                            </View>
                            )}
                            {selectedType.includes('เครื่องจักร') && (
                            <View style={styles.warbContainer}>
                                <Text style={styles.label3}>{t("ride.sumMachine")}*</Text> 
                                <TextInput 
                                style={styles.warbInput} 
                                placeholder={t("ride.sumMachine")}
                                value={machinery}
                                onChangeText={setMachinery}
                                keyboardType="numeric" // Ensure only numeric input
                                blurOnSubmit={true}
                                />
                            </View>
                            )}

                                
                                </View>
                                <View >
                                    <Text style={styles.textNote}>** {t("ride.getRemark")}</Text>
                                </View>
                            </View>



                        )
                        }    
                        


                    <View style={styles.boxCheck}>
                    <TouchableOpacity style={styles.optionContainer} onPress={handleSelect}>
                        <Ionicons
                        name={selected ? 'radio-button-on' : 'radio-button-off'}
                        size={24}
                        color='#cd5305'
                        style={styles.radioButton}
                        />
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.timeText}>{t("ride.service1")}</Text>
                            <Text style={styles.timeTextPrice}>{t("ride.service1Price")}</Text>
                        </View>
                    </TouchableOpacity>
                    </View>

                    <View style={styles.boxCheck}>
                    <TouchableOpacity style={styles.optionContainer} onPress={handleSelect2}>
                        <Ionicons
                        name={selected2 ? 'radio-button-on' : 'radio-button-off'}
                        size={24}
                        color='#cd5305'
                        style={styles.radioButton}
                        />
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.timeText}>{t("ride.service2")}</Text>
                            <Text style={styles.timeTextPrice}>{t("ride.service2Price")}</Text>
                        </View>
                    </TouchableOpacity>
                    </View>


                    <Text style={styles.remarkText}>*{t("ride.serviceMark1")}</Text> 
                    <Text style={styles.remarkText}>*{t("ride.serviceMark2")}🫶🏻🫶🏻</Text> 

                    </View>

                </View>
                {/* Button Section */}
                <View style={styles.footcard}>
                    
                    {selectedType.includes('วาฟเฟิล') && (
                        <View style={styles.priceBoxsub}>
                            <Text style={styles.priceHeadsub}>{t("ride.sumWaffle")}</Text>
                            <Text style={styles.priceSumsub}>{warb}</Text>
                        </View>
                    )}
                    {selectedType.includes('เครื่องจักร') && (
                        <View style={styles.priceBoxsub}>
                            <Text style={styles.priceHeadsub}>{t("ride.sumMachine")}</Text>
                            <Text style={styles.priceSumsub}>{machinery}</Text>
                        </View>
                    )}
                    {weight && (
                        <View style={styles.priceBoxsub}>
                            <Text style={styles.priceHeadsub}>{t("ride.totalProduct")}</Text> 
                            <Text style={styles.priceSumsub}>{weight}</Text>
                        </View>
                    )}
                    <View style={styles.priceBox}>
                        <Text style={styles.priceHead}>{t("ride.totalPrice")}</Text> 
                        <Text style={styles.priceSum}>฿ {price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.checkButton} onPress={handleCreate} disabled={loading}> 
                            <Text style={styles.checkButtonText}>{t("ride.submitBtn")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </ScrollView>
      </TouchableWithoutFeedback>
    </View>
        </>
    );
}

export default Service;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    priceBoxsub: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    priceHeadsub: {
        fontSize: 14,
        fontFamily: 'Prompt_400Regular',
        marginBottom: 10,
        color: '#666'
    },
    priceSumsub: {
        fontSize: 16,
        fontFamily: 'Prompt_500Medium'
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
    textNote: {
        fontFamily: 'Prompt_400Regular',
        color: '#cd5305',
        fontSize: 13,
        marginTop: 10
    },
    rowh: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    listItemCon: {
        position: 'absolute', // ให้แน่ใจว่าอยู่เหนือ overlay
        top: 0, // เลื่อนตำแหน่งให้พอดีตามต้องการ
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 30,
    },
    bgImg: {
        width: '100%',
        height: img_height, // ปรับตามความสูงที่ต้องการ
    },
    boxCheck: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#cd5305',
        borderRadius: 10,
        margin: 0,
        position: 'relative',
        marginTop: 20
    },
    remarkText:{
        fontFamily: 'Prompt_400Regular',
        fontSize: 14,
        color: '#666',
        paddingLeft: 10,
        marginTop: 3
    },
    remarkText2:{
        fontFamily: 'Prompt_400Regular',
        fontSize: 14,
        color: '#666',
        paddingLeft: 10,
        marginTop: 3,
        marginLeft: 22
    },
    title: {
        flex: 1,
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'right',
      },
      changeText: {
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
        position: 'absolute',
        left: 10,
        top: -15,
      },
      optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      radioButton: {
        marginRight: 2,
      },
      timeText: {
        fontSize: 13,
        color: 'black',
        fontFamily: 'Prompt_400Regular',
      },
      timeTextPrice: {
        fontSize: 14,
        color: '#f47524',
        fontFamily: 'Prompt_500Medium',
      },
      boxNote: {
        borderWidth: 0.5,
        borderColor: '#cd5305',
        borderRadius: 8,
        borderStyle: 'dotted',
        marginTop: 10,
        padding: 10,
        paddingTop: 5
      },
    showflex: {
        display: 'flex',
        flexDirection: 'row', 
        gap: 10,
        
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sizeImg: {
        width: width,
        height: carouselHeight
    },
    rows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    scrollView: {
        marginTop: 10,
    },
    typeOptionSelected: {
        backgroundColor: '#f47524', // Green background when selected
    },
    typeOption: {
        flexDirection: 'row',
        alignItems: 'cente',
        backgroundColor: '#ffe8d9',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    typeText: {
        marginLeft: 5,
        fontSize: 14,
        color: 'gray',
    },
    typeText2: {
        marginLeft: 5,
        fontSize: 14,
        color: '#cd5305',
        fontFamily: 'Prompt_500Medium',
    },
    typeTextSelected: {
        color: '#fff', // White text when selected
    },
    label: {
        fontSize: 14,
        fontFamily: 'Prompt_500Medium',
    },
    label2: {
        fontSize: 14,
        fontFamily: 'Prompt_500Medium',
        textAlign: 'center',
        width: '100%'
    },
    label3: {
        fontSize: 14,
        fontFamily: 'Prompt_500Medium',
        width: '100%'
    },
    sizeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    sizeOption: {
        width: 35,
        height: 35,
        backgroundColor: '#ffe8d9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    sizeOptionSelected: {
        backgroundColor: '#f47524',
    },
    sizeText: {
        fontSize: 14,
    },
    sizeTextSelected: {
        color: '#fff',
    },
    weightContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    warbContainer: {
        marginTop: 10
    },
    weightInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginTop: 10,
        padding: 5,
        width: 80,
        textAlign: 'center',
        fontFamily: 'Prompt_400Regular',
    },
    warbInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginTop: 10,
        padding: 5,
        width: 120,
        textAlign: 'center',
        fontFamily: 'Prompt_400Regular',
    },
    addressContainer: {
        backgroundColor: '#fff',
        padding: 5,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        paddingBottom: 12
    },
    addressContainer2: {
        backgroundColor: '#fff',
        padding: 5,
        marginBottom: 10,
    },
    linkTextnull: {
        color: '#3498db',
        fontFamily: 'Prompt_500Medium',
        marginTop: 0,
        marginLeft: 10,
        fontSize: 15,
    },
    linkText: {
        color: '#3498db',
        fontFamily: 'Prompt_500Medium',
        marginTop: 0,
        marginLeft: 30,
        fontSize: 14,
    },
    addressTitle: {
        fontSize: 14,
        fontFamily: 'Prompt_500Medium',
        color: '#333',
        marginLeft: 8,
        maxWidth: '80%',
    },
    helperText: {
        paddingHorizontal: 10,
        marginTop: 15,
        fontSize: 14,
        color: 'gray',
        fontFamily: 'Prompt_400Regular',
        marginVertical: 10,
    },
    recipient: {
        fontFamily: 'Prompt_400Regular',
        fontSize: 14,
        color: '#666',
        marginTop: 0,
        marginLeft: 30,
    },
  
    priceBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    priceHead: {
        fontSize: 18,
        fontFamily: 'Prompt_400Regular',
        marginBottom: 15,
        color: '#666'
    },
    priceSum: {
        fontSize: 22,
        fontFamily: 'Prompt_500Medium'
    },
   
    backButtonContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 18,
        marginLeft: 10,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.4, // ปรับค่าความเข้มของสีดำ (เพิ่มเลขยิ่งมากจะยิ่งดำ)
    },
    boxGiff: {
        position: 'static',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 10,
        marginTop: -30,
        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.84,
        // Android shadow (elevation)
        elevation: 5,
    },
    footcard: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#ffeee4',
        borderRadius: 8,
        padding: 20,
        marginTop: 30
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffeee4',
        justifyContent: 'space-between',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30
    },
    totalText: {
        fontSize: 18,
        color: '#000',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    checkButton: {
        width: '100%', // ปรับให้ปุ่มมีความกว้าง 100% ของหน้าจอ
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f47524',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    checkButtonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Prompt_400Regular',
    },
});
