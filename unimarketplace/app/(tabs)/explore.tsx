import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { categories, featuredListings } from '@/data/mock';
import { useColorScheme } from '@/hooks/use-color-scheme';

const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low'] as const;

type SortOption = (typeof sortOptions)[number];

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Newest');

  const listings = useMemo(() => {
    const items = featuredListings.filter(
      (item) => selectedCategory === 'All' || item.category === selectedCategory,
    );

    if (sortBy === 'Price: Low to High') {
      return [...items].sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'Price: High to Low') {
      return [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [selectedCategory, sortBy]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}> 
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: palette.text }]}>Discover</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>Explore by category and sort options</Text>

        <Text style={[styles.groupLabel, { color: palette.text }]}>Category</Text>
        <View style={styles.rowWrap}>
          {categories.map((category) => {
            const active = category === selectedCategory;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.tag,
                  {
                    borderColor: active ? palette.tint : palette.border,
                    backgroundColor: active ? palette.tint : palette.card,
                  },
                ]}>
                <Text style={{ color: active ? '#FFFFFF' : palette.text, fontWeight: '600' }}>
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.groupLabel, { color: palette.text }]}>Sort</Text>
        <View style={styles.rowWrap}>
          {sortOptions.map((option) => {
            const active = option === sortBy;
            return (
              <Pressable
                key={option}
                onPress={() => setSortBy(option)}
                style={[
                  styles.tag,
                  {
                    borderColor: active ? palette.tint : palette.border,
                    backgroundColor: active ? palette.tint : palette.card,
                  },
                ]}>
                <Text style={{ color: active ? '#FFFFFF' : palette.text, fontWeight: '600' }}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: palette.text }]}>Results</Text>
          <Text style={[styles.resultsCount, { color: palette.muted }]}>{listings.length} listings</Text>
        </View>

        {listings.map((item) => (
          <View key={item.id} style={[styles.resultCard, { backgroundColor: palette.card, borderColor: palette.border }]}> 
            <Text style={styles.emoji}>{item.image}</Text>
            <View style={styles.resultContent}>
              <Text style={[styles.itemTitle, { color: palette.text }]}>{item.title}</Text>
              <Text style={[styles.itemMeta, { color: palette.muted }]}>
                {item.campus} • {item.condition}
              </Text>
              <Text style={[styles.itemPrice, { color: palette.tint }]}>${item.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resultsHeader: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultsCount: {
    fontSize: 13,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  emoji: {
    fontSize: 26,
  },
  resultContent: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemMeta: {
    fontSize: 12,
  },
  itemPrice: {
    marginTop: 2,
    fontSize: 17,
    fontWeight: '800',
  },
});
