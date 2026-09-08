import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

type GiftCard = {
  id: string; brand: string; emoji: string; color: string;
  balanceTRY: number; expiry: string;
};

const GIFT_CARDS: GiftCard[] = [
  { id: 'trendyol', brand: 'Trendyol', emoji: '🛍️', color: '#F27A1A', balanceTRY: 250, expiry: '12/2026' },
  { id: 'amazon',   brand: 'Amazon',   emoji: '📦', color: '#FF9900', balanceTRY: 120, expiry: '06/2025' },
  { id: 'steam',    brand: 'Steam',    emoji: '🎮', color: '#4C6B8A', balanceTRY: 500, expiry: '03/2027' },
];

function fmt(v: number) {
  return `₺ ${v.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function isExpiringSoon(expiry: string) {
  const [month, year] = expiry.split('/').map(Number);
  const exp = new Date(year, month - 1);
  const now = new Date();
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return diff < 3;
}

export default function HediyeKartiScreen() {
  const router = useRouter();
  const totalBalance = GIFT_CARDS.reduce((t, c) => t + c.balanceTRY, 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Hediye Kartları</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Özet */}
        <View style={s.summaryCard}>
          <View>
            <Text style={s.summaryLabel}>Toplam Bakiye</Text>
            <Text style={s.summaryAmount}>{fmt(totalBalance)}</Text>
            <Text style={s.summarySub}>{GIFT_CARDS.length} aktif kart</Text>
          </View>
        </View>

        {/* Kartlar */}
        <View style={s.cardsGrid}>
          {GIFT_CARDS.map(card => {
            const soon = isExpiringSoon(card.expiry);
            return (
              <TouchableOpacity key={card.id} style={[s.giftCard, { borderColor: card.color + '40' }]} activeOpacity={0.8}>
                <View style={[s.cardTop, { backgroundColor: card.color + '18' }]}>
                  <Text style={s.cardEmoji}>{card.emoji}</Text>
                  {soon && (
                    <View style={s.expiryWarn}>
                      <Text style={s.expiryWarnText}>Yakında sona erer</Text>
                    </View>
                  )}
                </View>
                <View style={s.cardBottom}>
                  <Text style={s.cardBrand}>{card.brand}</Text>
                  <Text style={s.cardBalance}>{fmt(card.balanceTRY)}</Text>
                  <Text style={s.cardExpiry}>Son: {card.expiry}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Kart Ekle */}
          <TouchableOpacity style={s.addCard} activeOpacity={0.7}>
            <Plus size={28} color={colors.text3} strokeWidth={1.5} />
            <Text style={s.addCardText}>Kart Ekle</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title:   { color: colors.text1, fontSize: 17, fontWeight: '700' },

  summaryCard:  { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 16 },
  summaryLabel: { color: colors.text3, fontSize: 12, fontWeight: '600' },
  summaryAmount:{ color: colors.text1, fontSize: 26, fontWeight: '800', marginVertical: 2 },
  summarySub:   { color: colors.text3, fontSize: 12 },

  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  giftCard:  { width: '47%', backgroundColor: colors.surface1, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  cardTop:   { padding: 16, alignItems: 'flex-start', minHeight: 80, justifyContent: 'space-between' },
  cardEmoji: { fontSize: 32 },
  expiryWarn:{ backgroundColor: '#EF444418', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  expiryWarnText: { color: '#EF4444', fontSize: 10, fontWeight: '700' },
  cardBottom:{ padding: 12, paddingTop: 10 },
  cardBrand: { color: colors.text3, fontSize: 11, fontWeight: '600', marginBottom: 2 },
  cardBalance:{ color: colors.text1, fontSize: 18, fontWeight: '900' },
  cardExpiry:{ color: colors.text3, fontSize: 11, marginTop: 3 },

  addCard:   { width: '47%', backgroundColor: colors.surface1, borderRadius: 18, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', minHeight: 140, gap: 8 },
  addCardText:{ color: colors.text3, fontSize: 13, fontWeight: '600' },
});
