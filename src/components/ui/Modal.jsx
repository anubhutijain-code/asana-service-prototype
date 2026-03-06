// ─── Modal ─────────────────────────────────────────────────────────────────────
// Portal-based, controlled modal component.
//
// Exports:
//   default Modal          — SimpleModal (header + scrollable body + optional footer)
//   AnnouncementModal      — left illustration panel + right content
//   ModalButton            — styled footer button (variant: primary | secondary | danger)
//
// Props (Modal & AnnouncementModal):
//   open          — boolean, controls visibility
//   onClose       — called on X click, backdrop click, or Escape key
//   title         — string header title
//   children      — body content
//   footer        — ReactNode rendered in footer bar (right-aligned)
//   size          — 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
//   closeOnBackdrop — boolean (default: true)
//
// AnnouncementModal extra props:
//   illustration  — ReactNode rendered inside the colored panel
//   illustrationBg — CSS color string (default: '#FFE4E6')

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const SIZES = { sm: 400, md: 520, lg: 640, xl: 800 };

// ─── Icons ─────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

// ─── Shared hooks ─────────────────────────────────────────────────────────────

function useModalEffects(open, onClose) {
  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────

function Backdrop({ onClick }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }}
      onClick={onClick}
    />
  );
}

// ─── Modal header ─────────────────────────────────────────────────────────────

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '15px 20px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      <div>
        <div style={{ fontFamily: SFT, fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: '22px' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)', marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', borderRadius: 6, cursor: 'pointer',
          background: 'transparent', color: 'var(--text-disabled)',
          flexShrink: 0, marginLeft: 12,
          transition: 'background 0.1s, color 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

// ─── Modal footer ─────────────────────────────────────────────────────────────

function ModalFooterBar({ footer }) {
  if (!footer) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
      padding: '14px 20px',
      borderTop: '1px solid var(--border)',
      flexShrink: 0,
    }}>
      {footer}
    </div>
  );
}

// ─── ModalButton ──────────────────────────────────────────────────────────────

export function ModalButton({ variant = 'secondary', onClick, disabled = false, type = 'button', children }) {
  const styles = {
    primary: {
      background: 'var(--selected-background-strong)',
      color: 'var(--selected-text-strong)',
      border: 'none',
      hoverOpacity: '0.85',
    },
    secondary: {
      background: 'var(--background-weak)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
      hoverBg: 'var(--background-medium)',
      hoverBorder: 'var(--border-strong)',
    },
    danger: {
      background: 'var(--danger-background)',
      color: 'var(--danger-text)',
      border: '1px solid var(--danger-background-strong)',
      hoverBg: '#ffd8de',
    },
  };
  const s = styles[variant] ?? styles.secondary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 32, padding: '0 14px',
        fontSize: 13, fontFamily: SFT, fontWeight: 500,
        borderRadius: 6,
        border: s.border ?? 'none',
        background: s.background,
        color: s.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'all 0.1s',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.opacity = s.hoverOpacity;
        if (s.hoverBg) e.currentTarget.style.background = s.hoverBg;
        if (s.hoverBorder) e.currentTarget.style.borderColor = s.hoverBorder;
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.background = s.background;
        if (s.border) e.currentTarget.style.borderColor = '';
      }}
    >
      {children}
    </button>
  );
}

// ─── Modal (SimpleModal) ───────────────────────────────────────────────────────

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  useModalEffects(open, onClose);
  if (!open) return null;

  const width = SIZES[size] ?? SIZES.md;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <Backdrop onClick={closeOnBackdrop ? onClose : undefined} />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative', zIndex: 1,
          width, maxWidth: '100%',
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--background-weak)',
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <ModalHeader title={title} subtitle={subtitle} onClose={onClose} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {children}
        </div>

        <ModalFooterBar footer={footer} />
      </div>
    </div>,
    document.body
  );
}

// ─── AnnouncementModal ────────────────────────────────────────────────────────
// Left colored illustration panel + right content column.
// Total width = size prop; illustration panel is fixed ~220px.

export function AnnouncementModal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'lg',
  closeOnBackdrop = true,
  illustration = null,
  illustrationBg = '#FFE4E6',
}) {
  useModalEffects(open, onClose);
  if (!open) return null;

  const width = SIZES[size] ?? SIZES.lg;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <Backdrop onClick={closeOnBackdrop ? onClose : undefined} />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative', zIndex: 1,
          width, maxWidth: '100%',
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--background-weak)',
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        {/* Illustration panel */}
        <div style={{
          width: 220, flexShrink: 0,
          background: illustrationBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          padding: 24,
        }}>
          {illustration}
        </div>

        {/* Content column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <ModalHeader title={title} onClose={onClose} />

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {children}
          </div>

          <ModalFooterBar footer={footer} />
        </div>
      </div>
    </div>,
    document.body
  );
}
