import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import logoimg from '../../assets/images/veebuilder.png';

export default function Realestate() {
  const [realEstateData, setRealEstateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get('https://veebuilds.com/mobile/all_land_list.php')
      .then(response => {
        setRealEstateData(response.data.storeList);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching real estate data', error);
        setLoading(false);
      });
  }, []);

  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/components/Landdetails?id=${item.id}`)} style={styles.card}>
      <Image source={logoimg} style={styles.logo} />
      <View style={{ flex: 1 }}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.title}>{item.land_brocker}</Text>
          <Text style={styles.subText}>{item.land_area}</Text>
          <Text style={styles.subText}>{item.land_size} sq ft</Text>
          <Text style={styles.subText}>₹ {item.cost_per_sq} per sq ft</Text>
        </View>
        {/* Buttons inside card */}
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
        keyExtractor={(item) => item.id}
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
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginRight: 16,
    bottom: 20,
  },
  cardTextContainer: {
    marginBottom: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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




