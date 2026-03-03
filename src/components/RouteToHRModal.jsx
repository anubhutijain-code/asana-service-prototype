import { useState } from 'react';

function AiGradientIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="aiGradRoute" x1="3.375" y1="3.1875" x2="9.904" y2="10.437" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF594B" />
          <stop offset="1" stopColor="#4786FF" />
        </linearGradient>
      </defs>
      <path d="M8.8125 0H8.1875C8.1875 0.580161 7.95703 1.13656 7.5468 1.5468C7.13656 1.95703 6.58016 2.1875 6 2.1875V2.8125C6.58016 2.8125 7.13656 3.04297 7.5468 3.4532C7.95703 3.86344 8.1875 4.41984 8.1875 5H8.8125C8.8125 4.41984 9.04297 3.86344 9.4532 3.4532C9.86344 3.04297 10.4198 2.8125 11 2.8125V2.1875C10.4198 2.1875 9.86344 1.95703 9.4532 1.5468C9.04297 1.13656 8.8125 0.580161 8.8125 0ZM6.5 5.125C4.8335 5.125 3.875 4.1665 3.875 2.5H3.125C3.125 4.1665 2.1665 5.125 0.5 5.125V5.875C2.1665 5.875 3.125 6.8335 3.125 8.5H3.875C3.875 6.8335 4.8335 5.875 6.5 5.875V5.125ZM7.8125 7H7.1875C7.1875 7.28727 7.13092 7.57172 7.02099 7.83712C6.91105 8.10252 6.74992 8.34367 6.5468 8.5468C6.34367 8.74992 6.10252 8.91105 5.83712 9.02099C5.57172 9.13092 5.28727 9.1875 5 9.1875V9.8125C5.58016 9.8125 6.13656 10.043 6.5468 10.4532C6.95703 10.8634 7.1875 11.4198 7.1875 12H7.8125C7.8125 11.4198 8.04297 10.8634 8.4532 10.4532C8.86344 10.043 9.41984 9.8125 10 9.8125V9.1875C9.41984 9.1875 8.86344 8.95703 8.4532 8.5468C8.04297 8.13656 7.8125 7.58016 7.8125 7Z" fill="url(#aiGradRoute)" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

export default function RouteToHRModal({ ticket, onClose, onRoute }) {
  const [notes, setNotes] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRoute(notes);
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--background-weak)', borderRadius: 12, overflow: 'hidden',
          width: 480, boxShadow: 'var(--elevation-lg)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: '0 0 2px', lineHeight: '22px' }}>
              Route to HR
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-disabled)', margin: 0 }}>
              Ref: {ticket.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              background: 'transparent', color: 'var(--text-disabled)', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Body ── */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px' }}>

            {/* Read-only context block */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px', marginBottom: 18, background: 'var(--background-medium)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 6px', lineHeight: '20px' }}>
                {ticket.name}
              </p>
              {ticket.submitter && (
                <p style={{ fontSize: 12, color: 'var(--text-weak)', margin: '0 0 2px' }}>
                  {ticket.submitter.name}
                  {ticket.submitter.email && <> · <span style={{ color: 'var(--selected-text)' }}>{ticket.submitter.email}</span></>}
                </p>
              )}
              {(ticket.submitter?.org || ticket.submitter?.location) && (
                <p style={{ fontSize: 12, color: 'var(--text-disabled)', margin: '0 0 10px' }}>
                  {[ticket.submitter.org, ticket.submitter.location].filter(Boolean).join(' · ')}
                </p>
              )}
              {ticket.aiSummary && (
                <>
                  <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
                  <div className="flex items-start gap-1.5">
                    <AiGradientIcon />
                    <p style={{ fontSize: 12, lineHeight: '18px', color: 'var(--text-weak)', margin: 0 }}>
                      {ticket.aiSummary}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Notes textarea */}
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
              Notes for HR team <span style={{ color: 'var(--text-disabled)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add context the HR team should know..."
              rows={4}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 12px',
                fontSize: 13,
                lineHeight: '20px',
                color: 'var(--text)',
                border: '1px solid var(--border-strong)',
                borderRadius: 6,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                background: 'var(--background-weak)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--icon)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
            />
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: 'flex', gap: 8, justifyContent: 'flex-end',
            padding: '12px 20px', borderTop: '1px solid var(--border)',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{ height: 32, padding: '0 14px', fontSize: 13, fontWeight: 400, borderRadius: 6, border: '1px solid var(--border-strong)', background: 'var(--background-weak)', color: 'var(--text)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--background-weak)'}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ height: 32, padding: '0 14px', fontSize: 13, fontWeight: 500, borderRadius: 6, border: 'none', background: 'var(--selected-background-strong)', color: 'var(--selected-text-strong)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--selected-background-strong-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--selected-background-strong)'}
            >
              Route to HR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
