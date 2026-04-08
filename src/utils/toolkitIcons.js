import {
  FaCode,
  FaNetworkWired,
  FaFlask,
  FaCloud,
  FaDatabase,
  FaLightbulb,
} from 'react-icons/fa'

export const getToolkitIcon = (category) => {
  const iconMap = {
    Frontend: FaCode,
    'Backend / API': FaNetworkWired,
    Testing: FaFlask,
    Database: FaDatabase,
    'DevOps / Tools': FaCloud,
    Concepts: FaLightbulb,
    'Front-End Technologies': FaCode,
    'Programming Languages': FaCode,
    'Web Technologies': FaNetworkWired,
    'Testing Libraries': FaFlask,
    Environment: FaCloud,
  }
  return iconMap[category] || FaCode
}
