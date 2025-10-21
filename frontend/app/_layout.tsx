import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-reminder" />
            <Stack.Screen name="incoming-call" options={{ presentation: 'fullScreenModal' }} />
          </Stack>
        </NotificationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
