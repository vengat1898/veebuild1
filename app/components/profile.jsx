import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          const response = await axios.get(`https://veebuilds.com/mobile/profile_fetch.php?id=${id}`);
          if (response.data.success === 1) {
            const profile = response.data;
            setName(profile.name);
            setMobile(profile.mobile);
            setEmail(profile.email);
            setLocation(profile.location);
              await AsyncStorage.setItem('userName', profile.name);
             await AsyncStorage.setItem('userMobile', profile.mobile);
          } else {
            Alert.alert('Error', 'Failed to load profile.');
          }
        } else {
          Alert.alert('Error', 'User ID not found.');
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
        Alert.alert('Error', 'Could not fetch profile.');
      }
    };

    fetchProfile();
  }, []);


  const handleGetLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = locationData.coords;

    // Reverse geocode to get address string
    let addressArray = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addressArray.length > 0) {
      const address = addressArray[0];
      const formattedAddress = `${address.name || ''}, ${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${address.postalCode || ''}, ${address.country || ''}`;
      setLocation(formattedAddress);
    } else {
      Alert.alert('Error', 'Unable to fetch address from location.');
    }
  } catch (error) {
    console.error('Location Error:', error);
    Alert.alert('Error', 'Failed to get current location.');
  }
};


  const handleUpdate = async () => {
  if (!name || !mobile || !email || !location) {
    Alert.alert('Validation Error', 'All fields are required.');
    return;
  }

  try {
    const url = `https://veebuilds.com/mobile/profile_update.php?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&location=${encodeURIComponent(location)}&cus_id=${userId}`;

    const response = await axios.get(url);
    console.log('API Response:', response.data); // <-- Add this

    if (response.data.message === 'Successfully') {
      Alert.alert('Success', 'Profile updated successfully!');
    } else {
      Alert.alert('Update Failed', response.data.message || 'Try again.');
    }
  } catch (error) {
    console.error('Update error:', error);
    Alert.alert('Error', 'Something went wrong.');
  }
};


  return (
    <View style={{ flex: 1 }}>
      {/* Custom Header */}
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity onPress={handleGetLocation} style={styles.locationButton}>
         <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
         </TouchableOpacity>

        
        <LinearGradient
  colors={['#1789AE', '#132740']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientButton}
>
  <TouchableOpacity style={styles.button} onPress={handleUpdate}>
    <Text style={styles.buttonText}>Update Profile</Text>
  </TouchableOpacity>
</LinearGradient>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    paddingTop: 70, // For status bar space on iOS/Android
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    height: 50,
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gradientButton: {
  borderRadius: 8,
  marginTop: 10,
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},
button: {
  height: 50,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
},

locationButton: {
  marginBottom: 20,
  backgroundColor: '#e0f7fa',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},
locationButtonText: {
  color: '#00796b',
  fontWeight: '600',
},
});