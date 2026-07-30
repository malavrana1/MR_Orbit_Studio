const fs = require('fs')
const path = require('path')

const sk = (s) => String(s).replace(/[^a-zA-Z0-9]/g, '_')

const dataDir = path.join(__dirname, '../src/data')
const localesDir = path.join(__dirname, '../src/locales')
const enPath = path.join(localesDir, 'en.json')

function readJson(name) {
  const p = path.join(dataDir, name)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function buildContent() {
  const profile = readJson('profile.json')
  const personal = readJson('personal.json')
  const projects = readJson('projects.json')
  const resume = readJson('resume.json')

  const content = {
    profile: {
      headline: profile.headline,
      availability: profile.availability || '',
      summary: {},
    },
    personal: {
      tagline: personal.tagline,
      intro: personal.intro,
      whatFuelsMe: personal.whatFuelsMe,
      interests: {},
      principles: {},
    },
    projects: {},
    experience: {},
    education: {},
    certifications: {},
    skillDescriptions: {},
    skillCategory: {},
  }

  ;(profile.summary || []).forEach((text, i) => {
    content.profile.summary[String(i)] = text
  })

  ;(personal.interests || []).forEach((item, i) => {
    content.personal.interests[String(i)] = item
  })
  ;(personal.principles || []).forEach((item, i) => {
    content.personal.principles[String(i)] = item
  })

  projects.forEach((p, i) => {
    content.projects[String(i)] = {
      title: p.title,
      outcome: p.outcome || '',
      description: p.description,
      cta: p.cta || '',
    }
  })

  ;(resume.experience || []).forEach((role, i) => {
    content.experience[String(i)] = {
      role: role.role,
      company: role.company,
      location: role.location,
      period: role.period,
      tagline: role.tagline || '',
      description: role.description,
    }
  })

  ;(resume.education || []).forEach((edu, i) => {
    content.education[String(i)] = {
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      period: edu.period,
    }
  })

  ;(resume.certifications || []).forEach((cert, i) => {
    content.certifications[String(i)] = {
      name: cert.name,
      issuer: cert.issuer,
    }
  })

  const skillDescriptions = resume.skillDescriptions || {}
  for (const [category, text] of Object.entries(skillDescriptions)) {
    content.skillDescriptions[sk(category)] = text
    content.skillCategory[sk(category)] = category
  }

  return content
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
en.content = buildContent()
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n')
console.log('Updated en.json → content.* from src/data/*.json')
