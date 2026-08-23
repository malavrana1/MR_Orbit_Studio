import React, { Suspense, lazy, useState, useEffect } from 'react'
import { ReactTyped } from 'react-typed'
import { Container, Row, Col, Card } from 'react-bootstrap'
import './Home.css'
import './Home.dark.css'
import ProfileImage from '../../assets/images/Profile.jpg'
import {
  getSkillCategories,
  getHeroCoreStack,
  getHeroTypedTripleStrings,
  getSiteInfo,
} from '../../data/loaders'
import { getSkillMeta, getToolkitMeta } from '../../icons/skillIcons'
import { getActionMeta } from '../../icons/actionIcons'
import resumePdf from '../../assets/pdf/Malav-Rana-Frontend-Engineer.pdf'
import { translateSkillCategoryLabel } from '../../i18n/content'
import { getCompanyLogo, getCompanyInitials } from '../../data/companyLogos'
import { getProjectImage } from '../../data/projectImages'
import {
  syncPageMeta,
  syncStructuredData,
  scheduleIdleTask,
} from '../../data/pageMeta'
import { useLocalizedPortfolio } from '../../hooks/useLocalizedPortfolio'
import analyticsService from '../../services/analytics'
import { useTheme } from '../../context/ThemeContext'
import { usePageScroll } from '../../context/ScrollContext'
const ContactModal = lazy(() => import('../../components/ContactModal'))
const ResumeModal = lazy(() => import('../../components/ResumeModal'))

const skillCategories = getSkillCategories()
const siteInfo = getSiteInfo()
const heroTypedStrings = getHeroTypedTripleStrings()
const typedConfig = {
  typeSpeed: 58,
  backSpeed: 36,
  startDelay: 400,
  backDelay: 2200,
  ...((siteInfo.ui || {}).typed || {}),
}

const skillWall = getHeroCoreStack()

function ActionMark({ name, className = 'action-icon' }) {
  const { Icon, color, ink } = getActionMeta(name)
  return (
    <span
      className={className}
      style={{ '--skill-bg': color, '--skill-ink': ink }}
      aria-hidden
    >
      <Icon />
    </span>
  )
}

export default function Home() {
  const { portfolio, t, i18n } = useLocalizedPortfolio()
  const { profile, resume, personal, projects: allProjects } = portfolio
  const toolkitDescriptions = resume.skillDescriptions || {}

  const topExperience = resume.experience.slice(0, 2)
  const EXPERIENCE_PREVIEW = 3

  const [activeToolkit, setActiveToolkit] = useState(
    skillCategories[0]?.category || 'Frontend',
  )
  const [showContactModal, setShowContactModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showAllExperience, setShowAllExperience] = useState(false)
  const { showScrollTop } = usePageScroll()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const activeToolkitItems = skillCategories.find(
    (item) => item.category === activeToolkit,
  )?.items
  const visibleExperience = showAllExperience
    ? resume.experience
    : resume.experience.slice(0, EXPERIENCE_PREVIEW)
  const hasMoreExperience = resume.experience.length > EXPERIENCE_PREVIEW

  const scrollToTop = () => {
    analyticsService.trackClick('button', 'scroll_to_top', 'Scroll to Top')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sharePortfolio = async () => {
    analyticsService.trackClick('button', 'share_portfolio', 'Share Portfolio')
    const shareData = {
      title: t('connect.shareTitle', { name: profile.name }),
      text: t('connect.shareText', { name: profile.name }),
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
        alert(t('connect.copiedAlert'))
        analyticsService.trackClick(
          'button',
          'share_portfolio_copy',
          'Share Portfolio - Copy',
        )
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href)
        alert(t('connect.copiedAlert'))
        analyticsService.trackClick(
          'button',
          'share_portfolio_copy',
          'Share Portfolio - Copy',
        )
      }
    }
  }
  useEffect(() => {
    return scheduleIdleTask(() => syncPageMeta(profile, t))
  }, [profile, t, i18n.language])

  useEffect(() => {
    return scheduleIdleTask(() => syncStructuredData(profile, skillCategories))
  }, [profile, skillCategories])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="landing-page" id="main-content" tabIndex={-1}>
      <div className="animated-background" />
      <header className="landing-hero" id="home">
        <div className="landing-hero__background-image" />
        <div className="landing-hero__overlay" />
        <div className="landing-hero__pattern" />
        <Container className="position-relative">
          <Row className="gy-2">
            <Col lg={7}>
              <div className="hero-profile">
                <div className="hero-profile-frame">
                  <img
                    src={ProfileImage}
                    alt={profile.name}
                    className="hero-profile-image"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    width={216}
                    height={216}
                  />
                </div>
              </div>
              <div className="hero-content-wrapper">
                <h1 className="hero-title">
                  <span className="hero-greeting">{t('hero.greeting')}</span>{' '}
                  <span className="hero-name">{profile.name}.</span>
                </h1>
                {heroTypedStrings.length > 0 ? (
                  <>
                    <span className="visually-hidden">
                      {heroTypedStrings.join('. ')}
                    </span>
                    <div className="hero-typed-wrapper" aria-hidden="true">
                      <ReactTyped
                        className="hero-typed"
                        strings={heroTypedStrings}
                        typeSpeed={typedConfig.typeSpeed}
                        backSpeed={typedConfig.backSpeed}
                        startDelay={typedConfig.startDelay}
                        backDelay={typedConfig.backDelay}
                        smartBackspace
                        shuffle={false}
                        loop
                        showCursor
                        cursorChar="|"
                      />
                    </div>
                  </>
                ) : null}
                <div className="hero-meta">
                  <p className="hero-role">
                    {profile.headline || t('hero.headlineFallback')}
                  </p>
                </div>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="hero-action hero-action--ghost"
                    onClick={() => setShowResumeModal(true)}
                  >
                    <ActionMark name="resume" />
                    {t('hero.resumeCta')}
                  </button>
                  <button
                    type="button"
                    className="hero-action hero-action--ghost"
                    onClick={() => {
                      analyticsService.trackClick(
                        'button',
                        'hero_open_contact',
                        'Contact',
                      )
                      setShowContactModal(true)
                    }}
                  >
                    <ActionMark name="contact" />
                    {t('hero.contactCta')}
                  </button>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <Card className="hero-skill-card border-0">
                <Card.Body>
                  <div className="skill-card-header">
                    <div>
                      <h5 className="mb-1">{t('hero.skillCardTitle')}</h5>
                      <p className="text-muted mb-0">
                        {t('hero.skillCardDescription')}
                      </p>
                    </div>
                    <ActionMark
                      name="craft"
                      className="action-icon action-icon--lg"
                    />
                  </div>
                  <div className="skill-icon-grid">
                    {skillWall.map((skill) => {
                      const { Icon, color, ink } = getSkillMeta(skill)
                      return (
                        <div className="skill-icon-tile" key={skill}>
                          <span
                            className="skill-icon-tile__icon"
                            style={{ '--skill-bg': color, '--skill-ink': ink }}
                          >
                            <Icon />
                          </span>
                          <span>{skill}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="hero-experience-quick mt-3">
                    <h6 className="mb-2 fw-bold hero-experience-quick__title">
                      {t('hero.recentTeams')}
                    </h6>
                    <ul className="hero-experience-list">
                      {topExperience.map((role) => (
                        <li key={role.companyKey || role.company}>
                          <div className="hero-experience-list__content">
                            <span className="hero-experience-list__title">
                              {role.role}
                            </span>
                            <span className="hero-experience-list__company">
                              {role.company}
                            </span>
                          </div>
                          <span className="hero-experience-list__period">
                            <ActionMark
                              name="calendar"
                              className="action-icon action-icon--sm"
                            />
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
          <div className="summary-header text-center mb-2">
            <h2 className="section-title mb-2">{t('summary.title')}</h2>
            <p className="summary-subtitle lead text-muted mx-auto">
              {profile.summary?.[0] || t('summary.subtitleFallback')}
            </p>
          </div>

          <div className="professional-highlights">
            <div className="highlight-item">
              <ActionMark name="craft" className="action-icon action-icon--lg" />
              <div className="highlight-content">
                <h6 className="highlight-title">{t('summary.highlight1Title')}</h6>
                <p className="highlight-text">{t('summary.highlight1Text')}</p>
              </div>
            </div>
            <div className="highlight-item">
              <ActionMark name="team" className="action-icon action-icon--lg" />
              <div className="highlight-content">
                <h6 className="highlight-title">{t('summary.highlight2Title')}</h6>
                <p className="highlight-text">{t('summary.highlight2Text')}</p>
              </div>
            </div>
            <div className="highlight-item">
              <ActionMark
                name="quality"
                className="action-icon action-icon--lg"
              />
              <div className="highlight-content">
                <h6 className="highlight-title">{t('summary.highlight3Title')}</h6>
                <p className="highlight-text">{t('summary.highlight3Text')}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="experience" className="landing-experience">
        <Container>
          <div className="experience-heading text-center mb-2">
            <h2>{t('experience.title')}</h2>
          </div>

          <div className="experience-grid">
            {visibleExperience.map((role, index) => {
              const companyLogo = getCompanyLogo(role.companyKey || role.company)

              return (
                <Card
                  key={`${role.companyKey || role.company}-${index}`}
                  className="experience-card border-0 shadow-sm h-100"
                >
                  <Card.Body>
                    <div className="experience-card-header">
                      <div
                        className={`experience-company-logo ${
                          companyLogo ? '' : 'experience-company-logo--fallback'
                        }`}
                        aria-hidden={companyLogo ? undefined : true}
                      >
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt={t('experience.logoAlt', {
                              company: role.company,
                            })}
                            className="company-logo-img"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span className="company-logo-initials">
                            {getCompanyInitials(role.company)}
                          </span>
                        )}
                      </div>
                      <div className="experience-card-info">
                        <h3 className="experience-company">{role.company}</h3>
                      </div>
                    </div>
                    {role.tagline && (
                      <p className="experience-tagline">{role.tagline}</p>
                    )}
                    <div className="experience-role-meta">
                      <p className="experience-role">{role.role}</p>
                      <div className="experience-meta-box">
                        <span className="experience-period">
                          <ActionMark
                            name="calendar"
                            className="action-icon action-icon--sm"
                          />
                          {role.period}
                        </span>
                        {role.location && (
                          <span className="experience-location">
                            <ActionMark
                              name="location"
                              className="action-icon action-icon--sm"
                            />
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
          {hasMoreExperience ? (
            <div className="experience-more">
              <button
                type="button"
                className="experience-more__btn"
                onClick={() => {
                  const next = !showAllExperience
                  setShowAllExperience(next)
                  analyticsService.trackClick(
                    'button',
                    next ? 'experience_show_more' : 'experience_show_less',
                    next ? 'Show more experience' : 'Show less experience',
                  )
                }}
              >
                {showAllExperience
                  ? t('experience.showLess')
                  : t('experience.showMore')}
              </button>
            </div>
          ) : null}        </Container>
      </section>

      <section id="projects" className="landing-projects">
        <Container>
          <div className="projects-heading text-center mb-2">
            <h2 className="section-title">
              {t('projects.title', { defaultValue: 'Featured Projects' })}
            </h2>
          </div>
          <Row className="g-2 justify-content-center">
            {allProjects.map((p) => {
              const preview = getProjectImage(p.id)
              const outcome = p.outcome || p.description

              return (
                <Col md={4} key={p.id || p.title}>
                  <article className="project-card h-100 border-0 shadow-sm">
                    {preview ? (
                      <div className="project-card__media">
                        <img
                          src={preview}
                          alt={t('projects.imageAlt', { title: p.title })}
                          className="project-card__image"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : null}
                    <div className="project-card__body">
                      <h3 className="project-card__title">{p.title}</h3>
                      <p className="project-card__outcome">{outcome}</p>
                      <div className="project-tech">
                        {p.tech.map((tech) => {
                          const { Icon, color, ink } = getSkillMeta(tech)
                          return (
                            <span key={tech} className="project-chip">
                              <span
                                className="project-chip__icon"
                                style={{
                                  '--skill-bg': color,
                                  '--skill-ink': ink,
                                }}
                              >
                                <Icon />
                              </span>
                              {tech}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <div className="project-card__footer">
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          onClick={() =>
                            analyticsService.trackExternalLink(p.liveUrl, p.title)
                          }
                        >
                          <ActionMark
                            name="live"
                            className="action-icon action-icon--sm"
                          />
                          <span>{t('projects.live')}</span>
                        </a>
                      ) : null}
                      {p.githubUrl ? (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          onClick={() =>
                            analyticsService.trackExternalLink(
                              p.githubUrl,
                              p.title,
                            )
                          }
                        >
                          <ActionMark
                            name="github"
                            className="action-icon action-icon--sm"
                          />
                          <span>{t('projects.github')}</span>
                        </a>
                      ) : null}
                    </div>
                  </article>
                </Col>
              )
            })}
          </Row>
        </Container>
      </section>

      <section id="toolkit" className="landing-skills">
        <Container>
          <Row className="gy-2 align-items-stretch">
            <Col xs={12} lg={4}>
              <div className="toolkit-heading">
                <h2 className="section-title">
                  {t('toolkit.title')}
                </h2>
                <p className="text-muted">
                  {t('toolkit.description')}
                </p>
                <p className="toolkit-hint">{t('toolkit.tapHint')}</p>
              </div>
              <div
                className="toolkit-nav"
                role="tablist"
                aria-label={t('toolkit.filterAria')}
              >
                {skillCategories.map(({ category }) => {
                  const { Icon, color, ink } = getToolkitMeta(category)
                  const tabId = `toolkit-tab-${category}`
                  const panelId = 'toolkit-panel'
                  const selected = activeToolkit === category
                  return (
                    <button
                      key={category}
                      type="button"
                      id={tabId}
                      role="tab"
                      aria-selected={selected}
                      aria-controls={panelId}
                      tabIndex={selected ? 0 : -1}
                      className={`toolkit-nav__btn ${
                        selected ? 'toolkit-nav__btn--active' : ''
                      }`}
                      onClick={() => {
                        analyticsService.trackClick(
                          'button',
                          `toolkit_${category}`,
                          category,
                        )
                        setActiveToolkit(category)
                        if (
                          typeof window !== 'undefined' &&
                          window.matchMedia('(max-width: 991px)').matches
                        ) {
                          window.requestAnimationFrame(() => {
                            document
                              .getElementById('toolkit-panel')
                              ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                              })
                          })
                        }
                      }}
                    >
                      <span
                        className="toolkit-nav__icon-wrap"
                        style={{ '--skill-bg': color, '--skill-ink': ink }}
                      >
                        <Icon className="toolkit-nav__icon" />
                      </span>
                      <span className="toolkit-nav__label">
                        {translateSkillCategoryLabel(t, category)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Col>
            <Col xs={12} lg={8}>
              <Card className="toolkit-card border-0 shadow-sm h-100">
                <Card.Body
                  id="toolkit-panel"
                  role="tabpanel"
                  aria-labelledby={`toolkit-tab-${activeToolkit}`}
                >
                  <h5 className="mb-2">
                    {translateSkillCategoryLabel(t, activeToolkit)}
                  </h5>
                  <p className="text-muted mb-2">
                    {toolkitDescriptions[activeToolkit] ||
                      t('toolkit.defaultDescription')}
                  </p>
                  <div className="toolkit-grid" key={activeToolkit}>
                    {(activeToolkitItems || []).map((item) => {
                      const { Icon, color, ink } = getSkillMeta(item)
                      return (
                        <div key={item} className="toolkit-grid__item">
                          <span
                            className="toolkit-grid__icon"
                            style={{ '--skill-bg': color, '--skill-ink': ink }}
                          >
                            <Icon />
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

      <section id="education" className="landing-credentials">
        <Container>
          <div className="credentials-heading text-center mb-2">
            <h2 className="section-title">{t('credentials.education')}</h2>
          </div>
          <div className="education-grid">
            {(resume.education || []).map((edu, index) => {
              const degree = (edu.degree || '').toLowerCase()
              const mark = degree.includes('bachelor')
                ? 'BS'
                : degree.includes('master')
                  ? 'MS'
                  : degree.includes('associate')
                    ? 'AS'
                    : degree.includes('phd') || degree.includes('doctor')
                      ? 'PhD'
                      : 'ED'

              return (
                <article
                  key={`${edu.institution}-${index}`}
                  className="education-card"
                >
                  <div className="education-card__mark" aria-hidden>
                    <span>{mark}</span>
                  </div>
                  <div className="education-card__body">
                    <p className="education-card__degree">{edu.degree}</p>
                    <h3 className="education-card__school">{edu.institution}</h3>
                    <div className="education-card__meta">
                      {edu.location ? (
                        <span className="education-card__chip">
                          <ActionMark
                            name="location"
                            className="action-icon action-icon--sm"
                          />
                          {edu.location}
                        </span>
                      ) : null}
                      {edu.period ? (
                        <span className="education-card__chip">
                          <ActionMark
                            name="calendar"
                            className="action-icon action-icon--sm"
                          />
                          {edu.period}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="about" className="landing-personal">
        <Container>
          <div className="text-center mb-2">
            <h2 className="section-title">
              {personal.tagline || t('about.titleFallback')}
            </h2>
          </div>
          <Row className="g-2 justify-content-center">
            <Col lg={6}>
              <Card className="personal-card border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-2 landing-accent-heading">
                    {t('about.whatEnjoy')}
                  </h5>
                  <p className="text-muted mb-2 personal-copy">
                    {personal.intro}
                  </p>
                  <div className="interest-chips">
                    {(personal.interests || []).map((interest) => (
                      <span key={interest.id} className="interest-chip">
                        <ActionMark
                          name={interest.id}
                          className="action-icon action-icon--sm"
                        />
                        {interest.label}
                      </span>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="personal-card border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-2 landing-accent-heading">
                    {t('about.whatLikeWork')}
                  </h5>
                  <p className="text-muted mb-2 personal-copy">
                    {personal.whatFuelsMe}
                  </p>
                  {personal.principles && personal.principles.length > 0 && (
                    <div className="principles-block">
                      <h6 className="principles-heading">
                        {t('about.principles')}
                      </h6>
                      <ul className="personal-list">
                        {personal.principles.map((principle, index) => (
                          <li key={index}>{principle}</li>
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
          <Row className="align-items-center gy-2">
            <Col lg={8} className="mx-auto">
              <Card className="border-0 shadow-sm personal-card contact-card">
                <Card.Body className="text-center">
                  <h2 className="mb-2 contact-card__title">
                    {t('connect.title')}
                  </h2>
                  <p className="text-muted mb-2">
                    {t('connect.description')}
                  </p>
                  <div className="contact-actions">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      title={t('connect.resumePdfTitle')}
                      onClick={() => setShowResumeModal(true)}
                    >
                      <ActionMark name="resume" />
                      {t('connect.resumeDownload')}
                    </button>
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                      title={t('connect.githubProfileTitle')}
                      onClick={() =>
                        analyticsService.trackSocialClick(
                          'github',
                          profile.social.github,
                        )
                      }
                    >
                      <ActionMark name="github" />
                      {t('connect.github')}
                    </a>
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                      title={t('connect.linkedinProfileTitle')}
                      onClick={() =>
                        analyticsService.trackSocialClick(
                          'linkedin',
                          profile.social.linkedin,
                        )
                      }
                    >
                      <ActionMark name="linkedin" />
                      {t('connect.linkedin')}
                    </a>
                    <a
                      href={
                        profile.contact?.email
                          ? `mailto:${profile.contact.email}`
                          : undefined
                      }
                      className="btn btn-outline-primary"
                      title={t('connect.emailTitle')}
                      onClick={() =>
                        analyticsService.trackClick(
                          'link',
                          'mailto_connect',
                          'Email',
                        )
                      }
                    >
                      <ActionMark name="email" />
                      {t('connect.email')}
                    </a>
                    <button
                      type="button"
                      onClick={sharePortfolio}
                      className="btn btn-outline-primary"
                      title={t('connect.sharePortfolioTitle')}
                    >
                      <ActionMark name="share" />
                      {t('connect.share')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        analyticsService.trackClick(
                          'button',
                          'open_contact_modal',
                          'Contact',
                        )
                        setShowContactModal(true)
                      }}
                      className="btn btn-outline-primary"
                      title={t('connect.contactFormTitle')}
                    >
                      <ActionMark name="contact" />
                      {t('connect.contact')}
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <button
        type="button"
        className="theme-toggle-floating"
        onClick={toggleDarkMode}
        aria-label={
          isDarkMode ? t('theme.switchToLight') : t('theme.switchToDark')
        }
        title={isDarkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
      >
        <ActionMark name={isDarkMode ? 'sun' : 'moon'} />
      </button>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label={t('floating.scrollTop')}
          title={t('floating.backToTop')}
        >
          <ActionMark name="top" />
        </button>
      )}

      {showResumeModal && (
        <Suspense fallback={null}>
          <ResumeModal
            show={showResumeModal}
            onClose={() => setShowResumeModal(false)}
            src={resumePdf}
          />
        </Suspense>
      )}
      {showContactModal && (
        <Suspense fallback={null}>
          <ContactModal
            show={showContactModal}
            onClose={() => setShowContactModal(false)}
            toEmail={profile.contact?.email || ''}
          />
        </Suspense>
      )}
    </div>
  )
}
