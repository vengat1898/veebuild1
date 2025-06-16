import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Linking, Alert,SafeAreaView,Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Shopdetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Debug all incoming parameters
  console.log('Shopdetails received ALL params:', params);

  // Robust parameter extraction with multiple fallbacks
  const vendor_id = params.vendor_id || params.vendor || params.id;
  const cat_id = params.cat_id || params.category_id || 'unknown_category';
  const customer_id = params.customer_id || params.user_id || 'unknown_customer';

  console.log('Processed parameters:', {
    vendor_id,
    cat_id,
    customer_id
  });

  const [activeTab, setActiveTab] = useState('Quick Info');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Starting to fetch vendor details for:', vendor_id);
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const url = `https://veebuilds.com/mobile/vendor_details.php?vendor_id=${vendor_id}`;
        console.log('Fetching from URL:', url);
        
        const response = await axios.get(url);
        console.log('API response:', response.data);

        if (response.data?.result === "Success" && response.data.storeList?.length > 0) {
          setVendorData(response.data.storeList[0]);
          console.log('Vendor data successfully set');
        } else {
          const errorMsg = response.data?.text || 'No vendor details found';
          console.warn('API error:', errorMsg);
          Alert.alert('Error', errorMsg);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendor_id]);

  const handleCall = () => {
    console.log('Call initiated with number:', vendorData?.mobile);
    if (vendorData?.mobile) {
      Linking.openURL(`tel:${vendorData.mobile}`);
    } else {
      Alert.alert('No phone number available');
    }
  };

  const handleWhatsApp = () => {
    console.log('WhatsApp initiated with:', vendorData?.whatsapp || vendorData?.mobile);
    if (vendorData?.whatsapp) {
      Linking.openURL(`https://wa.me/${vendorData.whatsapp}`);
    } else if (vendorData?.mobile) {
      Linking.openURL(`https://wa.me/91${vendorData.mobile}`);
    } else {
      Alert.alert('No WhatsApp number available');
    }
  };

  const handleEnquiry = () => {
    console.log('Initiating enquiry with params:', {
      vendor_id,
      cat_id,
      customer_id,
      shopName: vendorData?.name,
      shopImage: vendorData?.shop_image
    });
    
    if (!vendorData) {
      Alert.alert('Error', 'Vendor information not loaded');
      return;
    }
    
    router.push({
      pathname: '/components/Enquiry',
      params: {
        vendor_id,
        cat_id,
        customer_id,
        shopName: vendorData.name || '',
        shopImage: vendorData.shop_image || '',
        mobile: vendorData.mobile || '',
        whatsapp: vendorData.whatsapp || '',
        email: vendorData.email || '',
        experience: vendorData.yera_of_exp || '',
        location: vendorData.location || '',
        city: vendorData.city || '',
        state: vendorData.state || '',
        country: vendorData.country || ''
      }
    });
  };

  if (loading) {
    console.log('Loading state - showing spinner');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1789AE" />
      </View>
    );
  }

  if (!vendorData) {
    console.log('No vendor data state - showing error');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load vendor details.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('Rendering vendor details UI');

  return (
    <SafeAreaView style={styles.safeArea}> 
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Shop Details</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <Image
            source={vendorData.shop_image ? { uri: vendorData.shop_image } : require('../../assets/images/veebuilder.png')}
            style={styles.logo}
          />
        </View>

        <Text style={styles.nameText}>{vendorData.name}</Text>
        <Text style={styles.distance}>13 km away from you</Text>
        {vendorData.city && <Text style={styles.city}>{vendorData.city}</Text>}
        <Text style={styles.enquery}>{vendorData.enquery || 0} enquiries answered</Text>
        <Text style={styles.yera_of_exp}>{vendorData.yera_of_exp || 0} years of experience</Text>

        <View style={styles.separator} />
        {vendorData.location && (
          <>
            <Text style={styles.addressHeading}>Address</Text>
            <Text style={styles.addressText}>{vendorData.location}</Text>
            <View style={styles.separator} />
          </>
        )}

        <View style={styles.tabsContainer}>
          {['Quick Info', 'Overview', 'Photos'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'Quick Info' && (
            <>
              {vendorData.mobile && (
                <>
                  <Text style={styles.infoHeading}>Mobile</Text>
                  <Text style={styles.infoText}>{vendorData.mobile}</Text>
                </>
              )}
              
              {vendorData.email && (
                <>
                  <Text style={styles.infoHeading}>Email</Text>
                  <Text style={styles.infoText}>{vendorData.email}</Text>
                </>
              )}
              
              {vendorData.year_established && (
                <>
                  <Text style={styles.infoHeading}>Year Established</Text>
                  <Text style={styles.infoText}>{vendorData.year_established}</Text>
                </>
              )}
            </>
          )}

          {activeTab === 'Overview' && (
            <>
              {vendorData.no_of_emp && (
                <>
                  <Text style={styles.infoHeading}>Number of Employees</Text>
                  <Text style={styles.infoText}>{vendorData.no_of_emp}</Text>
                </>
              )}
              
              {vendorData.gstnumber && (
                <>
                  <Text style={styles.infoHeading}>GST Number</Text>
                  <Text style={styles.infoText}>{vendorData.gstnumber}</Text>
                </>
              )}
              
              {vendorData.turn_over && (
                <>
                  <Text style={styles.infoHeading}>Turn Over</Text>
                  <Text style={styles.infoText}>{vendorData.turn_over}</Text>
                </>
              )}
            </>
          )}

          {activeTab === 'Photos' && (
            <View style={styles.photoContainer}>
              {vendorData.shop_image ? (
                <Image source={{ uri: vendorData.shop_image }} style={styles.photoImage} />
              ) : (
                <Text>No photos available</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleCall}>
          <Ionicons name="call" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEnquiry}>
          <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Enquiry Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
  },
  header: {
    height: 160,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    bottom:60,
  },
  backButton: {
    marginRight: 10,
    marginTop:30
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:30
    
  },
  scrollContent: {
    padding: 10,
    alignItems: 'flex-start',
    
  },
  box: {
    width: '70%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    alignItems:'center',
    marginBottom: 50,
    backgroundColor: 'white',
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 10,
    alignItems:'center'
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBox: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  experienceText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  addressHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#1789AE', 
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#1789AE',
    fontWeight: 'bold',
  },
  tabContent: {
    width: '100%',
    paddingVertical: 16,
  },
  infoHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  photoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 1,
    height:150
  },
  photoImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems:"center",
    marginTop: 15,
    gap: 8,
    marginBottom:20,
    marginLeft:15
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: 98,
    marginLeft:10
  },
  buttonText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 4,
  },
});
