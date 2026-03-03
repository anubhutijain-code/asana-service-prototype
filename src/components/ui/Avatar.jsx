// ─── Avatar — initials or photo avatar ───────────────────────────────────────
// Props:
//   name      string — used for initials + bg color hash
//   src       URL string — renders <img> when provided
//   size      number in px (default: 28)
//   bg        hex override for initials background
//   className extra classes

const DEFAULT_PALETTE = ['#d2c3ec', '#4573d2', '#5da283', '#8d84e8', '#f1bd6c', '#e88fa0'];

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function hashName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

export default function Avatar({ name = '', src, size = 28, bg, className = '' }) {
  const style = { width: size, height: size, borderRadius: '50%', flexShrink: 0 };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={`object-cover ${className}`}
        style={style}
      />
    );
  }

  const initials = getInitials(name);
  const bgColor  = bg ?? DEFAULT_PALETTE[hashName(name) % DEFAULT_PALETTE.length];
  const fontSize = Math.round(size * 0.4);

  return (
    <div
      className={`inline-flex items-center justify-center font-medium text-white shrink-0 ${className}`}
      style={{ ...style, background: bgColor, fontSize }}
      aria-label={name || 'avatar'}
    >
      {initials}
    </div>
  );
}
