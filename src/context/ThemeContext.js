import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import '../pages/Home/Home.dark.css'
import analyticsService from '../services/analytics'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const scrollAfterToggleRef = useRef(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

  useEffect(() => {
    const pending = scrollAfterToggleRef.current
    if (!pending) return
    scrollAfterToggleRef.current = null
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(pending.x, pending.y)
      })
    })
    return () => cancelAnimationFrame(id)
  }, [isDarkMode])

  const toggleDarkMode = useCallback(() => {
    analyticsService.trackClick(
      'button',
      'toggle_dark_mode',
      isDarkMode ? 'light_mode' : 'dark_mode',
    )
    scrollAfterToggleRef.current = {
      x: window.scrollX,
      y: window.scrollY,
    }
    setIsDarkMode((prev) => !prev)
  }, [isDarkMode])

  const value = useMemo(
    () => ({ isDarkMode, toggleDarkMode }),
    [isDarkMode, toggleDarkMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
