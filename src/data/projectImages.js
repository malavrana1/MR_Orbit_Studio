import rouletteLive from '../assets/images/projects/roulette-live.jpg'
import stocksim from '../assets/images/projects/stocksim.jpg'
import mrOrbitStudio from '../assets/images/projects/mr-orbit-studio.jpg'

const BY_ID = {
  'roulette-live': rouletteLive,
  stocksim,
  'mr-orbit-studio': mrOrbitStudio,
}

export function getProjectImage(projectId) {
  return BY_ID[projectId] || null
}
