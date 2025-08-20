import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ProfileSetupScreen from './ProfileSetupScreen';

const ProfileSetupWrapper: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <ProfileSetupScreen onDone={() => navigation.replace('MainApp')} />
  );
};

export default ProfileSetupWrapper;

