import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Location() {
  // Sample locations array (this could be fetched from an API)
  const locations = [
    'New York','Los Angeles','San Francisco','Chicago','Houston','Las Vegas','india','south africa','ireland'
  ];

  // State to manage search input and filtered suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const navigation = useNavigation();

  // Handle input change and filter locations
  const handleSearchChange = (text) => {
    setSearchQuery(text);

    // If search text is entered, filter the locations starting with that letter
    if (text) {
      const filtered = locations.filter((location) =>
        location.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      {filteredLocations.length > 0 && (
        <FlatList
          data={filteredLocations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.locationItem}>
              <Text style={styles.locationText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 120,
    paddingTop: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1789AE', // Keeping the original background color
  },
  backButton: { marginRight: 10 },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Slightly transparent background for the input
    borderRadius: 15,
    paddingHorizontal: 10,
    color: 'white', // Text color inside the input
  },
  locationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
});


