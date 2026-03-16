import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { marketplaceItems, messageThreads } from '@/data/mock';
import { clearAccessToken } from '@/lib/auth-storage';
import { useOnboarding } from '@/lib/onboarding-context';

export default function ProfileScreen() {
  const { data, reset } = useOnboarding();
  const [notifications, setNotifications] = useState(true);
  const [moveOutMode, setMoveOutMode] = useState(false);

  const initials = (data.name || data.email || 'U').trim().charAt(0).toUpperCase();
  const userName = data.name || 'Campus Student';
  const userEmail = data.email || 'verified@student.edu';
  const collegeName = data.collegeName || 'Your College';
  const gradYear = data.gradYear || '2027';
  const activeListings = marketplaceItems.length;
  const soldItems = 12;
  const savedItems = 8;

  const handleEditProfile = () => {
    router.push('/onboarding/profile-details');
  };

  const handleLogout = async () => {
    try {
      await clearAccessToken();
    } finally {
      reset();
      router.replace('/onboarding/auth');
    }
  };

  const handlePending = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          {data.avatarUrl ? (
            <Image source={{ uri: data.avatarUrl }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}

          <Text style={styles.name}>{userName}</Text>

          <View style={styles.emailRow}>
            <Text style={styles.email}>{userEmail}</Text>
            <MaterialIcons name="verified-user" size={16} color="#5F64E8" />
          </View>

          <Text style={styles.meta}>
            {collegeName} • Class of {gradYear}
          </Text>

          <Pressable style={styles.editButton} onPress={handleEditProfile}>
            <MaterialIcons name="edit" size={16} color="#32415D" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statValuePrimary]}>{activeListings}</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statValueSuccess]}>{soldItems}</Text>
            <Text style={styles.statLabel}>Items Sold</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>My Activity</Text>
        <View style={styles.sectionCard}>
          <Pressable
            style={styles.rowButton}
            onPress={() =>
              handlePending('Listings coming next', `${activeListings} listings are ready to connect to backend data.`)
            }>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="inventory-2" size={20} color="#5F64E8" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>My Listings</Text>
              <Text style={styles.rowSubtitle}>{activeListings} active</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#8692A8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.rowButton}
            onPress={() => handlePending('Saved items', `${savedItems} saved items in demo mode.`)}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="favorite" size={20} color="#E45569" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Saved Items</Text>
              <Text style={styles.rowSubtitle}>Review your favorites</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#8692A8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.rowButton} onPress={() => router.push('/move-out-mode')}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="local-fire-department" size={20} color="#FF9A1F" />
            </View>
            <View style={styles.rowTextWrap}>
              <View style={styles.rowTitleLine}>
                <Text style={styles.rowTitle}>Move-Out Mode</Text>
                <View style={[styles.chip, moveOutMode ? styles.chipActive : null]}>
                  <Text style={[styles.chipText, moveOutMode ? styles.chipTextActive : null]}>
                    {moveOutMode ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <Text style={styles.rowSubtitle}>Sell items faster when moving out</Text>
            </View>
            <Switch value={moveOutMode} onValueChange={setMoveOutMode} trackColor={{ true: '#F5B24B' }} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.sectionCard}>
          <View style={styles.rowButton}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="notifications" size={20} color="#66758F" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Text style={styles.rowSubtitle}>Get alerts for new messages</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: '#7A86FF' }} />
          </View>

          <View style={styles.divider} />

          <Pressable
            style={styles.rowButton}
            onPress={() => handlePending('Safety & Privacy', 'Safety controls will be connected in a later backend pass.')}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="shield" size={20} color="#66758F" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Safety & Privacy</Text>
              <Text style={styles.rowSubtitle}>Manage your safety settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#8692A8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.rowButton}
            onPress={() =>
              handlePending('Help & Support', `${messageThreads.length} message threads are live in the demo inbox.`)
            }>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="help-outline" size={20} color="#66758F" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Help & Support</Text>
              <Text style={styles.rowSubtitle}>FAQs and contact options</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#8692A8" />
          </Pressable>
        </View>

        <View style={styles.badgeCard}>
          <MaterialIcons name="verified-user" size={42} color="#FFFFFF" />
          <Text style={styles.badgeTitle}>Verified Student</Text>
          <Text style={styles.badgeText}>
            Your college email has been verified. This badge helps build trust with other students.
          </Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color="#D3485F" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ECECF1',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2A44',
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F8F8FB',
    borderWidth: 1,
    borderColor: '#D8DCE6',
    marginBottom: 16,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5F64E8',
  },
  avatarFallbackText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2A44',
    textAlign: 'center',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  email: {
    color: '#64748D',
    fontSize: 13,
  },
  meta: {
    color: '#64748D',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 16,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D6DAE4',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  editButtonText: {
    color: '#32415D',
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    backgroundColor: '#F8F8FB',
    borderWidth: 1,
    borderColor: '#D8DCE6',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '800',
  },
  statValuePrimary: {
    color: '#5F64E8',
  },
  statValueSuccess: {
    color: '#16A072',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#6D7890',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2A44',
    marginBottom: 10,
  },
  sectionCard: {
    borderRadius: 22,
    backgroundColor: '#F8F8FB',
    borderWidth: 1,
    borderColor: '#D8DCE6',
    marginBottom: 20,
    overflow: 'hidden',
  },
  rowButton: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF1F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    color: '#1F2A44',
    fontSize: 15,
    fontWeight: '700',
  },
  rowSubtitle: {
    marginTop: 4,
    color: '#6E7890',
    fontSize: 13,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E3E6EE',
    marginLeft: 66,
  },
  chip: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#E7EAF1',
  },
  chipActive: {
    backgroundColor: '#FFF0D6',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7B869A',
  },
  chipTextActive: {
    color: '#AE6A05',
  },
  badgeCard: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: 'center',
    backgroundColor: '#5F64E8',
    marginBottom: 20,
  },
  badgeTitle: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  badgeText: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.92,
  },
  logoutButton: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0C5CC',
    backgroundColor: '#FFF6F7',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  logoutText: {
    color: '#D3485F',
    fontSize: 15,
    fontWeight: '700',
  },
});
