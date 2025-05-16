import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');

  const userId = '13';

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (!storedUserId) {
        console.warn('No user ID found');
        return;
      }

      const response = await axios.get(`https://veebuilds.com/mobile/profile_fetch.php?id=${storedUserId}`);
      if (response.data.success === 1) {
        const data = response.data;
        setName(data.name || '');
        setMobile(data.mobile || '');
        setEmail(data.email || '');
        setAddress(data.city || '');
        setLocation(data.location || '');
      } else {
        console.log('Failed to fetch profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  fetchProfile();
}, []);




  const handleUpdate = () => {
    console.log('Profile Updated:', { name, mobile, email, address, location });
  
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

      {/* Body */}
      <View style={styles.body}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Mobile Number"
          style={styles.input}
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        {/* Current Location */}
        <TouchableOpacity  style={styles.locationButton}>
          <Text style={styles.locationButtonText}>Get Current Location</Text>
        </TouchableOpacity>
        

        {/* Update Button with LinearGradient */}
        <TouchableOpacity onPress={handleUpdate} style={styles.updateButtonWrapper}>
          <LinearGradient
            colors={['#1789AE', '#132740']}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.updateButton}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    marginTop:40
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:40
  },
  body: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 18, // Increased padding for more height
    fontSize: 16,
    marginBottom: 25,    // Increased marginBottom for bigger gap between inputs
    height:60
  },
  
  locationButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,

  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    color:"blue"
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  updateButtonWrapper: {
    alignItems: 'center',
  },
  updateButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

