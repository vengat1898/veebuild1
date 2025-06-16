// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function HirepeopleDetails() {
//   const router = useRouter();

//   // Extract params from route
//   const {
//     id, // occupation id
//     title,
//     cat_id = '',
//     v_id = '',   
//     user_id = '',
//     customer_id = '',
//   } = useLocalSearchParams();

//   const [people, setPeople] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [imageErrors, setImageErrors] = useState({});

//   const handleImageError = (id) => {
//     setImageErrors((prev) => ({ ...prev, [id]: true }));
//   };

//   const fetchProfessionals = async () => {
//     const apiUrl = `https://veebuilds.com/mobile/professional_list_by_id.php?occupation=${id}`;
//     console.log('API URL:', apiUrl);

//     try {
//       const response = await axios.get(apiUrl);
//       if (response.data?.storeList) {
//         const processedData = response.data.storeList.map((item) => {
//           let imagePath = item.aatharimage || '';

//           if (imagePath.includes('https://veebuilds.com')) {
//             imagePath = imagePath.replace('https://veebuilds.com', '');
//           }

//           imagePath = imagePath.replace(/^\/+|\/+$/g, '');

//           return {
//             ...item,
//             aatharimage: imagePath ? `https://veebuilds.com/${imagePath}` : null,
//           };
//         });

//         setPeople(processedData);
//       }
//     } catch (error) {
//       console.error('API Error:', error.message);
//       if (error.response) {
//         console.error('Error Response Data:', error.response.data);
//       }
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
//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: '/components/HirepeopleDetails1',
//                 params: { data: JSON.stringify(item) },
//               })
//             }
//             style={styles.cardTextContainer}
//           >
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

//             <TouchableOpacity
//               style={styles.button}
//               onPress={() =>
//                 router.push({
//                   pathname: '/components/HirepeopleEnquiry',
//                   params: {
//                     cat_id,
//                     land_id: item.id,
//                     v_id: item.id,
//                     customer_id,
//                     user_id,
//                     product_name: item.name || '', // Pass name here
//                     product_id: item.id, // Keep product_id if needed elsewhere
//                     city: item.city || '',
//                   },
//                 })
//               }
//             >
//               <Ionicons
//                 name="information-circle"
//                 size={16}
//                 color="white"
//                 style={styles.icon}
//               />
//               <Text style={styles.buttonText}>Enquiry</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.button}>
//               <Ionicons
//                 name="logo-whatsapp"
//                 size={16}
//                 color="white"
//                 style={styles.icon}
//               />
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
//     color: '#fff',
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
//   icon: {
//     marginLeft: 5,
//   },
//   emptyText: {
//     marginTop: 40,
//     fontSize: 16,
//     color: '#777',
//     textAlign: 'center',
//   },
// });


import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HirepeopleDetails() {
  const router = useRouter();
  const {
    id,
    title,
    cat_id = '',
    v_id = '',
    user_id = '',
    customer_id = '',
  } = useLocalSearchParams();

  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const fetchProfessionals = async () => {
    const apiUrl = `https://veebuilds.com/mobile/professional_list_by_id.php?occupation=${id}`;

    try {
      setLoading(true);
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredPeople(people);
    } else {
      const lowerSearch = searchText.toLowerCase();
      const filtered = people.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.city?.toLowerCase().includes(lowerSearch)
      );
      setFilteredPeople(filtered);
    }
  }, [searchText, people]);

  const renderCard = ({ item }) => {
    const hasImageError = imageErrors[item.id];
    const showPlaceholder = !item.aatharimage || hasImageError;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
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

          <View style={styles.textGroupContainer}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/components/HirepeopleDetails1',
                  params: { data: JSON.stringify(item) },
                })
              }
              style={styles.cardTextContainer}
            >
              <View style={styles.textGroup}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subText}>{item.city}</Text>
                <Text style={styles.subText}>{item.yearofexp} years of experience</Text>
                <Text style={styles.subText}>{item.enquery} enquiry answers</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

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
                  product_name: item.name || '',
                  product_id: item.id,
                  city: item.city || '',
                },
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
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1789AE" style={styles.loader} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search by name or city"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {filteredPeople.length > 0 ? (
        <FlatList
          data={filteredPeople}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.noResults}>
          <Text>No professionals found</Text>
        </View>
      )}
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
    paddingTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1789AE',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    minHeight: 250,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logo: {
    width: '40%',
    height: 150,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  placeholder: {
    width: '40%',
    height: 150,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  textGroupContainer: {
    flex: 1,
    marginLeft: 16,
  },
  textGroup: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    textAlign: 'left',
  },
  subText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'left',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    paddingTop: 16,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    flex: 1,
    minHeight: 40,
    maxWidth: '32%',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  icon: {},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
});
