import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.isTrackingEnabled = true
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  getUserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      referrer: document.referrer || 'direct',
      timestamp: Timestamp.now(),
      sessionId: this.sessionId
    }
  }

  async trackPageView(page = 'home') {
    if (!this.isTrackingEnabled) return
    try {
      const userInfo = this.getUserInfo()
      await addDoc(collection(db, 'pageViews'), {
        page,
        ...userInfo
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackClick(elementType, elementId, elementText = '') {
    if (!this.isTrackingEnabled) return
    try {
      const userInfo = this.getUserInfo()
      await addDoc(collection(db, 'clicks'), {
        elementType,
        elementId,
        elementText,
        ...userInfo
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackSectionView(sectionId) {
    if (!this.isTrackingEnabled) return
    try {
      const userInfo = this.getUserInfo()
      await addDoc(collection(db, 'sectionViews'), {
        sectionId,
        ...userInfo
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackScrollDepth(percentage) {
    if (!this.isTrackingEnabled) return
    try {
      const userInfo = this.getUserInfo()
      await addDoc(collection(db, 'scrollDepth'), {
        percentage,
        ...userInfo
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }
}

export const analyticsService = new AnalyticsService()
export default analyticsService
