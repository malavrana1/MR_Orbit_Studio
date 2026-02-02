import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import analyticsService from '../services/analytics'

const ContactModal = ({ show, onClose, toEmail = 'malavrana90@gmail.com' }) => {
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
      analyticsService.trackContactForm('modal_opened')
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
      errors.email = 'Email is required.'
    } else if (!validateEmail(contactEmail.trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!contactSubject || contactSubject.trim() === '') {
      errors.subject = 'Subject is required.'
    }

    if (!contactMessage || contactMessage.trim() === '') {
      errors.message = 'Message is required.'
    } else if (contactMessage.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.'
    } else if (contactMessage.trim().length > 5000) {
      errors.message = 'Message must be less than 5000 characters.'
    }

    if (contactName && contactName.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters.'
    }

    if (
      contactPhone &&
      contactPhone.trim() !== '' &&
      !validatePhone(contactPhone.trim())
    ) {
      errors.phone = 'Please enter a valid phone number.'
    }

    if (contactCompany && contactCompany.trim().length > 100) {
      errors.company = 'Company name must be less than 100 characters.'
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
    analyticsService.trackContactForm('form_submitted', {
      has_name: !!contactName,
      message_length: contactMessage.length,
    })

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

      analyticsService.trackContactForm('form_success', {
        has_name: !!contactName,
        message_length: contactMessage.length,
      })
    } catch (err) {
      setSendError('Could not send your message. Please try again.')
      analyticsService.trackContactForm('form_error', { error: err.message })
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleExited = () => {
    setTimeout(() => {
      const activeModals = document.querySelectorAll('.modal.show')
      if (activeModals.length === 0) {
        document.body.classList.remove('modal-open')
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
        const backdrops = Array.from(
          document.querySelectorAll('.modal-backdrop'),
        )
        backdrops.forEach((backdrop) => {
          if (backdrop.isConnected) {
            try {
              backdrop.remove()
            } catch (e) {}
          }
        })
      }
    }, 100)
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onExited={handleExited}
      centered
      className="contact-modal-custom"
      backdrop={true}
      keyboard={true}
    >
      <Modal.Header closeButton className="contact-modal-header">
        <Modal.Title className="contact-modal-title">Get in Touch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sendSuccess && (
          <div className="contact-form-success" role="alert">
            <div className="success-icon">✓</div>
            <div className="success-content">
              <h5>Message Sent Successfully!</h5>
              <p>Thanks for reaching out. I'll get back to you soon.</p>
            </div>
          </div>
        )}
        {!!sendError && (
          <div className="contact-form-error" role="alert">
            <div className="error-icon">!</div>
            <div className="error-content">
              <h5>Oops! Something went wrong</h5>
              <p>{sendError}</p>
            </div>
          </div>
        )}
        {!sendSuccess && (
          <Form onSubmit={handleSendEmail} id="contact-form">
            <Form.Group className="mb-3" controlId="contactName">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                type="text"
                placeholder="What should I call you?"
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
                Your email <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
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
              <Form.Label>Your phone number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+1 (555) 123-4567"
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
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your company or organization"
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
                Subject <span style={{ color: 'red' }}>*</span>
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
                <option value="">Select a subject</option>
                <option value="Job Opportunity">Job Opportunity</option>
                <option value="Project Inquiry">Project Inquiry</option>
                <option value="Collaboration">Collaboration</option>
                <option value="General Question">General Question</option>
                <option value="Other">Other</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors.subject}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-0" controlId="contactMessage">
              <Form.Label>
                Message <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Hi Malav, I'd love to connect about…"
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
              analyticsService.trackContactForm('modal_closed', {
                action: 'close_after_success',
              })
              handleClose()
            }}
            className="w-100"
          >
            Close
          </Button>
        ) : (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => {
                analyticsService.trackContactForm('modal_closed', {
                  action: 'cancel',
                })
                handleClose()
              }}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              disabled={isSending}
              form="contact-form"
              type="submit"
            >
              {isSending ? 'Sending…' : 'Send Message'}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ContactModal
