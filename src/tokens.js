// ─── Asana Design Tokens ──────────────────────────────────────────────────────
// Single source of truth for all design system values.
// Sourced from AsanaService.mhtml CSS custom properties.

export const colors = {
  // Surfaces
  bgApp:       '#f5f5f4',   // nav bar, mode sidebar bg
  bgWhite:     '#ffffff',
  bgPill:      '#F9F8F8',   // pill / badge background
  bgHover:     '#fafafa',   // table row hover

  // Borders
  border:      '#e0e1e3',   // --color-border
  borderActive:'#757677',   // --color-border-active (tab underline)

  // Text
  text:        '#1E1F21',   // --color-text (primary)
  textWeak:    '#626364',   // --color-text-weak
  textMuted:   '#9ea0a2',   // placeholder / disabled

  // Nav
  navBg:       '#ebebea',   // active / hover nav bg
  navActive:   '#371717',   // active nav text + icon
  navInactive: '#8c8c8c',   // inactive nav icon
  navSecText:  '#4a4a4a',   // secondary nav text

  // Brand
  brand:       '#ff584a',   // coral — create button, badge, logo mark
  brandHover:  '#f13b27',

  // Status / semantic
  success:     '#14865e',
  warning:     '#865a1c',
  danger:      '#b4304c',
  info:        '#335fb5',

  // Icon muted
  iconMuted:   '#6D6E6F',
};
