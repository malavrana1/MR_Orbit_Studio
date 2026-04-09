import React, { Suspense, lazy, useState, useEffect } from 'react'
import { ReactTyped } from 'react-typed'
import { Container, Row, Col, Card } from 'react-bootstrap'
import {
  FaRegLightbulb,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaGraduationCap,
  FaAward,
  FaExternalLinkAlt,
  FaUsers,
  FaCheckCircle,
  FaArrowUp,
  FaEnvelope,
  FaShareAlt,
  FaFilePdf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoon,
  FaSun,
} from 'react-icons/fa'
import './LandingPage.css'
import ProfileImage from '../../assets/images/Profile.jpg'
import { getProfile } from '../../utils/profile'
import { getResume, getSkillCategories } from '../../utils/resume'
import { getProjects } from '../../utils/projects'
import { getPersonal } from '../../utils/personal'
import { getSkillIcon } from '../../utils/skillIcons'
import resumePdf from '../../assets/pdf/Malav-Rana-Frontend-Engineer.pdf'
import { getSiteInfo } from '../../utils/site'
import { getToolkitIcon } from '../../utils/toolkitIcons'
import { observeScrollAnimations } from '../../utils/scrollAnimations'
import analyticsService from '../../services/analytics'
import { useTheme } from '../../context/ThemeContext'
import { usePageScroll } from '../../context/ScrollContext'
import fusionHealthLogo from '../../assets/images/logos/fusion-health.png'
import kisweLogo from '../../assets/images/logos/kiswe.png'
import genslerLogo from '../../assets/images/logos/gensler.png'
import cignaLogo from '../../assets/images/logos/cigna.png'
import atmiyaLogo from '../../assets/images/logos/atmiya_care_charity.png'

const ContactModal = lazy(() => import('../../components/ContactModal'))

const scheduleIdleTask = (task, timeout = 500) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const taskId = window.requestIdleCallback(task, { timeout })
    return () => window.cancelIdleCallback(taskId)
  }
  const timeoutId = window.setTimeout(task, 0)
  return () => window.clearTimeout(timeoutId)
}

const getCompanyLogo = (companyName) => {
  const logoMap = {
    'Fusion Health': fusionHealthLogo,
    Kiswe: kisweLogo,
    Gensler: genslerLogo,
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
  const flatSkills = skillCategories.flatMap((group) => group.items)
  const skillWall = Array.from(new Set(flatSkills)).slice(0, 8)
  const topExperience = resume.experience.slice(0, 2)
  const hasCertifications =
    Array.isArray(resume.certifications) && resume.certifications.length > 0

  const [activeToolkit, setActiveToolkit] = useState(
    skillCategories[0]?.category || 'Frontend',
  )
  const [showContactModal, setShowContactModal] = useState(false)
  const { showScrollTop } = usePageScroll()
  const { isDarkMode, toggleDarkMode: flipTheme } = useTheme()

  const toggleDarkMode = () => {
    analyticsService.trackClick(
      'button',
      'toggle_dark_mode',
      isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    )
    flipTheme()
  }
  const activeToolkitItems = skillCategories.find(
    (item) => item.category === activeToolkit,
  )?.items

  const toolkitDescriptions = resume.skillDescriptions || {}
  const ui = siteInfo.ui || {}
  const heroUI = ui.hero || {}
  const sectionsUI = ui.sections || {}
  const typedConfig = ui.typed || { typeSpeed: 45, backSpeed: 22 }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        document
          .getElementById('projects')
          ?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        document
          .getElementById('experience')
          ?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        document
          .getElementById('connect')
          ?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const scrollToTop = () => {
    analyticsService.trackClick('button', 'scroll_to_top', 'Scroll to Top')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sharePortfolio = async () => {
    analyticsService.trackClick('button', 'share_portfolio', 'Share Portfolio')
    const shareData = {
      title: `${profile.name} - Portfolio`,
      text: `Check out ${profile.name}'s portfolio`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        analyticsService.trackClick(
          'button',
          'share_portfolio_success',
          'Share Portfolio - Success',
        )
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Portfolio link copied to clipboard!')
        analyticsService.trackClick(
          'button',
          'share_portfolio_copy',
          'Share Portfolio - Copy',
        )
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href)
        alert('Portfolio link copied to clipboard!')
        analyticsService.trackClick(
          'button',
          'share_portfolio_copy',
          'Share Portfolio - Copy',
        )
      }
    }
  }
  useEffect(() => {
    let cleanupObserver = () => {}
    const cancelIdle = scheduleIdleTask(() => {
      cleanupObserver = observeScrollAnimations()
    })

    return () => {
      cancelIdle()
      cleanupObserver()
    }
  }, [])

  useEffect(() => {
    const updateMetaTags = () => {
      document.title = `${profile.name} - ${profile.headline || 'Frontend Engineer Portfolio'}`

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          profile.summary?.[0] || 'Frontend Engineer Portfolio',
        )
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = profile.summary?.[0] || 'Frontend Engineer Portfolio'
        document.head.appendChild(meta)
      }

      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', `${profile.name} - Portfolio`)
      } else {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:title')
        meta.content = `${profile.name} - Portfolio`
        document.head.appendChild(meta)
      }

      const ogDescription = document.querySelector(
        'meta[property="og:description"]',
      )
      if (ogDescription) {
        ogDescription.setAttribute(
          'content',
          profile.summary?.[0] || 'Frontend Engineer Portfolio',
        )
      } else {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:description')
        meta.content = profile.summary?.[0] || 'Frontend Engineer Portfolio'
        document.head.appendChild(meta)
      }

      const ogImage = document.querySelector('meta[property="og:image"]')
      if (!ogImage) {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:image')
        meta.content = `${window.location.origin}${ProfileImage}`
        document.head.appendChild(meta)
      }

      const ogUrl = document.querySelector('meta[property="og:url"]')
      if (!ogUrl) {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:url')
        meta.content = window.location.href
        document.head.appendChild(meta)
      }

      const twitterCard = document.querySelector('meta[name="twitter:card"]')
      if (!twitterCard) {
        const meta = document.createElement('meta')
        meta.name = 'twitter:card'
        meta.content = 'summary_large_image'
        document.head.appendChild(meta)
      }
    }

    const cancelIdle = scheduleIdleTask(updateMetaTags)
    return cancelIdle
  }, [profile])

  useEffect(() => {
    const addStructuredData = () => {
      const existingScript = document.getElementById('structured-data')
      if (existingScript) {
        existingScript.remove()
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        jobTitle: 'Frontend Engineer',
        description: profile.summary?.[0],
        url: profile.contact.website || window.location.href,
        email: profile.contact.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: profile.contact.location,
        },
        sameAs: [profile.social.linkedin, profile.social.github],
        knowsAbout: skillCategories.flatMap((cat) => cat.items),
      }

      const script = document.createElement('script')
      script.id = 'structured-data'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    const cancelIdle = scheduleIdleTask(addStructuredData)
    return cancelIdle
  }, [profile, skillCategories])

  return (
    <div className="landing-page" id="home">
      <div className="animated-background" />
      <header
        className="landing-hero d-flex align-items-center"
        id="main-content"
      >
        <div className="landing-hero__background-image" />
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
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
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
                  {profile.headline ||
                    'Frontend Engineer | React • Angular • Vue Specialist'}
                </p>
              </div>
            </Col>
            <Col lg={5}>
              <Card className="hero-skill-card border-0 shadow-lg">
                <Card.Body>
                  <div className="skill-card-header">
                    <div>
                      <h5 className="mb-1">
                        {heroUI.skillCard?.title || 'Tech Stack'}
                      </h5>
                      <p className="text-muted mb-0">
                        {heroUI.skillCard?.description ||
                          'Technologies I use to build modern web applications'}
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
                    <h6
                      className="mb-3 fw-bold"
                      style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}
                    >
                      {heroUI.skillCard?.recentTeams || 'Recent Experience'}
                    </h6>
                    <ul className="hero-experience-list">
                      {topExperience.map((role) => (
                        <li key={role.company}>
                          <div className="hero-experience-list__content">
                            <span className="hero-experience-list__title">
                              {role.role}
                            </span>
                            <span className="hero-experience-list__company">
                              {role.company}
                            </span>
                          </div>
                          <span className="hero-experience-list__period">
                            <FaCalendarAlt className="hero-experience-icon" />
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

      <section id="summary" className="landing-summary">
        <Container>
          <div
            className="summary-header text-center mb-4"
            data-animate="fade-up"
          >
            <h2 className="section-title mb-2">
              {sectionsUI.professionalSummary || 'Professional Overview'}
            </h2>
            <p
              className="summary-subtitle lead text-muted mx-auto"
              style={{ maxWidth: '700px' }}
            >
              {profile.summary?.[0] ||
                'Building modern web experiences with passion and precision'}
            </p>
          </div>

          <div className="professional-highlights" data-animate="fade-up">
            <div className="highlight-item">
              <FaCode className="highlight-icon" />
              <div className="highlight-content">
                <h6 className="highlight-title">Modern frontend stacks</h6>
                <p className="highlight-text">
                  React, Angular, Next.js, and TypeScript—from enterprise
                  dashboards to high-traffic SPAs
                </p>
              </div>
            </div>
            <div className="highlight-item">
              <FaUsers className="highlight-icon" />
              <div className="highlight-content">
                <h6 className="highlight-title">Team collaboration</h6>
                <p className="highlight-text">
                  Partnering with design, product, and backend to ship
                  accessible, maintainable features
                </p>
              </div>
            </div>
            <div className="highlight-item">
              <FaCheckCircle className="highlight-icon" />
              <div className="highlight-content">
                <h6 className="highlight-title">Quality & delivery</h6>
                <p className="highlight-text">
                  Automated testing, CI/CD, and performance tuning for reliable
                  releases
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="experience" className="landing-experience">
        <Container>
          <div
            className="experience-heading text-center mb-3"
            data-animate="fade-up"
          >
            <h2>{sectionsUI.experienceTitle || 'Experience'}</h2>
          </div>

          <div className="experience-grid">
            {resume.experience.slice(0, 3).map((role, index) => {
              const companyLogo = getCompanyLogo(role.company)

              return (
                <Card
                  key={`${role.company}-${index}`}
                  className="experience-card border-0 shadow-sm h-100"
                  data-animate="fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card.Body className="p-4">
                    <div className="experience-card-header">
                      <div className="experience-company-logo">
                        {companyLogo && (
                          <img
                            src={companyLogo}
                            alt={`${role.company} logo`}
                            className="company-logo-img"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                      <div className="experience-card-info">
                        <div className="experience-company-header">
                          <h3 className="experience-company">{role.company}</h3>
                        </div>
                      </div>
                    </div>
                    {role.tagline && (
                      <p className="experience-tagline">{role.tagline}</p>
                    )}
                    <div className="experience-role-meta">
                      <p className="experience-role">{role.role}</p>
                      <div className="experience-meta-box">
                        <span className="experience-period">
                          <FaCalendarAlt className="experience-icon" />
                          {role.period}
                        </span>
                        {role.location && (
                          <span className="experience-location">
                            <FaMapMarkerAlt className="experience-icon" />
                            {role.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="experience-description">{role.description}</p>
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="projects" className="landing-projects">
        <Container>
          <div
            className="projects-heading text-center mb-3"
            data-animate="fade-up"
          >
            <h2 className="section-title">
              {sectionsUI.featuredProject || 'Featured Projects'}
            </h2>
          </div>
          <Row className="g-4 justify-content-center">
            {allProjects.map((p, index) => (
              <Col md={4} key={p.title}>
                <Card
                  className="project-card h-100 border-0 shadow-sm"
                  data-animate="fade-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
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
                      onClick={() =>
                        analyticsService.trackExternalLink(p.link, p.title)
                      }
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

      <section id="toolkit" className="landing-skills">
        <Container>
          <Row className="gy-4 align-items-stretch">
            <Col xs={12} lg={4}>
              <div className="toolkit-heading" data-animate="fade-up">
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
                      onClick={() => {
                        analyticsService.trackClick(
                          'button',
                          `toolkit_${category}`,
                          category,
                        )
                        setActiveToolkit(category)
                      }}
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
              <Card
                className="toolkit-card border-0 shadow-sm h-100"
                data-animate="fade-up"
              >
                <Card.Body>
                  <h5 className="mb-3">{activeToolkit}</h5>
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

      <section id="credentials" className="landing-credentials">
        <Container>
          <div
            className="credentials-heading text-center mb-3"
            data-animate="fade-up"
          >
            <h2 className="section-title">
              {hasCertifications ? 'Education & Certifications' : 'Education'}
            </h2>
          </div>
          <Row className="g-4">
            <Col lg={hasCertifications ? 4 : 12} id="education">
              {resume.education &&
                resume.education.map((edu, index) => (
                  <Card
                    key={index}
                    className="credential-card border-0 shadow-sm mb-3"
                    data-animate="fade-up"
                  >
                    <Card.Body>
                      <div className="credential-item">
                        <div className="credential-icon education-icon-bg">
                          <FaGraduationCap />
                        </div>
                        <div className="credential-content">
                          <h6 className="credential-title">{edu.degree}</h6>
                          <h6 className="credential-institution mb-1">
                            {edu.institution}
                          </h6>
                          {edu.location && (
                            <p className="credential-subtitle mb-1 text-muted">
                              {edu.location}
                            </p>
                          )}
                          <span className="credential-period">
                            {edu.period}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
            </Col>
            {hasCertifications && (
              <Col lg={8} id="certifications">
                <div className="certifications-grid">
                  {resume.certifications.slice(0, 6).map((cert, index) => (
                    <Card
                      key={index}
                      className="credential-card certification-card-compact border-0 shadow-sm"
                      data-animate="fade-up"
                    >
                      <Card.Body className="p-3">
                        <div className="credential-item">
                          <div className="credential-icon certification-icon-bg">
                            <FaAward />
                          </div>
                          <div className="credential-content">
                            <h6 className="credential-title small">
                              {cert.name}
                            </h6>
                            <p className="credential-subtitle small text-muted mb-0">
                              {cert.issuer}
                            </p>
                          </div>
                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="credential-link"
                              aria-label={`View ${cert.name} certificate`}
                              onClick={() =>
                                analyticsService.trackExternalLink(
                                  cert.link,
                                  cert.name,
                                )
                              }
                            >
                              <FaExternalLinkAlt />
                            </a>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <section id="about" className="landing-personal">
        <Container>
          <div className="text-center mb-4" data-animate="fade-up">
            <h2 className="section-title">
              {personal.tagline || 'More about me'}
            </h2>
          </div>
          <Row className="g-4 justify-content-center">
            <Col lg={6}>
              <Card
                className="personal-card border-0 shadow-sm h-100"
                data-animate="fade-up"
              >
                <Card.Body className="p-4">
                  <h5 className="mb-3 landing-accent-heading">What I Enjoy</h5>
                  <p
                    className="text-muted mb-4"
                    style={{ lineHeight: '1.7', fontSize: '1rem' }}
                  >
                    {personal.intro}
                  </p>
                  <div className="interest-chips">
                    {personal.interests &&
                      personal.interests.map((interest, index) => (
                        <span key={index} className="interest-chip">
                          {interest}
                        </span>
                      ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card
                className="personal-card border-0 shadow-sm h-100"
                data-animate="fade-up"
              >
                <Card.Body className="p-4">
                  <h5 className="mb-3 landing-accent-heading">
                    What I Like About Work
                  </h5>
                  <p
                    className="text-muted mb-4"
                    style={{ lineHeight: '1.7', fontSize: '1rem' }}
                  >
                    {personal.whatFuelsMe}
                  </p>
                  {personal.principles && personal.principles.length > 0 && (
                    <div className="mt-4">
                      <h6
                        className="mb-3"
                        style={{
                          color: '#5c4033',
                          fontWeight: '600',
                          fontSize: '1rem',
                        }}
                      >
                        Principles
                      </h6>
                      <ul className="personal-list">
                        {personal.principles.map((principle, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem' }}>
                            {principle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="connect" className="landing-connect">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={8} className="mx-auto">
              <Card
                className="border-0 shadow-sm personal-card contact-card"
                data-animate="fade-up"
              >
                <Card.Body className="text-center p-4">
                  <h2 className="mb-4" style={{ color: '#3e2723' }}>
                    {sectionsUI.connectCardTitle ?? "Let's Connect"}
                  </h2>
                  <p className="text-muted mb-4">
                    {sectionsUI.connectCardDescription ??
                      "I'm open to new projects, collaboration, and professional opportunities. Pick a way to reach out or explore my resume and work."}
                  </p>
                  <div className="contact-actions">
                    <a
                      href={resumePdf}
                      download="Malav-Rana-Frontend-Engineer.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      title="Resume (PDF — open or save)"
                      onClick={() =>
                        analyticsService.trackDownload(
                          'Malav-Rana-Frontend-Engineer.pdf',
                          'pdf',
                        )
                      }
                    >
                      <FaFilePdf />
                      Resume
                    </a>
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                      title="View GitHub profile"
                      onClick={() =>
                        analyticsService.trackSocialClick(
                          'github',
                          profile.social.github,
                        )
                      }
                    >
                      <FaGithub />
                      GitHub
                    </a>
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                      title="Connect on LinkedIn"
                      onClick={() =>
                        analyticsService.trackSocialClick(
                          'linkedin',
                          profile.social.linkedin,
                        )
                      }
                    >
                      <FaLinkedin />
                      LinkedIn
                    </a>
                    <button
                      onClick={sharePortfolio}
                      className="btn btn-outline-primary"
                      title="Share portfolio"
                    >
                      <FaShareAlt />
                      Share
                    </button>
                    <button
                      onClick={() => {
                        analyticsService.trackClick(
                          'button',
                          'open_contact_modal',
                          'Contact',
                        )
                        setShowContactModal(true)
                      }}
                      className="btn btn-outline-primary"
                      title="Contact form"
                    >
                      <FaEnvelope />
                      Contact
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <button
        className="theme-toggle-floating"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <FaSun className="theme-toggle-icon" />
        ) : (
          <FaMoon className="theme-toggle-icon" />
        )}
      </button>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <FaArrowUp />
        </button>
      )}

      {showContactModal && (
        <Suspense fallback={null}>
          <ContactModal
            show={showContactModal}
            onClose={() => setShowContactModal(false)}
            toEmail={profile.contact.email}
          />
        </Suspense>
      )}
    </div>
  )
}
