import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = () => (
  <View style={styles.container}>
    <View style={styles.logoCircle} />
    <Text style={styles.logoText}>TrashTag Lanka</Text>
    <Text style={styles.tagline}>Clean it. Snap it. Trend it.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffd300',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    marginTop: 6,
  },
});

export default SplashScreen;
