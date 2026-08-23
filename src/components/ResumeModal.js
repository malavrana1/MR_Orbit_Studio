import React, { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import analyticsService from '../services/analytics'
import './ResumeModal.css'

const FILE_NAME = 'Malav-Rana-Frontend-Engineer.pdf'

export default function ResumeModal({ show, onClose, src }) {
  const { t } = useTranslation()

  useEffect(() => {
    if (show) analyticsService.trackClick('modal', 'resume_preview', 'Resume')
  }, [show])

  const handleDownload = () => {
    analyticsService.trackDownload(FILE_NAME, 'pdf')
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="xl"
      className="resume-modal"
      dialogClassName="resume-modal__dialog"
    >
      <Modal.Header closeButton className="resume-modal__header">
        <Modal.Title className="resume-modal__title">
          {t('resumePreview.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="resume-modal__body">
        <iframe
          className="resume-modal__frame"
          src={src}
          title={t('resumePreview.iframeTitle')}
        />
        <p className="resume-modal__fallback">
          {t('resumePreview.fallback')}
        </p>
      </Modal.Body>
      <Modal.Footer className="resume-modal__footer">
        <Button
          as="a"
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline-secondary"
        >
          {t('resumePreview.openTab')}
        </Button>
        <Button
          as="a"
          href={src}
          download={FILE_NAME}
          variant="primary"
          onClick={handleDownload}
        >
          {t('resumePreview.download')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
