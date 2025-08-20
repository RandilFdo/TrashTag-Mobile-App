import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { supabase } from '../../backend/supabase/client';
import * as FileSystem from 'expo-file-system';

interface RouteParams {
  photoUri: string;
  isBeforePhoto: boolean;
}

const CreatePostScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { photoUri, isBeforePhoto } = route.params as RouteParams;
  
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address[0]) {
        const city = address[0].city || address[0].subregion || 'Unknown Location';
        setLocation(city);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!caption.trim()) {
      Alert.alert('Error', 'Please add a caption to your post');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please add a location to your post');
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to create a post');
        return;
      }

      // Upload photo to Supabase storage
      const fileName = `posts/${user.id}/${Date.now()}.jpg`;
      const photoBase64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, decode(photoBase64), {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      // Parse hashtags
      const hashtagArray = hashtags
        .split(' ')
        .filter(tag => tag.trim().startsWith('#'))
        .map(tag => tag.trim());

      // Save post to database
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          image_url: publicUrl,
          caption: caption.trim(),
          location: location.trim(),
          hashtags: hashtagArray,
          is_before_photo: isBeforePhoto,
          likes_count: 0,
          comments_count: 0
        }])
        .select()
        .single();

      if (postError) {
        console.error('Post creation error:', postError);
        throw new Error('Failed to create post');
      }

      setLoading(false);
      Alert.alert(
        'Success!', 
        'Your cleanup post has been created!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Feed' })
          }
        ]
      );
      
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  // Helper function to decode base64
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const suggestedHashtags = [
    '#TrashTagLKA',
    '#CleanSriLanka', 
    '#BeforeAfter',
    '#EnvironmentalCleanup',
    '#MakeADifference'
  ];

  const addHashtag = (tag: string) => {
    const currentTags = hashtags.split(' ').filter(t => t.trim());
    if (!currentTags.includes(tag)) {
      setHashtags([...currentTags, tag].join(' '));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handleCreatePost} disabled={loading}>
          <Text style={[styles.postButton, loading && styles.disabledButton]}>
            {loading ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.photoSection}>
        <Image source={{ uri: photoUri }} style={styles.photo} />
        <View style={[styles.photoBadge, { backgroundColor: isBeforePhoto ? '#ff4444' : '#4CAF50' }]}>
          <Text style={styles.photoBadgeText}>
            {isBeforePhoto ? 'BEFORE' : 'AFTER'}
          </Text>
        </View>
      </View>

      <View style={styles.formSection}>
        <TextInput
          style={styles.captionInput}
          placeholder="What did you clean up? Share your story..."
          placeholderTextColor="#888"
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={4}
        />

        <View style={styles.locationSection}>
          <Ionicons name="location" size={20} color="#ffd300" />
          <TextInput
            style={styles.locationInput}
            placeholder="Location"
            placeholderTextColor="#888"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.hashtagSection}>
          <Text style={styles.sectionTitle}>Suggested Hashtags</Text>
          <View style={styles.hashtagContainer}>
            {suggestedHashtags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.hashtagButton}
                onPress={() => addHashtag(tag)}
              >
                <Text style={styles.hashtagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.hashtagInput}
            placeholder="Add custom hashtags..."
            placeholderTextColor="#888"
            value={hashtags}
            onChangeText={setHashtags}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    color: '#ffd300',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  photoSection: {
    position: 'relative',
    margin: 16,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  photoBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  photoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  formSection: {
    padding: 16,
  },
  captionInput: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  locationInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  hashtagSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  hashtagButton: {
    backgroundColor: '#ffd300',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  hashtagInput: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
});

export default CreatePostScreen;
