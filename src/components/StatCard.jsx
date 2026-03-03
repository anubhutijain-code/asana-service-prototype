// ─── StatCard ──────────────────────────────────────────────────────────────────
// Dashboard metric card matching Frame 1010105282.svg
// Layout: label + more button (top) · large value (mid) · trend row (bottom)

// ── Icons ─────────────────────────────────────────────────────────────────────

// Three horizontal dots — exact paths from SVG clip rect (260 20 12 12)
function MoreIcon() {
  return (
    <svg viewBox="260 20 12 12" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M259.999 26C259.999 25.6685 260.131 25.3505 260.365 25.1161C260.6 24.8817 260.918 24.75 261.249 24.75C261.581 24.75 261.898 24.8817 262.133 25.1161C262.367 25.3505 262.499 25.6685 262.499 26C262.499 26.3315 262.367 26.6495 262.133 26.8839C261.898 27.1183 261.581 27.25 261.249 27.25C260.918 27.25 260.6 27.1183 260.365 26.8839C260.131 26.6495 259.999 26.3315 259.999 26Z
             M265.999 24.75C265.668 24.75 265.35 24.8817 265.115 25.1161C264.881 25.3505 264.749 25.6685 264.749 26C264.749 26.3315 264.881 26.6495 265.115 26.8839C265.35 27.1183 265.668 27.25 265.999 27.25C266.331 27.25 266.648 27.1183 266.883 26.8839C267.117 26.6495 267.249 26.3315 267.249 26C267.249 25.6685 267.117 25.3505 266.883 25.1161C266.648 24.8817 266.331 24.75 265.999 24.75Z
             M270.749 24.75C270.418 24.75 270.1 24.8817 269.865 25.1161C269.631 25.3505 269.499 25.6685 269.499 26C269.499 26.3315 269.631 26.6495 269.865 26.8839C270.1 27.1183 270.418 27.25 270.749 27.25C271.081 27.25 271.398 27.1183 271.633 26.8839C271.867 26.6495 271.999 26.3315 271.999 26C271.999 25.6685 271.867 25.3505 271.633 25.1161C271.398 24.8817 271.081 24.75 270.749 24.75Z" />
    </svg>
  );
}

// Upward arrow — exact path from SVG (viewBox 17 101 9 10).
// Flip with className="rotate-180" for a downward-trend variant.
function TrendArrow({ color, down }) {
  return (
    <svg
      viewBox="17 101 9 10"
      className={`w-2.5 h-2.5 shrink-0 ${down ? 'rotate-180' : ''}`}
      fill={color}
      aria-hidden="true"
    >
      <path d="M21.8534 101.147C21.807 101.1 21.7519 101.063 21.6913 101.038C21.6306 101.013 21.5656 101 21.4999 101C21.4343 101 21.3692 101.013 21.3086 101.038C21.2479 101.063 21.1928 101.1 21.1464 101.147L17.3964 104.897C17.35 104.943 17.3132 104.998 17.2881 105.059C17.2629 105.119 17.25 105.184 17.25 105.25C17.25 105.316 17.2629 105.381 17.2881 105.441C17.3132 105.502 17.35 105.557 17.3964 105.604C17.4428 105.65 17.498 105.687 17.5586 105.712C17.6193 105.737 17.6843 105.75 17.7499 105.75C17.8156 105.75 17.8806 105.737 17.9412 105.712C18.0019 105.687 18.057 105.65 18.1034 105.604L20.9999 102.707V110.5C20.9999 110.633 21.0526 110.76 21.1464 110.854C21.2401 110.947 21.3673 111 21.4999 111C21.6325 111 21.7597 110.947 21.8535 110.854C21.9472 110.76 21.9999 110.633 21.9999 110.5V102.707L24.8964 105.604C24.9428 105.65 24.9978 105.687 25.0585 105.712C25.1192 105.738 25.1842 105.751 25.2499 105.751C25.3156 105.751 25.3807 105.738 25.4414 105.712C25.502 105.687 25.5571 105.65 25.6034 105.604C25.6499 105.557 25.6868 105.502 25.7119 105.441C25.7371 105.381 25.75 105.316 25.75 105.25C25.75 105.184 25.7371 105.119 25.7119 105.059C25.6868 104.998 25.6499 104.943 25.6034 104.897L21.8534 101.147Z" />
    </svg>
  );
}

// ── Trend color tokens ─────────────────────────────────────────────────────────
// Matches SVG: icon uses lighter tint, text uses darker shade for same sentiment.
const TREND = {
  good: { icon: 'var(--success-background-strong)', text: 'var(--success-text)' },
  bad:  { icon: 'var(--warning-background-strong)', text: 'var(--warning-text)' },
};

// ── StatCard ───────────────────────────────────────────────────────────────────

export default function StatCard({ label, value, trend, trendGood }) {
  const { icon: iconColor, text: textColor } = TREND[trendGood ? 'good' : 'bad'];

  return (
    <div className="flex-1 min-w-0 bg-background-weak border border-border rounded-lg p-5
                    flex flex-col justify-between min-h-[134px]">

      {/* ── Top group: label + more, then value ───────────────────────────── */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs leading-snug text-text-weak">{label}</span>
          <button
            type="button"
            aria-label="More options"
            className="text-text-disabled hover:text-text-weak transition-colors shrink-0
                       border-0 bg-transparent cursor-pointer p-0 -mt-0.5"
          >
            <MoreIcon />
          </button>
        </div>

        <p className="mt-3 text-2xl font-semibold leading-none text-text">
          {value}
        </p>
      </div>

      {/* ── Bottom: trend row ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-xs" style={{ color: textColor }}>
        <TrendArrow color={iconColor} down={!trendGood} />
        {trend}
      </div>

    </div>
  );
}
