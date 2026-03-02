import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OnboardingShell, StepIndicator, onboardingStyles } from '@/components/onboarding-shell';

export default function ProfileCompleteScreen() {
  return (
    <OnboardingShell title="Complete Your Profile" subtitle="">
      <StepIndicator
        steps={[
          { id: '1', label: 'Profile Info', state: 'done' },
          { id: '2', label: 'College Details', state: 'done' },
          { id: '3', label: 'Complete', state: 'active' },
        ]}
      />

      <View style={styles.checkCircle}>
        <MaterialIcons name="done" size={54} color="#13233F" />
      </View>
      <Text style={styles.heading}>You&apos;re All Set!</Text>
      <Text style={styles.body}>
        Welcome to Campus Market, Saurav Ghimire! Start browsing listings from students at Caldwell
        University.
      </Text>
      <Text style={styles.body}>Remember: Only buy/sell with verified students for safe transactions.</Text>

      <View style={onboardingStyles.rowButtons}>
        <Pressable style={onboardingStyles.secondaryButton} onPress={() => router.back()}>
          <Text style={onboardingStyles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.flex1}>
          <LinearGradient colors={['#6963E9', '#5E64E8']} style={onboardingStyles.primaryButton}>
            <Text style={onboardingStyles.primaryButtonText}>Get Started</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  checkCircle: {
    alignSelf: 'center',
    marginTop: 28,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0FC38B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    marginTop: 22,
    textAlign: 'center',
    color: '#1F2A44',
    fontSize: 44,
    fontWeight: '800',
  },
  body: {
    marginTop: 14,
    textAlign: 'center',
    color: '#5F7090',
    fontSize: 17,
    lineHeight: 34,
  },
  flex1: {
    flex: 1,
  },
});
