// ─── Shared Pill ──────────────────────────────────────────────────────────────
// Used for priority, status, and category pills across all views.
//
// Props:
//   label     — text content
//   icon      — optional ReactNode shown left of label
//   bg        — background color  (default #F9F8F8)
//   color     — text/icon color   (default #1E1F21)
//   border    — optional border color (e.g. status pills in sidebar)
//   dropdown  — show chevron on right (makes pill a button affordance)
//   as        — 'span' (default) | 'button'

function DropdownChevron() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M9.09175 3.92542L5.99875 6.52092L2.90575 3.92542C2.75338 3.79758 2.55647 3.73551 2.35834 3.75286C2.16021 3.77021 1.97708 3.86555 1.84925 4.01792C1.72141 4.17029 1.65934 4.36719 1.67669 4.56533C1.69404 4.76346 1.78938 4.94658 1.94175 5.07442L5.51675 8.07442C5.65172 8.1879 5.82241 8.25011 5.99875 8.25011C6.17509 8.25011 6.34577 8.1879 6.48075 8.07442L10.0557 5.07442C10.2047 4.94558 10.2971 4.7633 10.3128 4.56695C10.3285 4.37061 10.2663 4.17597 10.1397 4.02507C10.0131 3.87418 9.83224 3.77914 9.63615 3.76049C9.44007 3.74185 9.24452 3.80109 9.09175 3.92542Z" />
    </svg>
  );
}

export default function Pill({
  label,
  icon,
  bg = '#F9F8F8',
  color = '#1E1F21',
  border,
  dropdown = false,
  as: Tag = 'span',
  ...rest
}) {
  return (
    <Tag
      {...(Tag === 'button' ? { type: 'button' } : {})}
      {...rest}
      className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: bg,
        color,
        border: border ? `1px solid ${border}` : 'none',
        cursor: Tag === 'button' ? 'pointer' : undefined,
      }}
    >
      {icon}
      {label}
      {dropdown && <DropdownChevron />}
    </Tag>
  );
}
