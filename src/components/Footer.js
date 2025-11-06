import React from 'react'
import '../css/Footer.css'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { getProfile } from '../utils/profile'
import { getSiteInfo } from '../utils/site'
import ContactModal from './ContactModal'

const Footer = () => {
  const year = new Date().getFullYear()
  const profile = getProfile()
  const site = getSiteInfo()
  const owner = site.copyrightOwner || 'MR Orbit Studio'
  const [showContact, setShowContact] = React.useState(false)
  return (
    <footer className="footer-container">
      <p className="footer-text">
        © {year} {owner}. All rights reserved.
      </p>
      <div className="footer-links">
        <button
          type="button"
          className="footer-link-btn"
          aria-label="Contact us"
          onClick={() => setShowContact(true)}
        >
          <FaEnvelope />
        </button>
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
      <ContactModal
        show={showContact}
        onClose={() => setShowContact(false)}
        toEmail="malavrana90@gmail.com"
      />
    </footer>
  )
}

export default Footer
