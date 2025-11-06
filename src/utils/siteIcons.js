import {
  FaReact,
  FaBootstrap,
  FaCogs,
  FaFileCode,
  FaKeyboard,
  FaCubes,
  FaCode,
} from 'react-icons/fa'

export const getSiteIcon = (iconKey) => {
  const iconMap = {
    react: FaReact,
    reactBootstrap: FaCubes,
    bootstrap: FaBootstrap,
    pnpm: FaCogs,
    icons: FaFileCode,
    typed: FaKeyboard,
  }
  return iconMap[iconKey] || FaCode
}
