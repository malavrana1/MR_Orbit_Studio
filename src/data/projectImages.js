import rouletteLive from '../assets/images/projects/roulette-live.jpg'
import stocksim from '../assets/images/projects/stocksim.jpg'

const BY_ID = {
  'roulette-live': rouletteLive,
  stocksim,
}

export function getProjectImage(projectId) {
  return BY_ID[projectId] || null
}
