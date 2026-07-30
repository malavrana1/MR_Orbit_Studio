import profile from './profile.json'
import personal from './personal.json'
import projects from './projects.json'
import resume from './resume.json'
import site from './site.json'

export const getProfile = () => profile
export const getPersonal = () => personal
export const getProjects = () => projects
export const getResume = () => resume
export const getSiteInfo = () => site

export function getNavConfig() {
  return (
    site.nav || {
      links: [
        { label: 'Home', href: '#home' },
        { label: 'Experience', href: '#experience' },
        { label: 'Projects', href: '#projects' },
        { label: 'Toolkit', href: '#toolkit' },
        { label: 'Education', href: '#education' },
        { label: 'Connect', href: '#connect' },
      ],
    }
  )
}

export function getNavSectionIds() {
  return getNavConfig().links.map((link) => link.href.substring(1))
}

const HERO_CORE = ['React.js', 'Next.js', 'Angular', 'Vue.js', 'TypeScript']

export const formatSkillLabel = (s) =>
  s.replace(/\.js$/i, '').replace(/\s*\(ES6\+\)/i, '')

export const getSkillCategories = () =>
  Object.entries(resume.skills).map(([category, items]) => ({
    category,
    items,
  }))

export const getHeroCoreStack = () => {
  const fe = resume.skills?.Frontend ?? []
  return HERO_CORE.map((name) => fe.find((s) => s === name)).filter(Boolean)
}

export const getHeroTypedTripleStrings = () => {
  const labels = getHeroCoreStack().map(formatSkillLabel)
  if (labels.length === 0) return []
  if (labels.length <= 3) return [labels.join(' · ')]
  const out = []
  for (let i = 0; i <= labels.length - 3; i += 1) {
    out.push(labels.slice(i, i + 3).join(' · '))
  }
  return out
}
