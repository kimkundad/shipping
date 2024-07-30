import { Image, View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useNavigation, router } from 'expo-router';
import Dropdown from "../../components/DropDown";

const Payment = () => {


  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#F5F5F5' }} >
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.listItemCon}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Link href="/(tabs)/setting" style={{ padding: 10 }}>
              <Ionicons name="chevron-back" size={30} color="black" />
            </Link>
            <View style={styles.textListHead} >
              <Text style={{ fontSize: 18, fontFamily: 'Prompt_500Medium' }}>Payment Method</Text>
            </View>
            <View >
              <Ionicons style={{ padding: 10 }} name="notifications-outline" size={27} color="black" />
            </View>
          </View>
        </View>

        <View >
          
         <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Image source={require('../../assets/images/S__14983172.jpg')}
                    style={{ width: 350, height: 475 }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default Payment


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
    fontFamily: 'Prompt_400Regular',
    fontSize: 14
  },
  formAction: {
  
    marginTop: 10,
    marginBottom: 50
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
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  headerPage: {
    padding: 20,
    fontFamily: 'Prompt_500Medium',
    fontSize: 18,
    marginTop: -5
  },
  input: {
    marginBottom: 10,
  },
  inputLabel: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#121F43',
    marginBottom: 8,
  },
  inputControl: {
    height: 45,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'solid',
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
    paddingTop: 15,
    position: 'static',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    padding: 10,
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