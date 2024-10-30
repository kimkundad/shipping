import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ headerShown: false }} />
      <Stack.Screen name="language" options={{ headerShown: false }} />
      <Stack.Screen name="helpcen" options={{ headerShown: false }} />
      <Stack.Screen name="policy" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      <Stack.Screen name="tracking" options={{ headerShown: false }} />
      <Stack.Screen name="maps" options={{ headerShown: false }} />
      <Stack.Screen name="mapsDestination"  />
      <Stack.Screen name="mapsReceiver" options={{ headerShown: false }} />
      <Stack.Screen name="service" />
    </Stack>
  );
}
