import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Pressable,
  TextInput, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors } from '../../src/theme/colors';

const PIN_LENGTH = 6;

export default function PinScreen() {
  const router = useRouter();
  const { pinMode } = useLocalSearchParams<{ pinMode?: 'create' | 'enter' }>();
  const { pin: storedPin, setPin, logout, user } = useAuthStore();

  const [step, setStep] = useState<'first' | 'confirm'>('first');
  const [pin, setLocalPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Android'de autoFocus güvenilir değil — mount'tan 300ms sonra zorla focus
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  function handleChange(text: string) {
    const clean = text.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
    setLocalPin(clean);
    setError('');
    if (clean.length === PIN_LENGTH) {
      setTimeout(() => handleContinue(clean), 150);
    }
  }

  function handleContinue(value = pin) {
    if (value.length < PIN_LENGTH) return;

    if (pinMode === 'enter') {
      if (value === storedPin) {
        router.replace('/(tabs)/home');
      } else {
        setError('Hatalı PIN. Tekrar dene.');
        setLocalPin('');
      }
      return;
    }

    // create mode
    if (step === 'first') {
      setFirstPin(value);
      setLocalPin('');
      setStep('confirm');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      if (value === firstPin) {
        setPin(value);
        router.replace('/(tabs)/home');
      } else {
        setError("PIN'ler eşleşmedi. Tekrar dene.");
        setLocalPin('');
        setStep('first');
        setFirstPin('');
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }

  // Kullanıcı değiştir — önce onay modalı göster
  function handleSwitchUser() {
    setShowSwitchModal(true);
  }

  function confirmSwitchUser() {
    setShowSwitchModal(false);
    logout();
    router.replace('/');
  }

  // Şifremi unuttum — dedicated forgot-pin ekranına yönlendir
  function handleForgotPin() {
    router.push('/(auth)/forgot-pin');
  }

  const title = pinMode === 'enter'
    ? "PIN'ini gir"
    : step === 'first' ? 'PIN Oluştur' : "PIN'ini Onayla";

  const subtitle = pinMode === 'enter'
    ? 'Hesabına erişmek için PIN gir'
    : step === 'first'
      ? 'Hesabını korumak için\n6 haneli bir PIN belirle'
      : "Aynı PIN'i tekrar gir";

  // Kullanıcı baş harfleri (avatar için)
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TextInput
          ref={inputRef}
          value={pin}
          onChangeText={handleChange}
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          style={s.hiddenInput}
          autoFocus
          secureTextEntry
        />

        {/* Tüm ekrana basınca klavye açılsın */}
        <Pressable style={s.body} onPress={() => inputRef.current?.focus()}>
          {/* Enter mode → kullanıcı avatarı; Create mode → N logosu */}
          {pinMode === 'enter' && user ? (
            <View style={s.avatarWrap}>
              <View style={s.avatar}>
                <Text style={s.avatarTxt}>{initials}</Text>
              </View>
              <Text style={s.userName}>{user.name}</Text>
            </View>
          ) : (
            <View style={s.logoWrap}>
              <Text style={s.logoTxt}>N</Text>
            </View>
          )}

          <Text style={s.title}>{title}</Text>
          <Text style={s.sub}>{subtitle}</Text>

          {/* Modern segment kutuları */}
          <View style={s.segments}>
            {Array.from({ length: PIN_LENGTH }).map((_, i) => {
              const filled = i < pin.length;
              const active = i === pin.length;
              return (
                <View
                  key={i}
                  style={[
                    s.segment,
                    filled && s.segmentFilled,
                    active && s.segmentActive,
                  ]}
                >
                  {filled && <View style={s.segmentDot} />}
                </View>
              );
            })}
          </View>

          {error ? <Text style={s.error}>{error}</Text> : null}

          {/* Create mode — geri butonu */}
          {pinMode !== 'enter' && step === 'confirm' && (
            <TouchableOpacity
              onPress={() => { setStep('first'); setLocalPin(''); setFirstPin(''); }}
            >
              <Text style={s.backLink}>← Geri</Text>
            </TouchableOpacity>
          )}

          {/* Enter mode — şifremi unuttum + kullanıcı değiştir */}
          {pinMode === 'enter' && (
            <View style={s.bottomLinks}>
              <TouchableOpacity onPress={handleForgotPin}>
                <Text style={s.linkText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
              <Text style={s.separator}>·</Text>
              <TouchableOpacity onPress={handleSwitchUser}>
                <Text style={s.linkText}>Kullanıcı Değiştir</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </KeyboardAvoidingView>

      {/* Kullanıcı Değiştir — Onay Modalı */}
      <Modal
        visible={showSwitchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSwitchModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Hesap Değiştir</Text>
            <Text style={s.modalMsg}>
              Mevcut hesaptan çıkış yapılacak.{'\n'}Tekrar giriş yapmanız gerekecek.
            </Text>
            <View style={s.modalBtns}>
              <TouchableOpacity
                style={s.modalCancel}
                onPress={() => setShowSwitchModal(false)}
              >
                <Text style={s.modalCancelTxt}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={confirmSwitchUser}>
                <Text style={s.modalConfirmTxt}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hiddenInput: { position: 'absolute', top: -200, left: 0, width: 100, height: 40, opacity: 0 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 48, alignItems: 'center' },

  // Create mode logo
  logoWrap: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.purple, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  logoTxt: { color: '#fff', fontSize: 26, fontWeight: '800' },

  // Enter mode avatar
  avatarWrap: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.purple,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
    shadowColor: colors.purple, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  avatarTxt: { color: '#fff', fontSize: 22, fontWeight: '800' },
  userName: { color: colors.text1, fontSize: 15, fontWeight: '600' },

  title:    { color: colors.text1, fontSize: 24, fontWeight: '700', marginBottom: 10, letterSpacing: -0.5 },
  sub:      { color: colors.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  // Modern segment kutuları
  segments: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  segment: {
    width: 44, height: 54, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.surface3,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center', justifyContent: 'center',
  },
  segmentFilled: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  segmentActive: {
    borderColor: colors.purpleLight,
    borderWidth: 2,
    backgroundColor: 'rgba(139,92,246,0.08)',
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 4,
  },
  segmentDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#fff',
  },
  error:      { color: colors.error, fontSize: 13, textAlign: 'center', marginTop: 16 },
  backLink:   { color: colors.text2, fontSize: 13, textAlign: 'center', marginTop: 20 },
  bottomLinks:{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 32 },
  linkText:   { color: colors.purpleLight, fontSize: 13, fontWeight: '500' },
  separator:  { color: colors.text3, fontSize: 16 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: colors.surface2,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle:      { color: colors.text1, fontSize: 17, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  modalMsg:        { color: colors.text2, fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  modalBtns:       { flexDirection: 'row', gap: 12 },
  modalCancel:     { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: colors.surface3, alignItems: 'center' },
  modalCancelTxt:  { color: colors.text2, fontSize: 14, fontWeight: '600' },
  modalConfirm:    { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: colors.error, alignItems: 'center' },
  modalConfirmTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
