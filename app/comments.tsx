import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../backend/supabase/client';

interface Comment {
  id: string;
  content: string;
  user_name: string;
  user_avatar: string;
  created_at: string;
}

export default function Comments() {
  const params = useLocalSearchParams();
  const postId = params.postId as string;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      const formattedComments = data?.map(comment => ({
        id: comment.id,
        content: comment.content,
        user_name: comment.profiles?.name || 'Anonymous User',
        user_avatar: comment.profiles?.avatar_url || `https://via.placeholder.com/40x40/ffd300/000?text=${comment.profiles?.name?.[0] || 'U'}`,
        created_at: comment.created_at
      })) || [];

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // For demo purposes, add some mock comments
      setComments([
        {
          id: '1',
          content: 'Amazing work! This place looks so much better now.',
          user_name: 'Sarah M.',
          user_avatar: 'https://via.placeholder.com/40x40/ffd300/000?text=S',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          content: 'Inspiring! Keep up the great work! 🌱',
          user_name: 'Raj K.',
          user_avatar: 'https://via.placeholder.com/40x40/ffd300/000?text=R',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to comment');
        return;
      }

      // For demo purposes, just add to local state
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: newComment,
        user_name: 'You',
        user_avatar: 'https://via.placeholder.com/40x40/ffd300/000?text=Y',
        created_at: new Date().toISOString()
      };

      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMs = now.getTime() - commentDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.commentsList}>
        {comments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color="#666" />
            <Text style={styles.emptyStateText}>No comments yet</Text>
            <Text style={styles.emptyStateSubtext}>Be the first to comment!</Text>
          </View>
        ) : (
          comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.user_name}</Text>
                <Text style={styles.commentTime}>{getTimeAgo(comment.created_at)}</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#888"
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
          onPress={addComment}
          disabled={!newComment.trim() || loading}
        >
          <Ionicons name="send" size={20} color={newComment.trim() ? "#ffd300" : "#666"} />
        </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
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
  commentItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    color: '#ffd300',
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    color: '#888',
    fontSize: 12,
  },
  commentContent: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
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
