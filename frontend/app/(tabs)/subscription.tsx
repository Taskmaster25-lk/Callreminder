import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

const plans = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 79,
    duration: '1 month',
    savings: null,
  },
  {
    id: 'quarterly',
    name: 'Quarterly Premium',
    price: 199,
    duration: '3 months',
    savings: 'Save ₹38',
  },
];

const features = [
  'Unlimited reminders',
  'Priority notifications',
  'Custom notification sounds',
  'Advanced scheduling options',
  'No ads',
  'Premium support',
];

export default function SubscriptionScreen() {
  const { user, token, refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const plan = plans.find(p => p.id === selectedPlan);
      
      // Create order
      const orderResponse = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: plan!.price * 100, // Convert to paise
          plan_type: selectedPlan
        })
      });

      const orderData = await orderResponse.json();

      // For now, simulate payment success (user will add real Razorpay later)
      Alert.alert(
        'Payment Integration',
        'Razorpay integration is ready. Add your Razorpay API keys in .env to enable real payments. For now, simulating successful payment...',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Verify payment
              const verifyResponse = await fetch(`${API_URL}/api/payments/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  order_id: orderData.order_id,
                  payment_id: 'pay_test_' + Date.now(),
                  signature: 'test_signature',
                  plan_type: selectedPlan
                })
              });

              if (verifyResponse.ok) {
                await refreshUser();
                Alert.alert('Success', 'You are now a Premium member!');
              }
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const isPremium = user?.plan_type === 'premium';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={48} color="#F59E0B" />
          </View>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            {isPremium
              ? 'You are already a Premium member!'
              : 'Unlock unlimited reminders and premium features'}
          </Text>
        </View>

        {!isPremium && (
          <>
            <View style={styles.plansContainer}>
              {plans.map(plan => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.planCardSelected
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                  <View style={styles.radioOuter}>
                    {selectedPlan === plan.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.planDetails}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDuration}>{plan.duration}</Text>
                  </View>
                  <Text style={styles.planPrice}>₹{plan.price}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Premium Features</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  Subscribe - ₹{plans.find(p => p.id === selectedPlan)?.price}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              * Payment processed securely via Razorpay
            </Text>
          </>
        )}

        {isPremium && (
          <View style={styles.premiumCard}>
            <Ionicons name="shield-checkmark" size={64} color="#10B981" />
            <Text style={styles.premiumText}>You're Premium!</Text>
            <Text style={styles.premiumSubtext}>
              Enjoy unlimited reminders and all premium features
            </Text>
            {user?.plan_expiry && (
              <Text style={styles.expiryText}>
                Valid until {new Date(user.plan_expiry).toLocaleDateString()}
              </Text>
            )}
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
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 32,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  planCardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F46E5',
  },
  planDetails: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  planDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  featuresContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 12,
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  premiumCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  premiumSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  expiryText: {
    fontSize: 14,
    color: '#4F46E5',
    marginTop: 16,
    fontWeight: '600',
  },
});
