import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function MyenquiryDetails() {
  const { title } = useLocalSearchParams()
  const router = useRouter()

  const [selectedStatus, setSelectedStatus] = useState(null)
  const [enquiries, setEnquiries] = useState([])
  const [userId, setUserId] = useState(null)

  const statusMap = {
    Pending: 0,
    Completed: 2,
    Rejected: 1,
  }

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId')
        console.log('Loaded userId:', storedUserId)
        if (storedUserId) {
          setUserId(storedUserId)
        }
      } catch (error) {
        console.error('Error loading userId from AsyncStorage:', error)
      }
    }

    loadUserId()
  }, [])

  useEffect(() => {
    const fetchEnquiries = async () => {
      if (!userId || selectedStatus === null) return

      try {
        const statusCode = statusMap[selectedStatus]
        let url = ''

        // API switching logic based on title
        if (title === 'real estate enquiry') {
          url = `https://veebuilds.com/mobile/real_estate_enquiry_list.php?user_id=${userId}&status=${statusCode}`
        } else if (title === 'Hire people enquiry') {
          url = `https://veebuilds.com/mobile/hire_enquiry_list.php?user_id=${userId}&status=${statusCode}`
        } else {
          url = `https://veebuilds.com/mobile/my_enquery.php?user_id=${userId}&status=${statusCode}`
        }

        console.log('Fetching from URL:', url)
        const response = await axios.get(url)

        console.log('API Response:', response.data)

        if (response.data.success === 1 && Array.isArray(response.data.storeList)) {
          setEnquiries(response.data.storeList)
        } else {
          setEnquiries([])
        }
      } catch (error) {
        console.error('Error fetching enquiry data:', error)
      }
    }

    fetchEnquiries()
  }, [selectedStatus, userId])

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
  )

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
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    height: 120,
  },
  backButton: {
    marginRight: 12,
    marginTop: 40,
  },
  backIconContainer: {
    padding: 8,
    top: 3,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'left',
    marginTop: 40,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#1789AE',
    marginHorizontal: 2,
    right: 15,
  },
  selectedStatusButton: {
    backgroundColor: '#1789AE',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedStatusButtonText: {
    color: '#fff',
  },
  detailsBox: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#1789AE',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 4,
  },
  label: {
    width: 130,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    textAlign: 'right',
  },
})
















