import {
  FaHome,
  FaBriefcase,
  FaFolderOpen,
  FaToolbox,
  FaGraduationCap,
  FaHandshake,
  FaFilePdf,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaShareAlt,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSun,
  FaMoon,
  FaArrowUp,
  FaCode,
  FaUsers,
  FaCheckCircle,
  FaGlobe,
  FaHiking,
  FaMusic,
  FaUtensils,
  FaTools,
  FaPlane,
  FaCamera,
  FaLightbulb,
} from 'react-icons/fa'
import { MdSportsTennis, MdSportsCricket } from 'react-icons/md'

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

const actionMeta = {
  home: tile(FaHome, '#5c4033'),
  experience: tile(FaBriefcase, '#1D4ED8'),
  projects: tile(FaFolderOpen, '#7C3AED'),
  toolkit: tile(FaToolbox, '#0F766E'),
  education: tile(FaGraduationCap, '#B45309'),
  connect: tile(FaHandshake, '#0EA5E9'),
  craft: tile(FaCode, '#5c4033'),
  team: tile(FaUsers, '#1D4ED8'),
  quality: tile(FaCheckCircle, '#15803D'),
  resume: tile(FaFilePdf, '#DC2626'),
  contact: tile(FaEnvelope, '#5c4033'),
  email: tile(FaEnvelope, '#EA4335'),
  github: tile(FaGithub, '#181717'),
  linkedin: tile(FaLinkedin, '#0A66C2'),
  share: tile(FaShareAlt, '#0284C7'),
  live: tile(FaExternalLinkAlt, '#0EA5E9'),
  calendar: tile(FaCalendarAlt, '#0369A1'),
  location: tile(FaMapMarkerAlt, '#DC2626'),
  sun: tile(FaSun, '#F59E0B'),
  moon: tile(FaMoon, '#334155'),
  top: tile(FaArrowUp, '#5c4033'),
  language: tile(FaGlobe, '#0F766E'),
  tennis: tile(MdSportsTennis, '#65A30D'),
  cricket: tile(MdSportsCricket, '#15803D'),
  hiking: tile(FaHiking, '#0F766E'),
  music: tile(FaMusic, '#7C3AED'),
  cooking: tile(FaUtensils, '#EA580C'),
  diy: tile(FaTools, '#B45309'),
  travel: tile(FaPlane, '#0284C7'),
  photography: tile(FaCamera, '#475569'),
  explore: tile(FaLightbulb, '#CA8A04'),
}

const FALLBACK = tile(FaCode, '#5c4033')

export function getActionMeta(key) {
  return actionMeta[key] || FALLBACK
}
