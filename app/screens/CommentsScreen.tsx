import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../backend/supabase/client';

interface RouteParams {
  postId: string;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

const CommentsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { postId } = route.params as RouteParams;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [postDetails, setPostDetails] = useState<any>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Fetch post details
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .eq('id', postId)
        .single();

      if (postError) throw postError;
      setPostDetails(postData);

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      const formattedComments = (commentsData || []).map(comment => ({
        ...comment,
        user_name: comment.profiles?.name || 'Anonymous User',
        user_avatar: comment.profiles?.avatar_url || `https://via.placeholder.com/40x40/ffd300/000?text=${comment.profiles?.name?.[0] || 'U'}`
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComments();
    }, [postId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchComments();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to comment');
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        }])
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update comments count on post
      await supabase
        .from('posts')
        .update({ comments_count: comments.length + 1 })
        .eq('id', postId);

      // Add new comment to list
      const newCommentWithUser = {
        ...data,
        user_name: data.profiles?.name || 'Anonymous User',
        user_avatar: data.profiles?.avatar_url || `https://via.placeholder.com/40x40/ffd300/000?text=${data.profiles?.name?.[0] || 'U'}`
      };

      setComments(prev => [...prev, newCommentWithUser]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now.getTime() - commentDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Post Preview */}
      {postDetails && (
        <View style={styles.postPreview}>
          <Image source={{ uri: postDetails.image_url }} style={styles.postImage} />
          <View style={styles.postInfo}>
            <Text style={styles.postCaption} numberOfLines={2}>
              {postDetails.caption}
            </Text>
            <Text style={styles.postLocation}>{postDetails.location}</Text>
          </View>
        </View>
      )}

      {/* Comments List */}
      <ScrollView 
        style={styles.commentsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffd300"
          />
        }
      >
        {comments.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color="#666" />
            <Text style={styles.emptyStateText}>No comments yet</Text>
            <Text style={styles.emptyStateSubtext}>Be the first to comment!</Text>
          </View>
        ) : (
          comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image source={{ uri: comment.user_avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUserName}>{comment.user_name}</Text>
                  <Text style={styles.commentTime}>{getTimeAgo(comment.created_at)}</Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor="#888"
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={newComment.trim() ? "#ffd300" : "#666"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  postPreview: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  postCaption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  postLocation: {
    color: '#ffd300',
    fontSize: 12,
  },
  commentsList: {
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
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 14,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    color: '#888',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#222',
  },
});

export default CommentsScreen;
