import { Stack } from 'expo-router';
import { UserProvider } from '../../hooks/UserContext';

export default function Layout() {
  return (
    <UserProvider>
    <Stack>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
    </Stack>
    </UserProvider>
  );
}
