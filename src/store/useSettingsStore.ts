import { create } from 'zustand';
import { I18nManager } from 'react-native';
import i18n from '../i18n';

export type Language = 'tr' | 'en' | 'ar';
export type Currency = 'TRY' | 'USD' | 'EUR';

type SettingsState = {
  language: Language;
  currency: Currency;
  hasSelectedLanguage: boolean;
  isLoaded: boolean;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  markLanguageSelected: () => void;
  loadSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'tr',
  currency: 'TRY',
  hasSelectedLanguage: false,
  isLoaded: false,

  setLanguage: (language) => {
    i18n.changeLanguage(language);

    const isArabic = language === 'ar';
    if (isArabic !== I18nManager.isRTL) {
      I18nManager.forceRTL(isArabic);
    }

    set({ language });
  },

  setCurrency: (currency) => {
    set({ currency });
  },

  markLanguageSelected: () => {
    set({ hasSelectedLanguage: true });
  },

  // Şimdilik storage yok — Day 8'de AsyncStorage eklenecek
  loadSettings: async () => {
    set({ isLoaded: true });
  },
}));
