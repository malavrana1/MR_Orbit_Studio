import { logEvent } from 'firebase/analytics'
import { getAnalyticsInstance } from '../config/firebaseClient'
import { publicEnv } from '../config/env'

const devLog = publicEnv.enableConsoleAnalytics
  ? (...args) => console.debug('[analytics]', ...args)
  : () => {}

/** GA4 / Firebase limit-safe string (custom param values) — never send PII here */
const clip = (value, max = 120) => {
  if (value == null) return ''
  const s = String(value)
  return s.length > max ? `${s.slice(0, max - 1)}…` : s
}

function send(name, params) {
  return getAnalyticsInstance().then((analytics) => {
    if (publicEnv.isDev && publicEnv.enableConsoleAnalytics) {
      devLog(
        name,
        params,
        analytics ? '→ sent' : '→ (no GA: missing env, disabled, or unsupported)',
      )
    }
    if (!analytics) {
      return
    }
    try {
      logEvent(analytics, name, params)
    } catch (err) {
      devLog('logEvent failed', name, err)
    }
  })
}

export default {
  trackClick(contentType, itemId, itemName) {
    return send('portfolio_click', {
      content_type: clip(contentType, 64),
      item_id: clip(itemId, 64),
      item_name: clip(itemName, 100),
    })
  },
  trackExternalLink(url, title) {
    return send('portfolio_outbound', {
      link_url: clip(url, 200),
      link_title: clip(title, 100),
    })
  },
  trackSocialClick(network, url) {
    return send('portfolio_social', {
      network: clip(network, 32),
      link_url: clip(url, 200),
    })
  },
  trackDownload(fileName, fileType) {
    return send('portfolio_file_download', {
      file_name: clip(fileName, 120),
      file_type: clip(fileType, 32),
    })
  },
  /**
   * Tracks contact-form lifecycle only — never message body, email, or phone.
   * @param {string} [action]
   */
  trackContactForm(action = 'interaction') {
    return send('portfolio_contact', {
      action: clip(action, 64),
    })
  },
  trackNavigation(sectionId, source) {
    return send('portfolio_nav', {
      section_id: clip(sectionId, 64),
      source: clip(source, 32),
    })
  },
}
