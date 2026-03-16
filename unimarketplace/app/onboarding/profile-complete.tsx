import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useOnboarding } from '@/lib/onboarding-context';

export default function ProfileCompleteScreen() {
  const { data } = useOnboarding();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>You&apos;re all set</Text>
        <Text style={styles.subtitle}>Welcome to UniMarketplace</Text>

        <View style={styles.summary}>
          <Text style={styles.item}>Name: {data.name || '-'}</Text>
          <Text style={styles.item}>College: {data.collegeName || '-'}</Text>
          <Text style={styles.item}>Email: {data.email || '-'}</Text>
          <Text style={styles.item}>Grad Year: {data.gradYear || '-'}</Text>
        </View>

        <Pressable onPress={() => router.replace('/(tabs)')}>
          <LinearGradient colors={['#6963E9', '#5E64E8']} style={styles.button}>
            <Text style={styles.buttonText}>Enter Marketplace</Text>
          </LinearGradient>
        </Pressable>
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
    padding: 18,
  },
  title: { color: '#1F2A44', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { marginTop: 6, color: '#60728F', fontSize: 15, textAlign: 'center' },
  summary: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCD3E1',
    padding: 12,
    gap: 6,
  },
  item: { color: '#1F2A44', fontSize: 14 },
  button: {
    marginTop: 16,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
