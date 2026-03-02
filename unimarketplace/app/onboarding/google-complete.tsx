import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { gradYears, usColleges } from '@/data/colleges';
import { completeGoogleProfile } from '@/lib/api';
import { useOnboarding } from '@/lib/onboarding-context';

export default function GoogleCompleteScreen() {
  const { data, update } = useOnboarding();
  const [college, setCollege] = useState(data.collegeName || usColleges[0]);
  const [gradYear, setGradYear] = useState(data.gradYear || gradYears[1]);
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

      update({ collegeName: college, gradYear });
      router.replace('/(tabs)');
    } catch {
      update({ collegeName: college, gradYear });
      Alert.alert(
        'Google profile route pending',
        'Backend /api/auth/google/complete-profile is not live yet. Continuing in frontend demo mode.',
      );
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Google Sign-In</Text>
        <Text style={styles.subtitle}>We already got your name, email, and avatar from Google.</Text>

        <View style={styles.profileRow}>
          <Image source={{ uri: data.avatarUrl }} style={styles.avatar} contentFit="cover" />
          <View style={styles.profileText}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.email}>{data.email}</Text>
          </View>
        </View>

        <Text style={styles.label}>College Name *</Text>
        <Pressable
          style={styles.select}
          onPress={() => {
            const idx = usColleges.indexOf(college);
            setCollege(usColleges[(idx + 1) % usColleges.length]);
          }}>
          <Text style={styles.selectText} numberOfLines={1}>
            {college}
          </Text>
          <Text style={styles.arrow}>▼</Text>
        </Pressable>

        <Text style={styles.label}>Graduation Year *</Text>
        <Pressable
          style={styles.select}
          onPress={() => {
            const idx = gradYears.indexOf(gradYear);
            setGradYear(gradYears[(idx + 1) % gradYears.length]);
          }}>
          <Text style={styles.selectText}>{gradYear}</Text>
          <Text style={styles.arrow}>▼</Text>
        </Pressable>

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
  safe: { flex: 1, backgroundColor: '#EDEEF2', justifyContent: 'center', padding: 16 },
  card: {
    backgroundColor: '#F6F6F8',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DBDDE4',
    padding: 16,
  },
  title: { color: '#1F2A44', fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 6, color: '#60728F', fontSize: 14 },
  profileRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E9EEF9',
    borderRadius: 12,
    padding: 10,
  },
  avatar: { height: 42, width: 42, borderRadius: 21 },
  profileText: { flex: 1 },
  name: { color: '#1F2A44', fontSize: 15, fontWeight: '700' },
  email: { color: '#60728F', fontSize: 13, marginTop: 2 },
  label: { marginTop: 12, marginBottom: 6, color: '#60728F', fontSize: 13 },
  select: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B8BDC8',
    paddingHorizontal: 14,
    backgroundColor: '#F8F9FC',
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
  arrow: {
    color: '#7D869A',
    fontSize: 12,
  },
  row: { marginTop: 16, flexDirection: 'row', gap: 10 },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#AAB0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6368E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#6368E8', fontWeight: '700', fontSize: 15 },
  nextText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
