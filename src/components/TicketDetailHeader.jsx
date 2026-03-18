import { useState, useRef, useEffect } from 'react';

// ─── Pill constants + icons ────────────────────────────────────────────────────

export const PRIORITY_COLORS = {
  Critical: { bg: '#FEF3C7', color: '#92400E' },
  Medium:   { bg: '#DBEAFE', color: '#1D4ED8' },
  Low:      { bg: 'var(--priority-low-bg)', color: 'var(--priority-low-text)' },
};
export const STATUS_BORDER = {
  'On hold':      '#F1BD6C',
  'Investigating':'#79ABFF',
  'Not started':  'var(--border)',
  'Resolved':     '#58A182',
  'Closed':       'var(--border)',
  'Routed':       'var(--border)',
};
export const PRIORITY_OPTIONS = ['Critical', 'Medium', 'Low'];
export const STATUS_OPTIONS   = ['Not started', 'Investigating', 'On hold', 'Resolved'];

export function PillStatusIcon({ status }) {
  if (status === 'Not started') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 8C7.7945 8 6 9.7945 6 12C6 14.2055 7.7945 16 10 16C12.2055 16 14 14.2055 14 12C14 9.795 12.2055 8 10 8ZM10 15C8.3455 15 7 13.6545 7 12C7 10.3455 8.3455 9 10 9C11.6545 9 13 10.3455 13 12C13 13.6545 11.6545 15 10 15Z" fill="var(--icon)" />
    </svg>
  );
  if (status === 'On hold') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 6C6.692 6 4 8.6915 4 12C4 15.3085 6.692 18 10 18C13.309 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.2435 17 5 14.757 5 12C5 9.243 7.2435 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12 9.5L12 14.5C12 14.6326 11.9473 14.7598 11.8536 14.8536C11.7598 14.9473 11.6326 15 11.5 15C11.3674 15 11.2402 14.9473 11.1464 14.8536C11.0527 14.7598 11 14.6326 11 14.5L11 9.5C11 9.36739 11.0527 9.24021 11.1464 9.14645C11.2402 9.05268 11.3674 9 11.5 9C11.6326 9 11.7598 9.05268 11.8536 9.14645C11.9473 9.24021 12 9.36739 12 9.5ZM9 9.5L9 14.5C9 14.6326 8.94732 14.7598 8.85355 14.8536C8.75979 14.9473 8.63261 15 8.5 15C8.36739 15 8.24021 14.9473 8.14645 14.8536C8.05268 14.7598 8 14.6326 8 14.5L8 9.5C8 9.36739 8.05268 9.24021 8.14645 9.14645C8.24021 9.05268 8.36739 9 8.5 9C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5Z" fill="#F1BD6C" />
    </svg>
  );
  if (status === 'Investigating') return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="5.5" stroke="#79ABFF" />
      <path d="M3 6H9M9 6L7 4M9 6L7 8" stroke="#79ABFF" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (status === 'Resolved') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M10 6C6.6915 6 4 8.6915 4 12C4 15.3085 6.6915 18 10 18C13.3085 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.243 17 5 14.757 5 12C5 9.243 7.243 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12.8535 10.1465C12.9 10.1929 12.9368 10.248 12.962 10.3087C12.9872 10.3693 13.0001 10.4343 13.0001 10.5C13.0001 10.5657 12.9872 10.6307 12.962 10.6913C12.9368 10.752 12.9 10.8071 12.8535 10.8535L9.52 14.187C9.47367 14.2336 9.41859 14.2706 9.35793 14.2958C9.29726 14.321 9.2322 14.334 9.1665 14.334C9.1008 14.334 9.03574 14.321 8.97507 14.2958C8.91441 14.2706 8.85933 14.2336 8.813 14.187L7.1465 12.52C7.05275 12.4262 7.00008 12.2991 7.00008 12.1665C7.00008 12.0339 7.05275 11.9068 7.1465 11.813C7.24025 11.7192 7.36741 11.6666 7.5 11.6666C7.63259 11.6666 7.75975 11.7192 7.8535 11.813L9.1665 13.1265L12.1465 10.1465C12.1929 10.1 12.248 10.0632 12.3087 10.038C12.3693 10.0128 12.4343 9.9999 12.5 9.9999C12.5657 9.9999 12.6307 10.0128 12.6913 10.038C12.752 10.0632 12.8071 10.1 12.8535 10.1465Z" fill="#58A182" />
    </svg>
  );
  return null;
}

// ─── Header icons ──────────────────────────────────────────────────────────────

function DotsIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="6 6 16 16" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M15.6827 12.318C16.1021 12.735 16.4345 13.231 16.6607 13.7774C16.887 14.3238 17.0025 14.9096 17.0007 15.501C17.0024 16.0923 16.8868 16.6781 16.6605 17.2245C16.4343 17.7708 16.102 18.2669 15.6827 18.684L13.6823 20.684C13.2646 21.1023 12.7684 21.434 12.2221 21.66C11.6759 21.886 11.0904 22.0019 10.4992 22.001C9.9081 22.0019 9.3226 21.886 8.77636 21.66C8.23013 21.434 7.73392 21.1023 7.31625 20.684C5.56125 18.929 5.56125 16.074 7.31625 14.319L9.14525 12.4895C9.19171 12.4431 9.24685 12.4063 9.30753 12.3811C9.36822 12.356 9.43325 12.3431 9.49893 12.3431C9.5646 12.3432 9.62963 12.3561 9.69029 12.3813C9.75096 12.4064 9.80608 12.4433 9.8525 12.4897C9.89892 12.5362 9.93574 12.5913 9.96085 12.652C9.98596 12.7127 9.99887 12.7777 9.99885 12.8434C9.99883 12.9091 9.98587 12.9741 9.96072 13.0348C9.93556 13.0955 9.89871 13.1506 9.85225 13.197L8.02325 15.026C7.36787 15.6831 6.99981 16.5732 6.99981 17.5012C6.99981 18.4293 7.36787 19.3194 8.02325 19.9765C9.38825 21.3415 11.6097 21.3425 12.9748 19.9765L14.9752 17.9765C15.6308 17.3194 15.9989 16.4292 15.9989 15.501C15.9989 14.5728 15.6308 13.6826 14.9752 13.0255C14.5744 12.6219 14.0804 12.3233 13.5367 12.156C13.4124 12.1149 13.3092 12.0266 13.2492 11.9101C13.1893 11.7937 13.1774 11.6584 13.2162 11.5333C13.255 11.4082 13.3413 11.3033 13.4566 11.2412C13.5719 11.179 13.7069 11.1646 13.8327 11.201C14.5307 11.4181 15.1654 11.8016 15.6823 12.3185L15.6827 12.318ZM20.6842 7.31649C18.9288 5.56149 16.0737 5.56149 14.3182 7.31649L12.3177 9.31649C11.8984 9.73355 11.5659 10.2297 11.3397 10.7761C11.1134 11.3226 10.9979 11.9085 10.9998 12.5C10.9998 13.7025 11.4678 14.8325 12.3177 15.6835C12.8346 16.2004 13.4693 16.5839 14.1672 16.801C14.2923 16.8347 14.4255 16.8185 14.5389 16.756C14.6523 16.6935 14.7371 16.5895 14.7754 16.4658C14.8138 16.3421 14.8026 16.2084 14.7444 16.0927C14.6862 15.977 14.5854 15.8884 14.4632 15.8455C13.9197 15.6784 13.4256 15.3799 13.0248 14.9765C12.3691 14.3194 12.0008 13.429 12.0008 12.5007C12.0008 11.5725 12.3691 10.6821 13.0248 10.025L15.0252 8.02499C16.3907 6.65999 18.6122 6.65999 19.9767 8.02499C21.3412 9.38899 21.3417 11.6105 19.9767 12.976L18.1477 14.8045C18.1013 14.8509 18.0644 14.906 18.0393 14.9667C18.0141 15.0274 18.0012 15.0924 18.0011 15.1581C18.0011 15.2237 18.014 15.2888 18.0391 15.3495C18.0643 15.4101 18.1011 15.4653 18.1475 15.5117C18.1939 15.5582 18.249 15.5951 18.3097 15.6202C18.3704 15.6454 18.4354 15.6583 18.5011 15.6583C18.5667 15.6584 18.6318 15.6455 18.6925 15.6203C18.7532 15.5952 18.8083 15.5584 18.8547 15.512L20.6837 13.6825C22.4387 11.9275 22.4387 9.07249 20.6837 7.31749L20.6842 7.31649Z" />
    </svg>
  );
}

// ─── TicketDetailHeader ───────────────────────────────────────────────────────

export default function TicketDetailHeader({ ticket, onBack, onRequestApproval, onRouteToHR, onCreateTicketHR, onCloseAndMove, readOnly = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div
      className="shrink-0 flex items-center justify-between bg-[var(--surface)]"
      style={{ height: 72, padding: '0 24px', borderBottom: '1px solid var(--border)' }}
    >
      {/* Left: breadcrumb + title */}
      <div className="flex flex-col gap-0.5 min-w-0 mr-6">
        <div className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-weak)' }}>
          <button
            type="button"
            onClick={onBack}
            className="border-0 bg-transparent p-0 cursor-pointer hover:underline transition-colors"
            style={{ fontSize: 12, color: 'var(--text-weak)' }}
          >
            Tickets
          </button>
          <span style={{ color: 'var(--text-disabled)' }}>/</span>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>{ticket.id}</span>
        </div>
        <h1
          className="truncate"
          style={{ fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '-0.2px', color: 'var(--text)', maxWidth: 600 }}
        >
          {ticket.name}
        </h1>
      </div>

      {/* Right: icon buttons */}
      <div className="flex items-center shrink-0" style={{ gap: 8 }}>
        <button
          type="button"
          aria-label="Copy link"
          className="flex items-center justify-center cursor-pointer transition-colors"
          style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--icon)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LinkIcon />
        </button>

        {!readOnly && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              type="button"
              aria-label="More options"
              className="flex items-center justify-center cursor-pointer transition-colors"
              style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: menuOpen ? 'var(--background-medium)' : 'transparent', color: 'var(--icon)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
              onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
              onClick={() => setMenuOpen(o => !o)}
            >
              <DotsIcon />
            </button>

            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', border: '1px solid var(--border)', borderRadius: 6, boxShadow: 'var(--shadow-md)', background: 'var(--surface)', zIndex: 50, minWidth: 200, padding: '4px 0' }}>
                <button
                  type="button"
                  className="w-full text-left cursor-pointer border-0 bg-transparent"
                  style={{ padding: '7px 12px', fontSize: 13, color: 'var(--text)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setMenuOpen(false); onRequestApproval?.(); }}
                >
                  Request approval
                </button>

                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                <button
                  type="button"
                  className="w-full text-left cursor-pointer border-0 bg-transparent"
                  style={{ padding: '7px 12px', fontSize: 13, color: 'var(--text)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setMenuOpen(false); onCreateTicketHR?.(); }}
                >
                  Create ticket for HR
                </button>
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                <button
                  type="button"
                  className="w-full text-left cursor-pointer border-0 bg-transparent"
                  style={{ padding: '7px 12px', fontSize: 13, color: 'var(--text)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setMenuOpen(false); onRouteToHR?.(); }}
                >
                  Route to HR
                </button>

                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                <button
                  type="button"
                  className="w-full text-left cursor-pointer border-0 bg-transparent"
                  style={{ padding: '7px 12px', fontSize: 13, color: 'var(--text)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setMenuOpen(false); onCloseAndMove?.(); }}
                >
                  Close ticket and move to Asana
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
