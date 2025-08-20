import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../backend/supabase/client';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

interface Props {
  onDone: () => void;
}

const LoginScreen: React.FC<Props> = ({ onDone }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (user) {
      navigation.replace('ProfileSetup');
    }
  }, [user, navigation]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const redirectUrl = Linking.createURL('/');
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });
      if (error) throw error;
      // Google OAuth will redirect to browser, then back to app
      // For now, just go to next step
      setTimeout(() => {
        setLoading(false);
        onDone();
      }, 1000);
    } catch (e: any) {
      Alert.alert('Google Sign-In Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // For now, just simulate a successful login and go directly to ProfileSetup
      // In a real app, you'd validate the email/password here
      setTimeout(() => {
        setLoading(false);
        onDone();
      }, 1000);
      
    } catch (e: any) {
      Alert.alert('Email Sign-In Error', e.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in or sign up</Text>
      
      <TextInput
        style={styles.input}
        placeholder="email@example.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.primaryBtn, loading && styles.disabledBtn]} 
        onPress={handleEmailSignIn} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.primaryText}>Continue</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity 
        style={[styles.googleBtn, loading && styles.disabledBtn]} 
        onPress={handleGoogleSignIn} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.googleText}>Continue with Google</Text>
        )}
      </TouchableOpacity>
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
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '800', 
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    width: 280,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#151515',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryBtn: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryText: { 
    color: '#000', 
    fontWeight: '800', 
    fontSize: 16 
  },
  or: { 
    color: '#999', 
    marginVertical: 16,
    fontSize: 16
  },
  googleBtn: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  googleText: { 
    color: '#000', 
    fontWeight: '700', 
    fontSize: 16 
  },
  disabledBtn: {
    opacity: 0.6,
  },
});

export default LoginScreen;
