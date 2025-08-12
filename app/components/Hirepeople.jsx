import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Hirepeople() {
  const router = useRouter();
  const [professions, setProfessions] = useState([]);
  const [filteredProfessions, setFilteredProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch all professions
  const fetchProfessions = async () => {
    const url = 'https://veebuilds.com/mobile/occupation_list.php';
    
    console.log('=====================================');
    console.log('🚀 FETCHING PROFESSIONS');
    console.log('=====================================');
    console.log('📍 URL:', url);
    console.log('⏰ Timestamp:', new Date().toLocaleString());
    console.log('=====================================');
    
    try {
      const response = await axios.get(url);
      
      console.log('=====================================');
      console.log('✅ PROFESSIONS API SUCCESS');
      console.log('=====================================');
      console.log('📊 Response Status:', response.status);
      console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
      console.log('📄 Full Response Data:', JSON.stringify(response.data, null, 2));
      console.log('=====================================');
      
      if (response.data?.storeList) {
        console.log('=====================================');
        console.log('🎯 PROFESSIONS DATA PROCESSED');
        console.log('=====================================');
        console.log('📊 Total Professions Count:', response.data.storeList.length);
        console.log('📝 Professions List:', JSON.stringify(response.data.storeList, null, 2));
        console.log('=====================================');
        
        setProfessions(response.data.storeList);
        setFilteredProfessions(response.data.storeList);
      } else {
        console.log('=====================================');
        console.log('⚠️ NO PROFESSIONS DATA FOUND');
        console.log('=====================================');
        console.log('📄 Response Structure:', JSON.stringify(response.data, null, 2));
        console.log('=====================================');
      }
    } catch (error) {
      console.log('=====================================');
      console.log('❌ PROFESSIONS API ERROR');
      console.log('=====================================');
      console.log('🔗 URL:', url);
      console.log('📄 Error Message:', error.message);
      console.log('📊 Error Status:', error.response?.status);
      console.log('📋 Error Response:', JSON.stringify(error.response?.data, null, 2));
      console.log('🔍 Full Error Object:', JSON.stringify(error, null, 2));
      console.log('=====================================');
      console.error('Error fetching professions:', error);
    } finally {
      setLoading(false);
      console.log('=====================================');
      console.log('🏁 PROFESSIONS FETCH COMPLETED');
      console.log('⏰ Timestamp:', new Date().toLocaleString());
      console.log('=====================================');
    }
  };

  useEffect(() => {
    fetchProfessions();
  }, []);

  // Filter profession list
  const handleSearch = (text) => {
    console.log('=====================================');
    console.log('🔍 SEARCH FUNCTIONALITY');
    console.log('=====================================');
    console.log('🔤 Search Text:', text);
    console.log('📊 Total Professions:', professions.length);
    
    setSearch(text);
    const filtered = professions.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    
    console.log('📋 Filtered Results Count:', filtered.length);
    console.log('📝 Filtered Results:', JSON.stringify(filtered, null, 2));
    console.log('=====================================');
    
    setFilteredProfessions(filtered);
  };

  // Fetch professionals based on occupation id
  const fetchProfessionalsByOccupationId = async (occupationId) => {
    const url = `https://veebuilds.com/mobile/professional_list_by_id.php?occupation=${occupationId}`;
    
    console.log('=====================================');
    console.log('👥 FETCHING PROFESSIONALS BY OCCUPATION');
    console.log('=====================================');
    console.log('🆔 Occupation ID:', occupationId);
    console.log('📍 URL:', url);
    console.log('⏰ Timestamp:', new Date().toLocaleString());
    console.log('=====================================');
    
    try {
      const response = await axios.get(url);
      
      console.log('=====================================');
      console.log('✅ PROFESSIONALS API SUCCESS');
      console.log('=====================================');
      console.log('📊 Response Status:', response.status);
      console.log('📋 Response Headers:', JSON.stringify(response.headers, null, 2));
      console.log('📄 Full Response Data:', JSON.stringify(response.data, null, 2));
      console.log('=====================================');
      
      if (response.data?.storeList) {
        console.log('=====================================');
        console.log('🎯 PROFESSIONALS DATA PROCESSED');
        console.log('=====================================');
        console.log('📊 Total Professionals Count:', response.data.storeList.length);
        console.log('📝 Professionals List:', JSON.stringify(response.data.storeList, null, 2));
        console.log('=====================================');
        
        return response.data.storeList;
      } else {
        console.log('=====================================');
        console.log('⚠️ NO PROFESSIONALS DATA FOUND');
        console.log('=====================================');
        console.log('📄 Response Structure:', JSON.stringify(response.data, null, 2));
        console.log('=====================================');
        
        return [];
      }
    } catch (error) {
      console.log('=====================================');
      console.log('❌ PROFESSIONALS API ERROR');
      console.log('=====================================');
      console.log('🆔 Occupation ID:', occupationId);
      console.log('🔗 URL:', url);
      console.log('📄 Error Message:', error.message);
      console.log('📊 Error Status:', error.response?.status);
      console.log('📋 Error Response:', JSON.stringify(error.response?.data, null, 2));
      console.log('🔍 Full Error Object:', JSON.stringify(error, null, 2));
      console.log('=====================================');
      console.error('Error fetching professionals:', error);
      return [];
    }
  };

  // Navigate with professionals data
  const goToDetails = async (profession) => {
    console.log('=====================================');
    console.log('🧭 NAVIGATION TO DETAILS');
    console.log('=====================================');
    console.log('📋 Selected Profession:', JSON.stringify(profession, null, 2));
    console.log('🆔 Profession ID:', profession.id);
    console.log('📝 Profession Title:', profession.title);
    console.log('=====================================');
    
    const professionals = await fetchProfessionalsByOccupationId(profession.id);

    console.log('=====================================');
    console.log('🚀 PREPARING NAVIGATION PARAMS');
    console.log('=====================================');
    console.log('🆔 ID:', profession.id);
    console.log('📝 Title:', profession.title);
    console.log('👥 Professionals Data:', JSON.stringify(professionals, null, 2));
    console.log('📊 Professionals Count:', professionals.length);
    console.log('=====================================');

    router.push({
      pathname: '/components/HirepeopleDeatils',
      params: {
        id: profession.id,
        title: profession.title,
        professionals: JSON.stringify(professionals),
      },
    });

    console.log('=====================================');
    console.log('✅ NAVIGATION COMPLETED');
    console.log('⏰ Timestamp:', new Date().toLocaleString());
    console.log('=====================================');
  };

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
        <Text style={styles.headerText}>Hire People</Text>
      </LinearGradient>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search profession..."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* List or Loader */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1789AE" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredProfessions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.professionItem}
              onPress={() => goToDetails(item)}
            >
              <Text style={styles.professionText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#1789AE" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 120,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 10, marginTop: 30 },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  professionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 15,
  },
  professionText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
});



