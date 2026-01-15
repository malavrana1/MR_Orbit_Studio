import React, { useMemo, useState, useEffect, useRef } from 'react'
import { ReactTyped } from 'react-typed'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import {
  FaRegLightbulb,
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaLayerGroup,
  FaUniversalAccess,
  FaCogs,
  FaDownload,
  FaCode,
  FaChevronDown,
  FaGraduationCap,
  FaAward,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import '../../App.css'
import '../../css/LandingPage.css'
import '../../css/LandingPage.dark.css'
import ProfileImage from '../../assets/images/Profile.jpg'
import { getProfile } from '../../utils/profile'
import { getResume, getSkillCategories } from '../../utils/resume'
import { getProjects } from '../../utils/projects'
import { getPersonal } from '../../utils/personal'
import { getSkillIcon } from '../../utils/skillIcons'
import resumePdf from '../../assets/pdf/MR_Resume.pdf'
import { getSiteInfo } from '../../utils/site'
import { getToolkitIcon } from '../../utils/toolkitIcons'
import kisweLogo from '../../assets/images/logos/kiswe.png'
import genslerLogo from '../../assets/images/logos/gensler.png'
import cignaLogo from '../../assets/images/logos/cigna.png'
import atmiyaLogo from '../../assets/images/logos/atmiya_care_charity.png'
import { analyticsService } from '../../services/analytics'

const getCompanyLogo = (companyName) => {
  const logoMap = {
    'Kiswe': kisweLogo,
    'Gensler': genslerLogo,
    'Cigna Express Scripts': cignaLogo,
    'Atmiya Care Charity': atmiyaLogo,
  }
  return logoMap[companyName] || null
}

export default function LandingPage() {
  const profile = getProfile()
  const resume = getResume()
  const skillCategories = getSkillCategories()
  const allProjects = getProjects()
  const personal = getPersonal()
  const siteInfo = getSiteInfo()
  const skillWall = useMemo(() => {
    const flatSkills = skillCategories.flatMap((group) => group.items)
    return Array.from(new Set(flatSkills)).slice(0, 8)
  }, [skillCategories])
  const topExperience = useMemo(
    () => resume.experience.slice(0, 2),
    [resume.experience],
  )

  const [activeToolkit, setActiveToolkit] = useState(
    skillCategories[0]?.category || 'Front-End Technologies',
  )
  const activeToolkitItems = skillCategories.find(
    (item) => item.category === activeToolkit,
  )?.items

  const toolkitDescriptions = resume.skillDescriptions || {}
  const [expandedCertification, setExpandedCertification] = useState('')
  const [emailCopied, setEmailCopied] = useState(false)
  const [phoneCopied, setPhoneCopied] = useState(false)
  const viewedSections = useRef(new Set())
  const trackedScrollDepths = useRef(new Set())

  const summaryStats = profile.stats || []
  const ui = siteInfo.ui || {}
  const heroUI = ui.hero || {}
  const sectionsUI = ui.sections || {}
  const typedConfig = ui.typed || { typeSpeed: 45, backSpeed: 22 }

  useEffect(() => {
    analyticsService.trackPageView('home')
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['summary', 'experience', 'projects', 'toolkit', 'certifications', 'education', 'connect']
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element && !viewedSections.current.has(sectionId)) {
          const rect = element.getBoundingClientRect()
          if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
            viewedSections.current.add(sectionId)
            analyticsService.trackSectionView(sectionId)
          }
        }
      })

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100)
      const milestones = [25, 50, 75, 100]
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !trackedScrollDepths.current.has(milestone)) {
          trackedScrollDepths.current.add(milestone)
          analyticsService.trackScrollDepth(milestone)
        }
      })
    }

    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  const trackClick = (elementType, elementId, elementText) => {
    analyticsService.trackClick(elementType, elementId, elementText)
  }

  return (
    <div className="landing-page" id="home">
      <header className="landing-hero d-flex align-items-center">
        <div className="landing-hero__overlay" />
        <div className="landing-hero__pattern" />
        <Container className="position-relative">
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <div className="hero-profile mb-4">
                <img
                  src={ProfileImage}
                  alt={profile.name}
                  className="hero-profile-image"
                />
              </div>
              <div className="hero-content-wrapper">
                <h1 className="hero-title mb-3">
                  <span className="hero-greeting">Hi, I&apos;m</span>
                  <span className="hero-name">{profile.name}.</span>
                  <br />
                  <span className="hero-typed-wrapper">
                    <span className="hero-typed">
                      <ReactTyped
                        strings={profile.heroHighlights || []}
                        typeSpeed={typedConfig.typeSpeed}
                        backSpeed={typedConfig.backSpeed}
                        loop
                      />
                    </span>
                  </span>
                </h1>
                <div className="hero-tech-stack mb-3">
                  <span className="hero-tech-badge">React</span>
                  <span className="hero-tech-separator">•</span>
                  <span className="hero-tech-badge">Next.js</span>
                  <span className="hero-tech-separator">•</span>
                  <span className="hero-tech-badge">Angular</span>
                  <span className="hero-tech-separator">•</span>
                  <span className="hero-tech-badge">Vue</span>
                </div>
                <p className="hero-description lead mb-4">
                  {profile.summary?.[0] ||
                    "Software engineer with 5+ years building responsive apps using React, Angular, Vue, and Next.js. I've worked with streaming platforms, architecture firms, healthcare companies, and nonprofits."}
                </p>
              </div>
            </Col>
            <Col lg={5}>
              <Card className="hero-skill-card border-0 shadow-lg">
                <Card.Body>
                  <div className="skill-card-header">
                    <div>
                      <h5 className="mb-1">
                        {heroUI.skillCard?.title || 'Skill snapshot'}
                      </h5>
                      <p className="text-muted mb-0">
                        {heroUI.skillCard?.description ||
                          'A concise look at the front-end stack I use most.'}
                      </p>
                    </div>
                    <FaRegLightbulb className="text-warning fs-4" />
                  </div>
                  <div className="skill-icon-grid">
                    {skillWall.map((skill) => {
                      const Icon = getSkillIcon(skill)
                      return (
                        <div className="skill-icon-tile" key={skill}>
                          <span className="skill-icon-tile__icon">
                            <Icon />
                          </span>
                          <span>{skill}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="hero-experience-quick mt-4">
                    <h6 className="mb-2 text-uppercase text-muted small">
                      {heroUI.skillCard?.recentTeams || 'Recent teams'}
                    </h6>
                    <ul className="hero-experience-list">
                      {topExperience.map((role) => (
                        <li key={role.company}>
                          <span className="hero-experience-list__title">
                            {role.role} · {role.company}
                          </span>
                          <span className="hero-experience-list__period">
                            {role.period}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </header>

      <section id="summary" className="landing-summary py-5">
        <Container>
          <Card className="summary-card border-0 shadow-sm">
            <Card.Body>
              <div className="summary-header text-center mb-4">
                <h2 className="summary-title">
                  {sectionsUI.professionalSummary || 'Professional Overview'}
                </h2>
                <p className="summary-subtitle text-muted">
                  Building modern web experiences with passion and precision
                </p>
              </div>
              <ul className="summary-bullets">
                {(() => {
                  const items = (profile.expertise || []).slice(0, 3)
                  const iconMap = {
                    'Front-End Platforms': FaLayerGroup,
                    'Design Systems & UX': FaUniversalAccess,
                    'Delivery & Tooling': FaCogs,
                  }
                  return items.map((item) => {
                    const Icon = iconMap[item.label] || FaLayerGroup
                    return (
                      <li key={item.label} className="summary-bullet-item">
                        <Icon className="summary-bullet-icon" />
                        <span>{item.label}</span>
                      </li>
                    )
                  })
                })()}
              </ul>
              <div className="summary-stats">
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="summary-stat">
                    <span className="summary-stat__value">{stat.value}</span>
                    <span className="summary-stat__label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="summary-actions">
                <div className="summary-inline-links d-inline-flex flex-wrap align-items-center">
                  <a
                    href={resumePdf}
                    download
                    aria-label="Download resume PDF"
                    className="summary-inline-link"
                    onClick={() => trackClick('download', 'resume-download', 'Save résumé')}
                  >
                    <FaDownload className="summary-inline-link__icon" />
                    <span>{sectionsUI.saveResume || 'Save résumé'}</span>
                  </a>
                  <span className="summary-inline-sep">·</span>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault()
                      trackClick('button', 'email-copy', 'Email')
                      try {
                        await navigator.clipboard.writeText(profile.contact.email)
                        setEmailCopied(true)
                        setTimeout(() => setEmailCopied(false), 2000)
                      } catch (err) {
                        window.location.href = `mailto:${profile.contact.email}`
                      }
                    }}
                    aria-label={`Copy email address ${profile.contact.email}`}
                    className="summary-inline-link summary-inline-link--tooltip"
                    data-tooltip={emailCopied ? 'Copied!' : profile.contact.email}
                  >
                    <FaEnvelope className="summary-inline-link__icon" />
                    <span>{emailCopied ? 'Copied!' : 'Email'}</span>
                  </button>
                  <span className="summary-inline-sep">·</span>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault()
                      trackClick('button', 'phone-copy', 'Phone')
                      try {
                        await navigator.clipboard.writeText(profile.contact.phone)
                        setPhoneCopied(true)
                        setTimeout(() => setPhoneCopied(false), 2000)
                      } catch (err) {
                        window.location.href = `tel:${profile.contact.phone.replace(/[^0-9]/g, '')}`
                      }
                    }}
                    aria-label={`Copy phone number ${profile.contact.phone}`}
                    className="summary-inline-link summary-inline-link--tooltip"
                    data-tooltip={phoneCopied ? 'Copied!' : profile.contact.phone}
                  >
                    <FaPhone className="summary-inline-link__icon" />
                    <span>{phoneCopied ? 'Copied!' : 'Phone'}</span>
                  </button>
                  <span className="summary-inline-sep">·</span>
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="summary-inline-link"
                    onClick={() => trackClick('link', 'linkedin-link', 'LinkedIn')}
                  >
                    <FaLinkedin className="summary-inline-link__icon" />
                    <span>LinkedIn</span>
                  </a>
                  <span className="summary-inline-sep">·</span>
                  <a
                    href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="summary-inline-link"
                    onClick={() => trackClick('link', 'github-link', 'GitHub')}
                >
                    <FaGithub className="summary-inline-link__icon" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      <section id="experience" className="landing-experience py-5">
        <Container>
          <div className="experience-heading text-center">
            <h2>{sectionsUI.experienceTitle || 'My work experience'}</h2>
            <p className="text-muted">
              {sectionsUI.experienceDescription ||
                "Here's a look at how I help teams build great products while working with others and staying active."}
            </p>
          </div>
          <div className="experience-grid">
            {resume.experience.map((role, index) => {
              const companyLogo = getCompanyLogo(role.company)

              return (
                <Card 
                  key={`${role.company}-${index}`}
                  className="experience-card border-0 shadow-sm h-100"
                >
                  <Card.Body className="p-5">
                    <div className="experience-card-header">
                      <div className="experience-company-logo">
                        {companyLogo && (
                          <img 
                            src={companyLogo} 
                            alt={`${role.company} logo`}
                            className="company-logo-img"
                          />
                        )}
                      </div>
                      <div className="experience-card-info">
                        <div className="experience-company-header">
                          <h3 className="experience-company">{role.company}</h3>
                          <div className="experience-meta-box">
                            <span className="experience-period">{role.period}</span>
                          </div>
                        </div>
                        <div className="experience-role-meta">
                          <p className="experience-role">{role.role}</p>
                          <span className="experience-location">{role.location}</span>
                        </div>
                        <p className="experience-tagline">{role.tagline}</p>
                        <p className="experience-description">{role.description}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="projects" className="landing-projects py-5">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <div className="projects-heading text-center">
                <h2 className="section-title">
                  {sectionsUI.featuredProject || 'Featured Work'}
                </h2>
              </div>
            </Col>
          </Row>
          <Row className="g-4 justify-content-center">
            {allProjects.map((p) => (
              <Col md={4} key={p.title}>
                <Card className="project-card h-100 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-2">{p.title}</h5>
                    <p className="text-muted mb-3">{p.description}</p>
                    <div className="project-tech">
                      {p.tech.map((t) => (
                        <span key={t} className="project-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 pt-0">
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={() => trackClick('link', `project-${p.title.toLowerCase().replace(/\s+/g, '-')}`, p.cta)}
                    >
                      <span>{p.cta}</span>
                      <FaExternalLinkAlt className="project-link__icon" />
                    </a>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="toolkit" className="landing-skills py-5">
        <Container>
          <Row className="gy-4 align-items-stretch">
            <Col xs={12} lg={4}>
              <div className="toolkit-heading">
                <h2 className="section-title">
                  {sectionsUI.toolkitTitle || 'Technical toolkit'}
                </h2>
                <p className="text-muted">
                  {sectionsUI.toolkitDescription ||
                    'Pick a category to learn where I bring the most leverage—from frameworks and languages to testing and tooling.'}
                </p>
              </div>
              <div
                className="toolkit-nav"
                role="tablist"
                aria-label="Toolkit filter"
              >
                {skillCategories.map(({ category }) => {
                  const Icon = getToolkitIcon(category)
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={activeToolkit === category}
                      className={`toolkit-nav__btn ${
                        activeToolkit === category
                          ? 'toolkit-nav__btn--active'
                          : ''
                      }`}
                      onClick={() => setActiveToolkit(category)}
                    >
                      <span>
                        {Icon && <Icon className="toolkit-nav__icon" />}
                        {category}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Col>
            <Col xs={12} lg={8}>
              <Card className="toolkit-card border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                    <div>
                      <span className="toolkit-label">
                        {sectionsUI.currentlyViewing || 'Currently viewing'}
                      </span>
                      <h5 className="mb-1">{activeToolkit}</h5>
                    </div>
                  </div>
                  <p className="text-muted mb-4">
                    {toolkitDescriptions[activeToolkit] ||
                      'Skills that keep the work flowing smoothly.'}
                  </p>
                  <div className="toolkit-grid">
                    {(activeToolkitItems || []).map((item) => {
                      const Icon = getSkillIcon(item)
                      return (
                        <div
                          key={item}
                          className="toolkit-grid__item"
                          tabIndex={0}
                        >
                          <span className="toolkit-grid__icon">
                            {Icon ? <Icon /> : <FaCode />}
                          </span>
                          <span className="toolkit-grid__label">{item}</span>
                        </div>
                      )
                    })}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="certifications" className="landing-certifications py-4">
        <Container>
          <div className="certifications-heading text-center mb-4">
            <h2>{sectionsUI.certificationsTitle || 'Certifications & Skills'}</h2>
          </div>
          
          <Row className="g-2 certifications-list d-none d-md-flex">
            {resume.certifications &&
              resume.certifications.map((cert, index) => (
                <Col md={6} lg={4} key={index}>
                  <Card className="certification-card border-0 shadow-sm h-100">
                    <Card.Body className="p-2">
                      <div className="certification-item">
                        <div className="certification-icon">
                          <FaAward />
                        </div>
                        <div className="certification-content">
                          <h6 className="certification-name mb-1">{cert.name}</h6>
                          <p className="certification-issuer mb-2 small text-muted">
                            {cert.issuer}
                          </p>
                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="certification-link small"
                              onClick={() => trackClick('link', `cert-${cert.name.toLowerCase().replace(/\s+/g, '-')}`, 'View certificate')}
                            >
                              View certificate →
                            </a>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>

          <div className="certifications-accordion d-md-none">
            {resume.certifications &&
              resume.certifications.map((cert, index) => {
                const key = String(index)
                const isOpen = expandedCertification === key

                return (
                  <div
                    className={`certification-accordion-item ${isOpen ? 'certification-accordion-item--open' : ''}`}
                    key={index}
                  >
                    <button
                      type="button"
                      className="certification-accordion-toggle"
                      onClick={() => setExpandedCertification(isOpen ? '' : key)}
                      aria-expanded={isOpen}
                      aria-controls={`certification-panel-${key}`}
                    >
                      <div className="certification-accordion-header">
                        <div className="certification-accordion-icon">
                          <FaAward />
                        </div>
                        <div className="certification-accordion-title">
                          <span className="certification-accordion-name">{cert.name}</span>
                          <span className="certification-accordion-issuer">{cert.issuer}</span>
                        </div>
                      </div>
                      <FaChevronDown className="certification-accordion-chevron" />
                    </button>
                    <div
                      id={`certification-panel-${key}`}
                      className={`certification-accordion-body ${isOpen ? 'certification-accordion-body--open' : ''}`}
                    >
                      <div className="certification-accordion-content">
                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="certification-accordion-link"
                            onClick={() => trackClick('link', `cert-${cert.name.toLowerCase().replace(/\s+/g, '-')}`, 'View certificate')}
                          >
                            View certificate →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </Container>
      </section>

      <section id="education" className="landing-education py-5">
        <Container>
          <div className="education-heading text-center">
            <h2>{sectionsUI.educationTitle || 'Academic background'}</h2>
            <p className="text-muted">
              {sectionsUI.educationDescription ||
                'Foundational knowledge and continuous learning that shapes my approach to building great products.'}
            </p>
          </div>
          <div className="education-list">
            {resume.education &&
              resume.education.map((edu, index) => (
                <Card
                  key={index}
                  className="education-card border-0 shadow-sm mb-3"
                >
                  <Card.Body>
                    <div className="education-item">
                      <div className="education-icon">
                        <FaGraduationCap />
                      </div>
                      <div className="education-content">
                        <h5 className="education-degree">{edu.degree}</h5>
                        <p className="education-institution mb-1">
                          {edu.institution}
                          {edu.location && ` · ${edu.location}`}
                        </p>
                        <span className="education-period">
                          {edu.period}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </div>
        </Container>
      </section>

      <section id="connect" className="landing-personal py-5">
        <Container>
          <Row className="align-items-start gy-4">
            <Col lg={5}>
              <Card className="border-0 shadow-sm personal-card contact-card h-100">
                <Card.Body>
                  <h5 className="mb-3">
                    {sectionsUI.letsCollaborate || "Let's collaborate"}
                  </h5>
                  <p className="text-muted mb-4">
                    {sectionsUI.letsCollaborateDescription ||
                      `Based in ${profile.contact.location}. I partner with product and design teams to ship delightful experiences.`}
                  </p>
                  <div className="contact-links">
                    <Button
                      type="button"
                      onClick={() => {}}
                      variant="primary"
                      className="summary-btn w-100 mb-2 d-flex align-items-center justify-content-center"
                      aria-label="Get in Touch - Coming Soon"
                      disabled
                      style={{ opacity: 0.8, cursor: 'not-allowed' }}
                    >
                      <FaEnvelope className="me-2" />
                      <span>{sectionsUI.emailButton || 'Get in Touch'}</span>
                      <span 
                        className="ms-2 coming-soon-badge" 
                        style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: '600',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '999px',
                          background: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          letterSpacing: '0.5px',
                          lineHeight: '1',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        Coming Soon
                      </span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card className="border-0 shadow-sm personal-card h-100">
                <Card.Body>
                  <h5 className="mb-3">{personal.tagline}</h5>
                  <p className="personal-intro">{personal.intro || ''}</p>
                  <div className="personal-grid">
                    <div className="personal-block">
                      <h6>{sectionsUI.whatFuelsMe || 'What fuels me'}</h6>
                      <p className="personal-note">
                        {personal.whatFuelsMe || ''}
                      </p>
                    </div>
                    <div className="personal-block">
                      <h6>
                        {sectionsUI.guidingPrinciples || 'Guiding principles'}
                      </h6>
                      <ul className="personal-list">
                        {personal.principles.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <h6 className="mt-4 mb-2">
                    {sectionsUI.currentInterests || 'Current interests'}
                  </h6>
                  <div className="interest-chips">
                    {personal.interests.map((i) => (
                      <span key={i} className="interest-chip">
                        {i}
                      </span>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}
