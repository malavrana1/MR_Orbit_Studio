import {
  FaBuilding,
  FaBriefcase,
  FaHospital,
  FaHeart,
} from 'react-icons/fa'

const companyIconMap = {
  'Kiswe': FaBuilding,
  'Gensler': FaBriefcase,
  'Cigna Express Scripts': FaHospital,
  'Atmiya Care Charity': FaHeart,
}

export const getCompanyIcon = (companyName) => {
  return companyIconMap[companyName] || FaBuilding
}

export const getCompanyInitials = (companyName) => {
  if (!companyName) return ''
  const words = companyName.split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return words
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}
