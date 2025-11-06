import React, { useMemo, useState } from 'react'
import Typed from 'react-typed'
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap'
import {
  FaGithub,
  FaLinkedin,
  FaRegLightbulb,
  FaEnvelope,
  FaDownload,
  FaCode,
  FaChevronDown,
  FaGraduationCap,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import '../../App.css'
import '../../css/LandingPage.css'
import BackgroundImage from '../../assets/images/bg2.png'
import { getProfile } from '../../utils/profile'
import { getResume, getSkillCategories } from '../../utils/resume'
import { getProjects } from '../../utils/projects'
import { getPersonal } from '../../utils/personal'
import { getSkillIcon } from '../../utils/skillIcons'
import resumePdf from '../../assets/pdf/Malav_Rana_Frontend_Developer.pdf'
import { getSiteInfo } from '../../utils/site'
import { getToolkitIcon } from '../../utils/toolkitIcons'
import { getSiteIcon } from '../../utils/siteIcons'

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
  const [expandedExperience, setExpandedExperience] = useState('0')

  const siteBuildHighlights = siteInfo.buildHighlights || []
  const siteBuildStack = siteInfo.buildStack || []
  const summaryStats = profile.stats || []
  const ui = siteInfo.ui || {}
  const heroUI = ui.hero || {}
  const sectionsUI = ui.sections || {}
  const typedConfig = ui.typed || { typeSpeed: 45, backSpeed: 22 }

  const featuredProjects = allProjects.slice(0, 1)

  return (
    <div className="landing-page" id="home">
      <header
        className="landing-hero d-flex align-items-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="landing-hero__overlay" />
        <Container className="position-relative">
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <Badge pill bg="light" text="dark" className="hero-badge mb-3">
                {profile.headline}
              </Badge>
              <h1 className="hero-title mb-3">
                Hi, I&apos;m {profile.name}.
                <br />
                <span className="hero-typed">
                  <Typed
                    strings={profile.heroHighlights || []}
                    typeSpeed={typedConfig.typeSpeed}
                    backSpeed={typedConfig.backSpeed}
                    loop
                  />
                </span>
              </h1>
              <p className="lead text-light mb-4">{resume.summary}</p>
              {/* hero buttons removed as per request */}
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
                  <div className="landing-social mt-4 d-flex gap-3">
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub />
                    </a>
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin />
                    </a>
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
              <div className="summary-header">
                <h2>{profile.headline}</h2>
              </div>
              <p className="summary-text">{resume.summary}</p>
              <div className="summary-stats">
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="summary-stat">
                    <span className="summary-stat__value">{stat.value}</span>
                    <span className="summary-stat__label">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="summary-meta">
                <a href={`mailto:${profile.contact.email}`}>
                  {profile.contact.email}
                </a>
                <a href={`tel:${profile.contact.phone.replace(/[^0-9]/g, '')}`}>
                  {profile.contact.phone}
                </a>
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
              <div className="summary-actions">
                <Button
                  as="a"
                  href={resumePdf}
                  download
                  variant="primary"
                  className="summary-btn"
                  aria-label="Download résumé PDF"
                >
                  <FaDownload className="me-2" />{' '}
                  {sectionsUI.saveResume || 'Save résumé'}
                </Button>
                <Button
                  as="a"
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-primary"
                  className="summary-btn"
                  aria-label="Connect on LinkedIn"
                >
                  <FaLinkedin className="me-2" /> Connect on LinkedIn
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      <section id="toolkit" className="landing-skills py-5">
        <Container>
          <Row className="gy-4 align-items-stretch">
            <Col lg={4}>
              <div className="toolkit-heading">
                <Badge pill bg="light" text="dark" className="toolkit-badge">
                  {sectionsUI.toolbox || 'Toolbox'}
                </Badge>
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
            <Col lg={8}>
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

      <section id="experience" className="landing-experience py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="experience-heading text-center">
                <Badge pill bg="light" text="dark" className="summary-badge">
                  {sectionsUI.experience || 'Experience'}
                </Badge>
                <h2>{sectionsUI.experienceTitle || 'Recent roles & impact'}</h2>
                <p className="text-muted">
                  {sectionsUI.experienceDescription ||
                    'A snapshot of how I help teams ship reliable, performant products while mentoring teammates and balancing life on the tennis court.'}
                </p>
              </div>
              <div className="experience-accordion">
                {resume.experience.map((role, index) => {
                  const key = String(index)
                  const isOpen = expandedExperience === key

                  return (
                    <div
                      className={`experience-item ${isOpen ? 'experience-item--open' : ''}`}
                      key={`${role.company}-${role.role}`}
                    >
                      <button
                        type="button"
                        className="experience-toggle"
                        onClick={() => setExpandedExperience(isOpen ? '' : key)}
                        aria-expanded={isOpen}
                        aria-controls={`experience-panel-${key}`}
                      >
                        <div className="experience-header">
                          <div className="experience-header__title">
                            <span className="experience-role">{role.role}</span>
                            <span className="experience-company">
                              {role.company}
                            </span>
                          </div>
                          <div className="experience-meta">
                            <span className="experience-pill">
                              {role.location}
                            </span>
                            <span className="experience-pill">
                              {role.period}
                            </span>
                          </div>
                        </div>
                        <FaChevronDown className="experience-icon" />
                      </button>
                      <div
                        id={`experience-panel-${key}`}
                        className={`experience-body ${isOpen ? 'experience-body--open' : ''}`}
                      >
                        <ul className="experience-list">
                          {role.highlights.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="education" className="landing-education py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="education-heading text-center">
                <Badge pill bg="light" text="dark" className="summary-badge">
                  {sectionsUI.education || 'Education'}
                </Badge>
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
            </Col>
          </Row>
        </Container>
      </section>

      <section id="projects" className="landing-projects py-5">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <div className="projects-heading text-center">
                <Badge pill bg="light" text="dark" className="summary-badge">
                  {sectionsUI.projectsLabel || 'Projects'}
                </Badge>
                <h2 className="section-title">
                  {sectionsUI.featuredProject || 'Featured Project'}
                </h2>
              </div>
            </Col>
          </Row>
          <Row className="g-4 justify-content-center">
            {featuredProjects.map((p) => (
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
                  <Card.Footer className="bg-transparent border-0">
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      {p.cta}
                    </a>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="about" className="landing-build py-5">
        <Container>
          <Row className="row-gap-4">
            <Col lg={5}>
              <Card className="build-card border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="build-header">
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      className="summary-badge"
                    >
                      {sectionsUI.portfolioBuild || 'Portfolio build'}
                    </Badge>
                    <h2>
                      {sectionsUI.buildTitle || 'How this site is put together'}
                    </h2>
                    <p className="text-muted">
                      {sectionsUI.buildDescription ||
                        'Built as a single-page React experience using structured JSON and lightweight UI primitives so content updates stay painless.'}
                    </p>
                  </div>
                  <ul className="build-highlights">
                    {siteBuildHighlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card className="build-card border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-3">
                    {sectionsUI.buildToolsTitle || 'Tools chosen for this site'}
                  </h5>
                  <div className="build-grid">
                    {siteBuildStack.map((item) => {
                      const IconComponent = getSiteIcon(item.icon)
                      return (
                        <div key={item.label} className="build-tile">
                          <span className="build-tile__icon">
                            <IconComponent />
                          </span>
                          <div className="build-tile__content">
                            <strong>{item.label}</strong>
                            <span>{item.description}</span>
                          </div>
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
                      as="a"
                      href={`mailto:${profile.contact.email}`}
                      variant="primary"
                      className="summary-btn w-100 mb-2"
                      aria-label={`Email ${profile.name}`}
                    >
                      <FaEnvelope className="me-2" />{' '}
                      {sectionsUI.emailButton || 'Email Malav'}
                    </Button>
                    <Button
                      as="a"
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                      className="summary-btn w-100 mb-2"
                      aria-label="Connect on LinkedIn"
                    >
                      <FaLinkedin className="me-2" />{' '}
                      {sectionsUI.connectLinkedIn || 'Connect on LinkedIn'}
                    </Button>
                    <Button
                      as="a"
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                      className="summary-btn w-100 mb-2"
                      aria-label="Explore GitHub"
                    >
                      <FaGithub className="me-2" />{' '}
                      {sectionsUI.exploreGitHub || 'Explore GitHub'}
                    </Button>
                    <Button
                      as="a"
                      href={profile.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                      className="summary-btn w-100"
                      aria-label="View portfolio website"
                    >
                      <FaExternalLinkAlt className="me-2" />{' '}
                      {sectionsUI.viewPortfolio || 'View portfolio'}
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

      {/* contact CTA section removed as requested */}
    </div>
  )
}
