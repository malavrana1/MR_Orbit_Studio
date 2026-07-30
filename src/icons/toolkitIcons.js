import {
  FaCode,
  FaNetworkWired,
  FaFlask,
  FaCloud,
  FaDatabase,
  FaLightbulb,
} from 'react-icons/fa'

const iconMap = {
  Frontend: FaCode,
  'Backend / API': FaNetworkWired,
  Testing: FaFlask,
  Database: FaDatabase,
  'DevOps / Tools': FaCloud,
  Concepts: FaLightbulb,
}

export const getToolkitIcon = (category) => iconMap[category] || FaCode
