import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SessionContext } from '../../context/SessionContext';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function EnquiryRealHire() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session, isSessionLoaded } = useContext(SessionContext);

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
      setName(session.name || '');
      setMobile(session.mobile || '');
      setCity(session.city || professionalCity || '');
    }
  }, [isSessionLoaded, session]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!v_id) return Alert.alert('Error', 'Vendor information is missing');
    if (!message) return Alert.alert('Error', 'Please enter your enquiry message');
    if (!session?.id) return Alert.alert('Error', 'User session not found. Please login again.');

    setIsSubmitting(true);
    
    const enquiryParams = {
      user_id: session.id,
      customer_id: customer_id || '',
      name: name.trim(),
      mobile: mobile.trim(),
      message: message.trim(),
      product_name: product_name || `${name} - ${city || 'No city specified'}`,
      vendor_id: v_id,
      city: city.trim() || 'Not specified',
      land_id: land_id || '',
      cat_id: cat_id || ''
    };

    try {
      const response = await axios.get('https://veebuilds.com/mobile/land_enquery.php', {
        params: enquiryParams
      });

      if (response.data.success === 1 || response.data.result === 'success') {
        Alert.alert('Success', response.data.message || 'Enquiry submitted successfully', [
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
        Alert.alert('Failed', response.data.text || response.data.message || 'Something went wrong');
      }
    } catch (error) {
      let errorMessage = 'Submission failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.text || error.response.data.message || errorMessage;
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

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'ios' ? 60 : 80}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          editable={!!session?.name}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobile}
          keyboardType="phone-pad"
          onChangeText={setMobile}
          editable={false}
        />

        <Text style={styles.label}>Message*</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter your enquiry message (required)"
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
      </KeyboardAwareScrollView>
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
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
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



