import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { gradYears, usColleges } from '@/data/colleges';
import { completeGoogleProfile } from '@/lib/api';
import { saveAccessToken } from '@/lib/auth-storage';
import { useOnboarding } from '@/lib/onboarding-context';

const steps = ['Profile Info', 'College Details', 'Complete'];

export default function GoogleCompleteScreen() {
  const { data, update } = useOnboarding();
  const [college, setCollege] = useState<typeof usColleges[number]>(
    (usColleges as readonly string[]).includes(data.collegeName) ? data.collegeName as typeof usColleges[number] : usColleges[0]
  );
  const [gradYear, setGradYear] = useState<typeof gradYears[number]>(
    (gradYears as readonly string[]).includes(data.gradYear) ? data.gradYear as typeof gradYears[number] : gradYears[1]
  );
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      await completeGoogleProfile({
        access_token: data.accessToken,
        name: data.name,
        college_name: college,
        grad_year: gradYear,
        avatar_url: data.avatarUrl || undefined,
      });

      await saveAccessToken(data.accessToken);
      update({ collegeName: college, gradYear });
      router.replace('/(tabs)');
    } catch (err) {
      update({ collegeName: college, gradYear });
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      Alert.alert('Profile update failed', message);
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Google Sign-In</Text>
        <Text style={styles.subtitle}>We already imported your identity. Add campus details to finish your profile.</Text>

        <View style={styles.stepRow}>
          {steps.map((step) => (
            <View key={step} style={styles.stepItem}>
              <View style={[styles.stepDot, styles.stepDotActive]}>
                <MaterialIcons name="check" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.stepLabelActive}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.profileRow}>
          <Image source={{ uri: data.avatarUrl }} style={styles.avatar} contentFit="cover" />
          <View style={styles.profileText}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.email}>{data.email}</Text>
          </View>
          <MaterialIcons name="verified-user" size={20} color="#5F64E8" />
        </View>

        <Text style={styles.label}>College Name</Text>
        <Pressable
          style={styles.select}
          onPress={() => {
            const idx = usColleges.indexOf(college);
            setCollege(usColleges[(idx + 1) % usColleges.length]);
          }}>
          <Text style={styles.selectText} numberOfLines={1}>
            {college}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#7D869A" />
        </Pressable>

        <Text style={styles.label}>Graduation Year</Text>
        <Pressable
          style={styles.select}
          onPress={() => {
            const idx = gradYears.indexOf(gradYear);
            setGradYear(gradYears[(idx + 1) % gradYears.length]);
          }}>
          <Text style={styles.selectText}>{gradYear}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#7D869A" />
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Verified student onboarding</Text>
          <Text style={styles.infoText}>Your Google account gives us name, email, and avatar. College details complete the marketplace profile.</Text>
        </View>

        <View style={styles.row}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable style={styles.nextBtn} onPress={handleContinue}>
            <Text style={styles.nextText}>{loading ? 'Saving...' : 'Continue'}</Text>
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
  stepLabelActive: {
    color: '#30415C',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EEF2FA',
    borderRadius: 18,
    padding: 14,
  },
  avatar: {
    height: 54,
    width: 54,
    borderRadius: 27,
  },
  profileText: {
    flex: 1,
  },
  name: {
    color: '#1F2A44',
    fontSize: 16,
    fontWeight: '700',
  },
  email: {
    color: '#60728F',
    fontSize: 13,
    marginTop: 2,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    color: '#60728F',
    fontSize: 13,
    fontWeight: '600',
  },
  select: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7CCD8',
    paddingHorizontal: 14,
    backgroundColor: '#FCFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
    color: '#1E2942',
    fontSize: 15,
    marginRight: 8,
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
