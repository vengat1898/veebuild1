import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import logoimg from '../../assets/images/veebuilder.png';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';

export default function Register() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const router = useRouter();

  // Function to handle location permissions and fetch location
  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log('Location:', currentLocation);
    } else {
      Alert.alert('Permission Denied', 'Location permission is required.');
    }
  };

  useEffect(() => {
    const loadMobile = async () => {
      const savedMobile = await AsyncStorage.getItem('mobile');
      if (savedMobile) {
        setMobile(savedMobile);
        console.log('Loaded mobile:', savedMobile);
      } else {
        console.warn('No mobile number found in AsyncStorage.');
      }
    };
    loadMobile();

    // Request location permission on component mount
    getLocationPermission();
  }, []);

  const handleRegister = async () => {
    if (!name || !email) {
      Alert.alert('Validation Error', 'Please enter your name and email.');
      return;
    }

    if (!email.includes('gmail.com')) {
      Alert.alert('Invalid Email', 'Please enter a valid Gmail address.');
      return;
    }

    try {
      const requestData = {
        mobile,
        name,
        email,
      };

      // Add location data if available
      if (location) {
        const { latitude, longitude } = location.coords;
        requestData.gst_lattitude = latitude.toString();
        requestData.gst_longitude = longitude.toString();

        // Optionally, get city from coordinates
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        const city = geocode[0]?.city || 'Unknown City';
        requestData.location = city;  // Set location based on geocoded city
        requestData.city = city;
      } else {
        // Fallback values if location is not available
        requestData.location = 'Default Location';  // Set a fallback location name
        requestData.gst_lattitude = '0.0';  // Default latitude
        requestData.gst_longitude = '0.0';  // Default longitude
        requestData.city = 'Default City';  // Default city
      }

      console.log('Registering with data:', requestData);

      const response = await axios.get('https://veebuilds.com/mobile/register.php', {
        params: requestData,
      });

      const data = response.data;
      console.log('API response:', data);

      if (data.success === 1) {
          console.log('Registration success');
        router.push({ pathname: '/components/Home' });
      } else {
        Alert.alert('Registration Failed', data.text || 'Please try again.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image source={logoimg} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heading}>Register</Text>

          <View style={styles.inputWrapper}>
            <FontAwesome name="user" size={20} color="#1e90ff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome name="phone" size={20} color="#1e90ff" style={styles.icon} />
            <TextInput
              style={[styles.input, { color: '#555' }]}
              value={mobile}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome name="envelope" size={20} color="#1e90ff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
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
    width: 200,
    height: 200,
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
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  button: {
    height: 50,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});



