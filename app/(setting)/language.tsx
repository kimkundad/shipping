import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from "react-i18next";
import { getSecureItem, setSecureItem } from '@/utils/secureStorage';

const Language = () => {

  const { i18n, t } = useTranslation(); // ใช้ i18n สำหรับการจัดการภาษา
  const [checked, setChecked] = useState("");
  const currentLanguage = i18n.language;

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await getSecureItem("language");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
        setChecked(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  const changeLanguage = async (lang: string) => {
    await setSecureItem("language", lang);
    i18n.changeLanguage(lang);
    setChecked(lang);
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#fff' }} >
      <StatusBar style="dark" />
      <LinearGradient
                    colors={['#1e3c72', '#1e3c72', '#2a5298']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.listItemCon}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity style={styles.btnBack} onPress={() => router.push('/(tabs)/setting')}>
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
                                  {t("language")}
                                </Text>
                            </View>

                            {/* ใช้ View เปล่าทางขวาเพื่อให้ไอคอน Back และ Text อยู่ตรงกลาง */}
                            <View style={{ width: 32 }} />
                        </View>

                    </View>
                </LinearGradient>
      <ScrollView>
        

        <View style={{ paddingBottom : 10, paddingTop: 20}}>
            
          <View style={styles.card}>
     

           {/* ภาษาอังกฤษ */}
           <TouchableOpacity
              style={styles.LItem}
              onPress={() => changeLanguage("en-US")}
            >
              <View style={styles.showflex}>
                <Text style={styles.TextName}>English (US)</Text>
                <View style={[styles.radioButton, checked === "en-US" && styles.radioButtonInner]} />
              </View>
            </TouchableOpacity>

            {/* ภาษาจีน */}
            <TouchableOpacity
              style={styles.LItem}
              onPress={() => changeLanguage("zh-CN")}
            >
              <View style={styles.showflex}>
                <Text>中文 (自动翻译)</Text>
                <View style={[styles.radioButton, checked === "zh-CN" && styles.radioButtonInner]} />
              </View>
            </TouchableOpacity>

            {/* ภาษาไทย */}
            <TouchableOpacity
              style={styles.LItem}
              onPress={() => changeLanguage("th-TH")}
            >
              <View style={styles.showflex}>
                <Text>ภาษาไทย (TH)</Text>
                <View style={[styles.radioButton, checked === "th-TH" && styles.radioButtonInner]} />
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default Language


const styles = StyleSheet.create({
  headerGradient: {
    height: 85,
    width: '100%',
},
TextName: {
  fontFamily: "Prompt_400Regular",
  fontSize: 16
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
  container: {
    padding: 20,
  },
  showflex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  LItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    
  },
  line_bot: {
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 0.3,
    paddingBottom: 5,
    marginBottom: 10

  },
 
  card: {
    paddingTop: 0,
    position: 'static',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    padding: 10,

  },
 
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#121F43',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonInner: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#2a5298',
  },
  radioButtonLabel: {
    fontSize: 16,
  },
});