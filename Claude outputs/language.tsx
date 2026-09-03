import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useSettingsStore, Language } from '../../src/store/useSettingsStore';
import { Button } from '../../src/components/ui/Button';

const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: 'tr', label: 'Türkçe', native: 'Turkish', flag: '🇹🇷' },
  { code: 'en', label: 'English', native: 'İngilizce', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', native: 'Arabic', flag: '🇸🇦' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { language, setLanguage, markLanguageSelected } = useSettingsStore();
  const [selected, setSelected] = useState<Language>(language);
  const [loading, setLoading] = useState(false);

  function handleSelect(code: Language) {
    setSelected(code);
  }

  async function handleContinue() {
    setLoading(true);

    const wasRTL = I18nManager.isRTL;
    const willBeRTL = selected === 'ar';

    setLanguage(selected);
    markLanguageSelected();

    if (wasRTL !== willBeRTL) {
      // RTL changed — let user know app needs a restart
      Alert.alert(
        selected === 'ar' ? 'إعادة التشغيل مطلوبة' : 'Restart Required',
        selected === 'ar'
          ? 'لتفعيل تخطيط اليمين إلى اليسار، يرجى إعادة تشغيل التطبيق.'
          : 'To apply the new layout direction, please restart the app.',
        [
          {
            text: selected === 'ar' ? 'حسناً' : 'OK',
            onPress: () => router.replace('/(auth)/phone'),
          },
        ],
      );
    } else {
      router.replace('/(auth)/phone');
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.body}>
        {/* Logo */}
        <View style={s.topSection}>
          <View style={s.logoWrap}>
            <Text style={s.logoTxt}>N</Text>
          </View>
          <Text style={s.brand}>NOVA</Text>
        </View>

        {/* Heading */}
        <View style={s.headingSection}>
          <Text style={s.title}>Dil Seçin</Text>
          <Text style={s.subtitle}>
            Choose your language · اختر لغتك
          </Text>
        </View>

        {/* Language options */}
        <View style={s.optionsList}>
          {LANGUAGES.map((lang) => {
            const isActive = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[s.option, isActive && s.optionActive]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.7}
              >
                {/* Flag */}
                <Text style={s.flag}>{lang.flag}</Text>

                {/* Labels */}
                <View style={s.optionLabels}>
                  <Text style={[s.optionName, isActive && s.optionNameActive]}>
                    {lang.label}
                  </Text>
                  <Text style={s.optionNative}>{lang.native}</Text>
                </View>

                {/* Check indicator */}
                <View style={[s.check, isActive && s.checkActive]}>
                  {isActive && (
                    <Check size={14} color={colors.bg} strokeWidth={2.5} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue button */}
        <View style={s.footer}>
          <Button
            label="Devam Et / Continue / متابعة"
            onPress={handleContinue}
            loading={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
  },

  topSection: {
    paddingTop: 32,
    marginBottom: 48,
  },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  logoTxt: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  brand: {
    color: colors.text1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 5,
  },

  headingSection: {
    marginBottom: 40,
  },
  title: {
    color: colors.text1,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text3,
    fontSize: 14,
    lineHeight: 20,
  },

  optionsList: {
    gap: 12,
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.surface1,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionActive: {
    borderColor: colors.purple,
    backgroundColor: colors.purpleDark,
  },
  flag: {
    fontSize: 28,
  },
  optionLabels: {
    flex: 1,
    gap: 2,
  },
  optionName: {
    color: colors.text2,
    fontSize: 17,
    fontWeight: '600',
  },
  optionNameActive: {
    color: colors.text1,
  },
  optionNative: {
    color: colors.text3,
    fontSize: 12,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  footer: {
    paddingBottom: 16,
    paddingTop: 24,
  },
});
