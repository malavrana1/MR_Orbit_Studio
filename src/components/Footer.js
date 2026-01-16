import React, { memo } from 'react'
import '../css/Footer.css'
import { getSiteInfo } from '../utils/site'

const Footer = memo(function Footer() {
  const year = new Date().getFullYear()
  const site = getSiteInfo()
  const owner = site.copyrightOwner || 'MR Orbit Studio'
  return (
    <footer className="footer-container">
      <p className="footer-text">
        © {year} {owner}. All rights reserved.
      </p>
    </footer>
  )
})

export default Footer
