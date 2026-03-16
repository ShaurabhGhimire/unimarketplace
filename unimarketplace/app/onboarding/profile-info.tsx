import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingShell, StepIndicator, onboardingStyles } from '@/components/onboarding-shell';

export default function ProfileInfoScreen() {
  return (
    <OnboardingShell title="Complete Your Profile" subtitle="">
      <StepIndicator
        steps={[
          { id: '1', label: 'Profile Info', state: 'active' },
          { id: '2', label: 'College Details', state: 'upcoming' },
          { id: '3', label: 'Complete', state: 'upcoming' },
        ]}
      />

      <View style={styles.avatarWrap}>
        <LinearGradient colors={['#5F64E8', '#6064E8']} style={styles.avatarCircle}>
          <Text style={styles.question}>?</Text>
        </LinearGradient>
        <Pressable style={styles.cameraButton}>
          <MaterialIcons name="photo-camera" size={16} color="#7A7A7A" />
        </Pressable>
      </View>

      <Text style={onboardingStyles.fieldLabel}>Full Name *</Text>
      <View style={onboardingStyles.field}>
        <TextInput placeholder="Full Name" placeholderTextColor="#7A8DA9" style={styles.input} />
      </View>
      <Text style={styles.helper}>This name will be visible to other students</Text>

      <Pressable onPress={() => router.push('/onboarding/college-details')}>
        <LinearGradient
          colors={['#CACACE', '#CACACE']}
          style={[onboardingStyles.primaryButton, styles.compactContinue]}>
          <Text style={[onboardingStyles.primaryButtonText, styles.disabledText]}>Continue</Text>
        </LinearGradient>
      </Pressable>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    color: '#D7DAFF',
    fontSize: 42,
    lineHeight: 48,
  },
  cameraButton: {
    position: 'absolute',
    right: 102,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  input: {
    color: '#222F46',
    fontSize: 16,
    width: '100%',
  },
  helper: {
    marginTop: 6,
    textAlign: 'center',
    color: '#5F7090',
    fontSize: 13,
  },
  compactContinue: {
    marginTop: 10,
  },
  disabledText: {
    color: '#9EA0A4',
  },
});
