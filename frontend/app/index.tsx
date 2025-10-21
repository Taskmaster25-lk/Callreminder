import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';
import { router } from 'expo-router';

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (user) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/auth/login');
        }
      }, 2000);
    }
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="call" size={60} color="#4F46E5" />
        </View>
        <Text style={styles.appName}>CallMeBack</Text>
        <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  loader: {
    marginTop: 16,
  },
});
