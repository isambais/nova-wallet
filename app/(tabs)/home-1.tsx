import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Send, Download, Plus, QrCode } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { colors } from '../../src/theme/colors';
import { mockTransactions, formatAmount, Transaction } from '../../src/data/mockTransactions';

/* ── Quick action button ───────────────────────────────── */
function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={qa.wrap} onPress={onPress} activeOpacity={0.75}>
      <View style={qa.circle}>{icon}</View>
      <Text style={qa.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const qa = StyleSheet.create({
  wrap:   { alignItems: 'center', gap: 8 },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: colors.text2, fontSize: 11, fontWeight: '500' },
});

/* ── Transaction row ──────────────────────────────────── */
function TxRow({ tx }: { tx: Transaction }) {
  const isIncome = tx.amount > 0;
  return (
    <View style={tx_.row}>
      <View style={tx_.iconWrap}>
        <Text style={tx_.icon}>{tx.icon}</Text>
      </View>
      <View style={tx_.mid}>
        <Text style={tx_.title}>{tx.title}</Text>
        <Text style={tx_.sub}>{tx.subtitle} · {tx.date}</Text>
      </View>
      <Text style={[tx_.amount, isIncome && tx_.income]}>
        {formatAmount(tx.amount)}
      </Text>
    </View>
  );
}

const tx_ = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon:   { fontSize: 20 },
  mid:    { flex: 1, gap: 3 },
  title:  { color: colors.text1, fontSize: 14, fontWeight: '600' },
  sub:    { color: colors.text2, fontSize: 12 },
  amount: { color: colors.error, fontSize: 14, fontWeight: '700' },
  income: { color: colors.success },
});

/* ── Home screen ─────────────────────────────────────── */
export default function HomeScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = useSettingsStore((s) => s.currency);
  const firstName = user?.name?.split(' ')[0] ?? 'Kullanıcı';
  const balance = user?.balance ?? 0;

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greetingKey = hour < 12
    ? 'home.greeting_morning'
    : hour < 18
      ? 'home.greeting_afternoon'
      : 'home.greeting_evening';

  const displayBalance = balance > 0
    ? balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
    : '14.413,51';   // mock balance

  const currencySymbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{t(greetingKey)}, {firstName} 👋</Text>
            <Text style={s.greetingSub}>{t('home.total_balance')}</Text>
          </View>
          <TouchableOpacity style={s.bellWrap} activeOpacity={0.75}>
            <Bell size={20} color={colors.text2} strokeWidth={2} />
            <View style={s.badge} />
          </TouchableOpacity>
        </View>

        {/* ── Balance Card ── */}
        <View style={s.card}>
          {/* Decorative circles */}
          <View style={s.cardCircle1} />
          <View style={s.cardCircle2} />

          <View style={s.cardTop}>
            <View>
              <Text style={s.cardLabel}>{t('home.total_balance')}</Text>
              <Text style={s.cardBalance}>{currencySymbol}{displayBalance}</Text>
            </View>
            <View style={s.novaTag}>
              <Text style={s.novaTagTxt}>NOVA</Text>
            </View>
          </View>

          <View style={s.cardBottom}>
            <View>
              <Text style={s.cardMasked}>•••• •••• •••• 4291</Text>
              <Text style={s.cardExpiry}>08 / 27</Text>
            </View>
            <Text style={s.visaLogo}>VISA</Text>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View style={s.actions}>
          <QuickAction
            icon={<Send size={22} color={colors.text1} strokeWidth={2} />}
            label={t('home.send')}
          />
          <QuickAction
            icon={<Download size={22} color={colors.text1} strokeWidth={2} />}
            label={t('home.receive')}
          />
          <QuickAction
            icon={<Plus size={22} color={colors.text1} strokeWidth={2} />}
            label={t('home.topup')}
          />
          <QuickAction
            icon={<QrCode size={22} color={colors.text1} strokeWidth={2} />}
            label={t('home.qr_pay')}
          />
        </View>

        {/* ── Recent Transactions ── */}
        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>{t('home.recent_transactions')}</Text>
            <TouchableOpacity activeOpacity={0.75}>
              <Text style={s.seeAll}>{t('home.see_all')}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.txList}>
            {mockTransactions.map((tx, i) => (
              <View key={tx.id}>
                <TxRow tx={tx} />
                {i < mockTransactions.length - 1 && <View style={s.divider} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32 },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting:    { color: colors.text1, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  greetingSub: { color: colors.text2, fontSize: 13, marginTop: 2 },
  bellWrap: {
    width: 40, height: 40,
    borderRadius: 13,
    backgroundColor: colors.surface2,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: 8, right: 8,
    width: 7, height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.error,
    borderWidth: 1.5, borderColor: colors.surface2,
  },

  /* Card */
  card: {
    borderRadius: 24,
    backgroundColor: colors.purpleDark,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  cardCircle1: {
    position: 'absolute',
    width: 180, height: 180,
    borderRadius: 90,
    backgroundColor: colors.purple,
    opacity: 0.35,
    top: -60, right: -40,
  },
  cardCircle2: {
    position: 'absolute',
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: colors.purpleLight,
    opacity: 0.12,
    bottom: -30, left: 20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  cardLabel:   { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginBottom: 4 },
  cardBalance: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  novaTag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  novaTagTxt: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardMasked: { color: 'rgba(255,255,255,0.75)', fontSize: 14, letterSpacing: 2, marginBottom: 4 },
  cardExpiry: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
  visaLogo:   { color: '#fff', fontSize: 22, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 },

  /* Quick actions */
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 4,
  },

  /* Recent transactions */
  section: {
    backgroundColor: colors.surface1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: { color: colors.text1, fontSize: 15, fontWeight: '700' },
  seeAll:       { color: colors.purpleLight, fontSize: 13, fontWeight: '600' },
  txList:       {},
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
});
