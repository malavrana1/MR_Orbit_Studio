import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const ContactModal = ({ show, onClose, toEmail = 'malavrana90@gmail.com' }) => {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)

  const handleSendEmail = async () => {
    setSendError('')
    setSendSuccess(false)
    if (!contactMessage || !contactEmail) {
      setSendError('Please provide your email and a short message.')
      return
    }
    setIsSending(true)
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
    } catch (err) {
      setSendError('Could not send your message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered className="contact-modal-custom">
      <Modal.Header closeButton className="contact-modal-header">
        <Modal.Title style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: '700'}}>
          Get in Touch
        </Modal.Title>
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
            onClick={onClose}
            className="w-100"
          >
            Close
          </Button>
        ) : (
          <>
            <Button variant="outline-secondary" onClick={onClose}>
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
