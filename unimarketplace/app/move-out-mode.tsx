import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

const benefits = [
  {
    id: 'b1',
    icon: 'visibility',
    title: 'Increased Visibility',
    detail: 'Your listings appear at the top with an urgency badge',
  },
  {
    id: 'b2',
    icon: 'trending-up',
    title: 'Higher Response Rate',
    detail: 'Buyers know you need to sell quickly and respond faster',
  },
  {
    id: 'b3',
    icon: 'speed',
    title: 'Quick Bulk Posting',
    detail: 'Create multiple listings at once with templates',
  },
];

export default function MoveOutModeScreen() {
  const [enabled, setEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={30} color="#79808B" />
        </Pressable>
        <Text style={styles.headerTitle}>Move-Out Mode</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#F3A103', '#EA8700']} style={styles.hero}>
          <MaterialIcons name="local-fire-department" size={68} color="#FFFFFF" />
          <Text style={styles.heroTitle}>Move-Out Mode</Text>
          <Text style={styles.heroCopy}>
            Sell your items faster with priority placement and urgency tags
          </Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Benefits</Text>
        <View style={styles.benefitsWrap}>
          {benefits.map((benefit) => (
            <View key={benefit.id} style={styles.benefitRow}>
              <MaterialIcons
                name={benefit.icon as keyof typeof MaterialIcons.glyphMap}
                size={32}
                color="#646AE8"
                style={styles.benefitIcon}
              />
              <View style={styles.benefitBody}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitText}>{benefit.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: '#646AE8' }} />
            <Text style={styles.settingLabel}>Enable Move-Out Mode</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.tipTitle}>💡 Pro Tips</Text>
          <Text style={styles.tipLine}>• Price items competitively for faster sales</Text>
          <Text style={styles.tipLine}>• Be responsive to messages</Text>
          <Text style={styles.tipLine}>• Offer bundle deals for multiple items</Text>
          <Text style={styles.tipLine}>• Consider &quot;pick up today&quot; options</Text>
        </View>

        <Pressable style={styles.actionBtn} onPress={() => router.back()}>
          <Text style={styles.actionText}>
            {enabled ? 'Save Move-Out Mode Settings' : 'Keep Move-Out Mode Disabled'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EDEEF2',
  },
  header: {
    height: 76,
    backgroundColor: '#F6F6F8',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  back: {
    width: 42,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 42 / 2,
    fontWeight: '800',
    color: '#202A3E',
  },
  container: {
    padding: 12,
    paddingBottom: 100,
    gap: 14,
  },
  hero: {
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 49 / 2,
    fontWeight: '800',
  },
  heroCopy: {
    marginTop: 8,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 35,
  },
  sectionTitle: {
    fontSize: 22 * 1,
    color: '#202A3E',
    fontWeight: '800',
    marginTop: 2,
  },
  benefitsWrap: {
    gap: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  benefitIcon: {
    marginTop: 1,
  },
  benefitBody: {
    flex: 1,
    gap: 4,
  },
  benefitTitle: {
    fontSize: 21,
    color: '#202A3E',
    fontWeight: '800',
  },
  benefitText: {
    color: '#627492',
    fontSize: 18,
    lineHeight: 30,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DBDDE4',
    backgroundColor: '#F6F6F8',
    padding: 14,
  },
  cardTitle: {
    fontSize: 44 / 2,
    color: '#202A3E',
    fontWeight: '800',
  },
  settingRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingLabel: {
    color: '#202A3E',
    fontSize: 37 / 2,
  },
  tipTitle: {
    color: '#646AE8',
    fontWeight: '700',
    fontSize: 18 * 1,
    marginBottom: 8,
  },
  tipLine: {
    color: '#627492',
    fontSize: 34 / 2,
    lineHeight: 30,
  },
  actionBtn: {
    marginTop: 4,
    height: 62,
    borderRadius: 16,
    backgroundColor: '#646AE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
