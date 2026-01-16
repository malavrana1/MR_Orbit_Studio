import React, { useEffect } from 'react'
import LandingPage from './components/pages/LandingPage'
import Footer from './components/Footer'
import Header from './components/Header'
import analyticsService from './services/analytics'
import './App.css'

export default function App() {
  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target
      const element = target.closest('a, button, [role="button"], [tabindex="0"]') || target
      
      const elementType = element.tagName.toLowerCase()
      const elementId = element.id || element.className || 'unknown'
      const elementText = element.textContent?.trim().substring(0, 100) || ''
      const href = element.href || ''
      const ariaLabel = element.getAttribute('aria-label') || ''
      
      analyticsService.trackClick(
        elementType,
        elementId,
        elementText || ariaLabel || href || 'click'
      )
    }

    document.addEventListener('click', handleClick)
    
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    const trackInitialView = async () => {
      await analyticsService.trackPageView('home')
    }
    trackInitialView()
  }, [])

  return (
    <>
      <Header />
      <LandingPage />
      <Footer />
    </>
  )
}
