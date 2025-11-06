import {
  FaCode,
  FaKeyboard,
  FaNetworkWired,
  FaFlask,
  FaCloud,
} from 'react-icons/fa'

export const getToolkitIcon = (category) => {
  const iconMap = {
    'Front-End Technologies': FaCode,
    'Programming Languages': FaKeyboard,
    'Web Technologies': FaNetworkWired,
    'Testing Libraries': FaFlask,
    Environment: FaCloud,
  }
  return iconMap[category] || FaCode
}
