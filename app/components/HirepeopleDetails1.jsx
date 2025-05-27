// import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';


// export default function HirepeopleDetails1() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('Quick Info');
//   const { data,params } = useLocalSearchParams();
//   const parsedData = data ? JSON.parse(data) : {};
//   const [person, setPerson] = useState(parsedData);
//   const [loading, setLoading] = useState(!parsedData.id);
//   const [imgError, setImgError] = useState(false);
//   const { cat_id, customer_id } = params;
 
//   const getImageUrl = () => {
//     if (!person?.aatharimage || person.aatharimage.endsWith('/')) {
//       return 'https://via.placeholder.com/300';
//     }
//     return person.aatharimage;
//   };

//   const fetchDetails = async () => {
//     try {
//       const response = await axios.get(`https://veebuilds.com/mobile/professional_details.php?id=${parsedData.id}`);
//       if (response.data?.storeList?.length) {
//         setPerson(response.data.storeList[0]);
//       }
//     } catch (error) {
//       console.error('Error fetching person details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (parsedData.id && !person.mobile) {
//       fetchDetails();
//     }
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#1789AE" />
//       </View>
//     );
//   }

//   if (!person) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>No data found</Text>
//       </View>
//     );
//   }

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
//         <Text style={styles.headerText}>Professional Details</Text>
//       </LinearGradient>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.box}>
//           <Image 
//             source={{ uri: imgError ? 'https://via.placeholder.com/300' : getImageUrl() }}
//             style={styles.logo}
//             onError={() => setImgError(true)}
//           />
//         </View>

//         <Text style={styles.name}>{person.name}</Text>
//         <Text style={styles.city}>{person.city || 'Location not specified'}</Text>

//         <View style={styles.ratingRow}>
//           <View style={styles.ratingBox}>
//             <Ionicons name="star" size={16} color="white" />
//             <Text style={styles.ratingText}>4.5</Text>
//           </View>
//         </View>
//         <Text style={styles.city}>{person.occupation || 'Professional'}</Text>

//         <Text style={styles.yearofexp}>{person.yearofexp || '0'} years of experience</Text>
//         <View style={styles.separator} />

//         <Text style={styles.address}>Address</Text>
//         <Text style={styles.addressText}>{person.address || 'Address not specified'}</Text>
//         <View style={styles.separator} />

//         <View style={styles.tabsContainer}>
//           {['Quick Info', 'Overview', 'Photos'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
//               onPress={() => setActiveTab(tab)}
//             >
//               <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.tabContent}>
//           {activeTab === 'Quick Info' && (
//             <>
//               <Text style={styles.infoHeading}>Mobile</Text>
//               <Text style={styles.infoText}>{person.mobile || 'Not specified'}</Text>

//               <Text style={styles.infoHeading}>Profession</Text>
//               <Text style={styles.infoText}>{person.occupation || 'Not specified'}</Text>

//               <Text style={styles.infoHeading}>Years of Experience</Text>
//               <Text style={styles.infoText}>{person.yearofexp || '0'} years</Text>
//             </>
//           )}
//           {activeTab === 'Overview' && (
//             <>
//               <Text style={styles.infoHeading}>Cost with Material</Text>
//               <Text style={styles.infoText}>₹{person.costwithmeterial || 'Not specified'}</Text>

//               <Text style={styles.infoHeading}>Work Type</Text>
//               <Text style={styles.infoText}>{person.worktype || 'Not specified'}</Text>
//             </>
//           )}
//           {activeTab === 'Photos' && (
//             <View style={styles.photoContainer}>
//               <Image 
//                 source={{ uri: imgError ? 'https://via.placeholder.com/300' : getImageUrl() }}
//                 style={styles.photoImage}
//                 onError={() => setImgError(true)}
//               />
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.button}>
//           <Ionicons name="call" size={16} color="white" style={styles.icon} />
//           <Text style={styles.buttonText}>Call</Text>
//         </TouchableOpacity>

//          <TouchableOpacity 
//            style={styles.button} 
//           onPress={() => 
//          router.push({
//           pathname: '/components/EnquiryRealHire',
//           params: { 
//             cat_id: cat_id,          // from your current component's params or state
//             land_id: item.id,        // the current land item id
//             v_id: item.vendor_id || '', // example vendor id if exists on item
//       }
//     })
//   }
// >
//   <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
//   <Text style={styles.buttonText}>Enquiry</Text>
// </TouchableOpacity>

//         <TouchableOpacity style={styles.button}>
//           <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
//           <Text style={styles.buttonText}>WhatsApp</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 120,
//     paddingTop: 20,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     marginRight: 10,
//     marginTop: 30
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 30
//   },
//   scrollContent: {
//     padding: 16,
//     alignItems: 'flex-start',
//     paddingBottom: 100,
//   },
//   box: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 20,
//     backgroundColor: 'white',
//   },
//   logo: {
//     width: 200,
//     height: 200,
//     borderRadius: 10,
//     backgroundColor: '#f0f0f0',
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#000',
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   ratingBox: {
//     backgroundColor: 'green',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   ratingText: {
//     color: 'white',
//     fontSize: 14,
//     marginLeft: 4,
//   },
//   city: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 8,
//   },
//   yearofexp: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 12,
//   },
//   separator: {
//     width: '100%',
//     height: 1,
//     backgroundColor: '#ccc',
//     marginVertical: 16,
//   },
//   address: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 6,
//   },
//   addressText: {
//     fontSize: 14,
//     color: '#777',
//     marginBottom: 20,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   tabButton: {
//     paddingVertical: 10,
//     flex: 1,
//     alignItems: 'center',
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },
//   activeTabButton: {
//     borderBottomColor: '#1789AE',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#777',
//   },
//   activeTabText: {
//     color: '#1789AE',
//     fontWeight: 'bold',
//   },
//   tabContent: {
//     width: '100%',
//     paddingVertical: 16,
//   },
//   infoHeading: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 4,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 12,
//   },
//   photoContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   photoImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     backgroundColor: '#f0f0f0',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1789AE',
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 10,
//     minWidth: 100,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   icon: {
//     marginRight: 4,
//   },
// });


import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HirepeopleDetails1() {
  const router = useRouter();

  // Extract route params
  const { data, cat_id, customer_id, user_id, v_id } = useLocalSearchParams();

  const parsedData = data ? JSON.parse(data) : {};
  const [person, setPerson] = useState(parsedData);
  const [loading, setLoading] = useState(!parsedData.id);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState('Quick Info');

  const getImageUrl = () => {
    if (!person?.aatharimage || person.aatharimage.endsWith('/')) {
      return 'https://via.placeholder.com/300';
    }
    return person.aatharimage;
  };

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `https://veebuilds.com/mobile/professional_details.php?id=${parsedData.id}`
      );
      if (response.data?.storeList?.length) {
        setPerson(response.data.storeList[0]);
      }
    } catch (error) {
      console.error('Error fetching person details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parsedData.id && !person.mobile) {
      fetchDetails();
    }
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1789AE" />
      </View>
    );
  }

  if (!person) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No data found</Text>
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
        <Text style={styles.headerText}>Professional Details</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <Image
            source={{ uri: imgError ? 'https://via.placeholder.com/300' : getImageUrl() }}
            style={styles.logo}
            onError={() => setImgError(true)}
          />
        </View>

        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.city}>{person.city || 'Location not specified'}</Text>

        <View style={styles.ratingRow}>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={16} color="white" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>
        <Text style={styles.city}>{person.occupation || 'Professional'}</Text>
        <Text style={styles.yearofexp}>{person.yearofexp || '0'} years of experience</Text>
        <View style={styles.separator} />

        <Text style={styles.address}>Address</Text>
        <Text style={styles.addressText}>{person.address || 'Address not specified'}</Text>
        <View style={styles.separator} />

        <View style={styles.tabsContainer}>
          {['Quick Info', 'Overview', 'Photos'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'Quick Info' && (
            <>
              <Text style={styles.infoHeading}>Mobile</Text>
              <Text style={styles.infoText}>{person.mobile || 'Not specified'}</Text>

              <Text style={styles.infoHeading}>Profession</Text>
              <Text style={styles.infoText}>{person.occupation || 'Not specified'}</Text>

              <Text style={styles.infoHeading}>Years of Experience</Text>
              <Text style={styles.infoText}>{person.yearofexp || '0'} years</Text>
            </>
          )}
          {activeTab === 'Overview' && (
            <>
              <Text style={styles.infoHeading}>Cost with Material</Text>
              <Text style={styles.infoText}>₹{person.costwithmeterial || 'Not specified'}</Text>

              <Text style={styles.infoHeading}>Work Type</Text>
              <Text style={styles.infoText}>{person.worktype || 'Not specified'}</Text>
            </>
          )}
          {activeTab === 'Photos' && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: imgError ? 'https://via.placeholder.com/300' : getImageUrl() }}
                style={styles.photoImage}
                onError={() => setImgError(true)}
              />
            </View>
          )}
        </View>
      </ScrollView>

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
                cat_id,
                land_id: person.id,
                v_id: person.vendor_id || v_id || '',
                customer_id,
                user_id,
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
    marginTop: 30,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  scrollContent: {
    padding: 16,
    alignItems: 'flex-start',
    paddingBottom: 100,
  },
  box: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  city: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  yearofexp: {
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
  address: {
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
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1789AE',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 4,
  },
});






 
