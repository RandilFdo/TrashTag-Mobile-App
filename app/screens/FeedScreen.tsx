import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert, Share, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../backend/supabase/client';

const { width } = Dimensions.get('window');

interface CleanupPost {
  id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  image_url: string;
  caption: string;
  location: string;
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_before_photo: boolean;
  user_has_liked?: boolean;
}

const FeedScreen = () => {
  const [posts, setPosts] = useState<CleanupPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch posts with user details and like status
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      const { data: postsData, error } = await query;
      
      if (error) {
        console.error('Database error:', error);
        // Use demo data if database fails
        const demoPosts: CleanupPost[] = [
          {
            id: '1',
            user_id: 'demo1',
            user_name: 'Sarah M.',
            user_avatar: 'https://via.placeholder.com/50x50/ffd300/000?text=S',
            image_url: 'https://via.placeholder.com/400x300/4CAF50/fff?text=AFTER+CLEANUP',
            caption: 'Cleaned up Mount Lavinia Beach! The transformation is incredible. 🌊✨',
            location: 'Mount Lavinia Beach, Colombo',
            hashtags: ['#TrashTagLKA', '#CleanSriLanka', '#BeachCleanup'],
            likes_count: 24,
            comments_count: 8,
            created_at: new Date().toISOString(),
            is_before_photo: false,
            user_has_liked: false
          },
          {
            id: '2',
            user_id: 'demo2',
            user_name: 'Raj K.',
            user_avatar: 'https://via.placeholder.com/50x50/ffd300/000?text=R',
            image_url: 'https://via.placeholder.com/400x300/FF9800/fff?text=BEFORE+CLEANUP',
            caption: 'Found this mess at Viharamahadevi Park. Time to make a difference! 🗑️',
            location: 'Viharamahadevi Park, Colombo',
            hashtags: ['#TrashTagLKA', '#ParkCleanup', '#MakeADifference'],
            likes_count: 18,
            comments_count: 5,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            is_before_photo: true,
            user_has_liked: true
          },
          {
            id: '3',
            user_id: 'demo3',
            user_name: 'Lakshmi P.',
            user_avatar: 'https://via.placeholder.com/50x50/ffd300/000?text=L',
            image_url: 'https://via.placeholder.com/400x300/4CAF50/fff?text=AFTER+CLEANUP',
            caption: 'Galle Face Green is now spotless! Small actions, big impact. 🌱',
            location: 'Galle Face Green, Colombo',
            hashtags: ['#TrashTagLKA', '#StreetCleanup', '#BigImpact'],
            likes_count: 31,
            comments_count: 12,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            is_before_photo: false,
            user_has_liked: false
          }
        ];
        setPosts(demoPosts);
        return;
      }

      // If user is logged in, check which posts they've liked
      let postsWithLikes = postsData || [];
      
      if (user && postsData) {
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);

        const likedPostIds = new Set(likesData?.map(like => like.post_id) || []);
        
        postsWithLikes = postsData.map(post => ({
          ...post,
          user_name: post.profiles?.name || 'Anonymous User',
          user_avatar: post.profiles?.avatar_url || `https://via.placeholder.com/50x50/ffd300/000?text=${post.profiles?.name?.[0] || 'U'}`,
          user_has_liked: likedPostIds.has(post.id)
        }));
      }

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLike = async (postId: string) => {
    try {
      // For demo purposes, just toggle the like state locally
      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (p.id === postId) {
            const newLiked = !p.user_has_liked;
            return {
              ...p,
              likes_count: newLiked ? p.likes_count + 1 : p.likes_count - 1,
              user_has_liked: newLiked
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/comments?postId=${postId}`);
  };

  const handleShare = async (post: CleanupPost) => {
    try {
      const message = `Check out this amazing cleanup by ${post.user_name}!\n\n"${post.caption}"\n\nLocation: ${post.location}\n\n#TrashTagLKA #CleanSriLanka`;
      
      await Share.share({
        message,
        url: post.image_url,
      });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return postDate.toLocaleDateString();
  };

  const renderPost = (post: CleanupPost) => (
    <View key={post.id} style={styles.postCard}>
      {/* User Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user_avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user_name}</Text>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={14} color="#ffd300" />
            <Text style={styles.locationText}>{post.location}</Text>
            <Text style={styles.timestamp}> • {getTimeAgo(post.created_at)}</Text>
          </View>
        </View>
      </View>

      {/* Photo */}
      <View style={styles.photoContainer}>
        <Image source={{ uri: post.image_url }} style={styles.photo} />
        <View style={[styles.photoBadge, { backgroundColor: post.is_before_photo ? '#ff4444' : '#4CAF50' }]}>
          <Text style={styles.photoBadgeText}>
            {post.is_before_photo ? 'BEFORE' : 'AFTER'}
          </Text>
        </View>
      </View>

      {/* Caption */}
      <Text style={styles.caption}>{post.caption}</Text>

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <View style={styles.hashtagContainer}>
          {post.hashtags.map((tag, index) => (
            <Text key={index} style={styles.hashtag}>{tag}</Text>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleLike(post.id)}
        >
          <Ionicons 
            name={post.user_has_liked ? "heart" : "heart-outline"} 
            size={24} 
            color={post.user_has_liked ? "#ff4444" : "#fff"} 
          />
          <Text style={styles.actionText}>{post.likes_count}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleComment(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleShare(post)}
        >
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TrashTag Feed</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#ffd300" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.feed} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffd300"
          />
        }
      >
        {posts.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="camera" size={64} color="#666" />
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Be the first to share a cleanup!</Text>
          </View>
        ) : (
          posts.map(renderPost)
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/main/camera')}
      >
        <Ionicons name="camera" size={28} color="#000" />
      </TouchableOpacity>
    </View>
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
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: '#ffd300',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  feed: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: '#151515',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#ffd300',
    fontSize: 14,
    marginLeft: 4,
  },
  timestamp: {
    color: '#888',
    fontSize: 14,
  },
  photoContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  photoBadge: {
    position: 'absolute',
    top: 16,
    right: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  photoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  hashtag: {
    color: '#ffd300',
    fontSize: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffd300',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default FeedScreen;