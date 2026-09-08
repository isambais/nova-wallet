import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Plus } from 'lucide-react-native';
import { colors, gradients } from '../../src/theme/colors';

const { width: SW } = Dimensions.get('window');

const CARDS = [
  { id: '1', last4: '4242', type: 'Visa',       balance: '₺ 4.200,00', gradient: gradients.card },
  { id: '2', last4: '8810', type: 'Mastercard', balance: '₺ 8.250,00', gradient: ['#1A1040', '#2D1C6E', '#4C1D95'] as [string, string, string] },
];

export default function CardsScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Kartlarım</Text>
        <TouchableOpacity style={s.addBtn}>
          <Plus size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Kart carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.cardsScroll}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {CARDS.map(card => (
            <LinearGradient
              key={card.id}
              colors={card.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.creditCard}
            >
              <View style={s.cardTop}>
                <CreditCard size={22} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
                <Text style={s.cardType}>{card.type}</Text>
              </View>
              <Text style={s.cardNumber}>•••• •••• •••• {card.last4}</Text>
              <View style={s.cardBottom}>
                <View>
                  <Text style={s.cardLabel}>Kart Bakiyesi</Text>
                  <Text style={s.cardBalance}>{card.balance}</Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Kart yoksa placeholder */}
        {CARDS.length === 0 && (
          <View style={s.empty}>
            <CreditCard size={48} color={colors.text3} strokeWidth={1.5} />
            <Text style={s.emptyTitle}>Henüz kart yok</Text>
            <Text style={s.emptySub}>Yeni kart eklemek için + butonuna bas</Text>
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content:{ paddingHorizontal: 20 },

  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  title:   { color: colors.text1, fontSize: 22, fontWeight: '800' },
  addBtn:  { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },

  cardsScroll: { marginHorizontal: -20, paddingLeft: 20, marginBottom: 24 },
  creditCard:  { width: SW - 60, borderRadius: 20, padding: 22, marginRight: 14, height: 160 },
  cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  cardType:    { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  cardNumber:  { color: 'rgba(255,255,255,0.9)', fontSize: 16, letterSpacing: 2, fontWeight: '600', marginBottom: 16 },
  cardBottom:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel:   { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 },
  cardBalance: { color: '#fff', fontSize: 18, fontWeight: '800' },

  empty:      { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { color: colors.text1, fontSize: 18, fontWeight: '700' },
  emptySub:   { color: colors.text2, fontSize: 14, textAlign: 'center' },
});
