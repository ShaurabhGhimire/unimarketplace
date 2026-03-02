import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
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
import { API_BASE_URL, getBackendHealth, getMarketplaceItems } from '@/lib/api';

export default function BrowseScreen() {
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

      try {
        const backendItems = await getMarketplaceItems();
        if (!mounted) return;

        if (backendItems.length > 0) {
          const normalized = backendItems.map((item, index) => ({
            id: item.id ?? `backend-${index}`,
            title: item.title ?? 'Marketplace Item',
            price: item.price ?? 0,
            seller: item.seller ?? 'Campus Seller',
            college: item.college ?? 'Your College',
            imageUrl:
              item.image_url ??
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
            sellerAvatar:
              item.seller_avatar ??
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
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
  }, []);

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
            <Pressable style={styles.profileBtn}>
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
    borderWidth: 1,
    borderColor: '#BEC2CE',
    borderRadius: 13,
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F8',
  },
  locationChipActive: {
    backgroundColor: '#E0E1E6',
    borderColor: '#E0E1E6',
  },
  locationText: {
    color: '#2C3751',
    fontSize: 18,
    fontWeight: '500',
  },
  locationTextActive: {
    color: '#1F2A44',
    fontWeight: '700',
  },
  moveOutRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moveOutText: {
    color: '#2D3951',
    fontSize: 16,
    fontWeight: '500',
  },
  metaRow: {
    marginTop: 22,
    marginBottom: 12,
  },
  metaText: {
    color: '#667894',
    fontSize: 18,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  itemCard: {
    width: '48.5%',
    borderRadius: 28,
    backgroundColor: '#F8F8FA',
    borderWidth: 1,
    borderColor: '#D0D3DB',
    overflow: 'hidden',
  },
  imageWrap: {
    height: 230,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#F7A90A',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  cardBody: {
    padding: 12,
  },
  itemTitle: {
    color: '#1E2942',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    minHeight: 50,
  },
  price: {
    marginTop: 10,
    color: '#5F64E8',
    fontSize: 20,
    fontWeight: '800',
  },
  sellerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  sellerName: {
    color: '#61708C',
    fontSize: 16,
  },
  collegeRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  college: {
    color: '#61708C',
    fontSize: 16,
  },
});
