import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const localeContext = require.context('../locales', false, /\.json$/)

const resources = {}
localeContext.keys().forEach((key) => {
  const code = key.replace('./', '').replace('.json', '')
  resources[code] = { translation: localeContext(key) }
})

export const AVAILABLE_LOCALE_CODES = Object.keys(resources).sort()

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: [...Object.keys(resources), 'cimode'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    returnEmptyString: false,
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
