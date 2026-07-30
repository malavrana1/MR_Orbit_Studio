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
  FaJava,
  FaShieldAlt,
  FaTachometerAlt,
  FaUniversalAccess,
  FaBug,
  FaServer,
  FaCode,
  FaNetworkWired,
  FaFlask,
  FaCloud,
  FaLightbulb,
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
  SiTestinglibrary,
  SiWebpack,
  SiJenkins,
  SiGraphql,
  SiVite,
  SiEslint,
  SiPrettier,
  SiFigma,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiSpringboot,
  SiCypress,
  SiBabel,
  SiStyledcomponents,
  SiNodedotjs,
  SiJson,
  SiJsonwebtokens,
  SiAuth0,
  SiCssmodules,
  SiGithubactions,
  SiJira,
  SiSentry,
  SiDatadog,
  SiSwagger,
  SiCircleci,
  SiFirebase,
  SiPinia,
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
  'React.js': tile(FaReact, '#087EA4'),
  'React Hooks': tile(FaReact, '#087EA4'),
  Angular: tile(SiAngular, '#DD0031'),
  'Vue.js': tile(SiVuedotjs, '#42B883'),
  'Next.js': tile(SiNextdotjs, '#111111'),
  'Node.js': tile(SiNodedotjs, '#339933'),
  'JavaScript (ES6+)': tile(SiJavascript, '#F7DF1E'),
  TypeScript: tile(SiTypescript, '#3178C6'),
  HTML5: tile(FaHtml5, '#E34F26'),
  CSS3: tile(FaCss3Alt, '#1572B6'),
  'Tailwind CSS': tile(SiTailwindcss, '#0EA5E9'),
  Bootstrap: tile(FaBootstrap, '#7952B3'),
  'Styled Components': tile(SiStyledcomponents, '#DB7093'),
  'CSS Modules': tile(SiCssmodules, '#000000'),
  'Responsive/Adaptive Design': tile(FaMobileAlt, '#0284C7'),
  Webpack: tile(SiWebpack, '#8DD6F9'),
  Vite: tile(SiVite, '#646CFF'),
  Babel: tile(SiBabel, '#F9DC3E'),
  Figma: tile(SiFigma, '#F24E1E'),
  Java: tile(FaJava, '#007396'),
  'Spring Boot': tile(SiSpringboot, '#6DB33F'),
  REST: tile(SiSwagger, '#85EA2D'),
  GraphQL: tile(SiGraphql, '#E10098'),
  JSON: tile(SiJson, '#292929'),
  JWT: tile(SiJsonwebtokens, '#000000'),
  OAuth: tile(SiAuth0, '#EB5424'),
  CORS: tile(FaShieldAlt, '#0F766E'),
  'API Security': tile(FaShieldAlt, '#B45309'),
  Caching: tile(SiRedis, '#DC382D'),
  Logging: tile(SiSentry, '#362D59'),
  Jest: tile(SiJest, '#C21325'),
  'React Testing Library': tile(SiTestinglibrary, '#E33332'),
  Cypress: tile(SiCypress, '#17202C'),
  Playwright: tile(FaTools, '#2EAD33'),
  'Unit/Integration/E2E Testing': tile(FaClipboardCheck, '#7C3AED'),
  'Test Automation': tile(FaTools, '#6D28D9'),
  MySQL: tile(SiMysql, '#4479A1'),
  PostgreSQL: tile(SiPostgresql, '#4169E1'),
  MongoDB: tile(SiMongodb, '#47A248'),
  Redis: tile(SiRedis, '#DC382D'),
  SQL: tile(FaDatabase, '#336791'),
  'Schema Design': tile(FaSitemap, '#1D4ED8'),
  'Advanced Queries': tile(FaLayerGroup, '#1E40AF'),
  Git: tile(FaGitAlt, '#F05032'),
  'GitHub Actions': tile(SiGithubactions, '#2088FF'),
  Jenkins: tile(SiJenkins, '#D24939'),
  Docker: tile(FaDocker, '#2496ED'),
  AWS: tile(FaAws, '#FF9900'),
  'CI/CD Pipelines': tile(SiCircleci, '#343434'),
  'Performance Monitoring': tile(SiDatadog, '#632CA6'),
  ESLint: tile(SiEslint, '#4B32C3'),
  Prettier: tile(SiPrettier, '#F7B93E'),
  'Accessibility (WCAG 2.1 AA)': tile(FaUniversalAccess, '#2563EB'),
  'Frontend Performance Optimization': tile(FaRocket, '#C2410C'),
  'Frontend Security': tile(FaShieldAlt, '#B45309'),
  'Agile/SCRUM': tile(SiJira, '#0052CC'),
  'Client-Side Debugging': tile(FaBug, '#DC2626'),
  OOP: tile(FaProjectDiagram, '#475569'),
  'Design Patterns': tile(FaLayerGroup, '#334155'),
  Firebase: tile(SiFirebase, '#FFCA28'),
  'Firebase Hosting': tile(SiFirebase, '#FFCA28'),
  Pinia: tile(SiPinia, '#FFD859'),
  React: tile(FaReact, '#087EA4'),
}

const toolkitMeta = {
  Frontend: tile(FaCode, '#5c4033'),
  'Backend / API': tile(FaNetworkWired, '#1D4ED8'),
  Testing: tile(FaFlask, '#7C3AED'),
  Database: tile(FaDatabase, '#0F766E'),
  'DevOps / Tools': tile(FaCloud, '#0369A1'),
  Concepts: tile(FaLightbulb, '#B45309'),
}

const FALLBACK = tile(FaCode, '#5c4033')

export function getSkillMeta(skill) {
  return skillMeta[skill] || FALLBACK
}

export function getToolkitMeta(category) {
  return toolkitMeta[category] || FALLBACK
}
