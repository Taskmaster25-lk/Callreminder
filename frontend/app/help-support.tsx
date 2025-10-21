import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;
const SUPPORT_EMAIL = 'klabhesh222@gmail.com';

const FAQS = [
  {
    question: 'How do I create a reminder?',
    answer: 'Tap the + button on the home screen, choose from contacts or enter manually, set the time, and tap Create Reminder.'
  },
  {
    question: 'What happens when a reminder triggers?',
    answer: 'You will receive a notification and see a full-screen incoming call interface. You can slide to call or cancel the reminder.'
  },
  {
    question: 'How many reminders can I create?',
    answer: 'Free users can create up to 5 reminders per month. Premium users get unlimited reminders.'
  },
  {
    question: 'How do I upgrade to Premium?',
    answer: 'Go to the Premium tab and choose a subscription plan. Payment is processed securely via Razorpay.'
  },
  {
    question: 'Can I change the notification sound?',
    answer: 'Yes! Go to Settings > Notification Settings and choose from 6 different ringtones.'
  },
  {
    question: 'How does the referral program work?',
    answer: 'Share your unique referral code with friends. When 5 people sign up using your code, you get 15 days of Premium for free!'
  },
];

export default function HelpSupportScreen() {
  const { user } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [bugDescription, setBugDescription] = useState('');
  const [showBugReport, setShowBugReport] = useState(false);

  const handleContactSupport = () => {
    const subject = 'CallMeBack Support Request';
    const body = `Hi Support Team,\n\nUser: ${user?.name}\nEmail: ${user?.email}\n\nMy question is:\n\n`;
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleReportBug = () => {
    if (!bugDescription.trim()) {
      Alert.alert('Error', 'Please describe the bug you encountered');
      return;
    }

    const subject = 'Bug Report - CallMeBack';
    const body = `Bug Report\n\nUser: ${user?.name}\nEmail: ${user?.email}\nPlan: ${user?.plan_type}\n\nBug Description:\n${bugDescription}\n\nDevice Info:\nPlatform: ${Platform.OS}\nVersion: ${Platform.Version}`;
    
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setBugDescription('');
    setShowBugReport(false);
    Alert.alert('Thank You!', 'Your bug report has been sent. We\'ll look into it!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contactCard}>
            <Ionicons name="mail" size={48} color="#4F46E5" />
            <Text style={styles.contactTitle}>Need Help?</Text>
            <Text style={styles.contactDescription}>
              Our support team is here to help you with any questions or issues.
            </Text>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
              <Ionicons name="send" size={20} color="#ffffff" />
              <Text style={styles.contactButtonText}>Email Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowBugReport(!showBugReport)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="bug" size={24} color="#EF4444" />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Report a Bug</Text>
                <Text style={styles.actionDescription}>Found an issue? Let us know</Text>
              </View>
              <Ionicons
                name={showBugReport ? 'chevron-up' : 'chevron-forward'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {showBugReport && (
              <View style={styles.bugReportForm}>
                <TextInput
                  style={styles.bugInput}
                  placeholder="Describe the bug you encountered..."
                  value={bugDescription}
                  onChangeText={setBugDescription}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleReportBug}>
                  <Text style={styles.submitButtonText}>Submit Bug Report</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/referral')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="gift" size={24} color="#10B981" />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Referral Program</Text>
                <Text style={styles.actionDescription}>Earn 15 days of Premium</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            {FAQS.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faqCard}
                onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6B7280"
                  />
                </View>
                {expandedFaq === index && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#4F46E5" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Response Time</Text>
              <Text style={styles.infoText}>
                We typically respond to all inquiries within 24-48 hours.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
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
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  bugReportForm: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  bugInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#6366F1',
    lineHeight: 18,
  },
});
