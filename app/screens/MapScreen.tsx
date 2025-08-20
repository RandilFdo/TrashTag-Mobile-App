import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../../backend/supabase/client';

const { width, height } = Dimensions.get('window');

interface CleanupLocation {
  id: string;
  name: string;
  type: 'beach' | 'park' | 'street' | 'forest';
  latitude: number;
  longitude: number;
  description: string;
  photos: string[];
  created_at: string;
  user_name?: string;
}

const MapScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'beach' | 'park' | 'street' | 'forest'>('all');
  const [cleanupLocations, setCleanupLocations] = useState<CleanupLocation[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    fetchCleanupLocations();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your position on the map');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      // Default to Colombo if location fails
      setUserLocation({
        latitude: 6.9271,
        longitude: 79.8612,
      });
    }
  };

  const fetchCleanupLocations = async () => {
    try {
      setLoading(true);
      
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            name
          )
        `)
        .not('location', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        // Continue with demo data if database fails
      }

      // Convert posts to cleanup locations
      const locations: CleanupLocation[] = [];
      
      if (postsData && postsData.length > 0) {
        for (const post of postsData) {
          // Try to get coordinates for the location
          try {
            const geocoded = await Location.geocodeAsync(post.location);
            if (geocoded.length > 0) {
              const coords = geocoded[0];
              locations.push({
                id: post.id,
                name: post.location,
                type: determineLocationType(post.location, post.caption),
                latitude: coords.latitude,
                longitude: coords.longitude,
                description: post.caption,
                photos: [post.image_url],
                created_at: post.created_at,
                user_name: post.profiles?.name || 'Anonymous User'
              });
            }
          } catch (geocodeError) {
            console.log(`Failed to geocode location: ${post.location}`);
            // Add with approximate coordinates if geocoding fails
            locations.push({
              id: post.id,
              name: post.location,
              type: determineLocationType(post.location, post.caption),
              latitude: 6.9271 + (Math.random() - 0.5) * 0.5, // Random around Colombo
              longitude: 79.8612 + (Math.random() - 0.5) * 0.5,
              description: post.caption,
              photos: [post.image_url],
              created_at: post.created_at,
              user_name: post.profiles?.name || 'Anonymous User'
            });
          }
        }
      }

      // If no real data, add demo locations
      if (locations.length === 0) {
        locations.push(
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
        );
      }

      setCleanupLocations(locations);
    } catch (error) {
      console.error('Error fetching cleanup locations:', error);
      // Add demo locations as fallback
      setCleanupLocations([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  const determineLocationType = (location: string, caption: string): 'beach' | 'park' | 'street' | 'forest' => {
    const locationLower = location.toLowerCase();
    const captionLower = caption.toLowerCase();
    
    if (locationLower.includes('beach') || captionLower.includes('beach') || locationLower.includes('sea')) {
      return 'beach';
    } else if (locationLower.includes('park') || captionLower.includes('park') || locationLower.includes('garden')) {
      return 'park';
    } else if (locationLower.includes('forest') || captionLower.includes('forest') || locationLower.includes('jungle')) {
      return 'forest';
    } else {
      return 'street';
    }
  };

  const filteredLocations = cleanupLocations.filter(location => 
    selectedFilter === 'all' || location.type === selectedFilter
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

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'beach': return '#4A90E2';
      case 'park': return '#7ED321';
      case 'street': return '#F5A623';
      case 'forest': return '#50E3C2';
      default: return '#ffd300';
    }
  };

  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: 6.9271, // Colombo
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗺️ Cleanup Map</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setShowMap(!showMap)}
          >
            <Ionicons name={showMap ? "list" : "map"} size={20} color="#ffd300" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
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
              selectedFilter === filter.key && styles.filterTabActive
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

      {/* Map or List View */}
      {showMap ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                pinColor={getMarkerColor(location.type)}
              >
                <Callout style={styles.callout}>
                  <View style={styles.calloutContent}>
                    <Text style={styles.calloutTitle}>{location.name}</Text>
                    <Text style={styles.calloutDescription} numberOfLines={2}>
                      {location.description}
                    </Text>
                    <Text style={styles.calloutUser}>by {location.user_name}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>
      ) : (
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
      )}

      {/* Quick Stats */}
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
};

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
  toggleButton: {
    padding: 8,
    backgroundColor: '#222',
    borderRadius: 8,
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
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 200,
  },
  calloutContent: {
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  calloutUser: {
    fontSize: 12,
    color: '#999',
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

export default MapScreen;