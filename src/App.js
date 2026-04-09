import React, { Suspense, lazy } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'
import { ScrollProvider } from './context/ScrollContext'
import './App.css'

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'))

export default function App() {
  return (
    <ThemeProvider>
      <ScrollProvider>
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
                  borderTop: '4px solid #8b6914',
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
      </ScrollProvider>
    </ThemeProvider>
  )
}
