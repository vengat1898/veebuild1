import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Materials({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const router = useRouter();

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://veebuilds.com/mobile/category.php');
      if (response.data.result === 'Success') {
        setCategories(response.data.storeList);
        console.log('====================================');
        console.log(response.data.storeList);
        console.log('====================================');
        setShowTrending(true);
      } else {
        console.warn('Failed to fetch categories:', response.data.text);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch main categories (the new one)
  const fetchMainCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://veebuilds.com/mobile/maincategory.php');
      if (response.data.result === 'Success') {
        setMainCategories(response.data.storeList);
      } else {
        console.warn('Failed to fetch main categories:', response.data.text);
      }
    } catch (error) {
      console.error('Error fetching main categories:', error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryById = async (catId) => {
    if (!catId) {
      console.warn('Invalid category ID:', catId);
      return;
    }

    console.log('Fetching category with ID:', catId);

    try {
      setLoading(true);
      const response = await axios.get(`https://veebuilds.com/mobile/cat.php?cat_id=${catId}`);
      console.log(response.data);

      if (response.data.result === 'Success') {
        setCategories(response.data.storeList);
        setShowTrending(true);
      } else if (response.data.text === 'List Empty!') {
        setCategories([]);
        setShowTrending(true);
        console.warn('No materials found.');
      } else {
        console.warn('Failed to fetch category data:', response.data.text);
      }
    } catch (error) {
      console.error('Error fetching category data:', error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMainCategories(); 
  }, []);

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerText}>Materials</Text>
      </LinearGradient>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search materials..."
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Left Side: Main Categories List */}
        <View style={styles.boxContainer}>
          <TouchableOpacity style={styles.boxButtonText} onPress={fetchCategories}>
            <Text style={styles.buttonText}>All</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {mainCategories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageBox}
                onPress={() => fetchCategoryById(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.imageStyle} />
                <Text style={styles.imageLabel}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Right Side: Materials Display */}
        {showTrending && (
          <View style={styles.trendingContainer}>
            <Text style={styles.trendingHeader}>Categories</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#1789AE" />
            ) : (
              <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.trendingImagesContainer}>
                {categories.map((item, index) => (
                  <LinearGradient
                    key={index}
                    colors={['#1789AE', '#132740']}
                    style={styles.trendingBox}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <TouchableOpacity
                      style={styles.trendingItem}
                      onPress={() =>router.push({ pathname: '/components/Shop', params: { cat_id: item.id } })}
                    >
                      <Image source={{ uri: item.image }} style={styles.trendingImage} />
                      <Text style={styles.trendingLabel}>{item.title}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 100,
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 10 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 0.2,
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 4,
    width: 360,
    marginRight: 30,
    bottom: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, color: '#000', width: "100%" },
  mainContent: { flexDirection: 'row', marginTop: 16, flex: 1 },
  boxContainer: {
    backgroundColor: '#F9F9F9',
    marginHorizontal: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 80,
    height: 700,
    bottom: 40,
    right: 10,
  },
  boxButtonText: {
    fontSize: 12,
    width: 50,
    height: 50,
    color: '#132740',
    fontWeight: '500',
    marginBottom: 40,
    borderWidth: 0.2,
    borderRadius: 100,
    textAlign: 'center',
    lineHeight: 50,
    alignSelf: 'center',
    backgroundColor: "#FFFFFF",
  },
  buttonText: { textAlign: 'center', top: 15 },
  imageBox: { marginBottom: 30, alignItems: 'center' },
  imageStyle: { width: 40, height: 40, borderRadius: 6 },
  imageLabel: { fontSize: 8, color: '#132740', marginTop: 4, textAlign: 'center' },
  scrollContainer: { paddingBottom: 10 },
  trendingContainer: {
    flex: 1,
    marginLeft: 5,
    marginTop: 20,
    width: "100%",
    bottom: 50,
    right: 8,
    height: 680,
  },
  trendingHeader: { fontSize: 13, fontWeight: 'bold', marginBottom: 10 },
  trendingImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  trendingBox: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingItem: { alignItems: 'center' },
  trendingImage: { width: 100, height: 100, borderRadius: 8 },
  trendingLabel: { fontSize: 10, color: '#fff', marginTop: 4, textAlign: 'center' },
});











