/**
 * Only VITE_* values are available in the browser bundle.
 * Never put service accounts, private keys, or server secrets in VITE_* vars.
 */
const raw = import.meta.env

function read(key) {
  const value = raw[key]
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : ''
}

function flag(key) {
  return read(key) === 'true'
}

export const publicEnv = Object.freeze({
  isDev: Boolean(raw.DEV),
  isProd: Boolean(raw.PROD),
  firebase: Object.freeze({
    apiKey: read('VITE_FIREBASE_API_KEY'),
    authDomain: read('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: read('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: read('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: read('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: read('VITE_FIREBASE_APP_ID'),
    measurementId: read('VITE_FIREBASE_MEASUREMENT_ID'),
  }),
  /**
   * Optional FormSubmit destination (email or FormSubmit form id).
   * Prefer this over baking a mailbox into source defaults.
   */
  contactFormEndpoint: read('VITE_CONTACT_FORM_ENDPOINT'),
  disableAnalytics: flag('VITE_DISABLE_ANALYTICS'),
  enableGaInDev: flag('VITE_ENABLE_GA_IN_DEV'),
  enableConsoleAnalytics: flag('VITE_ENABLE_CONSOLE_ANALYTICS'),
})

export function hasFirebaseAnalyticsConfig() {
  const { apiKey, projectId, appId, measurementId } = publicEnv.firebase
  return Boolean(apiKey && projectId && appId && measurementId)
}

/**
 * Builds the FormSubmit AJAX URL. Returns null when no safe destination exists.
 */
export function getContactSubmitUrl(profileEmail = '') {
  const endpoint = publicEnv.contactFormEndpoint || String(profileEmail || '').trim()
  if (!endpoint) return null

  if (/^https?:\/\//i.test(endpoint)) {
    try {
      const url = new URL(endpoint)
      if (url.hostname !== 'formsubmit.co') return null
      return url.toString()
    } catch {
      return null
    }
  }

  return `https://formsubmit.co/ajax/${encodeURIComponent(endpoint)}`
}
