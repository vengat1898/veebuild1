import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function EnquiryRealHire() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { cat_id, land_id, v_id } = params;

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState(''); // still used internally
  const [message, setMessage] = useState('');
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          await AsyncStorage.setItem('cat_id', cat_id?.toString() || '');
          await AsyncStorage.setItem('land_id', land_id?.toString() || '');
          await AsyncStorage.setItem('v_id', v_id?.toString() || '');

          const profileUrl = `https://veebuilds.com/mobile/profile_fetch.php?id=${id}`;
          const response = await axios.get(profileUrl);
          if (response.data.success === 1) {
            const profile = response.data;
            setName(profile.name || '');
            setMobile(profile.mobile || '');
            setCity(profile.city || ''); // still set city here
          } else {
            Alert.alert('Error', 'Failed to load user profile.');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch profile information.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async () => {
    if (!name || !mobile || !message) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (!v_id) {
      Alert.alert('Error', 'Vendor ID is missing.');
      return;
    }

    try {
      const params = {
        user_id: userId,
        name,
        mobile,
        message,
        product_name: productName || `${name} - ${city}`,
        vendor_id: v_id,
        city,
        land_id,
      };

      const enquiryUrl = 'https://veebuilds.com/mobile/land_enquery.php';
      const response = await axios.get(enquiryUrl, { params });
      const queryString = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');
      console.log('Enquiry Submit URL:', `${enquiryUrl}?${queryString}`);

      if (response.data.success === 1) {
        Alert.alert('Success', response.data.message || 'Enquiry submitted successfully!');
        setMessage('');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to submit enquiry.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while submitting enquiry.');
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
        <Text style={styles.headerText}>Enquiry</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobile}
          keyboardType="phone-pad"
          onChangeText={setMobile}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter your enquiry message"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Enquiry</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 130 : 120,
    paddingTop: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    marginTop: Platform.OS === 'ios' ? 35 : 30,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 35 : 30,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1789AE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#1789AE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


