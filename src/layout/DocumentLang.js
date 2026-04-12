import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function DocumentLang() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const apply = () => {
      const lng = i18n.resolvedLanguage || 'en'
      const base = lng.split('-')[0]
      const rtl = ['ar', 'he', 'fa', 'ur'].some((p) => lng.startsWith(p))
      document.documentElement.lang = base
      document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    }
    apply()
    i18n.on('languageChanged', apply)
    return () => {
      i18n.off('languageChanged', apply)
    }
  }, [i18n])

  return null
}
