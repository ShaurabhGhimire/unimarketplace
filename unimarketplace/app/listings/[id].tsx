import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { marketplaceItems, messageThreads } from '@/data/mock';
import { deleteListing, getListingById, type ListingRecord, type SellerProfile } from '@/lib/api';
import { getAccessToken } from '@/lib/auth-storage';

const fallbackImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80';
const fallbackAvatar = 'https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ListingDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [backendListing, setBackendListing] = useState<ListingRecord | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const isRealListing = UUID_REGEX.test(params.id ?? '');

  useEffect(() => {
    if (!isRealListing) return;
    let mounted = true;
    async function fetch() {
      setLoading(true);
      try {
        const token = await getAccessToken();
        if (!token) return;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (mounted && payload.sub) setCurrentUserId(payload.sub);
        } catch {}
        const res = await getListingById(token, params.id);
        if (mounted && res.data?.listing) {
          setBackendListing(res.data.listing);
          setSeller(res.data.seller ?? null);
        }
      } catch {
        // falls back to mock below
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, [params.id, isRealListing]);

  const isOwner = !!backendListing && backendListing.seller_id === currentUserId;

  async function handleDelete() {
    Alert.alert('Delete Listing', 'Are you sure you want to delete this listing?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await getAccessToken();
          if (!token || !backendListing) return;
          try {
            await deleteListing(token, backendListing.id);
            router.replace('/');
          } catch {
            Alert.alert('Error', 'Failed to delete listing. Please try again.');
          }
        },
      },
    ]);
  }

  const mockListing = useMemo(() => {
    return marketplaceItems.find((item) => item.id === params.id) ?? marketplaceItems[0];
  }, [params.id]);

  const linkedThread = messageThreads.find((thread) => thread.listingId === mockListing.id) ?? messageThreads[0];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  const title = backendListing?.title ?? mockListing.title;
  const price = backendListing?.price ?? mockListing.price;
  const description = backendListing?.description ?? mockListing.description;
  const condition = backendListing?.condition ?? mockListing.condition;
  const imageUrl = backendListing?.images?.[0] ?? mockListing.imageUrl ?? fallbackImage;
  const isUrgent = backendListing ? backendListing.is_urgent : Boolean(mockListing.daysLeft);
  const postedAt = backendListing?.created_at?.slice(0, 10) ?? mockListing.postedAt;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#243047" />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="ios-share" size={20} color="#243047" />
          </Pressable>
          {isOwner ? (
            <Pressable style={styles.iconButton} onPress={handleDelete}>
              <MaterialIcons name="delete-outline" size={20} color="#DC2626" />
            </Pressable>
          ) : (
            <Pressable style={styles.iconButton} onPress={() => setSaved((value) => !value)}>
              <MaterialIcons
                name={saved ? 'favorite' : 'favorite-border'}
                size={20}
                color={saved ? '#E45569' : '#243047'}
              />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 92 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setFullscreen(true)}>
          <Image source={{ uri: imageUrl }} style={styles.heroImage} contentFit="contain" />
        </Pressable>

        <Modal visible={fullscreen} transparent animationType="fade" onRequestClose={() => setFullscreen(false)}>
          <Pressable style={styles.fullscreenBackdrop} onPress={() => setFullscreen(false)}>
            <Image source={{ uri: imageUrl }} style={styles.fullscreenImage} contentFit="contain" />
          </Pressable>
        </Modal>

        {isUrgent ? (
          <View style={styles.urgencyBadge}>
            <MaterialIcons name="local-fire-department" size={13} color="#FFFFFF" />
            <Text style={styles.urgencyText}>Urgent</Text>
          </View>
        ) : null}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price}</Text>

        {condition ? (
          <View style={styles.conditionPill}>
            <Text style={styles.conditionText}>{condition}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionBody}>
            {description || 'No description provided.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller</Text>
          <View style={styles.sellerCard}>
            <Image
              source={{ uri: seller?.avatar_url ?? (backendListing ? fallbackAvatar : mockListing.sellerAvatar) }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.sellerCopy}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>
                  {seller?.name ?? (backendListing ? 'Campus Seller' : mockListing.seller)}
                </Text>
                <MaterialIcons name="verified-user" size={16} color="#4F46E5" />
              </View>
              <Text style={styles.sellerCollege}>
                {backendListing ? 'Verified Student' : mockListing.college}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metaList}>
          <View style={styles.metaRow}>
            <MaterialIcons name="place" size={14} color="#6C7990" />
            <Text style={styles.metaText}>Campus meetup location</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialIcons name="schedule" size={15} color="#6C7990" />
            <Text style={styles.metaText}>Posted {postedAt || 'recently'}</Text>
          </View>
        </View>

        <View style={styles.safetyBox}>
          <Text style={styles.safetyTitle}>Safety</Text>
          <Text style={styles.safetyText}>Meet in public places on campus and inspect the item before paying.</Text>
        </View>
      </ScrollView>

      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable style={styles.ctaButton} onPress={() => router.push(`/messages/${linkedThread.id}`)}>
          <Text style={styles.ctaText}>Message Seller</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF1F5',
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F8FB',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE4EC',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCE3EC',
  },
  content: {
    paddingBottom: 100,
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#1a1a1a',
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  urgencyBadge: {
    marginTop: 10,
    marginHorizontal: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F59E0B',
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    marginTop: 12,
    marginHorizontal: 12,
    color: '#172033',
    fontSize: 21,
    fontWeight: '800',
  },
  price: {
    marginTop: 6,
    marginHorizontal: 12,
    color: '#4F46E5',
    fontSize: 25,
    fontWeight: '800',
  },
  conditionPill: {
    marginTop: 10,
    marginHorizontal: 12,
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: '#E7F6EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  conditionText: {
    color: '#177A52',
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
    marginHorizontal: 12,
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionBody: {
    color: '#61728E',
    fontSize: 13,
    lineHeight: 20,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3EC',
    padding: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  sellerCopy: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sellerName: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '700',
  },
  sellerCollege: {
    marginTop: 3,
    color: '#61728E',
    fontSize: 12,
  },
  metaList: {
    marginTop: 16,
    marginHorizontal: 12,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metaText: {
    color: '#61728E',
    fontSize: 12,
  },
  safetyBox: {
    marginTop: 18,
    marginHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFF3DB',
    padding: 12,
  },
  safetyTitle: {
    color: '#8A6207',
    fontSize: 12,
    fontWeight: '700',
  },
  safetyText: {
    marginTop: 4,
    color: '#6F6341',
    fontSize: 12,
    lineHeight: 18,
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: '#F7F8FB',
    borderTopWidth: 1,
    borderTopColor: '#DEE4EC',
  },
  ctaButton: {
    height: 46,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
