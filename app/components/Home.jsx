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
import React, { useState, useRef, useEffect} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';

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
  const [trendingData, setTrendingData] = useState([]); // Dynamic trending products
  const [loadingTrending, setLoadingTrending] = useState(true); // Loading state
  const [mostEnquiredData, setMostEnquiredData] = useState([]);
  const [loadingMostEnquired, setLoadingMostEnquired] = useState(true);
  const [mostSearchedData, setMostSearchedData] = useState([]);
  const [loadingMostSearched, setLoadingMostSearched] = useState(true);



  const getColor = (tabName) => (activeTab === tabName ? '#00A4C9' : '#666');


   // Function to fetch Trending Products from API
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

  // useEffect to load trending products when component mounts
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


  const handleLogout = () => {
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
          onPress: () => {
            router.push('/components/Login'); // Replace to prevent going back
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
          <MaterialIcons name="location-on" size={20} color="orange" />
          <Text style={styles.locationText}>Old Pallavaram</Text>
          <MaterialIcons name="arrow-drop-down" size={20} color="orange" />
        </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/components/profile')}>
          <View style={styles.profileCircle}>
           <FontAwesome name="user" size={20} color="white" />
          </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/components/Search')}>
      <View style={styles.searchWrapper}>
        <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
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
        
        <TouchableOpacity onPress={() => router.push('/components/HotenquiryForm')}>
       <Image source={hot_enqiury1} style={styles.bannerImage} resizeMode="cover" />
        </TouchableOpacity>


        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesContainer}>
        <TouchableOpacity style={styles.categoryCard} onPress={() => router.push('/components/Materials')}>
          <Image source={material} style={styles.categoryImage} resizeMode="cover" />
          <Text style={styles.categoryLabel}>Materials</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}onPress={() => router.push('/components/Realestate')}>
            <Image source={real_estate_new} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryLabel}>Real Estate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard}onPress={() => router.push('/components/Hirepeople')}>
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
      ...(mostSearchedData[index] || {}), // merge API data into overlay pair
    }))}
    keyExtractor={(_, index) => index.toString()}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.imageScrollContainer}
    scrollEventThrottle={16}
    renderItem={({ item }) => (
      <TouchableOpacity  onPress={() =>router.push({ pathname: '/components/Shop', params: { cat_id: item.id } })}>
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


{/* Trending Products Section */}
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
              <TouchableOpacity onPress={() =>router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id } })}>
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
        <TouchableOpacity onPress={() =>router.push({ pathname: '/components/Shop', params: { cat_id: item.master_id } })}>
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
          <Ionicons name="home" size={24} color={getColor('Home')} />
          <Text style={[styles.footerText, { color: getColor('Home') }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => {
            setActiveTab('Enquiry');
            router.push('/components/Myenquiry');
          }}
        >
          <MaterialIcons name="assignment" size={24} color={getColor('Enquiry')} />
          <Text style={[styles.footerText, { color: getColor('Enquiry') }]}>My Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={toggleDrawer}>
          <Entypo name="menu" size={24} color={getColor('More')} />
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
      <MaterialIcons name="home" size={24} color="#000" />
      <Text style={styles.drawerLabel}>Home</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Aboutus')}>
      <MaterialIcons name="info" size={24} color="#000" />
      <Text style={styles.drawerLabel}>About Us</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity> 

    <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Contactus')}>
      <MaterialIcons name="contact-mail" size={24} color="#000" />
      <Text style={styles.drawerLabel}>Contact Us</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Myenquiry')}>
      <MaterialIcons name="assignment" size={24} color="#000" />
      <Text style={styles.drawerLabel}>My Enquiry</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem}>
      <MaterialIcons name="share" size={24} color="#000" />
      <Text style={styles.drawerLabel}>Share App</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/Support')}>
      <MaterialIcons name="help" size={24} color="#000" />
      <Text style={styles.drawerLabel}>Support</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/components/TermsAndConditions')}>
      <MaterialIcons name="gavel" size={24} color="#000" />
      <Text style={styles.drawerLabel}>Terms and Conditions</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem} >
      <MaterialIcons name="exit-to-app" size={24} color="#000" />
      <Text style={styles.drawerLabel}>Logout</Text>
      <MaterialIcons name="arrow-drop-down" size={20} color="#000" />
    </TouchableOpacity>


  </View>
)}


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 20 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationWrapper: { flexDirection: 'row', alignItems: 'center' },
  locationText: { color: 'white', fontSize: 18, marginHorizontal: 4 },
  profileCircle: {
    width: 33,
    height: 33,
    borderRadius: 18,
    backgroundColor: '#ff8c00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  bannerImage: {
    width: 360,
    height: 85,
    alignSelf: 'center',
    marginTop: 27,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 23,
    marginBottom: 10,
    marginLeft: 16,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginTop: 17,
  },
  categoryCard: { alignItems: 'center', width: 100 },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingLeft: 3,
    paddingRight: 16,
    marginTop: 18,
  },
  overlayImageWrapper: {
    position: 'relative',
    width: 110,
    height: 140,
    marginRight: 20,
    left:8
  },
  overlayBaseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlayTopImage: {
    position: 'absolute',
    top: 70,
    left: 25,
    width: '60%',
    height: '60%',
    borderRadius: 10,
  },
  overlayTextWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -10 }],
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  overlayText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    bottom: 55,
    right: 5,
  },
  mostEnquiredContainer: {  
    marginTop: 15,
    backgroundColor: '#027270',
    borderRadius: 8,
    paddingVertical: 10,
    
  },
  mostEnquiredScrollContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 8,
    height:140,
   
  },
  mostEnquiredBox: {
    marginRight: 38,
    alignItems: 'center',
    
  },
  mostEnquiredImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    top:20
  },
  mostEnquiredLabel: {
    color: '#fff',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 7,
    top:20
  },
  trendingContainer: {
    paddingLeft: 13,
    paddingRight: 8,
    marginTop: 10,
    flexDirection: 'row',
    marginRight: 20,
    gap: 5,
  },
  trendingBox: {
    alignItems: 'center',
    marginRight: 16,
    width: 110,
    height: 150,
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
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
    right: 0,
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
});







 




