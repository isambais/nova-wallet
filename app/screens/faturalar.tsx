import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Zap, Flame, Droplets, Wifi, CheckCircle, Clock } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

type Bill = {
  id: string; name: string; Icon: any; color: string;
  amountTRY: number; due: string; paid: boolean;
};

const BILLS: Bill[] = [
  { id: 'elek', name: 'Elektrik', Icon: Zap,      color: '#F59E0B', amountTRY: 320, due: '5 Eyl',  paid: false },
  { id: 'gaz',  name: 'Doğalgaz', Icon: Flame,    color: '#EF4444', amountTRY: 180, due: '8 Eyl',  paid: false },
  { id: 'su',   name: 'Su',       Icon: Droplets, color: '#3B82F6', amountTRY: 85,  due: '12 Eyl', paid: true  },
  { id: 'net',  name: 'İnternet', Icon: Wifi,     color: '#8B5CF6', amountTRY: 299, due: '15 Eyl', paid: true  },
];

function fmt(v: number) {
  return `₺ ${v.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function FaturalarScreen() {
  const router = useRouter();
  const [paidBills, setPaidBills] = useState<string[]>(
    BILLS.filter(b => b.paid).map(b => b.id)
  );
  const [payModal, setPayModal] = useState<Bill | null>(null);
  const checkAnim = useRef(new Animated.Value(0)).current;

  const allBills = BILLS.map(b => ({ ...b, paid: paidBills.includes(b.id) }));
  const unpaid = allBills.filter(b => !b.paid);
  const totalDue = unpaid.reduce((t, b) => t + b.amountTRY, 0);

  function confirmPay() {
    if (!payModal) return;
    Animated.timing(checkAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        setPaidBills(prev => [...prev, payModal.id]);
        setPayModal(null);
        checkAnim.setValue(0);
      }, 900);
    });
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Faturalar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Özet */}
        <View style={s.summaryCard}>
          <View>
            <Text style={s.summaryLabel}>Ödenmemiş Toplam</Text>
            <Text style={s.summaryAmount}>{fmt(totalDue)}</Text>
            <Text style={s.summarySub}>{unpaid.length} bekleyen fatura</Text>
          </View>
          {unpaid.length > 0 && (
            <View style={s.warnBadge}>
              <Clock size={14} color='#F59E0B' strokeWidth={2} />
              <Text style={s.warnText}>{unpaid.length} bekliyor</Text>
            </View>
          )}
        </View>

        {/* Liste */}
        <View style={s.card}>
          {allBills.map((bill, i) => {
            const { Icon } = bill;
            const isPaid = bill.paid;
            return (
              <View key={bill.id}>
                {i > 0 && <View style={s.divider} />}
                <TouchableOpacity
                  style={s.billRow}
                  activeOpacity={isPaid ? 1 : 0.7}
                  onPress={() => !isPaid && setPayModal(bill)}
                >
                  <View style={[s.billIcon, { backgroundColor: bill.color + '18' }]}>
                    <Icon size={22} color={isPaid ? colors.text3 : bill.color} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.billName, isPaid && s.paidText]}>{bill.name}</Text>
                    <Text style={s.billDue}>Son ödeme: {bill.due}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Text style={[s.billAmount, isPaid && s.paidText]}>{fmt(bill.amountTRY)}</Text>
                    {isPaid ? (
                      <View style={s.paidBadge}>
                        <CheckCircle size={11} color='#10B981' strokeWidth={2.5} />
                        <Text style={s.paidBadgeText}>Ödendi</Text>
                      </View>
                    ) : (
                      <View style={s.dueBadge}>
                        <Text style={s.dueBadgeText}>Öde</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={!!payModal} transparent animationType="slide" onRequestClose={() => setPayModal(null)}>
        <Pressable style={s.overlay} onPress={() => setPayModal(null)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          {payModal && (
            <>
              <Text style={s.sheetTitle}>Fatura Öde</Text>
              <View style={[s.sheetIconBox, { backgroundColor: payModal.color + '18' }]}>
                <payModal.Icon size={34} color={payModal.color} strokeWidth={1.8} />
              </View>
              <Text style={s.sheetName}>{payModal.name}</Text>
              <Text style={s.sheetSub}>Son ödeme: {payModal.due}</Text>
              <Text style={s.sheetAmount}>{fmt(payModal.amountTRY)}</Text>
              <Animated.View style={[s.successRow, { opacity: checkAnim, transform: [{ scale: checkAnim }] }]}>
                <CheckCircle size={28} color='#10B981' strokeWidth={2} />
                <Text style={s.successText}>Ödendi!</Text>
              </Animated.View>
              <TouchableOpacity style={[s.confirmBtn, { backgroundColor: payModal.color }]} onPress={confirmPay} activeOpacity={0.8}>
                <Text style={s.confirmBtnText}>Öde</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setPayModal(null)} activeOpacity={0.7}>
                <Text style={s.cancelBtnText}>Vazgeç</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
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

  summaryCard:  { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.text3, fontSize: 12, fontWeight: '600' },
  summaryAmount:{ color: colors.text1, fontSize: 26, fontWeight: '800', marginVertical: 2 },
  summarySub:   { color: colors.text3, fontSize: 12 },
  warnBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F59E0B15', borderRadius: 10, borderWidth: 1, borderColor: '#F59E0B33', paddingHorizontal: 10, paddingVertical: 6 },
  warnText:     { color: '#F59E0B', fontSize: 12, fontWeight: '700' },

  card:      { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  divider:   { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  billRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  billIcon:  { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  billName:  { color: colors.text1, fontSize: 14, fontWeight: '700' },
  billDue:   { color: colors.text3, fontSize: 12, marginTop: 2 },
  billAmount:{ color: colors.text1, fontSize: 15, fontWeight: '800' },
  paidText:  { color: colors.text3 },
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#10B98118', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3 },
  paidBadgeText: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  dueBadge:  { backgroundColor: '#F59E0B18', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 },
  dueBadgeText: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },

  overlay:      { flex: 1, backgroundColor: '#00000066' },
  sheet:        { backgroundColor: colors.surface1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 12, alignItems: 'center' },
  sheetHandle:  { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 4 },
  sheetTitle:   { color: colors.text1, fontSize: 18, fontWeight: '800' },
  sheetIconBox: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  sheetName:    { color: colors.text1, fontSize: 17, fontWeight: '800' },
  sheetSub:     { color: colors.text3, fontSize: 13 },
  sheetAmount:  { color: colors.text1, fontSize: 28, fontWeight: '900' },
  successRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, position: 'absolute', bottom: 120 },
  successText:  { color: '#10B981', fontSize: 18, fontWeight: '800' },
  confirmBtn:   { width: '100%', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  confirmBtnText:{ color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn:    { width: '100%', borderRadius: 16, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  cancelBtnText:{ color: colors.text2, fontSize: 15, fontWeight: '600' },
});
