import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getMyProfile, getMyListings, updateProfile, deleteAccount, type ProfileRecord, type ListingRecord } from '@/lib/api';
import { SelectModal } from '@/components/SelectModal';
import { clearAccessToken, getAccessToken } from '@/lib/auth-storage';
import { useOnboarding } from '@/lib/onboarding-context';
import { pickAvatar, uploadAvatar } from '@/lib/storage';

const gradYears = ['2025', '2026', '2027', '2028', '2029', '2030'];

export default function ProfileScreen() {
  const { data, reset } = useOnboarding();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGradYear, setEditGradYear] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [myListings, setMyListings] = useState<ListingRecord[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

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
    setEditBio(profile?.bio ?? '');
    setEditPhone(profile?.phone_number ?? '');
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
        bio: editBio.trim() || undefined,
        phone_number: editPhone.trim() || undefined,
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

  const handleOpenListings = async () => {
    setListingsOpen(true);
    setListingsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const listings = await getMyListings(token);
      setMyListings(listings);
    } catch {
      Alert.alert('Error', 'Could not load your listings.');
    } finally {
      setListingsLoading(false);
    }
  };

  const handlePickAvatar = async () => {
    try {
      const asset = await pickAvatar();
      if (!asset) return;
      const token = await getAccessToken();
      if (!token) return;
      setAvatarUploading(true);
      const url = await uploadAvatar(asset, token);
      const res = await updateProfile(token, { avatar_url: url });
      if (res.data?.user) setProfile(res.data.user);
    } catch (err) {
      Alert.alert('Upload failed', err instanceof Error ? err.message : 'Could not upload photo.');
    } finally {
      setAvatarUploading(false);
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
          <Pressable style={styles.avatarWrap} onPress={handlePickAvatar} disabled={avatarUploading}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>{initials}</Text>
              </View>
            )}
            <View style={styles.avatarOverlay}>
              {avatarUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialIcons name="photo-camera" size={18} color="#FFFFFF" />
              )}
            </View>
          </Pressable>

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
              <SelectModal
                value={editGradYear || gradYears[0]}
                options={gradYears}
                onChange={setEditGradYear}
                triggerStyle={styles.editInput}
              />
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.editInput, styles.editInputMultiline]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Tell other students about yourself"
                placeholderTextColor="#98A3B5"
                multiline
                textAlignVertical="top"
              />
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.editInput}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#98A3B5"
                keyboardType="phone-pad"
              />
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
              {profile?.bio ? (
                <Text style={styles.bio}>{profile.bio}</Text>
              ) : null}
              {profile?.phone_number ? (
                <View style={styles.phoneRow}>
                  <MaterialIcons name="phone" size={14} color="#60728F" />
                  <Text style={styles.phoneMeta}>{profile.phone_number}</Text>
                </View>
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
          <Pressable style={styles.rowButton} onPress={handleOpenListings}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="inventory-2" size={20} color="#5F64E8" />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>My Listings</Text>
              <Text style={styles.rowSubtitle}>View your active listings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#8692A8" />
          </Pressable>

        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.sectionCard}>
          <Pressable style={styles.rowButton} onPress={() => setHelpOpen(true)}>
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

      <Modal visible={listingsOpen} animationType="slide" onRequestClose={() => setListingsOpen(false)}>
        <View style={[styles.modalSafe, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>My Listings</Text>
            <Pressable onPress={() => setListingsOpen(false)}>
              <MaterialIcons name="close" size={26} color="#1F2A44" />
            </Pressable>
          </View>

          {listingsLoading ? (
            <View style={styles.modalCenter}>
              <ActivityIndicator size="large" color="#5F64E8" />
            </View>
          ) : myListings.length === 0 ? (
            <View style={styles.modalCenter}>
              <MaterialIcons name="inventory-2" size={48} color="#C0C6D4" />
              <Text style={styles.emptyText}>No listings yet</Text>
              <Text style={styles.emptySubtext}>Items you post will appear here</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.listingsContainer} showsVerticalScrollIndicator={false}>
              {myListings.map((listing) => (
                <Pressable
                  key={listing.id}
                  style={styles.listingCard}
                  onPress={() => {
                    setListingsOpen(false);
                    router.push(`/listings/${listing.id}`);
                  }}>
                  {listing.images?.[0] ? (
                    <Image source={{ uri: listing.images[0] }} style={styles.listingImage} contentFit="cover" />
                  ) : (
                    <View style={[styles.listingImage, styles.listingImageFallback]}>
                      <MaterialIcons name="image" size={28} color="#C0C6D4" />
                    </View>
                  )}
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
                    <Text style={styles.listingPrice}>${listing.price}</Text>
                    <View style={[styles.statusBadge, listing.status === 'active' ? styles.statusActive : styles.statusOther]}>
                      <Text style={[styles.statusText, listing.status === 'active' ? styles.statusTextActive : styles.statusTextOther]}>
                        {listing.status}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color="#8692A8" />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      <Modal visible={helpOpen} animationType="slide" onRequestClose={() => setHelpOpen(false)}>
        <View style={[styles.modalSafe, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <Pressable onPress={() => setHelpOpen(false)}>
              <MaterialIcons name="close" size={26} color="#1F2A44" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.helpContainer} showsVerticalScrollIndicator={false}>
            {[
              {
                q: 'What is UniMarketplace?',
                a: 'UniMarketplace is a campus marketplace where verified college students can buy and sell items within their own campus community.',
              },
              {
                q: 'Who can use UniMarketplace?',
                a: 'Only students with a verified .edu email address can sign up and browse listings.',
              },
              {
                q: 'How do I post a listing?',
                a: 'Tap the Sell tab at the bottom, fill in your item\'s title, description, price, category, and condition, then tap Post Listing.',
              },
              {
                q: 'How do I message a seller?',
                a: 'Open any listing and tap the message button to start a conversation directly with the seller.',
              },
              {
                q: 'Can I see my own listings?',
                a: 'Yes — go to Profile → My Listings to view, manage, or delete any item you\'ve posted.',
              },
              {
                q: 'What is Move-Out Mode?',
                a: 'Move-Out Mode marks your listings as urgent so buyers know items need to go quickly. Enable it when creating a listing on the Sell screen.',
              },
              {
                q: 'Does UniMarketplace handle payments?',
                a: 'No. Payments and pickup are arranged directly between the buyer and seller. Always meet in safe, public campus locations.',
              },
              {
                q: 'How do I re-list a sold item?',
                a: 'Open the listing from My Listings and tap "Mark as Active" at the bottom. This moves it back to active so buyers can find it again.',
              },
              {
                q: 'How do I delete my account?',
                a: 'Scroll to the bottom of your Profile page and tap Delete Account. This permanently removes your account and all your listings.',
              },
            ].map(({ q, a }) => (
              <View key={q} style={styles.faqItem}>
                <Text style={styles.faqQ}>{q}</Text>
                <Text style={styles.faqA}>{a}</Text>
              </View>
            ))}

            <View style={styles.contactBox}>
              <MaterialIcons name="email" size={20} color="#5F64E8" />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Still need help? Email us</Text>
                <Text style={styles.contactEmail}>bijayabc1234@gmail.com</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  avatarWrap: {
    marginBottom: 16,
    position: 'relative',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5F64E8',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1F2A44CC',
    alignItems: 'center',
    justifyContent: 'center',
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
  bio: {
    marginTop: 10,
    color: '#60728F',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  phoneMeta: {
    color: '#60728F',
    fontSize: 13,
  },
  editInputMultiline: {
    minHeight: 80,
    paddingTop: 12,
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
  modalSafe: {
    flex: 1,
    backgroundColor: '#F8F8FB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#F8F8FB',
    borderBottomWidth: 1,
    borderBottomColor: '#D8DCE6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2A44',
  },
  modalCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3A4460',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6E7890',
  },
  listingsContainer: {
    padding: 14,
    gap: 10,
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8DCE6',
    padding: 12,
    gap: 12,
  },
  listingImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  listingImageFallback: {
    backgroundColor: '#EDEEF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingInfo: {
    flex: 1,
    gap: 4,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2A44',
  },
  listingPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5F64E8',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusActive: {
    backgroundColor: '#D6F5E8',
  },
  statusOther: {
    backgroundColor: '#EEF1F8',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  statusTextActive: {
    color: '#1B6048',
  },
  statusTextOther: {
    color: '#4A5568',
  },
  helpContainer: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  faqItem: {
    backgroundColor: '#F8F8FB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DCE6',
    padding: 14,
    gap: 6,
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2A44',
  },
  faqA: {
    fontSize: 13,
    color: '#60728F',
    lineHeight: 20,
  },
  contactBox: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EEEFFE',
    borderRadius: 16,
    padding: 14,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3C4DB6',
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5F64E8',
    marginTop: 2,
  },
});
