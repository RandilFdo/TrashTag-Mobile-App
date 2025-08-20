import React, { useEffect } from 'react';
import SplashScreen from './SplashScreen';

interface Props {
  onDone: () => void;
}

const SplashGate: React.FC<Props> = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return <SplashScreen />;
};

export default SplashGate;
