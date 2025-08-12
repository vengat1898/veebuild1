import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { SessionContext } from '../../context/SessionContext';

export default function Enquiry() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const catIdFromParams = params.cat_id;
  const vendorIdFromParams = params.vendor_id;
  const shopNameFromParams = params.shop_name;

  // Use SessionContext
  const { 
    getUserId, 
    getUserName, 
    getUserMobile, 
    isLoggedIn,
    isSessionLoaded 
  } = useContext(SessionContext);

  // State variables
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [categories, setCategories] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [shopName, setShopName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch category name by cat_id
  const fetchCategoryName = async (catId) => {
    if (!catId) return;
    
    const categoryUrl = `https://veebuilds.com/mobile/cat.php?cat_id=${catId}`;
    
    try {
      const response = await axios.get(categoryUrl, { timeout: 10000 });
      
      if (response.data.result === 'Success' && response.data.storeList.length > 0) {
        const categoryName = response.data.storeList[0].title;
        setCategories(categoryName);
      } else {
        setCategories('');
      }
    } catch (error) {
      console.error('Category fetch error:', error);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = [];
    
    if (!name.trim()) errors.push('Name is required');
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      errors.push('Valid 10-digit mobile number is required');
    }
    if (!message.trim() || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    if (!categories && !vendorId) {
      errors.push('Either category or vendor information is required');
    }
    
    return errors;
  };

  // Submit enquiry with retry logic
  const submitEnquiry = async (enquiryParams) => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://veebuilds.com/mobile/enquery.php',
        params: enquiryParams,
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'VeeBuilds-Mobile-App'
        }
      });
      return response;
    } catch (error) {
      if (retryCount < 2 && (!error.response || error.response.status >= 500)) {
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return submitEnquiry(enquiryParams);
      }
      throw error;
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    if (!isSessionLoaded) return;

    const fetchUserData = async () => {
      try {
        // Check if user is logged in
        if (!isLoggedIn()) {
          Alert.alert('Error', 'Please log in to continue.');
          router.back();
          return;
        }

        // Get user data from session
        const id = await getUserId();
        const userName = await getUserName();
        const userMobile = await getUserMobile();

        if (!id) {
          Alert.alert('Error', 'User session not found. Please log in again.');
          router.back();
          return;
        }

        setUserId(id);
        
        // Set basic info from session
        if (userName) setName(userName);
        if (userMobile) setMobile(userMobile);

        // Fetch additional profile data from API
        try {
          const profileUrl = `https://veebuilds.com/mobile/profile_fetch.php?id=${id}`;
          const response = await axios.get(profileUrl, { timeout: 10000 });
          
          if (response.data.success === 1) {
            const profile = response.data;
            
            // Update with fresh data from API
            setName(profile.name || userName || '');
            setMobile(profile.mobile || userMobile || '');
            setCity(profile.city || '');
          }
        } catch (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        // Set vendor info if available
        if (vendorIdFromParams) {
          setVendorId(vendorIdFromParams);
          if (shopNameFromParams) {
            setShopName(shopNameFromParams);
          }
        }

        // Fetch category name if provided
        if (catIdFromParams) {
          await fetchCategoryName(catIdFromParams);
        }
      } catch (error) {
        console.error('User data fetch error:', error);
        Alert.alert('Error', 'Could not fetch user information.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isSessionLoaded]);

  // Enhanced submit handler
  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', validationErrors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    setRetryCount(0);

    const enquiryParams = {
      user_id: userId,
      name: name.trim(),
      mobile: mobile.trim(),
      message: message.trim(),
      v_id: vendorId || catIdFromParams || '',
      inner_subid: 1,
      product_name: categories,
      city: city.trim(),
      shop_name: shopName || ''
    };

    try {
      const response = await submitEnquiry(enquiryParams);
      
      // Check for successful submission
      if (response.data.success === 1) {
        // Track successful enquiry
        console.log('Enquiry submitted:', {
          userId,
          vendorId: vendorId || catIdFromParams,
          type: vendorId ? 'vendor' : 'category'
        });
        
        Alert.alert(
          'Success!', 
          response.data.api_message || 'Your enquiry has been submitted successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                setMessage('');
                setCategories('');
                if (!vendorId) {
                  router.back();
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Submission Failed', 
          response.data.api_message || 'Unable to submit your enquiry. Please try again.'
        );
      }
    } catch (error) {
      console.error('Enquiry submission error:', error);
      
      let errorMessage = 'Unable to submit enquiry. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your internet connection.';
      } else if (error.response) {
        switch(error.response.status) {
          case 400:
            errorMessage = 'Invalid request data. Please check your information.';
            break;
          case 401:
            errorMessage = 'Session expired. Please login again.';
            break;
          case 404:
            errorMessage = 'Service not available. Please contact support.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while session is loading
  if (isLoading || !isSessionLoaded) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1789AE" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
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

      {/* Form */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile Number *</Text>
            <TextInput
              style={[styles.input, styles.nonEditableInput]}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobile}
              editable={false}
            />
            <Text style={styles.helperText}>Mobile number cannot be changed</Text>
          </View>

          {/* City Input - Editable */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              placeholderTextColor="#999"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          </View> */}

          {/* Category Input - Non-editable */}
          
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TextInput
                style={[styles.input, styles.nonEditableInput]}
                placeholder="Categories"
                value={categories}
                editable={false}
              />
              <Text style={styles.helperText}>Category </Text>
            </View>
          

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your detailed enquiry message (minimum 10 characters)"
              placeholderTextColor="#999"
              value={message}
              onChangeText={(text) => {
                if (text.length <= 500) {
                  setMessage(text);
                }
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{message.length}/500 characters</Text>
          </View>

          {/* Submit Button */}
          <LinearGradient
            colors={['#1789AE', '#132740']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientButton, isSubmitting && styles.buttonDisabled]}
          >
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={[styles.buttonText, { marginLeft: 10 }]}>Submitting...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Submit Enquiry</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
  },
  nonEditableInput: {
    backgroundColor: '#e8e8e8',
    color: '#666',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  gradientButton: {
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});




