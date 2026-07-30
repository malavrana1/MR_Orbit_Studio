import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../locales/en.json'

const localeModules = import.meta.glob(['../locales/*.json', '!../locales/en.json'])

export const AVAILABLE_LOCALE_CODES = [
  'en',
  ...Object.keys(localeModules)
    .map((path) => path.match(/\/([^/]+)\.json$/)?.[1])
    .filter(Boolean),
].sort()

async function loadLocale(lng) {
  const code = (lng || 'en').split('-')[0]
  if (!code || i18n.hasResourceBundle(code, 'translation')) {
    return code
  }
  const path = `../locales/${code}.json`
  const loader = localeModules[path]
  if (!loader) {
    return 'en'
  }
  const mod = await loader()
  i18n.addResourceBundle(code, 'translation', mod.default ?? mod, true, true)
  return code
}

const changeLanguage = i18n.changeLanguage.bind(i18n)
i18n.changeLanguage = async (lng, ...rest) => {
  const code = await loadLocale(lng)
  return changeLanguage(code, ...rest)
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    partialBundledLanguages: true,
    fallbackLng: 'en',
    supportedLngs: [...AVAILABLE_LOCALE_CODES, 'cimode'],
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
  .then(async () => {
    const detected = (i18n.resolvedLanguage || i18n.language || 'en').split(
      '-',
    )[0]
    if (detected && detected !== 'en') {
      await loadLocale(detected)
      if (i18n.language !== detected) {
        await changeLanguage(detected)
      }
    }
  })

export default i18n
