import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Landdetails() {
  const router = useRouter();
  const { id, cat_id, customer_id } = useLocalSearchParams();
  const [landDetails, setLandDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    axios.get('https://veebuilds.com/mobile/all_land_list.php')
      .then(response => {
        const land = response.data.storeList.find(item => item.id === id);
        setLandDetails(land);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching land details:', error);
        setLoading(false);
      });
  }, [id]);

  const getFirstImageUrl = () => {
    if (!landDetails?.siteimg) return null;
    
    try {
      // Handle different possible formats of siteimg
      // Case 1: It's already a clean string
      if (typeof landDetails.siteimg === 'string' && !landDetails.siteimg.startsWith('[')) {
        return `https://veebuilds.com/master/assets/images/product_image/${landDetails.siteimg}`;
      }
      
      // Case 2: It's a stringified array
      const imagesString = landDetails.siteimg.replace(/^\[|\]$/g, '');
      const imagesArray = imagesString.split(',')
        .map(img => img.trim().replace(/"/g, ''))
        .filter(img => img.length > 0);
      
      if (imagesArray.length > 0) {
        return `https://veebuilds.com/master/assets/images/product_image/${imagesArray[0]}`;
      }
    } catch (e) {
      console.log('Error parsing images', e);
    }
    
    return null;
  };

  const imageUrl = getFirstImageUrl();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1789AE" />
      </View>
    );
  }

  if (!landDetails) {
    return (
      <View style={styles.container}>
        <Text>Land details not found.</Text>
      </View>
    );
  }

  const {
    land_brocker,
    land_area,
    land_mark,
    land_size,
    connection,
    property_type,
    cost_per_sq,
    tot_cost,
    mobile,
    vendor_id
  } = landDetails;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Land Details</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.item}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.nameText}>{land_brocker}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Land Area:</Text>
          <Text style={styles.valueText}>{land_area}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Land mark:</Text>
          <Text style={styles.valueText}>{land_mark}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Land Size:</Text>
          <Text style={styles.valueText}>{land_size} sq ft</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Connection:</Text>
          <Text style={styles.valueText}>{connection}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Site Image:</Text>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image} 
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image" size={50} color="#ccc" />
              <Text>No Image Available</Text>
            </View>
          )}
          {imageError && (
            <View style={styles.placeholderImage}>
              <Ionicons name="image" size={50} color="#ccc" />
              <Text>Failed to load image</Text>
            </View>
          )}
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Property Type:</Text>
          <Text style={styles.valueText}>{property_type}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Cost per sq ft:</Text>
          <Text style={styles.valueText}>₹ {cost_per_sq}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Total Cost:</Text>
          <Text style={styles.valueText}>₹ {tot_cost}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Call:', mobile)}>
          <Ionicons name="call" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => 
            router.push({
              pathname: '/components/EnquiryRealHire',
              params: { 
                cat_id: cat_id || '',          // passed from previous screen
                land_id: id,                   // current land id
                v_id: vendor_id || '',         // vendor id from land details
                customer_id: customer_id || '' // passed from previous screen
              }
            })
          }
        >
          <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Enquiry</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 120,
    paddingTop: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1789AE',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
    marginTop:30
    
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // push the title to center
    marginRight: 40, // balance the center because of back button width
    marginTop:30
  },
  content: {
    padding: 20,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  valueText: {
    fontSize: 16,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 4,
  },
});




