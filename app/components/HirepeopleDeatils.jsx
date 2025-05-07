import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Platform,ActivityIndicator  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import logoimg from '../../assets/images/veebuilder.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const realEstateData = [
  { id: '1', name: 'Vengat', place: 'Chennai', experience: '0 years of experience', size: '1000 sq ft', price: '49 enquiry answers' },
];

export default function HirepeopleDetails() {
  const router = useRouter();
  // const { profession } = useLocalSearchParams(); // <-- Get profession passed
  const { id, title } = useLocalSearchParams(); // 'id' for API, 'title' for header
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      const response = await axios.get(`https://veebuilds.com/mobile/professional_list_by_id.php?occupation=${id}`);
      if (response.data?.storeList) {
        setPeople(response.data.storeList);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.aatharimage }} style={styles.logo} />

      <View style={{ flex: 1 }}>
      {/* <TouchableOpacity onPress={() => router.push({ pathname: '/components/HirepeopleDetails1', params: { id: item.id } })} style={styles.cardTextContainer}> */}
      <TouchableOpacity onPress={() => router.push({
       pathname: '/components/HirepeopleDetails1',
       params: { data: JSON.stringify(item) } // Send item as JSON string
      })} style={styles.cardTextContainer}>


        <Text style={styles.title}>{item.name}</Text>
       <Text style={styles.subText}>{item.city}</Text>
       <Text style={styles.subText}>{item.yearofexp} years of experience</Text>
       <Text style={styles.subText}>{item.enquery} enquiry answers</Text>

        </TouchableOpacity>

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
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>{/* Show selected profession */}
      </LinearGradient>

      {loading ? (
  <ActivityIndicator size="large" color="#1789AE" style={{ marginTop: 20 }} />
) : (
  <FlatList
    data={people}
    keyExtractor={(item) => item.id}
    renderItem={renderCard}
    contentContainerStyle={{ paddingBottom: 20 }}
  />
)}

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 130 : 120, // Adjust height for iOS
    paddingTop: Platform.OS === 'ios' ? 30 : 20, // Adjust top padding for iOS
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    marginTop: Platform.OS === 'ios' ? 35 : 30, // Adjust for iOS
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 35 : 30, // Adjust for iOS
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 26,
    margin: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'flex-start',
  },
  logo: {
    width: 150,
    height: 140,
    resizeMode: 'contain',
    marginRight: 16,
    bottom: Platform.OS === 'ios' ? 18 : 20, // Adjust for iOS
    
  },
  cardTextContainer: {
    marginBottom: 26,
    left: 20,
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
    justifyContent: 'space-between',
    marginTop: 38,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 102,
    height:40,
    right: 177, // Adjust for better alignment
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


