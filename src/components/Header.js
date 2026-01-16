import React, { useState, useEffect, memo } from 'react'
import { Container } from 'react-bootstrap'
import { getSiteInfo } from '../utils/site'
import analyticsService from '../services/analytics'
import {
  FaHome,
  FaUser,
  FaToolbox,
  FaBriefcase,
  FaGraduationCap,
  FaFolderOpen,
  FaInfoCircle,
  FaHandshake,
  FaEnvelope,
  FaMoon,
  FaSun,
} from 'react-icons/fa'
import '../css/Header.css'

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
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
      <radialGradient id="core-gradient" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#2563eb" />
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
  Home: FaHome,
  Summary: FaUser,
  Toolkit: FaToolbox,
  Experience: FaBriefcase,
  Education: FaGraduationCap,
  Credentials: FaGraduationCap,
  Projects: FaFolderOpen,
  About: FaInfoCircle,
  Connect: FaHandshake,
  Contact: FaEnvelope,
}

const Header = memo(function Header() {
  const site = getSiteInfo() || {}
  const brand = site.brand || 'MR Orbit'
  const nav = site.nav || {
    links: [
      { label: 'Home', href: '#home' },
      { label: 'Summary', href: '#summary' },
      { label: 'Toolkit', href: '#toolkit' },
      { label: 'Experience', href: '#experience' },
      { label: 'Credentials', href: '#credentials' },
      { label: 'Projects', href: '#projects' },
      { label: 'About', href: '#about' },
      { label: 'Connect', href: '#connect' },
      { label: 'Contact', href: '#contact' },
    ],
  }

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode') {
        const newValue = e.newValue ? JSON.parse(e.newValue) : false
        setIsDarkMode(newValue)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const toggleDarkMode = () => {
    analyticsService.trackClick(
      'button',
      'toggle_dark_mode',
      isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    )
    const newValue = !isDarkMode
    setIsDarkMode(newValue)
    setIsMobileMenuOpen(false)
    window.dispatchEvent(new Event('darkModeChanged'))
  }

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)

          const sections = nav.links.map((link) => link.href.substring(1))
          const currentSection = sections.find((section) => {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              return rect.top <= 100 && rect.bottom >= 100
            }
            return false
          })
          if (currentSection) {
            setActiveSection(currentSection)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [nav.links])

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen) {
        const navElement = event.target.closest('.main-nav')
        const toggle = event.target.closest('.mobile-menu-toggle')
        if (!navElement && !toggle) {
          setIsMobileMenuOpen(false)
        }
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
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

          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {nav.links.map((link) => {
              const Icon = navIcons[link.label] || FaHome
              const sectionId = link.href.substring(1)
              const isActive = activeSection === sectionId

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{link.label}</span>
                    {isActive && <span className="nav-indicator"></span>}
                  </a>
                </li>
              )
            })}
            <li className="theme-toggle-menu-item">
              <button
                className="nav-link theme-toggle-menu"
                onClick={toggleDarkMode}
                aria-label={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
                title={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
              >
                {isDarkMode ? (
                  <FaSun className="nav-icon" />
                ) : (
                  <FaMoon className="nav-icon" />
                )}
                <span className="nav-label">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  )
})

export default Header
