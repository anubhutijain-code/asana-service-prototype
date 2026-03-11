// ─── Toolbar — standard project/list toolbar bar ──────────────────────────────
// display: flex; height: 56px; padding: 14px 20px; justify-content: space-between;
// align-items: center; align-self: stretch;

export default function Toolbar({ left, right, style }) {
  return (
    <div style={{
      display: 'flex',
      height: 56,
      padding: '14px 20px',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
      flexShrink: 0,
      borderBottom: '1px solid var(--border)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {left}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {right}
      </div>
    </div>
  );
}
