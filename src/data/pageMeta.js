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

function setNamedMeta(name, content) {
  const el = upsertMeta(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('name', name)
    return m
  })
  el.setAttribute('content', content)
}

function setOg(prop, content) {
  const el = upsertMeta(`meta[property="${prop}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('property', prop)
    return m
  })
  el.setAttribute('content', content)
}

function siteOrigin() {
  if (typeof window === 'undefined') return 'https://mr-orbit-studio.web.app'
  return window.location.origin
}

function siteUrl(profile) {
  return profile?.contact?.website || `${siteOrigin()}/`
}

export function syncPageMeta(profile, t) {
  const descFallback = t('meta.portfolioSuffix')
  const summary = profile.summary?.[0] || descFallback
  const title = `${profile.name} — ${profile.headline || descFallback}`
  const shortDesc =
    profile.headline
      ? `${profile.headline} portfolio — React, Angular, Vue, TypeScript. NJ / Remote.`
      : summary
  const origin = siteOrigin()
  const pageUrl = siteUrl(profile)
  const image = `${origin}/og-image.jpg`

  document.title = title

  setNamedMeta('description', shortDesc)
  setNamedMeta('author', profile.name)

  setOg('og:type', 'website')
  setOg('og:site_name', 'MR Orbit Studio')
  setOg('og:title', title)
  setOg('og:description', shortDesc)
  setOg('og:url', pageUrl)
  setOg('og:image', image)
  setOg('og:image:width', '1200')
  setOg('og:image:height', '630')

  setNamedMeta('twitter:card', 'summary_large_image')
  setNamedMeta('twitter:title', title)
  setNamedMeta('twitter:description', shortDesc)
  setNamedMeta('twitter:image', image)

  const canonical = upsertMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link')
    link.rel = 'canonical'
    return link
  })
  canonical.setAttribute('href', pageUrl)
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
    url: siteUrl(profile),
    email: profile.contact?.email
      ? `mailto:${profile.contact.email}`
      : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Woodbridge',
      addressRegion: 'NJ',
      addressCountry: 'US',
    },
    sameAs: [profile.social?.linkedin, profile.social?.github].filter(Boolean),
    knowsAbout: (skillCategories || []).flatMap((cat) => cat.items || []),
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
