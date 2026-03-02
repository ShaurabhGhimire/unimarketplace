import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const BRAND_BLUE = '#5F64E8';

type StepState = 'done' | 'active' | 'upcoming';

type Step = {
  id: string;
  label: string;
  state: StepState;
};

export function OnboardingShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <LinearGradient colors={['#5C63E8', '#8C59D5', '#E045A2']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.card}>
              <LinearGradient colors={['#6963E9', '#D94EB1']} style={styles.logoCircle}>
                <MaterialIcons name="school" color="#FFFFFF" size={30} />
              </LinearGradient>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              {children}

              <View style={styles.trustWrap}>
                <Text style={styles.trustHeading}>🔒 College-verified students only</Text>
                <Text style={styles.trustBody}>
                  Safe, trusted transactions within your campus community
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function StepIndicator({ steps }: { steps: Step[] }) {
  return (
    <View style={styles.stepper}>
      {steps.map((step, index) => {
        const done = step.state === 'done';
        const active = step.state === 'active';
        return (
          <View key={step.id} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                { backgroundColor: done || active ? BRAND_BLUE : '#AEAEAE' },
              ]}>
              {done ? (
                <MaterialIcons name="check" color="#FFFFFF" size={17} />
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, { color: active || done ? '#1F2A44' : '#637898' }]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export const onboardingStyles = StyleSheet.create({
  field: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#B6BDC8',
    borderRadius: 14,
    height: 58,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    color: '#687A9A',
    fontSize: 12,
    backgroundColor: '#F2F2F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    marginBottom: -5,
    marginLeft: 10,
    zIndex: 1,
  },
  fieldText: {
    color: '#9FA6B4',
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonStandalone: {
    marginTop: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  rowButtons: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#AAB0FA',
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F5',
  },
  secondaryButtonText: {
    color: BRAND_BLUE,
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: '#D6E8F1',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },
  infoTitle: {
    color: '#0D4C73',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoText: {
    color: '#0D4C73',
    fontSize: 14,
    lineHeight: 21,
  },
});

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#F2F2F5',
    borderRadius: 42,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    flex: 1,
  },
  logoCircle: {
    height: 78,
    width: 78,
    borderRadius: 39,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: '#1F2A44',
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#5F7090',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepper: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '32%',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 1,
  },
  trustWrap: {
    marginTop: 'auto',
    paddingTop: 12,
    alignItems: 'center',
    gap: 5,
  },
  trustHeading: {
    color: BRAND_BLUE,
    fontWeight: '700',
    fontSize: 14,
  },
  trustBody: {
    color: '#637898',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
});
