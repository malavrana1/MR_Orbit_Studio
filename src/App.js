import React, { useEffect } from 'react'
import LandingPage from './components/pages/LandingPage'
import Footer from './components/Footer'
import Header from './components/Header'
import analyticsService from './services/analytics'
import './App.css'

export default function App() {
  useEffect(() => {
    analyticsService.trackPageView('home')
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
      
      if (scrollPercentage > 0) {
        analyticsService.trackScrollDepth(scrollPercentage)
      }
    }

    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  return (
    <>
      <Header />
      <LandingPage />
      <Footer />
    </>
  )
}
