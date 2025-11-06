import resume from '../data/resume.json'

export const getResume = () => resume

export const getSkillCategories = () =>
  Object.entries(resume.skills).map(([category, items]) => ({
    category,
    items,
  }))
