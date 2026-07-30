import React, { useState, useEffect, useCallback, memo } from 'react'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { getSiteInfo, getNavConfig } from '../data/loaders'
import analyticsService from '../services/analytics'
import { useTheme } from '../context/ThemeContext'
import { usePageScroll } from '../context/ScrollContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import {
  FaHome,
  FaToolbox,
  FaBriefcase,
  FaGraduationCap,
  FaFolderOpen,
  FaHandshake,
  FaMoon,
  FaSun,
} from 'react-icons/fa'
import './Header.css'

const Logo = ({ className = '', size = 28 }) => (
  <svg
    className={`brand-logo ${className}`}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5c4033" />
        <stop offset="50%" stopColor="#8b6914" />
        <stop offset="100%" stopColor="#c9a227" />
      </linearGradient>
      <radialGradient id="core-gradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#8b6914" />
        <stop offset="100%" stopColor="#5c4033" />
      </radialGradient>
    </defs>
    <rect
      width="64"
      height="64"
      rx="14"
      fill="url(#orbit-gradient)"
      className="logo-bg"
    />
    <ellipse
      cx="32"
      cy="32"
      rx="22"
      ry="10"
      fill="none"
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="1.5"
      className="logo-orbit-ring"
      transform="rotate(-15 32 32)"
    />
    <path
      d="M 14 18 L 14 46 M 14 18 L 22 34 L 30 18 M 30 18 L 30 46"
      fill="none"
      stroke="#ffffff"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="logo-m"
    />
    <path
      d="M 34 18 L 48 18 Q 52 18 52 26 Q 52 34 48 34 L 34 34 M 34 34 L 48 46"
      fill="none"
      stroke="#ffffff"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="logo-r"
    />
    <circle
      cx="32"
      cy="54"
      r="2"
      fill="#ffffff"
      opacity="0.8"
      className="logo-accent"
    />
  </svg>
)

const navIcons = {
  home: FaHome,
  toolkit: FaToolbox,
  experience: FaBriefcase,
  education: FaGraduationCap,
  projects: FaFolderOpen,
  connect: FaHandshake,
}

const Header = memo(function Header() {
  const { t } = useTranslation()
  const site = getSiteInfo() || {}
  const brand = t('site.brand', { defaultValue: site.brand || 'MR Orbit' })
  const nav = getNavConfig()

  const { isScrolled, activeSection } = usePageScroll()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleHeaderThemeClick = useCallback(() => {
    toggleDarkMode()
    setIsMobileMenuOpen(false)
  }, [toggleDarkMode])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const sectionId = href.substring(1)
    analyticsService.trackNavigation(sectionId, 'header')

    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <Container>
        <nav className="main-nav">
          <a
            href="#home"
            className="nav-brand"
            onClick={(e) => handleNavClick(e, '#home')}
          >
            <Logo size={42} />
            <span className="brand-text brand-gradient">{brand}</span>
          </a>

          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {nav.links.map((link) => {
              const sectionId = link.href.substring(1)
              const Icon = navIcons[sectionId] || FaHome
              const isActive = activeSection === sectionId
              const label = t(`nav.${sectionId}`, { defaultValue: link.label })

              return (
                <li key={link.href}>
                    <a
                      href={link.href}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      title={label}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{label}</span>
                    {isActive && <span className="nav-indicator"></span>}
                  </a>
                </li>
              )
            })}
            <li className="theme-toggle-menu-item">
              <button
                type="button"
                className="nav-link theme-toggle-menu"
                onClick={handleHeaderThemeClick}
                aria-label={
                  isDarkMode ? t('theme.switchToLight') : t('theme.switchToDark')
                }
                title={
                  isDarkMode ? t('theme.switchToLight') : t('theme.switchToDark')
                }
              >
                {isDarkMode ? (
                  <FaSun className="nav-icon" />
                ) : (
                  <FaMoon className="nav-icon" />
                )}
                <span className="nav-label">
                  {isDarkMode ? t('theme.lightMode') : t('theme.darkMode')}
                </span>
              </button>
            </li>
          </ul>

          <div className="nav-toolbar-end">
            <LanguageSwitcher onSelect={() => setIsMobileMenuOpen(false)} />
            <button
              type="button"
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('header.toggleMenu')}
              aria-expanded={isMobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </Container>
    </header>
  )
})

export default Header
