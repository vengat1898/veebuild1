import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Enquiry() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const catIdFromParams = params.cat_id;

  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [categories, setCategories] = useState('');
  const [message, setMessage] = useState('');

  // Fetch category name by cat_id
  const fetchCategoryName = async (catId) => {
    try {
      const response = await axios.get(`https://veebuilds.com/mobile/cat.php?cat_id=${catId}`);
      if (response.data.result === 'Success' && response.data.storeList.length > 0) {
        const categoryName = response.data.storeList[0].title;
        setCategories(categoryName);
      } else {
        setCategories('');
        console.warn('Category not found for cat_id:', catId);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);

          const response = await axios.get(`https://veebuilds.com/mobile/profile_fetch.php?id=${id}`);
          if (response.data.success === 1) {
            const profile = response.data;
            setName(profile.name || '');
            setMobile(profile.mobile || '');
            setCity(profile.city || '');
          } else {
            Alert.alert('Error', 'Failed to load user profile.');
          }

          if (catIdFromParams) {
            fetchCategoryName(catIdFromParams);
          }
        } else {
          console.warn('No userId found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Could not fetch profile information.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async () => {
  if (!name || !mobile || !message || !categories) {
    Alert.alert('Validation Error', 'Please fill in all fields.');
    return;
  }

  try {
    const response = await axios.get('https://veebuilds.com/mobile/enquery.php', {
      params: {
        user_id: userId,
        name: name,
        mobile: mobile,
        message: message,
        v_id: catIdFromParams,
        inner_subid: 1,
        product_name: categories,
        city: city
      }
    });
    console.log('Submitting enquiry with params:', params);
    console.log('Enquiry Response:', response.data);

    if (response.data.success === 1) {
      Alert.alert('Success', response.data.api_message || 'Enquiry submitted successfully!');
      setMessage('');
    } else {
      Alert.alert('Error', response.data.api_message || 'Failed to submit enquiry.');
    }
  } catch (error) {
    console.error('Enquiry error:', error);
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
        <Text style={styles.headerTitle}>Enquiry</Text>
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
          placeholder="Categories"
          value={categories}
          onChangeText={setCategories}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <LinearGradient
          colors={['#1789AE', '#132740']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
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
    paddingTop: 70,
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
});




