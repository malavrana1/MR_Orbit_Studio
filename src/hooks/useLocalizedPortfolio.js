import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getProfile,
  getResume,
  getProjects,
  getPersonal,
} from '../data/loaders'
import {
  translateProfile,
  translatePersonal,
  translateProjects,
  translateExperience,
  translateEducation,
  translateSkillDescriptions,
} from '../i18n/content'

export function useLocalizedPortfolio() {
  const { t, i18n } = useTranslation()

  const portfolio = useMemo(() => {
    const profile = getProfile()
    const resume = getResume()
    return {
      profile: translateProfile(t, profile),
      resume: {
        ...resume,
        experience: translateExperience(t, resume.experience),
        education: translateEducation(t, resume.education),
        skillDescriptions: translateSkillDescriptions(
          t,
          resume.skillDescriptions,
        ),
      },
      projects: translateProjects(t, getProjects()),
      personal: translatePersonal(t, getPersonal()),
    }
  }, [t, i18n.language])

  return { portfolio, t, i18n }
}
