import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import no from '../locales/no.json';

export type SupportedLanguage = 'en' | 'no';

export function getLanguageFromPathname(pathname: string): SupportedLanguage | null {
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/';

  if (normalizedPathname === '/no') return 'no';
  if (normalizedPathname === '/' || normalizedPathname === '/en') return 'en';

  return null;
}

export function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';

  const routeLanguage = getLanguageFromPathname(window.location.pathname);
  if (routeLanguage) return routeLanguage;

  return window.localStorage.getItem('kasta-language') === 'no' ? 'no' : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    no: { translation: no },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
