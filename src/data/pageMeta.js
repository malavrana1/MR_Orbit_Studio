import ProfileImage from '../assets/images/Profile.jpg'

function appendMeta(create) {
  const el = create()
  document.head.appendChild(el)
  return el
}

function upsertMeta(selector, create) {
  let el = document.querySelector(selector)
  if (!el) el = appendMeta(create)
  return el
}

function setOg(prop, content) {
  const el = upsertMeta(`meta[property="${prop}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('property', prop)
    return m
  })
  el.setAttribute('content', content)
}

export function syncPageMeta(profile, t) {
  const descFallback = t('meta.portfolioSuffix')
  const summary = profile.summary?.[0] || descFallback
  const titleSuffix = profile.headline || descFallback
  document.title = `${profile.name} - ${titleSuffix}`

  const md = upsertMeta('meta[name="description"]', () => {
    const m = document.createElement('meta')
    m.name = 'description'
    return m
  })
  md.setAttribute('content', summary)

  setOg('og:title', `${profile.name} - ${t('meta.pageTitleSuffix')}`)
  setOg('og:description', summary)
  if (!document.querySelector('meta[property="og:image"]')) {
    setOg('og:image', `${window.location.origin}${ProfileImage}`)
  }
  if (!document.querySelector('meta[property="og:url"]')) {
    setOg('og:url', window.location.href)
  }
  if (!document.querySelector('meta[name="twitter:card"]')) {
    appendMeta(() => {
      const m = document.createElement('meta')
      m.name = 'twitter:card'
      m.content = 'summary_large_image'
      return m
    })
  }
}

export function syncStructuredData(profile, skillCategories) {
  document.getElementById('structured-data')?.remove()
  const script = document.createElement('script')
  script.id = 'structured-data'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline || 'Frontend Engineer',
    description: profile.summary?.[0],
    url: profile.contact.website || window.location.href,
    email: profile.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.contact.location,
    },
    sameAs: [profile.social.linkedin, profile.social.github],
    knowsAbout: skillCategories.flatMap((cat) => cat.items),
  })
  document.head.appendChild(script)
}

export function scheduleIdleTask(task, timeout = 500) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = window.requestIdleCallback(task, { timeout })
    return () => window.cancelIdleCallback(id)
  }
  const tid = window.setTimeout(task, 0)
  return () => window.clearTimeout(tid)
}
