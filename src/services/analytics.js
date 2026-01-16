import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.userId = this.getOrCreateUserId()
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

  getOrCreateUserId() {
    let userId = localStorage.getItem('analytics_user_id')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('analytics_user_id', userId)
      localStorage.setItem('analytics_first_visit', new Date().toISOString())
    }
    return userId
  }

  getUserInfo() {
    const firstVisit = localStorage.getItem('analytics_first_visit')
    const visitCount = parseInt(localStorage.getItem('analytics_visit_count') || '0') + 1
    localStorage.setItem('analytics_visit_count', visitCount.toString())
    
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      referrer: document.referrer || 'direct',
      firstVisit: firstVisit || new Date().toISOString(),
      visitCount: visitCount,
      timestamp: Timestamp.now()
    }
  }

  async trackPageView(page = 'home') {
    if (!this.isTrackingEnabled) return
    try {
      const userInfo = this.getUserInfo()
      const isNewUser = userInfo.visitCount === 1
      
      await addDoc(collection(db, 'pageViews'), {
        page,
        isNewUser,
        ...userInfo
      })

      if (isNewUser) {
        await addDoc(collection(db, 'users'), {
          userId: this.userId,
          firstVisit: userInfo.firstVisit,
          userAgent: userInfo.userAgent,
          language: userInfo.language,
          platform: userInfo.platform,
          screenWidth: userInfo.screenWidth,
          screenHeight: userInfo.screenHeight,
          referrer: userInfo.referrer,
          createdAt: Timestamp.now()
        })
      }
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
