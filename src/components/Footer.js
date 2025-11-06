import React from 'react'
import '../css/Footer.css'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { getProfile } from '../utils/profile'
import { getSiteInfo } from '../utils/site'

const Footer = () => {
  const year = new Date().getFullYear()
  const profile = getProfile()
  const site = getSiteInfo()
  const owner = site.copyrightOwner || 'MR Orbit Studio'
  return (
    <footer className="footer-container">
      <p className="footer-text">
        © {year} {owner}. All rights reserved.
      </p>
      <div className="footer-links">
        <a
          href={profile.social.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href={profile.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
      </div>
    </footer>
  )
}

export default Footer
