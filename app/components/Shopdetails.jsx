import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Shopdetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const vendor_id = params.vendor_id || params.vendor || params.id;
  const cat_id = params.cat_id || params.category_id || 'unknown_category';
  const customer_id = params.customer_id || params.user_id || 'unknown_customer';

  const [activeTab, setActiveTab] = useState('Quick Info');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://veebuilds.com/mobile/vendor_details.php?vendor_id=${vendor_id}`);
        if (response.data?.result === "Success" && response.data.storeList?.length > 0) {
          setVendorData(response.data.storeList[0]);
        } else {
          Alert.alert('Error', response.data?.text || 'No vendor details found');
        }
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendor_id]);

  const handleCall = () => {
    if (vendorData?.mobile) {
      Linking.openURL(`tel:${vendorData.mobile}`);
    } else {
      Alert.alert('No phone number available');
    }
  };

  const handleWhatsApp = () => {
    const number = vendorData?.whatsapp || vendorData?.mobile;
    if (number) {
      Linking.openURL(`https://wa.me/${number.startsWith('91') ? '' : '91'}${number}`);
    } else {
      Alert.alert('No WhatsApp number available');
    }
  };

  const handleEnquiry = () => {
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

  const styles = createStyles(windowWidth, windowHeight);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1789AE" />
      </View>
    );
  }

  if (!vendorData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load vendor details.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* StatusBar setup */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header with dynamic padding for status bar */}
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={[
          styles.header,
          { paddingTop: insets.top, height: insets.top + 60 }
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Shop Details</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={vendorData.shop_image ? { uri: vendorData.shop_image } : require('../../assets/images/veebuilder.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>{vendorData.name}</Text>
          <Text style={styles.distanceText}>13 km away from you</Text>
          {vendorData.city && <Text style={styles.cityText}>{vendorData.city}</Text>}
          <Text style={styles.enquiryText}>{vendorData.enquery || 0} enquiries answered</Text>
          <Text style={styles.experienceText}>{vendorData.yera_of_exp || 0} years of experience</Text>

          <View style={styles.separator} />

          {vendorData.location && (
            <>
              <Text style={styles.sectionHeading}>Address</Text>
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
                  <View style={styles.infoItem}>
                    <Text style={styles.infoHeading}>Mobile</Text>
                    <Text style={styles.infoText}>{vendorData.mobile}</Text>
                  </View>
                )}
                {vendorData.email && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoHeading}>Email</Text>
                    <Text style={styles.infoText}>{vendorData.email}</Text>
                  </View>
                )}
                {vendorData.year_established && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoHeading}>Year Established</Text>
                    <Text style={styles.infoText}>{vendorData.year_established}</Text>
                  </View>
                )}
              </>
            )}

            {activeTab === 'Overview' && (
              <>
                {vendorData.no_of_emp && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoHeading}>Number of Employees</Text>
                    <Text style={styles.infoText}>{vendorData.no_of_emp}</Text>
                  </View>
                )}
                {vendorData.gstnumber && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoHeading}>GST Number</Text>
                    <Text style={styles.infoText}>{vendorData.gstnumber}</Text>
                  </View>
                )}
                {vendorData.turn_over && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoHeading}>Turn Over</Text>
                    <Text style={styles.infoText}>{vendorData.turn_over}</Text>
                  </View>
                )}
              </>
            )}

            {activeTab === 'Photos' && (
              <View style={styles.photoContainer}>
                {vendorData.shop_image ? (
                  <Image
                    source={{ uri: vendorData.shop_image }}
                    style={styles.photoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.noPhotosText}>No photos available</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Ionicons name="call" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEnquiry}>
          <Ionicons name="information-circle" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (windowWidth, windowHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#ff0000',
      marginBottom: 20,
      textAlign: 'center',
    },
    header: {
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerBackButton: {
      marginRight: 15,
    },
    headerText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    scrollContent: {
      paddingBottom: 100,
    },
    logoContainer: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 20,
    },
    logo: {
      width: windowWidth * 0.4,
      height: windowWidth * 0.4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#eee',
    },
    contentContainer: {
      paddingHorizontal: 20,
    },
    nameText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    distanceText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 3,
    },
    cityText: {
      fontSize: 16,
      color: '#444',
      marginBottom: 3,
      fontWeight: '500',
    },
    enquiryText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 3,
    },
    experienceText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 15,
    },
    separator: {
      height: 1,
      backgroundColor: '#eee',
      marginVertical: 15,
      width: '100%',
    },
    sectionHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    addressText: {
      fontSize: 14,
      color: '#555',
      lineHeight: 20,
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginBottom: 15,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTabButton: {
      borderBottomColor: '#1789AE',
    },
    tabText: {
      fontSize: 15,
      color: '#777',
    },
    activeTabText: {
      color: '#1789AE',
      fontWeight: 'bold',
    },
    tabContent: {
      marginBottom: 20,
    },
    infoItem: {
      marginBottom: 15,
    },
    infoHeading: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 3,
    },
    infoText: {
      fontSize: 14,
      color: '#555',
    },
    photoContainer: {
      width: '100%',
      height: 200,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    photoImage: {
      width: '60%',
      height: '100%',
      borderRadius: 10,
    },
    noPhotosText: {
      fontSize: 14,
      color: '#777',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1789AE',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 5,
    },
    buttonIcon: {
      marginRight: 8,
    },
    buttonText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });
