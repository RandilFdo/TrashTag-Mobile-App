import React from 'react';
import { router } from 'expo-router';
import ProfileSetupScreen from './screens/ProfileSetupScreen';

export default function ProfileSetup() {
  return <ProfileSetupScreen onDone={() => router.replace('/main/feed')} />;
}
