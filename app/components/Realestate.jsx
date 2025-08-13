import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Realestate() {
  const [realEstateData, setRealEstateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cat_id, customer_id } = params;

  // Console log the initial parameters
  console.log('=== COMPONENT INITIALIZED ===');
  console.log('Parameters:', { cat_id, customer_id });
  console.log('Router params:', params);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Console log the API URL being called
        const apiUrl = 'https://veebuilds.com/mobile/all_land_list.php';
        console.log('=== API CALL ===');
        console.log('Fetching data from URL:', apiUrl);
        console.log('Request timestamp:', new Date().toISOString());
        
        const response = await axios.get(apiUrl);
        
        // Console log the complete response
        console.log('=== API RESPONSE ===');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Full response data:', JSON.stringify(response.data, null, 2));
        console.log('Store list length:', response.data.storeList?.length || 0);
        
        // Log each item in the store list
        if (response.data.storeList) {
          console.log('=== INDIVIDUAL STORE ITEMS ===');
          response.data.storeList.forEach((item, index) => {
            console.log(`Item ${index}:`, JSON.stringify(item, null, 2));
          });
        }

        const processedData = response.data.storeList.map((item, index) => {
          const baseUrl = item.url.replace('/master//', '/master/');
          
          // Console log URL processing
          console.log(`=== URL PROCESSING FOR ITEM ${index} ===`);
          console.log('Original URL:', item.url);
          console.log('Processed base URL:', baseUrl);

          let firstImage = '';
          try {
            const imagesString = item.siteimg.replace(/^\[|\]$/g, '');
            const imagesArray = imagesString.split(', ')
              .map(img => img.trim())
              .filter(img => img.length > 0);

            if (imagesArray.length > 0) {
              firstImage = baseUrl + imagesArray[0];
            }
            
            // Console log image processing
            console.log('=== IMAGE PROCESSING ===');
            console.log('Original siteimg:', item.siteimg);
            console.log('Cleaned images string:', imagesString);
            console.log('Images array:', imagesArray);
            console.log('First image URL:', firstImage);
            
          } catch (e) {
            console.log('Error parsing images for item', index, ':', e);
          }

          const processedItem = {
            ...item,
            firstImage
          };
          
          // Console log the final processed item
          console.log(`=== PROCESSED ITEM ${index} ===`);
          console.log(JSON.stringify(processedItem, null, 2));
          
          return processedItem;
        });

        console.log('=== FINAL PROCESSED DATA ===');
        console.log('Total processed items:', processedData.length);
        console.log('Complete processed data:', JSON.stringify(processedData, null, 2));

        setRealEstateData(processedData);
        setFilteredData(processedData);
        
        console.log('=== STATE UPDATE ===');
        console.log('Real estate data set successfully');
        console.log('Filtered data set successfully');
        
      } catch (error) {
        console.error('=== API ERROR ===');
        console.error('Error fetching real estate data:', error);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        
        setError(error.message);
      } finally {
        setLoading(false);
        console.log('=== LOADING COMPLETE ===');
        console.log('Loading state set to false');
      }
    };

    fetchData();
  }, []);

  const handleSearch = (text) => {
    console.log('=== SEARCH FUNCTION ===');
    console.log('Search text:', text);
    
    setSearchText(text);
    if (!text) {
      console.log('Empty search - showing all data');
      setFilteredData(realEstateData);
      return;
    }

    const filtered = realEstateData.filter(item => {
      const matchBroker = item.land_brocker?.toLowerCase().includes(text.toLowerCase());
      const matchArea = item.land_area?.toLowerCase().includes(text.toLowerCase());
      const matchType = item.property_type?.toLowerCase().includes(text.toLowerCase());
      
      const isMatch = matchBroker || matchArea || matchType;
      
      console.log(`Item ${item.id} - Broker: ${matchBroker}, Area: ${matchArea}, Type: ${matchType}, Match: ${isMatch}`);
      
      return isMatch;
    });
    
    console.log('Filtered results count:', filtered.length);
    console.log('Filtered data:', JSON.stringify(filtered, null, 2));
    
    setFilteredData(filtered);
  };

  const renderCard = ({ item }) => {
    console.log('=== RENDERING CARD ===');
    console.log('Rendering item:', JSON.stringify(item, null, 2));
    console.log('Image URL for card:', item.firstImage);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {item.firstImage ? (
            <Image
              source={{ uri: item.firstImage }}
              style={styles.propertyImage}
              resizeMode="cover"
              onLoad={() => console.log('Image loaded successfully:', item.firstImage)}
              onError={(error) => console.log('Image load error:', error.nativeEvent.error, 'for URL:', item.firstImage)}
            />
          ) : (
            <View style={[styles.propertyImage, styles.placeholderImage]}>
              <Ionicons name="image" size={50} color="#ccc" />
            </View>
          )}

          <View style={styles.textGroupContainer}>
            <TouchableOpacity
              onPress={() => {
                const navigationParams = {
                  pathname: '/components/Landdetails',
                  params: {
                    id: item.id,
                    cat_id,
                    customer_id,
                    vendor_id: item.vendor_id
                  }
                };
                
                console.log('=== NAVIGATION ===');
                console.log('Navigating to Landdetails with params:', navigationParams);
                
                router.push(navigationParams);
              }}
              style={styles.cardTextContainer}
            >
              <View style={styles.textGroup}>
                <Text style={styles.title}>{item.land_brocker}</Text>
                <Text style={styles.subText}>Location: {item.land_area}</Text>
                <Text style={styles.subText}>Size: {item.land_size} sq ft</Text>
                <Text style={styles.subText}>Price: ₹{item.cost_per_sq} per sq ft</Text>
                <Text style={styles.subText}>Type: {item.property_type}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              console.log('=== CALL BUTTON ===');
              console.log('Call button pressed for item:', item.id);
              // Add your call functionality here
            }}
          >
            <Ionicons name="call" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const enquiryParams = {
                pathname: '/components/EnquiryRealHire',
                params: {
                  cat_id,
                  land_id: item.id,
                  v_id: item.vendor_id || ''
                }
              };
              
              console.log('=== ENQUIRY NAVIGATION ===');
              console.log('Navigating to EnquiryRealHire with params:', enquiryParams);
              
              router.push(enquiryParams);
            }}
          >
            <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Enquiry</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              console.log('=== WHATSAPP BUTTON ===');
              console.log('WhatsApp button pressed for item:', item.id);
              // Add your WhatsApp functionality here
            }}
          >
            <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    console.log('=== LOADING STATE ===');
    console.log('Showing loading indicator');
    
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1789AE" style={styles.loader} />
      </View>
    );
  }

  if (error) {
    console.log('=== ERROR STATE ===');
    console.log('Showing error:', error);
    
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          onPress={() => {
            console.log('=== BACK BUTTON ===');
            console.log('Going back from error state');
            router.back();
          }} 
          style={styles.backButton}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('=== MAIN RENDER ===');
  console.log('Rendering main component with filtered data length:', filteredData.length);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            console.log('=== HEADER BACK BUTTON ===');
            console.log('Going back from main screen');
            router.back();
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Real Estate</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, location, type"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => {
            console.log('Key extractor for item:', item.id);
            return item.id.toString();
          }}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={() => {
            console.log('=== FLATLIST END REACHED ===');
            console.log('User scrolled to end of list');
          }}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <View style={styles.noResults}>
          <Text>No properties found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: 120,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1789AE',
  },
  backButton: {
    marginRight: 10
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 0.2,
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000'
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    minHeight: 250,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  propertyImage: {
    width: '40%',
    height: 150,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textGroupContainer: {
    flex: 1,
    marginLeft: 16,
  },
  textGroup: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    textAlign: 'left',
  },
  subText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'left',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    paddingTop: 16,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    flex: 1,
    minHeight: 40,
    maxWidth: '32%',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4
  },
  icon: {},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
});





