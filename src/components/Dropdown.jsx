import { useState, useRef, useEffect } from 'react';

// ─── Checkmark icon (from Figma dropdown.svg) ─────────────────────────────────

function CheckIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path
        d="M10.78 1.72L4.5 8 1.03 4.53a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l7-7a.75.75 0 0 0-1.06-1.06l.03.13Z"
        fill="#757677"
      />
    </svg>
  );
}

// ─── Chevron icon for the trigger ─────────────────────────────────────────────

function ChevronDown() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M1 1l4 4 4-4" stroke="#9ea0a2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
//
// Props:
//   value      – currently selected value (string)
//   onChange   – called with the new value string
//   options    – string[] or {value, label}[]
//   placeholder – shown when nothing is selected
//   style      – optional overrides for the trigger button

export default function Dropdown({ value, onChange, options, placeholder = 'Select…', style }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Normalise options to [{value, label}]
  const items = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const selectedLabel = items.find(o => o.value === value)?.label ?? '';

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <div ref={rootRef} style={{ position: 'relative', width: '100%' }}>

      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', height: 42,
          padding: '0 13px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: `1.5px solid ${open ? '#3F6AC4' : '#EDEAE9'}`,
          borderRadius: 8,
          fontSize: 14,
          color: selectedLabel ? '#1E1F21' : '#9ea0a2',
          background: 'white',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
          outline: 'none',
          transition: 'border-color 0.15s',
          ...style,
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown />
      </button>

      {/* ── Popup panel (matches Figma dropdown.svg) ────────────────────── */}
      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 200,
            background: 'white',
            border: '1px solid #E0E1E3',
            borderRadius: 4,
            boxShadow: '0 5px 20px rgba(109,110,111,0.08)',
            overflow: 'hidden',
          }}
        >
          {items.map(opt => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  width: '100%', height: 36,
                  // 34px left padding: 12px edge + 10px checkmark + 12px gap
                  padding: '0 14px 0 34px',
                  position: 'relative',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#1D1F21',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F5F5F4'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
              >
                {selected && (
                  <span style={{
                    position: 'absolute', left: 12,
                    top: '50%', transform: 'translateY(-50%)',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <CheckIcon />
                  </span>
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
