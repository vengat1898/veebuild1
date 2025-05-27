import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Search() {
  const navigation = useNavigation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [storeList, setStoreList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

     useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('Loaded user ID:', storedUserId);
        }
      } catch (error) {
        console.error('Failed to load user ID:', error);
      }
    };

    loadUserId();
  }, []);

  const fetchStoreList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://veebuilds.com/mobile/searchlist.php');
      console.log('API Response:', response.data);

      if (response.data.result === 'Success') {
        const uniqueStoreList = Array.from(
          new Map(response.data.storeList.map((item) => [item.id, item])).values()
        );
        console.log('Unique Store List:', uniqueStoreList);
        setStoreList(uniqueStoreList);
      } else {
        console.error('Failed to load store list from server');
        setError('Failed to load store list');
      }
    } catch (err) {
      console.error('Fetch Error:', err.message);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreList();
  }, []);

  const filteredStoreList = storeList.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log('Search query:', searchQuery);
    console.log('Filtered results:', filteredStoreList);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
      </LinearGradient>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Loading / Error */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Results */}
      {searchQuery.length > 0 && (
        <FlatList
          data={filteredStoreList}
          keyExtractor={(item) => `${item.id}-${item.name}-${item.type}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                console.log('Tapped store:', item);
                router.push({
                  pathname: '/components/Shop',
                  params: { cat_id: item.id,customer_id: userId  },
                });
              }}
            >
              <Text style={styles.listItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No results found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ff0000',
    marginTop: 20,
  },
});
 







