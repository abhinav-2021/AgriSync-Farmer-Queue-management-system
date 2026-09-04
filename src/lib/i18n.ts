import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources, SUPPORTED_LANGUAGES } from '../locales';
import type { Language } from '../types';

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'nav', 'farmer', 'admin', 'landing'],
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'agrisync_language',
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export { i18n, SUPPORTED_LANGUAGES };

// Helper to programmatically change language across the app
export const changeLanguage = (lng: Language) => {
  return i18n.changeLanguage(lng);
};

// Legacy backward-compatibility shim for components still accessing `translations[language]`
export const translations = {
  en: {
    ...resources.en.common,
    ...resources.en.nav,
    ...resources.en.farmer,
    ...resources.en.admin,
    ...resources.en.landing
  },
  hi: {
    ...resources.hi.common,
    ...resources.hi.nav,
    ...resources.hi.farmer,
    ...resources.hi.admin,
    ...resources.hi.landing
  },
  pa: {
    ...resources.pa.common,
    ...resources.pa.nav,
    ...resources.pa.farmer,
    ...resources.pa.admin,
    ...resources.pa.landing
  },
  ta: {
    ...resources.ta.common,
    ...resources.ta.nav,
    ...resources.ta.farmer,
    ...resources.ta.admin,
    ...resources.ta.landing
  }
};

export default i18n;
