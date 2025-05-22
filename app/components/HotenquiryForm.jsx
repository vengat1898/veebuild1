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
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function HotenquiryForm() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // Load stored user data & userId
  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        console.log('Loading user data from AsyncStorage...');
        const storedMessage = await AsyncStorage.getItem('userMessage');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedName = await AsyncStorage.getItem('name');
        const storedMobile = await AsyncStorage.getItem('mobile');

        if (storedMessage) setMessage(storedMessage);
        if (storedUserId) setUserId(storedUserId);
        if (storedName) setName(storedName);
        if (storedMobile) setMobileNumber(storedMobile);

        console.log('Loaded user data:', {
          message: storedMessage,
          userId: storedUserId,
          name: storedName,
          mobile: storedMobile,
        });
      } catch (error) {
        console.error('Failed to load data from AsyncStorage:', error);
      }
    };
    loadUserDetails();
  }, []);

  // Fetch main categories from API
  const fetchMainCategories = async () => {
    try {
      console.log('Fetching main categories from API...');
      const response = await axios.get('https://veebuilds.com/mobile/maincategory.php');
      console.log('Categories API response:', response.data);
      if (response.data.result === 'Success') {
        setMainCategories(response.data.storeList);
      } else {
        Alert.alert('Error', 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleOpenModal = async () => {
    setModalVisible(true);
    await fetchMainCategories();
  };

  const filteredCategories = mainCategories.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Upload image to server
  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      console.log('Uploading image to server...', uri);
      const response = await axios.post('https://veebuilds.com/mobile/hot_enquiry_file.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Image upload response:', response.data);

      if (response.data.status === 'success') {
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        Alert.alert('Upload failed', 'Something went wrong.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  // Pick image from camera or gallery
  const pickImage = async () => {
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
              const selectedImage = result.assets[0];
              setImage(selectedImage.uri);
              uploadImage(selectedImage.uri);
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
              const selectedImage = result.assets[0];
              setImage(selectedImage.uri);
              uploadImage(selectedImage.uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
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
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {/* Show name and mobile with stored values */}
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
              onChangeText={setMobileNumber}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.input} onPress={handleOpenModal}>
              <Text style={{ color: category ? '#000' : '#888', fontSize: 16 }}>
                {category || 'Select category'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={30} color="#555" />
                  <Text style={{ color: '#555', marginTop: 5 }}>Upload Image</Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Enter your message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={styles.continueButton}
              onPress={async () => {
                try {
                  console.log('Submitting enquiry with data:', {
                    userId,
                    message,
                    category,
                    name,
                    mobileNumber,
                    image,
                  });

                  await AsyncStorage.setItem('userMessage', message);
                  await AsyncStorage.setItem('name', name);
                  await AsyncStorage.setItem('mobile', mobileNumber);

                  if (!userId) {
                    Alert.alert('Error', 'User ID not found. Please login.');
                    return;
                  }

                  if (!message || !category || !name || !mobileNumber) {
                    Alert.alert('Error', 'Please fill all required fields.');
                    return;
                  }

                  const selectedCategory = mainCategories.find(cat => cat.title === category);
                  const category_id = selectedCategory ? selectedCategory.id : null;

                  if (!category_id) {
                    Alert.alert('Error', 'Invalid category selected.');
                    return;
                  }

                  const imageFilename = image ? image.split('/').pop() : '';
                  const city = 'Old Pallavaram';

                  const url = 'https://veebuilds.com/mobile/hot_enquiry_add.php';
                  const params = {
                    user_id: userId,
                    message,
                    category_id,
                    image: imageFilename,
                    city,
                    name,          // Send name
                    mobile: mobileNumber, // Send mobile
                  };

                  console.log('Sending enquiry API request with params:', params);
                  const response = await axios.get(url, { params });
                  console.log('Enquiry submission response:', response.data);

                  if (response.data.success === 1) {
                    Alert.alert('Success', 'Enquiry submitted successfully!');
                    router.back();
                  } else {
                    Alert.alert('Error', 'Failed to submit enquiry');
                  }
                } catch (err) {
                  console.error('Error submitting enquiry:', err);
                  Alert.alert('Error', 'An error occurred while submitting enquiry.');
                }
              }}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} animationType="slide" transparent>
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
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModal}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { paddingTop: 90, paddingBottom: 15, paddingHorizontal: 15 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { flex: 1, color: 'white', fontWeight: 'bold', fontSize: 20, marginLeft: 20 },
  body: { paddingHorizontal: 15, paddingBottom: 30, marginTop: 40 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#eee',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'cover',
  },
  continueButton: {
    backgroundColor: '#1789AE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '70%',
    padding: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeModal: {
    marginTop: 10,
    backgroundColor: '#1789AE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});








