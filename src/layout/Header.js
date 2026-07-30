import React, { useState, useEffect, useCallback, memo } from 'react'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { getSiteInfo, getNavConfig } from '../data/loaders'
import analyticsService from '../services/analytics'
import { useTheme } from '../context/ThemeContext'
import { usePageScroll } from '../context/ScrollContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { getActionMeta } from '../icons/actionIcons'
import './Header.css'

const Logo = ({ className = '', size = 42 }) => (
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
      <linearGradient id="mr-logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a1512" />
        <stop offset="55%" stopColor="#2c1b16" />
        <stop offset="100%" stopColor="#3e2723" />
      </linearGradient>
      <linearGradient id="mr-logo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8d5a3" />
        <stop offset="45%" stopColor="#c9a227" />
        <stop offset="100%" stopColor="#8b6914" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#mr-logo-bg)" />
    <rect
      x="3"
      y="3"
      width="58"
      height="58"
      rx="14"
      fill="none"
      stroke="url(#mr-logo-ring)"
      strokeWidth="2.5"
    />
    <path
      d="M16 18 V46 M16 18 L24 34 L32 18 M32 18 V46"
      fill="none"
      stroke="#f7efdf"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36 18 H48 Q53 18 53 26 Q53 34 48 34 H36 M36 34 L50 46"
      fill="none"
      stroke="#f7efdf"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Header = memo(function Header() {
  const { t } = useTranslation()
  const site = getSiteInfo() || {}
  const brand = t('site.brand', { defaultValue: site.brand || 'Orbit Studio' })
  const nav = getNavConfig()

  const { isScrolled, activeSection } = usePageScroll()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const themeMeta = getActionMeta(isDarkMode ? 'sun' : 'moon')
  const ThemeIcon = themeMeta.Icon

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
              const { Icon, color, ink } = getActionMeta(sectionId)
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
                    <span
                      className="nav-icon-wrap"
                      style={{ '--skill-bg': color, '--skill-ink': ink }}
                    >
                      <Icon className="nav-icon" />
                    </span>
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
                <span
                  className="nav-icon-wrap"
                  style={{
                    '--skill-bg': themeMeta.color,
                    '--skill-ink': themeMeta.ink,
                  }}
                >
                  <ThemeIcon className="nav-icon" />
                </span>
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
