import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { logEvent } from 'firebase/analytics'
import { db, analytics } from '../config/firebase'

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.isTrackingEnabled = true
    this.trackedSections = new Set()
    this.scrollDepthsTracked = new Set()
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
      sessionId: this.sessionId,
      url: window.location.href,
    }
  }

  async trackPageView(page = 'home') {
    if (!this.isTrackingEnabled) return
    if (!db) return
    try {
      const userInfo = this.getUserInfo()

      if (analytics) {
        logEvent(analytics, 'page_view', {
          page_title: page,
          page_location: window.location.href,
          page_path: window.location.pathname,
        })
      }

      await addDoc(collection(db, 'pageViews'), {
        page,
        ...userInfo,
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackClick(
    elementType,
    elementId,
    elementText = '',
    additionalData = {},
  ) {
    if (!this.isTrackingEnabled) return
    if (!db) return
    try {
      const userInfo = this.getUserInfo()

      if (analytics) {
        logEvent(analytics, 'click', {
          element_type: elementType,
          element_id: elementId,
          element_text: elementText,
          ...additionalData,
        })
      }

      await addDoc(collection(db, 'clicks'), {
        elementType,
        elementId,
        elementText,
        ...additionalData,
        ...userInfo,
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackSectionView(sectionId) {
    if (!this.isTrackingEnabled) return
    if (!db) return

    if (this.trackedSections.has(sectionId)) return
    this.trackedSections.add(sectionId)

    try {
      const userInfo = this.getUserInfo()

      if (analytics) {
        logEvent(analytics, 'view_section', {
          section_id: sectionId,
          section_name: sectionId,
        })
      }

      await addDoc(collection(db, 'sectionViews'), {
        sectionId,
        ...userInfo,
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackScrollDepth(percentage) {
    if (!this.isTrackingEnabled) return
    if (!db) return

    const milestone = Math.floor(percentage / 25) * 25
    if (this.scrollDepthsTracked.has(milestone)) return
    this.scrollDepthsTracked.add(milestone)

    try {
      const userInfo = this.getUserInfo()

      if (analytics) {
        logEvent(analytics, 'scroll', {
          scroll_depth: percentage,
          scroll_milestone: milestone,
        })
      }

      await addDoc(collection(db, 'scrollDepth'), {
        percentage,
        milestone,
        ...userInfo,
      })
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }

  async trackExternalLink(url, linkText = '') {
    await this.trackClick('external_link', url, linkText, {
      link_url: url,
      link_destination: 'external',
    })
  }

  async trackSocialClick(platform, url) {
    await this.trackClick('social_link', platform, platform, {
      platform,
      link_url: url,
      link_destination: 'social',
    })
  }

  async trackDownload(fileName, fileType = '') {
    await this.trackClick('download', fileName, fileName, {
      file_name: fileName,
      file_type: fileType,
      action: 'download',
    })
  }

  async trackContactForm(action, data = {}) {
    if (!db) return

    if (analytics) {
      logEvent(analytics, 'contact_form', {
        form_action: action,
        ...data,
      })
    }

    await addDoc(collection(db, 'contactForm'), {
      action,
      ...data,
      ...this.getUserInfo(),
    })
  }

  async trackNavigation(section, source = 'header') {
    await this.trackClick('navigation', section, section, {
      navigation_section: section,
      navigation_source: source,
    })
  }
}

export const analyticsService = new AnalyticsService()
export default analyticsService
