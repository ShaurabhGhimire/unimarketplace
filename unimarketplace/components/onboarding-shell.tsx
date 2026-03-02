import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
        <View style={styles.card}>
          <LinearGradient colors={['#6963E9', '#D94EB1']} style={styles.logoCircle}>
            <MaterialIcons name="school" color="#FFFFFF" size={38} />
          </LinearGradient>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {children}

          <View style={styles.trustWrap}>
            <Text style={styles.trustHeading}>🔒 College-verified students only</Text>
            <Text style={styles.trustBody}>Safe, trusted transactions within your campus community</Text>
          </View>
        </View>
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
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#B6BDC8',
    borderRadius: 16,
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    color: '#687A9A',
    fontSize: 13,
    backgroundColor: '#F2F2F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    marginBottom: -6,
    marginLeft: 12,
    zIndex: 1,
  },
  fieldText: {
    color: '#9FA6B4',
    fontSize: 18,
  },
  primaryButton: {
    marginTop: 20,
    borderRadius: 16,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  rowButtons: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 14,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#AAB0FA',
    borderRadius: 16,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F5',
  },
  secondaryButtonText: {
    color: BRAND_BLUE,
    fontSize: 18,
    fontWeight: '700',
  },
  infoBox: {
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: '#D6E8F1',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoTitle: {
    color: '#0D4C73',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoText: {
    color: '#0D4C73',
    fontSize: 15,
    lineHeight: 24,
  },
});

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#F2F2F5',
    borderRadius: 52,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 26,
  },
  logoCircle: {
    height: 110,
    width: 110,
    borderRadius: 55,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    color: '#1F2A44',
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    color: '#5F7090',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 14,
  },
  stepper: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '32%',
  },
  stepDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  trustWrap: {
    marginTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  trustHeading: {
    color: BRAND_BLUE,
    fontWeight: '700',
    fontSize: 16,
  },
  trustBody: {
    color: '#637898',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 26,
  },
});
