class AnalyticsService {
  constructor() {
    this.isTrackingEnabled =
      process.env.NODE_ENV === 'development' &&
      process.env.REACT_APP_ENABLE_CONSOLE_ANALYTICS === 'true'
    this.trackedSections = new Set()
    this.scrollDepthsTracked = new Set()
  }

  async trackPageView(page = 'home') {
    if (!this.isTrackingEnabled) return
    // no-op placeholder to keep API compatible
  }

  async trackClick(
    elementType,
    elementId,
    elementText = '',
    additionalData = {},
  ) {
    if (!this.isTrackingEnabled) return
    // no-op placeholder to keep API compatible
  }

  async trackSectionView(sectionId) {
    if (!this.isTrackingEnabled) return

    if (this.trackedSections.has(sectionId)) return
    this.trackedSections.add(sectionId)
  }

  async trackScrollDepth(percentage) {
    if (!this.isTrackingEnabled) return

    const milestone = Math.floor(percentage / 25) * 25
    if (this.scrollDepthsTracked.has(milestone)) return
    this.scrollDepthsTracked.add(milestone)
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
    if (!this.isTrackingEnabled) return
    // no-op placeholder to keep API compatible
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
