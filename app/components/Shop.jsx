import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Shop() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const customer_id = params.customer_id || '123'; // Fallback for testing
  const cat_id = params.cat_id || '5';             // Fallback for testing

  console.log('customer_id:', customer_id);
  console.log('cat_id:', cat_id);

  const [modalVisible, setModalVisible] = useState(false);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [shopData, setShopData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  const fetchVendorList = async () => {
    try {
      const response = await axios.get(
        'https://veebuilds.com/mobile/vendor_list.php',
        {
          params: {
            customer_id,
            category_id: cat_id,
          },
        }
      );

      if (response.data.result === 'fail') {
        console.warn('Vendor API failed:', response.data.text);
        return;
      }

      const list = response.data.storeList || [];

      const formattedList = list.map((item) => ({
        id: item.id,
        title: item.name,
        distance: `${item.distance} km away from you`,
        city: item.city,
        yera_of_exp: `${item.yera_of_exp} years in business`,
        enquery: `${item.enquery} enquiries answered`,
        type: item.type || '',
        brand: item.brand || '',
        image: item.shop_image?.replace(/\\/g, '') || '',
      }));

      setShopData(formattedList);
      setFilteredData(formattedList);
    } catch (error) {
      console.error('Failed to fetch vendor list:', error);
    }
  };

  const fetchTypeList = async () => {
    try {
      const response = await axios.get(
        'https://veebuilds.com/mobile/type_list_customer.php',
        {
          params: {
            cat_id,
            customer_id,
            brand_id: '',
          },
        }
      );
      const list = response.data.storeList || [];
      setTypeOptions(list.map((item) => item.title));
    } catch (error) {
      console.error('Failed to fetch types:', error);
    }
  };

  const fetchBrandList = async () => {
    try {
      const response = await axios.get(
        'https://veebuilds.com/mobile/brand_list_customer.php',
        {
          params: {
            cat_id,
            customer_id,
          },
        }
      );
      const list = response.data.brandList || [];
      setBrandOptions(list.map((item) => item.title));
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  useEffect(() => {
    fetchVendorList();
  }, []);

  useEffect(() => {
    if (modalVisible) fetchTypeList();
    if (brandModalVisible) fetchBrandList();
  }, [modalVisible, brandModalVisible]);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={item.image ? { uri: item.image } : require('../../assets/images/veebuilder.png')}
        style={styles.logo}
      />
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/components/Shopdetails', params: { vendor_id: item.id } })}

          style={styles.cardTextContainer}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subText}>{item.distance}</Text>
          <Text style={styles.subText}>{item.city}</Text>
          <Text style={styles.subText}>{item.yera_of_exp}</Text>
          <Text style={styles.subText}>{item.enquery}</Text> 
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="call" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Enquiry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFilteredData(shopData.filter((item) => item.type === type || type === ''));
    setModalVisible(false);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setFilteredData(shopData.filter((item) => item.brand === brand || brand === ''));
    setBrandModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Shop</Text>
      </View>

      {/* <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search materials..."
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View> */}

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
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdownContainer}>
          <Ionicons name="list" size={20} color="#888" style={styles.dropdownIcon} />
          <Text style={styles.dropdownText}>{selectedType || 'Type'}</Text>
          <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setBrandModalVisible(true)} style={styles.dropdownContainer}>
          <Ionicons name="pricetag" size={20} color="#888" style={styles.dropdownIcon} />
          <Text style={styles.dropdownText}>{selectedBrand || 'Brand'}</Text>
          <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Type Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Type</Text>
            <FlatList
              data={typeOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() =>  handleTypeSelect(item)} style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Brand Modal */}
      <Modal visible={brandModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Brand</Text>
            <FlatList
              data={brandOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleBrandSelect(item)} style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setBrandModalVisible(false)} style={styles.modalCloseButton}>
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
    height:250
  },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginRight: 16 },
  cardTextContainer: { marginBottom: 12, left: 20 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  subText: { fontSize: 11, color: '#555', marginBottom: 4 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 59,
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
    maxHeight: 450,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  modalOption: { paddingVertical: 12 },
  modalOptionText: { fontSize: 16, color: '#000' },
  modalCloseButton: { paddingVertical: 12, alignItems: 'center' },
  modalCloseText: { fontSize: 16, color: '#1789AE' },
});



 




