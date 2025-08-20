import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

export default function CreatePost() {
  const params = useLocalSearchParams();
  const photoUri = params.photoUri as string;
  const isBeforePhoto = params.isBeforePhoto === 'true';
  
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationName = [
          address.street,
          address.city,
          address.region,
          address.country
        ].filter(Boolean).join(', ');
        setLocation(locationName);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handlePost = async () => {
    if (!caption.trim()) {
      Alert.alert('Error', 'Please add a caption to your post');
      return;
    }

    setLoading(true);
    try {
      // Here you would typically upload the image to your backend
      // and create the post in your database
      
      // For now, we'll just simulate a successful post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => router.replace('/main/feed') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={loading}>
          <Text style={[styles.postButton, loading && styles.postButtonDisabled]}>
            {loading ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>
              {isBeforePhoto ? '📸 Before' : '✨ After'}
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="What did you clean up?"
            placeholderTextColor="#888"
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#ffd300" />
          <TextInput
            style={styles.locationInput}
            placeholder="Add location"
            placeholderTextColor="#888"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for a great post:</Text>
          <Text style={styles.tipText}>• Describe what you cleaned up</Text>
          <Text style={styles.tipText}>• Mention the impact you made</Text>
          <Text style={styles.tipText}>• Tag the location accurately</Text>
          <Text style={styles.tipText}>• Inspire others to join the movement!</Text>
        </View>
      </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  postButton: {
    color: '#ffd300',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonDisabled: {
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 15,
  },
  photoBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  photoBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  captionInput: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 30,
  },
  locationInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  tipsContainer: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  tipsTitle: {
    color: '#ffd300',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tipText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
});
