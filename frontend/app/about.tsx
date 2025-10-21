import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const APP_VERSION = '1.0.0';
const DEVELOPER_EMAIL = 'klabhesh222@gmail.com';

export default function AboutScreen() {
  const handleEmailDeveloper = () => {
    Linking.openURL(`mailto:${DEVELOPER_EMAIL}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="call" size={48} color="#4F46E5" />
          </View>
          <Text style={styles.appName}>CallMeBack</Text>
          <Text style={styles.version}>Version {APP_VERSION}</Text>
        </View>

        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            CallMeBack helps you never miss an important call by sending you timely reminders with
            an intuitive, call-like interface. Stay connected with the people who matter most.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={24} color="#4F46E5" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Reminders</Text>
              <Text style={styles.featureDescription}>
                Get notified with a realistic incoming call interface
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="people" size={24} color="#4F46E5" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Contact Integration</Text>
              <Text style={styles.featureDescription}>
                Select from contacts or add manually
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="star" size={24} color="#4F46E5" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Premium Features</Text>
              <Text style={styles.featureDescription}>
                Unlimited reminders and custom ringtones
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="gift" size={24} color="#4F46E5" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Referral Rewards</Text>
              <Text style={styles.featureDescription}>
                Earn 15 days of Premium for 5 referrals
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology</Text>
          <View style={styles.techCard}>
            <Text style={styles.techText}>Built with React Native, Expo, and FastAPI</Text>
            <Text style={styles.techDescription}>
              Designed for performance, security, and a native-like experience on both iOS and Android.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <TouchableOpacity style={styles.developerCard} onPress={handleEmailDeveloper}>
            <View style={styles.developerAvatar}>
              <Ionicons name="person" size={32} color="#4F46E5" />
            </View>
            <View style={styles.developerInfo}>
              <Text style={styles.developerName}>Independent Developer</Text>
              <Text style={styles.developerEmail}>{DEVELOPER_EMAIL}</Text>
            </View>
            <Ionicons name="mail" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.acknowledgments}>
          <Text style={styles.sectionTitle}>Acknowledgments</Text>
          <Text style={styles.acknowledgmentText}>
            Thanks to all users who provide feedback and help make CallMeBack better every day.
            Special thanks to the open-source community for the amazing tools and libraries.
          </Text>
        </View>

        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>© 2025 CallMeBack</Text>
          <Text style={styles.copyrightSubtext}>All rights reserved</Text>
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
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#6B7280',
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureContent: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  techCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  techText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  techDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  developerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  developerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  developerEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  acknowledgments: {
    marginBottom: 24,
  },
  acknowledgmentText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  copyright: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  copyrightText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
