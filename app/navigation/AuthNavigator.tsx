import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashGate from '../screens/SplashGate';
import IntroSlidesScreen from '../screens/IntroSlidesScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import MainAppNavigator from './MainAppNavigator';
import { AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const [step, setStep] = useState<'splash' | 'intro' | 'login' | 'profile' | 'main'>('splash');

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('intro'), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Simple step-based navigation for now
  if (step === 'splash') return <SplashGate onDone={() => setStep('intro')} />;
  if (step === 'intro') return <IntroSlidesScreen onDone={() => setStep('login')} />;
  if (step === 'login') return <LoginScreen onDone={() => setStep('profile')} />;
  if (step === 'profile') return <ProfileSetupScreen onDone={() => setStep('main')} />;
  if (step === 'main') return <MainAppNavigator />;

  return (
    <Stack.Navigator id={undefined as any} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashGate} />
      <Stack.Screen name="Intro" component={IntroSlidesScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="MainApp" component={MainAppNavigator} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
