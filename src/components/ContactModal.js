import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import analyticsService from '../services/analytics'

const ContactModal = ({ show, onClose, toEmail = 'ranam211197@gmail.com' }) => {
  const { t } = useTranslation()
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactCompany, setContactCompany] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (show) {
      analyticsService.trackContactForm('modal_open')
      setSendError('')
      setSendSuccess(false)
      setValidationErrors({})
      setIsSending(false)
    }
  }, [show])

  const resetForm = () => {
    setContactName('')
    setContactEmail('')
    setContactPhone('')
    setContactCompany('')
    setContactSubject('')
    setContactMessage('')
    setSendError('')
    setSendSuccess(false)
    setValidationErrors({})
    setIsSending(false)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const validateForm = () => {
    const errors = {}

    if (!contactEmail || contactEmail.trim() === '') {
      errors.email = t('contact.validation.emailRequired')
    } else if (!validateEmail(contactEmail.trim())) {
      errors.email = t('contact.validation.emailInvalid')
    }

    if (!contactSubject || contactSubject.trim() === '') {
      errors.subject = t('contact.validation.subjectRequired')
    }

    if (!contactMessage || contactMessage.trim() === '') {
      errors.message = t('contact.validation.messageRequired')
    } else if (contactMessage.trim().length < 10) {
      errors.message = t('contact.validation.messageMin')
    } else if (contactMessage.trim().length > 5000) {
      errors.message = t('contact.validation.messageMax')
    }

    if (contactName && contactName.trim().length > 100) {
      errors.name = t('contact.validation.nameMax')
    }

    if (
      contactPhone &&
      contactPhone.trim() !== '' &&
      !validatePhone(contactPhone.trim())
    ) {
      errors.phone = t('contact.validation.phoneInvalid')
    }

    if (contactCompany && contactCompany.trim().length > 100) {
      errors.company = t('contact.validation.companyMax')
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSendEmail = async (e) => {
    if (e) {
      e.preventDefault()
    }

    setSendError('')
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    setIsSending(true)
    analyticsService.trackContactForm('send_attempt')

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: contactName || 'Visitor',
            email: contactEmail.trim(),
            phone: contactPhone.trim() || '',
            company: contactCompany.trim() || '',
            subject: contactSubject.trim(),
            message: contactMessage.trim(),
            _subject: `${contactSubject.trim()} - New message from ${contactName || 'a visitor'}`,
            _replyto: contactEmail.trim(),
            _template: 'table',
            source: 'MR Orbit Studio – Contact Modal',
            _captcha: 'false',
          }),
        },
      )

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
      setValidationErrors({})

      analyticsService.trackContactForm('send_success')
    } catch (err) {
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
            </div>
          </div>
        )}
        {!sendSuccess && (
          <Form onSubmit={handleSendEmail} id="contact-form">
            <Form.Group className="mb-3" controlId="contactName">
              <Form.Label>{t('contact.nameLabel')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('contact.namePlaceholder')}
                value={contactName}
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
                {t('contact.emailLabel')} <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder={t('contact.emailPlaceholder')}
                value={contactEmail}
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
                {t('contact.subjectLabel')} <span style={{ color: 'red' }}>*</span>
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
                {t('contact.messageLabel')} <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={t('contact.messagePlaceholder')}
                value={contactMessage}
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
              disabled={isSending}
              form="contact-form"
              type="submit"
            >
              {isSending ? t('contact.sending') : t('contact.send')}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ContactModal
