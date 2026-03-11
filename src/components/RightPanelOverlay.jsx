// ─── RightPanelOverlay ────────────────────────────────────────────────────────
// Absolutely-positioned right panel that overlays its parent container.
// Parent must be a containing block (position: relative or similar).
//
// Props:
//   open     — whether panel is visible
//   onClose  — called when scrim is clicked
//   width    — CSS width value string (default 'min(700px, 50%)') OR px number
//   children — panel content

export default function RightPanelOverlay({ open, onClose, width = 'min(700px, 50%)', children }) {
  if (!open) return null;

  const cssWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', justifyContent: 'flex-end' }}
    >
      {/* Scrim */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: cssWidth,
          height: '100%',
          background: 'white',
          borderLeft: '1px solid #EDEAE9',
          boxShadow: '-6px 0 24px rgba(0,0,0,0.09)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
