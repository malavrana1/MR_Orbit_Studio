import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

function hasRequiredConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId &&
      firebaseConfig.measurementId,
  )
}

/**
 * Whether events should be sent to Firebase. Dev traffic is off by default
 * so local development does not skew production numbers; set
 * REACT_APP_ENABLE_GA_IN_DEV=true to test against real GA4.
 */
function shouldSendToFirebase() {
  if (!hasRequiredConfig()) return false
  if (process.env.REACT_APP_DISABLE_ANALYTICS === 'true') return false
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_ENABLE_GA_IN_DEV !== 'true'
  ) {
    return false
  }
  return true
}

let analyticsInstancePromise = null

function getOrInitApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig)
  }
  return getApp()
}

/**
 * Resolves to the Analytics instance, or null if disabled / unsupported
 * (e.g. server, privacy extensions blocking gtag).
 */
export function getAnalyticsInstance() {
  if (!shouldSendToFirebase()) {
    return Promise.resolve(null)
  }
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }
  if (!analyticsInstancePromise) {
    analyticsInstancePromise = (async () => {
      try {
        if (!(await isSupported())) {
          return null
        }
        return getAnalytics(getOrInitApp())
      } catch {
        return null
      }
    })()
  }
  return analyticsInstancePromise
}
