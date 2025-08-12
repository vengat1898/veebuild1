// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   FlatList,
//   Dimensions,
//   Alert
// } from 'react-native';
// import * as Location from 'expo-location';
// import React, { useState, useRef, useEffect,useContext} from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { SessionContext } from '../../context/SessionContext';


// // Images
// import hot_enqiury from '../../assets/images/hot_enqiury.jpg';
// import hire_people from '../../assets/images/hire_people.jpg';
// import material from '../../assets/images/material.jpg';
// import real_estate_new from '../../assets/images/real_estate_new.jpg';
// import image_1 from '../../assets/images/image_1.jpg';
// import image_2 from '../../assets/images/image_2.jpg';
// import image_3 from '../../assets/images/image_3.jpg';
// import image_4 from '../../assets/images/image_4.jpg';
// import image_5 from '../../assets/images/image_5.jpg';
// import image_6 from '../../assets/images/image_6.jpg';
// import image_7 from '../../assets/images/image_7.jpg';

// import hot_enqiury1 from '../../assets/images/hot-enqiury-15.gif';

// import most1 from '../../assets/images/most1.jpg';
// import most2 from '../../assets/images/most2.jpg';
// import most3 from '../../assets/images/most3.jpg';
// import most4 from '../../assets/images/most4.jpg';
// import most5 from '../../assets/images/most5.jpg';
// import most6 from '../../assets/images/most6.jpg';
// import most7 from '../../assets/images/most7.jpg';
// import trending1 from '../../assets/images/trending1.jpg';
// import trending2 from '../../assets/images/trending2.jpg';
// import trending3 from '../../assets/images/trending3.jpg';
// import trending4 from '../../assets/images/trending4.jpg';
// import trending5 from '../../assets/images/trending5.jpg';
// import trending6 from '../../assets/images/trending6.jpg';
// import trending7 from '../../assets/images/trending7.jpg';

// import mostenquired1 from '../../assets/images/most1.jpg';
// import mostenquired2 from '../../assets/images/most2.jpg';
// import mostenquired3 from '../../assets/images/most3.jpg';
// import mostenquired4 from '../../assets/images/most4.jpg';
// import mostenquired5 from '../../assets/images/most5.jpg';
// import mostenquired6 from '../../assets/images/most6.jpg';
// import mostenquired7 from '../../assets/images/most7.jpg';
// import logoimg from '../../assets/images/veebuilder.png';

// // Get screen dimensions
// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


// // Helper functions for responsive design
// const wp = (percentage) => {
//   const value = (percentage * screenWidth) / 100;
//   return Math.round(value);
// };

// const hp = (percentage) => {
//   const value = (percentage * screenHeight) / 100;
//   return Math.round(value);
// };

// // Responsive font sizes
// const RFPercentage = (percent) => {
//   const heightPercent = (percent * screenHeight) / 100;
//   const widthPercent = (percent * screenWidth) / 100;
//   return Math.round(Math.min(heightPercent, widthPercent));
// };

// // Device type detection
// const isTablet = screenWidth >= 768;
// const isLargeScreen = screenWidth >= 1024;

// const overlayPairs = [
//   { background: image_1, overlay: most1, label: 'Door fittings' },
//   { background: image_2, overlay: most2, label: 'Sand' },
//   { background: image_3, overlay: most3, label: 'Insulation Material' },
//   { background: image_4, overlay: most4, label: 'Wash bassin' },
//   { background: image_5, overlay: most5, label: 'Bath accessories' },
//   { background: image_6, overlay: most6, label: 'adhesives' },
//   { background: image_7, overlay: most7, label: 'Cement' },
//   { background: image_1, overlay: most1, label: 'Door fittings' },
//   { background: image_2, overlay: most2, label: 'Sand' },
//   { background: image_3, overlay: most3, label: 'Insulation Material' },
//   { background: image_4, overlay: most4, label: 'Wash bassin' },
//   { background: image_5, overlay: most5, label: 'Bath accessories' },
//   { background: image_6, overlay: most6, label: 'adhesives' },
//   { background: image_7, overlay: most7, label: 'Cement' },
//   { background: image_4, overlay: most4, label: 'Wash bassin' },
//   { background: image_5, overlay: most5, label: 'Bath accessories' },
//   { background: image_6, overlay: most6, label: 'adhesives' },
//   { background: image_7, overlay: most7, label: 'Cement' }, 
// ];

// const trendingImages = [
//   { image: trending1, label: 'Furniture fittings' },
//   { image: trending2, label: 'switch gears & control' },
//   { image: trending3, label: 'Wash basin' },
//   { image: trending4, label: 'Bath tubs' },
//   { image: trending5, label: 'Divverter' },
//   { image: trending6, label: 'Taps' },
//   { image: trending7, label: 'Trending 7' },
// ];

// const mostEnquiredImages = [
//   { image: mostenquired1, label: 'Sand' },
//   { image: mostenquired2, label: 'Door Fittings' },
//   { image: mostenquired3, label: 'Switch gear & controls' },
//   { image: mostenquired4, label: 'Brisks' },
//   { image: mostenquired5, label: 'other brands' },
//   { image: mostenquired6, label: 'paints finnish' },
//   { image: mostenquired7, label: 'shower' },
// ];

// export default function Home() {
//   const [activeTab, setActiveTab] = useState('Home');
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const router = useRouter();
//   const scrollRef1 = useRef(null);
//   const [trendingData, setTrendingData] = useState([]); // Dynamic trending products
//   const [loadingTrending, setLoadingTrending] = useState(true); // Loading state
//   const [mostEnquiredData, setMostEnquiredData] = useState([]);
//   const [loadingMostEnquired, setLoadingMostEnquired] = useState(true);
//   const [mostSearchedData, setMostSearchedData] = useState([]);
//   const [loadingMostSearched, setLoadingMostSearched] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const { clearSession } = useContext(SessionContext);

//   const [currentLocation, setCurrentLocation] = useState('chennai');
//   const [locationPermission, setLocationPermission] = useState(false);

//   const { session, isSessionLoaded } = useContext(SessionContext);

//   useEffect(() => {
//     (async () => {
//       // Request location permission
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('Permission to access location was denied');
//         return;
//       }

//       setLocationPermission(true);
      
//       // Get current location
//       try {
//         let location = await Location.getCurrentPositionAsync({});
//         const address = await Location.reverseGeocodeAsync({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         });
        
//         if (address.length > 0) {
//           const locality = address[0].district || address[0].subregion || address[0].region || 'Your Location';
//           setCurrentLocation(locality);
          
//           // Optionally save to AsyncStorage
//           await AsyncStorage.setItem('userLocation', locality);
//         }
//       } catch (error) {
//         console.error('Error getting location:', error);
//         // Fallback to saved location if available
//         const savedLocation = await AsyncStorage.getItem('userLocation');
//         if (savedLocation) {
//           setCurrentLocation(savedLocation);
//         }
//       }
//     })();
//   }, []);

//   const getColor = (tabName) => (activeTab === tabName ? '#00A4C9' : '#666');

//   useEffect(() => {
//     const loadUserId = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           console.log('Loaded user ID:', storedUserId);
//         }
//       } catch (error) {
//         console.error('Failed to load user ID:', error);
//       }
//     };

//     loadUserId();
//   }, []);

//   // Function to fetch Trending Products from API
//   const fetchTrendingProducts = async () => {
//     try {
//       const response = await axios.get('https://veebuilds.com/mobile/trending_products_list.php');
//       if (response.data.result === "Success") {
//         setTrendingData(response.data.storeList);
//       } else {
//         throw new Error('Failed to fetch trending products');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Unable to load trending products');
//     } finally {
//       setLoadingTrending(false);
//     }
//   };

//   // useEffect to load trending products when component mounts
//   useEffect(() => {
//     fetchTrendingProducts();
//   }, []);

//   const handleScroll = (event) => {
//     const offsetX = event.nativeEvent.contentOffset.x;
//     scrollRef1.current?.scrollToOffset({ offset: offsetX, animated: false });
//   };

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const fetchMostEnquiredProducts = async () => {
//     try {
//       const response = await axios.get('https://veebuilds.com/mobile/mostenquiredlist.php');
//       if (response.data.result === 'Success') {
//         setMostEnquiredData(response.data.storeList);
//       } else {
//         throw new Error('Failed to fetch most enquired products');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Unable to load most enquired products');
//     } finally {
//       setLoadingMostEnquired(false);
//     }
//   };

//   useEffect(() => {
//     fetchTrendingProducts();
//     fetchMostEnquiredProducts();
//   }, []);

//   const handleLogout = async () => {
//   Alert.alert(
//     'Logout',
//     'Are you sure you want to logout?',
//     [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//       },
//       {
//         text: 'Logout',
//         onPress: async () => {
//           try {
//             // Use the clearSession function from SessionContext
//             await clearSession();
            
//             // Navigate to login screen and reset navigation history
//             router.replace('/components/Login');
//           } catch (error) {
//             console.error('Logout error:', error);
//             Alert.alert('Error', 'Failed to logout properly');
//           }
//         },
//         style: 'destructive',
//       },
//     ],
//     { cancelable: true }
//   );
// };

//   const fetchMostSearchedProducts = async () => {
//     try {
//       const response = await axios.get('https://veebuilds.com/mobile/recentlist.php');
//       if (response.data.result === 'Success') {
//         setMostSearchedData(response.data.storeList);
//       } else {
//         throw new Error('Failed to fetch most searched products');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Unable to load most searched products');
//     } finally {
//       setLoadingMostSearched(false);
//     }
//   };

//   useEffect(() => {
//     fetchTrendingProducts();
//     fetchMostEnquiredProducts();
//     fetchMostSearchedProducts();
//   }, []);

//   return (
//     <SafeAreaView style={styles.safeArea}> 
//       <View style={styles.container}>
//         {/* Header */}
//         <LinearGradient
//           colors={['#1789AE', '#132740']}
//           style={styles.header}
//           start={{ x: 1, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           <View style={styles.headerContent}>
//             <TouchableOpacity style={styles.locationWrapper} onPress={() => router.push('/components/Location')}>
//               <MaterialIcons name="location-on" size={wp(5)} color="orange" />
//               <Text style={styles.locationText}>{currentLocation}</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="orange" />
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => router.push('/components/profile')}>
//               <View style={styles.profileCircle}>
//                 <FontAwesome name="user" size={wp(5)} color="white" />
//               </View>
//             </TouchableOpacity>
//           </View>
//           <TouchableOpacity onPress={() => router.push('/components/Search')}>
//             <View style={styles.searchWrapper}>
//               <MaterialIcons name="search" size={wp(5)} color="#888" style={styles.searchIcon} />
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search"
//                 placeholderTextColor="#888"
//                 editable={false} 
//                 pointerEvents="none" 
//               />
//             </View>
//           </TouchableOpacity>
//         </LinearGradient>
        
//         <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//           {/* Banner */}
//           <TouchableOpacity onPress={() => router.push({ 
//         pathname: '/components/HotenquiryForm', 
//          params: { 
//         userId: userId,
//         name: session?.name,
//        mobile: session?.mobile
//       } 
//       })}
// >
//             <Image source={hot_enqiury1} style={styles.bannerImage} resizeMode="cover" />
//           </TouchableOpacity>

//           {/* Categories */}
//           <Text style={styles.sectionTitle}>Categories</Text>
//           <View style={styles.categoriesContainer}>
//             <TouchableOpacity style={styles.categoryCard} onPress={() => router.push('/components/Materials')}>
//               <Image source={material} style={styles.categoryImage} resizeMode="cover" />
//               <Text style={styles.categoryLabel}>Materials</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.categoryCard} onPress={() => router.push('/components/Realestate')}>
//               <Image source={real_estate_new} style={styles.categoryImage} resizeMode="cover" />
//               <Text style={styles.categoryLabel}>Real Estate</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.categoryCard} onPress={() => router.push('/components/Hirepeople')}>
//               <Image source={hire_people} style={styles.categoryImage} resizeMode="cover" />
//               <Text style={styles.categoryLabel}>Hire People</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Most Searched Products */}
//           <Text style={styles.sectionTitle}>Most Searched Products</Text>
//           {loadingMostSearched ? (
//             <ActivityIndicator size="large" color="#1789AE" />
//           ) : (
//             <FlatList
//               horizontal
//               data={overlayPairs.map((item, index) => ({
//                 ...item,
//                 ...(mostSearchedData[index] || {}), // merge API data into overlay pair
//               }))}
//               keyExtractor={(_, index) => index.toString()}
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.imageScrollContainer}
//               scrollEventThrottle={16}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id || item.id, customer_id: userId } })}>
//                   <View style={styles.overlayImageWrapper}>
//                     <Image source={item.background} style={styles.overlayBaseImage} />
                    
//                     {item.image && (
//                       <Image source={{ uri: item.image }} style={styles.overlayTopImage} />
//                     )}
                    
//                     <View style={styles.overlayTextWrapper}>
//                       <Text style={styles.overlayText}>{item.title || item.label}</Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           )}

//           {/* Trending Products Section */}
//           <Text style={styles.sectionTitle}>Trending Products</Text>
//           {loadingTrending ? (
//             <ActivityIndicator size="large" color="#1789AE" />
//           ) : (
//             <FlatList
//               horizontal
//               data={trendingData}
//               keyExtractor={(item) => item.master_id}
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.trendingContainer}
//               renderItem={({ item }) => (
//                 <TouchableOpacity onPress={() => router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id, customer_id: userId } })}>
//                   <LinearGradient
//                     colors={['#1789AE', '#132740']}
//                     style={styles.trendingBox}
//                     start={{ x: 1, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                   >
//                     <Text style={styles.trendingLabel}>{item.msater_name}</Text>
//                     <Image source={{ uri: item.image }} style={styles.trendingImage} resizeMode="cover" />
//                   </LinearGradient>
//                 </TouchableOpacity>
//               )}
//             />
//           )}

//           <Text style={styles.sectionTitle}>Most Enquired Products</Text>
//           <View style={styles.mostEnquiredContainer}>
//             {loadingMostEnquired ? (
//               <ActivityIndicator size="large" color="#1789AE" />
//             ) : (
//               <FlatList
//                 horizontal
//                 data={mostEnquiredData}
//                 keyExtractor={(item) => item.id} 
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.mostEnquiredScrollContainer}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity onPress={() => router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id, customer_id: userId } })}>
//                     <View style={styles.mostEnquiredBox}>
//                       <Image
//                         source={{ uri: item.image || 'https://veebuilds.com/master/assets/images/default.jpg' }}
//                         style={styles.mostEnquiredImage}
//                       />
//                       <Text style={styles.mostEnquiredLabel}>{item.title}</Text>
//                     </View>
//                   </TouchableOpacity>
//                 )}
//               />
//             )}
//           </View>
//         </ScrollView>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <TouchableOpacity style={styles.footerItem} onPress={() => setActiveTab('Home')}>
//             <Ionicons name="home" size={wp(6)} color={getColor('Home')} />
//             <Text style={[styles.footerText, { color: getColor('Home') }]}>Home</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.footerItem}
//             onPress={() => {
//               setActiveTab('Enquiry');
//               router.push('/components/Myenquiry');
//             }}
//           >
//             <MaterialIcons name="assignment" size={wp(6)} color={getColor('Enquiry')} />
//             <Text style={[styles.footerText, { color: getColor('Enquiry') }]}>My Enquiry</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.footerItem} onPress={toggleDrawer}>
//             <Entypo name="menu" size={wp(6)} color={getColor('More')} />
//             <Text style={[styles.footerText, { color: getColor('More') }]}>More</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Drawer */}
//         {drawerOpen && (
//           <View style={styles.drawer}>
//             {/* Top Content of Drawer */}
//             <View style={styles.drawerTopContent}>
//               <Image source={logoimg} style={styles.drawerLogo} />
//             </View>
//             {/* Drawer Items */}
//             <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Home')}>
//               <MaterialIcons name="home" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>Home</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Aboutus')}>
//               <MaterialIcons name="info" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>About Us</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity> 

//             <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Contactus')}>
//               <MaterialIcons name="contact-mail" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>Contact Us</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Myenquiry')}>
//               <MaterialIcons name="assignment" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>My Enquiry</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.drawerItem}>
//               <MaterialIcons name="share" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>Share App</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Support')}>
//               <MaterialIcons name="help" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>Support</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/TermsAndConditions')}>
//               <MaterialIcons name="gavel" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>Terms and Conditions</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
//               <MaterialIcons name="exit-to-app" size={wp(6)} color="#000" />
//               <Text style={styles.drawerLabel}>Logout</Text>
//               <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#1789AE'
//   },
//   container: { 
//     flex: 1, 
//     backgroundColor: '#fff',
//     width: '100%'
//   },
//   scrollContainer: { 
//     paddingBottom: hp(3),
//     minHeight: hp(100)
//   },
//   header: {
//     paddingTop: hp(1),
//     paddingHorizontal: wp(4),
//     paddingBottom: hp(2.5),
//     width: '100%'
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%'
//   },
//   locationWrapper: { 
//     flexDirection: 'row', 
//     alignItems: 'center',
//     flex: 1,
//     maxWidth: wp(70)
//   },
//   locationText: { 
//     color: 'white', 
//     fontSize: RFPercentage(2.8), 
//     marginHorizontal: wp(1),
//     flexShrink: 1
//   },
//   profileCircle: {
//     width: wp(5),
//     height: wp(5),
//     borderRadius: wp(4),
//     backgroundColor: '#ff8c00',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 33,
//     minHeight: 33
//   },
//   searchWrapper: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: wp(2.5),
//     marginTop: hp(2),
//     alignItems: 'center',
//     paddingHorizontal: wp(2.5),
//     height: hp(5),
//     minHeight: 40,
//     width: '100%'
//   },
//   searchIcon: { 
//     marginRight: wp(2)
//   },
//   searchInput: { 
//     flex: 1, 
//     fontSize: RFPercentage(2.8),
//     paddingVertical: 0
//   },
//   bannerImage: {
//     width: wp(90),
//     height: hp(10),
//     alignSelf: 'center',
//     marginTop: hp(3),
//     minHeight: 85,
//     maxHeight: 120
//   },
//   sectionTitle: {
//     fontSize: RFPercentage(2.8),
//     fontWeight: 'bold',
//     marginTop: hp(3),
//     marginBottom: hp(1.2),
//     marginLeft: wp(4),
//     color: '#333',
//   },
//   categoriesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: wp(2.5),
//     marginTop: hp(2),
//     flexWrap: isTablet ? 'wrap' : 'nowrap'
//   },
//   categoryCard: { 
//     alignItems: 'center', 
//     width: wp(25),
//     minWidth: 100,
//     marginBottom: hp(1)
//   },
//   categoryImage: {
//     width: wp(25),
//     height: wp(25),
//     borderRadius: wp(2.5),
//     minWidth: 100,
//     minHeight: 100,
//     maxWidth: 120,
//     maxHeight: 120
//   },
//   categoryLabel: {
//     marginTop: hp(1),
//     fontSize: RFPercentage(2.5),
//     textAlign: 'center',
//     fontWeight: '600',
//     flexWrap: 'wrap'
//   },
//   imageScrollContainer: {
//     flexDirection: 'row',
//     paddingLeft: wp(1),
//     paddingRight: wp(4),
//     marginTop: hp(2),
//   },
//   overlayImageWrapper: {
//     position: 'relative',
//     width: wp(28),
//     height: hp(18),
//     marginRight: wp(3),
//     marginLeft: wp(2),
//     minWidth: 110,
//     minHeight: 140,
//     maxWidth: 150
//   },
//   overlayBaseImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: wp(2.0),
//   },
//   overlayTopImage: {
//     position: 'absolute',
//     top: '35%',
//     left: '20%',
//     width: '60%',
//     height: '50%',
//     borderRadius: wp(2.5),
//   },
// overlayTextWrapper: {
//   position: 'absolute',
//   top: 0,
//   bottom: 0,
//   left: 0,
//   right: 0,
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// overlayText: {
//   color: 'white',
//   fontSize: RFPercentage(2.5),
//   fontWeight: 'bold',
//   textAlign: 'center',
//   paddingHorizontal: wp(2),
//   borderRadius: wp(1.5),
//   marginTop: 0, // or remove
// },
//   mostEnquiredContainer: {  
//     marginTop: hp(2),
//     backgroundColor: '#027270',
//     borderRadius: wp(2),
//     paddingVertical: hp(1.2),
//     marginHorizontal: wp(2)
//   },
//   mostEnquiredScrollContainer: {
//     flexDirection: 'row',
//     paddingLeft: wp(4),
//     paddingRight: wp(2),
//     minHeight: hp(18),
//   },
//   mostEnquiredBox: {
//     marginRight: wp(8),
//     alignItems: 'center',
//     width: wp(22),
//     minWidth: 90
//   },
//   mostEnquiredImage: {
//     width: wp(20),
//     height: wp(20),
//     borderRadius: wp(2),
//     marginTop: hp(2),
//     minWidth: 90,
//     minHeight: 90,
//     maxWidth: 120,
//     maxHeight: 120
//   },
//   mostEnquiredLabel: {
//     color: '#fff',
//     marginTop: hp(1),
//     fontWeight: 'bold',
//     fontSize: RFPercentage(2.2),
//     textAlign: 'center',
//     flexWrap: 'wrap'
//   },
//   trendingContainer: {
//     paddingLeft: wp(3),
//     paddingRight: wp(2),
//     marginTop: hp(1.2),
//     flexDirection: 'row',
//   },
//   trendingBox: {
//     alignItems: 'center',
//     marginRight: wp(4),
//     width: wp(28),
//     height: hp(20),
//     justifyContent: 'center',
//     paddingVertical: hp(1.5),
//     borderRadius: 5,
   
//   },
//   trendingLabel: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 8,
//     bottom:10,
//     textAlign:"center"
//   },
//   trendingImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 15,
//     backgroundColor: '#FFFFF',
    
//   },
//   footerItem: {
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 10,
//     color: 'white',
//   },
//   drawer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     width: 300,
//     height:840,
//     padding: 20,
//     zIndex: 10,
//     borderRightWidth: 1,
//     borderRightColor: '#ddd',
//   },
//   drawerTopContent: {
//     paddingBottom: 40,
//   },
//   drawerItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 15,
//     borderBottomWidth: 0.1,
//     borderBottomColor: '#ddd',
//     bottom:30,
//   },
//   drawerLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   drawerLogo: {
//     width: 180, 
//     height: 180,
//   },
// });



import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import * as Location from 'expo-location';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionContext } from '../../context/SessionContext';

// Images
import hot_enqiury from '../../assets/images/hot_enqiury.jpg';
import hire_people from '../../assets/images/hire_people.jpg';
import material from '../../assets/images/material.jpg';
import real_estate_new from '../../assets/images/real_estate_new.jpg';
import image_1 from '../../assets/images/image_1.jpg';
import image_2 from '../../assets/images/image_2.jpg';
import image_3 from '../../assets/images/image_3.jpg';
import image_4 from '../../assets/images/image_4.jpg';
import image_5 from '../../assets/images/image_5.jpg';
import image_6 from '../../assets/images/image_6.jpg';
import image_7 from '../../assets/images/image_7.jpg';
import hot_enqiury1 from '../../assets/images/hot-enqiury-15.gif';
import most1 from '../../assets/images/most1.jpg';
import most2 from '../../assets/images/most2.jpg';
import most3 from '../../assets/images/most3.jpg';
import most4 from '../../assets/images/most4.jpg';
import most5 from '../../assets/images/most5.jpg';
import most6 from '../../assets/images/most6.jpg';
import most7 from '../../assets/images/most7.jpg';
import trending1 from '../../assets/images/trending1.jpg';
import trending2 from '../../assets/images/trending2.jpg';
import trending3 from '../../assets/images/trending3.jpg';
import trending4 from '../../assets/images/trending4.jpg';
import trending5 from '../../assets/images/trending5.jpg';
import trending6 from '../../assets/images/trending6.jpg';
import trending7 from '../../assets/images/trending7.jpg';
import mostenquired1 from '../../assets/images/most1.jpg';
import mostenquired2 from '../../assets/images/most2.jpg';
import mostenquired3 from '../../assets/images/most3.jpg';
import mostenquired4 from '../../assets/images/most4.jpg';
import mostenquired5 from '../../assets/images/most5.jpg';
import mostenquired6 from '../../assets/images/most6.jpg';
import mostenquired7 from '../../assets/images/most7.jpg';
import logoimg from '../../assets/images/veebuilder.png';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper functions for responsive design
const wp = (percentage) => {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
};

const hp = (percentage) => {
  const value = (percentage * screenHeight) / 100;
  return Math.round(value);
};

// Responsive font sizes
const RFPercentage = (percent) => {
  const heightPercent = (percent * screenHeight) / 100;
  const widthPercent = (percent * screenWidth) / 100;
  return Math.round(Math.min(heightPercent, widthPercent));
};

// Device type detection
const isTablet = screenWidth >= 768;
const isLargeScreen = screenWidth >= 1024;

const overlayPairs = [
  { background: image_1, overlay: most1, label: 'Door fittings' },
  { background: image_2, overlay: most2, label: 'Sand' },
  { background: image_3, overlay: most3, label: 'Insulation Material' },
  { background: image_4, overlay: most4, label: 'Wash bassin' },
  { background: image_5, overlay: most5, label: 'Bath accessories' },
  { background: image_6, overlay: most6, label: 'adhesives' },
  { background: image_7, overlay: most7, label: 'Cement' },
  { background: image_1, overlay: most1, label: 'Door fittings' },
  { background: image_2, overlay: most2, label: 'Sand' },
  { background: image_3, overlay: most3, label: 'Insulation Material' },
  { background: image_4, overlay: most4, label: 'Wash bassin' },
  { background: image_5, overlay: most5, label: 'Bath accessories' },
  { background: image_6, overlay: most6, label: 'adhesives' },
  { background: image_7, overlay: most7, label: 'Cement' },
  { background: image_4, overlay: most4, label: 'Wash bassin' },
  { background: image_5, overlay: most5, label: 'Bath accessories' },
  { background: image_6, overlay: most6, label: 'adhesives' },
  { background: image_7, overlay: most7, label: 'Cement' }, 
];

const trendingImages = [
  { image: trending1, label: 'Furniture fittings' },
  { image: trending2, label: 'switch gears & control' },
  { image: trending3, label: 'Wash basin' },
  { image: trending4, label: 'Bath tubs' },
  { image: trending5, label: 'Divverter' },
  { image: trending6, label: 'Taps' },
  { image: trending7, label: 'Trending 7' },
];

const mostEnquiredImages = [
  { image: mostenquired1, label: 'Sand' },
  { image: mostenquired2, label: 'Door Fittings' },
  { image: mostenquired3, label: 'Switch gear & controls' },
  { image: mostenquired4, label: 'Brisks' },
  { image: mostenquired5, label: 'other brands' },
  { image: mostenquired6, label: 'paints finnish' },
  { image: mostenquired7, label: 'shower' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('Home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const scrollRef1 = useRef(null);
  const [trendingData, setTrendingData] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [mostEnquiredData, setMostEnquiredData] = useState([]);
  const [loadingMostEnquired, setLoadingMostEnquired] = useState(true);
  const [mostSearchedData, setMostSearchedData] = useState([]);
  const [loadingMostSearched, setLoadingMostSearched] = useState(true);
  const [userId, setUserId] = useState(null);
  const { clearSession } = useContext(SessionContext);
  const [currentLocation, setCurrentLocation] = useState('chennai');
  const [locationPermission, setLocationPermission] = useState(false);
  const { session, isSessionLoaded } = useContext(SessionContext);

  // Close drawer when clicking outside
  const handleOutsideClick = () => {
    if (drawerOpen) {
      setDrawerOpen(false);
    }
  };

  useEffect(() => {
    (async () => {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      setLocationPermission(true);
      
      // Get current location
      try {
        let location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address.length > 0) {
          const locality = address[0].district || address[0].subregion || address[0].region || 'Your Location';
          setCurrentLocation(locality);
          
          // Optionally save to AsyncStorage
          await AsyncStorage.setItem('userLocation', locality);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        // Fallback to saved location if available
        const savedLocation = await AsyncStorage.getItem('userLocation');
        if (savedLocation) {
          setCurrentLocation(savedLocation);
        }
      }
    })();
  }, []);

  const getColor = (tabName) => (activeTab === tabName ? '#00A4C9' : '#666');

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('Loaded user ID:', storedUserId);
        }
      } catch (error) {
        console.error('Failed to load user ID:', error);
      }
    };

    loadUserId();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await axios.get('https://veebuilds.com/mobile/trending_products_list.php');
      if (response.data.result === "Success") {
        setTrendingData(response.data.storeList);
      } else {
        throw new Error('Failed to fetch trending products');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to load trending products');
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollRef1.current?.scrollToOffset({ offset: offsetX, animated: false });
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const fetchMostEnquiredProducts = async () => {
    try {
      const response = await axios.get('https://veebuilds.com/mobile/mostenquiredlist.php');
      if (response.data.result === 'Success') {
        setMostEnquiredData(response.data.storeList);
      } else {
        throw new Error('Failed to fetch most enquired products');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to load most enquired products');
    } finally {
      setLoadingMostEnquired(false);
    }
  };

  useEffect(() => {
    fetchTrendingProducts();
    fetchMostEnquiredProducts();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await clearSession();
              router.replace('/components/Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout properly');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const fetchMostSearchedProducts = async () => {
    try {
      const response = await axios.get('https://veebuilds.com/mobile/recentlist.php');
      if (response.data.result === 'Success') {
        setMostSearchedData(response.data.storeList);
      } else {
        throw new Error('Failed to fetch most searched products');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to load most searched products');
    } finally {
      setLoadingMostSearched(false);
    }
  };

  useEffect(() => {
    fetchTrendingProducts();
    fetchMostEnquiredProducts();
    fetchMostSearchedProducts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Overlay that appears when drawer is open */}
      {drawerOpen && (
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleOutsideClick}
        />
      )}
      
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#1789AE', '#132740']}
          style={styles.header}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.locationWrapper} onPress={() => router.push('/components/Location')}>
              <MaterialIcons name="location-on" size={wp(5)} color="orange" />
              <Text style={styles.locationText}>{currentLocation}</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="orange" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/components/profile')}>
              <View style={styles.profileCircle}>
                <FontAwesome name="user" size={wp(5)} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push('/components/Search')}>
            <View style={styles.searchWrapper}>
              <MaterialIcons name="search" size={wp(5)} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#888"
                editable={false} 
                pointerEvents="none" 
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>
        
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <TouchableOpacity onPress={() => router.push({ 
            pathname: '/components/HotenquiryForm', 
            params: { 
              userId: userId,
              name: session?.name,
              mobile: session?.mobile
            } 
          })}>
            <Image source={hot_enqiury1} style={styles.bannerImage} resizeMode="cover" />
          </TouchableOpacity>

          {/* Categories */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesContainer}>
            <TouchableOpacity style={styles.categoryCard} onPress={() => router.push('/components/Materials')}>
              <Image source={material} style={styles.categoryImage} resizeMode="cover" />
              <Text style={styles.categoryLabel}>Materials</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard} onPress={() => router.push('/components/Realestate')}>
              <Image source={real_estate_new} style={styles.categoryImage} resizeMode="cover" />
              <Text style={styles.categoryLabel}>Real Estate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryCard} onPress={() => router.push('/components/Hirepeople')}>
              <Image source={hire_people} style={styles.categoryImage} resizeMode="cover" />
              <Text style={styles.categoryLabel}>Hire People</Text>
            </TouchableOpacity>
          </View>

          {/* Most Searched Products */}
          <Text style={styles.sectionTitle}>Most Searched Products</Text>
          {loadingMostSearched ? (
            <ActivityIndicator size="large" color="#1789AE" />
          ) : (
            <FlatList
              horizontal
              data={overlayPairs.map((item, index) => ({
                ...item,
                ...(mostSearchedData[index] || {}),
              }))}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScrollContainer}
              scrollEventThrottle={16}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id || item.id, customer_id: userId } })}>
                  <View style={styles.overlayImageWrapper}>
                    <Image source={item.background} style={styles.overlayBaseImage} />
                    
                    {item.image && (
                      <Image source={{ uri: item.image }} style={styles.overlayTopImage} />
                    )}
                    
                    <View style={styles.overlayTextWrapper}>
                      <Text style={styles.overlayText}>{item.title || item.label}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          {/* trending product section */}
          <Text style={styles.sectionTitle}>Trending Products</Text>
          {loadingTrending ? (
            <ActivityIndicator size="large" color="#1789AE" />
          ) : (
            <FlatList
              horizontal
              data={trendingData}
              keyExtractor={(item) => item.master_id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingContainer}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id, customer_id: userId } })}>
                  <LinearGradient
                    colors={['#1789AE', '#132740']}
                    style={styles.trendingBox}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.trendingLabel}>{item.msater_name}</Text>
                    <Image source={{ uri: item.image }} style={styles.trendingImage} resizeMode="cover" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          )}

          <Text style={styles.sectionTitle}>Most Enquired Products</Text>
          <View style={styles.mostEnquiredContainer}>
            {loadingMostEnquired ? (
              <ActivityIndicator size="large" color="#1789AE" />
            ) : (
              <FlatList
                horizontal
                data={mostEnquiredData}
                keyExtractor={(item) => item.id} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mostEnquiredScrollContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id, customer_id: userId } })}>
                    <View style={styles.mostEnquiredBox}>
                      <Image
                        source={{ uri: item.image || 'https://veebuilds.com/master/assets/images/default.jpg' }}
                        style={styles.mostEnquiredImage}
                      />
                      <Text style={styles.mostEnquiredLabel}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerItem} onPress={() => setActiveTab('Home')}>
            <Ionicons name="home" size={wp(6)} color={getColor('Home')} />
            <Text style={[styles.footerText, { color: getColor('Home') }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => {
              setActiveTab('Enquiry');
              router.push('/components/Myenquiry');
            }}
          >
            <MaterialIcons name="assignment" size={wp(6)} color={getColor('Enquiry')} />
            <Text style={[styles.footerText, { color: getColor('Enquiry') }]}>My Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={toggleDrawer}>
            <Entypo name="menu" size={wp(6)} color={getColor('More')} />
            <Text style={[styles.footerText, { color: getColor('More') }]}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Drawer */}
        {drawerOpen && (
          <View style={styles.drawer}>
            {/* Top Content of Drawer */}
            <View style={styles.drawerTopContent}>
              <Image source={logoimg} style={styles.drawerLogo} />
            </View>
            {/* Drawer Items */}
            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Home')}>
              <MaterialIcons name="home" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>Home</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Aboutus')}>
              <MaterialIcons name="info" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>About Us</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity> 

            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Contactus')}>
              <MaterialIcons name="contact-mail" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>Contact Us</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Myenquiry')}>
              <MaterialIcons name="assignment" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>My Enquiry</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem}>
              <MaterialIcons name="share" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>Share App</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Support')}>
              <MaterialIcons name="help" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>Support</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/TermsAndConditions')}>
              <MaterialIcons name="gavel" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>Terms and Conditions</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
              <MaterialIcons name="exit-to-app" size={wp(6)} color="#000" />
              <Text style={styles.drawerLabel}>Logout</Text>
              <MaterialIcons name="arrow-drop-down" size={wp(5)} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1789AE'
  },
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    width: '100%'
  },
  scrollContainer: { 
    paddingBottom: hp(3),
    minHeight: hp(100)
  },
  header: {
    paddingTop: hp(1),
    paddingHorizontal: wp(4),
    paddingBottom: hp(2.5),
    width: '100%'
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  locationWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
    maxWidth: wp(70)
  },
  locationText: { 
    color: 'white', 
    fontSize: RFPercentage(2.8), 
    marginHorizontal: wp(1),
    flexShrink: 1
  },
  profileCircle: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(4),
    backgroundColor: '#ff8c00',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 33,
    minHeight: 33
  },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: wp(2.5),
    marginTop: hp(2),
    alignItems: 'center',
    paddingHorizontal: wp(2.5),
    height: hp(5),
    minHeight: 40,
    width: '100%'
  },
  searchIcon: { 
    marginRight: wp(2)
  },
  searchInput: { 
    flex: 1, 
    fontSize: RFPercentage(2.8),
    paddingVertical: 0
  },
  bannerImage: {
    width: wp(90),
    height: hp(10),
    alignSelf: 'center',
    marginTop: hp(3),
    minHeight: 85,
    maxHeight: 120
  },
  sectionTitle: {
    fontSize: RFPercentage(2.8),
    fontWeight: 'bold',
    marginTop: hp(3),
    marginBottom: hp(1.2),
    marginLeft: wp(4),
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: wp(2.5),
    marginTop: hp(2),
    flexWrap: isTablet ? 'wrap' : 'nowrap'
  },
  categoryCard: { 
    alignItems: 'center', 
    width: wp(25),
    minWidth: 100,
    marginBottom: hp(1)
  },
  categoryImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(2.5),
    minWidth: 100,
    minHeight: 100,
    maxWidth: 120,
    maxHeight: 120
  },
  categoryLabel: {
    marginTop: hp(1),
    fontSize: RFPercentage(2.5),
    textAlign: 'center',
    fontWeight: '600',
    flexWrap: 'wrap'
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingLeft: wp(1),
    paddingRight: wp(4),
    marginTop: hp(2),
  },
  overlayImageWrapper: {
    position: 'relative',
    width: wp(28),
    height: hp(18),
    marginRight: wp(3),
    marginLeft: wp(2),
    minWidth: 110,
    minHeight: 140,
    maxWidth: 150
  },
  overlayBaseImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2.0),
  },
  overlayTopImage: {
    position: 'absolute',
    top: '35%',
    left: '20%',
    width: '60%',
    height: '50%',
    borderRadius: wp(2.5),
  },
  overlayTextWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: wp(2),
    borderRadius: wp(1.5),
    marginTop: 130,
  },
  mostEnquiredContainer: {  
    marginTop: hp(2),
    backgroundColor: '#027270',
    borderRadius: wp(2),
    paddingVertical: hp(1.2),
    marginHorizontal: wp(2)
  },
  mostEnquiredScrollContainer: {
    flexDirection: 'row',
    paddingLeft: wp(4),
    paddingRight: wp(2),
    minHeight: hp(18),
  },
  mostEnquiredBox: {
    marginRight: wp(8),
    alignItems: 'center',
    width: wp(22),
    minWidth: 90
  },
  mostEnquiredImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
    marginTop: hp(2),
    minWidth: 90,
    minHeight: 90,
    maxWidth: 120,
    maxHeight: 120
  },
  mostEnquiredLabel: {
    color: '#fff',
    marginTop: hp(1),
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  trendingContainer: {
    paddingLeft: wp(3),
    paddingRight: wp(2),
    marginTop: hp(1.2),
    flexDirection: 'row',
  },
  trendingBox: {
    alignItems: 'center',
    marginRight: wp(4),
    width: wp(28),
    height: hp(20),
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    borderRadius: 5,
  },
  trendingLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 8,
    bottom:10,
    textAlign:"center"
  },
  trendingImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFFFF',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: 'white',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    width: 300,
    height:840,
    padding: 20,
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  drawerTopContent: {
    paddingBottom: 40,
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.1,
    borderBottomColor: '#ddd',
    bottom:30,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerLogo: {
    width: 180, 
    height: 180,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 5,
  },
});







 




