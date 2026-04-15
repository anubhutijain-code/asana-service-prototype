// Shared ticket table cells — used by TicketsDashboard and HRTicketsDashboard
import { SFT, SFM, LIGA } from '../../constants/typography';
import Pill from '../Pill';
import Avatar from './Avatar';

// ─── Cell typography constants ────────────────────────────────────────────────
export const typoTicketNo = { fontFamily: SFM, fontSize: '12px', fontWeight: 500, lineHeight: '22px', color: 'var(--text-disabled)', ...LIGA };
export const typoName     = { fontFamily: SFT, fontSize: '14px', fontWeight: 400, lineHeight: '22px', letterSpacing: '-0.15px', color: 'var(--text)', ...LIGA };
export const typoPriority = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA };
export const typoStatus   = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text)', ...LIGA };
export const typoUpdated  = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA };
export const typoPerson   = { fontFamily: SFT, fontSize: '14px', fontWeight: 400, lineHeight: '22px', letterSpacing: '-0.15px', color: 'var(--text)', ...LIGA };

// ─── Status icon ──────────────────────────────────────────────────────────────

export function StatusIcon({ status }) {
  if (status === 'Not started') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M10 8C7.7945 8 6 9.7945 6 12C6 14.2055 7.7945 16 10 16C12.2055 16 14 14.2055 14 12C14 9.795 12.2055 8 10 8ZM10 15C8.3455 15 7 13.6545 7 12C7 10.3455 8.3455 9 10 9C11.6545 9 13 10.3455 13 12C13 13.6545 11.6545 15 10 15Z" fill="var(--icon)"/>
    </svg>
  );
  if (status === 'On hold') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M10 6C6.692 6 4 8.6915 4 12C4 15.3085 6.692 18 10 18C13.309 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.2435 17 5 14.757 5 12C5 9.243 7.2435 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12 9.5L12 14.5C12 14.6326 11.9473 14.7598 11.8536 14.8536C11.7598 14.9473 11.6326 15 11.5 15C11.3674 15 11.2402 14.9473 11.1464 14.8536C11.0527 14.7598 11 14.6326 11 14.5L11 9.5C11 9.36739 11.0527 9.24021 11.1464 9.14645C11.2402 9.05268 11.3674 9 11.5 9C11.6326 9 11.7598 9.05268 11.8536 9.14645C11.9473 9.24021 12 9.36739 12 9.5ZM9 9.5L9 14.5C9 14.6326 8.94732 14.7598 8.85355 14.8536C8.75979 14.9473 8.63261 15 8.5 15C8.36739 15 8.24021 14.9473 8.14645 14.8536C8.05268 14.7598 8 14.6326 8 14.5L8 9.5C8 9.36739 8.05268 9.24021 8.14645 9.14645C8.24021 9.05268 8.36739 9 8.5 9C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5Z" fill="#F1BD6C"/>
    </svg>
  );
  if (status === 'Investigating') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <circle cx="10" cy="12" r="5.5" stroke="var(--selected-text)" fill="none"/>
      <path d="M7 12H13M13 12L11 10M13 12L11 14" stroke="var(--selected-text)" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (status === 'Resolved') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M10 6C6.6915 6 4 8.6915 4 12C4 15.3085 6.6915 18 10 18C13.3085 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.243 17 5 14.757 5 12C5 9.243 7.243 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12.8535 10.1465C12.9 10.1929 12.9368 10.248 12.962 10.3087C12.9872 10.3693 13.0001 10.4343 13.0001 10.5C13.0001 10.5657 12.9872 10.6307 12.962 10.6913C12.9368 10.752 12.9 10.8071 12.8535 10.8535L9.52 14.187C9.47367 14.2336 9.41859 14.2706 9.35793 14.2958C9.29726 14.321 9.2322 14.334 9.1665 14.334C9.1008 14.334 9.03574 14.321 8.97507 14.2958C8.91441 14.2706 8.85933 14.2336 8.813 14.187L7.1465 12.52C7.05275 12.4262 7.00008 12.2991 7.00008 12.1665C7.00008 12.0339 7.05275 11.9068 7.1465 11.813C7.24025 11.7192 7.36741 11.6666 7.5 11.6666C7.63259 11.6666 7.75975 11.7192 7.8535 11.813L9.1665 13.1265L12.1465 10.1465C12.1929 10.1 12.248 10.0632 12.3087 10.038C12.3693 10.0128 12.4343 9.9999 12.5 9.9999C12.5657 9.9999 12.6307 10.0128 12.6913 10.038C12.752 10.0632 12.8071 10.1 12.8535 10.1465Z" fill="var(--success-text)"/>
    </svg>
  );
  if (status === 'AI Deflected') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <circle cx="10" cy="12" r="5" stroke="var(--selected-text)" fill="none"/>
      <path d="M8.5 12L9.8 13.3L11.5 11" stroke="var(--selected-text)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (status === 'Routed') return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5.5" stroke="var(--icon)"/>
      <path d="M3.5 6H8.5M8.5 6L6.5 4M8.5 6L6.5 8" stroke="var(--icon)" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  // In Progress / Closed
  return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M10 6C6.6915 6 4 8.6915 4 12C4 15.3085 6.6915 18 10 18C13.3085 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.243 17 5 14.757 5 12C5 9.243 7.243 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12.8535 10.1465C12.9 10.1929 12.9368 10.248 12.962 10.3087C12.9872 10.3693 13.0001 10.4343 13.0001 10.5C13.0001 10.5657 12.9872 10.6307 12.962 10.6913C12.9368 10.752 12.9 10.8071 12.8535 10.8535L9.52 14.187C9.47367 14.2336 9.41859 14.2706 9.35793 14.2958C9.29726 14.321 9.2322 14.334 9.1665 14.334C9.1008 14.334 9.03574 14.321 8.97507 14.2958C8.91441 14.2706 8.85933 14.2336 8.813 14.187L7.1465 12.52C7.05275 12.4262 7.00008 12.2991 7.00008 12.1665C7.00008 12.0339 7.05275 11.9068 7.1465 11.813C7.24025 11.7192 7.36741 11.6666 7.5 11.6666C7.63259 11.6666 7.75975 11.7192 7.8535 11.813L9.1665 13.1265L12.1465 10.1465C12.1929 10.1 12.248 10.0632 12.3087 10.038C12.3693 10.0128 12.4343 9.9999 12.5 9.9999C12.5657 9.9999 12.6307 10.0128 12.6913 10.038C12.752 10.0632 12.8071 10.1 12.8535 10.1465Z" fill="var(--icon)"/>
    </svg>
  );
}

// ─── SLA clock icon ───────────────────────────────────────────────────────────

const SLA_RING    = "M20 14.0001C20 17.3129 17.3137 19.9984 14 19.9984C10.6863 19.9984 8 17.3129 8 14.0001C8 10.6873 10.6863 8.00171 14 8.00171C17.3137 8.00171 20 10.6873 20 14.0001ZM9.14 14.0001C9.14 16.6834 11.3159 18.8587 14 18.8587C16.6841 18.8587 18.86 16.6834 18.86 14.0001C18.86 11.3167 16.6841 9.1414 14 9.1414C11.3159 9.1414 9.14 11.3167 9.14 14.0001Z";
const SLA_ARC_LEFT   = "M8.83576 12.322C8.53637 12.2248 8.21195 12.3883 8.14351 12.6956C7.97981 13.4305 7.95554 14.1915 8.07387 14.9386C8.22199 15.8738 8.58935 16.7607 9.1459 17.5267C9.70245 18.2927 10.4324 18.9162 11.2761 19.346C11.95 19.6894 12.6812 19.9015 13.4308 19.9729C13.7442 20.0028 14 19.7448 14 19.43C14 19.1152 13.7439 18.8634 13.4313 18.8266C12.8618 18.7595 12.3072 18.592 11.7936 18.3303C11.1102 17.9821 10.519 17.4771 10.0682 16.8566C9.61737 16.2362 9.31981 15.5178 9.19984 14.7603C9.10967 14.191 9.12172 13.6117 9.23388 13.0494C9.29546 12.7406 9.13516 12.4193 8.83576 12.322Z";
const SLA_ARC_BOTTOM = "M12.322 19.1674C12.2248 19.4668 12.3883 19.7912 12.6956 19.8597C13.4305 20.0234 14.1915 20.0476 14.9386 19.9293C15.8738 19.7812 16.7607 19.4138 17.5267 18.8573C18.2927 18.3007 18.9162 17.5708 19.346 16.7271C19.6894 16.0532 19.9015 15.3219 19.9729 14.5723C20.0028 14.2589 19.7448 14.0032 19.43 14.0032C19.1152 14.0032 18.8634 14.2592 18.8266 14.5719C18.7595 15.1413 18.592 15.696 18.3303 16.2096C17.9821 16.8929 17.4771 17.4842 16.8566 17.935C16.2362 18.3858 15.5178 18.6834 14.7603 18.8033C14.191 18.8935 13.6117 18.8815 13.0494 18.7693C12.7406 18.7077 12.4193 18.868 12.322 19.1674Z";
const SLA_ARC_RIGHT  = "M19.1642 15.6811C19.4636 15.7784 19.788 15.6149 19.8565 15.3076C20.0202 14.5726 20.0445 13.8116 19.9261 13.0646C19.778 12.1294 19.4107 11.2425 18.8541 10.4765C18.2976 9.71043 17.5676 9.087 16.7239 8.65713C16.05 8.31374 15.3188 8.10166 14.5692 8.03023C14.2558 8.00037 14 8.25837 14 8.57317C14 8.88798 14.2561 9.13972 14.5687 9.17656C15.1382 9.24366 15.6928 9.4112 16.2064 9.67288C16.8898 10.0211 17.481 10.5261 17.9318 11.1465C18.3826 11.767 18.6802 12.4854 18.8002 13.2429C18.8903 13.8122 18.8783 14.3915 18.7661 14.9538C18.7045 15.2625 18.8648 15.5839 19.1642 15.6811Z";

export function SlaIcon({ type }) {
  const arcs = type === 'overdue'
    ? [{ d: SLA_ARC_RIGHT,  fill: '#DE5F73' }]
    : type === 'warning'
    ? [{ d: SLA_ARC_BOTTOM, fill: '#F1BD6C' }, { d: SLA_ARC_RIGHT, fill: '#F1BD6C' }]
    : [{ d: SLA_ARC_LEFT,   fill: '#6D6E6F' }, { d: SLA_ARC_BOTTOM, fill: '#6D6E6F' }, { d: SLA_ARC_RIGHT, fill: '#6D6E6F' }];
  return (
    <svg viewBox="8 8 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d={SLA_RING} fill="var(--border)"/>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.fill}/>)}
    </svg>
  );
}

// ─── Priority pill ────────────────────────────────────────────────────────────

export const PRIORITY_COLORS = {
  Critical: { bg: 'var(--priority-critical-bg)', color: 'var(--priority-critical-text)' },
  High:     { bg: 'var(--priority-high-bg)',     color: 'var(--priority-high-text)'     },
  Medium:   { bg: 'var(--priority-medium-bg)',   color: 'var(--priority-medium-text)'   },
  Low:      { bg: 'var(--priority-low-bg)',      color: 'var(--priority-low-text)'      },
};

export function PriorityPill({ priority }) {
  const { bg, color } = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.Low;
  return <Pill bg={bg} color={color} label={priority} />;
}

// ─── SLA cell ─────────────────────────────────────────────────────────────────

export const SLA_TEXT_COLOR = { normal: 'var(--text-weak)', warning: 'var(--text-weak)', overdue: 'var(--danger-text)' };

export function SlaCell({ sla, slaType }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: SLA_TEXT_COLOR[slaType] }}>
      <SlaIcon type={slaType} />
      {sla}
    </span>
  );
}

// ─── Person cell ──────────────────────────────────────────────────────────────

export function PersonCell({ person }) {
  if (!person) {
    return (
      <span className="flex items-center gap-2" style={{ ...typoPerson, color: 'var(--text-disabled)' }}>
        <span style={{ width: 24, height: 24, flexShrink: 0, borderRadius: '50%', border: '1px dashed var(--border-strong)', background: 'var(--background-medium)' }} />
        Unassigned
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 truncate" style={typoPerson}>
      <Avatar name={person.name} size={24} bg={person.bg ? `#${person.bg}` : undefined} />
      <span className="truncate">{person.name}</span>
    </span>
  );
}
