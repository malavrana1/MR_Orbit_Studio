import React, { useState, useEffect } from 'react'
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
      <linearGradient id="mr-core" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
      <linearGradient id="mr-orbit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <path d="M12 44 L12 22 L20 34 L28 22 L28 44" className="logo-m" />
    <path
      d="M36 22 L50 22 C56 22 56 32 50 32 L36 32 L50 44"
      className="logo-r"
    />
    <circle cx="32" cy="32" r="6.5" className="logo-core" />
    <path d="M8 30 C20 20 44 20 56 30" className="logo-orbit" />
    <path d="M8 34 C20 44 44 44 56 34" className="logo-orbit" />
    <path
      d="M48 18 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z"
      className="logo-star"
    />
  </svg>
)

const navIcons = {
  Home: FaHome,
  Summary: FaUser,
  Toolkit: FaToolbox,
  Experience: FaBriefcase,
  Education: FaGraduationCap,
  Projects: FaFolderOpen,
  About: FaInfoCircle,
  Connect: FaHandshake,
  Contact: FaEnvelope,
}

export default function Header() {
  const site = getSiteInfo() || {}
  const brand = site.brand || 'MR Orbit'
  const nav = site.nav || {
    links: [
      { label: 'Home', href: '#home' },
      { label: 'Summary', href: '#summary' },
      { label: 'Toolkit', href: '#toolkit' },
      { label: 'Experience', href: '#experience' },
      { label: 'Education', href: '#education' },
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

  const toggleDarkMode = () => {
    analyticsService.trackClick('button', 'toggle_dark_mode', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode')
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const handleScroll = () => {
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
    }

    window.addEventListener('scroll', handleScroll)
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
            <li className="theme-toggle-wrapper">
              <button
                className="theme-toggle nav-link"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <FaSun className="nav-icon" /> : <FaMoon className="nav-icon" />}
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
}
