import { StyleSheet, Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';

import material from '../../assets/images/hirepeople.png';
import realestate from '../../assets/images/real.png';
import hirepeople from '../../assets/images/hirepeople.png';
import { SessionContext } from '../../context/SessionContext'; // Adjust path as needed

export default function Myenquiry() {
  const router = useRouter();
  const { session, isSessionLoaded } = useContext(SessionContext);

  const handlePress = (type) => {
    if (session && session.id) {
      router.push({ 
        pathname: '/components/MyenquiryDetails', 
        params: { 
          title: type,
          customer_id: session.id 
        }, 
      });
    } else {
      console.log('No user session found');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <LinearGradient
        colors={['#1789AE', '#132740']}
        style={styles.header}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>MyEnquiry</Text>
      </LinearGradient>

      {/* Container with cards */}
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handlePress('meterial enquiry')}>
          <LinearGradient
            colors={['#1789AE', '#132740']}
            style={styles.card}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={material} style={styles.image} resizeMode="contain" />
            <Text style={styles.cardText}>Material</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('real estate enquiry')}>
          <LinearGradient
            colors={['#1789AE', '#132740']}
            style={styles.card}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={realestate} style={styles.image} resizeMode="contain" />
            <Text style={styles.cardText}>Real Estate</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePress('Hire people enquiry')}>
          <LinearGradient
            colors={['#1789AE', '#132740']}
            style={styles.card}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={hirepeople} style={styles.image} resizeMode="contain" />
            <Text style={styles.cardText}>Hire People</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable 
          style={styles.footerItem} 
          onPress={() => router.push('/components/Home')}
        >
          {({ pressed }) => (
            <>
              <Ionicons
                name="home"
                size={24}
                color={pressed ? '#00A4C9' : '#808080'}
              />
              <Text style={[styles.footerText, { color: pressed ? '#00A4C9' : '#808080' }]}>
                Home
              </Text>
            </>
          )}
        </Pressable>

        <Pressable 
          style={styles.footerItem} 
          onPress={() => router.push('/components/Myenquiry')}
        >
          {({ pressed }) => (
            <>
              <MaterialIcons
                name="assignment"
                size={24}
                color={pressed ? '#007A98' : '#00A4C9'}
              />
              <Text style={[styles.footerText, { color: pressed ? '#007A98' : '#00A4C9' }]}>
                My Enquiry
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 120
  },
  backButton: {
    marginRight: 12,
    marginTop: 40
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40
  },
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 18,
    borderRadius: 10,
    width: '100%',
  },
  image: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginBottom:28
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
  },
});




