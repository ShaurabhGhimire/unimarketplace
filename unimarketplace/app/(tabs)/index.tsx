import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getAccessToken } from '@/lib/auth-storage';
import { API_BASE_URL, getBackendHealth, getListings, getMarketplaceItems } from '@/lib/api';
import {
  categoryFilters,
  locationFilters,
  marketplaceItems,
  type MarketplaceItem,
} from '@/data/mock';
import { useOnboarding } from '@/lib/onboarding-context';

const fallbackSellerAvatar =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';

const fallbackListingImage =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80';

const nearbyCollegeMap: Record<string, string[]> = {
  MIT: ['Harvard'],
  'Massachusetts Institute of Technology': ['Harvard'],
  Harvard: ['MIT'],
  Stanford: ['University of California, Berkeley'],
  'California State University, East Bay': ['Stanford'],
};

export default function BrowseScreen() {
  const { data } = useOnboarding();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLocation, setActiveLocation] = useState('All Colleges');
  const [moveOutDeals, setMoveOutDeals] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [items, setItems] = useState<MarketplaceItem[]>(marketplaceItems);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [scrollY, setScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(196);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await getBackendHealth();
        if (!mounted) return;
        setApiStatus('online');
      } catch {
        if (!mounted) return;
        setApiStatus('offline');
        setItems(marketplaceItems);
        return;
      }

      const accessToken = await getAccessToken();

      if (accessToken) {
        try {
          const backendListings = await getListings(accessToken);
          if (!mounted) return;

          if (backendListings.length > 0) {
            const normalized = backendListings.map((item) => ({
              id: item.id,
              category: 'all',
              title: item.title,
              price: item.price,
              seller: 'Campus Seller',
              college: data.collegeName || 'Your College',
              imageUrl: item.images?.[0] || fallbackListingImage,
              sellerAvatar: fallbackSellerAvatar,
              daysLeft: item.is_urgent ? 'Urgent' : undefined,
              description: item.description,
              location: 'Campus meetup location',
              postedAt: item.created_at?.slice(0, 10),
              condition: item.condition,
            }));
            setItems(normalized);
            return;
          }
        } catch {
          if (!mounted) return;
        }
      }

      try {
        const legacyItems = await getMarketplaceItems();
        if (!mounted) return;

        if (legacyItems.length > 0) {
          const normalized = legacyItems.map((item, index) => ({
            id: item.id ?? `backend-${index}`,
            category: 'all',
            title: item.title ?? 'Marketplace Item',
            price: item.price ?? 0,
            seller: item.seller ?? 'Campus Seller',
            college: item.college ?? 'Your College',
            imageUrl: item.image_url ?? fallbackListingImage,
            sellerAvatar: item.seller_avatar ?? fallbackSellerAvatar,
            daysLeft: item.days_left,
            description: 'Backend listing loaded successfully.',
            location: 'Campus meetup location',
            postedAt: '2026-03-16',
            condition: 'Good',
          }));
          setItems(normalized);
        } else {
          setItems(marketplaceItems);
        }
      } catch {
        if (!mounted) return;
        setItems(marketplaceItems);
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [data.collegeName]);

  const currentCollege = data.collegeName || 'MIT';
  const compactHeader = scrollY > 36;
  const hideFilters = scrollY > 12;

  const filteredItems = useMemo(() => {
    const nearbyColleges = nearbyCollegeMap[currentCollege] ?? [];
    return items.filter((item) => {
      const matchesQuery =
        !query.trim() ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesMoveOut = !moveOutDeals || Boolean(item.daysLeft);

      let matchesLocation = true;
      if (activeLocation === 'My College') {
        matchesLocation = item.college === currentCollege;
      } else if (activeLocation === 'Nearby Colleges') {
        matchesLocation = nearbyColleges.includes(item.college);
      }

      return matchesQuery && matchesCategory && matchesMoveOut && matchesLocation;
    });
  }, [activeCategory, activeLocation, currentCollege, items, moveOutDeals, query]);

  function handleHeaderLayout(event: LayoutChangeEvent) {
    setHeaderHeight(event.nativeEvent.layout.height);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View
        onLayout={handleHeaderLayout}
        style={[
          styles.headerShell,
          { paddingTop: insets.top + 8 },
          compactHeader ? styles.headerShellCompact : null,
        ]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            {compactHeader ? (
              <Pressable style={styles.compactIcon}>
                <MaterialIcons name="search" size={20} color="#334155" />
              </Pressable>
            ) : (
              <Text style={styles.heading}>Campus Market</Text>
            )}
          </View>

          <Pressable style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <MaterialIcons name="person" size={20} color="#334155" />
          </Pressable>
        </View>

        {!compactHeader ? (
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={18} color="#8A94A8" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search marketplace"
              placeholderTextColor="#8A94A8"
              style={styles.searchInput}
            />
          </View>
        ) : null}

        {!hideFilters ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inlineRow}>
              {categoryFilters.map((category) => {
                const active = category.id === activeCategory;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setActiveCategory(category.id)}
                    style={[styles.filterChip, active ? styles.filterChipActive : null]}>
                    <MaterialIcons
                      name={category.icon as keyof typeof MaterialIcons.glyphMap}
                      size={16}
                      color={active ? '#FFFFFF' : '#5C677D'}
                    />
                    <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inlineRow}>
              {locationFilters.map((location) => {
                const active = location === activeLocation;
                return (
                  <Pressable
                    key={location}
                    onPress={() => setActiveLocation(location)}
                    style={[styles.locationChip, active ? styles.locationChipActive : null]}>
                    <Text style={[styles.locationText, active ? styles.locationTextActive : null]}>
                      {location}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        ) : null}

        <View style={styles.metaRow}>
          <Pressable
            style={[styles.moveOutPill, moveOutDeals ? styles.moveOutPillActive : null]}
            onPress={() => setMoveOutDeals((value) => !value)}>
            <MaterialIcons name="local-fire-department" size={16} color={moveOutDeals ? '#FFFFFF' : '#D97706'} />
            <Text style={[styles.moveOutText, moveOutDeals ? styles.moveOutTextActive : null]}>Move-Out</Text>
          </Pressable>

          <View style={styles.statusWrap}>
            <View style={[styles.statusDot, apiStatus === 'online' ? styles.statusOnline : styles.statusOffline]} />
            <Text style={styles.statusText}>
              {apiStatus === 'checking' ? 'Checking backend' : apiStatus === 'online' ? 'Backend connected' : 'Mock mode'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight + 12 }]}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}>
        <View style={styles.gridWrap}>
          {filteredItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/listings/${item.id}`)}>
              <View style={styles.imageWrap}>
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} contentFit="cover" />
                <Pressable
                  style={styles.favoriteBtn}
                  onPress={() =>
                    setSavedIds((current) =>
                      current.includes(item.id)
                        ? current.filter((value) => value !== item.id)
                        : [...current, item.id],
                    )
                  }>
                  <MaterialIcons
                    name={savedIds.includes(item.id) ? 'favorite' : 'favorite-border'}
                    size={17}
                    color={savedIds.includes(item.id) ? '#E45569' : '#75809B'}
                  />
                </Pressable>
                {item.daysLeft ? (
                  <View style={styles.daysBadge}>
                    <Text style={styles.daysText}>{item.daysLeft}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.cardBody}>
                <Text numberOfLines={2} style={styles.itemTitle}>
                  {item.title}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
                {item.condition ? <Text style={styles.condition}>{item.condition}</Text> : null}
                <View style={styles.sellerRow}>
                  <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} contentFit="cover" />
                  <Text numberOfLines={1} style={styles.sellerName}>
                    {item.seller}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.college}>
                  {item.college}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No listings match these filters</Text>
            <Text style={styles.emptyBody}>Try a different category, college filter, or search term.</Text>
          </View>
        ) : null}

        <View style={styles.footerSpace}>
          <Text style={styles.apiText}>{API_BASE_URL}</Text>
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
  headerShell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: 'rgba(238,241,245,0.98)',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE4EC',
  },
  headerShellCompact: {
    paddingBottom: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DEE7',
  },
  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DEE7',
  },
  heading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#172033',
  },
  searchBar: {
    marginTop: 10,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#D7DEE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#223049',
    fontSize: 14,
  },
  inlineRow: {
    marginTop: 8,
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    height: 34,
    minWidth: 88,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D7DEE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  filterText: {
    color: '#4B5565',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  locationChip: {
    height: 32,
    minWidth: 104,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7DEE7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationChipActive: {
    backgroundColor: '#E8EEF9',
    borderColor: '#CAD7F0',
  },
  locationText: {
    color: '#607088',
    fontSize: 11,
    fontWeight: '600',
  },
  locationTextActive: {
    color: '#28436B',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  moveOutPill: {
    height: 34,
    minWidth: 92,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#F7D79B',
    backgroundColor: '#FFF4DE',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  moveOutPillActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  moveOutText: {
    color: '#B66508',
    fontSize: 12,
    fontWeight: '700',
  },
  moveOutTextActive: {
    color: '#FFFFFF',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusOnline: {
    backgroundColor: '#16A34A',
  },
  statusOffline: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    color: '#6A7891',
    fontSize: 11,
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 90,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  itemCard: {
    width: '48.4%',
    height: 246,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3EC',
  },
  imageWrap: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 122,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    borderRadius: 11,
    backgroundColor: '#F4A31A',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemTitle: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    minHeight: 36,
  },
  price: {
    marginTop: 5,
    color: '#4F46E5',
    fontSize: 19,
    fontWeight: '800',
  },
  condition: {
    marginTop: 4,
    color: '#73839A',
    fontSize: 10,
    fontWeight: '700',
  },
  sellerRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  sellerName: {
    flex: 1,
    color: '#38485F',
    fontSize: 11,
    fontWeight: '600',
  },
  college: {
    marginTop: 5,
    color: '#78879D',
    fontSize: 11,
  },
  footerSpace: {
    alignItems: 'center',
    marginTop: 16,
  },
  emptyState: {
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE3EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyBody: {
    marginTop: 6,
    color: '#768398',
    fontSize: 12,
    textAlign: 'center',
  },
  apiText: {
    color: '#94A0B2',
    fontSize: 11,
  },
});
