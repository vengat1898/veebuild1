import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import otpimg from '../../assets/images/otp.png';

export default function Otp() {
  const router = useRouter();
  const { otp: initialOtp, mobile: initialMobile, userId: initialUserId } = useLocalSearchParams();

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [mobile, setMobile] = useState(initialMobile || '');
  const [userId, setUserId] = useState(initialUserId || '');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
      return;
    }

    try {
      const response = await axios.post(
        `https://veebuilds.com/mobile/otp_verify.php?type=1&otp=${otpCode}&mobile=${mobile}`
      );

      if (response.data.success === 1) {
        await AsyncStorage.setItem('mobile', mobile);
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('isVerified', 'true');

        router.push('/components/Home');
      } else {
        Alert.alert('Error', 'Invalid OTP, please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image source={otpimg} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>OTP</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                style={styles.otpBox}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>

          {!keyboardVisible && (
            <Text style={styles.resendText}>
              Haven't received OTP? <Text style={styles.resendLink}>resend</Text>
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    color: '#1e90ff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#1e90ff',
  },
  verifyButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 15,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 14,
    color: '#000',
  },
  resendLink: {
    color: 'red',
    fontWeight: '600',
  },
});







