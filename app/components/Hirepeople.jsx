import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Hirepeople() {
  const router = useRouter();
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessions = async () => {
    try {
      const response = await axios.get('https://veebuilds.com/mobile/occupation_list.php');
      if (response.data?.storeList) {
        setProfessions(response.data.storeList);
      }
    } catch (error) {
      console.error('Error fetching professions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessions();
  }, []);

  const goToDetails = (profession) => {
    router.push({
      pathname: '/components/HirepeopleDeatils',
      params: { id: profession.id, title: profession.title },
    });
  };
  

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Hire People</Text>
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1789AE" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {professions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.professionItem}
              // onPress={() => goToDetails(item.title)}
              onPress={() => goToDetails(item)}

            >
              <Text style={styles.professionText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#1789AE" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  },
  backButton: { marginRight: 10, marginTop: 30 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 30 },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  professionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 15,
  },
  professionText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
});


