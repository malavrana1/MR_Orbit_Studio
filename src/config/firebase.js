import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId']
const missingFields = requiredFields.filter(
  (field) => !firebaseConfig[field] || firebaseConfig[field] === 'undefined',
)

let app = null
let db = null
let analytics = null

if (missingFields.length === 0) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)

    if (
      typeof window !== 'undefined' &&
      firebaseConfig.measurementId &&
      firebaseConfig.measurementId !== 'undefined'
    ) {
      try {
        analytics = getAnalytics(app)
      } catch (error) {
        console.warn('Firebase Analytics initialization failed:', error)
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
} else {
  console.warn(
    `Firebase configuration missing: ${missingFields.join(', ')}. ` +
      'Please check your .env file and restart the development server.',
  )
}

export { analytics }
export { db }
export default app
