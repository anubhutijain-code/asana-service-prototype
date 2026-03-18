// ─── TicketMoreMenu ────────────────────────────────────────────────────────────
// Drop-in "⋯" button + dropdown for any ticket row.
// Props:
//   ticketId  — string id passed back to onAction
//   onAction  — (actionId, ticketId) => void
//     actionId values: 'assign_to_me' | 'change_priority' | 'mark_resolved' | 'close_and_move'
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif';

const ACTIONS = [
  { id: 'assign_to_me',    label: 'Assign to me' },
  { id: 'change_priority', label: 'Change priority' },
  { id: 'mark_resolved',   label: 'Mark as resolved' },
  { id: '__divider__' },
  { id: 'close_and_move',  label: 'Close ticket and move to Asana' },
];

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3"  cy="8" r="1.3" />
      <circle cx="8"  cy="8" r="1.3" />
      <circle cx="13" cy="8" r="1.3" />
    </svg>
  );
}

export default function TicketMoreMenu({ ticketId, onAction }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0 });
  const btnRef  = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function down(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current  && !btnRef.current.contains(e.target)
      ) setOpen(false);
    }
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [open]);

  function toggle(e) {
    e.stopPropagation();
    if (open) { setOpen(false); return; }
    const rect  = btnRef.current.getBoundingClientRect();
    const menuW = 228;
    const menuH = (ACTIONS.length + 1) * 36;
    const left  = Math.max(8, Math.min(rect.right - menuW, window.innerWidth - menuW - 8));
    const top   = (window.innerHeight - rect.bottom) > menuH
                    ? rect.bottom + 4
                    : rect.top - menuH - 4;
    setPos({ top, left });
    setOpen(true);
  }

  function act(e, id) {
    e.stopPropagation();
    setOpen(false);
    onAction?.(id, ticketId);
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="More actions"
        style={{
          width: 28, height: 28, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', borderRadius: 6,
          background: open ? 'var(--background-medium)' : 'transparent',
          cursor: 'pointer', color: 'var(--text-weak)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <DotsIcon />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed', top: pos.top, left: pos.left,
            zIndex: 9999, background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 8,
            boxShadow: 'var(--shadow-lg)',
            minWidth: 228, padding: '4px 0',
          }}
        >
          {ACTIONS.map((action, i) =>
            action.id === '__divider__' ? (
              <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            ) : (
              <button
                key={action.id}
                type="button"
                onClick={e => act(e, action.id)}
                style={{
                  display: 'block', width: '100%', padding: '7px 14px',
                  border: 'none', background: 'transparent', textAlign: 'left',
                  fontSize: 13, fontFamily: SFT,
                  color: action.id === 'close_and_move' ? 'var(--selected-text)' : 'var(--text)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-weak)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {action.label}
              </button>
            )
          )}
        </div>,
        document.body
      )}
    </>
  );
}
