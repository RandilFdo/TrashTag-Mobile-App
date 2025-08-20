import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CleanupType = 'beach' | 'park' | 'street' | 'forest';

type CleanupLocation = {
  id: string;
  name: string;
  type: CleanupType;
  latitude: number;
  longitude: number;
  description: string;
  photos: string[];
  created_at: string;
  user_name?: string;
};

const DEMO_LOCATIONS: CleanupLocation[] = [
  {
    id: '1',
    name: 'Mount Lavinia Beach',
    type: 'beach',
    latitude: 6.8397,
    longitude: 79.8636,
    description: 'Beautiful beach cleanup completed',
    photos: ['https://via.placeholder.com/200x150/4CAF50/fff?text=AFTER'],
    created_at: '2024-01-15',
    user_name: 'Sarah M.'
  },
  {
    id: '2',
    name: 'Viharamahadevi Park',
    type: 'park',
    latitude: 6.9271,
    longitude: 79.8612,
    description: 'Central park cleanup',
    photos: ['https://via.placeholder.com/200x150/4CAF50/fff?text=AFTER'],
    created_at: '2024-01-14',
    user_name: 'Raj K.'
  },
  {
    id: '3',
    name: 'Galle Face Green',
    type: 'street',
    latitude: 6.9271,
    longitude: 79.8412,
    description: 'Street cleanup along the promenade',
    photos: ['https://via.placeholder.com/200x150/4CAF50/fff?text=AFTER'],
    created_at: '2024-01-13',
    user_name: 'Lakshmi P.'
  }
];

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | CleanupType>('all');
  const [cleanupLocations, setCleanupLocations] = useState<CleanupLocation[]>([]);

  useEffect(() => {
    // On web, provide a simplified list fallback without native maps
    setCleanupLocations(DEMO_LOCATIONS);
  }, []);

  const filteredLocations = useMemo(
    () => cleanupLocations.filter(l => selectedFilter === 'all' || l.type === selectedFilter),
    [cleanupLocations, selectedFilter]
  );

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'beach': return 'water';
      case 'park': return 'leaf';
      case 'street': return 'car';
      case 'forest': return 'leaf';
      default: return 'location';
    }
  };

  const getFilterColor = (type: string) => {
    switch (type) {
      case 'beach': return '#4A90E2';
      case 'park': return '#7ED321';
      case 'street': return '#F5A623';
      case 'forest': return '#50E3C2';
      default: return '#9B9B9B';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗺️ Cleanup Map</Text>
        <View style={styles.headerControls}>
          <View style={styles.webBadge}>
            <Ionicons name="globe" size={16} color="#000" />
            <Text style={styles.webBadgeText}>Web preview</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'all', label: 'All', icon: 'globe' },
          { key: 'beach', label: 'Beach', icon: 'water' },
          { key: 'park', label: 'Park', icon: 'leaf' },
          { key: 'street', label: 'Street', icon: 'car' },
          { key: 'forest', label: 'Forest', icon: 'leaf' }
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === (filter.key as any) && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Ionicons 
              name={filter.icon as any} 
              size={16} 
              color={selectedFilter === filter.key ? '#fff' : getFilterColor(filter.key)}
            />
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.key && styles.filterTabTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.webNotice}>
        <Text style={styles.webNoticeText}>Interactive map is disabled on web preview. Showing locations list instead.</Text>
      </View>

      <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
        {filteredLocations.map((location) => (
          <View key={location.id} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons 
                name={getFilterIcon(location.type)} 
                size={20} 
                color={getFilterColor(location.type)} 
              />
              <Text style={styles.locationName}>{location.name}</Text>
              <View style={[styles.locationType, { backgroundColor: getFilterColor(location.type) }]}>
                <Text style={styles.locationTypeText}>{location.type}</Text>
              </View>
            </View>
            <Text style={styles.locationDescription}>{location.description}</Text>
            <View style={styles.locationFooter}>
              <Text style={styles.locationUser}>by {location.user_name}</Text>
              <Text style={styles.locationDate}>{new Date(location.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredLocations.length}</Text>
          <Text style={styles.statLabel}>Locations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{cleanupLocations.filter(l => l.type === 'beach').length}</Text>
          <Text style={styles.statLabel}>Beaches</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{cleanupLocations.filter(l => l.type === 'park').length}</Text>
          <Text style={styles.statLabel}>Parks</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{cleanupLocations.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#111',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffd300',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  webBadgeText: {
    marginLeft: 6,
    fontWeight: '700',
    color: '#000',
  },
  filterContainer: {
    backgroundColor: '#111',
    paddingBottom: 15,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterTabActive: {
    backgroundColor: '#ffd300',
    borderColor: '#ffd300',
  },
  filterTabText: {
    color: '#888',
    marginLeft: 6,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#000',
  },
  webNotice: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  webNoticeText: {
    color: '#ffd300',
    fontStyle: 'italic',
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationCard: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 10,
  },
  locationType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationTypeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  locationDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationUser: {
    fontSize: 12,
    color: '#ffd300',
    fontStyle: 'italic',
  },
  locationDate: {
    fontSize: 12,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd300',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});


