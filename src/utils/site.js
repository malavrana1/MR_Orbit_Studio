import site from '../data/site.json'

export const getSiteInfo = () => site

export const DEFAULT_NAV = {
  links: [
    { label: 'Home', href: '#home' },
    { label: 'Summary', href: '#summary' },
    { label: 'Toolkit', href: '#toolkit' },
    { label: 'Experience', href: '#experience' },
    { label: 'Credentials', href: '#credentials' },
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Connect', href: '#connect' },
  ],
}

export function getNavConfig() {
  const s = getSiteInfo() || {}
  return s.nav || DEFAULT_NAV
}

export function getNavSectionIds() {
  return getNavConfig().links.map((link) => link.href.substring(1))
}
