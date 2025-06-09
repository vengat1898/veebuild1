import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter,useLocalSearchParams } from 'expo-router';


export default function Realestate() {
  const [realEstateData, setRealEstateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cat_id, customer_id } = params;

  useEffect(() => {
  axios.get('https://veebuilds.com/mobile/all_land_list.php')
    .then(response => {
      const processedData = response.data.storeList.map(item => {
        // Clean up the URL path
        const baseUrl = item.url.replace('/master//', '/master/');
        
        // Extract first image from the string
        let firstImage = '';
        try {
          // Remove the square brackets and split by comma
          const imagesString = item.siteimg.replace(/^\[|\]$/g, '');
          const imagesArray = imagesString.split(', ')
            .map(img => img.trim())
            .filter(img => img.length > 0);
          
          if (imagesArray.length > 0) {
            firstImage = baseUrl + imagesArray[0];
          }
        } catch (e) {
          console.log('Error parsing images', e);
        }
        console.log('Vendor ID:', item.vendor_id);
        
        return {
          ...item,
          firstImage
        };
      });
      
      setRealEstateData(processedData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching real estate data', error);
      setLoading(false);
    });
}, []);

  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/components/Landdetails?id=${item.id}`)} style={styles.card}>
      {/* Use the actual property image if available, otherwise a placeholder */}
      {item.firstImage ? (
        <Image 
          source={{ uri: item.firstImage }} 
          style={styles.propertyImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.propertyImage, styles.placeholderImage]}>
          <Ionicons name="image" size={50} color="#ccc" />
        </View>
      )}
      
      <View style={{ flex: 1 }}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.title}>{item.land_brocker}</Text>
          <Text style={styles.subText}>Location: {item.land_area}</Text>
          <Text style={styles.subText}>Size: {item.land_size} sq ft</Text>
          <Text style={styles.subText}>Price: ₹{item.cost_per_sq} per sq ft</Text>
          <Text style={styles.subText}>Type: {item.property_type}</Text>
        </View>
        {/* Buttons inside card */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="call" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
           <TouchableOpacity 
           style={styles.button} 
          onPress={() => 
         router.push({
          pathname: '/components/EnquiryRealHire',
          params: { 
            cat_id: cat_id,          // from your current component's params or state
            land_id: item.id,        // the current land item id
            v_id: item.vendor_id || '', // example vendor id if exists on item
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
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1789AE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back('/components/Materials')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Real Estate</Text>
      </LinearGradient>

      <FlatList
        data={realEstateData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 110,
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    marginTop: 30,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
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
  },
  propertyImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginBottom: 12,
    left: 20,
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
   
  },
  subText: {
    fontSize: 11,
    color: '#555',
    marginBottom: 4,
   
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
    gap: 12,
    marginRight: 180,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 23,
    borderRadius: 10,
    width: 98,
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




