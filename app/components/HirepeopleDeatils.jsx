// import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Platform, ActivityIndicator } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function HirepeopleDetails() {
//   const router = useRouter();
//   const { id, title } = useLocalSearchParams();
//   const [people, setPeople] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [imageErrors, setImageErrors] = useState({});

//   const handleImageError = (id) => {
//     setImageErrors(prev => ({ ...prev, [id]: true }));
//   };

//   const fetchProfessionals = async () => {
//     try {
//       const response = await axios.get(`https://veebuilds.com/mobile/professional_list_by_id.php?occupation=${id}`);
//       console.log("API Response:", response.data);
//       if (response.data?.storeList) {
//         const processedData = response.data.storeList.map(item => {
//           console.log("Original image path:", item.aatharimage);
//           // Clean and normalize image path
//           let imagePath = item.aatharimage || '';
          
//           // Remove duplicate base URLs and normalize slashes
//           if (imagePath.includes('https://veebuilds.com')) {
//             imagePath = imagePath.replace('https://veebuilds.com', '');
//           }
          
//           imagePath = imagePath.replace(/^\/+|\/+$/g, ''); // Trim slashes
          
//           return {
//             ...item,
//             aatharimage: imagePath 
//               ? `https://veebuilds.com/${imagePath}`
//               : null
//           };
//         });
//         setPeople(processedData);
//       }
//     } catch (error) {
//       console.error('Error fetching professionals:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfessionals();
//   }, []);

//   const renderCard = ({ item }) => {
//     const hasImageError = imageErrors[item.id];
//     const showPlaceholder = !item.aatharimage || hasImageError;

//     return (
//       <View style={styles.card}>
//         {showPlaceholder ? (
//           <View style={styles.placeholder}>
//             <Ionicons name="person-circle-outline" size={60} color="#ccc" />
//           </View>
//         ) : (
//           <Image 
//             source={{ uri: item.aatharimage }}
//             style={styles.logo}
//             onError={() => handleImageError(item.id)}
//             resizeMode="cover"
//           />
//         )}

//         <View style={{ flex: 1 }}>
//           <TouchableOpacity onPress={() => router.push({
//             pathname: '/components/HirepeopleDetails1',
//             params: { data: JSON.stringify(item) }
//           })} style={styles.cardTextContainer}>
//             <Text style={styles.title}>{item.name}</Text>
//             <Text style={styles.subText}>{item.city}</Text>
//             <Text style={styles.subText}>{item.yearofexp} years of experience</Text>
//             <Text style={styles.subText}>{item.enquery} enquiry answers</Text>
//           </TouchableOpacity>

//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={styles.button}>
//               <Ionicons name="call" size={16} color="white" style={styles.icon} />
//               <Text style={styles.buttonText}>Call</Text>
//             </TouchableOpacity>

//                     <TouchableOpacity
//           style={styles.button}
//           onPress={() =>
//             router.push({
//               pathname: '/components/EnquiryRealHire',
//               params: {
//                 cat_id,
//                 land_id: person.id,
//                 v_id: person.vendor_id || v_id || '',
//                 customer_id,
//                 user_id,
//               },
//             })
//           }
//         >
//           <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
//           <Text style={styles.buttonText}>Enquiry</Text>
//         </TouchableOpacity>

//             <TouchableOpacity style={styles.button}>
//               <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
//               <Text style={styles.buttonText}>WhatsApp</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <LinearGradient
//         colors={['#1789AE', '#132740']}
//         style={styles.header}
//         start={{ x: 1, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>{title}</Text>
//       </LinearGradient>

//       {loading ? (
//         <ActivityIndicator size="large" color="#1789AE" style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={people}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderCard}
//           contentContainerStyle={{ paddingBottom: 20 }}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No professionals found</Text>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: Platform.OS === 'ios' ? 130 : 120,
//     paddingTop: Platform.OS === 'ios' ? 30 : 20,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     marginRight: 10,
//     marginTop: Platform.OS === 'ios' ? 35 : 30,
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: Platform.OS === 'ios' ? 35 : 30,
//   },
//   card: {
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     padding: 26,
//     margin: 18,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 2, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//     alignItems: 'flex-start',
//   },
//   logo: {
//     width: 150,
//     height: 140,
//     resizeMode: 'cover',
//     marginRight: 16,
//     bottom: Platform.OS === 'ios' ? 18 : 20,
//     borderRadius: 8,
//   },
//   placeholder: {
//     width: 150,
//     height: 140,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     marginRight: 16,
//     bottom: Platform.OS === 'ios' ? 18 : 20,
//   },
//   cardTextContainer: {
//     marginBottom: 26,
//     left: 20,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 6,
//   },
//   subText: {
//     fontSize: 11,
//     color: '#555',
//     marginBottom: 4,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 38,
//     gap: 12,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1789AE',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     width: 102,
//     height: 40,
//     right: 177,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 8,
//     fontWeight: 'bold',
//   },
//   icon: {
//     marginRight: 4,
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//     color: '#666',
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HirepeopleDetails() {
  const router = useRouter();

  // Extract params from route
  const {
    id, // occupation id
    title,
    cat_id = '',
    v_id = '',   
    user_id = '',
    customer_id = '',
  } = useLocalSearchParams();

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const fetchProfessionals = async () => {
    const apiUrl = `https://veebuilds.com/mobile/professional_list_by_id.php?occupation=${id}`;
    console.log('API URL:', apiUrl);

    try {
      const response = await axios.get(apiUrl);
      if (response.data?.storeList) {
        const processedData = response.data.storeList.map((item) => {
          let imagePath = item.aatharimage || '';

          if (imagePath.includes('https://veebuilds.com')) {
            imagePath = imagePath.replace('https://veebuilds.com', '');
          }

          imagePath = imagePath.replace(/^\/+|\/+$/g, '');

          return {
            ...item,
            aatharimage: imagePath ? `https://veebuilds.com/${imagePath}` : null,
          };
        });

        setPeople(processedData);
      }
    } catch (error) {
      console.error('API Error:', error.message);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const renderCard = ({ item }) => {
    const hasImageError = imageErrors[item.id];
    const showPlaceholder = !item.aatharimage || hasImageError;

    return (
      <View style={styles.card}>
        {showPlaceholder ? (
          <View style={styles.placeholder}>
            <Ionicons name="person-circle-outline" size={60} color="#ccc" />
          </View>
        ) : (
          <Image
            source={{ uri: item.aatharimage }}
            style={styles.logo}
            onError={() => handleImageError(item.id)}
            resizeMode="cover"
          />
        )}

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/components/HirepeopleDetails1',
                params: { data: JSON.stringify(item) },
              })
            }
            style={styles.cardTextContainer}
          >
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

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: '/components/HirepeopleEnquiry',
                  params: {
                    cat_id,
                    land_id: item.id,
                    v_id: item.id,
                    customer_id,
                    user_id,
                    product_id: item.product_id || item.id,
                    city: item.city || '',
                  },
                })
              }
            >
              <Ionicons
                name="information-circle"
                size={16}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Enquiry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Ionicons
                name="logo-whatsapp"
                size={16}
                color="white"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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
        <Text style={styles.headerText}>{title}</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#1789AE" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No professionals found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 130 : 120,
    paddingTop: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    marginTop: Platform.OS === 'ios' ? 35 : 30,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 35 : 30,
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
    resizeMode: 'cover',
    marginRight: 16,
    bottom: Platform.OS === 'ios' ? 18 : 20,
    borderRadius: 8,
  },
  placeholder: {
    width: 150,
    height: 140,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 16,
    bottom: Platform.OS === 'ios' ? 18 : 20,
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
    height: 40,
    right: 177,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  icon: {
    marginLeft: 5,
  },
  emptyText: {
    marginTop: 40,
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});