import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import analyticsService from '../services/analytics'
import { getContactSubmitUrl } from '../config/env'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-+()]+$/
const MAX_SUBMIT_INTERVAL_MS = 8000

function sanitizeText(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max)
}

const ContactModal = ({ show, onClose, toEmail = '' }) => {
  const { t } = useTranslation()
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactCompany, setContactCompany] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [emailCopied, setEmailCopied] = useState(false)
  const lastSubmitAtRef = useRef(0)

  const submitUrl = getContactSubmitUrl(toEmail)
  const canSubmitRemote = Boolean(submitUrl)

  useEffect(() => {
    if (show) {
      analyticsService.trackContactForm('modal_open')
      setSendError('')
      setSendSuccess(false)
      setValidationErrors({})
      setIsSending(false)
      setHoneypot('')
      setEmailCopied(false)
    }
  }, [show])

  const resetForm = () => {
    setContactName('')
    setContactEmail('')
    setContactPhone('')
    setContactCompany('')
    setContactSubject('')
    setContactMessage('')
    setHoneypot('')
    setSendError('')
    setSendSuccess(false)
    setValidationErrors({})
    setIsSending(false)
    setEmailCopied(false)
  }

  const validateForm = () => {
    const errors = {}
    const email = sanitizeText(contactEmail, 254)
    const subject = sanitizeText(contactSubject, 120)
    const message = sanitizeText(contactMessage, 5000)
    const name = sanitizeText(contactName, 100)
    const phone = sanitizeText(contactPhone, 40)
    const company = sanitizeText(contactCompany, 100)

    if (!email) {
      errors.email = t('contact.validation.emailRequired')
    } else if (!EMAIL_RE.test(email)) {
      errors.email = t('contact.validation.emailInvalid')
    }

    if (!subject) {
      errors.subject = t('contact.validation.subjectRequired')
    }

    if (!message) {
      errors.message = t('contact.validation.messageRequired')
    } else if (message.length < 10) {
      errors.message = t('contact.validation.messageMin')
    } else if (message.length > 5000) {
      errors.message = t('contact.validation.messageMax')
    }

    if (name.length > 100) {
      errors.name = t('contact.validation.nameMax')
    }

    if (phone && (!PHONE_RE.test(phone) || phone.replace(/\D/g, '').length < 10)) {
      errors.phone = t('contact.validation.phoneInvalid')
    }

    if (company.length > 100) {
      errors.company = t('contact.validation.companyMax')
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const buildMailtoHref = () => {
    if (!toEmail) return null
    const name = sanitizeText(contactName, 100) || 'Visitor'
    const email = sanitizeText(contactEmail, 254)
    const phone = sanitizeText(contactPhone, 40)
    const company = sanitizeText(contactCompany, 100)
    const subject = sanitizeText(contactSubject, 120)
    const message = sanitizeText(contactMessage, 5000)
    const body = [
      message,
      '',
      `— ${name}`,
      email ? `Email: ${email}` : '',
      phone ? `Phone: ${phone}` : '',
      company ? `Company: ${company}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    const params = new URLSearchParams()
    if (subject) params.set('subject', `${subject} — from ${name}`)
    if (body) params.set('body', body)
    return `mailto:${toEmail}?${params.toString()}`
  }

  const openMailtoFallback = () => {
    const href = buildMailtoHref()
    if (!href) {
      setSendError(t('contact.sendError'))
      return
    }
    window.location.href = href
    analyticsService.trackContactForm('mailto_fallback')
  }

  const copyEmail = async () => {
    if (!toEmail) return
    try {
      await navigator.clipboard.writeText(toEmail)
      setEmailCopied(true)
      analyticsService.trackClick('button', 'copy_email', 'Copy Email')
      window.setTimeout(() => setEmailCopied(false), 2000)
    } catch {
      setSendError(t('contact.sendError'))
    }
  }

  const handleSendEmail = async (e) => {
    if (e) e.preventDefault()

    setSendError('')
    setValidationErrors({})

    if (honeypot.trim()) {
      setSendSuccess(true)
      analyticsService.trackContactForm('send_blocked_bot')
      return
    }

    const now = Date.now()
    if (now - lastSubmitAtRef.current < MAX_SUBMIT_INTERVAL_MS) {
      setSendError(t('contact.sendError'))
      analyticsService.trackContactForm('send_rate_limited')
      return
    }

    if (!validateForm()) {
      return
    }

    if (!canSubmitRemote) {
      lastSubmitAtRef.current = now
      openMailtoFallback()
      return
    }

    setIsSending(true)
    lastSubmitAtRef.current = now
    analyticsService.trackContactForm('send_attempt')

    const name = sanitizeText(contactName, 100) || 'Visitor'
    const email = sanitizeText(contactEmail, 254)
    const phone = sanitizeText(contactPhone, 40)
    const company = sanitizeText(contactCompany, 100)
    const subject = sanitizeText(contactSubject, 120)
    const message = sanitizeText(contactMessage, 5000)

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          company: company || undefined,
          subject,
          message,
          _subject: `${subject} - New message from ${name}`,
          _replyto: email,
          _template: 'table',
          _honey: '',
          source: 'MR Orbit Studio',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSendSuccess(true)
      setContactName('')
      setContactEmail('')
      setContactPhone('')
      setContactCompany('')
      setContactSubject('')
      setContactMessage('')
      setHoneypot('')
      setValidationErrors({})
      analyticsService.trackContactForm('send_success')
    } catch {
      setSendError(t('contact.sendError'))
      analyticsService.trackContactForm('send_error')
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleExited = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (document.querySelector('.modal.show')) return
        document.body.classList.remove('modal-open')
        document.body.style.removeProperty('overflow')
        document.body.style.removeProperty('padding-right')
        document.querySelectorAll('.modal-backdrop').forEach((node) => {
          node.remove()
        })
      })
    })
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onExited={handleExited}
      centered
      className="contact-modal-custom"
    >
      <Modal.Header closeButton className="contact-modal-header">
        <Modal.Title className="contact-modal-title">{t('contact.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sendSuccess && (
          <div className="contact-form-success" role="alert">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h5>{t('contact.successTitle')}</h5>
              <p>{t('contact.successBody')}</p>
            </div>
          </div>
        )}
        {!!sendError && (
          <div className="contact-form-error" role="alert">
            <div className="error-icon">!</div>
            <div className="error-content">
              <h5>{t('contact.errorTitle')}</h5>
              <p>{sendError}</p>
              {toEmail ? (
                <div className="contact-direct-actions">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={openMailtoFallback}
                  >
                    {t('contact.mailtoFallback')}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={copyEmail}
                  >
                    {emailCopied ? t('contact.emailCopied') : t('contact.copyEmail')}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        )}
        {!sendSuccess && (
          <Form onSubmit={handleSendEmail} id="contact-form" autoComplete="on">
            {toEmail ? (
              <p className="contact-direct-hint text-muted">
                {t('contact.directEmailHint')}{' '}
                <a href={`mailto:${toEmail}`}>{toEmail}</a>
              </p>
            ) : null}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-10000px',
                top: 'auto',
                width: 1,
                height: 1,
                overflow: 'hidden',
              }}
            >
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            <Form.Group className="mb-3" controlId="contactName">
              <Form.Label>{t('contact.nameLabel')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('contact.namePlaceholder')}
                value={contactName}
                maxLength={100}
                onChange={(e) => {
                  setContactName(e.target.value)
                  if (validationErrors.name) {
                    setValidationErrors({ ...validationErrors, name: '' })
                  }
                }}
                isInvalid={!!validationErrors.name}
                disabled={isSending}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactEmail">
              <Form.Label>
                {t('contact.emailLabel')} <span className="required-mark">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder={t('contact.emailPlaceholder')}
                value={contactEmail}
                maxLength={254}
                onChange={(e) => {
                  setContactEmail(e.target.value)
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: '' })
                  }
                }}
                isInvalid={!!validationErrors.email}
                disabled={isSending}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactPhone">
              <Form.Label>{t('contact.phoneLabel')}</Form.Label>
              <Form.Control
                type="tel"
                placeholder={t('contact.phonePlaceholder')}
                value={contactPhone}
                maxLength={40}
                onChange={(e) => {
                  setContactPhone(e.target.value)
                  if (validationErrors.phone) {
                    setValidationErrors({ ...validationErrors, phone: '' })
                  }
                }}
                isInvalid={!!validationErrors.phone}
                disabled={isSending}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactCompany">
              <Form.Label>{t('contact.companyLabel')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('contact.companyPlaceholder')}
                value={contactCompany}
                maxLength={100}
                onChange={(e) => {
                  setContactCompany(e.target.value)
                  if (validationErrors.company) {
                    setValidationErrors({ ...validationErrors, company: '' })
                  }
                }}
                isInvalid={!!validationErrors.company}
                disabled={isSending}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.company}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactSubject">
              <Form.Label>
                {t('contact.subjectLabel')} <span className="required-mark">*</span>
              </Form.Label>
              <Form.Control
                as="select"
                value={contactSubject}
                onChange={(e) => {
                  setContactSubject(e.target.value)
                  if (validationErrors.subject) {
                    setValidationErrors({ ...validationErrors, subject: '' })
                  }
                }}
                isInvalid={!!validationErrors.subject}
                disabled={isSending}
                required
              >
                <option value="">{t('contact.selectSubject')}</option>
                <option value="Job Opportunity">{t('contact.subjectJob')}</option>
                <option value="Project Inquiry">{t('contact.subjectProject')}</option>
                <option value="Collaboration">{t('contact.subjectCollab')}</option>
                <option value="General Question">{t('contact.subjectGeneral')}</option>
                <option value="Other">{t('contact.subjectOther')}</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors.subject}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-0" controlId="contactMessage">
              <Form.Label>
                {t('contact.messageLabel')} <span className="required-mark">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={t('contact.messagePlaceholder')}
                value={contactMessage}
                maxLength={5000}
                onChange={(e) => {
                  setContactMessage(e.target.value)
                  if (validationErrors.message) {
                    setValidationErrors({ ...validationErrors, message: '' })
                  }
                }}
                isInvalid={!!validationErrors.message}
                disabled={isSending}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {sendSuccess ? (
          <Button
            variant="primary"
            onClick={() => {
              analyticsService.trackContactForm('dismiss_ok')
              handleClose()
            }}
            className="w-100"
          >
            {t('contact.close')}
          </Button>
        ) : (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => {
                analyticsService.trackContactForm('dismiss_cancel')
                handleClose()
              }}
              disabled={isSending}
            >
              {t('contact.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              disabled={isSending || (!canSubmitRemote && !toEmail)}
              form="contact-form"
              type="submit"
            >
              {isSending
                ? t('contact.sending')
                : canSubmitRemote
                  ? t('contact.send')
                  : t('contact.mailtoFallback')}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ContactModal
