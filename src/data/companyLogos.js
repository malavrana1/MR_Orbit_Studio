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
