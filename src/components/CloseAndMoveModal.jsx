import Modal, { ModalButton } from './ui/Modal';

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6.5" stroke="#16A34A" />
      <path d="M4 7l2 2 4-4" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CloseAndMoveModal({ open, ticket, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Close ticket and move to Asana"
      subtitle={`Ref: ${ticket?.id}`}
      size="md"
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>Cancel</ModalButton>
          <ModalButton variant="primary" onClick={onConfirm}>Close and create task</ModalButton>
        </>
      }
    >
      {/* Ticket context block */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px', marginBottom: 18, background: 'var(--background-medium)' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 6px', lineHeight: '20px' }}>
          {ticket?.name}
        </p>
        {ticket?.submitter && (
          <p style={{ fontSize: 12, color: 'var(--text-weak)', margin: 0 }}>
            {ticket.submitter.name}
            {ticket.submitter.email && <> · <span style={{ color: 'var(--selected-text)' }}>{ticket.submitter.email}</span></>}
          </p>
        )}
      </div>

      {/* Description */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px', background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
        <CheckCircleIcon />
        <p style={{ fontSize: 13, color: '#15803D', margin: 0, lineHeight: '20px' }}>
          This ticket will be marked as <strong>Resolved</strong>. A new task will be created in the{' '}
          <strong>IT Escalations</strong> project so it can be tracked to completion by your team.
        </p>
      </div>
    </Modal>
  );
}
