import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setmssage] = useState('');
  const [location, setLocation] = useState('');

  const handleGetLocation = () => {
    // Dummy location fetching (you can replace this with real geolocation code)
   
  };

  const handleUpdate = () => {
    console.log('support:', { name, mobile, email, message, location });
    // You can add your update logic here
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
        <Text style={styles.headerTitle}>support</Text>
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
          placeholder="message"
          style={styles.input}
          value={message}
          onChangeText={setmssage}
        />

        {/* Current Location */}
        {/* <TouchableOpacity onPress={handleGetLocation} style={styles.locationButton}>
          <Text style={styles.locationButtonText}>Get Current Location</Text>
        </TouchableOpacity> */}
        <Text style={styles.locationText}>{location}</Text>

        {/* submit Button with LinearGradient */}
        <TouchableOpacity onPress={handleUpdate} style={styles.updateButtonWrapper}>
          <LinearGradient
            colors={['#1789AE', '#132740']}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.updateButton}
          >
            <Text style={styles.updateButtonText}>submit</Text>
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
