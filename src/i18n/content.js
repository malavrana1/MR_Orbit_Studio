const sk = (s) => String(s).replace(/[^a-zA-Z0-9]/g, '_')

function tc(t, key, fallback) {
  return t(`content.${key}`, { defaultValue: fallback })
}

export function translateProfile(t, profile) {
  return {
    ...profile,
    headline: tc(t, 'profile.headline', profile.headline),
    summary: (profile.summary || []).map((text, i) =>
      tc(t, `profile.summary.${i}`, text),
    ),
  }
}

export function translatePersonal(t, personal) {
  return {
    ...personal,
    tagline: tc(t, 'personal.tagline', personal.tagline),
    intro: tc(t, 'personal.intro', personal.intro),
    whatFuelsMe: tc(t, 'personal.whatFuelsMe', personal.whatFuelsMe),
    interests: (personal.interests || []).map((item, i) =>
      tc(t, `personal.interests.${i}`, item),
    ),
    principles: (personal.principles || []).map((item, i) =>
      tc(t, `personal.principles.${i}`, item),
    ),
  }
}

export function translateProjects(t, projects) {
  return projects.map((p, i) => ({
    ...p,
    title: tc(t, `projects.${i}.title`, p.title),
    description: tc(t, `projects.${i}.description`, p.description),
    cta: tc(t, `projects.${i}.cta`, p.cta),
  }))
}

export function translateExperience(t, experience) {
  return experience.map((role, i) => ({
    ...role,
    companyKey: role.company,
    role: tc(t, `experience.${i}.role`, role.role),
    // Keep brand names stable while localizing the rest.
    company: role.company,
    location: tc(t, `experience.${i}.location`, role.location),
    period: tc(t, `experience.${i}.period`, role.period),
    tagline: tc(t, `experience.${i}.tagline`, role.tagline || ''),
    description: tc(t, `experience.${i}.description`, role.description),
    highlights: (role.highlights || []).map((h, j) =>
      tc(t, `experience.${i}.highlights.${j}`, h),
    ),
  }))
}

export function translateEducation(t, education) {
  if (!education?.length) return education
  return education.map((edu, i) => ({
    ...edu,
    degree: tc(t, `education.${i}.degree`, edu.degree),
    institution: tc(t, `education.${i}.institution`, edu.institution),
    location: tc(t, `education.${i}.location`, edu.location),
    period: tc(t, `education.${i}.period`, edu.period),
  }))
}

export function translateCertifications(t, certifications) {
  if (!certifications?.length) return []
  return certifications.map((cert, i) => ({
    ...cert,
    name: tc(t, `certifications.${i}.name`, cert.name),
    issuer: tc(t, `certifications.${i}.issuer`, cert.issuer || ''),
  }))
}

export function translateSkillDescriptions(t, descriptions) {
  const out = {}
  for (const [category, text] of Object.entries(descriptions || {})) {
    const k = sk(category)
    out[category] = tc(t, `skillDescriptions.${k}`, text)
  }
  return out
}

export function translateSkillCategoryLabel(t, category) {
  return tc(t, `skillCategory.${sk(category)}`, category)
}
