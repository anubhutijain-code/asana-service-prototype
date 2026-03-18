// ─── SettingsModal ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import Modal from './ui/Modal';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif';

const TABS = ['General', 'Profile', 'Notifications', 'Email Forwarding', 'Account', 'Display', 'Apps', 'Hacks'];

// ─── Utility icons (from provided files) ────────────────────────────────────

// Icon.svg — chevron down
function ChevronDownIcon({ up }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ transition: 'transform 200ms', transform: up ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M13.936 5.51788C13.8082 5.36554 13.6251 5.27021 13.4269 5.25286C13.2288 5.23551 13.0319 5.29757 12.8795 5.42538L7.99902 9.52088L3.11852 5.42538C3.04331 5.36034 2.95591 5.3109 2.86142 5.27995C2.76693 5.24899 2.66722 5.23713 2.5681 5.24507C2.46898 5.253 2.37243 5.28056 2.28406 5.32615C2.1957 5.37174 2.11728 5.43445 2.05337 5.51062C1.98945 5.5868 1.94133 5.67492 1.91179 5.76987C1.88225 5.86481 1.87188 5.96469 1.8813 6.06367C1.89071 6.16266 1.91971 6.25879 1.96662 6.34647C2.01353 6.43414 2.0774 6.51162 2.15452 6.57438L7.51752 11.0744C7.6525 11.1879 7.82318 11.2501 7.99952 11.2501C8.17586 11.2501 8.34655 11.1879 8.48152 11.0744L13.8445 6.57438C13.9969 6.44654 14.0922 6.26341 14.1095 6.06529C14.1269 5.86716 14.0648 5.67026 13.937 5.51788H13.936Z" fill="var(--icon)"/>
    </svg>
  );
}

// L-Icon (16px).svg — external link
function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M15 10.5V12C15 13.6545 13.6545 15 12 15H4C2.3455 15 1 13.6545 1 12V4C1 2.3455 2.3455 1 4 1H5.5C5.63261 1 5.75979 1.05268 5.85355 1.14645C5.94732 1.24021 6 1.36739 6 1.5C6 1.63261 5.94732 1.75979 5.85355 1.85355C5.75979 1.94732 5.63261 2 5.5 2H4C2.897 2 2 2.897 2 4V12C2 13.103 2.897 14 4 14H12C13.103 14 14 13.103 14 12V10.5C14 10.3674 14.0527 10.2402 14.1464 10.1464C14.2402 10.0527 14.3674 10 14.5 10C14.6326 10 14.7598 10.0527 14.8536 10.1464C14.9473 10.2402 15 10.3674 15 10.5ZM14.5 1H8.5C8.36739 1 8.24021 1.05268 8.14645 1.14645C8.05268 1.24021 8 1.36739 8 1.5C8 1.63261 8.05268 1.75979 8.14645 1.85355C8.24021 1.94732 8.36739 2 8.5 2H13.293L5.1465 10.1465C5.05275 10.2403 5.00008 10.3674 5.00008 10.5C5.00008 10.6326 5.05275 10.7597 5.1465 10.8535C5.24025 10.9473 5.36741 10.9999 5.5 10.9999C5.63259 10.9999 5.75975 10.9473 5.8535 10.8535L14 2.707V7.5C14 7.63261 14.0527 7.75979 14.1464 7.85355C14.2402 7.94732 14.3674 8 14.5 8C14.6326 8 14.7598 7.94732 14.8536 7.85355C14.9473 7.75979 15 7.63261 15 7.5V1.5C15 1.36739 14.9473 1.24021 14.8536 1.14645C14.7598 1.05268 14.6326 1 14.5 1Z" fill="var(--icon)"/>
    </svg>
  );
}

// ─── Card icons (32px, from provided files) ──────────────────────────────────

// Art-32.svg — notification bell with lightning
function DesktopIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" flexShrink="0">
      <path d="M16 30C18.462 30 20.518 28.29 21.083 26H10.917C11.482 28.29 13.538 30 16 30Z" fill="#A49BFA"/>
      <path d="M25.0951 10.25H26.6421C26.8671 11.124 27.0001 12.034 27.0001 12.978V16.9609C27.0001 18.6359 27.6931 20.258 28.8551 21.3C29.7641 22.115 30.0101 23.4099 29.4661 24.5239C29.0281 25.4209 28.0611 26.001 27.0021 26.001H4.99712C3.93812 26.001 2.97212 25.4209 2.53412 24.5239C1.98912 23.4119 2.23512 22.116 3.14512 21.3C4.30612 20.258 4.99912 18.6359 4.99912 16.9609V12.978C4.99912 6.92503 9.93412 2 15.9991 2C18.9871 2 21.6971 3.19899 23.6821 5.13599L22.6221 6.19604C20.9091 4.53104 18.5741 3.5 16.0001 3.5C10.7621 3.5 6.50012 7.75203 6.50012 12.978V16.9609C6.50012 19.0549 5.62012 21.094 4.14612 22.417C3.74112 22.779 3.63412 23.361 3.88112 23.864C4.06912 24.251 4.50712 24.5 4.99612 24.5H27.0021C27.4911 24.5 27.9301 24.251 28.1181 23.865C28.3641 23.361 28.2581 22.779 27.8531 22.417C26.3781 21.094 25.4991 19.0549 25.4991 16.9609V12.978C25.4991 12.03 25.3561 11.115 25.0951 10.25ZM14.2501 11C14.2501 11.414 14.5861 11.75 15.0001 11.75H18.1891L14.4691 15.47C14.2541 15.685 14.1911 16.0071 14.3061 16.2871C14.4221 16.5671 14.6961 16.75 14.9991 16.75H19.9991C20.4131 16.75 20.7491 16.414 20.7491 16C20.7491 15.586 20.4131 15.25 19.9991 15.25H16.8101L20.5301 11.53C20.7451 11.315 20.8081 10.9929 20.6931 10.7129C20.5771 10.4329 20.3031 10.25 20.0001 10.25H15.0001C14.5861 10.25 14.2501 10.586 14.2501 11ZM23.4701 7.46997C23.2551 7.68497 23.1921 8.00711 23.3071 8.28711C23.4231 8.56711 23.6971 8.75 24.0001 8.75H29.0001C29.4141 8.75 29.7501 8.414 29.7501 8C29.7501 7.586 29.4141 7.25 29.0001 7.25H25.8111L29.5311 3.53003C29.7461 3.31503 29.8091 2.99289 29.6941 2.71289C29.5781 2.43289 29.3041 2.25 29.0011 2.25H24.0011C23.5871 2.25 23.2511 2.586 23.2511 3C23.2511 3.414 23.5871 3.75 24.0011 3.75H27.1901L23.4701 7.46997Z" fill="#4A3DCF"/>
    </svg>
  );
}

// Service mode icon (monitor/desktop, same as ModeSidebar ServiceIcon)
function ServiceIcon() {
  return (
    <svg width="32" height="32" viewBox="35 254 16 17" fill="none" style={{ flexShrink: 0 }}>
      <path d="M48.999 255H36.999C35.896 255 34.999 255.897 34.999 257V264C34.999 265.103 35.896 266 36.999 266H42.499V269H38.499C38.3664 269 38.2392 269.053 38.1455 269.146C38.0517 269.24 37.999 269.367 37.999 269.5C37.999 269.633 38.0517 269.76 38.1455 269.854C38.2392 269.947 38.3664 270 38.499 270H47.499C47.6316 270 47.7588 269.947 47.8526 269.854C47.9463 269.76 47.999 269.633 47.999 269.5C47.999 269.367 47.9463 269.24 47.8526 269.146C47.7588 269.053 47.6316 269 47.499 269H43.499V266H48.999C50.102 266 50.999 265.103 50.999 264V257C50.999 255.897 50.102 255 48.999 255ZM49.999 264C49.999 264.552 49.5505 265 48.999 265H36.999C36.4475 265 35.999 264.552 35.999 264V257C35.999 256.448 36.4475 256 36.999 256H48.999C49.5505 256 49.999 256.448 49.999 257V264Z" fill="#4A3DCF" />
    </svg>
  );
}

// logo-app-Slack.svg — Slack
function SlackIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6.72313 20.2214C6.72313 22.0716 5.21173 23.583 3.36156 23.583C1.5114 23.583 0 22.0716 0 20.2214C0 18.3713 1.5114 16.8599 3.36156 16.8599H6.72313V20.2214Z" fill="#E01E5A"/>
      <path d="M8.41699 20.2214C8.41699 18.3713 9.92839 16.8599 11.7786 16.8599C13.6287 16.8599 15.1401 18.3713 15.1401 20.2214V28.6384C15.1401 30.4885 13.6287 31.9999 11.7786 31.9999C9.92839 31.9999 8.41699 30.4885 8.41699 28.6384V20.2214Z" fill="#E01E5A"/>
      <path d="M11.7786 6.72313C9.92839 6.72313 8.41699 5.21173 8.41699 3.36156C8.41699 1.5114 9.92839 0 11.7786 0C13.6287 0 15.1401 1.5114 15.1401 3.36156V6.72313H11.7786Z" fill="#36C5F0"/>
      <path d="M11.7785 8.41699C13.6287 8.41699 15.1401 9.92839 15.1401 11.7786C15.1401 13.6287 13.6287 15.1401 11.7785 15.1401H3.36156C1.5114 15.1401 0 13.6287 0 11.7786C0 9.92839 1.5114 8.41699 3.36156 8.41699H11.7785Z" fill="#36C5F0"/>
      <path d="M25.2764 11.7786C25.2764 9.92839 26.7878 8.41699 28.6379 8.41699C30.4881 8.41699 31.9995 9.92839 31.9995 11.7786C31.9995 13.6287 30.4881 15.1401 28.6379 15.1401H25.2764V11.7786Z" fill="#2EB67D"/>
      <path d="M23.5825 11.7785C23.5825 13.6287 22.0711 15.1401 20.2209 15.1401C18.3708 15.1401 16.8594 13.6287 16.8594 11.7785V3.36156C16.8594 1.5114 18.3708 0 20.2209 0C22.0711 0 23.5825 1.5114 23.5825 3.36156V11.7785Z" fill="#2EB67D"/>
      <path d="M20.2209 25.2769C22.0711 25.2769 23.5825 26.7883 23.5825 28.6384C23.5825 30.4886 22.0711 32 20.2209 32C18.3708 32 16.8594 30.4886 16.8594 28.6384V25.2769H20.2209Z" fill="#ECB22E"/>
      <path d="M20.2209 23.583C18.3708 23.583 16.8594 22.0716 16.8594 20.2214C16.8594 18.3713 18.3708 16.8599 20.2209 16.8599H28.6379C30.488 16.8599 31.9994 18.3713 31.9994 20.2214C31.9994 22.0716 30.488 23.583 28.6379 23.583H20.2209Z" fill="#ECB22E"/>
    </svg>
  );
}

// Frame.svg — Microsoft Teams
function TeamsIcon() {
  return (
    <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
      <path d="M22.32 11.1628H30.5857C31.3666 11.1628 31.9997 11.7959 31.9997 12.5768V20.1057C31.9997 22.9758 29.6731 25.3024 26.803 25.3024H26.7785C23.9084 25.3028 21.5815 22.9765 21.5811 20.1065C21.5811 20.1062 21.5811 20.106 21.5811 20.1057V11.9018C21.5811 11.4937 21.9119 11.1628 22.32 11.1628Z" fill="#5059C9"/>
      <path d="M27.9065 9.67448C29.756 9.67448 31.2553 8.17516 31.2553 6.32564C31.2553 4.47613 29.756 2.97681 27.9065 2.97681C26.0569 2.97681 24.5576 4.47613 24.5576 6.32564C24.5576 8.17516 26.0569 9.67448 27.9065 9.67448Z" fill="#5059C9"/>
      <path d="M17.4876 9.67443C20.1591 9.67443 22.3248 7.50874 22.3248 4.83721C22.3248 2.16569 20.1591 0 17.4876 0C14.8161 0 12.6504 2.16569 12.6504 4.83721C12.6504 7.50874 14.8161 9.67443 17.4876 9.67443Z" fill="#7B83EB"/>
      <path d="M23.9381 11.1628H10.2941C9.52253 11.1819 8.91215 11.8223 8.93005 12.5939V21.1811C8.8223 25.8116 12.4857 29.6542 17.1161 29.7675C21.7465 29.6542 25.4099 25.8116 25.3022 21.1811V12.5939C25.32 11.8223 24.7097 11.1819 23.9381 11.1628Z" fill="#7B83EB"/>
      <path opacity="0.1" d="M17.8603 11.1628V23.1963C17.8566 23.7482 17.5222 24.2439 17.0119 24.454C16.8495 24.5227 16.6749 24.5581 16.4985 24.5582H9.58496C9.48822 24.3126 9.39892 24.067 9.32449 23.814C9.064 22.9601 8.93108 22.0724 8.93007 21.1796V12.5917C8.91218 11.8213 9.52156 11.1819 10.2919 11.1628H17.8603Z" fill="black"/>
      <path opacity="0.2" d="M17.1161 11.1628V23.9405C17.1161 24.1169 17.0807 24.2915 17.0119 24.454C16.8018 24.9643 16.3061 25.2987 15.7543 25.3024H9.93474C9.80822 25.0568 9.68915 24.8112 9.58496 24.5582C9.48077 24.3052 9.39892 24.067 9.32449 23.814C9.064 22.9601 8.93108 22.0724 8.93007 21.1796V12.5917C8.91218 11.8213 9.52156 11.1819 10.2919 11.1628H17.1161Z" fill="black"/>
      <path opacity="0.2" d="M17.1165 8.0596V9.65961C16.8653 9.64294 16.6161 9.60308 16.3723 9.54054C14.8653 9.18366 13.6203 8.12679 13.0234 6.69775H15.7546C16.5055 6.7006 17.1136 7.30866 17.1165 8.0596Z" fill="black"/>
      <rect x="1.36426" y="6.69775" width="15.0078" height="16.3721" rx="1.36409" fill="url(#teams-grad)"/>
      <path d="M11.7756 11.8907H9.04816V19.3177H7.31049V11.8907H4.5957V10.45H11.7756V11.8907Z" fill="white"/>
      <defs>
        <linearGradient id="teams-grad" x1="2.84417" y1="5.63188" x2="13.5279" y2="24.1357" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5A62C3"/>
          <stop offset="0.5" stopColor="#4D55BD"/>
          <stop offset="1" stopColor="#3940AB"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// Art-32-4.svg — clipboard / project
function ProjectIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M14.25 14.5C14.25 15.465 13.465 16.25 12.5 16.25C11.535 16.25 10.75 15.465 10.75 14.5C10.75 13.535 11.535 12.75 12.5 12.75C13.465 12.75 14.25 13.535 14.25 14.5ZM21 13.5H17C16.586 13.5 16.25 13.836 16.25 14.25C16.25 14.664 16.586 15 17 15H21C21.414 15 21.75 14.664 21.75 14.25C21.75 13.836 21.414 13.5 21 13.5ZM12.5 18.75C11.535 18.75 10.75 19.535 10.75 20.5C10.75 21.465 11.535 22.25 12.5 22.25C13.465 22.25 14.25 21.465 14.25 20.5C14.25 19.535 13.465 18.75 12.5 18.75ZM21 19.5H17C16.586 19.5 16.25 19.836 16.25 20.25C16.25 20.664 16.586 21 17 21H21C21.414 21 21.75 20.664 21.75 20.25C21.75 19.836 21.414 19.5 21 19.5Z" fill="#92B7FF"/>
      <path d="M22.25 4H21V3.5C21 2.673 20.327 2 19.5 2H12.5C11.673 2 11 2.673 11 3.5V4H9.75C7.683 4 6 5.683 6 7.75V26.25C6 28.317 7.683 30 9.75 30H22.25C24.317 30 26 28.317 26 26.25V7.75C26 5.683 24.317 4 22.25 4ZM24.5 26.25C24.5 27.49 23.49 28.5 22.25 28.5H9.75C8.51 28.5 7.5 27.49 7.5 26.25V7.75C7.5 6.51 8.51 5.5 9.75 5.5H11C11 6.327 11.673 7 12.5 7H19.5C20.327 7 21 6.327 21 5.5H22.25C23.49 5.5 24.5 6.51 24.5 7.75V26.25Z" fill="#1E61E6"/>
    </svg>
  );
}

// Art-32-1.svg — folder / portfolio
function PortfolioIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M2 23.736C2 26.079 3.906 27.985 6.249 27.985H25.751C28.094 27.985 30 26.079 30 23.736V10.5C30 9.121 28.879 8 27.5 8H17.017C15.956 8 15.002 7.41 14.528 6.462L13.005 3.415C12.878 3.16 12.618 3 12.334 3H4.518C3.13 3 2.001 4.129 2.001 5.517V23.737L2 23.736ZM27.5 9.5C28.052 9.5 28.5 9.948 28.5 10.5V23.736C28.5 25.252 27.267 26.485 25.751 26.485H6.249C4.733 26.485 3.5 25.252 3.5 23.736V9.5H27.5Z" fill="#4A3DCF"/>
    </svg>
  );
}

// Art-32-3.svg — envelope / email
function EmailIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M3.994 23.564C3.981 23.575 3.966 23.5791 3.953 23.5891C3.673 23.2141 3.5 22.753 3.5 22.25V22.0029L10.519 15.8621L11.582 16.925L3.994 23.564ZM20.418 16.925L28.006 23.564C28.019 23.575 28.034 23.5791 28.047 23.5891C28.327 23.2141 28.5 22.753 28.5 22.25V22.0029L21.481 15.8621L20.418 16.925Z" fill="#8ED4B4"/>
      <path d="M26.25 6H5.75C3.683 6 2 7.683 2 9.75V22.25C2 24.317 3.683 26 5.75 26H26.25C28.317 26 30 24.317 30 22.25V9.75C30 7.683 28.317 6 26.25 6ZM5.75 7.5H26.25C26.671 7.5 27.06 7.624 27.397 7.825L16.805 18.416C16.375 18.848 15.623 18.848 15.194 18.416L4.602 7.825C4.939 7.623 5.33 7.5 5.75 7.5ZM28.5 22.003V22.25C28.5 22.753 28.328 23.214 28.047 23.589C27.636 24.139 26.987 24.5 26.25 24.5H5.75C5.013 24.5 4.363 24.139 3.953 23.589C3.673 23.214 3.5 22.753 3.5 22.25V9.75C3.5 9.481 3.555 9.226 3.643 8.986L10.519 15.861L11.582 16.924L14.134 19.476C14.632 19.975 15.295 20.249 16 20.249C16.705 20.249 17.368 19.975 17.866 19.476L20.418 16.924L21.481 15.861L28.357 8.986C28.444 9.226 28.5 9.48 28.5 9.75V22.003Z" fill="#238B5C"/>
    </svg>
  );
}

// Goal — star (no exact match in provided files, keeping custom)
function GoalIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="0" fill="none"/>
      <path d="M16 5l2.9 5.8 6.4.93-4.65 4.53 1.1 6.39L16 19.5l-5.75 3.15 1.1-6.39L6.7 11.73l6.4-.93L16 5z" stroke="#7C5AEE" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

function CheckmarkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1.5 5l2.5 2.5 5-5" stroke="var(--surface)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Checkbox({ checked, onChange, label, bold }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={onChange}
        style={{
          width: 16, height: 16, borderRadius: 3, flexShrink: 0,
          border: checked ? 'none' : '1.5px solid var(--border-strong)',
          background: checked ? '#3E7FEA' : 'var(--surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {checked && <CheckmarkIcon />}
      </div>
      <span style={{ fontSize: 14, fontFamily: SFT, color: 'var(--text)', fontWeight: bold ? 600 : 400 }}>
        {label}
      </span>
    </label>
  );
}

// ─── Service notification settings ────────────────────────────────────────────

const MY_TICKET_ITEMS = [
  { id: 'sla_breach',     label: 'When SLA is about to be breached' },
  { id: 'assigned',       label: 'When a ticket is assigned to me' },
  { id: 'commented',      label: 'When someone comments on my ticket' },
  { id: 'status_changed', label: 'When ticket status changes' },
  { id: 'priority',       label: 'When ticket priority changes' },
  { id: 'due_date',       label: 'When due date is changed' },
  { id: 'escalated',      label: 'When a ticket is escalated' },
  { id: 'resolved',       label: 'When a ticket is resolved' },
];

const COLLAB_ITEMS = [
  { id: 'c_commented',  label: 'When someone comments' },
  { id: 'c_mentioned',  label: "When I'm @mentioned" },
  { id: 'c_status',     label: 'When status changes' },
  { id: 'c_sla',        label: 'When SLA is breached' },
  { id: 'c_reassigned', label: 'When ticket is reassigned' },
  { id: 'c_resolved',   label: 'When ticket is resolved' },
  { id: 'c_ai_action',  label: 'When AI takes an action on the ticket' },
];

function ServiceExpanded() {
  const init = items => Object.fromEntries(items.map(i => [i.id, false]));
  const [myChecks, setMyChecks] = useState(init(MY_TICKET_ITEMS));
  const [collabChecks, setCollabChecks] = useState(init(COLLAB_ITEMS));

  const allMy = MY_TICKET_ITEMS.every(i => myChecks[i.id]);
  const allCollab = COLLAB_ITEMS.every(i => collabChecks[i.id]);

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Top divider — aligned with title text (64px from left, 16px from right) */}
      <div style={{ height: 1, background: 'var(--border)', marginLeft: 64, marginRight: 16, marginBottom: 16 }} />
      {/* Section 1: My tickets */}
      <div>
        <div style={{ paddingLeft: 64 }}>
          <Checkbox checked={allMy} onChange={() => setMyChecks(Object.fromEntries(MY_TICKET_ITEMS.map(i => [i.id, !allMy])))} label="My tickets" bold />
        </div>
        <div style={{ marginTop: 12, paddingLeft: 88, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MY_TICKET_ITEMS.map(item => (
            <Checkbox key={item.id} checked={myChecks[item.id]}
              onChange={() => setMyChecks(p => ({ ...p, [item.id]: !p[item.id] }))}
              label={item.label} />
          ))}
        </div>
      </div>

      {/* Divider aligned with title text */}
      <div style={{ height: 1, background: 'var(--border)', marginTop: 16, marginBottom: 16, marginLeft: 64, marginRight: 16 }} />

      {/* Section 2: Collaborating */}
      <div>
        <div style={{ paddingLeft: 64 }}>
          <Checkbox checked={allCollab} onChange={() => setCollabChecks(Object.fromEntries(COLLAB_ITEMS.map(i => [i.id, !allCollab])))} label="Tickets I'm collaborating on" bold />
        </div>
        <div style={{ marginTop: 12, paddingLeft: 88, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COLLAB_ITEMS.map(item => (
            <Checkbox key={item.id} checked={collabChecks[item.id]}
              onChange={() => setCollabChecks(p => ({ ...p, [item.id]: !p[item.id] }))}
              label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NotificationCard ─────────────────────────────────────────────────────────

function NotificationCard({ Icon, title, subtitle, action, expandable, expanded, onToggle }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 8,
      background: 'var(--surface)',
      overflow: 'hidden',
    }}>
      <div
        style={{
          display: 'flex',
          padding: 16,
          alignItems: 'center',
          gap: 16,
          cursor: expandable ? 'pointer' : 'default',
        }}
        onClick={expandable ? onToggle : undefined}
        onMouseEnter={e => { if (expandable) e.currentTarget.style.background = 'var(--background-weak)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        <Icon />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, lineHeight: '20px' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, lineHeight: '17px', marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
        {action && (
          <button
            type="button"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', height: 30,
              border: '1px solid var(--border)', borderRadius: 6,
              background: 'var(--surface)', cursor: 'pointer',
              fontSize: 13, fontFamily: SFT, color: 'var(--text)', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}
          >
            <ExternalLinkIcon />
            {action}
          </button>
        )}
        <div style={{ color: 'var(--text-disabled)' }}>
          <ChevronDownIcon up={expanded} />
        </div>
      </div>
      {expanded && <ServiceExpanded />}
    </div>
  );
}

// ─── SettingsModal ────────────────────────────────────────────────────────────

export default function SettingsModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('Notifications');
  const [expandedCard, setExpandedCard] = useState(null);

  const cards = [
    { id: 'desktop',   Icon: DesktopIcon,   title: 'Desktop notifications',         subtitle: 'Customize what notifications you receive on your desktop' },
    { id: 'service',   Icon: ServiceIcon,   title: 'Service notifications',         subtitle: 'Get notified about ticket updates, SLA breaches, and escalations', expandable: true },
    { id: 'slack',     Icon: SlackIcon,     title: 'Slack notifications',           subtitle: 'Get notified in Slack about activity in Asana' },
    { id: 'teams',     Icon: TeamsIcon,     title: 'Microsoft Teams notifications', subtitle: 'Get notified in Microsoft Teams about activity in Asana', action: 'Connect' },
    { id: 'project',   Icon: ProjectIcon,   title: 'Project notifications' },
    { id: 'portfolio', Icon: PortfolioIcon, title: 'Portfolio notifications' },
    { id: 'goal',      Icon: GoalIcon,      title: 'Goal notifications' },
    { id: 'email',     Icon: EmailIcon,     title: 'Email notifications' },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Settings" size="lg">
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        margin: '-20px -20px 20px',
        padding: '0 20px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab;
          return (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 12px', border: 'none', background: 'transparent',
                fontSize: 13, fontFamily: SFT,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--text)' : 'var(--text-weak)',
                cursor: 'pointer', whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid var(--text)' : '2px solid transparent',
                marginBottom: -1, transition: 'color 150ms',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-weak)'; }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'Notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cards.map(card => (
            <NotificationCard
              key={card.id}
              {...card}
              expanded={expandedCard === card.id}
              onToggle={() => setExpandedCard(p => p === card.id ? null : card.id)}
            />
          ))}
        </div>
      )}

      {activeTab !== 'Notifications' && (
        <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 13, color: 'var(--text-disabled)', fontFamily: SFT }}>
          {activeTab} settings
        </div>
      )}
    </Modal>
  );
}
