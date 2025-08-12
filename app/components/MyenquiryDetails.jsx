import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SessionContext } from '../../context/SessionContext'; // Adjust path as needed

export default function MyenquiryDetails() {
  const { title, customer_id } = useLocalSearchParams();
  const router = useRouter();
  const { session } = useContext(SessionContext);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [enquiries, setEnquiries] = useState([]);

  const statusMap = {
    Pending: 0,
    Completed: 2,
    Rejected: 1,
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      // Use either the customer_id from params or session.id
      const userId = customer_id || (session && session.id);
      if (!userId || selectedStatus === null) return;

      try {
        const statusCode = statusMap[selectedStatus];
        let url = '';

        // API switching logic based on title
        if (title === 'real estate enquiry') {
          url = `https://veebuilds.com/mobile/real_estate_enquiry_list.php?user_id=${userId}&status=${statusCode}`;
        } else if (title === 'Hire people enquiry') {
          url = `https://veebuilds.com/mobile/hire_enquiry_list.php?user_id=${userId}&status=${statusCode}`;
        } else {
          url = `https://veebuilds.com/mobile/my_enquery.php?user_id=${userId}&status=${statusCode}`;
        }

        console.log('Fetching from URL:', url);
        const response = await axios.get(url);

        console.log('API Response:', response.data);

        if (response.data.success === 1 && Array.isArray(response.data.storeList)) {
          setEnquiries(response.data.storeList);
        } else {
          setEnquiries([]);
        }
      } catch (error) {
        console.error('Error fetching enquiry data:', error);
        setEnquiries([]);
      }
    };

    fetchEnquiries();
  }, [selectedStatus, session, customer_id, title]);

  const renderEnquiryItem = ({ item }) => (
    <View style={styles.detailsBox}>
      <View style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Mobile Number</Text>
        <Text style={styles.value}>{item.mobile}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Enquiry Status</Text>
        <Text style={[styles.value, { color: '#1789AE', fontWeight: 'bold' }]}>
          {selectedStatus}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{item.created}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Enquiry For</Text>
        <Text style={styles.value}>{item.product_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Enquiry To</Text>
        <Text style={styles.value}>{item.vendor_name || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Message</Text>
        <Text style={styles.value}>{item.message || 'N/A'}</Text>
      </View>
    </View>
  );

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
          <View style={styles.backIconContainer}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
      </LinearGradient>

      {/* Status Filter */}
      <View style={styles.statusContainer}>
        {['Pending', 'Completed', 'Rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              selectedStatus === status && styles.selectedStatusButton,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.statusButtonText,
                selectedStatus === status && styles.selectedStatusButtonText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Enquiry List */}
      {enquiries.length > 0 ? (
        <FlatList
          data={enquiries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderEnquiryItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        selectedStatus && (
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#777' }}>
            No enquiries found.
          </Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    height: 120,
  },
  backButton: {
    marginRight: 12,
    marginTop: 35,
  },
  backIconContainer: {
    padding: 6,
    top: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'left',
    marginTop: 35,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingHorizontal: 15,
    marginLeft: 5,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 23,
    borderRadius: 5,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#1789AE',
    marginHorizontal: 2,
    right: 10,
  },
  selectedStatusButton: {
    backgroundColor: '#1789AE',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedStatusButtonText: {
    color: '#fff',
  },
  detailsBox: {
    marginTop: 15,
    marginHorizontal: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#1789AE',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 2,
  },
  label: {
    width: 110,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
  },
});
















