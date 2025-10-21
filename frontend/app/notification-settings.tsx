import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RINGTONES = [
  { id: 'default', name: 'Default Ringtone', icon: 'musical-notes' },
  { id: 'classic', name: 'Classic Phone', icon: 'call' },
  { id: 'gentle', name: 'Gentle Bell', icon: 'notifications' },
  { id: 'urgent', name: 'Urgent Alert', icon: 'alert-circle' },
  { id: 'melody', name: 'Soft Melody', icon: 'flower' },
  { id: 'digital', name: 'Digital Beep', icon: 'apps' },
];

export default function NotificationSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [selectedRingtone, setSelectedRingtone] = useState('default');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  const handleSaveSettings = async () => {
    try {
      await AsyncStorage.setItem('notification_settings', JSON.stringify({
        pushEnabled,
        soundEnabled,
        vibrationEnabled,
        selectedRingtone,
        quietHoursEnabled,
      }));
      Alert.alert('Success', 'Notification settings saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const playRingtone = (ringtoneId: string) => {
    Alert.alert('Preview', `Playing ${RINGTONES.find(r => r.id === ringtoneId)?.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleSaveSettings}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#4F46E5" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive reminder alerts</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
              thumbColor={pushEnabled ? '#4F46E5' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={24} color="#4F46E5" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Sound</Text>
                <Text style={styles.settingDescription}>Play notification sound</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
              thumbColor={soundEnabled ? '#4F46E5' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={24} color="#4F46E5" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Vibration</Text>
                <Text style={styles.settingDescription}>Vibrate on notifications</Text>
              </View>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
              thumbColor={vibrationEnabled ? '#4F46E5' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringtone Selection</Text>
          <Text style={styles.sectionDescription}>
            Choose the sound that plays when a reminder is triggered
          </Text>
          
          {RINGTONES.map((ringtone) => (
            <TouchableOpacity
              key={ringtone.id}
              style={[
                styles.ringtoneItem,
                selectedRingtone === ringtone.id && styles.ringtoneItemSelected
              ]}
              onPress={() => setSelectedRingtone(ringtone.id)}
            >
              <View style={styles.ringtoneInfo}>
                <View style={[
                  styles.ringtoneIcon,
                  selectedRingtone === ringtone.id && styles.ringtoneIconSelected
                ]}>
                  <Ionicons
                    name={ringtone.icon as any}
                    size={20}
                    color={selectedRingtone === ringtone.id ? '#4F46E5' : '#6B7280'}
                  />
                </View>
                <Text style={[
                  styles.ringtoneName,
                  selectedRingtone === ringtone.id && styles.ringtoneNameSelected
                ]}>
                  {ringtone.name}
                </Text>
              </View>
              <View style={styles.ringtoneActions}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => playRingtone(ringtone.id)}
                >
                  <Ionicons name="play" size={16} color="#4F46E5" />
                </TouchableOpacity>
                {selectedRingtone === ringtone.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color="#4F46E5" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Enable Quiet Hours</Text>
                <Text style={styles.settingDescription}>Mute notifications during sleep</Text>
              </View>
            </View>
            <Switch
              value={quietHoursEnabled}
              onValueChange={setQuietHoursEnabled}
              trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
              thumbColor={quietHoursEnabled ? '#4F46E5' : '#f4f3f4'}
            />
          </View>

          {quietHoursEnabled && (
            <View style={styles.quietHoursConfig}>
              <TouchableOpacity style={styles.timeButton}>
                <Ionicons name="time" size={20} color="#6B7280" />
                <Text style={styles.timeButtonText}>Start: 10:00 PM</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.timeButton}>
                <Ionicons name="time" size={20} color="#6B7280" />
                <Text style={styles.timeButtonText}>End: 7:00 AM</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#4F46E5" />
          <Text style={styles.infoText}>
            Notifications will display as an incoming call screen when a reminder is triggered.
            You can slide to call or cancel the reminder.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    paddingHorizontal: 8,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  ringtoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ringtoneItemSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  ringtoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  ringtoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringtoneIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  ringtoneName: {
    fontSize: 16,
    color: '#1F2937',
  },
  ringtoneNameSelected: {
    fontWeight: '600',
    color: '#4F46E5',
  },
  ringtoneActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quietHoursConfig: {
    gap: 8,
    marginTop: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  timeButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4F46E5',
    lineHeight: 20,
  },
});
