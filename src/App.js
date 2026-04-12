import React, { Suspense, lazy } from 'react'
import Header from './layout/Header'
import Footer from './layout/Footer'
import DocumentLang from './layout/DocumentLang'
import { ThemeProvider } from './context/ThemeContext'
import { ScrollProvider } from './context/ScrollContext'
import './App.css'

const Home = lazy(() => import('./pages/Home'))

export default function App() {
  return (
    <ThemeProvider>
      <ScrollProvider>
        <DocumentLang />
        <Header />
        <Suspense
          fallback={
            <div className="app-loading" aria-busy="true">
              <div className="app-loading__spinner" />
            </div>
          }
        >
          <Home />
        </Suspense>
        <Footer />
      </ScrollProvider>
    </ThemeProvider>
  )
}
