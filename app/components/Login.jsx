import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import logoimg from '../../assets/images/veebuilder.png';

export default function Login() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');

  const handleGetOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number.');
      return;
    }

    try {
      const response = await axios.post(
        `https://veebuilds.com/mobile/login.php?type=vendor&mobile=${mobileNumber}`
      );

      if (response.data.success == 1) {
        router.push({
          pathname: './components/Otp',
          params: {
            otp: response.data.otp,
            mobile: mobileNumber,
            userId: response.data.userId || '',
          },
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
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
          <Image source={logoimg} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Sign In</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
            />
            <FontAwesome name="phone" size={20} color="gray" style={styles.icon} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});








