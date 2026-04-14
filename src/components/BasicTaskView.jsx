// ─── BasicTaskView ─────────────────────────────────────────────────────────────
// Standard task detail panel — mirrors Asana's basic task UI.
// Props:
//   task    — { id, name, ticket, assignee: { name, bg }, dueDate, dueDateColor, status, priority }
//   onClose — () => void

import { useState } from 'react';

const B = import.meta.env.BASE_URL;

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const LIGA = { fontFeatureSettings: "'liga' off, 'clig' off" };

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckSmallIcon() {
  // L-MiniIcon (12px)-1.svg
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M9.7191 2.72473L4.0001 8.44423L2.0301 6.47473C1.9612 6.40192 1.8784 6.34366 1.78659 6.30339C1.69479 6.26313 1.59584 6.24167 1.4956 6.2403C1.39537 6.23893 1.29587 6.25767 1.203 6.29541C1.11013 6.33315 1.02576 6.38913 0.954896 6.46003C0.884028 6.53093 0.828093 6.61532 0.790397 6.70821C0.752701 6.8011 0.734009 6.9006 0.735427 7.00084C0.736844 7.10108 0.758342 7.20001 0.79865 7.2918C0.838957 7.38358 0.897257 7.46636 0.970102 7.53523L3.4701 10.0352C3.6161 10.1817 3.8081 10.2547 4.0001 10.2547C4.1921 10.2547 4.3841 10.1817 4.5306 10.0352L10.7806 3.78523C10.8534 3.71636 10.9117 3.63358 10.9521 3.5418C10.9924 3.45001 11.0139 3.35108 11.0153 3.25084C11.0167 3.1506 10.998 3.0511 10.9603 2.95821C10.9226 2.86532 10.8667 2.78093 10.7958 2.71003C10.7249 2.63913 10.6406 2.58315 10.5477 2.54541C10.4548 2.50767 10.3553 2.48893 10.2551 2.4903C10.1549 2.49167 10.0559 2.51313 9.96411 2.55339C9.87231 2.59365 9.78951 2.65192 9.7206 2.72473H9.7191Z" fill="currentColor"/>
    </svg>
  );
}

function ThumbsUpIcon() {
  // Icon-3.svg
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 13.9998H12.47C12.9491 14.0021 13.4129 13.8318 13.7767 13.5201C14.1405 13.2084 14.3799 12.7761 14.451 12.3023L15.227 7.28732C15.2708 7.00461 15.2528 6.71577 15.1742 6.44068C15.0957 6.16559 14.9585 5.91079 14.772 5.69382C14.5859 5.47669 14.3551 5.30242 14.0953 5.18296C13.8355 5.06351 13.5529 5.00172 13.267 5.00182H10V2.00282C10 1.02232 9.355 0.23432 8.393 0.0418201C7.434 -0.14968 6.5315 0.32832 6.1545 1.23332L4.167 6.00132H2.5C1.673 6.00132 1 6.67382 1 7.50082V12.4998C1 13.3268 1.673 13.9998 2.5 13.9998ZM5 6.59982L7.0775 1.61532C7.31 1.05732 7.8275 0.94482 8.1965 1.01982C8.5675 1.09382 9.0005 1.39532 9.0005 2.00032V5.99982H13.2665C13.5535 5.99982 13.8255 6.12482 14.0125 6.34332C14.1995 6.56182 14.282 6.84932 14.2375 7.13332L13.462 12.1493C13.4264 12.3866 13.3066 12.6032 13.1244 12.7594C12.9423 12.9155 12.71 13.0009 12.47 12.9998H5V6.59982ZM2 7.49982C2 7.22432 2.2245 6.99982 2.5 6.99982H4V12.9998H2.5C2.2245 12.9998 2 12.7753 2 12.4998V7.49982Z" fill="currentColor"/>
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 7.5L7.5 13.5C6.1 14.9 3.9 14.9 2.5 13.5C1.1 12.1 1.1 9.9 2.5 8.5L8.5 2.5C9.4 1.6 10.9 1.6 11.8 2.5C12.7 3.4 12.7 4.9 11.8 5.8L6.2 11.4C5.8 11.8 5.1 11.8 4.7 11.4C4.3 11 4.3 10.3 4.7 9.9L9.8 4.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SubtaskIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8.5" y="8.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 7.5v2a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function LinkIcon() {
  // Icon-1.svg
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#link-clip)">
        <path d="M9.68177 6.31824C10.1011 6.73523 10.4335 7.23129 10.6597 7.77766C10.886 8.32404 11.0016 8.90988 10.9998 9.50124C11.0014 10.0926 10.8858 10.6784 10.6595 11.2247C10.4333 11.7711 10.101 12.2672 9.68177 12.6842L7.68127 14.6842C7.2636 15.1026 6.7674 15.4343 6.22116 15.6603C5.67492 15.8863 5.08942 16.0022 4.49827 16.0012C3.90713 16.0022 3.32162 15.8863 2.77539 15.6603C2.22915 15.4343 1.73295 15.1026 1.31527 14.6842C-0.439727 12.9292 -0.439727 10.0742 1.31527 8.31924L3.14427 6.48974C3.19073 6.44332 3.24587 6.4065 3.30656 6.38139C3.36724 6.35628 3.43228 6.34336 3.49795 6.34339C3.56362 6.34341 3.62865 6.35637 3.68932 6.38152C3.74998 6.40668 3.8051 6.44353 3.85152 6.48999C3.89795 6.53644 3.93476 6.59159 3.95987 6.65227C3.98499 6.71296 3.9979 6.77799 3.99787 6.84367C3.99785 6.90934 3.98489 6.97437 3.95974 7.03503C3.93459 7.0957 3.89773 7.15082 3.85127 7.19724L2.02227 9.02624C1.36689 9.6833 0.998838 10.5735 0.998838 11.5015C0.998838 12.4295 1.36689 13.3197 2.02227 13.9767C3.38727 15.3417 5.60877 15.3427 6.97377 13.9767L8.97427 11.9767C9.62981 11.3197 9.99796 10.4294 9.99796 9.50124C9.99796 8.57308 9.62981 7.68282 8.97427 7.02574C8.57347 6.62215 8.07941 6.32352 7.53577 6.15624C7.41143 6.1151 7.3082 6.02682 7.24826 5.91038C7.18832 5.79393 7.17646 5.65861 7.21524 5.53352C7.25401 5.40842 7.34032 5.30353 7.45561 5.2414C7.5709 5.17926 7.70596 5.16484 7.83177 5.20124C8.52973 5.41834 9.16445 5.80185 9.68127 6.31874L9.68177 6.31824ZM14.6833 1.31674C12.9278 -0.438262 10.0728 -0.438262 8.31727 1.31674L6.31677 3.31674C5.8974 3.73379 5.56496 4.22993 5.33871 4.77639C5.11247 5.32286 4.99693 5.90879 4.99877 6.50024C4.99877 7.70274 5.46677 8.83274 6.31677 9.68374C6.83359 10.2006 7.46832 10.5841 8.16627 10.8012C8.29132 10.8349 8.42454 10.8188 8.53795 10.7563C8.65137 10.6938 8.73614 10.5897 8.77446 10.466C8.81278 10.3424 8.80166 10.2086 8.74345 10.0929C8.68523 9.97727 8.58445 9.88866 8.46227 9.84574C7.91868 9.6786 7.42463 9.38014 7.02377 8.97674C6.36808 8.31964 5.99984 7.42927 5.99984 6.50099C5.99984 5.57271 6.36808 4.68234 7.02377 4.02524L9.02427 2.02524C10.3898 0.660239 12.6113 0.660239 13.9758 2.02524C15.3403 3.38924 15.3408 5.61074 13.9758 6.97624L12.1468 8.80474C12.1003 8.85116 12.0635 8.90628 12.0383 8.96694C12.0132 9.02761 12.0002 9.09264 12.0002 9.15831C12.0001 9.22399 12.0131 9.28902 12.0382 9.34971C12.0633 9.41039 12.1001 9.46553 12.1465 9.51199C12.1929 9.55844 12.2481 9.5953 12.3087 9.62045C12.3694 9.64561 12.4344 9.65857 12.5001 9.65859C12.5658 9.65861 12.6308 9.6457 12.6915 9.62059C12.7522 9.59548 12.8073 9.55866 12.8538 9.51224L14.6828 7.68274C16.4378 5.92774 16.4378 3.07274 14.6828 1.31774L14.6833 1.31674Z" fill="currentColor"/>
      </g>
      <defs><clipPath id="link-clip"><rect width="16" height="16" fill="white"/></clipPath></defs>
    </svg>
  );
}

function ExpandIcon() {
  // Icon.svg — diagonal expand arrows
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.14552 6.1465L13.292 2H9.49902C9.36642 2 9.23924 1.94732 9.14547 1.85355C9.0517 1.75979 8.99902 1.63261 8.99902 1.5C8.99902 1.36739 9.0517 1.24021 9.14547 1.14645C9.23924 1.05268 9.36642 1 9.49902 1H14.499C14.6316 1 14.7588 1.05268 14.8526 1.14645C14.9463 1.24021 14.999 1.36739 14.999 1.5V6.5C14.999 6.63261 14.9463 6.75979 14.8526 6.85355C14.7588 6.94732 14.6316 7 14.499 7C14.3664 7 14.2392 6.94732 14.1455 6.85355C14.0517 6.75979 13.999 6.63261 13.999 6.5V2.707L9.85252 6.8535C9.8062 6.90009 9.75112 6.93707 9.69045 6.9623C9.62978 6.98753 9.56473 7.00052 9.49902 7.00052C9.43332 7.00052 9.36826 6.98753 9.3076 6.9623C9.24693 6.93707 9.19185 6.90009 9.14552 6.8535C9.09905 6.80711 9.06218 6.752 9.03703 6.69135C9.01187 6.63069 8.99892 6.56567 8.99892 6.5C8.99892 6.43433 9.01187 6.36931 9.03703 6.30865C9.06218 6.248 9.09905 6.19289 9.14552 6.1465ZM1.49902 9C1.36642 9 1.23924 9.05268 1.14547 9.14645C1.0517 9.24021 0.999023 9.36739 0.999023 9.5V14.5C0.999023 14.6326 1.0517 14.7598 1.14547 14.8536C1.23924 14.9473 1.36642 15 1.49902 15H6.49902C6.63163 15 6.75881 14.9473 6.85258 14.8536C6.94634 14.7598 6.99902 14.6326 6.99902 14.5C6.99902 14.3674 6.94634 14.2402 6.85258 14.1464C6.75881 14.0527 6.63163 14 6.49902 14H2.70602L6.85252 9.8535C6.89895 9.80708 6.93577 9.75197 6.96089 9.69131C6.98602 9.63066 6.99895 9.56565 6.99895 9.5C6.99895 9.43435 6.98602 9.36934 6.96089 9.30869C6.93577 9.24803 6.89895 9.19292 6.85252 9.1465C6.8061 9.10008 6.75099 9.06325 6.69034 9.03813C6.62968 9.01301 6.56467 9.00008 6.49902 9.00008C6.43337 9.00008 6.36836 9.01301 6.30771 9.03813C6.24706 9.06325 6.19195 9.10008 6.14552 9.1465L1.99902 13.293V9.5C1.99902 9.36739 1.94634 9.24021 1.85258 9.14645C1.75881 9.05268 1.63163 9 1.49902 9Z" fill="currentColor"/>
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 6.5C8.85 6.5 9.5 7.15 9.5 8C9.5 8.85 8.85 9.5 8 9.5C7.15 9.5 6.5 8.85 6.5 8C6.5 7.15 7.15 6.5 8 6.5ZM1.5 6.5C2.35 6.5 3 7.15 3 8C3 8.85 2.35 9.5 1.5 9.5C0.65 9.5 0 8.85 0 8C0 7.15 0.65 6.5 1.5 6.5ZM14.5 6.5C15.35 6.5 16 7.15 16 8C16 8.85 15.35 9.5 14.5 9.5C13.65 9.5 13 8.85 13 8C13 7.15 13.65 6.5 14.5 6.5Z" fill="currentColor"/>
    </svg>
  );
}

function CollapseRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M0.974609 7.25002H10.1746L6.47461 3.55002C6.17461 3.25002 6.17461 2.80002 6.47461 2.50002C6.77461 2.20002 7.22461 2.20002 7.52461 2.50002L12.5246 7.50002C12.8246 7.80002 12.8246 8.25002 12.5246 8.55002L7.52461 13.55C7.37461 13.7 7.17461 13.75 6.97461 13.75C6.77461 13.75 6.57461 13.7 6.42461 13.55C6.12461 13.25 6.12461 12.8 6.42461 12.5L10.1246 8.80002H0.974609C0.57461 8.80002 0.224609 8.45002 0.224609 8.05002C0.224609 7.65002 0.57461 7.25002 0.974609 7.25002Z" fill="currentColor"/>
      <path d="M13.9996 1.75C13.9996 1.33579 14.3354 1 14.7496 1C15.1638 1 15.4996 1.33579 15.4996 1.75V14.25C15.4996 14.6642 15.1638 15 14.7496 15C14.3354 15 13.9996 14.6642 13.9996 14.25V1.75Z" fill="currentColor"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="4.5" r="2.5" stroke="var(--text-disabled)" strokeWidth="1.1"/>
      <path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function TextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.25851 11H11.742L13.359 14.7725C13.3879 14.84 13.4359 14.8975 13.4971 14.9379C13.5584 14.9784 13.6301 14.9999 13.7035 15H13.976C14.038 15 14.0991 14.9845 14.1536 14.9551C14.2082 14.9257 14.2547 14.8832 14.2888 14.8314C14.3229 14.7796 14.3437 14.7202 14.3492 14.6585C14.3548 14.5967 14.3449 14.5345 14.3205 14.4775L8.64151 1.2275C8.61264 1.16003 8.56462 1.10251 8.50338 1.06208C8.44215 1.02164 8.37039 1.00005 8.29701 1H7.70351C7.63012 1.00005 7.55837 1.02164 7.49713 1.06208C7.4359 1.10251 7.38787 1.16003 7.35901 1.2275L1.68001 14.4775C1.65562 14.5345 1.64574 14.5967 1.65128 14.6585C1.65681 14.7202 1.67757 14.7796 1.71171 14.8314C1.74584 14.8832 1.79228 14.9257 1.84687 14.9551C1.90146 14.9845 1.96249 15 2.02451 15H2.29701C2.37039 14.9999 2.44215 14.9784 2.50338 14.9379C2.56462 14.8975 2.61264 14.84 2.64151 14.7725L4.25851 11ZM8.00001 2.2695L11.313 10H4.68701L8.00001 2.2695Z" fill="var(--text-disabled)"/>
    </svg>
  );
}

function CalendarIcon({ color = '#0D7F56' }) {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke={color} strokeWidth="1.2"/>
      <path d="M1.5 6h11" stroke={color} strokeWidth="1.2"/>
      <path d="M5 1v3M9 1v3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="5" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="11" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="11" cy="10.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.7 6.1L9.3 4.4M6.7 7.9L9.3 9.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function XSmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="12" height="14" rx="2" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
      <path d="M4 4h8M4 7h6M4 10h4" stroke="var(--text)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3 2.5L5 1.5" stroke="var(--text)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function GDriveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L13 11H3L8 2Z" fill="#FBBC04"/>
      <path d="M3 11L0.5 7L5.5 7L3 11Z" fill="#4285F4"/>
      <path d="M13 11L15.5 7L10.5 7L13 11Z" fill="#34A853"/>
      <path d="M5.5 7L8 2L10.5 7H5.5Z" fill="#EA4335"/>
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="4" fill="#2D8CFF"/>
      <path d="M2.5 5.5h7C10 5.5 10.5 6 10.5 6.5v4C10.5 11 10 11.5 9.5 11.5h-7C2 11.5 1.5 11 1.5 10.5v-4C1.5 6 2 5.5 2.5 5.5Z" fill="white"/>
      <path d="M10.5 7.5l3-1.5v5l-3-1.5V7.5Z" fill="white"/>
    </svg>
  );
}

function ChevronDownSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── SubtleIconBtn ────────────────────────────────────────────────────────────

function SubtleIconBtn({ label, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--icon)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </button>
  );
}

// ─── Avi ─────────────────────────────────────────────────────────────────────

function Avi({ name, size = 24, bg = 'var(--icon)', fontSize }) {
  const ini = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fontSize ?? Math.round(size * 0.37), fontWeight: 700, color: 'var(--surface)', flexShrink: 0, fontFamily: SFT, boxSizing: 'border-box' }}>
      {ini}
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function TaskToolbar({ isComplete, onMarkComplete, onClose, task }) {
  const facepile = task ? [task.assignee, task.reporter].filter(Boolean) : [];
  return (
    <div style={{ height: 48, padding: '0 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>

      {/* Left: Mark complete */}
      <button type="button" onClick={onMarkComplete}
        style={{ height: 28, padding: '0 12px', borderRadius: 6, fontSize: 13, fontWeight: 400, fontFamily: SFT, border: isComplete ? '1.5px solid #5DA182' : '1px solid var(--border)', background: isComplete ? '#F0FAF5' : 'var(--surface)', color: isComplete ? '#0D7F56' : 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, ...LIGA }}
        onMouseEnter={e => { if (!isComplete) e.currentTarget.style.background = 'var(--background-medium)'; }}
        onMouseLeave={e => { if (!isComplete) e.currentTarget.style.background = 'var(--surface)'; }}
      >
        <CheckSmallIcon />
        {isComplete ? 'Completed' : 'Mark complete'}
      </button>

      <div style={{ flex: 1 }} />

      {/* Right: facepile + Share | icons | close */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Facepile */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {facepile.map((c, i) => (
            <div key={c.name} title={c.name}
              style={{ width: 28, height: 28, borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--surface)', flexShrink: 0, fontFamily: SFT, marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--surface)', boxSizing: 'border-box', position: 'relative', zIndex: facepile.length - i }}
            >
              {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          ))}
          <button style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--icon)', flexShrink: 0, marginLeft: -8, position: 'relative', zIndex: 0, boxSizing: 'border-box', fontFamily: SFT }}>
            +
          </button>
        </div>
        {/* Share */}
        <button
          style={{ height: 28, padding: '0 12px', borderRadius: 6, fontSize: 13, fontWeight: 400, fontFamily: SFT, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, ...LIGA }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
        >
          <ShareIcon />
          Share
        </button>
        <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 2px', flexShrink: 0 }} />
        <SubtleIconBtn label="Like"><ThumbsUpIcon /></SubtleIconBtn>
        <SubtleIconBtn label="Copy link"><LinkIcon /></SubtleIconBtn>
        <SubtleIconBtn label="Expand"><ExpandIcon /></SubtleIconBtn>
        <SubtleIconBtn label="More"><DotsIcon /></SubtleIconBtn>
        <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 2px', flexShrink: 0 }} />
        <SubtleIconBtn label="Close panel" onClick={onClose}>
          <CollapseRightIcon />
        </SubtleIconBtn>
      </div>

    </div>
  );
}

// ─── InfoBanner ──────────────────────────────────────────────────────────────

function InfoBanner({ projectName }) {
  return (
    <div style={{ padding: '8px 16px', background: 'var(--background-medium)', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-weak)', lineHeight: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, fontFamily: SFT, ...LIGA }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-disabled)' }}>
        <LockIcon />
        <span style={{ color: 'var(--text-weak)' }}>This task is visible to its collaborators and members of {projectName}.</span>
      </div>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, padding: 0, flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}
      >
        Make public
      </button>
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

// Small enum/field-type icon (circle with chevron) matching Asana's custom field icon
function FieldTypeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" stroke="var(--text-disabled)" strokeWidth="1.1"/>
      <path d="M4.5 6.5L7 9L9.5 6.5" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FieldRow({ label, children, last, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', borderBottom: last ? 'none' : '1px solid var(--border)', fontFamily: SFT }}>
      <div style={{ width: 200, flexShrink: 0, padding: '10px 14px', borderRight: '1px solid var(--border)', fontSize: 13, color: 'var(--text-weak)', display: 'flex', alignItems: 'center', gap: 8, ...LIGA }}>
        {icon ?? <FieldTypeIcon />}
        {label}
      </div>
      <div style={{ flex: 1, padding: '10px 14px', fontSize: 13, color: 'var(--text)', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Custom fields table ──────────────────────────────────────────────────────

const CUSTOM_FIELDS = [
  { icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="11" rx="2" stroke="var(--text-disabled)" strokeWidth="1.1"/><path d="M4 6.5h5M4 9h3" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round"/></svg>, label: 'Escalation type' },
  { icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="var(--text-disabled)" strokeWidth="1.1"/><path d="M6.5 3.5v3l2 1.5" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: 'SLA deadline' },
  { icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4.5" r="2" stroke="var(--text-disabled)" strokeWidth="1.1"/><path d="M2 11c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round"/></svg>, label: 'Affected users' },
  { icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="9" rx="1.5" stroke="var(--text-disabled)" strokeWidth="1.1"/><path d="M1 5h11" stroke="var(--text-disabled)" strokeWidth="1.1"/><path d="M4 1v2M9 1v2" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round"/></svg>, label: 'Resolution date' },
  { icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 11L6.5 2L11 11" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 8h6" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round"/></svg>, label: 'Related system' },
];

function CustomFieldsTable({ showAll }) {
  const fields = showAll ? CUSTOM_FIELDS : CUSTOM_FIELDS.slice(0, 3);
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', fontSize: 12, fontFamily: SFT }}>
      {fields.map((f, i) => (
        <div key={f.label} style={{ display: 'flex', alignItems: 'center', borderBottom: i < fields.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', width: 170, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--background-medium)', color: 'var(--text-weak)' }}>
            {f.icon}
            {f.label}
          </div>
          <div style={{ padding: '7px 12px', color: 'var(--text-disabled)', flex: 1 }}>—</div>
        </div>
      ))}
    </div>
  );
}

// ─── BellIcon ────────────────────────────────────────────────────────────────

function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 12.5C7.05 12.5 7.5 12.05 7.5 11.5H5.5C5.5 12.05 5.95 12.5 6.5 12.5ZM10.5 9V6C10.5 4.17 9.37 2.64 7.5 2.22V1.5C7.5 0.95 7.05 0.5 6.5 0.5C5.95 0.5 5.5 0.95 5.5 1.5V2.22C3.63 2.64 2.5 4.17 2.5 6V9L1 10.5V11H12V10.5L10.5 9Z" fill="currentColor"/>
    </svg>
  );
}

// ─── CommentItem ──────────────────────────────────────────────────────────────

const AGENT_AVATARS = {
  'IT Agent':     `${B}avatars/Teammate-1.svg`,
  'Triage Agent': `${B}avatars/Teammate-2.svg`,
  'Asana AI':     `${B}avatars/Teammate.svg`,
};

function CommentItem({ comment, task }) {
  const isSystem = comment.type === 'system';
  const agentSrc = comment.avatarSrc ?? AGENT_AVATARS[comment.author];
  const bg = comment.bg
    ?? (comment.author === task.assignee?.name ? task.assignee?.bg : (task.reporter?.bg ?? 'var(--icon)'));
  const label = comment.author.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div style={{ display: 'flex', gap: 12, paddingTop: 16, fontFamily: SFT }}>
      {/* Avatar */}
      {agentSrc
        ? <img src={agentSrc} alt={comment.author} style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
        : <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--surface)', flexShrink: 0, boxSizing: 'border-box' }}>
            {label}
          </div>
      }

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 13, lineHeight: '20px', ...LIGA, flex: 1 }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{comment.author}</span>
            {isSystem && <span style={{ fontWeight: 400, color: 'var(--text-weak)' }}> {comment.action}</span>}
            <span style={{ color: 'var(--text-disabled)', fontWeight: 400 }}> · {comment.time}</span>
          </div>
          {!isSystem && (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--border-strong)', flexShrink: 0, display: 'flex', alignItems: 'center', marginTop: 3 }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-weak)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--border-strong)'}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 14H12.47C12.95 14.0021 13.413 13.8318 13.777 13.5201C14.14 13.2084 14.38 12.7761 14.451 12.3023L15.227 7.287C15.271 7.005 15.253 6.716 15.174 6.441C15.096 6.166 14.959 5.911 14.772 5.694C14.586 5.477 14.355 5.302 14.095 5.183C13.836 5.064 13.553 5.002 13.267 5.002H10V2.003C10 1.022 9.355 0.234 8.393 0.042C7.434 -0.15 6.531 0.328 6.155 1.233L4.167 6.001H2.5C1.673 6.001 1 6.674 1 7.501V12.5C1 13.327 1.673 14 2.5 14ZM5 6.6L7.078 1.615C7.31 1.057 7.828 0.945 8.197 1.02C8.568 1.094 9 1.395 9 2V6H13.267C13.554 6 13.826 6.125 14.013 6.343C14.2 6.562 14.283 6.849 14.238 7.133L13.462 12.149C13.426 12.387 13.307 12.603 13.124 12.759C12.942 12.916 12.71 13.001 12.47 13H5V6.6ZM2 7.5C2 7.224 2.224 7 2.5 7H4V13H2.5C2.224 13 2 12.775 2 12.5V7.5Z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
        {!isSystem && comment.text && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text)', lineHeight: '20px', ...LIGA }}>
            {comment.text}
          </p>
        )}
        {!isSystem && comment.steps?.length > 0 && (
          <ol style={{ margin: '6px 0 0', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {comment.steps.map((s, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--text)', lineHeight: '20px', ...LIGA }}>{s}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// ─── NextStepsCard ────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1L7.5 5H11.5L8.5 7.5L9.5 11.5L6.5 9L3.5 11.5L4.5 7.5L1.5 5H5.5L6.5 1Z" stroke="#7C3AED" strokeWidth="1.1" strokeLinejoin="round" fill="#EDE9FE"/>
    </svg>
  );
}

function NextStepsCard({ steps }) {
  return (
    <div style={{ background: '#F9F7FF', borderRadius: 8, border: '1px solid #EDE9FE', padding: '12px 14px', marginBottom: 24, fontFamily: SFT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <SparkleIcon />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#7C3AED', ...LIGA }}>Suggested next steps</span>
      </div>
      <ol style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {steps.map((s, i) => (
          <li key={i} style={{ fontSize: 13, color: 'var(--text)', lineHeight: '20px', ...LIGA }}>{s}</li>
        ))}
      </ol>
    </div>
  );
}

// ─── InlineFieldRow ───────────────────────────────────────────────────────────

function InlineFieldRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: 36, gap: 0 }}>
      <span style={{ width: 120, flexShrink: 0, fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT, ...LIGA }}>{label}</span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>{children}</div>
    </div>
  );
}

// ─── BasicTaskView ─────────────────────────────────────────────────────────────

export default function BasicTaskView({ task, onClose, projectName = 'IT Escalations Inbox' }) {
  const [isComplete, setIsComplete] = useState(task.status === 'Resolved');
  const [commentInput, setCommentInput] = useState('');
  const isEscalation = !!task.escalatedBy;
  const agentName = task.escalatedBy?.name ?? 'Asana AI';
  const agentBg   = task.escalatedBy?.bg  ?? '#5a8f6b';
  const agentSrc  = isEscalation ? undefined : `${B}avatars/Teammate.svg`;

  const [comments, setComments] = useState([
    { id: 1, type: 'system', author: agentName, action: 'created this task', time: 'Just now' },
    ...(isEscalation ? [{ id: 2, type: 'agent', author: agentName, bg: agentBg, time: 'Just now', text: `Escalated from ticket ${task.ticket} (reported by ${task.reporter?.name}, ${task.reporter?.dept}). ${task.description ?? ''}` }] : []),
    ...(task.nextSteps?.length > 0 ? [{ id: 3, type: 'agent', author: isEscalation ? 'Triage Agent' : 'Asana AI', avatarSrc: agentSrc, bg: agentBg, time: 'Just now', text: isEscalation ? 'Based on the escalation details, here are the suggested next steps:' : 'Suggested next steps for this task:', steps: task.nextSteps }] : []),
  ]);

  const meSrc = `${B}avatars/spurti-kanduri.png`;

  function handleSend() {
    const text = commentInput.trim();
    if (!text) return;
    setComments(c => [...c, { id: Date.now(), type: 'user', author: 'You', time: 'Just now', text }]);
    setCommentInput('');
  }

  const STATUS_BADGE = { 'Needs review': { bg: '#EDE9FE', color: '#5B21B6' }, 'In progress': { bg: 'var(--selected-background)', color: 'var(--selected-text)' }, 'Blocked': { bg: 'var(--danger-background)', color: 'var(--danger-text)' }, 'Resolved': { bg: 'var(--success-background)', color: 'var(--success-text)' }, 'Not started': { bg: 'var(--background-strong)', color: 'var(--text-disabled)' } };
  const PRIORITY_BADGE = { Critical: { bg: '#FEF3C7', color: '#92400E' }, High: { bg: '#FCE7F3', color: '#9D174D' }, Medium: { bg: 'var(--selected-background)', color: 'var(--selected-text)' }, Low: { bg: 'var(--priority-low-bg)', color: 'var(--priority-low-text)' } };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)', overflow: 'hidden', fontFamily: SFT }}>

      {/* ── Toolbar ── */}
      <TaskToolbar isComplete={isComplete} onMarkComplete={() => setIsComplete(c => !c)} onClose={onClose} task={task} />

      {/* ── Info banner ── */}
      <InfoBanner projectName={projectName} />

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px 40px', overscrollBehavior: 'none' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: 'var(--text-weak)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4, ...LIGA }}>
          <span style={{ cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}
          >{projectName}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: SFD, fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: '30px', margin: '0 0 20px', letterSpacing: '-0.2px', ...LIGA }}>
          {task.name}
        </h1>

        {/* ── Inline field rows ── */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>

          {/* Assignee */}
          <InlineFieldRow label="Assignee">
            {task.assignee ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avi name={task.assignee.name} size={24} bg={task.assignee.bg} />
                <span style={{ fontSize: 13, color: 'var(--text)', ...LIGA }}>{task.assignee.name}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-disabled)', marginLeft: 2 }}>
                  <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.1"/>
                  <path d="M2 12c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  <path d="M11 2l1.5 1.5M11 5l1.5-1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
              </div>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--text-disabled)', ...LIGA }}>Add assignee</span>
            )}
          </InlineFieldRow>

          {/* Due date */}
          <InlineFieldRow label="Due date">
            {task.dueDate ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CalendarIcon color="var(--text-weak)" />
                <span style={{ fontSize: 13, color: 'var(--text)', ...LIGA }}>{task.dueDate}</span>
              </div>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--text-disabled)', ...LIGA }}>Add due date</span>
            )}
          </InlineFieldRow>

          {/* Status + Priority as inline badges */}
          {task.status && (
            <InlineFieldRow label="Status">
              {(() => { const s = STATUS_BADGE[task.status] ?? {}; return <span style={{ fontSize: 12, fontWeight: 500, padding: '2px 9px', borderRadius: 4, background: s.bg, color: s.color, ...LIGA }}>{task.status}</span>; })()}
            </InlineFieldRow>
          )}
          {task.priority && (
            <InlineFieldRow label="Priority">
              {(() => { const p = PRIORITY_BADGE[task.priority] ?? {}; return <span style={{ fontSize: 12, fontWeight: 500, padding: '2px 9px', borderRadius: 4, background: p.bg, color: p.color, ...LIGA }}>{task.priority}</span>; })()}
            </InlineFieldRow>
          )}
          {task.reporter && (
            <InlineFieldRow label={isEscalation ? 'Customer' : 'Requested by'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avi name={task.reporter.name} size={22} bg={task.reporter.bg} />
                <span style={{ fontSize: 13, color: 'var(--text)', ...LIGA }}>{task.reporter.name}</span>
                {task.reporter.dept && <span style={{ fontSize: 12, color: 'var(--text-disabled)', ...LIGA }}>· {task.reporter.dept}</span>}
              </div>
            </InlineFieldRow>
          )}

          {/* Dependencies placeholder */}
          <InlineFieldRow label="Dependencies">
            <span style={{ fontSize: 13, color: 'var(--text-disabled)', ...LIGA }}>Add dependencies</span>
          </InlineFieldRow>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '16px 0 20px' }} />

        {/* ── Description ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10, ...LIGA }}>Description</div>
          {task.description ? (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', lineHeight: '22px', ...LIGA }}>{task.description}</p>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-disabled)', lineHeight: '22px', ...LIGA }}>What is this task about?</p>
          )}
        </div>

        {/* ── Suggested next steps (escalation context) ── */}
        {isEscalation && task.nextSteps?.length > 0 && (
          <NextStepsCard steps={task.nextSteps} />
        )}

        {/* ── Subtasks ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', ...LIGA }}>Subtasks</span>
            <button style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-disabled)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-disabled)'; }}>
              <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          {!isEscalation && task.nextSteps?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {task.nextSteps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 10px', borderRadius: 6, background: 'var(--background-weak)', border: '1px solid var(--border)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="7" cy="7" r="6" stroke="var(--border-strong)" strokeWidth="1.1"/>
                  </svg>
                  <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: '20px', ...LIGA }}>{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-disabled)', ...LIGA }}>No subtasks yet</span>
          )}
        </div>

        {/* ── Apps ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', ...LIGA }}>Apps</span>
            <span style={{ fontSize: 11, fontWeight: 600, minWidth: 18, height: 18, borderRadius: 9, background: 'var(--background-strong)', color: 'var(--text-weak)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>1</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-weak)', width: 88, flexShrink: 0, ...LIGA }}>Google Drive</span>
            <GDriveIcon />
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT, padding: 0, ...LIGA }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}>
              Add Google Drive file
            </button>
          </div>
        </div>

        {/* ── Attachments ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', ...LIGA }}>Attachments</span>
            <button style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-disabled)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-disabled)'; }}>
              <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* ── Comments ── */}
        {comments.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12, ...LIGA }}>Comments</div>
            {comments.map(c => <CommentItem key={c.id} comment={c} task={task} />)}
          </div>
        )}
      </div>

      {/* ── Sticky footer: comment input ── */}
      <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <img src={meSrc} alt="You" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', cursor: 'text', background: 'var(--background-weak)' }}>
          <textarea
            placeholder="Add a comment..."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            rows={2}
            style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', fontFamily: SFT, lineHeight: '20px', padding: 0, ...LIGA }}
          />
        </div>
      </div>

    </div>
  );
}
