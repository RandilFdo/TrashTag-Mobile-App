import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface CleanupHistory {
  id: string;
  beforePhoto: string;
  afterPhoto: string;
  location: string;
  timestamp: string;
  likes: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user] = useState({
    name: 'Sarah M.',
    avatar: 'https://via.placeholder.com/100x100/ffd300/000?text=S',
    city: 'Colombo',
    crew: 'Eco Warriors',
    joinDate: 'March 2024',
    totalCleanups: 12,
    totalLikes: 156,
    totalPoints: 1240,
    rank: 'Gold Cleaner'
  });

  const [cleanupHistory] = useState<CleanupHistory[]>([
    {
      id: '1',
      beforePhoto: 'https://via.placeholder.com/80x80/ff4444/fff?text=B',
      afterPhoto: 'https://via.placeholder.com/80x80/4CAF50/fff?text=A',
      location: 'Mount Lavinia Beach',
      timestamp: '2 hours ago',
      likes: 24
    },
    {
      id: '2',
      beforePhoto: 'https://via.placeholder.com/80x80/ff4444/fff?text=B',
      afterPhoto: 'https://via.placeholder.com/80x80/4CAF50/fff?text=A',
      location: 'Viharamahadevi Park',
      timestamp: '5 hours ago',
      likes: 18
    },
    {
      id: '3',
      beforePhoto: 'https://via.placeholder.com/80x80/ff4444/fff?text=B',
      afterPhoto: 'https://via.placeholder.com/80x80/4CAF50/fff?text=A',
      location: 'Galle Face Green',
      timestamp: '1 day ago',
      likes: 32
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Cleanup',
      description: 'Complete your first cleanup',
      icon: 'star',
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: '2',
      title: 'Beach Guardian',
      description: 'Clean up 5 beach areas',
      icon: 'water',
      unlocked: true,
      progress: 5,
      maxProgress: 5
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Get 100 likes on your posts',
      icon: 'heart',
      unlocked: false,
      progress: 156,
      maxProgress: 100
    },
    {
      id: '4',
      title: 'Consistent Cleaner',
      description: 'Complete 10 cleanups',
      icon: 'checkmark-circle',
      unlocked: false,
      progress: 12,
      maxProgress: 10
    }
  ]);

  const renderAchievement = (achievement: Achievement) => (
    <View key={achievement.id} style={styles.achievementCard}>
      <View style={styles.achievementIcon}>
        <Ionicons 
          name={achievement.icon as any} 
          size={32} 
          color={achievement.unlocked ? '#ffd300' : '#666'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementTitle,
          achievement.unlocked && styles.achievementUnlocked
        ]}>
          {achievement.title}
        </Text>
        <Text style={styles.achievementDescription}>
          {achievement.description}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {achievement.progress}/{achievement.maxProgress}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRank}>{user.rank}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userLocation}>📍 {user.city}</Text>
          <Text style={styles.userCrew}>👥 {user.crew}</Text>
        </View>
        <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.totalCleanups}</Text>
          <Text style={styles.statLabel}>Cleanups</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.totalLikes}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      {/* Recent Cleanups */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Cleanups</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cleanupHistory.map((cleanup) => (
            <View key={cleanup.id} style={styles.cleanupCard}>
              <View style={styles.cleanupPhotos}>
                <Image source={{ uri: cleanup.beforePhoto }} style={styles.cleanupPhoto} />
                <Image source={{ uri: cleanup.afterPhoto }} style={styles.cleanupPhoto} />
              </View>
              <Text style={styles.cleanupLocation}>{cleanup.location}</Text>
              <Text style={styles.cleanupTime}>{cleanup.timestamp}</Text>
              <View style={styles.cleanupStats}>
                <Ionicons name="heart" size={16} color="#ff4444" />
                <Text style={styles.cleanupLikes}>{cleanup.likes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map(renderAchievement)}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person" size={24} color="#ffd300" />
          <Text style={styles.settingText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={24} color="#ffd300" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="shield-checkmark" size={24} color="#ffd300" />
          <Text style={styles.settingText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle" size={24} color="#ffd300" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#111',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userRank: {
    color: '#ffd300',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userLocation: {
    color: '#fff',
    marginRight: 16,
  },
  userCrew: {
    color: '#fff',
  },
  joinDate: {
    color: '#888',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffd300',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffd300',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#ffd300',
    fontSize: 14,
  },
  cleanupCard: {
    width: 160,
    marginLeft: 16,
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 12,
  },
  cleanupPhotos: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cleanupPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  cleanupLocation: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  cleanupTime: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  cleanupStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanupLikes: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#151515',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  achievementIcon: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementUnlocked: {
    color: '#ffd300',
  },
  achievementDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffd300',
    borderRadius: 2,
  },
  progressText: {
    color: '#888',
    fontSize: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  settingText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default ProfileScreen;
