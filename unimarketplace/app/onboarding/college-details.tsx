import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OnboardingShell, StepIndicator, onboardingStyles } from '@/components/onboarding-shell';

export default function CollegeDetailsScreen() {
  return (
    <OnboardingShell title="Complete Your Profile" subtitle="">
      <StepIndicator
        steps={[
          { id: '1', label: 'Profile Info', state: 'done' },
          { id: '2', label: 'College Details', state: 'active' },
          { id: '3', label: 'Complete', state: 'upcoming' },
        ]}
      />

      <View style={onboardingStyles.infoBox}>
        <MaterialIcons name="verified" color="#39B989" size={24} style={styles.infoIcon} />
        <View style={styles.infoContent}>
          <Text style={[onboardingStyles.infoTitle, styles.verifiedTitle]}>Email Verified: sghimire@caldwell.edu</Text>
          <Text style={[onboardingStyles.infoText, styles.verifiedText]}>
            Your Caldwell University student status has been confirmed
          </Text>
        </View>
      </View>

      <Text style={onboardingStyles.fieldLabel}>College/University *</Text>
      <View style={onboardingStyles.field}>
        <Text style={onboardingStyles.fieldText}>Caldwell University - Caldwell, NJ</Text>
        <MaterialIcons name="keyboard-arrow-down" color="#B0B0B0" size={24} />
      </View>

      <Text style={[onboardingStyles.fieldLabel, styles.mt12]}>Expected Graduation Year *</Text>
      <View style={onboardingStyles.field}>
        <Text style={onboardingStyles.fieldText}>2027</Text>
        <MaterialIcons name="keyboard-arrow-down" color="#B0B0B0" size={24} />
      </View>

      <View style={onboardingStyles.rowButtons}>
        <Pressable style={onboardingStyles.secondaryButton} onPress={() => router.back()}>
          <Text style={onboardingStyles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/onboarding/profile-complete')} style={styles.flex1}>
          <LinearGradient colors={['#CACACE', '#CACACE']} style={onboardingStyles.primaryButton}>
            <Text style={[onboardingStyles.primaryButtonText, styles.disabledText]}>Continue</Text>
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
  verifiedTitle: {
    color: '#185E49',
  },
  verifiedText: {
    color: '#185E49',
  },
  mt12: {
    marginTop: 8,
  },
  flex1: {
    flex: 1,
  },
  disabledText: {
    color: '#9EA0A4',
  },
});
