// ─── Button — shared button primitive ────────────────────────────────────────
// Props:
//   variant  'primary' | 'outline' | 'ghost' | 'destructive'  (default: 'outline')
//   size     'sm' | 'md' | 'icon'                              (default: 'md')
//   className  extra Tailwind classes
//   ...rest  forwarded to <button>

const BASE =
  'inline-flex items-center gap-1.5 cursor-pointer border-0 transition-colors duration-150 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium text-sm';

const VARIANTS = {
  primary:     'bg-primary text-primary-text hover:bg-primary-hover rounded-lg',
  outline:     'bg-background-weak border border-border text-text hover:bg-background-medium rounded-lg',
  ghost:       'bg-transparent text-text-weak hover:bg-[var(--background-hover)] hover:text-text rounded-lg',
  destructive: 'bg-danger-strong text-white hover:opacity-90 rounded-lg',
};

const SIZES = {
  sm:   'h-7 px-2.5 text-xs',
  md:   'h-8 px-3.5',
  icon: 'h-8 w-8 justify-center',
};

export default function Button({
  variant = 'outline',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type="button"
      className={[BASE, VARIANTS[variant] ?? VARIANTS.outline, SIZES[size] ?? SIZES.md, className].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
