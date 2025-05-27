import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Checkbox from 'expo-checkbox';

export default function Shop() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cat_id, customer_id } = params;

  const [modalVisible, setModalVisible] = useState(false);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [vendors, setVendors] = useState([]);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeLoading, setTypeLoading] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!cat_id || !customer_id) {
          throw new Error('Missing category ID or customer ID');
        }

        setLoading(true);
        
        // Fetch vendors
        const vendorsResponse = await axios.get(
          `https://veebuilds.com/mobile/vendor_list.php?category_id=${cat_id}&customer_id=${customer_id}`
        );

        if (vendorsResponse.data.result === 'Success') {
          setVendors(vendorsResponse.data.storeList);
        } else {
          setError(vendorsResponse.data.text || 'Failed to fetch vendors');
        }

        // Fetch types
        setTypeLoading(true);
        const typesResponse = await axios.get(
          `https://veebuilds.com/mobile/type_list_customer.php?cat_id=${cat_id}&customer_id=${customer_id}`
        );

        if (typesResponse.data.result === 'Success') {
          setTypes(typesResponse.data.storeList);
        } else {
          console.warn('Failed to fetch types:', typesResponse.data.text);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        setTypeLoading(false);
      }
    };

    fetchData();
  }, [cat_id, customer_id]);

  const fetchBrands = async (typeId) => {
    try {
      setBrandLoading(true);
      const response = await axios.get(
        `https://veebuilds.com/mobile/brand_list_customer.php?cat_id=${cat_id}&customer_id=${customer_id}&type_id=${typeId}`
      );
      
      if (response.data.result === 'Success') {
        setBrands(response.data.storeList);
      } else {
        console.warn('Failed to fetch brands:', response.data.text);
        setBrands([]);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setBrands([]);
    } finally {
      setBrandLoading(false);
    }
  };

  const toggleTypeSelection = (typeId) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const applyTypeFilter = () => {
    setModalVisible(false);
    // Here you would typically filter the vendors based on selected types
    // You might need to make another API call with the selected types
    console.log('Selected types:', selectedTypes);
  };

  const clearTypeFilter = () => {
    setSelectedTypes([]);
    setModalVisible(false);
    // Reset the vendors list to original unfiltered state
  };

  const handleBrandModalOpen = async () => {
    if (selectedTypes.length === 0) {
      Alert.alert('Please select at least one type first');
      return;
    }
    
    // For simplicity, we'll use the first selected type to fetch brands
    // In a real app, you might want to handle multiple types differently
    await fetchBrands(selectedTypes[0]);
    setBrandModalVisible(true);
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={item.shop_image ? { uri: item.shop_image } : require('../../assets/images/veebuilder.png')}
        style={styles.logo}
      />
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/components/Shopdetails',
            params: { 
              vendor_id: item.id,
              shopName: item.name,
              shopImage: item.shop_image,
              mobile: item.mobile,
              whatsapp: item.whatsapp,
              email: item.email,
              experience: item.yera_of_exp,
              location: item.location,
              city: item.city,
              state: item.state,
              country: item.country,
              rattings: item.rattings,
              enquery: item.enquery
            }
          })}
          style={styles.cardTextContainer}
        >
          <View style={styles.textGroup}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subText}>{item.distance} km away</Text>
            <Text style={styles.subText}>{item.city}</Text>
            <Text style={styles.subText}>{item.yera_of_exp} years in business</Text>
            <Text style={styles.subText}>{item.enquery} enquiries answered</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => {
            if (item.mobile) {
              Alert.alert('Call', `Would you like to call ${item.mobile}?`);
            } else {
              Alert.alert('No phone number available');
            }
          }}>
            <Ionicons name="call" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
  style={styles.button} 
  onPress={() => router.push({
    pathname: '/components/Enquiry',
    params: { cat_id, customer_id }
  })}
>
  <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
  <Text style={styles.buttonText}>Enquiry</Text>
</TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => {
            if (item.whatsapp) {
              Alert.alert('WhatsApp', `Would you like to message ${item.whatsapp}?`);
            } else {
              Alert.alert('No WhatsApp number available');
            }
          }}>
            <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1789AE" style={styles.loader} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Shop</Text>
      </View>

      <TouchableOpacity onPress={() => router.push('/components/Search')}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            editable={false}
            pointerEvents="none"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.dropdownRow}>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)} 
          style={styles.dropdownContainer}
        >
          <Ionicons name="list" size={20} color="#888" style={styles.dropdownIcon} />
          <Text style={styles.dropdownText}>
            {selectedTypes.length > 0 
              ? `${selectedTypes.length} selected` 
              : 'Type'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleBrandModalOpen} 
          style={styles.dropdownContainer}
        >
          <Ionicons name="pricetag" size={20} color="#888" style={styles.dropdownIcon} />
          <Text style={styles.dropdownText}>{selectedBrand || 'Brand'}</Text>
          <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
        </TouchableOpacity>
      </View>

      {vendors.length > 0 ? (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.noResults}>
          <Text>No vendors found for this category</Text>
        </View>
      )}

      {/* Types Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Types</Text>
            
            {typeLoading ? (
              <ActivityIndicator size="large" color="#1789AE" />
            ) : (
              <ScrollView style={styles.modalScrollView}>
                {types.map((type) => (
                  <View key={type.id} style={styles.checkboxContainer}>
                    <Checkbox
                      value={selectedTypes.includes(type.id)}
                      onValueChange={() => toggleTypeSelection(type.id)}
                      color={selectedTypes.includes(type.id) ? '#1789AE' : undefined}
                    />
                    <Text style={styles.checkboxLabel}>{type.title}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                onPress={clearTypeFilter} 
                style={[styles.modalButton, styles.clearButton]}
              >
                <Text style={styles.modalButtonText}>Clear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={applyTypeFilter} 
                style={[styles.modalButton, styles.applyButton]}
              >
                <Text style={styles.modalButtonText1}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Brand Modal */}
      <Modal visible={brandModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Brand</Text>
            
            {brandLoading ? (
              <ActivityIndicator size="large" color="#1789AE" />
            ) : brands.length > 0 ? (
              <FlatList
                data={brands}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedBrand(item.title);
                      setBrandModalVisible(false);
                      // Here you would typically filter vendors by the selected brand
                    }}
                    style={styles.brandOption}
                  >
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.brandImage} 
                      resizeMode="contain"
                    />
                    <Text style={styles.brandText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noBrandsText}>No brands available for selected type</Text>
            )}
            
            <TouchableOpacity 
              onPress={() => setBrandModalVisible(false)} 
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Close</Text>
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
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1789AE',
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
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, color: '#000' },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 4,
    height: 50,
    width: '48%',
  },
  dropdownIcon: { marginRight: 8 },
  dropdownText: { flex: 1, color: '#000', fontSize: 10 },
  dropdownArrow: { marginRight: 8 },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'flex-start',
    height: 250,
  },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginRight: 16 },
  cardTextContainer: { marginBottom: 12, left: 20, gap: 8 },
  textGroup: { marginBottom: 12, gap: 8 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  subText: { fontSize: 11, color: '#555', marginBottom: 4 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    right: 160,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 98,
    height: 40,
  },
  buttonText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  icon: { marginRight: 4 },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalScrollView: {
    maxHeight: '80%',
    marginBottom: 16,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 12,
    color: '#1789AE',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 20
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    gap: 70
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  clearButton: {
    backgroundColor: '#f1f1f1',
  },
  applyButton: {
    backgroundColor: '#1789AE',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1789AE',
  },
  modalButtonText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  brandOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  brandImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  brandText: {
    fontSize: 16,
    color: '#333',
  },
  noBrandsText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#888',
  },
  modalCloseButton: { 
    paddingVertical: 12, 
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: { 
    fontSize: 16, 
    color: '#1789AE',
    fontWeight: 'bold',
  },
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
});



 




