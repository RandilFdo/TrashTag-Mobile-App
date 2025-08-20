import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

interface Props {
  onDone: () => void;
}

const ProfileSetupScreen: React.FC<Props> = ({ onDone }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [crew, setCrew] = useState('');

  const handleSubmit = () => {
    if (!name || !city) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    
    // Go directly to MainApp - quick transition like splash screen
    onDone();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>
      {/* Profile picture upload can be added here */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Crew (optional)"
        value={crew}
        onChangeText={setCrew}
      />
      <Button title="Complete Setup" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#ffd300',
  },
  input: {
    width: 250,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#151515',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default ProfileSetupScreen;
