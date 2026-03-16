import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  categoryFilters,
  locationFilters,
  marketplaceItems,
  type MarketplaceItem,
} from '@/data/mock';
import { getAccessToken } from '@/lib/auth-storage';
import { API_BASE_URL, getBackendHealth, getListings, getMarketplaceItems } from '@/lib/api';
import { useOnboarding } from '@/lib/onboarding-context';

const fallbackSellerAvatar =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';

const fallbackListingImage =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80';

export default function BrowseScreen() {
  const { data } = useOnboarding();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLocation, setActiveLocation] = useState('All Colleges');
  const [moveOutDeals, setMoveOutDeals] = useState(false);
  const [items, setItems] = useState<MarketplaceItem[]>(marketplaceItems);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

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
              title: item.title,
              price: item.price,
              seller: 'Campus Seller',
              college: data.collegeName || 'Your College',
              imageUrl: item.images?.[0] || fallbackListingImage,
              sellerAvatar: fallbackSellerAvatar,
              daysLeft: item.is_urgent ? 'Urgent' : undefined,
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
            title: item.title ?? 'Marketplace Item',
            price: item.price ?? 0,
            seller: item.seller ?? 'Campus Seller',
            college: item.college ?? 'Your College',
            imageUrl: item.image_url ?? fallbackListingImage,
            sellerAvatar: item.seller_avatar ?? fallbackSellerAvatar,
            daysLeft: item.days_left,
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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const inQuery = item.title.toLowerCase().includes(query.toLowerCase());
      return inQuery;
    });
  }, [items, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.appCard}>
          <View style={styles.topRow}>
            <Text style={styles.heading}>Campus Market</Text>
            <Pressable style={styles.profileBtn} onPress={() => router.push('/profile')}>
              <MaterialIcons name="person" size={24} color="#7E7E7E" />
            </Pressable>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, apiStatus === 'online' ? styles.statusOnline : styles.statusOffline]} />
            <Text style={styles.statusText}>
              Backend: {apiStatus === 'checking' ? 'Checking...' : apiStatus === 'online' ? 'Connected' : 'Offline (mock data)'}
            </Text>
          </View>
          <Text style={styles.apiText}>{API_BASE_URL}</Text>

          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={28} color="#7A869F" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search marketplace..."
              placeholderTextColor="#99A1B0"
              style={styles.searchInput}
            />
          </View>

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
                    size={20}
                    color={active ? '#FFFFFF' : '#4E596D'}
                  />
                  <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.divider} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inlineRow}>
            {locationFilters.map((location) => {
              const active = location === activeLocation;
              return (
                <Pressable
                  key={location}
                  onPress={() => setActiveLocation(location)}
                  style={[styles.locationChip, active ? styles.locationChipActive : null]}>
                  {location !== 'All Colleges' ? (
                    <MaterialIcons
                      name={location === 'My College' ? 'school' : 'location-on'}
                      size={19}
                      color={active ? '#1F2A44' : '#4E596D'}
                    />
                  ) : null}
                  <Text style={[styles.locationText, active ? styles.locationTextActive : null]}>{location}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.divider} />

          <View style={styles.moveOutRow}>
            <Switch value={moveOutDeals} onValueChange={setMoveOutDeals} trackColor={{ true: '#FFB01F' }} />
            <Text style={styles.moveOutText}>🔥 Move-Out Deals</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{filteredItems.length} items · {activeLocation}</Text>
          </View>

          <View style={styles.gridWrap}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.imageWrap}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} contentFit="cover" />
                  <Pressable style={styles.favoriteBtn}>
                    <MaterialIcons name="favorite-border" size={25} color="#75809B" />
                  </Pressable>
                  {item.daysLeft ? (
                    <View style={styles.daysBadge}>
                      <Text style={styles.daysText}>{item.daysLeft}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                  <View style={styles.sellerRow}>
                    <Image source={{ uri: item.sellerAvatar }} style={styles.avatar} contentFit="cover" />
                    <Text style={styles.sellerName}>{item.seller}</Text>
                  </View>
                  <View style={styles.collegeRow}>
                    <MaterialIcons name="location-on" size={17} color="#6B7A94" />
                    <Text style={styles.college}>{item.college}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ECECF1',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  appCard: {
    borderRadius: 30,
    backgroundColor: '#F4F4F6',
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#5F64E8',
  },
  profileBtn: {
    height: 54,
    width: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: '#D1D1D8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9FB',
  },
  statusRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOnline: {
    backgroundColor: '#08B26B',
  },
  statusOffline: {
    backgroundColor: '#D25353',
  },
  statusText: {
    color: '#5B6F8D',
    fontSize: 12,
    fontWeight: '600',
  },
  apiText: {
    marginTop: 2,
    color: '#8794AA',
    fontSize: 11,
  },
  searchBar: {
    marginTop: 18,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#D0D2DA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFC',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    color: '#243047',
  },
  inlineRow: {
    marginTop: 18,
    gap: 10,
    paddingRight: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#C3C7D1',
    borderRadius: 13,
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F8',
  },
  filterChipActive: {
    backgroundColor: '#5F64E8',
    borderColor: '#5F64E8',
  },
  filterText: {
    color: '#29354C',
    fontSize: 18,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: '#DADCE2',
  },
  locationChip: {
    borderRadius: 13,
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F2F7',
  },
  locationChipActive: {
    backgroundColor: '#F8ECCD',
  },
  locationText: {
    color: '#4B586E',
    fontSize: 16,
    fontWeight: '500',
  },
  locationTextActive: {
    color: '#1F2A44',
    fontWeight: '700',
  },
  moveOutRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moveOutText: {
    color: '#1F2A44',
    fontSize: 17,
    fontWeight: '700',
  },
  metaRow: {
    marginTop: 16,
  },
  metaText: {
    color: '#6B7A94',
    fontSize: 13,
    fontWeight: '600',
  },
  gridWrap: {
    marginTop: 16,
    gap: 14,
  },
  itemCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DBE5',
  },
  imageWrap: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 190,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    borderRadius: 12,
    backgroundColor: '#F5A524',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    padding: 14,
  },
  itemTitle: {
    color: '#1E2942',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  price: {
    marginTop: 8,
    color: '#5F64E8',
    fontSize: 24,
    fontWeight: '800',
  },
  sellerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  sellerName: {
    color: '#263145',
    fontSize: 14,
    fontWeight: '700',
  },
  collegeRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  college: {
    color: '#6B7A94',
    fontSize: 13,
  },
});
