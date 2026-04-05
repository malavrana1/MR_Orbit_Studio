class AnalyticsService {
  constructor() {
    this.isTrackingEnabled =
      process.env.NODE_ENV === 'development' &&
      process.env.REACT_APP_ENABLE_CONSOLE_ANALYTICS === 'true'
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
