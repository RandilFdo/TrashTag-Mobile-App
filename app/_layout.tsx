import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';

export default function AppLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="intro" />
        <Stack.Screen name="login" />
        <Stack.Screen name="profile-setup" />
        <Stack.Screen name="main" />
        <Stack.Screen name="create-post" />
        <Stack.Screen name="comments" />
      </Stack>
    </AuthProvider>
  );
}
