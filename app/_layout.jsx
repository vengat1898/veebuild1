import { Stack } from 'expo-router';
import { SessionProvider } from '../context/SessionContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="Otp" />
        <Stack.Screen name="Register" />
        <Stack.Screen name="Home" />
      </Stack>
    </SessionProvider>
  );
}




