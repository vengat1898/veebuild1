import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import logoimg from '../../assets/images/veebuilder.png';
import { SessionContext } from '../../context/SessionContext';

export default function LoginScreen() {
  const router = useRouter();
  const { saveSession, isSessionLoaded, session } = useContext(SessionContext);

  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userType = '1';

  useEffect(() => {
    if (isSessionLoaded && session?.id) {
      router.replace('/components/Home');
    }
  }, [isSessionLoaded, session]);

  const handleGetOtp = async () => {
    const regex = /^[6-9]\d{9}$/;
    if (!regex.test(mobileNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', userType);
      formData.append('mobile', mobileNumber);

      const response = await axios.post(
        'https://veebuilds.com/mobile/login.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Login response:', response.data);

      if (response.data.success == 1) {
        const userId = response.data.userId?.toString() || '';
        
        await saveSession({
        id: userId,
        mobile: mobileNumber,
        type: userType,
      });

        router.push({
          pathname: '/components/Otp',
          params: {
            otp: response.data.otp,
            mobile: mobileNumber,
            userId: userId,
          },
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSessionLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image source={logoimg} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Sign In</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              keyboardType="number-pad"
              value={mobileNumber}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                if (cleanText.length <= 10) {
                  setMobileNumber(cleanText);
                }
              }}
              maxLength={10}
            />
            <FontAwesome name="phone" size={20} color="gray" style={styles.icon} />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleGetOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Get OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  logo: { width: 250, height: 250, alignSelf: 'center', marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#1e90ff', marginBottom: 20, textAlign: 'center' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 20, paddingHorizontal: 10 },
  input: { flex: 1, height: 50 },
  icon: { marginLeft: 10 },
  button: { height: 50, backgroundColor: '#1e90ff', justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});













