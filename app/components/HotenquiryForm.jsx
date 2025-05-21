import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HotenquiryForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedMobile = await AsyncStorage.getItem('userMobile');
        const storedMessage = await AsyncStorage.getItem('hotenquiry_message');
        const storedImage = await AsyncStorage.getItem('hotenquiry_image');

        if (storedName) setName(storedName);
        if (storedMobile) setMobileNumber(storedMobile);
        if (storedMessage) setMessage(storedMessage);
        if (storedImage) setImageUri(storedImage);
      } catch (error) {
        console.error('Failed to load data from AsyncStorage:', error);
      }
    };
    loadUserDetails();
  }, []);

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
    }
  };

  const compressImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  };

  const handleOpenModal = async () => {
    setModalVisible(true);
    await fetchMainCategories();
  };

  const handleImagePick = async () => {
    Alert.alert('Upload Image', 'Select an option', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) return;

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });
          if (!result.canceled) {
            const compressedUri = await compressImage(result.assets[0].uri);
            setImageUri(compressedUri);
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) return;

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });
          if (!result.canceled) {
            const compressedUri = await compressImage(result.assets[0].uri);
            setImageUri(compressedUri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const filteredCategories = mainCategories.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

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

            <TouchableOpacity style={styles.uploadBox} onPress={handleImagePick}>
              <Ionicons name="cloud-upload-outline" size={24} color="gray" />
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>

            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 100, height: 100, marginBottom: 10 }}
              />
            )}

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Enter your message"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <TouchableOpacity
              style={styles.continueButton}
              onPress={async () => {
                try {
                  await AsyncStorage.setItem('hotenquiry_image', imageUri || '');
                  await AsyncStorage.setItem('hotenquiry_message', message || '');
                  Alert.alert('Saved', 'Image and message stored successfully!');
                } catch (err) {
                  console.error('Error saving data:', err);
                  Alert.alert('Error', 'Failed to store data.');
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 120,
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    top: 20,
    justifyContent: 'center',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadBox: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    top: 20,
  },
  uploadText: {
    color: 'gray',
    fontSize: 16,
    marginLeft: 10,
  },
  continueButton: {
    width: '50%',
    height: 50,
    backgroundColor: '#1789AE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    top: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalWrapper: {
  flex: 1,
  justifyContent: 'flex-end', // Show modal from the bottom
  backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent backdrop
},
modalContainer: {
  height: '60%', // 60% of screen height (reduced by 40%)
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
},

  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  modalItem: {
    paddingVertical: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  closeModal: {
    backgroundColor: '#1789AE',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
});





