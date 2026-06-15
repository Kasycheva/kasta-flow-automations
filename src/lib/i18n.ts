import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import no from '../locales/no.json';

const savedLanguage =
  typeof window !== 'undefined' && window.location.pathname === '/no'
    ? 'no'
    : typeof window !== 'undefined' && window.location.pathname === '/en'
      ? 'en'
      : typeof window !== 'undefined' && window.localStorage.getItem('kasta-language') === 'no'
        ? 'no'
        : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    no: { translation: no },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
