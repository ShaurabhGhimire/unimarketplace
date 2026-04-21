import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useOnboarding } from '@/lib/onboarding-context';

const years = ['2026', '2027', '2028', '2029', '2030'];
const steps = ['Profile Info', 'College Details', 'Complete'];

export default function ProfileDetailsScreen() {
  const { data, update } = useOnboarding();
  const [name, setName] = useState(data.name);
  const [collegeName, setCollegeName] = useState(data.collegeName);
  const [gradYear, setGradYear] = useState(data.gradYear || years[1]);

  const avatar = data.avatarUrl;
  const stepIndex = 1;

  const handleContinue = () => {
    if (!name.trim() || !collegeName.trim() || !gradYear.trim()) {
      Alert.alert('Missing info', 'Please fill name, college name, and graduation year.');
      return;
    }

    if (!data.emailVerified) {
      Alert.alert('Email not verified', 'Please verify your .edu email first.');
      return;
    }

    update({ name: name.trim(), collegeName: collegeName.trim(), gradYear });
    router.push('/onboarding/profile-complete');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Add the details other students will see before you enter the marketplace.</Text>

        <View style={styles.stepRow}>
          {steps.map((step, index) => {
            const active = index <= stepIndex;
            return (
              <View key={step} style={styles.stepItem}>
                <View style={[styles.stepDot, active ? styles.stepDotActive : null]}>
                  {active ? <MaterialIcons name="check" size={12} color="#FFFFFF" /> : null}
                </View>
                <Text style={[styles.stepLabel, active ? styles.stepLabelActive : null]}>{step}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.profileIntro}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {(name || data.email || '?').trim().charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{name || 'Your profile'}</Text>
            <Text style={styles.profileHint}>
              {data.authMethod === 'google' ? 'Google profile imported' : 'This name will be visible to other students'}
            </Text>
          </View>
        </View>

        <View style={styles.verifiedBox}>
          <MaterialIcons name="verified-user" size={18} color="#2C755E" />
          <View style={styles.verifiedCopy}>
            <Text style={styles.verifiedTitle}>Email Verified</Text>
            <Text style={styles.verifiedText}>{data.email || 'Verified .edu email'}</Text>
          </View>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#98A3B5"
        />

        <Text style={styles.label}>College Name</Text>
        <TextInput
          value={collegeName}
          onChangeText={setCollegeName}
          style={styles.input}
          placeholder="Caldwell University"
          placeholderTextColor="#98A3B5"
        />

        <Text style={styles.label}>Expected Graduation Year</Text>
        <Pressable
          style={styles.input}
          onPress={() => {
            const index = years.indexOf(gradYear);
            setGradYear(years[(index + 1) % years.length]);
          }}>
          <Text style={styles.inputText}>{gradYear}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#7D869A" />
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Why we ask this</Text>
          <Text style={styles.infoText}>We use your college and grad year to tailor local listings and trust signals.</Text>
        </View>

        <View style={styles.row}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable style={styles.nextBtn} onPress={handleContinue}>
            <Text style={styles.nextText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ECECF1',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#F8F8FB',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#D8DCE6',
    padding: 20,
  },
  title: {
    color: '#1F2A44',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#60728F',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 18,
    gap: 8,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D7DCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#5F64E8',
  },
  stepLabel: {
    color: '#8A94A8',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#30415C',
  },
  profileIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#EEF2FA',
    marginBottom: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5F64E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileCopy: {
    flex: 1,
  },
  profileName: {
    color: '#1F2A44',
    fontSize: 16,
    fontWeight: '700',
  },
  profileHint: {
    marginTop: 4,
    color: '#60728F',
    fontSize: 13,
  },
  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    backgroundColor: '#DCF4EA',
    padding: 12,
  },
  verifiedCopy: {
    flex: 1,
  },
  verifiedTitle: {
    color: '#1B6048',
    fontSize: 13,
    fontWeight: '700',
  },
  verifiedText: {
    color: '#2C755E',
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    color: '#60728F',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7CCD8',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCFCFE',
  },
  inputText: {
    color: '#1E2942',
    fontSize: 16,
  },
  infoBox: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: '#EEF2FA',
    padding: 12,
  },
  infoTitle: {
    color: '#3C4DB6',
    fontSize: 13,
    fontWeight: '700',
  },
  infoText: {
    marginTop: 4,
    color: '#60728F',
    fontSize: 12,
    lineHeight: 18,
  },
  row: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#AAB0FA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#5F64E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#6368E8',
    fontWeight: '700',
    fontSize: 15,
  },
  nextText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
