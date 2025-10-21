import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from './context/AuthContext';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 80;
const BUTTON_SIZE = 60;

export default function IncomingCallScreen() {
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const [showButtons, setShowButtons] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideCallAnim = useRef(new Animated.Value(0)).current;
  const slideCancelAnim = useRef(new Animated.Value(0)).current;

  const nameToCall = params.nameToCall as string || params.name_to_call as string || 'Unknown';
  const phoneNumber = params.phoneNumber as string || params.phone_number as string || '';
  const description = params.description as string || '';
  const reminderId = params.reminderId as string || params.id as string;

  useEffect(() => {
    // Play beep sound for 3 seconds (simulated)
    const beepTimer = setTimeout(() => {
      setShowButtons(true);
    }, 3000);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearTimeout(beepTimer);
  }, []);

  const handleCall = async () => {
    try {
      await Linking.openURL(`tel:${phoneNumber}`);
      
      // Mark reminder as completed
      if (reminderId && token) {
        await fetch(`${API_URL}/api/reminders/${reminderId}/complete`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Could not open phone dialer');
    }
  };

  const handleCancel = async () => {
    // Mark reminder as completed
    if (reminderId && token) {
      await fetch(`${API_URL}/api/reminders/${reminderId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    router.back();
  };

  // Pan responder for slide to call
  const panResponderCall = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0 && gestureState.dx <= SLIDE_WIDTH - BUTTON_SIZE) {
        slideCallAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > SLIDE_WIDTH - BUTTON_SIZE - 50) {
        handleCall();
      } else {
        Animated.spring(slideCallAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // Pan responder for slide to cancel
  const panResponderCancel = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0 && gestureState.dx <= SLIDE_WIDTH - BUTTON_SIZE) {
        slideCancelAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > SLIDE_WIDTH - BUTTON_SIZE - 50) {
        handleCancel();
      } else {
        Animated.spring(slideCancelAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={80} color="#ffffff" />
          </View>
        </Animated.View>

        <Text style={styles.name}>{nameToCall}</Text>
        <Text style={styles.phone}>{phoneNumber}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}

        {!showButtons && (
          <View style={styles.beepContainer}>
            <Ionicons name="volume-high" size={32} color="#ffffff" />
            <Text style={styles.beepText}>Ring... Ring...</Text>
          </View>
        )}

        {showButtons && (
          <View style={styles.actionsContainer}>
            <View style={styles.slideContainer}>
              <View style={styles.slideTrack}>
                <Text style={styles.slideText}>Slide to Call</Text>
                <Ionicons name="chevron-forward" size={24} color="#ffffff" style={styles.chevron} />
              </View>
              <Animated.View
                style={[
                  styles.slideButton,
                  styles.callButton,
                  {
                    transform: [{ translateX: slideCallAnim }],
                  },
                ]}
                {...panResponderCall.panHandlers}
              >
                <Ionicons name="call" size={28} color="#ffffff" />
              </Animated.View>
            </View>

            <View style={styles.slideContainer}>
              <View style={[styles.slideTrack, styles.cancelTrack]}>
                <Text style={styles.slideText}>Slide to Cancel</Text>
                <Ionicons name="chevron-forward" size={24} color="#ffffff" style={styles.chevron} />
              </View>
              <Animated.View
                style={[
                  styles.slideButton,
                  styles.cancelButton,
                  {
                    transform: [{ translateX: slideCancelAnim }],
                  },
                ]}
                {...panResponderCancel.panHandlers}
              >
                <Ionicons name="close" size={28} color="#ffffff" />
              </Animated.View>
            </View>

            <TouchableOpacity style={styles.dismissButton} onPress={handleCancel}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  avatarContainer: {
    marginBottom: 40,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#6366F1',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  phone: {
    fontSize: 18,
    color: '#D1D5DB',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  beepContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  beepText: {
    fontSize: 20,
    color: '#ffffff',
    marginTop: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 60,
  },
  slideContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  slideTrack: {
    height: 60,
    backgroundColor: '#10B981',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  cancelTrack: {
    backgroundColor: '#EF4444',
  },
  slideText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  chevron: {
    opacity: 0.5,
  },
  slideButton: {
    position: 'absolute',
    left: 0,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  callButton: {
    backgroundColor: '#059669',
  },
  cancelButton: {
    backgroundColor: '#DC2626',
  },
  dismissButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  dismissText: {
    color: '#9CA3AF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
