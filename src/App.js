import React, { useEffect, Suspense, lazy } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import analyticsService from './services/analytics'
import './App.css'

const LandingPage = lazy(() => import('./components/pages/LandingPage'))

export default function App() {
  useEffect(() => {
    analyticsService.trackPageView('home')

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollPercentage = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100,
      )

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
      <Suspense
        fallback={
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        }
      >
        <LandingPage />
      </Suspense>
      <Footer />
    </>
  )
}
