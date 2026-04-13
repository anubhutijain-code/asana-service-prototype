/**
 * Banner — inline message banner component
 *
 * Props:
 *   variant   'neutral' | 'warning' | 'attention' | 'critical' | 'success' | 'info'
 *   message   string | ReactNode  — the banner text
 *   label     string              — optional action button label
 *   onLabel   () => void          — handler for label button click
 *   onDismiss () => void          — if provided, shows × dismiss button
 *   inline    bool                — compact single-row height (default false)
 */

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ─── Variant tokens ────────────────────────────────────────────────────────────
const VARIANTS = {
  neutral: {
    bg:          'var(--background-medium)',
    text:        'var(--text)',
    labelBg:     'transparent',
    labelBorder: 'var(--border-strong)',
    labelText:   'var(--text-weak)',
    labelFilled: false,
  },
  warning: {
    bg:          'var(--warning-background)',
    text:        'var(--warning-text)',
    labelBg:     'transparent',
    labelBorder: 'var(--warning-background-strong)',
    labelText:   'var(--warning-text)',
    labelFilled: false,
  },
  attention: {
    bg:          'var(--attention-background)',
    text:        'var(--attention-text)',
    labelBg:     'var(--attention-background-strong)',
    labelBorder: 'var(--attention-background-strong)',
    labelText:   '#fff',
    labelFilled: true,
  },
  critical: {
    bg:          'var(--danger-background)',
    text:        'var(--danger-text)',
    labelBg:     'var(--danger-background-strong)',
    labelBorder: 'var(--danger-background-strong)',
    labelText:   '#fff',
    labelFilled: true,
  },
  success: {
    bg:          'var(--success-background)',
    text:        'var(--success-text)',
    labelBg:     'transparent',
    labelBorder: 'var(--success-background-strong)',
    labelText:   'var(--success-text)',
    labelFilled: false,
  },
  info: {
    bg:          'var(--selected-background)',
    text:        'var(--selected-text)',
    labelBg:     'transparent',
    labelBorder: 'var(--selected-background-strong)',
    labelText:   'var(--selected-text)',
    labelFilled: false,
  },
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
function InfoIcon({ color }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.5"/>
      <path d="M8 7v4M8 5.5v.5"/>
    </svg>
  );
}
function WarningIcon({ color }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M8 2L1.5 13.5h13L8 2z"/>
      <path d="M8 6.5v3.5M8 11.5v.5"/>
    </svg>
  );
}
function BellIcon({ color }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M8 2a4 4 0 0 1 4 4v3l1.5 2h-11L4 9V6a4 4 0 0 1 4-4z"/>
      <path d="M6.5 13a1.5 1.5 0 0 0 3 0"/>
    </svg>
  );
}
function CheckIcon({ color }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.5"/>
      <path d="M5 8l2 2 4-4"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
      <path d="M2 2l8 8M10 2L2 10"/>
    </svg>
  );
}

const ICONS = {
  neutral:   (c) => <InfoIcon color={c} />,
  warning:   (c) => <WarningIcon color={c} />,
  attention: (c) => <BellIcon color={c} />,
  critical:  (c) => <WarningIcon color={c} />,
  success:   (c) => <CheckIcon color={c} />,
  info:      (c) => <InfoIcon color={c} />,
};

// ─── Banner ────────────────────────────────────────────────────────────────────
export default function Banner({ variant = 'neutral', message, label, onLabel, onDismiss, inline = false }) {
  const v = VARIANTS[variant] ?? VARIANTS.neutral;
  const icon = ICONS[variant]?.(v.text);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: inline ? '6px 12px' : '10px 14px',
      borderRadius: 8,
      background: v.bg,
      minHeight: inline ? 36 : 44,
    }}>
      {/* Icon */}
      {icon}

      {/* Message */}
      <span style={{
        fontFamily: SFT,
        fontSize: 13,
        fontWeight: 500,
        color: v.text,
        flex: 1,
        lineHeight: '18px',
      }}>
        {message}
      </span>

      {/* Label action button */}
      {label && onLabel && (
        <button
          type="button"
          onClick={onLabel}
          style={{
            height: 26, padding: '0 10px', borderRadius: 5,
            border: `1px solid ${v.labelBorder}`,
            background: v.labelFilled ? v.labelBg : 'transparent',
            color: v.labelText,
            fontFamily: SFT, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          {label}
        </button>
      )}

      {/* Dismiss */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            width: 24, height: 24, borderRadius: 4, border: 'none',
            background: 'transparent', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: v.text, opacity: 0.6, transition: 'opacity 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; }}
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
