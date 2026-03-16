import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingShell, StepIndicator, onboardingStyles } from '@/components/onboarding-shell';

export default function VerificationCodeScreen() {
  return (
    <OnboardingShell title="UniMarketplace" subtitle="Verify your student email to continue">
      <StepIndicator
        steps={[
          { id: '1', label: 'Select College', state: 'done' },
          { id: '2', label: 'Verify Email', state: 'done' },
          { id: '3', label: 'Complete', state: 'active' },
        ]}
      />

      <View style={styles.badgeWrap}>
        <MaterialIcons name="verified-user" size={56} color="#5F64E8" />
      </View>
      <Text style={styles.heading}>Check Your Email</Text>
      <Text style={styles.copy}>
        We sent a 6-digit verification code to <Text style={styles.email}>sghimire@caldwell.edu</Text>
      </Text>

      <Text style={onboardingStyles.fieldLabel}>Verification Code *</Text>
      <View style={onboardingStyles.field}>
        <TextInput defaultValue="868837" keyboardType="number-pad" style={styles.codeInput} />
      </View>

      <View style={onboardingStyles.rowButtons}>
        <Pressable style={onboardingStyles.secondaryButton} onPress={() => router.back()}>
          <Text style={onboardingStyles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/onboarding/profile-info')} style={styles.flex1}>
          <LinearGradient colors={['#6963E9', '#5E64E8']} style={onboardingStyles.primaryButton}>
            <Text style={onboardingStyles.primaryButtonText}>Verify & Continue</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <Pressable>
        <Text style={styles.resend}>Didn&apos;t receive code? Resend</Text>
      </Pressable>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  badgeWrap: {
    marginTop: 10,
    alignItems: 'center',
  },
  heading: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2A44',
    textAlign: 'center',
  },
  copy: {
    marginTop: 8,
    color: '#5E7090',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  email: {
    color: '#5F64E8',
    fontWeight: '700',
  },
  codeInput: {
    color: '#222F46',
    fontSize: 16,
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  resend: {
    marginTop: 12,
    textAlign: 'center',
    color: '#5F64E8',
    fontSize: 14,
    fontWeight: '600',
  },
});
