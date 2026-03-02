import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useOnboarding } from '@/lib/onboarding-context';

const years = ['2026', '2027', '2028', '2029', '2030'];

export default function ProfileDetailsScreen() {
  const { data, update } = useOnboarding();
  const [name, setName] = useState(data.name);
  const [collegeName, setCollegeName] = useState(data.collegeName);
  const [gradYear, setGradYear] = useState(data.gradYear || years[1]);

  const avatar = useMemo(() => {
    return (
      data.avatarUrl ||
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80'
    );
  }, [data.avatarUrl]);

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
        <Text style={styles.subtitle}>We need these details before you enter the marketplace.</Text>

        <View style={styles.verifiedBox}>
          <Text style={styles.verifiedText}>Verified Email: {data.email || 'Not set'}</Text>
        </View>

        {data.authMethod === 'google' ? (
          <View style={styles.googleRow}>
            <Image source={{ uri: avatar }} style={styles.avatar} contentFit="cover" />
            <Text style={styles.googleNote}>Google profile imported</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Your full name"
          placeholderTextColor="#98A3B5"
        />

        <Text style={styles.label}>College Name *</Text>
        <TextInput
          value={collegeName}
          onChangeText={setCollegeName}
          style={styles.input}
          placeholder="Caldwell University"
          placeholderTextColor="#98A3B5"
        />

        <Text style={styles.label}>Grad Year *</Text>
        <Pressable
          style={styles.input}
          onPress={() => {
            const index = years.indexOf(gradYear);
            setGradYear(years[(index + 1) % years.length]);
          }}>
          <Text style={styles.inputText}>{gradYear}</Text>
        </Pressable>

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
  verifiedBox: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#DCF4EA',
    padding: 10,
  },
  verifiedText: { color: '#1B6048', fontSize: 13, fontWeight: '600' },
  googleRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: { height: 34, width: 34, borderRadius: 17 },
  googleNote: { color: '#60728F', fontSize: 13 },
  label: { marginTop: 12, marginBottom: 6, color: '#60728F', fontSize: 13 },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B8BDC8',
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#F6F6F8',
  },
  inputText: {
    color: '#1E2942',
    fontSize: 16,
  },
  row: { marginTop: 14, flexDirection: 'row', gap: 10 },
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
