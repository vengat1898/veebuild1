// import { Stack } from 'expo-router';
// import { SessionProvider } from '../context/SessionContext';

// export default function RootLayout() {
//   return (
//     <SessionProvider>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="Login" />
//         <Stack.Screen name="Otp" />
//         <Stack.Screen name="Register" />
//         <Stack.Screen name="Home" />
//       </Stack>
//     </SessionProvider>
//   );
// }


import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { SessionProvider } from '../context/SessionContext';

export default function RootLayout() {
  return (
    <SessionProvider>
      <BackHandlerWrapper>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Login" />
          <Stack.Screen name="Otp" />
          <Stack.Screen name="Register" />
          <Stack.Screen name="Home" />
        </Stack>
      </BackHandlerWrapper>
    </SessionProvider>
  );
}

function BackHandlerWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      // Routes where we want to show exit confirmation
      const exitRoutes = [
        '/components/Home',
        '/components/Login',
        '/components/Otp',
        '/components/Register'
      ];
      
      // Check if current route is in exitRoutes
      if (exitRoutes.includes(pathname)) {
        // Show alert to exit app
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Exit",
              onPress: () => BackHandler.exitApp()
            }
          ]
        );
        return true; // Prevent default behavior
      } else {
        // If not on an exit route, navigate to home
        router.replace('/Home');
        return true; // Prevent default behavior
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [pathname, router]);

  return children;
}




