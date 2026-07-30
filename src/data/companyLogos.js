import fusionHealthLogo from '../assets/images/logos/fusion-health.png'
import blackstrawLogo from '../assets/images/logos/blackstraw.png'
import kisweLogo from '../assets/images/logos/kiswe.png'
import genslerLogo from '../assets/images/logos/gensler.png'
import cignaLogo from '../assets/images/logos/cigna.png'
import atmiyaLogo from '../assets/images/logos/atmiya_care_charity.png'

const BY_COMPANY = {
  'Blackstraw AI': blackstrawLogo,
  'Fusion Health': fusionHealthLogo,
  Kiswe: kisweLogo,
  Gensler: genslerLogo,
  'Cigna Express Scripts': cignaLogo,
  'Atmiya Care Charity': atmiyaLogo,
}

export function getCompanyLogo(companyKey) {
  return BY_COMPANY[companyKey] || null
}

/** Initials for monogram fallback when a logo file is missing or fails. */
export function getCompanyInitials(companyName = '') {
  const words = String(companyName)
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}
