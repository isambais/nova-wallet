import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Phone, Mail,Globe } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import type { Language } from '../../src/store/useSettingsStore';

type Mode = 'login' | 'register';

export default function AuthWelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('login');
  const [showLang, setShowLang] = useState(false);
const { language, setLanguage } = useSettingsStore();

  function handlePhone() {
    router.push({ pathname: '/(auth)/phone-input', params: { mode } });
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

{/* Dil ikonu */}

<View style={s.header}>
      <TouchableOpacity style={s.langBtn} onPress={() => setShowLang(true)} activeOpacity={0.7}>
        <Globe size={20} color={colors.text2} strokeWidth={1.8} />
      </TouchableOpacity>
    </View>
      {/* Logo + Brand */}
      <View style={s.top}>
        <View style={s.logoWrap}>
          <Text style={s.logoTxt}>N</Text>
        </View>
        <Text style={s.brand}>NOVA</Text>
        <Text style={s.tagline}>{t('auth.welcome.tagline')}</Text>
      </View>

      {/* Mode Toggle */}
      <View style={s.toggleWrap}>
        <View style={s.toggleRow}>
          <TouchableOpacity
            style={[s.toggleBtn, mode === 'login' && s.toggleActive]}
            onPress={() => setMode('login')}
            activeOpacity={0.8}
          >
            <Text style={[s.toggleTxt, mode === 'login' && s.toggleTxtActive]}>
              {t('auth.welcome.login')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.toggleBtn, mode === 'register' && s.toggleActive]}
            onPress={() => setMode('register')}
            activeOpacity={0.8}
          >
            <Text style={[s.toggleTxt, mode === 'register' && s.toggleTxtActive]}>
              {t('auth.welcome.register')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Auth Methods */}
      <View style={s.methods}>
        <TouchableOpacity style={s.methodBtn} onPress={handlePhone} activeOpacity={0.75}>
          <View style={s.methodIcon}>
            <Phone size={20} color={colors.purpleLight} strokeWidth={1.8} />
          </View>
          <Text style={s.methodTxt}>{t('auth.welcome.with_phone')}</Text>
          <View style={s.methodArrow}>
            <Text style={s.arrowTxt}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={s.methodBtn} activeOpacity={0.75}>
          <View style={s.methodIcon}>
            <Mail size={20} color={colors.purpleLight} strokeWidth={1.8} />
          </View>
          <Text style={s.methodTxt}>{t('auth.welcome.with_email')}</Text>
          <View style={s.methodArrow}>
            <Text style={s.arrowTxt}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerTxt}>{t('auth.welcome.or')}</Text>
          <View style={s.dividerLine} />
        </View>

        <TouchableOpacity style={[s.methodBtn, s.googleBtn]} activeOpacity={0.75}>
          <View style={s.googleCircle}>
            <Text style={s.googleLetter}>G</Text>
          </View>
          <Text style={s.methodTxt}>{t('auth.welcome.with_google')}</Text>
          <View style={s.methodArrow}>
            <Text style={s.arrowTxt}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <Text style={s.terms}>{t('auth.welcome.terms')}</Text>

      {/* Dil Seçim Modal */}
<Modal
  visible={showLang}
  transparent
  animationType="fade"
  onRequestClose={() => setShowLang(false)}
>
  <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowLang(false)}>
    <View style={s.langMenu}>
      {(['tr', 'en', 'ar'] as Language[]).map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[s.langItem, language === lang && s.langItemActive]}
          onPress={() => { setLanguage(lang); setShowLang(false); }}
          activeOpacity={0.75}
        >
          <Text style={s.langFlag}>
            {lang === 'tr' ? '🇹🇷' : lang === 'en' ? '🇬🇧' : '🇸🇦'}
          </Text>
          <Text style={[s.langTxt, language === lang && s.langTxtActive]}>
            {lang === 'tr' ? 'Türkçe' : lang === 'en' ? 'English' : 'العربية'}
          </Text>
          {language === lang && <Text style={s.langCheck}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  </TouchableOpacity>
</Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
    
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  langBtn: {
    padding: 8,
  },
overlay: {
  flex: 1,
  backgroundColor: colors.overlay,
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  paddingTop: 80,
  paddingRight: 24,
},
langMenu: {
  backgroundColor: colors.surface2,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.border,
  overflow: 'hidden',
  minWidth: 160,
},
langItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 10,
},
langItemActive: {
  backgroundColor: colors.surface3,
},
langFlag: {
  fontSize: 18,
},
langTxt: {
  flex: 1,
  color: colors.text2,
  fontSize: 14,
  fontWeight: '500',
},
langTxtActive: {
  color: colors.text1,
  fontWeight: '600',
},
langCheck: {
  color: colors.purple,
  fontSize: 14,
  fontWeight: '700',
},
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
  },

  top: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 40,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 14,
  },
  logoTxt: { color: '#fff', fontSize: 34, fontWeight: '800' },
  brand: {
    color: colors.text1,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 5,
    marginBottom: 8,
  },
  tagline: {
    color: colors.text2,
    fontSize: 13,
    letterSpacing: 0.2,
  },

  // Toggle
  toggleWrap: {
    marginBottom: 32,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.purple,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  toggleTxt: {
    color: colors.text2,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTxtActive: {
    color: '#fff',
  },

  // Methods
  methods: {
    gap: 12,
  },
  methodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  googleBtn: {
    borderColor: colors.surface3,
  },
  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
  },
  methodTxt: {
    flex: 1,
    color: colors.text1,
    fontSize: 14,
    fontWeight: '500',
  },
  methodArrow: {
    width: 24,
    alignItems: 'center',
  },
  arrowTxt: {
    color: colors.text3,
    fontSize: 22,
    lineHeight: 24,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerTxt: {
    color: colors.text3,
    fontSize: 12,
    fontWeight: '500',
  },

  // Terms
  terms: {
    color: colors.text3,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 'auto',
    paddingBottom: 8,
  },
});
