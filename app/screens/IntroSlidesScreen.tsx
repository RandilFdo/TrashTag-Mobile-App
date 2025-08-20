import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onDone: () => void;
}

const slides = [
  { title: 'Snap the mess', description: 'Take a before photo of the area.' },
  { title: 'Clean it up', description: 'Do your part and clean the area.' },
  { title: 'Post & inspire', description: 'Share your transformation and earn rewards!' },
];

const IntroSlidesScreen: React.FC<Props> = ({ onDone }) => {
  const [index, setIndex] = useState(0);
  
  const next = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      onDone();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: ['#ffd300', '#111', '#000'][index] }] }>
      <Text style={[styles.title, { color: index === 0 ? '#000' : '#ffd300' }]}>
        {slides[index].title}
      </Text>
      <Text style={[styles.desc, { color: index === 0 ? '#222' : '#ddd' }]}>
        {slides[index].description}
      </Text>
      <TouchableOpacity style={styles.cta} onPress={next}>
        <Text style={styles.ctaText}>{index === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  cta: {
    backgroundColor: '#ff2d55',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default IntroSlidesScreen;
