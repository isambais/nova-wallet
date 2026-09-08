import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Cpu, Send, Zap, MessageCircle, Shield, Mic } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import {
  QUICK_PROMPTS,
  MOCK_RESPONSES,
  FALLBACK_RESPONSES,
  GREETING_MESSAGE,
  DISCLAIMER,
  type CopilotMessage,
  type QuickPrompt,
} from '../../src/data/ai-scenarios/copilot-scenarios';

// ─── Bileşen: Mesaj Balonu ────────────────────────────────────────
function MessageBubble({ msg }: { msg: CopilotMessage }) {
  const isAI = msg.role === 'assistant';
  return (
    <View style={[mb.wrapper, isAI ? mb.wrapperAI : mb.wrapperUser]}>
      {isAI && (
        <View style={mb.avatar}>
          <Cpu size={13} color={colors.purple} strokeWidth={2} />
        </View>
      )}
      <View style={[mb.bubble, isAI ? mb.bubbleAI : mb.bubbleUser]}>
        <Text style={[mb.text, isAI ? mb.textAI : mb.textUser]}>{msg.text}</Text>
      </View>
    </View>
  );
}

const mb = StyleSheet.create({
  wrapper:     { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  wrapperAI:   { justifyContent: 'flex-start' },
  wrapperUser: { justifyContent: 'flex-end' },
  avatar:      {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.purple + '20',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8, marginBottom: 2, flexShrink: 0,
  },
  bubble:     { maxWidth: '78%', borderRadius: 18, padding: 12 },
  bubbleAI:   {
    backgroundColor: colors.surface1,
    borderWidth: 1, borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: { backgroundColor: colors.purple, borderBottomRightRadius: 4 },
  text:       { fontSize: 14, lineHeight: 21 },
  textAI:     { color: colors.text1 },
  textUser:   { color: '#fff' },
});

// ─── Ana Ekran ────────────────────────────────────────────────────
export default function Copilot() {
  const router    = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [messages,   setMessages]   = useState<CopilotMessage[]>([
    { id: 'm0', role: 'assistant', text: GREETING_MESSAGE },
  ]);
  const [input,      setInput]      = useState('');
  const [thinking,   setThinking]   = useState(false);
  const [quicksDone, setQuicksDone] = useState<Set<string>>(new Set());

  const scrollToBottom = (animated = true) =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated }), 80);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || thinking) return;

    const userMsg: CopilotMessage = {
      id:   `u${Date.now()}`,
      role: 'user',
      text: text.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    scrollToBottom();

    // Mock LLM delay (1.2 – 1.8 s)
    setTimeout(() => {
      const response =
        MOCK_RESPONSES[text.trim()] ??
        FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

      const aiMsg: CopilotMessage = {
        id:   `a${Date.now()}`,
        role: 'assistant',
        text: response,
      };
      setMessages(prev => [...prev, aiMsg]);
      setThinking(false);
      scrollToBottom();
    }, 1200 + Math.random() * 600);
  }, [thinking]);

  const handleQuick = (qp: QuickPrompt) => {
    setQuicksDone(prev => new Set([...prev, qp.id]));
    sendMessage(qp.query);
  };

  const availableQuicks = QUICK_PROMPTS.filter(qp => !quicksDone.has(qp.id));
  const showQuicks      = availableQuicks.length > 0 && messages.length <= 3 && !thinking;

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

        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>AI Finans Copilot</Text>
          <View style={s.onlineDot} />
        </View>

        <TouchableOpacity
          style={s.micBtn}
          onPress={() => router.push('/screens/sesli-asistan' as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Mic size={18} color={colors.purple} strokeWidth={2} />
        </TouchableOpacity>
        <View style={s.aiBadge}>
          <Cpu size={11} color={colors.purple} strokeWidth={2} />
          <Text style={s.aiBadgeText}>AI</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* CHAT ALANI */}
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={s.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Yazma Göstergesi */}
          {thinking && (
            <View style={[mb.wrapper, mb.wrapperAI]}>
              <View style={mb.avatar}>
                <Cpu size={13} color={colors.purple} strokeWidth={2} />
              </View>
              <View style={[mb.bubble, mb.bubbleAI, s.typingBubble]}>
                <ActivityIndicator size="small" color={colors.purple} />
                <Text style={s.typingText}>AI düşünüyor...</Text>
              </View>
            </View>
          )}

          {/* Disclaimer + Sesli kısayol */}
          {messages.length === 1 && (
            <>
              <TouchableOpacity
                style={s.voiceShortcut}
                onPress={() => router.push('/screens/sesli-asistan' as any)}
                activeOpacity={0.8}
              >
                <View style={s.voiceShortcutIcon}>
                  <Mic size={14} color={colors.purple} strokeWidth={2} />
                </View>
                <Text style={s.voiceShortcutText}>Sesli sormak ister misin?</Text>
                <Text style={s.voiceShortcutArrow}>→</Text>
              </TouchableOpacity>
              <View style={s.disclaimer}>
                <Shield size={11} color={colors.text3} strokeWidth={2} />
                <Text style={s.disclaimerText}>{DISCLAIMER}</Text>
              </View>
            </>
          )}
        </ScrollView>

        {/* HIZLI SORULAR */}
        {showQuicks && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.quickScroll}
            contentContainerStyle={s.quickContent}
          >
            {availableQuicks.map(qp => (
              <TouchableOpacity
                key={qp.id}
                style={s.quickChip}
                onPress={() => handleQuick(qp)}
                activeOpacity={0.8}
              >
                <Zap size={11} color={colors.purple} strokeWidth={2} />
                <Text style={s.quickChipText}>{qp.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* INPUT ALANI */}
        <View style={s.inputRow}>
          <View style={s.inputWrap}>
            <MessageCircle size={16} color={colors.text3} strokeWidth={2} style={s.inputIcon} />
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder="Finansal bir soru sorun..."
              placeholderTextColor={colors.text3}
              multiline
              maxLength={500}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={() => sendMessage(input)}
            />
          </View>
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || thinking) && s.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
            activeOpacity={0.8}
          >
            <Send size={17} color="#fff" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn:      { padding: 4 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle:  { fontSize: 17, fontWeight: '700', color: colors.text1 },
  onlineDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  micBtn:       { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.purple + '18', alignItems: 'center', justifyContent: 'center' },
  aiBadge:      { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.purple + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiBadgeText:  { color: colors.purple, fontSize: 11, fontWeight: '700' },

  // Chat
  scroll:      { flex: 1 },
  chatContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },

  // Voice shortcut
  voiceShortcut:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.purple + '30', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 8 },
  voiceShortcutIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.purple + '18', alignItems: 'center', justifyContent: 'center' },
  voiceShortcutText: { flex: 1, color: colors.purpleLight, fontSize: 13, fontWeight: '500' },
  voiceShortcutArrow:{ color: colors.purple, fontSize: 15, fontWeight: '700' },

  // Typing
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText:   { color: colors.text3, fontSize: 13 },

  // Disclaimer
  disclaimer:     { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 4, marginTop: 4 },
  disclaimerText: { color: colors.text3, fontSize: 11, flex: 1, lineHeight: 16 },

  // Quick prompts
  quickScroll:   { maxHeight: 52, flexShrink: 0 },
  quickContent:  { paddingHorizontal: 16, gap: 8, paddingVertical: 8, alignItems: 'center' },
  quickChip:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.purple + '40', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  quickChipText: { color: colors.purpleLight, fontSize: 13, fontWeight: '500' },

  // Input
  inputRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  inputIcon: { marginBottom: 1 },
  input:     { flex: 1, color: colors.text1, fontSize: 14, maxHeight: 100, paddingTop: 0, paddingBottom: 0 },
  sendBtn:   { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.surface2 },
});
