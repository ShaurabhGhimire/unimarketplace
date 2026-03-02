import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OnboardingShell, StepIndicator, onboardingStyles } from '@/components/onboarding-shell';

export default function SelectCollegeScreen() {
  return (
    <OnboardingShell title="Campus Market" subtitle="Verify your student email to continue">
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
        }}
        style={styles.heroImage}
      />

      <StepIndicator
        steps={[
          { id: '1', label: 'Select College', state: 'active' },
          { id: '2', label: 'Verify Email', state: 'upcoming' },
          { id: '3', label: 'Complete', state: 'upcoming' },
        ]}
      />

      <Text style={onboardingStyles.fieldLabel}>Select Your College *</Text>
      <View style={onboardingStyles.field}>
        <View style={styles.row}>
          <MaterialIcons name="school" color="#8E8E8E" size={26} />
          <Text style={onboardingStyles.fieldText}>Caldwell University</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" color="#8E8E8E" size={26} />
      </View>

      <Pressable onPress={() => router.push('/onboarding/verify-email')}>
        <LinearGradient colors={['#6963E9', '#5E64E8']} style={onboardingStyles.primaryButton}>
          <Text style={onboardingStyles.primaryButtonText}>Continue</Text>
        </LinearGradient>
      </Pressable>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    marginTop: 14,
    width: '100%',
    height: 208,
    borderRadius: 42,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
