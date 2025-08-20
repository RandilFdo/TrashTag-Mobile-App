import React from 'react';
import { router } from 'expo-router';
import LoginScreen from './screens/LoginScreen';

export default function Login() {
  return <LoginScreen onDone={() => router.replace('/profile-setup')} />;
}
