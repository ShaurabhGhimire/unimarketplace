import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { marketplaceItems, messageThreads } from '@/data/mock';

export default function ListingDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const insets = useSafeAreaInsets();

  const listing = useMemo(() => {
    return marketplaceItems.find((item) => item.id === params.id) ?? marketplaceItems[0];
  }, [params.id]);
  const linkedThread = messageThreads.find((thread) => thread.listingId === listing.id) ?? messageThreads[0];

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
          <Pressable style={styles.iconButton} onPress={() => setSaved((value) => !value)}>
            <MaterialIcons
              name={saved ? 'favorite' : 'favorite-border'}
              size={20}
              color={saved ? '#E45569' : '#243047'}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 92 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: listing.imageUrl }} style={styles.heroImage} contentFit="cover" />

        {listing.daysLeft ? (
          <View style={styles.urgencyBadge}>
            <MaterialIcons name="local-fire-department" size={13} color="#FFFFFF" />
            <Text style={styles.urgencyText}>{listing.daysLeft}</Text>
          </View>
        ) : null}

        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>${listing.price}</Text>

        {listing.condition ? (
          <View style={styles.conditionPill}>
            <Text style={styles.conditionText}>{listing.condition}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionBody}>
            {listing.description || 'Item details will appear here once the backend returns richer listing metadata.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller</Text>
          <View style={styles.sellerCard}>
            <Image source={{ uri: listing.sellerAvatar }} style={styles.avatar} contentFit="cover" />
            <View style={styles.sellerCopy}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{listing.seller}</Text>
                <MaterialIcons name="verified-user" size={16} color="#4F46E5" />
              </View>
              <Text style={styles.sellerCollege}>{listing.college}</Text>
            </View>
          </View>
        </View>

        <View style={styles.metaList}>
          <View style={styles.metaRow}>
            <MaterialIcons name="place" size={14} color="#6C7990" />
            <Text style={styles.metaText}>{listing.location || 'Campus meetup location'}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialIcons name="schedule" size={15} color="#6C7990" />
            <Text style={styles.metaText}>Posted {listing.postedAt || 'recently'}</Text>
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
    height: 220,
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
