import React, { useEffect } from 'react';
import { router } from 'expo-router';
import SplashScreen from './screens/SplashScreen';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/intro');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}
