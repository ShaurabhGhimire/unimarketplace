import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { messageThreads } from '@/data/mock';
import { getMyProfile, updateProfile, deleteAccount, type ProfileRecord } from '@/lib/api';
import { clearAccessToken, getAccessToken } from '@/lib/auth-storage';
import { useOnboarding } from '@/lib/onboarding-context';

const gradYears = ['2025', '2026', '2027', '2028', '2029', '2030'];

export default function ProfileScreen() {
  const { data, reset } = useOnboarding();
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGradYear, setEditGradYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [moveOutMode, setMoveOutMode] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const token = await getAccessToken();
      if (!token) return;
      try {
        const res = await getMyProfile(token);
        if (res.data?.user) setProfile(res.data.user);
      } catch {}
    }
    fetchProfile();
  }, []);

  const displayName = profile?.name ?? data.name ?? 'Campus Student';
  const displayEmail = data.email ?? 'verified@student.edu';
  const displayGradYear = profile?.graduation_year?.toString() ?? data.gradYear ?? '';
  const initials = displayName.trim().charAt(0).toUpperCase();

  const handleEditPress = () => {
    setEditName(displayName);
    setEditGradYear(displayGradYear);
    setEditing(true);
  };

  const handleSave = async () => {
    const token = await getAccessToken();
    if (!token) return;
    setSaving(true);
    try {
      const gradYearNum = editGradYear ? parseInt(editGradYear, 10) : null;
      const res = await updateProfile(token, {
        name: editName.trim() || undefined,
        graduation_year: gradYearNum,
      });
      if (res.data?.user) setProfile(res.data.user);
      setEditing(false);
    } catch {
      Alert.alert('Update failed', 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await clearAccessToken();
    } finally {
      reset();
      router.replace('/onboarding/auth');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your listings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const token = await getAccessToken();
            if (!token) return;
            try {
              await deleteAccount(token);
              await clearAccessToken();
              reset();
              router.replace('/onboarding/auth');
            } catch {
              Alert.alert('Error', 'Could not delete account. Please try again.');
            }
          },
        },
      ],
    );
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
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}

          {editing ? (
            <>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your name"
                placeholderTextColor="#98A3B5"
              />
              <Text style={styles.fieldLabel}>Graduation Year</Text>
              <Pressable
                style={styles.editInput}
                onPress={() => {
                  const idx = gradYears.indexOf(editGradYear);
                  setEditGradYear(gradYears[(idx + 1) % gradYears.length]);
                }}>
                <Text style={{ color: '#1E2942', fontSize: 15 }}>{editGradYear || 'Select year'}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#7D869A" />
              </Pressable>
              <View style={styles.editActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.name}>{displayName}</Text>
              <View style={styles.emailRow}>
                <Text style={styles.email}>{displayEmail}</Text>
                <MaterialIcons name="verified-user" size={16} color="#5F64E8" />
              </View>
              {displayGradYear ? (
                <Text style={styles.meta}>Class of {displayGradYear}</Text>
              ) : null}
              <Pressable style={styles.editButton} onPress={handleEditPress}>
                <MaterialIcons name="edit" size={16} color="#32415D" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </Pressable>
            </>
          )}
        </View>

        <Text style={styles.sectionTitle}>My Activity</Text>
        <View style={styles.sectionCard}>
          <Pressable
            style={styles.rowButton}
            onPress={() => handlePending('My Listings', 'Your listings feature is coming soon.')}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="inventory-2" size={20} color="#5F64E8" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>My Listings</Text>
              <Text style={styles.rowSubtitle}>View your active listings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#8692A8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.rowButton}
            onPress={() => handlePending('Saved Items', 'Your saved items feature is coming soon.')}>
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

        <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
          <MaterialIcons name="delete-forever" size={18} color="#9B1C1C" />
          <Text style={styles.deleteText}>Delete Account</Text>
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
  deleteButton: {
    marginTop: 10,
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F5C6C6',
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  deleteText: {
    color: '#9B1C1C',
    fontSize: 15,
    fontWeight: '700',
  },
  fieldLabel: {
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 4,
    color: '#60728F',
    fontSize: 13,
    fontWeight: '600',
  },
  editInput: {
    width: '100%',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7CCD8',
    paddingHorizontal: 14,
    backgroundColor: '#FCFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#1E2942',
    fontSize: 15,
  },
  editActions: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7CCD8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#60728F',
    fontWeight: '700',
    fontSize: 14,
  },
  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#5F64E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
