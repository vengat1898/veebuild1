import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

export default function Shopdetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Quick Info');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { vendor_id } = useLocalSearchParams();

  useEffect(() => {
    axios
      .get(`https://veebuilds.com/mobile/vendor_details.php?vendor_id=${vendor_id}`)
      .then(response => {
        if (response.data?.result === "Success") {
          setVendorData(response.data.storeList[0]);
        }
      })
      .catch(error => {
        console.error('API fetch error:', error);
      })
      .finally(() => setLoading(false));
  }, [vendor_id]); 

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1789AE" />
      </View>
    );
  }

  if (!vendorData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load vendor details.</Text>
      </View>
    );
  }

  return (
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
            source={{ uri: vendorData.shop_image }}
            style={styles.logo}
          />
        </View>

        <Text style={styles.nameText}>{vendorData.name}</Text>
        <Text style={styles.distance}>13 km away from you</Text>
        <Text style={styles.city}>{vendorData.city}</Text>
        {/* <Text style={styles.locationText}>{vendorData.location}</Text> */}
        <Text style={styles.enquery}>{vendorData.enquery} enquiries answered</Text>
        <Text style={styles.yera_of_exp}>{vendorData.yera_of_exp} years of experience</Text>

        <View style={styles.separator} />
        <Text style={styles.addressHeading}>Address</Text>
        <Text style={styles.addressText}>{vendorData.location}</Text>
        <View style={styles.separator} />

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
              <Text style={styles.infoHeading}>Mobile</Text>
              <Text style={styles.infoText}>{vendorData.mobile}</Text>

              <Text style={styles.infoHeading}>Email</Text>
              <Text style={styles.infoText}>{vendorData.email}</Text>

              <Text style={styles.infoHeading}>Year Established</Text>
              <Text style={styles.infoText}>{vendorData.year_established}</Text>
            </>
          )}

          {activeTab === 'Overview' && (
            <>
              <Text style={styles.infoHeading}>Number of Employees</Text>
              <Text style={styles.infoText}>{vendorData.no_of_emp}</Text>

              <Text style={styles.infoHeading}>GST Number</Text>
              <Text style={styles.infoText}>{vendorData.gstnumber}</Text>

              <Text style={styles.infoHeading}>Turn Over</Text>
              <Text style={styles.infoText}>{vendorData.turn_over}</Text>
            </>
          )}

          {activeTab === 'Photos' && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: vendorData.shop_image }} style={styles.photoImage} />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="call" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Enquiry Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 120,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 16,
    alignItems: 'flex-start',
  },
  box: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 10,
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
