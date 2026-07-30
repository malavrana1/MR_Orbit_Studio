import React, { Suspense, lazy, useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import {
  FaGithub,
  FaLinkedin,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaArrowUp,
  FaEnvelope,
  FaFilePdf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoon,
  FaSun,
} from 'react-icons/fa'
import './Home.css'
import ProfileImage from '../../assets/images/Profile.jpg'
import { getSkillCategories } from '../../data/loaders'
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

export default function Home() {
  const { portfolio, t, i18n } = useLocalizedPortfolio()
  const { profile, resume, personal, projects: allProjects } = portfolio

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

  const openContact = () => {
    analyticsService.trackClick('button', 'open_contact_modal', 'Contact')
    setShowContactModal(true)
  }

  useEffect(() => {
    return scheduleIdleTask(() => syncPageMeta(profile, t))
  }, [profile, t, i18n.language])

  useEffect(() => {
    return scheduleIdleTask(() => syncStructuredData(profile, skillCategories))
  }, [profile])

  return (
    <div className="landing-page" id="main-content" tabIndex={-1}>
      <header className="landing-hero d-flex align-items-center" id="home">
        <div className="landing-hero__background-image" />
        <div className="landing-hero__overlay" />
        <div className="landing-hero__pattern" />
        <Container className="position-relative">
          <Row className="align-items-center justify-content-center">
            <Col lg={8} className="text-lg-start text-center">
              <div className="hero-profile mb-3">
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
                <div className="hero-meta">
                  <p className="hero-role">
                    {profile.headline || t('hero.headlineFallback')}
                  </p>
                  {(profile.availability || t('hero.availabilityFallback')) && (
                    <p className="hero-availability">
                      <span className="hero-availability__icon" aria-hidden />
                      <span>
                        {profile.availability || t('hero.availabilityFallback')}
                      </span>
                    </p>
                  )}
                </div>
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
                    onClick={openContact}
                  >
                    <FaEnvelope aria-hidden />
                    {t('hero.contactCta')}
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      <section id="experience" className="landing-experience">
        <Container>
          <div className="experience-heading text-center mb-3">
            <h2 className="section-title">{t('experience.title')}</h2>
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
            <h2 className="section-title">{t('projects.title')}</h2>
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
          <div className="toolkit-heading text-center mb-3">
            <h2 className="section-title">{t('toolkit.title')}</h2>
          </div>
          <div
            className="toolkit-nav toolkit-nav--centered"
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
                    activeToolkit === category ? 'toolkit-nav__btn--active' : ''
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
          <div className="toolkit-grid toolkit-grid--solo mt-4">
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
        </Container>
      </section>

      <section id="education" className="landing-credentials">
        <Container>
          <div className="credentials-heading text-center mb-3">
            <h2 className="section-title">{t('credentials.education')}</h2>
          </div>
          {(resume.education || []).map((edu, index) => (
            <div
              key={`${edu.institution}-${index}`}
              className="education-row"
            >
              <div className="credential-icon education-icon-bg">
                <FaGraduationCap />
              </div>
              <div className="credential-content">
                <h3 className="credential-title">{edu.degree}</h3>
                <p className="credential-institution mb-1">{edu.institution}</p>
                {edu.location ? (
                  <p className="credential-subtitle mb-1">{edu.location}</p>
                ) : null}
                <span className="credential-period">{edu.period}</span>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section id="about" className="landing-personal">
        <Container>
          <div className="text-center mb-3">
            <h2 className="section-title">
              {personal.tagline || t('about.titleFallback')}
            </h2>
          </div>
          <div className="about-copy mx-auto">
            <p>{personal.intro}</p>
            {personal.whatFuelsMe ? <p>{personal.whatFuelsMe}</p> : null}
          </div>
        </Container>
      </section>

      <section id="connect" className="landing-connect">
        <Container>
          <div className="connect-block text-center mx-auto">
            <h2 className="section-title">{t('connect.title')}</h2>
            <p className="connect-copy">{t('connect.description')}</p>
            <div className="contact-actions">
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
              <a
                href={
                  profile.contact?.email
                    ? `mailto:${profile.contact.email}`
                    : undefined
                }
                className="btn btn-outline-primary"
                title={t('connect.emailTitle')}
                onClick={() =>
                  analyticsService.trackClick('link', 'mailto_connect', 'Email')
                }
              >
                <FaEnvelope />
                {t('connect.email')}
              </a>
              <button
                type="button"
                onClick={openContact}
                className="btn btn-primary"
                title={t('connect.contactFormTitle')}
              >
                <FaEnvelope />
                {t('connect.contact')}
              </button>
            </div>
          </div>
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
