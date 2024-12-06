import { LogBox } from 'react-native';
import 'react-native-reanimated';  // Import ก่อน component อื่น ๆ
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { UserProvider } from '../hooks/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';

import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

LogBox.ignoreLogs([
  '[Reanimated]',  // ซ่อนข้อความแจ้งเตือนจาก Reanimated
]);


// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Prompt_400Regular': require('../assets/fonts/Prompt-Regular.ttf'),
      'Prompt_500Medium': require('../assets/fonts/Prompt-Medium.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <NotificationProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(alogin)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(branch)" options={{ headerShown: false }} />
            <Stack.Screen name="(holiday)" options={{ headerShown: false }} />
            <Stack.Screen name="(contact)" options={{ headerShown: false }} />
            <Stack.Screen name="(warning)" options={{ headerShown: false }} />
            <Stack.Screen name="(setting)" options={{ headerShown: false }} />
            <Stack.Screen name="(scanner)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </NotificationProvider>
    </UserProvider>
  );
}


