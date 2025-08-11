import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import React, { useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { SessionContext } from '../../context/SessionContext';

export default function HotenquiryForm() {
  const router = useRouter();
  const { session, isSessionLoaded } = useContext(SessionContext);

  // Form states
  const [name, setName] = useState(session?.name || '');
  const [mobileNumber, setMobileNumber] = useState(session?.mobile || '');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  // Loading states
  if (!isSessionLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1789AE" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginPrompt}>Please login to submit enquiries</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fetchMainCategories = async () => {
    try {
      const response = await axios.get('https://veebuilds.com/mobile/maincategory.php');
      if (response.data.result === 'Success') {
        setMainCategories(response.data.storeList);
      } else {
        Alert.alert('Error', 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    }
  };

  const handleOpenModal = async () => {
    setModalVisible(true);
    await fetchMainCategories();
  };

  const filteredCategories = mainCategories.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: `enquiry_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      const response = await axios.post(
        'https://veebuilds.com/mobile/hot_enquiry_file.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          transformRequest: (data, headers) => {
            delete headers['Content-Type'];
            return data;
          },
        }
      );

      if (response.data.status === 'success') {
        setImageUploadError(false);
        return response.data.filename;
      }
      throw new Error(response.data.message || 'Upload failed');
    } catch (error) {
      console.error('Image upload error:', error);
      setImageUploadError(true);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      Alert.alert(
        'Upload Image',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const permission = await ImagePicker.requestCameraPermissionsAsync();
              if (!permission.granted) {
                Alert.alert('Permission Required', 'Camera access is required.');
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.7,
              });

              if (!result.canceled) {
                setImage(result.assets[0].uri);
                setImageUploadError(false);
              }
            },
          },
          {
            text: 'Gallery',
            onPress: async () => {
              const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permission.granted) {
                Alert.alert('Permission Required', 'Media library access is required.');
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.7,
              });

              if (!result.canceled) {
                setImage(result.assets[0].uri);
                setImageUploadError(false);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!message || !category) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageFilename = '';
      if (image) {
        try {
          imageFilename = await uploadImage(image);
          console.log('Image uploaded successfully:', imageFilename);
        } catch (uploadError) {
          console.warn('Image upload failed, proceeding without image:', uploadError);
        }
      }

      const selectedCategory = mainCategories.find(cat => cat.title === category);
      if (!selectedCategory) {
        Alert.alert('Error', 'Invalid category selected');
        return;
      }

      const params = new URLSearchParams();
      params.append('user_id', session.id);
      params.append('name', name);
      params.append('mobile', mobileNumber);
      params.append('message', message);
      params.append('category_id', selectedCategory.id);
      params.append('image', imageFilename || '');
      params.append('city', session.city || 'Unknown');

      console.log('Submitting with params:', params.toString());

      const response = await axios.post(
        'https://veebuilds.com/mobile/hot_enquiry_add.php',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      console.log('Submission response:', response.data);

      if (response.data.success === 1) {
        Alert.alert('Success', 'Enquiry submitted successfully!');
        router.back();
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit enquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hot Enquiry Form</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.body} 
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  setMobileNumber(text);
                }
              }}
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity 
              style={styles.input} 
              onPress={handleOpenModal}
              disabled={isSubmitting}
            >
              <Text style={{ color: category ? '#000' : '#888', fontSize: 16 }}>
                {category || 'Select category'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.imageUploadBox, 
                imageUploadError && styles.uploadError
              ]} 
              onPress={pickImage}
              disabled={isSubmitting}
            >
              {image ? (
                <Image 
                  source={{ uri: image }} 
                  style={styles.uploadedImage} 
                />
              ) : (
                <>
                  <Ionicons 
                    name={imageUploadError ? "warning-outline" : "cloud-upload-outline"} 
                    size={30} 
                    color={imageUploadError ? "red" : "#555"} 
                  />
                  <Text style={{ 
                    color: imageUploadError ? "red" : "#555", 
                    marginTop: 5 
                  }}>
                    {imageUploadError ? "Upload Failed - Tap to retry" : "Upload Image"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Enter your message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[
                styles.continueButton, 
                isSubmitting && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Submit Enquiry</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Search category..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategory(item.title);
                    setModalVisible(false);
                    setSearchText('');
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No categories found</Text>
              }
            />
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={styles.closeModal}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginPrompt: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  loginButton: {
    backgroundColor: '#1789AE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 50
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15, 
    paddingHorizontal: 15 
  },
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 30 : 0
  },
  headerTitle: { 
    flex: 1, 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 20, 
    marginLeft: 20,
    textAlign: 'center'
  },
  body: { 
    paddingHorizontal: 20, 
    paddingBottom: 30, 
    paddingTop: 20 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff'
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top'
  },
  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  uploadError: {
    borderColor: 'red',
    backgroundColor: '#fff0f0'
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover'
  },
  continueButton: {
    backgroundColor: '#1789AE',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '70%',
    padding: 15
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    fontSize: 16
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  noResultsText: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
    fontSize: 16
  },
  closeModal: {
    marginTop: 15,
    backgroundColor: '#1789AE',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center'
  }
});








