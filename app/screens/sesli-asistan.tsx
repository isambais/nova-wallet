import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Cpu, Mic, Volume2, RotateCcw, ChevronRight } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

// ─── Demo Komutlar ────────────────────────────────────────────────
type DemoCommand = {
  id: string;
  label: string;
  transcript: string;
  response: string;
};

const DEMO_COMMANDS: DemoCommand[] = [
  {
    id: 'c1',
    label: 'Bu ay ne kadar harcadım?',
    transcript: 'Bu ay ne kadar harcadım?',
    response: 'Bu ay toplam ₺8.240 harcadınız. Geçen aya göre %12 artış var. En büyük kategoriniz Yemek & İçecek ile ₺2.100.',
  },
  {
    id: 'c2',
    label: 'Tatil hedefim ne zaman dolacak?',
    transcript: 'Tatil hedefim ne zaman dolacak?',
    response: 'Tatil Fonunuzda ₺2.400 biriktirdiniz. ₺5.000 hedefinize mevcut hızla 2 ay 18 günde ulaşırsınız.',
  },
  {
    id: 'c3',
    label: 'En çok nereye harcıyorum?',
    transcript: 'En çok nereye para harcıyorum?',
    response: 'Bu ay en fazla Yemek & İçecek: ₺2.100. Onu Ulaşım: ₺1.400 ve Eğlence: ₺980 takip ediyor.',
  },
  {
    id: 'c4',
    label: 'Finansal skor kaç?',
    transcript: 'Finansal skor kaç?',
    response: 'Finansal Sağlık Skorunuz 72 / 100 — İyi seviye. Tasarruf oranınızı %5 artırarak Mükemmel bandına geçebilirsiniz.',
  },
];

// ─── Bileşen: Ses Dalgası ─────────────────────────────────────────
const BAR_COUNT = 7;
const BAR_DELAYS = [0, 80, 160, 40, 200, 120, 60];

function Waveform({ active }: { active: boolean }) {
  const bars = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.25))
  ).current;

  useEffect(() => {
    if (!active) {
      bars.forEach(bar =>
        Animated.timing(bar, { toValue: 0.25, duration: 250, useNativeDriver: false }).start()
      );
      return;
    }

    const HEIGHTS = [0.85, 0.55, 0.95, 0.40, 0.75, 0.60, 0.88];
    const LOWS    = [0.20, 0.30, 0.15, 0.35, 0.25, 0.28, 0.18];

    const anims = bars.map((bar, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(BAR_DELAYS[i]),
          Animated.timing(bar, {
            toValue: HEIGHTS[i],
            duration: 280 + i * 30,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: LOWS[i],
            duration: 220 + i * 25,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
      loop.start();
      return loop;
    });

    return () => anims.forEach(a => a.stop());
  }, [active]);

  return (
    <View style={wf.container}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            wf.bar,
            {
              height: bar.interpolate({ inputRange: [0, 1], outputRange: [6, 44] }),
              backgroundColor: active ? colors.purple : colors.surface2,
              opacity: active ? bar.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) : 0.35,
            },
          ]}
        />
      ))}
    </View>
  );
}

const wf = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 44 },
  bar:       { width: 5, borderRadius: 3 },
});

// ─── Ekran Durumları ──────────────────────────────────────────────
type ScreenState = 'idle' | 'listening' | 'processing' | 'response';

// ─── Ana Ekran ────────────────────────────────────────────────────
export default function SesliAsistan() {
  const router = useRouter();

  const [state,       setState]      = useState<ScreenState>('idle');
  const [transcript,  setTranscript] = useState('');
  const [response,    setResponse]   = useState('');
  const [activeCmd,   setActiveCmd]  = useState<DemoCommand | null>(null);

  // Mic pulse animation
  const pulse  = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (state === 'listening') {
      pulseAnim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.18, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1.00, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
      pulseAnim.current.start();
    } else {
      pulseAnim.current?.stop();
      Animated.timing(pulse, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [state]);

  // Typing transcript simulation
  const typeText = useCallback((text: string, onDone: () => void) => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTranscript(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const runCommand = useCallback((cmd: DemoCommand) => {
    if (state !== 'idle') return;
    setActiveCmd(cmd);
    setTranscript('');
    setResponse('');
    setState('listening');

    // 1.5s listening → type transcript → processing → response
    setTimeout(() => {
      typeText(cmd.transcript, () => {
        setState('processing');
        setTimeout(() => {
          setResponse(cmd.response);
          setState('response');
        }, 1400);
      });
    }, 1200);
  }, [state, typeText]);

  const reset = () => {
    setState('idle');
    setTranscript('');
    setResponse('');
    setActiveCmd(null);
  };

  const isListening  = state === 'listening';
  const isProcessing = state === 'processing';
  const isResponse   = state === 'response';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Sesli Finans Asistanı</Text>
        <View style={s.aiBadge}>
          <Cpu size={11} color={colors.purple} strokeWidth={2} />
          <Text style={s.aiBadgeText}>AI</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* MİKROFON ALANI */}
        <View style={s.micSection}>

          {/* Durum Metni */}
          <Text style={s.stateLabel}>
            {state === 'idle'       && 'Konuşmak için bir komut seç'}
            {state === 'listening'  && 'Dinliyorum...'}
            {state === 'processing' && 'AI düşünüyor...'}
            {state === 'response'   && 'Nova yanıtladı'}
          </Text>

          {/* Pulse + Mic */}
          <View style={s.micWrapper}>
            {(isListening || isProcessing) && (
              <Animated.View
                style={[
                  s.micPulse,
                  { transform: [{ scale: pulse }] },
                  isProcessing && { backgroundColor: colors.purple + '08' },
                ]}
              />
            )}
            <View style={[
              s.micBtn,
              isListening  && s.micBtnActive,
              isProcessing && s.micBtnProcessing,
              isResponse   && s.micBtnDone,
            ]}>
              {isResponse
                ? <Volume2 size={32} color={colors.success} strokeWidth={1.8} />
                : <Mic size={32} color={isListening ? '#fff' : isProcessing ? colors.warning : colors.purple} strokeWidth={1.8} />
              }
            </View>
          </View>

          {/* Ses Dalgası */}
          <Waveform active={isListening} />

          {/* Transkript */}
          {transcript.length > 0 && (
            <View style={s.transcriptBox}>
              <Text style={s.transcriptText}>"{transcript}"</Text>
            </View>
          )}
        </View>

        {/* YANIT */}
        {isResponse && response.length > 0 && (
          <View style={s.responseCard}>
            <View style={s.responseHeader}>
              <Volume2 size={14} color={colors.success} strokeWidth={2} />
              <Text style={s.responseTitle}>Nova Yanıtı</Text>
            </View>
            <Text style={s.responseText}>{response}</Text>
            <TouchableOpacity style={s.resetRow} onPress={reset} activeOpacity={0.8}>
              <RotateCcw size={13} color={colors.purple} strokeWidth={2} />
              <Text style={s.resetText}>Yeni Komut</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* DEMO KOMUTLAR */}
        {state === 'idle' && (
          <>
            <Text style={s.sectionTitle}>Demo Komutlar</Text>
            <Text style={s.sectionSub}>Bir komuta dokunarak demo sesli sorgu başlat</Text>
            {DEMO_COMMANDS.map(cmd => (
              <TouchableOpacity
                key={cmd.id}
                style={s.cmdCard}
                onPress={() => runCommand(cmd)}
                activeOpacity={0.8}
              >
                <View style={s.cmdMic}>
                  <Mic size={15} color={colors.purple} strokeWidth={2} />
                </View>
                <Text style={s.cmdLabel}>{cmd.label}</Text>
                <ChevronRight size={15} color={colors.text3} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* İşlem sırasında komut listesini gizle — reset butonu göster */}
        {(isListening || isProcessing) && (
          <View style={s.cancelRow}>
            <TouchableOpacity style={s.cancelBtn} onPress={reset} activeOpacity={0.7}>
              <Text style={s.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20 },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text1 },
  aiBadge:      { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.purple + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiBadgeText:  { color: colors.purple, fontSize: 11, fontWeight: '700' },

  // Mic section
  micSection:   { alignItems: 'center', paddingVertical: 36, gap: 20 },
  stateLabel:   { color: colors.text2, fontSize: 15, fontWeight: '600', textAlign: 'center' },

  micWrapper:   { alignItems: 'center', justifyContent: 'center', width: 120, height: 120 },
  micPulse:     {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: colors.purple + '15',
    borderWidth: 1.5,
    borderColor: colors.purple + '30',
  },
  micBtn:       {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.surface1,
    borderWidth: 2, borderColor: colors.purple + '50',
    alignItems: 'center', justifyContent: 'center',
  },
  micBtnActive:     { backgroundColor: colors.purple,           borderColor: colors.purple },
  micBtnProcessing: { backgroundColor: colors.warning + '18',   borderColor: colors.warning + '50' },
  micBtnDone:       { backgroundColor: colors.success + '15',   borderColor: colors.success + '50' },

  transcriptBox:  { backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 10, maxWidth: '90%' },
  transcriptText: { color: colors.text1, fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 20 },

  // Response
  responseCard:   { backgroundColor: colors.success + '10', borderWidth: 1, borderColor: colors.success + '30', borderRadius: 16, padding: 16, marginBottom: 24 },
  responseHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  responseTitle:  { color: colors.success, fontSize: 13, fontWeight: '700' },
  responseText:   { color: colors.text1, fontSize: 14, lineHeight: 22, marginBottom: 14 },
  resetRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resetText:      { color: colors.purple, fontSize: 13, fontWeight: '600' },

  // Demo commands
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text1, marginBottom: 4 },
  sectionSub:   { fontSize: 12, color: colors.text3, marginBottom: 12 },
  cmdCard:      { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 8 },
  cmdMic:       { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.purple + '18', alignItems: 'center', justifyContent: 'center' },
  cmdLabel:     { flex: 1, color: colors.text1, fontSize: 14, fontWeight: '500' },

  // Cancel
  cancelRow:  { alignItems: 'center', marginTop: 8 },
  cancelBtn:  { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  cancelText: { color: colors.text3, fontSize: 14, fontWeight: '500' },
});
