import { Stack } from 'expo-router';
import { UserProvider } from '../../hooks/UserContext';

export default function Layout() {
  return (
    <UserProvider>
    <Stack>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index"  />
      <Stack.Screen name="modal" options={{ headerShown: false }} />
      <Stack.Screen name="language" options={{ headerShown: false }} />
      <Stack.Screen name="helpcen" />
      <Stack.Screen name="policy"  />
      <Stack.Screen name="about"  />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      <Stack.Screen name="tracking"  />
      <Stack.Screen name="maps" options={{ headerShown: false }} />
      <Stack.Screen name="mapsDestination"  />
      <Stack.Screen name="mapsReceiver" options={{ headerShown: false }} />
      <Stack.Screen name="service" />
      <Stack.Screen name="payment"  />
      <Stack.Screen
        name="modalNew"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
    </UserProvider>
  );
}
