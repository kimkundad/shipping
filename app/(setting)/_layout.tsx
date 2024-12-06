import { Stack } from 'expo-router';
import { UserProvider } from '../../hooks/UserContext';

export default function Layout() {
  return (
    <UserProvider>
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
      <Stack.Screen name="service"  options={{ headerShown: false }} />
      <Stack.Screen name="payment" options={{ headerShown: false }}/>
      <Stack.Screen name="success" options={{ headerShown: false }} />
      <Stack.Screen name="successRat" options={{ headerShown: false }} />
      <Stack.Screen name="receipt" options={{ headerShown: false }} />
      <Stack.Screen name="paymentHis" options={{ headerShown: false }} />
      <Stack.Screen name="hisDetail" options={{ headerShown: false }} />
      <Stack.Screen name="selectBarnch" options={{ headerShown: false }} />
      <Stack.Screen name="ratting" options={{ headerShown: false }} />
      <Stack.Screen
        name="modalNew"
        options={{
          presentation: 'modal',
          headerShown: false
        }}
      />
    </Stack>
    </UserProvider>
  );
}
