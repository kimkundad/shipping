import { Tabs } from 'expo-router';
import React from 'react';
import { useFonts } from 'expo-font';
import { Text, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Prompt_400Regular, Prompt_500Medium } from '@expo-google-fonts/prompt';
import { UserProvider } from '../../hooks/UserContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  let [loaded] = useFonts({
    Prompt_400Regular,
    Prompt_500Medium,
  });

  useEffect(() => {
    if (loaded) {
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f47524',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Tracking',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="local-shipping" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbox-ellipses-sharp" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Setting',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="setting" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
    </UserProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  promptRegular: {
    fontFamily: 'Prompt_400Regular',
    fontSize: 18,
  },
  promptMedium: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 18,
  },
});