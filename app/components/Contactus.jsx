import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; // for WhatsApp
import { MaterialIcons } from '@expo/vector-icons'; // for Email
import logoimg from '../../assets/images/veebuilder.png'; 

export default function Contactus() {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL('tel:+919940098743');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/919940098743');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:veebuild2024@gmail.com');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
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
        <Text style={styles.headerTitle}>Contact Us</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo */}
        <Image source={logoimg} style={styles.logo} resizeMode="contain" />

        {/* Heading */}
        <Text style={styles.heading}>Vee Build</Text>

        {/* Address */}
        <Text style={styles.infoText}>
          East 3rd Cross Street,{'\n'}Amarvathi Nagar,{'\n'}Chennai, Tamil Nadu 600106
        </Text>

        {/* Phone */}
        <Text style={styles.infoText}>📞 +91 99400 98743</Text>

        {/* Email */}
        <Text style={styles.infoText}>📧 veebuild2024@gmail.com</Text>

        {/* Website */}
        <Text style={styles.visitText}>For more visit:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://minsway.in/webteam/vee_construction/')}>
          <Text style={styles.linkText}>https://minsway.in/webteam/vee_construction/</Text>
        </TouchableOpacity>

        {/* Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <FontAwesome name="whatsapp" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Email Button */}
        <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
          <MaterialIcons name="email" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Email Us</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    bottom: 30,
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#132740',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    lineHeight: 26,
  },
  visitText: {
    marginTop: 30,
    fontSize: 14,
    color: '#555',
  },
  linkText: {
    fontSize: 12,
    color: '#1789AE',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
    width: '100%',
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  whatsappButton: {
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  emailButton: {
    flexDirection: 'row',
    backgroundColor: '#132740',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



