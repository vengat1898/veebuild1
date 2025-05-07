import { Stack } from 'expo-router';
import Login from './components/Login';
import Otp from './components/Otp';

export default function Layout() {

  
  return (
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name='/components/'
      options={{ headerShown: false }} />
    </Stack>
  );
}




