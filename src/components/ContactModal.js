import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import analyticsService from '../services/analytics'

const ContactModal = ({ show, onClose, toEmail = 'malavrana90@gmail.com' }) => {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)

  useEffect(() => {
    if (show) {
      analyticsService.trackContactForm('modal_opened')
    }
  }, [show])

  const handleSendEmail = async () => {
    setSendError('')
    setSendSuccess(false)
    if (!contactMessage || !contactEmail) {
      setSendError('Please provide your email and a short message.')
      analyticsService.trackContactForm('validation_error', {
        error: 'missing_fields',
      })
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
            email: contactEmail,
            message: contactMessage,
            _subject: `New message from ${contactName || 'a visitor'}`,
            _replyto: contactEmail,
            _template: 'table',
            source: 'MR Orbit Studio – Contact Modal',
            _captcha: 'false',
          }),
        },
      )
      if (!response.ok) throw new Error('Failed to send')
      setSendSuccess(true)
      setContactName('')
      setContactEmail('')
      setContactMessage('')
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

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="contact-modal-custom"
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
          <Form>
            <Form.Group className="mb-3" controlId="contactName">
              <Form.Label>Your name</Form.Label>
              <Form.Control
                type="text"
                placeholder="What should I call you?"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactEmail">
              <Form.Label>Your email</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="contactMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Hi Malav, I’d love to connect about…"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
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
              onClose()
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
                onClose()
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              disabled={isSending}
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
