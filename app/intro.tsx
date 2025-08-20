import React from 'react';
import { router } from 'expo-router';
import IntroSlidesScreen from './screens/IntroSlidesScreen';

export default function Intro() {
  return <IntroSlidesScreen onDone={() => router.replace('/login')} />;
}
