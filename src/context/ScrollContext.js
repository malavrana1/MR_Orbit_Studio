import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getNavSectionIds } from '../utils/site'

const ScrollContext = createContext(null)

export function ScrollProvider({ children }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState(
    () => getNavSectionIds()[0] || 'home',
  )

  useEffect(() => {
    const navSectionIds = getNavSectionIds()

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = window.scrollY
        setIsScrolled(y > 50)
        setShowScrollTop(y > 400)

        const currentSection = navSectionIds.find((section) => {
          const element = document.getElementById(section)
          if (!element) return false
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        })
        if (currentSection) {
          setActiveSection(currentSection)
        }

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
