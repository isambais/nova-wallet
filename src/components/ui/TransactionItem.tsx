import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  TrendingUp, ShoppingBag, Coffee, Bus,
  Zap, Tv, Repeat, DollarSign,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { formatAmount, type Currency } from '../../utils/currency';
import type { Transaction, TransactionCategory } from '../../data/transactions';

// ─── KATEGORİ KONFİGÜRASYONU ─────────────────────────────────────
type CategoryConfig = {
  icon: React.ReactNode;
  bgColor: string;
  label: string;
};

function getCategoryConfig(category: TransactionCategory, iconSize = 18): CategoryConfig {
  switch (category) {
    case 'income':
      return {
        icon: <TrendingUp size={iconSize} color={colors.success} strokeWidth={2} />,
        bgColor: colors.success + '22',
        label: 'Gelir',
      };
    case 'food':
      return {
        icon: <Coffee size={iconSize} color="#F59E0B" strokeWidth={2} />,
        bgColor: '#F59E0B22',
        label: 'Yemek',
      };
    case 'shopping':
      return {
        icon: <ShoppingBag size={iconSize} color={colors.purple} strokeWidth={2} />,
        bgColor: colors.purple + '22',
        label: 'Alışveriş',
      };
    case 'transport':
      return {
        icon: <Bus size={iconSize} color="#38BDF8" strokeWidth={2} />,
        bgColor: '#38BDF822',
        label: 'Ulaşım',
      };
    case 'bills':
      return {
        icon: <Zap size={iconSize} color="#EF4444" strokeWidth={2} />,
        bgColor: '#EF444422',
        label: 'Fatura',
      };
    case 'entertainment':
      return {
        icon: <Tv size={iconSize} color="#A855F7" strokeWidth={2} />,
        bgColor: '#A855F722',
        label: 'Eğlence',
      };
    case 'subscriptions':
      return {
        icon: <Repeat size={iconSize} color="#06B6D4" strokeWidth={2} />,
        bgColor: '#06B6D422',
        label: 'Abonelik',
      };
    default:
      return {
        icon: <DollarSign size={iconSize} color={colors.text2} strokeWidth={2} />,
        bgColor: colors.surface1,
        label: 'Diğer',
      };
  }
}

// ─── TARİH FORMAT ────────────────────────────────────────────────
function formatDate(iso: string): string {
  const date = new Date(iso);
  const now  = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (diff === 0) return 'Bugün';
  if (diff === 1) return 'Dün';
  if (diff < 7)  return `${diff} gün önce`;

  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

// ─── COMPONENT ────────────────────────────────────────────────────
interface Props {
  tx: Transaction;
  showBorder?: boolean;
  onPress?: (tx: Transaction) => void;
  displayCurrency?: Currency;   // gösterim para birimi (varsayılan: tx.accountCurrency)
}

export function TransactionItem({
  tx,
  showBorder = true,
  onPress,
  displayCurrency,
}: Props) {
  const cfg = getCategoryConfig(tx.category);
  const isIncome = tx.amount >= 0;
  const currency: Currency = displayCurrency ?? tx.accountCurrency ?? 'TRY';

  return (
    <TouchableOpacity
      style={[s.row, showBorder && s.rowBorder]}
      onPress={() => onPress?.(tx)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* İkon */}
      <View style={[s.iconBox, { backgroundColor: cfg.bgColor }]}>
        {cfg.icon}
      </View>

      {/* Bilgi */}
      <View style={s.info}>
        <Text style={s.title} numberOfLines={1}>{tx.title}</Text>
        <View style={s.metaRow}>
          {/* Kategori rozeti */}
          <View style={[s.badge, { backgroundColor: cfg.bgColor }]}>
            <Text style={[s.badgeText, { color: isIncome ? colors.success : colors.text2 }]}>
              {cfg.label}
            </Text>
          </View>
          <Text style={s.dot}>·</Text>
          <Text style={s.date}>{formatDate(tx.date)}</Text>
        </View>
      </View>

      {/* Tutar */}
      <Text style={[s.amount, { color: isIncome ? colors.success : colors.error }]}>
        {formatAmount(tx.amount, currency)}
      </Text>
    </TouchableOpacity>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },

  iconBox: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },

  info:    { flex: 1, gap: 4 },
  title:   { color: colors.text1, fontSize: 14, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },

  badge:     { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600' },

  dot:    { color: colors.text3, fontSize: 11 },
  date:   { color: colors.text3, fontSize: 11 },

  amount: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
});
