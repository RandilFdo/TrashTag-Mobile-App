import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: string;
  rewardIcon: string;
  deadline: string;
  type: 'daily' | 'weekly' | 'monthly';
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  cleanups: number;
}

const ChallengesScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'challenges' | 'leaderboard' | 'rewards'>('challenges');
  
  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Beach Guardian',
      description: 'Clean up 3 beach areas this week',
      icon: 'water',
      progress: 2,
      target: 3,
      reward: '50 Points + Beach Badge',
      rewardIcon: 'star',
      deadline: '3 days left',
      type: 'weekly'
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Get 25 likes on your posts',
      icon: 'heart',
      progress: 18,
      target: 25,
      reward: '30 Points',
      rewardIcon: 'heart',
      deadline: '5 days left',
      type: 'weekly'
    },
    {
      id: '3',
      title: 'Consistent Cleaner',
      description: 'Complete 5 cleanups this week',
      icon: 'checkmark-circle',
      progress: 3,
      target: 5,
      reward: '75 Points + Consistency Badge',
      rewardIcon: 'trophy',
      deadline: '4 days left',
      type: 'weekly'
    },
    {
      id: '4',
      title: 'Early Bird',
      description: 'Complete a cleanup before 9 AM',
      icon: 'sunny',
      progress: 0,
      target: 1,
      reward: '20 Points',
      rewardIcon: 'sunny',
      deadline: 'Today',
      type: 'daily'
    }
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Sarah M.', avatar: 'https://via.placeholder.com/40x40/ffd300/000?text=S', points: 1240, cleanups: 12 },
    { rank: 2, name: 'Raj K.', avatar: 'https://via.placeholder.com/40x40/4CAF50/fff?text=R', points: 1180, cleanups: 11 },
    { rank: 3, name: 'Lakshmi P.', avatar: 'https://via.placeholder.com/40x40/FF9800/fff?text=L', points: 1050, cleanups: 9 },
    { rank: 4, name: 'Alex T.', avatar: 'https://via.placeholder.com/40x40/9C27B0/fff?text=A', points: 920, cleanups: 8 },
    { rank: 5, name: 'Maya S.', avatar: 'https://via.placeholder.com/40x40/607D8B/fff?text=M', points: 850, cleanups: 7 }
  ]);

  const [rewards] = useState([
    { id: '1', title: 'Beach Guardian', icon: 'water', unlocked: true, points: 50 },
    { id: '2', title: 'Consistency Badge', icon: 'checkmark-circle', unlocked: true, points: 75 },
    { id: '3', title: 'Social Butterfly', icon: 'heart', unlocked: false, points: 100 },
    { id: '4', title: 'Eco Warrior', icon: 'leaf', unlocked: false, points: 200 },
    { id: '5', title: 'Master Cleaner', icon: 'trophy', unlocked: false, points: 500 }
  ]);

  const renderChallenge = (challenge: Challenge) => {
    const progressPercentage = (challenge.progress / challenge.target) * 100;
    const isCompleted = challenge.progress >= challenge.target;
    
    return (
      <View key={challenge.id} style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <View style={styles.challengeIcon}>
            <Ionicons name={challenge.icon as any} size={24} color="#ffd300" />
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>
            <Text style={styles.challengeDeadline}>{challenge.deadline}</Text>
          </View>
          <View style={styles.challengeType}>
            <Text style={styles.typeText}>{challenge.type.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${Math.min(progressPercentage, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {challenge.progress}/{challenge.target}
          </Text>
        </View>
        
        <View style={styles.rewardSection}>
          <Ionicons name={challenge.rewardIcon as any} size={20} color="#ffd300" />
          <Text style={styles.rewardText}>{challenge.reward}</Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>COMPLETED!</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => (
    <View key={entry.rank} style={styles.leaderboardRow}>
      <View style={styles.rankSection}>
        <Text style={[
          styles.rankNumber,
          index < 3 && styles.topRank
        ]}>
          #{entry.rank}
        </Text>
      </View>
      <Image source={{ uri: entry.avatar }} style={styles.leaderboardAvatar} />
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{entry.name}</Text>
        <Text style={styles.leaderboardStats}>
          {entry.cleanups} cleanups • {entry.points} points
        </Text>
      </View>
      {index < 3 && (
        <View style={styles.medal}>
          <Ionicons 
            name="trophy" 
            size={24} 
            color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
          />
        </View>
      )}
    </View>
  );

  const renderReward = (reward: any) => (
    <View key={reward.id} style={styles.rewardCard}>
      <View style={styles.rewardIcon}>
        <Ionicons 
          name={reward.icon as any} 
          size={32} 
          color={reward.unlocked ? '#ffd300' : '#666'} 
        />
      </View>
      <View style={styles.rewardInfo}>
        <Text style={[
          styles.rewardTitle,
          reward.unlocked && styles.rewardUnlocked
        ]}>
          {reward.title}
        </Text>
        <Text style={styles.rewardPoints}>{reward.points} points</Text>
      </View>
      {reward.unlocked && (
        <View style={styles.unlockedBadge}>
          <Ionicons name="checkmark" size={20} color="#4CAF50" />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges & Rewards</Text>
        <TouchableOpacity style={styles.statsButton}>
          <Ionicons name="stats-chart" size={24} color="#ffd300" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'challenges' && styles.activeTab]}
          onPress={() => setSelectedTab('challenges')}
        >
          <Text style={[styles.tabText, selectedTab === 'challenges' && styles.activeTabText]}>
            Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setSelectedTab('leaderboard')}
        >
          <Text style={[styles.tabText, selectedTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'rewards' && styles.activeTab]}
          onPress={() => setSelectedTab('rewards')}
        >
          <Text style={[styles.tabText, selectedTab === 'rewards' && styles.activeTabText]}>
            Rewards
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'challenges' && (
          <View>
            {challenges.map(renderChallenge)}
          </View>
        )}
        
        {selectedTab === 'leaderboard' && (
          <View>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.leaderboardTitle}>This Week's Top Cleaners</Text>
              <Text style={styles.leaderboardSubtitle}>Resets every Sunday</Text>
            </View>
            {leaderboard.map(renderLeaderboardEntry)}
          </View>
        )}
        
        {selectedTab === 'rewards' && (
          <View>
            <Text style={styles.rewardsTitle}>Your Badges & Achievements</Text>
            {rewards.map(renderReward)}
          </View>
        )}
      </ScrollView>
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
  statsButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#ffd300',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  challengeCard: {
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengeDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  challengeDeadline: {
    color: '#ffd300',
    fontSize: 12,
    fontWeight: '600',
  },
  challengeType: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeText: {
    color: '#ffd300',
    fontSize: 10,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffd300',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  rewardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardText: {
    color: '#ffd300',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  leaderboardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  leaderboardTitle: {
    color: '#ffd300',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rankSection: {
    width: 50,
    alignItems: 'center',
  },
  rankNumber: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topRank: {
    color: '#ffd300',
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  leaderboardStats: {
    color: '#888',
    fontSize: 14,
  },
  medal: {
    marginLeft: 16,
  },
  rewardsTitle: {
    color: '#ffd300',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rewardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardUnlocked: {
    color: '#ffd300',
  },
  rewardPoints: {
    color: '#888',
    fontSize: 14,
  },
  unlockedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 8,
  },
});

export default ChallengesScreen;

