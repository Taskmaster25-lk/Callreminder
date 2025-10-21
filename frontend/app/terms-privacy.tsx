import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TermsPrivacyScreen() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'terms' && styles.tabActive]}
          onPress={() => setActiveTab('terms')}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>
            Terms of Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.tabActive]}
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'terms' ? (
          <View>
            <Text style={styles.title}>Terms of Service</Text>
            <Text style={styles.updated}>Last updated: January 2025</Text>

            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing and using CallMeBack, you accept and agree to be bound by the terms and
              provision of this agreement.
            </Text>

            <Text style={styles.sectionTitle}>2. Use License</Text>
            <Text style={styles.paragraph}>
              Permission is granted to temporarily use CallMeBack for personal, non-commercial use only.
              This is the grant of a license, not a transfer of title.
            </Text>

            <Text style={styles.sectionTitle}>3. User Account</Text>
            <Text style={styles.paragraph}>
              You are responsible for safeguarding the password and for all activities that occur under
              your account. You must notify us immediately of any unauthorized use of your account.
            </Text>

            <Text style={styles.sectionTitle}>4. Subscription Terms</Text>
            <Text style={styles.paragraph}>
              {'\u2022'} Free Plan: Limited to 5 reminders per month{'
'}
              {'\u2022'} Premium Plan: Unlimited reminders with additional features{'
'}
              {'\u2022'} Subscriptions are billed monthly or quarterly{'
'}
              {'\u2022'} You may cancel at any time
            </Text>

            <Text style={styles.sectionTitle}>5. Refund Policy</Text>
            <Text style={styles.paragraph}>
              Refunds are available within 7 days of purchase if no premium features have been used.
              Contact support at klabhesh222@gmail.com for refund requests.
            </Text>

            <Text style={styles.sectionTitle}>6. Prohibited Uses</Text>
            <Text style={styles.paragraph}>
              You may not use CallMeBack:{'
'}
              {'\u2022'} For any unlawful purpose{'
'}
              {'\u2022'} To spam or harass others{'
'}
              {'\u2022'} To violate any local, state, or international law{'
'}
              {'\u2022'} To impersonate or attempt to impersonate another user
            </Text>

            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              CallMeBack shall not be liable for any damages arising out of or in connection with your
              use of the app. This includes direct, indirect, incidental, punitive, and consequential damages.
            </Text>

            <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to modify these terms at any time. We will notify users of any
              material changes via email or in-app notification.
            </Text>

            <Text style={styles.sectionTitle}>9. Contact</Text>
            <Text style={styles.paragraph}>
              For questions about these Terms, contact us at: klabhesh222@gmail.com
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.updated}>Last updated: January 2025</Text>

            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.paragraph}>
              We collect information that you provide directly to us:{'
'}
              • Account information (name, email, password){'
'}
              • Contact information for reminders{'
'}
              • Usage data and preferences{'
'}
              • Payment information (processed securely via Razorpay)
            </Text>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the information we collect to:{'
'}
              • Provide and maintain CallMeBack{'
'}
              • Send you reminder notifications{'
'}
              • Process your transactions{'
'}
              • Improve our services{'
'}
              • Communicate with you about updates and support
            </Text>

            <Text style={styles.sectionTitle}>3. Information Sharing</Text>
            <Text style={styles.paragraph}>
              We do not sell or rent your personal information. We may share information:{'
'}
              • With service providers (payment processing, hosting){'
'}
              • When required by law{'
'}
              • To protect our rights and safety
            </Text>

            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate security measures to protect your personal information. However,
              no method of transmission over the internet is 100% secure.
            </Text>

            <Text style={styles.sectionTitle}>5. Contact Access</Text>
            <Text style={styles.paragraph}>
              CallMeBack requests access to your contacts only when you choose to select a contact for
              a reminder. We do not store or upload your entire contact list.
            </Text>

            <Text style={styles.sectionTitle}>6. Notifications</Text>
            <Text style={styles.paragraph}>
              We use push notifications to send you reminders. You can disable notifications in your
              device settings at any time.
            </Text>

            <Text style={styles.sectionTitle}>7. Data Retention</Text>
            <Text style={styles.paragraph}>
              We retain your information for as long as your account is active. You can request account
              deletion by contacting support.
            </Text>

            <Text style={styles.sectionTitle}>8. Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to:{'
'}
              • Access your personal data{'
'}
              • Correct inaccurate data{'
'}
              • Request deletion of your data{'
'}
              • Object to data processing{'
'}
              • Data portability
            </Text>

            <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
            <Text style={styles.paragraph}>
              CallMeBack is not intended for children under 13. We do not knowingly collect information
              from children under 13.
            </Text>

            <Text style={styles.sectionTitle}>10. Changes to Privacy Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy periodically. We will notify you of any material changes.
            </Text>

            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.paragraph}>
              For privacy-related questions, contact us at: klabhesh222@gmail.com
            </Text>
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 4,
    margin: 16,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  updated: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
});
