import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import arTranslation from '../locales/ar.json'
import enTranslation from '../locales/en.json'
import frTranslation from '../locales/fr.json'

const resources = {
  ar: { translation: arTranslation },
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en', 'fr'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

// Add helper to update direction on change
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
})

// Initialize layout dir on load
const currentLanguage = i18n.language || 'ar'
document.documentElement.dir = currentLanguage.startsWith('ar') ? 'rtl' : 'ltr'
document.documentElement.lang = currentLanguage

export default i18n
