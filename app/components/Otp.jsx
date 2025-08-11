
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
  ActivityIndicator,
} from 'react-native';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import otpimg from '../../assets/images/otp.png';
import { SessionContext } from '../../context/SessionContext';

export default function Otp() {
  const router = useRouter();
  const { saveSession } = useContext(SessionContext);
  const { otp: initialOtp, mobile: initialMobile, userId: initialUserId } = useLocalSearchParams();

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    console.log('Received params:', {
      otp: initialOtp,
      mobile: initialMobile,
      userId: initialUserId
    });
    
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
  console.log('Verifying OTP:', otpCode);
  console.log('For mobile:', initialMobile);
  console.log('User ID:', initialUserId);

  if (otpCode.length < 4) {
    Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
    return;
  }

  setIsLoading(true);
  
  try {
    const formData = new FormData();
    formData.append('type', '1');
    formData.append('otp', otpCode);
    formData.append('mobile', initialMobile);
   if (initialUserId) {
      formData.append('userId', initialUserId);
    }

    const response = await axios.post(
      'https://veebuilds.com/mobile/otp_verify.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Server response:', response.data);

    // if (response.data.success === 1 || response.data.result === "Success") {
    //   // Modified this part to handle the actual response structure
    //   const userData = {
    //     id: response.data.id.toString(), // Ensure ID is string
    //   mobile: initialMobile,
    //   type: '1',
    //   name: response.data.name || '',
    //   email: response.data.email || '',
    //   sec_mobile: response.data.sec_mobile || ''
    //   };

    //   await saveSession(userData);

    if (response.data.success === 1) {
      console.log("=========userId"+response.data.id.toString());
      
      const userData = {
        id: response.data.id.toString(),
        mobile: initialMobile,
        type: '1',
        name: response.data.name || '',
        email: response.data.email || '',
        sec_mobile: response.data.sec_mobile || ''
      };

      await saveSession(userData);
      
      if (response.data.register_status === 1) {
        router.replace('/components/Home');
      } else {
        router.replace('/components/Register');
      }
    } else {
      Alert.alert(
        'Verification Failed',
        response.data.text || response.data.message || 'Invalid OTP'
      );
    }
  } catch (error) {
    console.error('Verification error:', error);
    let errorMessage = 'Something went wrong. Please try again.';
    
    if (error.response) {
      errorMessage = error.response.data.text || 
                    error.response.data.message || 
                    JSON.stringify(error.response.data);
    } else if (error.request) {
      errorMessage = 'No response from server';
    }
    
    Alert.alert('Error', errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleResendOtp = async () => {
    try {
      const formData = new FormData();
      formData.append('type', '1');
      formData.append('mobile', initialMobile);

      const response = await axios.post(
        'https://veebuilds.com/mobile/login.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success == 1) {
        Alert.alert('Success', 'New OTP has been sent to your mobile number.');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image source={otpimg} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>OTP Verification</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to {initialMobile}</Text>

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
                editable={!isLoading}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.verifyButton} 
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyText}>Verify</Text>
            )}
          </TouchableOpacity>

          {!keyboardVisible && (
            <Text style={styles.resendText}>
              Haven't received OTP?{' '}
              <Text style={styles.resendLink} onPress={handleResendOtp}>
                Resend
              </Text>
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    color: '#1e90ff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#1e90ff',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  verifyButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginBottom: 20,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    color: '#1e90ff',
    fontWeight: '600',
  },
});