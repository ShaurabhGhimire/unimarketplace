import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingShell, StepIndicator, onboardingStyles } from '@/components/onboarding-shell';

export default function VerifyEmailScreen() {
  return (
    <OnboardingShell title="UniMarketplace" subtitle="Verify your student email to continue">
      <StepIndicator
        steps={[
          { id: '1', label: 'Select College', state: 'done' },
          { id: '2', label: 'Verify Email', state: 'active' },
          { id: '3', label: 'Complete', state: 'upcoming' },
        ]}
      />

      <View style={onboardingStyles.infoBox}>
        <MaterialIcons name="info-outline" size={24} color="#1E88D0" style={styles.infoIcon} />
        <View style={styles.infoContent}>
          <Text style={onboardingStyles.infoTitle}>Selected: Caldwell University</Text>
          <Text style={onboardingStyles.infoText}>Please use your official college email (@caldwell.edu)</Text>
        </View>
      </View>

      <Text style={onboardingStyles.fieldLabel}>College Email *</Text>
      <View style={onboardingStyles.field}>
        <View style={styles.row}>
          <MaterialIcons name="mail" color="#888888" size={20} />
          <TextInput style={styles.input} placeholder="you@caldwell.edu" placeholderTextColor="#9AA3AF" />
        </View>
      </View>

      <View style={onboardingStyles.rowButtons}>
        <Pressable style={onboardingStyles.secondaryButton} onPress={() => router.back()}>
          <Text style={onboardingStyles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/onboarding/verification-code')} style={styles.flex1}>
          <LinearGradient colors={['#6963E9', '#5E64E8']} style={onboardingStyles.primaryButton}>
            <Text style={onboardingStyles.primaryButtonText}>Send Verification Code</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  input: {
    flex: 1,
    color: '#222F46',
    fontSize: 16,
  },
  flex1: {
    flex: 1,
  },
});
