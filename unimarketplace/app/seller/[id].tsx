import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPublicProfile, type PublicProfile } from '@/lib/api';
import { getAccessToken } from '@/lib/auth-storage';

const fallbackAvatar =
  'https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function SellerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      try {
        const token = await getAccessToken();
        if (!token) { if (mounted) setNotFound(true); return; }
        const res = await getPublicProfile(token, id);
        if (mounted) {
          if (res.data?.profile) setProfile(res.data.profile);
          else setNotFound(true);
        }
      } catch {
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (notFound || !profile) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <MaterialIcons name="person-off" size={48} color="#C0C6D4" />
        <Text style={styles.notFoundText}>Profile not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const initials = (profile.name ?? '?').trim().charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color="#243047" />
        </Pressable>
        <Text style={styles.headerTitle}>Seller Profile</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}

          <Text style={styles.name}>{profile.name ?? 'Campus Seller'}</Text>

          <View style={styles.verifiedRow}>
            <MaterialIcons name="verified-user" size={15} color="#4F46E5" />
            <Text style={styles.verifiedText}>Verified Student</Text>
          </View>

          {profile.bio ? (
            <Text style={styles.bio}>{profile.bio}</Text>
          ) : null}
        </View>

        <View style={styles.infoCard}>
          {profile.college_name ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <MaterialIcons name="school" size={18} color="#4F46E5" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>College</Text>
                <Text style={styles.infoValue}>{profile.college_name}</Text>
              </View>
            </View>
          ) : null}

          {profile.graduation_year ? (
            <>
              {profile.college_name ? <View style={styles.divider} /> : null}
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <MaterialIcons name="calendar-today" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Graduation Year</Text>
                  <Text style={styles.infoValue}>Class of {profile.graduation_year}</Text>
                </View>
              </View>
            </>
          ) : null}

          {profile.phone_number ? (
            <>
              {(profile.college_name || profile.graduation_year) ? <View style={styles.divider} /> : null}
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <MaterialIcons name="phone" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profile.phone_number}</Text>
                </View>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF1F5',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A4460',
  },
  backLink: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#F7F8FB',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE4EC',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172033',
  },
  container: {
    padding: 16,
    gap: 12,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#F8F8FB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D8DCE6',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 14,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarFallbackText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2A44',
    textAlign: 'center',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  verifiedText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },
  bio: {
    marginTop: 12,
    color: '#60728F',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F8F8FB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8DCE6',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEFFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8A94A8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2A44',
    fontWeight: '600',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E3E6EE',
    marginLeft: 66,
  },
});
