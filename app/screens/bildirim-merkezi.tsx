import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Check, Trash2 } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { NOTIFICATIONS, CATEGORY_LABELS, CATEGORY_COLORS } from '../../src/data/notifications';
import type { Notification, NotifCategory } from '../../src/data/notifications';

const FILTERS: Array<{ key: NotifCategory | 'all'; label: string }> = [
  { key: 'all',      label: 'Tümü'     },
  { key: 'odeme',    label: 'Ödeme'    },
  { key: 'analiz',   label: 'Analiz'   },
  { key: 'guvenlik', label: 'Güvenlik' },
  { key: 'hedef',    label: 'Hedef'    },
  { key: 'sistem',   label: 'Sistem'   },
];

// Group by time bucket
function groupNotifications(notifs: Notification[]) {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const week: Notification[] = [];

  notifs.forEach(n => {
    if (n.time.includes('dak') || n.time.includes('saat')) today.push(n);
    else if (n.time.startsWith('Dün')) yesterday.push(n);
    else week.push(n);
  });

  const sections: { title: string; data: Notification[] }[] = [];
  if (today.length)     sections.push({ title: 'Bugün',     data: today });
  if (yesterday.length) sections.push({ title: 'Dün',       data: yesterday });
  if (week.length)      sections.push({ title: 'Bu Hafta',  data: week });
  return sections;
}

// ─── KART ─────────────────────────────────────────────────────────
function NotifCard({
  notif,
  onRead,
  onDelete,
  onAction,
}: {
  notif: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (route: string) => void;
}) {
  const catColor = CATEGORY_COLORS[notif.category];

  return (
    <View style={[s.card, !notif.read && s.cardUnread]}>
      {/* Unread dot */}
      {!notif.read && <View style={[s.unreadDot, { backgroundColor: catColor }]} />}

      <View style={s.cardRow}>
        {/* Icon */}
        <View style={[s.iconBox, { backgroundColor: catColor + '18' }]}>
          <Text style={s.iconEmoji}>{notif.icon}</Text>
        </View>

        {/* Content */}
        <View style={s.cardContent}>
          <View style={s.cardTitleRow}>
            <Text style={s.cardTitle} numberOfLines={1}>{notif.title}</Text>
            <Text style={s.cardTime}>{notif.time}</Text>
          </View>
          <Text style={s.cardBody} numberOfLines={2}>{notif.body}</Text>

          {/* Category tag + action */}
          <View style={s.cardFooter}>
            <View style={[s.catTag, { backgroundColor: catColor + '18', borderColor: catColor + '44' }]}>
              <Text style={[s.catTagText, { color: catColor }]}>
                {CATEGORY_LABELS[notif.category]}
              </Text>
            </View>
            {notif.actionLabel && notif.actionRoute && (
              <TouchableOpacity
                style={[s.actionBtn, { borderColor: catColor + '55' }]}
                onPress={() => onAction(notif.actionRoute!)}
                activeOpacity={0.7}
              >
                <Text style={[s.actionBtnText, { color: catColor }]}>{notif.actionLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={s.cardActions}>
        {!notif.read && (
          <TouchableOpacity style={s.actionIcon} onPress={() => onRead(notif.id)} activeOpacity={0.7}>
            <Check size={14} color={colors.text3} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={s.actionIcon} onPress={() => onDelete(notif.id)} activeOpacity={0.7}>
          <Trash2 size={14} color={colors.text3} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── EKRAN ────────────────────────────────────────────────────────
export default function BildirimMerkeziScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotifCategory | 'all'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function deleteNotif(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.category === filter);

  const sections = groupNotifications(filtered);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Bildirimler</Text>
          {unreadCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity style={s.markAllBtn} onPress={markAllRead} activeOpacity={0.7}>
            <Text style={s.markAllText}>Tümünü oku</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 70 }} />
        )}
      </View>

      {/* Filtreler */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
        style={s.filterScroll}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[s.filterBtn, filter === f.key && s.filterBtnActive]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.75}
          >
            <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste */}
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {sections.length === 0 ? (
          <View style={s.emptyState}>
            <Bell size={40} color={colors.text3} strokeWidth={1.2} />
            <Text style={s.emptyTitle}>Bildirim yok</Text>
            <Text style={s.emptyBody}>Bu kategoride henüz bildirim bulunmuyor.</Text>
          </View>
        ) : (
          sections.map(section => (
            <View key={section.title}>
              <Text style={s.sectionLabel}>{section.title}</Text>
              {section.data.map(notif => (
                <NotifCard
                  key={notif.id}
                  notif={notif}
                  onRead={markRead}
                  onDelete={deleteNotif}
                  onAction={(route) => router.push(route as any)}
                />
              ))}
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8 },

  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title:        { color: colors.text1, fontSize: 17, fontWeight: '700' },
  badge:        { backgroundColor: colors.purple, borderRadius: 10, minWidth: 20, paddingHorizontal: 6, paddingVertical: 2, alignItems: 'center' },
  badgeText:    { color: '#fff', fontSize: 11, fontWeight: '700' },
  markAllBtn:   { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border },
  markAllText:  { color: colors.purpleLight, fontSize: 12, fontWeight: '600' },

  filterScroll: { maxHeight: 48 },
  filterRow:    { paddingHorizontal: 16, gap: 8, paddingBottom: 8, alignItems: 'center' },
  filterBtn:    { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1 },
  filterBtnActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  filterText:   { color: colors.text2, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  sectionLabel: { color: colors.text3, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 12, paddingHorizontal: 4 },

  card:        { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 8, position: 'relative' },
  cardUnread:  { borderColor: colors.purple + '44', backgroundColor: colors.purple + '08' },
  unreadDot:   { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4 },

  cardRow:     { flexDirection: 'row', gap: 10 },
  iconBox:     { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconEmoji:   { fontSize: 18 },

  cardContent: { flex: 1 },
  cardTitleRow:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 },
  cardTitle:   { color: colors.text1, fontSize: 14, fontWeight: '700', flex: 1 },
  cardTime:    { color: colors.text3, fontSize: 11, flexShrink: 0 },
  cardBody:    { color: colors.text2, fontSize: 13, lineHeight: 18, marginBottom: 8 },

  cardFooter:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catTag:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  catTagText:  { fontSize: 11, fontWeight: '700' },
  actionBtn:   { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  actionBtnText:{ fontSize: 12, fontWeight: '600' },

  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 4, marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  actionIcon:  { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },

  emptyState:  { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle:  { color: colors.text1, fontSize: 18, fontWeight: '700' },
  emptyBody:   { color: colors.text3, fontSize: 14, textAlign: 'center' },
});
