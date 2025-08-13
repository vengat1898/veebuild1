// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import Checkbox from 'expo-checkbox';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useEffect, useState , useContext } from 'react';
// import { SessionContext } from '../../context/SessionContext';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// export default function Shop() {
//   const { session } = useContext(SessionContext);
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   // const { cat_id, customer_id } = params;
//   console.log('=============================================================');
//   console.log('Shop screen received params:', params);
//   console.log('=============================================================');

//   const [modalVisible, setModalVisible] = useState(false);
//   const [brandModalVisible, setBrandModalVisible] = useState(false);
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [selectedBrand, setSelectedBrand] = useState('');
//   const [vendors, setVendors] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [typeLoading, setTypeLoading] = useState(false);
//   const [brandLoading, setBrandLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedBrands, setSelectedBrands] = useState([]);
//  const { cat_id, customer_id: paramCustomerId } = params;
// const customer_id = paramCustomerId || session?.id;

//  console.log('=============================================================');
//  console.log('Final cat_id:', cat_id);
//  console.log('Final customer_id:', customer_id);
//  console.log('Session data:', session);
//  console.log('=============================================================');
 
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//          if (!cat_id) {
//         throw new Error('Missing category ID');
//       }
      
//       if (!customer_id) {
//         throw new Error('Please login to view this category');
//       }

//         setLoading(true);
        
//         // Fetch vendors
//         const vendorUrl = `https://veebuilds.com/mobile/vendor_list.php?category_id=${cat_id}&customer_id=${customer_id}`;
//         console.log('=============================================================');
//         console.log('FETCHING VENDORS');
//         console.log('Vendor URL:', vendorUrl);
//         console.log('=============================================================');
        
//         const vendorsResponse = await axios.get(vendorUrl);
        
//         console.log('=============================================================');
//         console.log('VENDOR RESPONSE');
//         console.log('Status:', vendorsResponse.status);
//         console.log('Response Data:', JSON.stringify(vendorsResponse.data, null, 2));
//         console.log('=============================================================');

//         if (vendorsResponse.data.result === 'Success') {
//           setVendors(vendorsResponse.data.storeList);
//           console.log('=============================================================');
//           console.log('VENDORS SET SUCCESSFULLY');
//           console.log('Number of vendors:', vendorsResponse.data.storeList.length);
//           console.log('=============================================================');
//         } else {
//           setError(vendorsResponse.data.text || 'Failed to fetch vendors');
//           console.log('=============================================================');
//           console.log('VENDOR FETCH FAILED');
//           console.log('Error:', vendorsResponse.data.text);
//           console.log('=============================================================');
//         }

//         // Fetch types
//         setTypeLoading(true);
//         const typesUrl = `https://veebuilds.com/mobile/type_list_customer.php?cat_id=${cat_id}&customer_id=${customer_id}`;
//         console.log('=============================================================');
//         console.log('FETCHING TYPES');
//         console.log('Types URL:', typesUrl);
//         console.log('=============================================================');
        
//         const typesResponse = await axios.get(typesUrl);
        
//         console.log('=============================================================');
//         console.log('TYPES RESPONSE');
//         console.log('Status:', typesResponse.status);
//         console.log('Response Data:', JSON.stringify(typesResponse.data, null, 2));
//         console.log('=============================================================');

//         if (typesResponse.data.result === 'Success') {
//           setTypes(typesResponse.data.storeList);
//           console.log('=============================================================');
//           console.log('TYPES SET SUCCESSFULLY');
//           console.log('Number of types:', typesResponse.data.storeList.length);
//           console.log('=============================================================');
//         } else {
//           console.log('=============================================================');
//           console.log('TYPES FETCH FAILED');
//           console.log('Error:', typesResponse.data.text);
//           console.log('=============================================================');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.log('=============================================================');
//         console.log('FETCH DATA ERROR');
//         console.log('Error message:', err.message);
//         console.log('Full error:', err);
//         console.log('=============================================================');
//       } finally {
//         setLoading(false);
//         setTypeLoading(false);
//         console.log('=============================================================');
//         console.log('FETCH DATA COMPLETED');
//         console.log('Loading set to false');
//         console.log('=============================================================');
//       }
//     };

//     fetchData();
//   }, [cat_id, customer_id]);

//   const fetchBrands = async (typeId) => {
//     try {
//       setBrandLoading(true);
//       const brandUrl = `https://veebuilds.com/mobile/brand_list_customer.php?cat_id=${cat_id}&customer_id=${customer_id}&type_id=${typeId}`;
//       console.log('=============================================================');
//       console.log('FETCHING BRANDS');
//       console.log('Brand URL:', brandUrl);
//       console.log('Type ID:', typeId);
//       console.log('=============================================================');
      
//       const response = await axios.get(brandUrl);
      
//       console.log('=============================================================');
//       console.log('BRAND RESPONSE');
//       console.log('Status:', response.status);
//       console.log('Response Data:', JSON.stringify(response.data, null, 2));
//       console.log('=============================================================');
      
//       if (response.data.result === 'Success') {
//         setBrands(response.data.storeList);
//         console.log('=============================================================');
//         console.log('BRANDS SET SUCCESSFULLY');
//         console.log('Number of brands:', response.data.storeList.length);
//         console.log('=============================================================');
//       } else {
//         console.log('=============================================================');
//         console.log('BRAND FETCH FAILED');
//         console.log('Error:', response.data.text);
//         console.log('=============================================================');
//         setBrands([]);
//       }
//     } catch (err) {
//       console.log('=============================================================');
//       console.log('FETCH BRANDS ERROR');
//       console.log('Error message:', err.message);
//       console.log('Full error:', err);
//       console.log('=============================================================');
//       setBrands([]);
//     } finally {
//       setBrandLoading(false);
//       console.log('=============================================================');
//       console.log('FETCH BRANDS COMPLETED');
//       console.log('Brand loading set to false');
//       console.log('=============================================================');
//     }
//   };

//   const toggleTypeSelection = (typeId) => {
//     setSelectedTypes(prev => {
//       const newSelection = prev.includes(typeId) 
//         ? prev.filter(id => id !== typeId)
//         : [...prev, typeId];
      
//       console.log('=============================================================');
//       console.log('TYPE SELECTION TOGGLED');
//       console.log('Type ID:', typeId);
//       console.log('Previous selection:', prev);
//       console.log('New selection:', newSelection);
//       console.log('=============================================================');
      
//       return newSelection;
//     });
//   };

//   const toggleBrandSelection = (brandId) => {
//     setSelectedBrands((prev) => {
//       const newSelection = prev.includes(brandId)
//         ? prev.filter((id) => id !== brandId)
//         : [...prev, brandId];
        
//       console.log('=============================================================');
//       console.log('BRAND SELECTION TOGGLED');
//       console.log('Brand ID:', brandId);
//       console.log('Previous selection:', prev);
//       console.log('New selection:', newSelection);
//       console.log('=============================================================');
      
//       return newSelection;
//     });
//   };

//   const applyTypeFilter = async () => {
//     setModalVisible(false);
//     setLoading(true);
    
//     console.log('=============================================================');
//     console.log('APPLYING TYPE FILTER');
//     console.log('Selected types:', selectedTypes);
//     console.log('Selected brands:', selectedBrands);
//     console.log('=============================================================');

//     try {
//       const typeQuery = selectedTypes.join(',');
//       const brandQuery = selectedBrands.join(',');

//       const apiUrl = `https://veebuilds.com/mobile/vendor_list.php?category_id=${cat_id}&customer_id=${customer_id}&type_id=${typeQuery}&brand=${brandQuery}`;

//       console.log('=============================================================');
//       console.log('TYPE FILTER API CALL');
//       console.log('API URL:', apiUrl);
//       console.log('Type Query:', typeQuery);
//       console.log('Brand Query:', brandQuery);
//       console.log('=============================================================');

//       const response = await axios.get(apiUrl);

//       console.log('=============================================================');
//       console.log('TYPE FILTER RESPONSE');
//       console.log('Status:', response.status);
//       console.log('Response Data:', JSON.stringify(response.data, null, 2));
//       console.log('=============================================================');

//       if (response.data.result === 'Success') {
//         setVendors(response.data.storeList);
//         console.log('=============================================================');
//         console.log('TYPE FILTER APPLIED SUCCESSFULLY');
//         console.log('Number of vendors after filter:', response.data.storeList.length);
//         console.log('=============================================================');
//       } else {
//         setVendors([]);
//         console.log('=============================================================');
//         console.log('TYPE FILTER NO RESULTS');
//         console.log('Setting vendors to empty array');
//         console.log('=============================================================');
//         Alert.alert('No vendors found for selected filters.');
//       }
//     } catch (error) {
//       console.log('=============================================================');
//       console.log('TYPE FILTER ERROR');
//       console.log('Error message:', error.message);
//       console.log('Full error:', error);
//       console.log('=============================================================');
//       Alert.alert('Error', 'Failed to apply filter.');
//     } finally {
//       setLoading(false);
//       console.log('=============================================================');
//       console.log('TYPE FILTER COMPLETED');
//       console.log('Loading set to false');
//       console.log('=============================================================');
//     }
//   };

//   const clearTypeFilter = () => {
//     console.log('=============================================================');
//     console.log('CLEARING TYPE FILTER');
//     console.log('Previous selected types:', selectedTypes);
//     console.log('=============================================================');
    
//     setSelectedTypes([]);
//     setModalVisible(false);
    
//     console.log('=============================================================');
//     console.log('TYPE FILTER CLEARED');
//     console.log('Selected types reset to empty array');
//     console.log('Modal closed');
//     console.log('=============================================================');
//   };

//   const handleBrandModalOpen = async () => {
//     console.log('=============================================================');
//     console.log('OPENING BRAND MODAL');
//     console.log('Selected types:', selectedTypes);
//     console.log('First selected type ID:', selectedTypes[0]);
//     console.log('=============================================================');
    
//     await fetchBrands(selectedTypes[0]);
//     setBrandModalVisible(true);
    
//     console.log('=============================================================');
//     console.log('BRAND MODAL OPENED');
//     console.log('=============================================================');
//   };

//   const applyBrandFilter = async () => {
//     try {
//       setBrandModalVisible(false);
//       setLoading(true);
      
//       console.log('=============================================================');
//       console.log('APPLYING BRAND FILTER');
//       console.log('Selected brands:', selectedBrands);
//       console.log('=============================================================');

//       const brandIds = selectedBrands.join(',');
//       const apiUrl = `https://veebuilds.com/mobile/type_list_customer_new.php?cat_id=${cat_id}&customer_id=${customer_id}&brand_id=[${brandIds}]`;
      
//       console.log('=============================================================');
//       console.log('BRAND FILTER API CALL');
//       console.log('API URL:', apiUrl);
//       console.log('Brand IDs:', brandIds);
//       console.log('=============================================================');
      
//       const response = await axios.get(apiUrl);

//       console.log('=============================================================');
//       console.log('BRAND FILTER RESPONSE');
//       console.log('Status:', response.status);
//       console.log('Response Data:', JSON.stringify(response.data, null, 2));
//       console.log('=============================================================');

//       if (response.data.storeList && response.data.storeList.length > 0) {
//         console.log('=============================================================');
//         console.log('BRAND FILTER SUCCESS');
//         console.log('Number of results:', response.data.storeList.length);
//         console.log('=============================================================');
//         Alert.alert('Success', 'Brand filter applied successfully');
//       } else {
//         console.log('=============================================================');
//         console.log('BRAND FILTER NO RESULTS');
//         console.log('Store list empty or undefined');
//         console.log('=============================================================');
//         Alert.alert('No Results', 'No products found for selected brands');
//       }
//     } catch (error) {
//       console.log('=============================================================');
//       console.log('BRAND FILTER ERROR');
//       console.log('Error message:', error.message);
//       console.log('Full error:', error);
//       console.log('=============================================================');
//       Alert.alert('Error', 'Failed to apply brand filter');
//     } finally {
//       setLoading(false);
//       console.log('=============================================================');
//       console.log('BRAND FILTER COMPLETED');
//       console.log('Loading set to false');
//       console.log('=============================================================');
//     }
//   };

//   const renderCard = ({ item }) => {
//     console.log('=============================================================');
//     console.log('RENDERING CARD');
//     console.log('Item data:', JSON.stringify(item, null, 2));
//     console.log('=============================================================');
    
//     return (
//       <View style={styles.card}>
//         <View style={styles.cardContent}>
//           <Image
//             source={item.shop_image ? { uri: item.shop_image } : require('../../assets/images/veebuilder.png')}
//             style={styles.logo}
//           />
//           <View style={styles.textGroupContainer}>
//             <TouchableOpacity
//               onPress={() => {
//                 console.log('=============================================================');
//                 console.log('NAVIGATING TO SHOP DETAILS');
//                 console.log('Vendor ID:', item.id);
//                 console.log('Navigation params:', {
//                   vendor_id: item.id,
//                   cat_id,
//                   customer_id,
//                   shopName: item.name,
//                   shopImage: item.shop_image,
//                   mobile: item.mobile,
//                   whatsapp: item.whatsapp,
//                   email: item.email,
//                   experience: item.yera_of_exp,
//                   location: item.location,
//                   city: item.city,
//                   state: item.state,
//                   country: item.country,
//                   rattings: item.rattings,
//                   enquery: item.enquery
//                 });
//                 console.log('=============================================================');
                
//                 router.push({
//                   pathname: '/components/Shopdetails',
//                   params: { 
//                     vendor_id: item.id,
//                     cat_id,
//                     customer_id,
//                     shopName: item.name,
//                     shopImage: item.shop_image,
//                     mobile: item.mobile,
//                     whatsapp: item.whatsapp,
//                     email: item.email,
//                     experience: item.yera_of_exp,
//                     location: item.location,
//                     city: item.city,
//                     state: item.state,
//                     country: item.country,
//                     rattings: item.rattings,
//                     enquery: item.enquery
//                   }
//                 });
//               }}
//               style={styles.cardTextContainer}
//             >
//               <View style={styles.textGroup}>
//                 <Text style={styles.title}>{item.name}</Text>
//                 <Text style={styles.subText}>{item.distance} km away</Text>
//                 <Text style={styles.subText}>{item.city}</Text>
//                 <Text style={styles.subText}>{item.yera_of_exp} years in business</Text>
//                 <Text style={styles.subText}>{item.enquery} enquiries answered</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={styles.button} onPress={() => {
//             console.log('=============================================================');
//             console.log('CALL BUTTON PRESSED');
//             console.log('Mobile number:', item.mobile);
//             console.log('=============================================================');
            
//             if (item.mobile) {
//               Alert.alert('Call', `Would you like to call ${item.mobile}?`);
//             } else {
//               Alert.alert('No phone number available');
//             }
//           }}>
//             <Ionicons name="call" size={16} color="white" style={styles.icon} />
//             <Text style={styles.buttonText}>Call</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.button} 
//             onPress={() => {
//               console.log('=============================================================');
//               console.log('ENQUIRY BUTTON PRESSED');
//               console.log('Navigation params:', { cat_id, customer_id });
//               console.log('=============================================================');
              
//               router.push({
//                 pathname: '/components/Enquiry',
//                 params: { cat_id, customer_id,vendor_id: item.id,shop_name: item.name, }
//               });
//             }}
//           >
//             <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
//             <Text style={styles.buttonText}>Enquiry</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.button} onPress={() => {
//             console.log('=============================================================');
//             console.log('WHATSAPP BUTTON PRESSED');
//             console.log('WhatsApp number:', item.whatsapp);
//             console.log('=============================================================');
            
//             if (item.whatsapp) {
//               Alert.alert('WhatsApp', `Would you like to message ${item.whatsapp}?`);
//             } else {
//               Alert.alert('No WhatsApp number available');
//             }
//           }}>
//             <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
//             <Text style={styles.buttonText}>WhatsApp</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     console.log('=============================================================');
//     console.log('LOADING STATE ACTIVE');
//     console.log('=============================================================');
    
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#1789AE" style={styles.loader} />
//       </View>
//     );
//   }

//   if (error) {
//     console.log('=============================================================');
//     console.log('ERROR STATE ACTIVE');
//     console.log('Error:', error);
//     console.log('=============================================================');
    
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Text>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   console.log('=============================================================');
//   console.log('RENDERING MAIN COMPONENT');
//   console.log('Vendors count:', vendors.length);
//   console.log('Types count:', types.length);
//   console.log('Selected types:', selectedTypes);
//   console.log('Selected brands:', selectedBrands);
//   console.log('=============================================================');

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Shop</Text>
//       </View>

//       <TouchableOpacity onPress={() => router.push('/components/Search')}>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search"
//             placeholderTextColor="#888"
//             editable={false}
//             pointerEvents="none"
//           />
//         </View>
//       </TouchableOpacity>

//       <View style={styles.dropdownRow}>
//         <TouchableOpacity 
//           onPress={() => {
//             console.log('=============================================================');
//             console.log('TYPE DROPDOWN PRESSED');
//             console.log('Opening type modal');
//             console.log('=============================================================');
//             setModalVisible(true);
//           }} 
//           style={styles.dropdownContainer}
//         >
//           <Ionicons name="list" size={20} color="#888" style={styles.dropdownIcon} />
//           <Text style={styles.dropdownText}>
//             {selectedTypes.length > 0 
//               ? `${selectedTypes.length} selected` 
//               : 'Type'}
//           </Text>
//           <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
//         </TouchableOpacity>

//         <TouchableOpacity 
//           onPress={() => {
//             console.log('=============================================================');
//             console.log('BRAND DROPDOWN PRESSED');
//             console.log('Opening brand modal');
//             console.log('=============================================================');
//             handleBrandModalOpen();
//           }} 
//           style={styles.dropdownContainer}
//         >
//           <Ionicons name="pricetag" size={20} color="#888" style={styles.dropdownIcon} />
//           <Text style={styles.dropdownText}>{selectedBrand || 'Brand'}</Text>
//           <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
//         </TouchableOpacity>
//       </View>

//       {vendors.length > 0 ? (
//         <FlatList
//           data={vendors}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderCard}
//           contentContainerStyle={{ paddingBottom: 20 }}
//         />
//       ) : (
//         <View style={styles.noResults}>
//           <Text>No vendors found for this category</Text>
//         </View>
//       )}

//       {/* Types Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Select Types</Text>
            
//             {typeLoading ? (
//               <ActivityIndicator size="large" color="#1789AE" />
//             ) : (
//               <ScrollView style={styles.modalScrollView}>
//                 {types.map((type) => (
//                   <View key={type.id} style={styles.checkboxContainer}>
//                     <Checkbox
//                       value={selectedTypes.includes(type.id)}
//                       onValueChange={() => toggleTypeSelection(type.id)}
//                       color={selectedTypes.includes(type.id) ? '#1789AE' : undefined}
//                     />
//                     <Text style={styles.checkboxLabel}>{type.title}</Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             )}
            
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity 
//                 onPress={clearTypeFilter} 
//                 style={[styles.modalButton, styles.clearButton]}
//               >
//                 <Text style={styles.modalButtonText}>Clear</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 onPress={applyTypeFilter} 
//                 style={[styles.modalButton, styles.applyButton]}
//               >
//                 <Text style={styles.modalButtonText1}>Apply</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Brand Modal */}
//       <Modal visible={brandModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Select Brand</Text>
            
//             {brandLoading ? (
//               <ActivityIndicator size="large" color="#1789AE" />
//             ) : brands.length > 0 ? (
//               <FlatList
//                 data={brands}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item }) => {
//                   const isSelected = selectedBrands.includes(item.id);
//                   return (
//                     <View style={styles.brandOption}>
//                       <Checkbox
//                         value={isSelected}
//                         onValueChange={() => toggleBrandSelection(item.id)}
//                         color={isSelected ? '#1789AE' : undefined}
//                       />
//                       <Image 
//                         source={{ uri: item.image }} 
//                         style={styles.brandImage} 
//                         resizeMode="contain"
//                       />
//                       <Text style={styles.brandText}>{item.title}</Text>
//                     </View>
//                   );
//                 }}
//               />
//             ) : (
//               <Text style={styles.noBrandsText}>No brands available for selected type</Text>
//             )}

//             <TouchableOpacity
//               onPress={applyBrandFilter}
//               style={styles.modalConfirmButton}
//             >
//               <Text style={styles.modalConfirmText}>Apply</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#fff' 
//   },
//   header: {
//     height: 120,
//     paddingTop: 20,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1789AE',
//   },
//   backButton: { 
//     marginRight: 10 
//   },
//   headerText: { 
//     color: 'white', 
//     fontSize: 20, 
//     fontWeight: 'bold' 
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     borderWidth: 0.2,
//     alignItems: 'center',
//     backgroundColor: '#F1F1F1',
//     margin: 16,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//   },
//   searchIcon: { 
//     marginRight: 8 
//   },
//   searchInput: { 
//     flex: 1, 
//     height: 40, 
//     color: '#000' 
//   },
//   dropdownRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 16,
//     marginBottom: 14,
//   },
//   dropdownContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 0.2,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     height: 50,
//     width: '48%',
//   },
//   dropdownIcon: { 
//     marginRight: 8 
//   },
//   dropdownText: { 
//     flex: 1, 
//     color: '#000', 
//     fontSize: 10 
//   },
//   dropdownArrow: { 
//     marginRight: 8 
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 16,
//     margin: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//     minHeight: 250,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   logo: {
//     width: '40%',
//     height: 150,
//     resizeMode: 'contain',
//     backgroundColor: "#f0f0f0",
//   },
//   textGroupContainer: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   textGroup: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     gap: 8,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 15,
//     color: '#333',
//     textAlign: 'left',
//   },
//   subText: {
//     fontSize: 12,
//     color: '#555',
//     textAlign: 'left',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginTop: 'auto',
//     paddingTop: 16,
//     gap: 8,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1789AE',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 10,
//     flex: 1,
//     minHeight: 40,
//     maxWidth: '32%',
//   },
//   buttonText: { 
//     color: 'white', 
//     fontSize: 10, 
//     fontWeight: 'bold',
//     marginLeft: 4
//   },
//   icon: { 
//     // Removed marginRight to use marginLeft in buttonText instead
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: '100%',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '90%',
//   },
//   modalScrollView: {
//     maxHeight: '80%',
//     marginBottom: 16,
//   },
//   modalTitle: { 
//     fontSize: 20, 
//     fontWeight: 'bold', 
//     marginBottom: 12,
//     color: '#1789AE',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     gap: 20
//   },
//   checkboxLabel: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//     flex: 1
//   },
//   modalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//     gap: 16,
//   },
//   modalButton: {
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     flex: 1,
//   },
//   clearButton: {
//     backgroundColor: '#f1f1f1',
//   },
//   applyButton: {
//     backgroundColor: '#1789AE',
//   },
//   modalButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1789AE',
//   },
//   modalButtonText1: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   brandOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   brandImage: {
//     width: 50,
//     height: 50,
//     marginRight: 12,
//     marginLeft: 12,
//   },
//   brandText: {
//     fontSize: 16,
//     color: '#333',
//     flex: 1,
//   },
//   noBrandsText: {
//     textAlign: 'center',
//     paddingVertical: 20,
//     color: '#888',
//   },
//   modalCloseButton: { 
//     paddingVertical: 12, 
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   modalCloseText: { 
//     fontSize: 16, 
//     color: '#1789AE',
//     fontWeight: 'bold',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   noResults: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalConfirmButton: {
//     backgroundColor: '#1789AE',
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     marginTop: 10,
//   },
//   modalConfirmText: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: 'bold',
//   }  
// });



import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState , useContext } from 'react';
import { SessionContext } from '../../context/SessionContext';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Shop() {
  const { session } = useContext(SessionContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('=============================================================');
  console.log('Shop screen received params:', params);
  console.log('=============================================================');

  const [modalVisible, setModalVisible] = useState(false);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [vendors, setVendors] = useState([]);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeLoading, setTypeLoading] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { cat_id, customer_id: paramCustomerId } = params;
  const customer_id = paramCustomerId || session?.id;

  console.log('=============================================================');
  console.log('Final cat_id:', cat_id);
  console.log('Final customer_id:', customer_id);
  console.log('Session data:', session);
  console.log('=============================================================');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!cat_id) {
          throw new Error('Missing category ID');
        }
        
        if (!customer_id) {
          throw new Error('Please login to view this category');
        }

        setLoading(true);
        
        // Fetch vendors
        const vendorUrl = `https://veebuilds.com/mobile/vendor_list.php?category_id=${cat_id}&customer_id=${customer_id}`;
        console.log('=============================================================');
        console.log('FETCHING VENDORS');
        console.log('Vendor URL:', vendorUrl);
        console.log('=============================================================');
        
        const vendorsResponse = await axios.get(vendorUrl);
        
        console.log('=============================================================');
        console.log('VENDOR RESPONSE');
        console.log('Status:', vendorsResponse.status);
        console.log('Response Data:', JSON.stringify(vendorsResponse.data, null, 2));
        console.log('=============================================================');

        if (vendorsResponse.data.result === 'Success') {
          setVendors(vendorsResponse.data.storeList);
          console.log('=============================================================');
          console.log('VENDORS SET SUCCESSFULLY');
          console.log('Number of vendors:', vendorsResponse.data.storeList.length);
          console.log('=============================================================');
        } else {
          setError(vendorsResponse.data.text || 'Failed to fetch vendors');
          console.log('=============================================================');
          console.log('VENDOR FETCH FAILED');
          console.log('Error:', vendorsResponse.data.text);
          console.log('=============================================================');
        }

        // Fetch types
        setTypeLoading(true);
        const typesUrl = `https://veebuilds.com/mobile/type_list_customer.php?cat_id=${cat_id}&customer_id=${customer_id}`;
        console.log('=============================================================');
        console.log('FETCHING TYPES');
        console.log('Types URL:', typesUrl);
        console.log('=============================================================');
        
        const typesResponse = await axios.get(typesUrl);
        
        console.log('=============================================================');
        console.log('TYPES RESPONSE');
        console.log('Status:', typesResponse.status);
        console.log('Response Data:', JSON.stringify(typesResponse.data, null, 2));
        console.log('=============================================================');

        if (typesResponse.data.result === 'Success') {
          setTypes(typesResponse.data.storeList);
          console.log('=============================================================');
          console.log('TYPES SET SUCCESSFULLY');
          console.log('Number of types:', typesResponse.data.storeList.length);
          console.log('=============================================================');
        } else {
          console.log('=============================================================');
          console.log('TYPES FETCH FAILED');
          console.log('Error:', typesResponse.data.text);
          console.log('=============================================================');
        }
      } catch (err) {
        setError(err.message);
        console.log('=============================================================');
        console.log('FETCH DATA ERROR');
        console.log('Error message:', err.message);
        console.log('Full error:', err);
        console.log('=============================================================');
      } finally {
        setLoading(false);
        setTypeLoading(false);
        console.log('=============================================================');
        console.log('FETCH DATA COMPLETED');
        console.log('Loading set to false');
        console.log('=============================================================');
      }
    };

    fetchData();
  }, [cat_id, customer_id]);

  const fetchBrands = async (typeId) => {
    try {
      setBrandLoading(true);
      const brandUrl = `https://veebuilds.com/mobile/brand_list_customer.php?cat_id=${cat_id}&customer_id=${customer_id}&type_id=${typeId}`;
      console.log('=============================================================');
      console.log('FETCHING BRANDS');
      console.log('Brand URL:', brandUrl);
      console.log('Type ID:', typeId);
      console.log('=============================================================');
      
      const response = await axios.get(brandUrl);
      
      console.log('=============================================================');
      console.log('BRAND RESPONSE');
      console.log('Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      console.log('=============================================================');
      
      if (response.data.result === 'Success') {
        setBrands(response.data.storeList);
        console.log('=============================================================');
        console.log('BRANDS SET SUCCESSFULLY');
        console.log('Number of brands:', response.data.storeList.length);
        console.log('=============================================================');
      } else {
        console.log('=============================================================');
        console.log('BRAND FETCH FAILED');
        console.log('Error:', response.data.text);
        console.log('=============================================================');
        setBrands([]);
      }
    } catch (err) {
      console.log('=============================================================');
      console.log('FETCH BRANDS ERROR');
      console.log('Error message:', err.message);
      console.log('Full error:', err);
      console.log('=============================================================');
      setBrands([]);
    } finally {
      setBrandLoading(false);
      console.log('=============================================================');
      console.log('FETCH BRANDS COMPLETED');
      console.log('Brand loading set to false');
      console.log('=============================================================');
    }
  };

  const toggleTypeSelection = (typeId) => {
    setSelectedTypes(prev => {
      const newSelection = prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId];
      
      console.log('=============================================================');
      console.log('TYPE SELECTION TOGGLED');
      console.log('Type ID:', typeId);
      console.log('Previous selection:', prev);
      console.log('New selection:', newSelection);
      console.log('=============================================================');
      
      return newSelection;
    });
  };

  const toggleBrandSelection = (brandId) => {
    setSelectedBrands((prev) => {
      const newSelection = prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId];
        
      console.log('=============================================================');
      console.log('BRAND SELECTION TOGGLED');
      console.log('Brand ID:', brandId);
      console.log('Previous selection:', prev);
      console.log('New selection:', newSelection);
      console.log('=============================================================');
      
      return newSelection;
    });
  };

  const applyTypeFilter = async () => {
    setModalVisible(false);
    setLoading(true);
    
    console.log('=============================================================');
    console.log('APPLYING TYPE FILTER');
    console.log('Selected types:', selectedTypes);
    console.log('Selected brands:', selectedBrands);
    console.log('=============================================================');

    try {
      const typeQuery = selectedTypes.join(',');
      const brandQuery = selectedBrands.join(',');

      const apiUrl = `https://veebuilds.com/mobile/vendor_list.php?category_id=${cat_id}&customer_id=${customer_id}&type_id=${typeQuery}&brand=${brandQuery}`;

      console.log('=============================================================');
      console.log('TYPE FILTER API CALL');
      console.log('API URL:', apiUrl);
      console.log('Type Query:', typeQuery);
      console.log('Brand Query:', brandQuery);
      console.log('=============================================================');

      const response = await axios.get(apiUrl);

      console.log('=============================================================');
      console.log('TYPE FILTER RESPONSE');
      console.log('Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      console.log('=============================================================');

      if (response.data.result === 'Success') {
        setVendors(response.data.storeList);
        console.log('=============================================================');
        console.log('TYPE FILTER APPLIED SUCCESSFULLY');
        console.log('Number of vendors after filter:', response.data.storeList.length);
        console.log('=============================================================');
      } else {
        setVendors([]);
        console.log('=============================================================');
        console.log('TYPE FILTER NO RESULTS');
        console.log('Setting vendors to empty array');
        console.log('=============================================================');
        Alert.alert('No vendors found for selected filters.');
      }
    } catch (error) {
      console.log('=============================================================');
      console.log('TYPE FILTER ERROR');
      console.log('Error message:', error.message);
      console.log('Full error:', error);
      console.log('=============================================================');
      Alert.alert('Error', 'Failed to apply filter.');
    } finally {
      setLoading(false);
      console.log('=============================================================');
      console.log('TYPE FILTER COMPLETED');
      console.log('Loading set to false');
      console.log('=============================================================');
    }
  };

  const clearTypeFilter = () => {
    console.log('=============================================================');
    console.log('CLEARING TYPE FILTER');
    console.log('Previous selected types:', selectedTypes);
    console.log('=============================================================');
    
    setSelectedTypes([]);
    setModalVisible(false);
    
    console.log('=============================================================');
    console.log('TYPE FILTER CLEARED');
    console.log('Selected types reset to empty array');
    console.log('Modal closed');
    console.log('=============================================================');
  };

  const handleBrandModalOpen = async () => {
    console.log('=============================================================');
    console.log('OPENING BRAND MODAL');
    console.log('Selected types:', selectedTypes);
    console.log('First selected type ID:', selectedTypes[0]);
    console.log('=============================================================');
    
    await fetchBrands(selectedTypes[0]);
    setBrandModalVisible(true);
    
    console.log('=============================================================');
    console.log('BRAND MODAL OPENED');
    console.log('=============================================================');
  };

  const applyBrandFilter = async () => {
    try {
      setBrandModalVisible(false);
      setLoading(true);
      
      console.log('=============================================================');
      console.log('APPLYING BRAND FILTER');
      console.log('Selected brands:', selectedBrands);
      console.log('=============================================================');

      const brandIds = selectedBrands.join(',');
      const apiUrl = `https://veebuilds.com/mobile/type_list_customer_new.php?cat_id=${cat_id}&customer_id=${customer_id}&brand_id=[${brandIds}]`;
      
      console.log('=============================================================');
      console.log('BRAND FILTER API CALL');
      console.log('API URL:', apiUrl);
      console.log('Brand IDs:', brandIds);
      console.log('=============================================================');
      
      const response = await axios.get(apiUrl);

      console.log('=============================================================');
      console.log('BRAND FILTER RESPONSE');
      console.log('Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      console.log('=============================================================');

      if (response.data.storeList && response.data.storeList.length > 0) {
        console.log('=============================================================');
        console.log('BRAND FILTER SUCCESS');
        console.log('Number of results:', response.data.storeList.length);
        console.log('=============================================================');
        Alert.alert('Success', 'Brand filter applied successfully');
      } else {
        console.log('=============================================================');
        console.log('BRAND FILTER NO RESULTS');
        console.log('Store list empty or undefined');
        console.log('=============================================================');
        Alert.alert('No Results', 'No products found for selected brands');
      }
    } catch (error) {
      console.log('=============================================================');
      console.log('BRAND FILTER ERROR');
      console.log('Error message:', error.message);
      console.log('Full error:', error);
      console.log('=============================================================');
      Alert.alert('Error', 'Failed to apply brand filter');
    } finally {
      setLoading(false);
      console.log('=============================================================');
      console.log('BRAND FILTER COMPLETED');
      console.log('Loading set to false');
      console.log('=============================================================');
    }
  };

  const renderCard = ({ item }) => {
    console.log('=============================================================');
    console.log('RENDERING CARD');
    console.log('Item data:', JSON.stringify(item, null, 2));
    console.log('=============================================================');
    
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={item.shop_image ? { uri: item.shop_image } : require('../../assets/images/veebuilder.png')}
            style={styles.logo}
          />
          <View style={styles.textGroupContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log('=============================================================');
                console.log('NAVIGATING TO SHOP DETAILS');
                console.log('Vendor ID:', item.id);
                console.log('Navigation params:', {
                  vendor_id: item.id,
                  cat_id,
                  customer_id,
                  shopName: item.name,
                  shopImage: item.shop_image,
                  mobile: item.mobile,
                  whatsapp: item.whatsapp,
                  email: item.email,
                  experience: item.yera_of_exp,
                  location: item.location,
                  city: item.city,
                  state: item.state,
                  country: item.country,
                  rattings: item.rattings,
                  enquery: item.enquery
                });
                console.log('=============================================================');
                
                router.push({
                  pathname: '/components/Shopdetails',
                  params: { 
                    vendor_id: item.id,
                    cat_id,
                    customer_id,
                    shopName: item.name,
                    shopImage: item.shop_image,
                    mobile: item.mobile,
                    whatsapp: item.whatsapp,
                    email: item.email,
                    experience: item.yera_of_exp,
                    location: item.location,
                    city: item.city,
                    state: item.state,
                    country: item.country,
                    rattings: item.rattings,
                    enquery: item.enquery
                  }
                });
              }}
              style={styles.cardTextContainer}
            >
              <View style={styles.textGroup}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subText}>{item.distance} km away</Text>
                <Text style={styles.subText}>{item.city}</Text>
                <Text style={styles.subText}>{item.yera_of_exp} years in business</Text>
                <Text style={styles.subText}>{item.enquery} enquiries answered</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => {
            console.log('=============================================================');
            console.log('CALL BUTTON PRESSED');
            console.log('Mobile number:', item.mobile);
            console.log('=============================================================');
            
            if (item.mobile) {
              Alert.alert('Call', `Would you like to call ${item.mobile}?`);
            } else {
              Alert.alert('No phone number available');
            }
          }}>
            <Ionicons name="call" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              console.log('=============================================================');
              console.log('ENQUIRY BUTTON PRESSED');
              console.log('Navigation params:', { cat_id, customer_id });
              console.log('=============================================================');
              
              router.push({
                pathname: '/components/Enquiry',
                params: { cat_id, customer_id, vendor_id: item.id, shop_name: item.name }
              });
            }}
          >
            <Ionicons name="information-circle" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Enquiry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => {
            console.log('=============================================================');
            console.log('WHATSAPP BUTTON PRESSED');
            console.log('WhatsApp number:', item.whatsapp);
            console.log('=============================================================');
            
            if (item.whatsapp) {
              Alert.alert('WhatsApp', `Would you like to message ${item.whatsapp}?`);
            } else {
              Alert.alert('No WhatsApp number available');
            }
          }}>
            <Ionicons name="logo-whatsapp" size={16} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    console.log('=============================================================');
    console.log('LOADING STATE ACTIVE');
    console.log('=============================================================');
    
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1789AE" style={styles.loader} />
      </View>
    );
  }

  if (error) {
    console.log('=============================================================');
    console.log('ERROR STATE ACTIVE');
    console.log('Error:', error);
    console.log('=============================================================');
    
    return (
      <View style={styles.container}>
        {/* Same header as in the main component */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Shop</Text>
        </View>

        {/* Error content */}
        <View style={styles.errorContent}>
          <Ionicons name="warning" size={48} color="#D32F2F" style={styles.errorIcon} />
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorDetail}>The requested resource could not be found.</Text>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  console.log('=============================================================');
  console.log('RENDERING MAIN COMPONENT');
  console.log('Vendors count:', vendors.length);
  console.log('Types count:', types.length);
  console.log('Selected types:', selectedTypes);
  console.log('Selected brands:', selectedBrands);
  console.log('=============================================================');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Shop</Text>
      </View>

      <TouchableOpacity onPress={() => router.push('/components/Search')}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            editable={false}
            pointerEvents="none"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.dropdownRow}>
        <TouchableOpacity 
          onPress={() => {
            console.log('=============================================================');
            console.log('TYPE DROPDOWN PRESSED');
            console.log('Opening type modal');
            console.log('=============================================================');
            setModalVisible(true);
          }} 
          style={styles.dropdownContainer}
        >
          <Ionicons name="list" size={20} color="#888" style={styles.dropdownIcon} />
          <Text style={styles.dropdownText}>
            {selectedTypes.length > 0 
              ? `${selectedTypes.length} selected` 
              : 'Type'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {
            console.log('=============================================================');
            console.log('BRAND DROPDOWN PRESSED');
            console.log('Opening brand modal');
            console.log('=============================================================');
            handleBrandModalOpen();
          }} 
          style={styles.dropdownContainer}
        >
          <Ionicons name="pricetag" size={20} color="#888" style={styles.dropdownIcon} />
          <Text style={styles.dropdownText}>{selectedBrand || 'Brand'}</Text>
          <Ionicons name="chevron-down" size={20} color="#888" style={styles.dropdownArrow} />
        </TouchableOpacity>
      </View>

      {vendors.length > 0 ? (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.noResults}>
          <Text>No vendors found for this category</Text>
        </View>
      )}

      {/* Types Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Types</Text>
            
            {typeLoading ? (
              <ActivityIndicator size="large" color="#1789AE" />
            ) : (
              <ScrollView style={styles.modalScrollView}>
                {types.map((type) => (
                  <View key={type.id} style={styles.checkboxContainer}>
                    <Checkbox
                      value={selectedTypes.includes(type.id)}
                      onValueChange={() => toggleTypeSelection(type.id)}
                      color={selectedTypes.includes(type.id) ? '#1789AE' : undefined}
                    />
                    <Text style={styles.checkboxLabel}>{type.title}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                onPress={clearTypeFilter} 
                style={[styles.modalButton, styles.clearButton]}
              >
                <Text style={styles.modalButtonText}>Clear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={applyTypeFilter} 
                style={[styles.modalButton, styles.applyButton]}
              >
                <Text style={styles.modalButtonText1}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Brand Modal */}
      <Modal visible={brandModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Brand</Text>
            
            {brandLoading ? (
              <ActivityIndicator size="large" color="#1789AE" />
            ) : brands.length > 0 ? (
              <FlatList
                data={brands}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = selectedBrands.includes(item.id);
                  return (
                    <View style={styles.brandOption}>
                      <Checkbox
                        value={isSelected}
                        onValueChange={() => toggleBrandSelection(item.id)}
                        color={isSelected ? '#1789AE' : undefined}
                      />
                      <Image 
                        source={{ uri: item.image }} 
                        style={styles.brandImage} 
                        resizeMode="contain"
                      />
                      <Text style={styles.brandText}>{item.title}</Text>
                    </View>
                  );
                }}
              />
            ) : (
              <Text style={styles.noBrandsText}>No brands available for selected type</Text>
            )}

            <TouchableOpacity
              onPress={applyBrandFilter}
              style={styles.modalConfirmButton}
            >
              <Text style={styles.modalConfirmText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
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
    marginRight: 10 
  },
  headerText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 0.2,
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  searchIcon: { 
    marginRight: 8 
  },
  searchInput: { 
    flex: 1, 
    height: 40, 
    color: '#000' 
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 4,
    height: 50,
    width: '48%',
  },
  dropdownIcon: { 
    marginRight: 8 
  },
  dropdownText: { 
    flex: 1, 
    color: '#000', 
    fontSize: 10 
  },
  dropdownArrow: { 
    marginRight: 8 
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
    resizeMode: 'contain',
    backgroundColor: "#f0f0f0",
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
    borderRadius: 4,
    flex: 1,
    minHeight: 40,
    maxWidth: '32%',
  },
  buttonText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold',
    marginLeft: 4
  },
  icon: { 
    // Removed marginRight to use marginLeft in buttonText instead
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalScrollView: {
    maxHeight: '80%',
    marginBottom: 16,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 12,
    color: '#1789AE',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 20
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#f1f1f1',
  },
  applyButton: {
    backgroundColor: '#1789AE',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1789AE',
  },
  modalButtonText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  brandOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  brandImage: {
    width: 50,
    height: 50,
    marginRight: 12,
    marginLeft: 12,
  },
  brandText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  noBrandsText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#888',
  },
  modalCloseButton: { 
    paddingVertical: 12, 
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: { 
    fontSize: 16, 
    color: '#1789AE',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmButton: {
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  modalConfirmText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Error styles
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -40, // Adjust this if needed based on your header height
  },
  errorIcon: {
    marginBottom: 20
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetail: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  errorButton: {
    backgroundColor: '#1789AE',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});


 




