import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { I18nManager } from 'react-native';
import i18n from '../i18n';

export type Language = 'tr' | 'en' | 'ar';
export type Currency = 'TRY' | 'USD' | 'EUR';

const LANG_KEY = 'nova_language';
const CURR_KEY = 'nova_currency';
const FIRST_LAUNCH_KEY = 'nova_has_selected_language';

type SettingsState = {
  language: Language;
  currency: Currency;
  isLoaded: boolean;
  hasSelectedLanguage: boolean;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  markLanguageSelected: () => void;
  loadSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'tr',
  currency: 'TRY',
  isLoaded: false,
  hasSelectedLanguage: false,

  setLanguage: (language) => {
    // Apply to i18n immediately
    i18n.changeLanguage(language);

    // Apply RTL for Arabic
    const isArabic = language === 'ar';
    const currentlyRTL = I18nManager.isRTL;
    if (isArabic !== currentlyRTL) {
      I18nManager.forceRTL(isArabic);
      // RTL change requires app restart — handled by the UI
    }

    set({ language });
    SecureStore.setItemAsync(LANG_KEY, language).catch(console.error);
  },

  setCurrency: (currency) => {
    set({ currency });
    SecureStore.setItemAsync(CURR_KEY, currency).catch(console.error);
  },

  markLanguageSelected: () => {
    set({ hasSelectedLanguage: true });
    SecureStore.setItemAsync(FIRST_LAUNCH_KEY, 'true').catch(console.error);
  },

  loadSettings: async () => {
    try {
      const [lang, curr, firstLaunch] = await Promise.all([
        SecureStore.getItemAsync(LANG_KEY),
        SecureStore.getItemAsync(CURR_KEY),
        SecureStore.getItemAsync(FIRST_LAUNCH_KEY),
      ]);

      const language = (lang as Language) || 'tr';
      const currency = (curr as Currency) || 'TRY';
      const hasSelectedLanguage = firstLaunch === 'true';

      // Apply saved language to i18n
      i18n.changeLanguage(language);

      // Apply RTL if Arabic
      if (language === 'ar') {
        I18nManager.forceRTL(true);
      }

      set({ language, currency, hasSelectedLanguage, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },
}));
