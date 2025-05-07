import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'

export default function MyenquiryDetails() {
  const { title } = useLocalSearchParams()
  const router = useRouter()

  const [selectedStatus, setSelectedStatus] = useState(null)

  const handleStatusPress = (status) => {
    setSelectedStatus(status)
  }

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

      {/* Status Buttons */}
      <View style={styles.statusContainer}>
        {['Pending', 'Completed', 'Rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              selectedStatus === status && styles.selectedStatusButton,
            ]}
            onPress={() => handleStatusPress(status)}
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

      {/* Conditional Rendering of Enquiry Details */}
      {selectedStatus === 'Pending' && (
        <View style={styles.detailsBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>Vengat</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.value}>8709780987</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Enquiry Status</Text>
            <Text style={[styles.value, { color: '#1789AE', fontWeight: 'bold' }]}>
              New
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>25-04-2025</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Enquiry For</Text>
            <Text style={styles.value}>Door fitting</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Enquiry To</Text>
            <Text style={styles.value}>Velsoft</Text>
          </View>
        </View>
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
    height:120
  },
  backButton: {
    marginRight: 12,
    marginTop:40
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
    marginTop:40
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
    marginLeft:10
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#1789AE',
    marginHorizontal: 2,
    right:15
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
    marginTop: 30,
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
    width: 130, // 👈 fixed width so all labels align properly
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  value: {
    flex: 1, // 👈 value will stretch automatically
    fontSize: 16,
    color: '#555',
    textAlign: 'right',
  },
})











