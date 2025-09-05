import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslation from '@/locales/es/translation.json';
import enTranslation from '@/locales/en/translation.json';
import ptTranslation from '@/locales/pt/translation.json';

const GEO_API_URL = 'https://api.hostinger.com/geolocation';

const getLanguageByCountry = (countryCode) => {
  const spanishSpeaking = ['AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'ES', 'UY', 'VE'];
  const portugueseSpeaking = ['BR', 'PT'];

  if (spanishSpeaking.includes(countryCode)) {
    return 'es';
  }
  if (portugueseSpeaking.includes(countryCode)) {
    return 'pt';
  }
  return 'en';
};

const customDetector = {
  name: 'customGeoDetector',
  async: true,
  lookup(options) {
    return new Promise((resolve) => {
      fetch(GEO_API_URL)
        .then(response => response.json())
        .then(data => {
          const countryCode = data.country_code;
          const lang = getLanguageByCountry(countryCode);
          resolve(lang);
        })
        .catch(() => {
          resolve('en');
        });
    });
  },
  cacheUserLanguage(lng, options) {
    try {
      window.localStorage.setItem(options.lookupLocalStorage, lng);
    } catch (e) {
      console.warn('Could not cache user language.', e);
    }
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(customDetector);

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      pt: { translation: ptTranslation },
    },
    fallbackLng: 'en',
    detection: {
      order: ['customGeoDetector', 'localStorage', 'navigator', 'htmlTag', 'cookie', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;