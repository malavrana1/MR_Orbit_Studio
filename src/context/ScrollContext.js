import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getNavSectionIds } from '../data/loaders'

const ScrollContext = createContext(null)

export function ScrollProvider({ children }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState(
    () => getNavSectionIds()[0] || 'home',
  )

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Always open at home on full page load/refresh
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      )
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const navSectionIds = getNavSectionIds()
    const homeId = navSectionIds[0] || 'home'

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = window.scrollY
        const nextScrolled = y > 50
        const nextShowTop = y > 400

        setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled))
        setShowScrollTop((prev) => (prev === nextShowTop ? prev : nextShowTop))

        let currentSection = homeId
        if (y > 80) {
          const probeY = 120
          for (let i = navSectionIds.length - 1; i >= 0; i -= 1) {
            const section = navSectionIds[i]
            const element = document.getElementById(section)
            if (!element) continue
            const rect = element.getBoundingClientRect()
            if (rect.top <= probeY) {
              currentSection = section
              break
            }
          }
        }

        setActiveSection((prev) =>
          prev === currentSection ? prev : currentSection,
        )

        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const value = useMemo(
    () => ({ isScrolled, showScrollTop, activeSection }),
    [isScrolled, showScrollTop, activeSection],
  )

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  )
}

export function usePageScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) {
    throw new Error('usePageScroll must be used within ScrollProvider')
  }
  return ctx
}
