import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaAws,
  FaDatabase,
  FaBootstrap,
  FaDocker,
  FaTools,
  FaShieldAlt,
  FaTachometerAlt,
  FaUniversalAccess,
  FaServer,
  FaCode,
  FaNetworkWired,
  FaFlask,
  FaCloud,
  FaLayerGroup,
  FaSitemap,
  FaProjectDiagram,
  FaMobileAlt,
  FaClipboardCheck,
  FaRocket,
} from 'react-icons/fa'
import {
  SiNextdotjs,
  SiAngular,
  SiVuedotjs,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiJest,
  SiJenkins,
  SiGraphql,
  SiMysql,
  SiCypress,
  SiNodedotjs,
  SiJsonwebtokens,
  SiAuth0,
  SiGithubactions,
  SiSwagger,
  SiCircleci,
  SiFirebase,
  SiPinia,
  SiNgrx,
  SiSass,
  SiKubernetes,
  SiDotnet,
  SiJasmine,
  SiLighthouse,
} from 'react-icons/si'

function isLight(hex) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

function tile(Icon, color) {
  return {
    Icon,
    color,
    ink: isLight(color) ? '#111111' : '#ffffff',
  }
}

const skillMeta = {
  Angular: tile(SiAngular, '#DD0031'),
  RxJS: tile(FaProjectDiagram, '#B7178C'),
  NgRx: tile(SiNgrx, '#BA2BD2'),
  'Standalone Components': tile(SiAngular, '#DD0031'),
  'Lazy Loading': tile(FaRocket, '#C2410C'),
  'Reactive Forms': tile(FaClipboardCheck, '#7C3AED'),
  Routing: tile(FaSitemap, '#1D4ED8'),
  Guards: tile(FaShieldAlt, '#0F766E'),
  Interceptors: tile(FaNetworkWired, '#1D4ED8'),
  'Change Detection': tile(FaTachometerAlt, '#C2410C'),
  JavaScript: tile(SiJavascript, '#F7DF1E'),
  SCSS: tile(SiSass, '#CC6699'),
  'AG Grid': tile(FaLayerGroup, '#1E40AF'),
  'Responsive Design': tile(FaMobileAlt, '#0284C7'),
  'WCAG 2.1 AA': tile(FaUniversalAccess, '#2563EB'),
  Lighthouse: tile(SiLighthouse, '#F44B21'),
  'axe DevTools': tile(FaUniversalAccess, '#005A9C'),
  'REST APIs': tile(SiSwagger, '#85EA2D'),
  HttpClient: tile(FaServer, '#0369A1'),
  'OAuth 2.0': tile(SiAuth0, '#EB5424'),
  '.NET Core': tile(SiDotnet, '#512BD4'),
  'SQL Server': tile(FaDatabase, '#CC2927'),
  Jasmine: tile(SiJasmine, '#8A4182'),
  Karma: tile(FaFlask, '#7C3AED'),
  Kubernetes: tile(SiKubernetes, '#326CE5'),
  'CI/CD': tile(SiCircleci, '#343434'),
  'Vue.js': tile(SiVuedotjs, '#42B883'),
  'Next.js': tile(SiNextdotjs, '#111111'),
  'Node.js': tile(SiNodedotjs, '#339933'),
  TypeScript: tile(SiTypescript, '#3178C6'),
  HTML5: tile(FaHtml5, '#E34F26'),
  CSS3: tile(FaCss3Alt, '#1572B6'),
  'Tailwind CSS': tile(SiTailwindcss, '#0EA5E9'),
  Bootstrap: tile(FaBootstrap, '#7952B3'),
  GraphQL: tile(SiGraphql, '#E10098'),
  JWT: tile(SiJsonwebtokens, '#000000'),
  Jest: tile(SiJest, '#C21325'),
  Cypress: tile(SiCypress, '#17202C'),
  Playwright: tile(FaTools, '#2EAD33'),
  MySQL: tile(SiMysql, '#4479A1'),
  Git: tile(FaGitAlt, '#F05032'),
  'GitHub Actions': tile(SiGithubactions, '#2088FF'),
  Jenkins: tile(SiJenkins, '#D24939'),
  Docker: tile(FaDocker, '#2496ED'),
  AWS: tile(FaAws, '#FF9900'),
  Firebase: tile(SiFirebase, '#FFCA28'),
  Pinia: tile(SiPinia, '#FFD859'),
  React: tile(FaReact, '#087EA4'),
}

const toolkitMeta = {
  Frontend: tile(FaCode, '#4f3529'),
  Angular: tile(SiAngular, '#DD0031'),
  'UI / Accessibility': tile(FaUniversalAccess, '#2563EB'),
  'API / Backend': tile(FaNetworkWired, '#1D4ED8'),
  Testing: tile(FaFlask, '#7C3AED'),
  'DevOps / Tools': tile(FaCloud, '#0369A1'),
}

const FALLBACK = tile(FaCode, '#4f3529')

export function getSkillMeta(skill) {
  return skillMeta[skill] || FALLBACK
}

export function getToolkitMeta(category) {
  return toolkitMeta[category] || FALLBACK
}
