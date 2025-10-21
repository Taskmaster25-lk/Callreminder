import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  checkReminders: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const { token } = useAuth();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotifications();

    // Listen for notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.reminderId) {
        // Navigate to incoming call screen
        router.push({
          pathname: '/incoming-call',
          params: data
        });
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Poll for reminders every minute
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token]);

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data);
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  };

  const checkReminders = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/reminders/check`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const reminders = await response.json();
        
        // Trigger notifications for upcoming reminders
        for (const reminder of reminders) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Call ${reminder.name_to_call}`,
              body: reminder.description || 'Reminder to make a call',
              sound: 'default',
              data: {
                reminderId: reminder.id,
                nameToCall: reminder.name_to_call,
                phoneNumber: reminder.phone_number,
                description: reminder.description
              }
            },
            trigger: null, // Immediate notification
          });
        }
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ expoPushToken, checkReminders }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
