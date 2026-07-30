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
import './Home.css'
import ProfileImage from '../../assets/images/Profile.jpg'
import {
  getSkillCategories,
  getHeroCoreStack,
  getHeroTypedTripleStrings,
  getSiteInfo,
} from '../../data/loaders'
import { getSkillIcon } from '../../icons/skillIcons'
import resumePdf from '../../assets/pdf/Malav-Rana-Frontend-Engineer.pdf'
import { translateSkillCategoryLabel } from '../../i18n/content'
import { getToolkitIcon } from '../../icons/toolkitIcons'
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

const skillWall = (() => {
  const heroCoreStack = getHeroCoreStack()
  if (heroCoreStack.length > 0) return heroCoreStack
  const flat = skillCategories.flatMap((g) => g.items)
  return Array.from(new Set(flat)).slice(0, 5)
})()

export default function Home() {
  const { portfolio, t, i18n } = useLocalizedPortfolio()
  const { profile, resume, personal, projects: allProjects } = portfolio
  const toolkitDescriptions = resume.skillDescriptions || {}

  const topExperience = resume.experience.slice(0, 2)
  const hasCertifications =
    Array.isArray(resume.certifications) && resume.certifications.length > 0

  const [activeToolkit, setActiveToolkit] = useState(
    skillCategories[0]?.category || 'Frontend',
  )
  const [showContactModal, setShowContactModal] = useState(false)
  const { showScrollTop } = usePageScroll()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const activeToolkitItems = skillCategories.find(
    (item) => item.category === activeToolkit,
  )?.items

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

  return (
    <div className="landing-page" id="main-content">
      <div className="animated-background" />
      <header className="landing-hero d-flex align-items-center" id="home">
        <div className="landing-hero__background-image" />
        <div className="landing-hero__overlay" />
        <div className="landing-hero__pattern" />
        <Container className="position-relative">
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <div className="hero-profile mb-4">
                <div className="hero-profile-frame">
                  <img
                    src={ProfileImage}
                    alt={profile.name}
                    className="hero-profile-image"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
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
                <p className="hero-role">
                  {profile.headline || t('hero.headlineFallback')}
                </p>
                {(profile.availability || t('hero.availabilityFallback')) && (
                  <p className="hero-availability">
                    <FaMapMarkerAlt className="hero-availability__icon" aria-hidden />
                    <span>
                      {profile.availability || t('hero.availabilityFallback')}
                    </span>
                  </p>
                )}
                <div className="hero-actions">
                  <a
                    href={resumePdf}
                    download="Malav-Rana-Frontend-Engineer.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-action hero-action--primary"
                    onClick={() =>
                      analyticsService.trackDownload(
                        'Malav-Rana-Frontend-Engineer.pdf',
                        'pdf',
                      )
                    }
                  >
                    <FaFilePdf aria-hidden />
                    {t('hero.resumeCta')}
                  </a>
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
                    <FaEnvelope aria-hidden />
                    {t('hero.contactCta')}
                  </button>
                </div>
              </div>
            </Col>            <Col lg={5}>
              <Card className="hero-skill-card border-0 shadow-lg">
                <Card.Body>
                  <div className="skill-card-header">
                    <div>
                      <h5 className="mb-1">{t('hero.skillCardTitle')}</h5>
                      <p className="text-muted mb-0">
                        {t('hero.skillCardDescription')}
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
          <div className="summary-header text-center mb-4">
            <h2 className="section-title mb-2">{t('summary.title')}</h2>
            <p
              className="summary-subtitle lead text-muted mx-auto"
              style={{ maxWidth: '700px' }}
            >
              {profile.summary?.[0] || t('summary.subtitleFallback')}
            </p>
          </div>

          <div className="professional-highlights">
            <div className="highlight-item">
              <FaCode className="highlight-icon" />
              <div className="highlight-content">
                <h6 className="highlight-title">{t('summary.highlight1Title')}</h6>
                <p className="highlight-text">{t('summary.highlight1Text')}</p>
              </div>
            </div>
            <div className="highlight-item">
              <FaUsers className="highlight-icon" />
              <div className="highlight-content">
                <h6 className="highlight-title">{t('summary.highlight2Title')}</h6>
                <p className="highlight-text">{t('summary.highlight2Text')}</p>
              </div>
            </div>
            <div className="highlight-item">
              <FaCheckCircle className="highlight-icon" />
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
          <div className="experience-heading text-center mb-3">
            <h2>{t('experience.title')}</h2>
          </div>

          <div className="experience-grid">
            {resume.experience.map((role, index) => {
              const companyLogo = getCompanyLogo(role.companyKey || role.company)

              return (
                <Card
                  key={`${role.companyKey || role.company}-${index}`}
                  className="experience-card border-0 shadow-sm h-100"
                >
                  <Card.Body className="p-4">
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
          <div className="projects-heading text-center mb-3">
            <h2 className="section-title">
              {t('projects.title', { defaultValue: 'Featured Projects' })}
            </h2>
          </div>
          <Row className="g-4 justify-content-center">
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
                        {p.tech.map((tech) => (
                          <span key={tech} className="project-chip">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="project-card__footer">
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link project-link--primary"
                          onClick={() =>
                            analyticsService.trackExternalLink(p.liveUrl, p.title)
                          }
                        >
                          <span>{t('projects.live')}</span>
                          <FaExternalLinkAlt className="project-link__icon" />
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
                          <FaGithub className="project-link__icon" aria-hidden />
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
          <Row className="gy-4 align-items-stretch">
            <Col xs={12} lg={4}>
              <div className="toolkit-heading">
                <h2 className="section-title">
                  {t('toolkit.title')}
                </h2>
                <p className="text-muted">
                  {t('toolkit.description')}
                </p>
              </div>
              <div
                className="toolkit-nav"
                role="tablist"
                aria-label={t('toolkit.filterAria')}
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
                        <Icon className="toolkit-nav__icon" />
                        {translateSkillCategoryLabel(t, category)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Col>
            <Col xs={12} lg={8}>
              <Card className="toolkit-card border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-3">
                    {translateSkillCategoryLabel(t, activeToolkit)}
                  </h5>
                  <p className="text-muted mb-4">
                    {toolkitDescriptions[activeToolkit] ||
                      t('toolkit.defaultDescription')}
                  </p>
                  <div className="toolkit-grid">
                    {(activeToolkitItems || []).map((item) => {
                      const Icon = getSkillIcon(item)
                      return (
                        <div key={item} className="toolkit-grid__item">
                          <span className="toolkit-grid__icon">
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
          <div className="credentials-heading text-center mb-3">
            <h2 className="section-title">
              {hasCertifications
                ? t('credentials.educationAndCerts')
                : t('credentials.education')}
            </h2>
          </div>
          <Row className="g-4">
            <Col lg={hasCertifications ? 4 : 12}>
              {resume.education &&
                resume.education.map((edu, index) => (
                  <Card
                    key={index}
                    className="credential-card border-0 shadow-sm mb-3"
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
                              aria-label={t('contact.certAria', {
                                name: cert.name,
                              })}
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
          <div className="text-center mb-4">
            <h2 className="section-title">
              {personal.tagline || t('about.titleFallback')}
            </h2>
          </div>
          <Row className="g-4 justify-content-center">
            <Col lg={6}>
              <Card className="personal-card border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <h5 className="mb-3 landing-accent-heading">
                    {t('about.whatEnjoy')}
                  </h5>
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
              <Card className="personal-card border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <h5 className="mb-3 landing-accent-heading">
                    {t('about.whatLikeWork')}
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
                        {t('about.principles')}
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
              <Card className="border-0 shadow-sm personal-card contact-card">
                <Card.Body className="text-center p-4">
                  <h2 className="mb-4" style={{ color: '#3e2723' }}>
                    {t('connect.title')}
                  </h2>
                  <p className="text-muted mb-4">
                    {t('connect.description')}
                  </p>
                  <div className="contact-actions">
                    <a
                      href={resumePdf}
                      download="Malav-Rana-Frontend-Engineer.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      title={t('connect.resumePdfTitle')}
                      onClick={() =>
                        analyticsService.trackDownload(
                          'Malav-Rana-Frontend-Engineer.pdf',
                          'pdf',
                        )
                      }
                    >
                      <FaFilePdf />
                      {t('connect.resumeDownload')}
                    </a>
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
                      <FaGithub />
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
                      <FaLinkedin />
                      {t('connect.linkedin')}
                    </a>
                    <button
                      type="button"
                      onClick={sharePortfolio}
                      className="btn btn-outline-primary"
                      title={t('connect.sharePortfolioTitle')}
                    >
                      <FaShareAlt />
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
                      <FaEnvelope />
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
        {isDarkMode ? (
          <FaSun className="theme-toggle-icon" />
        ) : (
          <FaMoon className="theme-toggle-icon" />
        )}
      </button>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label={t('floating.scrollTop')}
          title={t('floating.backToTop')}
        >
          <FaArrowUp />
        </button>
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
