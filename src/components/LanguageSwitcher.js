import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa'
import analyticsService from '../services/analytics'
import { LANGUAGES } from '../config/languages'
import { AVAILABLE_LOCALE_CODES } from '../i18n'

const labelByCode = Object.fromEntries(
  LANGUAGES.map(({ code, label }) => [code, label]),
)

const loadedCodes = new Set(AVAILABLE_LOCALE_CODES)
const selectableLanguages = LANGUAGES.filter(({ code }) => loadedCodes.has(code))

const langDropdownPopper = {
  strategy: 'absolute',
  placement: 'bottom-end',
  modifiers: [
    { name: 'offset', options: { offset: [0, 6] } },
    { name: 'flip', enabled: true },
    {
      name: 'preventOverflow',
      enabled: true,
      options: { padding: 8, altBoundary: true },
    },
    {
      name: 'eventListeners',
      options: { scroll: false, resize: true },
    },
  ],
}

export default function LanguageSwitcher({ onSelect }) {
  const { i18n, t } = useTranslation()
  const code = (i18n.resolvedLanguage || 'en').split('-')[0]
  const current = labelByCode[code] || labelByCode.en

  const handleSelect = (eventKey) => {
    if (!eventKey) return
    const x = window.scrollX
    const y = window.scrollY
    void i18n.changeLanguage(eventKey).then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(x, y)
        })
      })
    })
    analyticsService.trackClick('button', 'change_language', eventKey)
    onSelect?.()
  }

  return (
    <Dropdown
      className="nav-lang-dropdown"
      align="end"
      onSelect={handleSelect}
      focusFirstItemOnShow={false}
    >
      <Dropdown.Toggle
        variant="link"
        className="nav-lang-toggle"
        id="site-language-menu"
        aria-label={t('header.language')}
        aria-haspopup="true"
      >
        <FaGlobe className="nav-lang-icon" aria-hidden />
        <span className="nav-lang-current">{current}</span>
        <FaChevronDown className="nav-lang-chevron" aria-hidden />
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="nav-lang-menu"
        renderOnMount
        popperConfig={langDropdownPopper}
      >
        <Dropdown.Header className="nav-lang-menu__header">
          {t('header.language')}
        </Dropdown.Header>
        {selectableLanguages.map(({ code: lng }) => (
          <Dropdown.Item
            key={lng}
            eventKey={lng}
            active={code === lng}
            lang={lng}
            className="nav-lang-menu__item"
          >
            <span className="nav-lang-menu__label">{labelByCode[lng]}</span>
            {code === lng ? (
              <FaCheck className="nav-lang-menu__check" aria-hidden />
            ) : (
              <span className="nav-lang-menu__check-slot" aria-hidden />
            )}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
