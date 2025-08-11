import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SessionContext } from '../../context/SessionContext';

export default function Profile() {
  const router = useRouter();
  const { getUserId } = useContext(SessionContext);

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const id = await getUserId();
      if (id) {
        setUserId(id);
        const response = await axios.get(`https://veebuilds.com/mobile/profile_fetch.php?id=${id}`);
        if (response.data.success === 1) {
          const profile = response.data;
          setName(profile.name);
          setMobile(profile.mobile);
          setEmail(profile.email);
          setLocation(profile.location);
        } else {
          Alert.alert('Error', 'Failed to load profile.');
        }
      } else {
        Alert.alert('Error', 'User ID not found.');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      Alert.alert('Error', 'Could not fetch profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [getUserId]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;

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
    if (!name || !email || !location) {
      Alert.alert('Validation Error', 'All fields except mobile are required.');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://veebuilds.com/mobile/profile_update.php?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&location=${encodeURIComponent(location)}&cus_id=${userId}`;
      console.log("=====pro uri",url)

      const response = await axios.get(url);
      
      if (response.data.message === 'Successfully') {
        Alert.alert('Success', 'Profile updated successfully!');
        fetchProfile();
      } else {
        Alert.alert('Update Failed', response.data.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Something went wrong. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
        {isLoading && <ActivityIndicator size="large" color="#1789AE" style={styles.loadingIndicator} />}
        
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
          editable={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={location}
          onChangeText={setLocation}
          multiline
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
          <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Text>
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
    paddingTop: 50,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  loadingIndicator: {
    marginVertical: 20,
  },
});