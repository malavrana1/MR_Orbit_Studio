import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { hasFirebaseAnalyticsConfig, publicEnv } from './env'

const firebaseConfig = publicEnv.firebase

function shouldSendToFirebase() {
  if (!hasFirebaseAnalyticsConfig()) return false
  if (publicEnv.disableAnalytics) return false
  if (publicEnv.isDev && !publicEnv.enableGaInDev) return false
  return true
}

let analyticsInstancePromise = null

function getOrInitApp() {
  if (getApps().length === 0) {
    return initializeApp({ ...firebaseConfig })
  }
  return getApp()
}

/**
 * Resolves to the Analytics instance, or null if disabled / unsupported.
 * Firebase web config is public by design; protect the project with
 * API-key HTTP referrer restrictions in Google Cloud Console.
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
