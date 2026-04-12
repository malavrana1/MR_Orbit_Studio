const devLog =
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_ENABLE_CONSOLE_ANALYTICS === 'true'
    ? (...args) => console.debug('[analytics]', ...args)
    : () => {}

const resolved = () => Promise.resolve()

export default {
  trackClick(...args) {
    devLog('click', ...args)
    return resolved()
  },
  trackExternalLink(...args) {
    devLog('external_link', ...args)
    return resolved()
  },
  trackSocialClick(...args) {
    devLog('social', ...args)
    return resolved()
  },
  trackDownload(...args) {
    devLog('download', ...args)
    return resolved()
  },
  trackContactForm(...args) {
    devLog('contact', ...args)
    return resolved()
  },
  trackNavigation(...args) {
    devLog('navigation', ...args)
    return resolved()
  },
}
