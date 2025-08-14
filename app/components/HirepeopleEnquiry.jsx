import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SessionContext } from '../../context/SessionContext';
import axios from 'axios';

export default function HirepeopleEnquiry() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session, isSessionLoaded } = useContext(SessionContext);

  // Destructure parameters
  const { 
    cat_id, 
    land_id, 
    v_id, 
    product_name, 
    city: professionalCity,
    customer_id,
    user_id
  } = params;

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [city, setCity] = useState('');

  useEffect(() => {
    if (isSessionLoaded && session) {
      console.log('Session loaded:', session);
      
      // Set user details from session
      setName(session.name || '');
      setMobile(session.mobile || '');
      setCity(session.city || professionalCity || '');
      
      // Log all parameters for debugging
      console.log('Enquiry Parameters:', {
        cat_id,
        land_id,
        v_id,
        product_name,
        professionalCity,
        customer_id,
        user_id,
        sessionUserId: session.id
      });
    }
  }, [isSessionLoaded, session]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!product_name) {
      Alert.alert('Error', 'Professional information is missing');
      return;
    }

    if (!city) {
      Alert.alert('Error', 'Please enter your city');
      return;
    }

    if (!session?.id) {
      Alert.alert('Error', 'User session not found. Please login again.');
      return;
    }

    setIsSubmitting(true);
    
    const enquiryParams = {
      user_id: session.id, // Using session user ID
      customer_id: customer_id || '',
      name: name.trim(),
      mobile: mobile.trim(),
      message: message.trim(),
      product_name: product_name.trim(), // Professional's name
      vendor_id: v_id || land_id || '', // Using either v_id or land_id
      city: city.trim(),
      cat_id: cat_id || ''
    };

    console.log('Submitting enquiry with params:', enquiryParams);

    try {
      const response = await axios.get('https://veebuilds.com/mobile/professional_enquery.php', {
        params: enquiryParams
      });

      console.log('API Response:', response.data);

      if (response.data.success === 1) {
        Alert.alert('Success', 'Enquiry submitted successfully', [
          { 
            text: 'OK', 
            onPress: () => router.push({
              pathname: '/components/Home',
              params: {
                id: land_id || v_id,
                title: product_name,
                cat_id,
                v_id,
                user_id: session.id,
                customer_id
              }
            })
          }
        ]);
      } else {
        Alert.alert('Failed', response.data.text || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      let errorMessage = 'Submission failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.text || errorMessage;
        console.error('Error Details:', error.response.data);
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
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
          editable={!!session?.name} // Disable if we have session name
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobile}
          keyboardType="phone-pad"
          onChangeText={setMobile}
          editable={!!session?.mobile} // Disable if we have session mobile
        />

        {/* <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
        /> */}

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter your enquiry message"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitText}>Submit Enquiry</Text>
          )}
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
    padding: 35,
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
    paddingVertical: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#1789AE',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 10,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});



