// ─── Badge — status/category label pill ──────────────────────────────────────
// Props:
//   variant  'success'|'warning'|'danger'|'info'|'neutral'
//            OR pass a status string directly (auto-derived)
//   size     'sm' | 'md'  (default: 'md')
//   children  label text
//   className  extra classes

const SUCCESS_STATUSES = new Set(['Resolved', 'Compliant', 'Active']);
const WARNING_STATUSES = new Set(['In Progress', 'On Hold', 'EOL planned', 'On hold', 'Investigating']);
const DANGER_STATUSES  = new Set(['Non compliant', 'Inactive', 'EOL grace period', 'Overdue', 'Critical']);

export function deriveVariant(status) {
  if (SUCCESS_STATUSES.has(status)) return 'success';
  if (WARNING_STATUSES.has(status)) return 'warning';
  if (DANGER_STATUSES.has(status))  return 'danger';
  return 'neutral';
}

const VARIANT_CLASSES = {
  neutral: 'bg-background-medium text-text-weak',
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger:  'bg-danger-bg text-danger-text',
  info:    'bg-selected text-selected-text',
};

const SIZE_CLASSES = {
  sm: 'text-[11px] h-[18px] px-1.5 rounded',
  md: 'text-xs h-5 px-2 rounded',
};

const KNOWN_VARIANTS = new Set(['success', 'warning', 'danger', 'info', 'neutral']);

export default function Badge({
  variant,
  size = 'md',
  children,
  className = '',
}) {
  // If variant looks like a status string, auto-derive
  const resolvedVariant = KNOWN_VARIANTS.has(variant) ? variant : deriveVariant(variant ?? children);

  return (
    <span
      className={[
        'inline-flex items-center font-medium whitespace-nowrap leading-none',
        VARIANT_CLASSES[resolvedVariant] ?? VARIANT_CLASSES.neutral,
        SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
