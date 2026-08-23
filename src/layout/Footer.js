import React, { memo } from 'react'
import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import './Footer.css'
import { getSiteInfo } from '../data/loaders'

const Footer = memo(function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const site = getSiteInfo()
  const owner = t('site.copyrightOwner', {
    defaultValue: site.copyrightOwner || 'MR Orbit Studio',
  })

  return (
    <footer className="footer-container">
      <Container>
        <div className="footer-inner">
          <p className="footer-text">
            {t('footer.rights', { year, owner })}
          </p>
        </div>
      </Container>
    </footer>
  )
})

export default Footer
