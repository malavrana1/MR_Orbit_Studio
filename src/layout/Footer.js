import React, { memo } from 'react'
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
      <p className="footer-text">
        {t('footer.rights', { year, owner })}
      </p>
    </footer>
  )
})

export default Footer
