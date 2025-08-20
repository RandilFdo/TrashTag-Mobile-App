import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MainTabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'challenges') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffd300',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#333',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="camera" options={{ title: 'Camera' }} />
      <Tabs.Screen name="challenges" options={{ title: 'Challenges' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}



