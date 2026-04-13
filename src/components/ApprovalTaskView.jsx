// ─── ApprovalTaskView ─────────────────────────────────────────────────────────
// Reusable approval task panel — mirrors Asana's approval subtask UI.
// Fully controlled: approvalState comes from parent, mutations fire callbacks.
//
// Props:
//   title             — task title string
//   assignee          — { name, bg, fg, initials }  (the approver)
//   dueDate           — string, e.g. "Today" or "Feb 19 – 20"
//   ticketId          — string, e.g. "TICKET-66"
//   parentTaskLabel   — breadcrumb / link chip label
//   summaryText       — body paragraph in description
//   linkChipLabel     — text inside the link chip
//   approvalState     — 'pending' | 'approved' | 'rejected'  (controlled)
//   onApprove / onReject / onUndo / onClose  — () => void callbacks

import { useState, useEffect, useRef } from 'react';

// ─── Icons — exact asset paths ────────────────────────────────────────────────

// L-MiniIcon (12px)-3.svg — checkmark, uses currentColor so approve btn can go green
function CheckIcon12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9.7191 2.72473L4.0001 8.44423L2.0301 6.47473C1.9612 6.40192 1.8784 6.34366 1.78659 6.30339C1.69479 6.26313 1.59584 6.24167 1.4956 6.2403C1.39537 6.23893 1.29587 6.25767 1.203 6.29541C1.11013 6.33315 1.02576 6.38913 0.954896 6.46003C0.884028 6.53093 0.828093 6.61532 0.790397 6.70821C0.752701 6.8011 0.734009 6.9006 0.735427 7.00084C0.736844 7.10108 0.758342 7.20001 0.79865 7.2918C0.838957 7.38358 0.897257 7.46636 0.970102 7.53523L3.4701 10.0352C3.6161 10.1817 3.8081 10.2547 4.0001 10.2547C4.1921 10.2547 4.3841 10.1817 4.5306 10.0352L10.7806 3.78523C10.8534 3.71636 10.9117 3.63358 10.9521 3.5418C10.9924 3.45001 11.0139 3.35108 11.0153 3.25084C11.0167 3.1506 10.998 3.0511 10.9603 2.95821C10.9226 2.86532 10.8667 2.78093 10.7958 2.71003C10.7249 2.63913 10.6406 2.58315 10.5477 2.54541C10.4548 2.50767 10.3553 2.48893 10.2551 2.4903C10.1549 2.49167 10.0559 2.51313 9.96411 2.55339C9.87231 2.59365 9.78951 2.65192 9.7206 2.72473H9.7191Z"
            fill="currentColor" />
    </svg>
  );
}

// L-MiniIcon (12px)-2.svg — undo/reset, fixed amber #B37D35
function UndoIcon12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <g clipPath="url(#undo-clip)">
        <path d="M6 0.001C2.691 0.001 0 2.6925 0 6.001C0 7.3685 0.47 8.6765 1.3075 9.7295L0.0815 10.6355C0.0495543 10.6592 0.0253485 10.6919 0.0119345 10.7293C-0.00147951 10.7668 -0.00350102 10.8074 0.00612482 10.846C0.0157507 10.8846 0.0365929 10.9195 0.0660235 10.9463C0.0954542 10.9731 0.132156 10.9905 0.1715 10.9965L3.5175 11.4985C3.6275 11.515 3.73 11.439 3.7465 11.329L4.248 7.982C4.25396 7.94264 4.24809 7.9024 4.23115 7.86638C4.21421 7.83036 4.18695 7.80018 4.15284 7.77966C4.11872 7.75915 4.07928 7.74923 4.03952 7.75116C3.99976 7.75309 3.96147 7.76678 3.9295 7.7905L2.5145 8.8365C1.85999 8.03615 1.50182 7.0344 1.5005 6.0005C1.5005 3.519 3.519 1.5005 6.0005 1.5005C8.4825 1.5005 10.5005 3.519 10.5005 6.0005C10.5005 6.64898 10.3604 7.2898 10.0897 7.87907C9.81895 8.46833 9.42404 8.9921 8.932 9.4145C8.85731 9.47875 8.79601 9.55708 8.75159 9.64502C8.70717 9.73296 8.68051 9.82879 8.67313 9.92704C8.66575 10.0253 8.67779 10.124 8.70857 10.2176C8.73934 10.3112 8.78825 10.3978 8.8525 10.4725C8.91675 10.5472 8.99508 10.6085 9.08302 10.6529C9.17096 10.6973 9.26679 10.724 9.36504 10.7314C9.46328 10.7388 9.56202 10.7267 9.65561 10.6959C9.7492 10.6652 9.83581 10.6162 9.9105 10.552C10.5665 9.98878 11.093 9.2904 11.4539 8.50472C11.8148 7.71903 12.0016 6.86461 12.0015 6C12.0015 2.6915 9.31 0 6.0015 0L5.9995 0.001H6Z"
              fill="#B37D35" />
      </g>
      <defs>
        <clipPath id="undo-clip"><rect width="12" height="12" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

// L-MiniIcon (12px).svg — X reject, fixed red #E35A71
function XIcon12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M10.2892 1.7198C10.2196 1.65012 10.1369 1.59484 10.046 1.55713C9.95497 1.51941 9.85745 1.5 9.75896 1.5C9.66047 1.5 9.56294 1.51941 9.47196 1.55713C9.38098 1.59484 9.29832 1.65012 9.22871 1.7198L6.00921 4.9398L2.78921 1.7198C2.71951 1.6502 2.63678 1.59501 2.54576 1.55738C2.45473 1.51975 2.35718 1.50041 2.25868 1.50048C2.16018 1.50055 2.06266 1.52002 1.97168 1.55778C1.88071 1.59554 1.79806 1.65085 1.72846 1.72055C1.65886 1.79025 1.60367 1.87297 1.56604 1.964C1.52841 2.05503 1.50908 2.15258 1.50914 2.25108C1.50921 2.34958 1.52868 2.4471 1.56644 2.53807C1.6042 2.62905 1.65951 2.7117 1.72921 2.7813L4.94821 6.0013L1.72871 9.2208C1.65711 9.29002 1.60001 9.3728 1.56075 9.46432C1.52149 9.55584 1.50084 9.65427 1.50003 9.75385C1.49921 9.85344 1.51823 9.95219 1.55598 10.0443C1.59374 10.1365 1.64947 10.2202 1.71992 10.2906C1.79037 10.361 1.87414 10.4166 1.96633 10.4543C2.05852 10.492 2.15728 10.5109 2.25687 10.51C2.35645 10.5091 2.45486 10.4883 2.54634 10.449C2.63783 10.4096 2.72056 10.3525 2.78971 10.2808L6.00921 7.0613L9.22871 10.2813C9.37521 10.4278 9.56721 10.5008 9.75871 10.5008C9.90695 10.5007 10.0518 10.4566 10.175 10.3742C10.2983 10.2918 10.3943 10.1747 10.451 10.0377C10.5077 9.90076 10.5226 9.75006 10.4937 9.60466C10.4648 9.45926 10.3935 9.32568 10.2887 9.2208L7.07021 6.0008L10.2897 2.7808C10.43 2.64004 10.5087 2.44934 10.5085 2.25059C10.5084 2.05184 10.4293 1.86129 10.2887 1.7208L10.2892 1.7198Z"
            fill="#E35A71" />
    </svg>
  );
}

// L-MiniIcon (12px)-1.svg — bar chart, used in Share button
function BarChartIcon12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <g clipPath="url(#chart-clip)">
        <path d="M11.499 10H10.999V7C10.999 6.4485 10.5505 6 9.99902 6H7.99902V10H6.99902V2C6.99902 1.4485 6.55052 1 5.99902 1H1.99902C1.44752 1 0.999023 1.4485 0.999023 2V10H0.499023C0.366415 10 0.239238 10.0527 0.14547 10.1464C0.0517019 10.2402 -0.000976562 10.3674 -0.000976562 10.5C-0.000976562 10.6326 0.0517019 10.7598 0.14547 10.8536C0.239238 10.9473 0.366415 11 0.499023 11H11.499C11.6316 11 11.7588 10.9473 11.8526 10.8536C11.9463 10.7598 11.999 10.6326 11.999 10.5C11.999 10.3674 11.9463 10.2402 11.8526 10.1464C11.7588 10.0527 11.6316 10 11.499 10ZM4.99902 8H2.99902C2.86642 8 2.73924 7.94732 2.64547 7.85355C2.5517 7.75979 2.49902 7.63261 2.49902 7.5C2.49902 7.36739 2.5517 7.24021 2.64547 7.14645C2.73924 7.05268 2.86642 7 2.99902 7H4.99902C5.13163 7 5.25881 7.05268 5.35258 7.14645C5.44634 7.24021 5.49902 7.36739 5.49902 7.5C5.49902 7.63261 5.44634 7.75979 5.35258 7.85355C5.25881 7.94732 5.13163 8 4.99902 8ZM4.99902 6H2.99902C2.86642 6 2.73924 5.94732 2.64547 5.85355C2.5517 5.75979 2.49902 5.63261 2.49902 5.5C2.49902 5.36739 2.5517 5.24021 2.64547 5.14645C2.73924 5.05268 2.86642 5 2.99902 5H4.99902C5.13163 5 5.25881 5.05268 5.35258 5.14645C5.44634 5.24021 5.49902 5.36739 5.49902 5.5C5.49902 5.63261 5.44634 5.75979 5.35258 5.85355C5.25881 5.94732 5.13163 6 4.99902 6ZM4.99902 4H2.99902C2.86642 4 2.73924 3.94732 2.64547 3.85355C2.5517 3.75979 2.49902 3.63261 2.49902 3.5C2.49902 3.36739 2.5517 3.24021 2.64547 3.14645C2.73924 3.05268 2.86642 3 2.99902 3H4.99902C5.13163 3 5.25881 3.05268 5.35258 3.14645C5.44634 3.24021 5.49902 3.36739 5.49902 3.5C5.49902 3.63261 5.44634 3.75979 5.35258 3.85355C5.25881 5.94732 5.13163 4 4.99902 4Z"
              fill="var(--icon)" />
      </g>
      <defs>
        <clipPath id="chart-clip"><rect width="12" height="12" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

// Icon-1.svg — thumbs up, 16px
function ThumbsUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 13.9998H12.47C12.9491 14.0021 13.4129 13.8318 13.7767 13.5201C14.1405 13.2084 14.3799 12.7761 14.451 12.3023L15.227 7.28732C15.2708 7.00461 15.2528 6.71577 15.1742 6.44068C15.0957 6.16559 14.9585 5.91079 14.772 5.69382C14.5859 5.47669 14.3551 5.30242 14.0953 5.18296C13.8355 5.06351 13.5529 5.00172 13.267 5.00182H10V2.00282C10 1.02232 9.355 0.23432 8.393 0.0418201C7.434 -0.14968 6.5315 0.32832 6.1545 1.23332L4.167 6.00132H2.5C1.673 6.00132 1 6.67382 1 7.50082V12.4998C1 13.3268 1.673 13.9998 2.5 13.9998ZM5 6.59982L7.0775 1.61532C7.31 1.05732 7.8275 0.94482 8.1965 1.01982C8.5675 1.09382 9.0005 1.39532 9.0005 2.00032V5.99982H13.2665C13.5535 5.99982 13.8255 6.12482 14.0125 6.34332C14.1995 6.56182 14.282 6.84932 14.2375 7.13332L13.462 12.1493C13.4264 12.3866 13.3066 12.6032 13.1244 12.7594C12.9423 12.9155 12.71 13.0009 12.47 12.9998H5V6.59982ZM2 7.49982C2 7.22432 2.2245 6.99982 2.5 6.99982H4V12.9998H2.5C2.2245 12.9998 2 12.7753 2 12.4998V7.49982Z"
            fill="var(--icon)" />
    </svg>
  );
}

// Icon-2.svg — chain link, 16px
function LinkIcon16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <g clipPath="url(#link-clip)">
        <path d="M9.68177 6.31775C10.1011 6.73475 10.4335 7.2308 10.6597 7.77717C10.886 8.32355 11.0016 8.90939 10.9998 9.50075C11.0014 10.0921 10.8858 10.6779 10.6595 11.2242C10.4333 11.7706 10.101 12.2667 9.68177 12.6838L7.68127 14.6838C7.2636 15.1021 6.7674 15.4338 6.22116 15.6598C5.67492 15.8858 5.08942 16.0017 4.49827 16.0007C3.90713 16.0017 3.32162 15.8858 2.77539 15.6598C2.22915 15.4338 1.73295 15.1021 1.31527 14.6838C-0.439727 12.9288 -0.439727 10.0738 1.31527 8.31875L3.14427 6.48925C3.19073 6.44283 3.24587 6.40601 3.30656 6.3809C3.36724 6.35579 3.43228 6.34288 3.49795 6.3429C3.56362 6.34292 3.62865 6.35588 3.68932 6.38103C3.74998 6.40619 3.8051 6.44304 3.85152 6.4895C3.89795 6.53596 3.93476 6.5911 3.95987 6.65178C3.98499 6.71247 3.9979 6.7775 3.99787 6.84318C3.99785 6.90885 3.98489 6.97388 3.95974 7.03454C3.93459 7.09521 3.89773 7.15033 3.85127 7.19675L2.02227 9.02575C1.36689 9.68281 0.998838 10.573 0.998838 11.501C0.998838 12.429 1.36689 13.3192 2.02227 13.9762C3.38727 15.3412 5.60877 15.3422 6.97377 13.9762L8.97427 11.9762C9.62981 11.3192 9.99796 10.4289 9.99796 9.50075C9.99796 8.57259 9.62981 7.68233 8.97427 7.02525C8.57347 6.62166 8.07941 6.32303 7.53577 6.15575C7.41143 6.11461 7.3082 6.02633 7.24826 5.90989C7.18832 5.79344 7.17646 5.65812 7.21524 5.53303C7.25401 5.40793 7.34032 5.30304 7.45561 5.24091C7.5709 5.17877 7.70596 5.16435 7.83177 5.20075C8.52973 5.41785 9.16445 5.80136 9.68127 6.31825L9.68177 6.31775ZM14.6833 1.31625C12.9278 -0.43875 10.0728 -0.43875 8.31727 1.31625L6.31677 3.31625C5.8974 3.7333 5.56496 4.22944 5.33871 4.77591C5.11247 5.32237 4.99693 5.9083 4.99877 6.49975C4.99877 7.70225 5.46677 8.83225 6.31677 9.68325C6.83359 10.2001 7.46832 10.5836 8.16627 10.8007C8.29132 10.8344 8.42454 10.8183 8.53795 10.7558C8.65137 10.6933 8.73614 10.5893 8.77446 10.4656C8.81278 10.3419 8.80166 10.2081 8.74345 10.0925C8.68523 9.97678 8.58445 9.88817 8.46227 9.84525C7.91868 9.67811 7.42463 9.37966 7.02377 8.97625C6.36808 8.31915 5.99984 7.42878 5.99984 6.5005C5.99984 5.57222 6.36808 4.68185 7.02377 4.02475L9.02427 2.02475C10.3898 0.65975 12.6113 0.65975 13.9758 2.02475C15.3403 3.38875 15.3408 5.61025 13.9758 6.97575L12.1468 8.80425C12.1003 8.85067 12.0635 8.90579 12.0383 8.96646C12.0132 9.02712 12.0002 9.09215 12.0002 9.15782C12.0001 9.2235 12.0131 9.28853 12.0382 9.34922C12.0633 9.4099 12.1001 9.46505 12.1465 9.5115C12.1929 9.55796 12.2481 9.59481 12.3087 9.61997C12.3694 9.64512 12.4344 9.65808 12.5001 9.6581C12.5658 9.65812 12.6308 9.64521 12.6915 9.6201C12.7522 9.59499 12.8073 9.55817 12.8538 9.51175L14.6828 7.68225C16.4378 5.92725 16.4378 3.07225 14.6828 1.31725L14.6833 1.31625Z"
              fill="var(--icon)" />
      </g>
      <defs>
        <clipPath id="link-clip"><rect width="16" height="16" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

// Icon.svg — expand (diagonal arrows), 16px
function ExpandIcon16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M9.14552 6.1465L13.292 2H9.49902C9.36642 2 9.23924 1.94732 9.14547 1.85355C9.0517 1.75979 8.99902 1.63261 8.99902 1.5C8.99902 1.36739 9.0517 1.24021 9.14547 1.14645C9.23924 1.05268 9.36642 1 9.49902 1H14.499C14.6316 1 14.7588 1.05268 14.8526 1.14645C14.9463 1.24021 14.999 1.36739 14.999 1.5V6.5C14.999 6.63261 14.9463 6.75979 14.8526 6.85355C14.7588 6.94732 14.6316 7 14.499 7C14.3664 7 14.2392 6.94732 14.1455 6.85355C14.0517 6.75979 13.999 6.63261 13.999 6.5V2.707L9.85252 6.8535C9.8062 6.90009 9.75112 6.93707 9.69045 6.9623C9.62978 6.98753 9.56473 7.00052 9.49902 7.00052C9.43332 7.00052 9.36826 6.98753 9.3076 6.9623C9.24693 6.93707 9.19185 6.90009 9.14552 6.8535C9.09905 6.80711 9.06218 6.752 9.03703 6.69135C9.01187 6.63069 8.99892 6.56567 8.99892 6.5C8.99892 6.43433 9.01187 6.36931 9.03703 6.30865C9.06218 6.248 9.09905 6.19289 9.14552 6.1465ZM1.49902 9C1.36642 9 1.23924 9.05268 1.14547 9.14645C1.0517 9.24021 0.999023 9.36739 0.999023 9.5V14.5C0.999023 14.6326 1.0517 14.7598 1.14547 14.8536C1.23924 14.9473 1.36642 15 1.49902 15H6.49902C6.63163 15 6.75881 14.9473 6.85258 14.8536C6.94634 14.7598 6.99902 14.6326 6.99902 14.5C6.99902 14.3674 6.94634 14.2402 6.85258 14.1464C6.75881 14.0527 6.63163 14 6.49902 14H2.70602L6.85252 9.8535C6.89895 9.80708 6.93577 9.75197 6.96089 9.69131C6.98602 9.63066 6.99895 9.56565 6.99895 9.5C6.99895 9.43435 6.98602 9.36934 6.96089 9.30869C6.93577 9.24803 6.89895 9.19292 6.85252 9.1465C6.8061 9.10008 6.75099 9.06325 6.69034 9.03813C6.62968 9.01301 6.56467 9.00008 6.49902 9.00008C6.43337 9.00008 6.36836 9.01301 6.30771 9.03813C6.24706 9.06325 6.19195 9.10008 6.14552 9.1465L1.99902 13.293V9.5C1.99902 9.36739 1.94634 9.24021 1.85258 9.14645C1.75881 9.05268 1.63163 9 1.49902 9Z"
            fill="var(--icon)" />
    </svg>
  );
}

// MoreIcon (16px).svg — three dots, 16px
function DotsHIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 6.5C8.85 6.5 9.5 7.15 9.5 8C9.5 8.85 8.85 9.5 8 9.5C7.15 9.5 6.5 8.85 6.5 8C6.5 7.15 7.15 6.5 8 6.5ZM1.5 6.5C2.35 6.5 3 7.15 3 8C3 8.85 2.35 9.5 1.5 9.5C0.65 9.5 0 8.85 0 8C0 7.15 0.65 6.5 1.5 6.5ZM14.5 6.5C15.35 6.5 16 7.15 16 8C16 8.85 15.35 9.5 14.5 9.5C13.65 9.5 13 8.85 13 8C13 7.15 13.65 6.5 14.5 6.5Z"
            fill="var(--icon)" />
    </svg>
  );
}

// CloseIcon (16px).svg — arrow →|, 16px
function CollapseRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M0.974609 7.25002H10.1746L6.47461 3.55002C6.17461 3.25002 6.17461 2.80002 6.47461 2.50002C6.77461 2.20002 7.22461 2.20002 7.52461 2.50002L12.5246 7.50002C12.8246 7.80002 12.8246 8.25002 12.5246 8.55002L7.52461 13.55C7.37461 13.7 7.17461 13.75 6.97461 13.75C6.77461 13.75 6.57461 13.7 6.42461 13.55C6.12461 13.25 6.12461 12.8 6.42461 12.5L10.1246 8.80002H0.974609C0.57461 8.80002 0.224609 8.45002 0.224609 8.05002C0.224609 7.65002 0.57461 7.25002 0.974609 7.25002Z"
            fill="var(--icon)" />
      <path d="M13.9996 1.75C13.9996 1.33579 14.3354 1 14.7496 1C15.1638 1 15.4996 1.33579 15.4996 1.75V14.25C15.4996 14.6642 15.1638 15 14.7496 15C14.3354 15 13.9996 14.6642 13.9996 14.25V1.75Z"
            fill="var(--icon)" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="var(--text-disabled)" strokeWidth="1.2" />
      <path d="M1.5 6h11" stroke="var(--text-disabled)" strokeWidth="1.2" />
      <path d="M5 1v3M9 1v3" stroke="var(--text-disabled)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightSmallIcon() {
  return (
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true">
      <path d="M3.5 2L7 5l-3.5 3" stroke="var(--text-disabled)" strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TicketFieldIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="var(--text-disabled)" strokeWidth="1.2" />
      <path d="M4 5h6M4 7.5h6M4 10h3" stroke="var(--text-disabled)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 10 14" width="9" height="12" fill="#F59E0B" aria-hidden="true">
      <path d="M6 1L1.5 8h4L4 13l6-7H6V1z" />
    </svg>
  );
}

function CommentOnlyPill() {
  return (
    <svg width="118" height="24" viewBox="0 0 118 24" fill="none" aria-label="Comment only" style={{ flexShrink: 0 }}>
      <rect width="118" height="24" rx="4" fill="var(--border)"/>
      <g clipPath="url(#co-clip)">
        <path d="M11 17C13.757 17 16 14.757 16 12C16 9.243 13.757 7 11 7H9C6.243 7 4 9.243 4 12C3.99977 12.7392 4.16357 13.4693 4.47959 14.1376C4.79562 14.8058 5.25598 15.3957 5.8275 15.8645L6.01 17.1415C6.03621 17.3253 6.11308 17.4982 6.23199 17.6408C6.35089 17.7833 6.50715 17.89 6.68325 17.9488C6.85935 18.0076 7.04835 18.0162 7.22907 17.9737C7.40979 17.9312 7.57511 17.8392 7.7065 17.708L8.415 17.0015L11.0005 17H11ZM8 16.0025L7 17L6.759 15.313C6.04991 14.8333 5.51345 14.1387 5.2285 13.3314C4.94355 12.524 4.92514 11.6466 5.17598 10.828C5.42682 10.0095 5.93367 9.29299 6.62201 8.78393C7.31036 8.27487 8.14387 8.00009 9 8H11C12.0609 8 13.0783 8.42143 13.8284 9.17157C14.5786 9.92172 15 10.9391 15 12C15 13.0609 14.5786 14.0783 13.8284 14.8284C13.0783 15.5786 12.0609 16 11 16L8 16.0025Z" fill="#757677"/>
      </g>
      <path d="M25.2295 17.2324C23.8896 17.2324 22.8278 16.7699 22.0439 15.8447C21.2646 14.9196 20.875 13.6618 20.875 12.0713C20.875 10.4808 21.2646 9.22298 22.0439 8.29785C22.8232 7.36816 23.8828 6.90332 25.2227 6.90332C26.2617 6.90332 27.1504 7.19954 27.8887 7.79199C28.627 8.38444 29.069 9.1569 29.2148 10.1094H27.9639C27.7998 9.47135 27.4717 8.96777 26.9795 8.59863C26.4873 8.22493 25.9017 8.03809 25.2227 8.03809C24.2747 8.03809 23.5228 8.40039 22.9668 9.125C22.4154 9.84961 22.1396 10.8317 22.1396 12.0713C22.1396 13.3109 22.4176 14.293 22.9736 15.0176C23.5296 15.7376 24.2816 16.0977 25.2295 16.0977C25.9176 16.0977 26.5055 15.9336 26.9932 15.6055C27.4854 15.2728 27.8089 14.8216 27.9639 14.252H29.2148C29.0508 15.1589 28.6064 15.8835 27.8818 16.4258C27.1618 16.9635 26.2777 17.2324 25.2295 17.2324ZM36.4887 16.1113C35.8826 16.7904 35.0554 17.1299 34.0072 17.1299C32.959 17.1299 32.1296 16.7904 31.5189 16.1113C30.9128 15.4277 30.6098 14.4958 30.6098 13.3154C30.6098 12.1305 30.9128 11.1986 31.5189 10.5195C32.1251 9.84049 32.9545 9.50098 34.0072 9.50098C35.06 9.50098 35.8894 9.84049 36.4955 10.5195C37.1016 11.1986 37.4047 12.1305 37.4047 13.3154C37.4047 14.4958 37.0993 15.4277 36.4887 16.1113ZM32.3939 15.3525C32.7722 15.8311 33.31 16.0703 34.0072 16.0703C34.7045 16.0703 35.2423 15.8311 35.6205 15.3525C35.9988 14.8695 36.1879 14.1904 36.1879 13.3154C36.1879 12.4404 35.9988 11.7637 35.6205 11.2852C35.2423 10.8021 34.7045 10.5605 34.0072 10.5605C33.31 10.5605 32.7722 10.8021 32.3939 11.2852C32.0157 11.7637 31.8266 12.4404 31.8266 13.3154C31.8266 14.1904 32.0157 14.8695 32.3939 15.3525ZM39.1004 17V9.63086H40.2215V10.793H40.3309C40.4995 10.3828 40.7615 10.0661 41.117 9.84277C41.4725 9.61491 41.8963 9.50098 42.3885 9.50098C42.8716 9.50098 43.2863 9.61719 43.6326 9.84961C43.9835 10.082 44.2479 10.3965 44.4256 10.793H44.535C44.7355 10.3965 45.0363 10.082 45.4373 9.84961C45.8383 9.61719 46.2895 9.50098 46.7908 9.50098C47.5428 9.50098 48.1216 9.71061 48.5271 10.1299C48.9327 10.5446 49.1355 11.137 49.1355 11.9072V17H47.9598V12.1807C47.9598 11.1006 47.4425 10.5605 46.408 10.5605C45.9067 10.5605 45.4966 10.7246 45.1775 11.0527C44.8585 11.3809 44.699 11.7842 44.699 12.2627V17H43.5232V11.9961C43.5232 11.5586 43.382 11.21 43.0994 10.9502C42.8214 10.6904 42.45 10.5605 41.9852 10.5605C41.5066 10.5605 41.101 10.7428 40.7684 11.1074C40.4402 11.472 40.2762 11.9141 40.2762 12.4336V17H39.1004ZM51.132 17V9.63086H52.2531V10.793H52.3625C52.5311 10.3828 52.7932 10.0661 53.1486 9.84277C53.5041 9.61491 53.9279 9.50098 54.4201 9.50098C54.9032 9.50098 55.3179 9.61719 55.6643 9.84961C56.0152 10.082 56.2795 10.3965 56.4572 10.793H56.5666C56.7671 10.3965 57.0679 10.082 57.4689 9.84961C57.87 9.61719 58.3212 9.50098 58.8225 9.50098C59.5744 9.50098 60.1532 9.71061 60.5588 10.1299C60.9644 10.5446 61.1672 11.137 61.1672 11.9072V17H59.9914V12.1807C59.9914 11.1006 59.4742 10.5605 58.4396 10.5605C57.9383 10.5605 57.5282 10.7246 57.2092 11.0527C56.8902 11.3809 56.7307 11.7842 56.7307 12.2627V17H55.5549V11.9961C55.5549 11.5586 55.4136 11.21 55.1311 10.9502C54.8531 10.6904 54.4816 10.5605 54.0168 10.5605C53.5383 10.5605 53.1327 10.7428 52.8 11.1074C52.4719 11.472 52.3078 11.9141 52.3078 12.4336V17H51.132ZM66.1031 10.54C65.5152 10.54 65.0322 10.7383 64.6539 11.1348C64.2757 11.5312 64.0637 12.0553 64.0182 12.707H68.0787C68.065 12.0553 67.8782 11.5312 67.5182 11.1348C67.1581 10.7383 66.6865 10.54 66.1031 10.54ZM68.0445 15.0928H69.2203C69.0426 15.7308 68.6803 16.2298 68.1334 16.5898C67.5911 16.9499 66.9189 17.1299 66.1168 17.1299C65.096 17.1299 64.287 16.7881 63.69 16.1045C63.093 15.4163 62.7945 14.4889 62.7945 13.3223C62.7945 12.1602 63.0953 11.2327 63.6969 10.54C64.2984 9.84733 65.1051 9.50098 66.1168 9.50098C67.1103 9.50098 67.8919 9.83138 68.4615 10.4922C69.0312 11.153 69.316 12.0576 69.316 13.2061V13.6572H64.0182V13.7119C64.0501 14.4411 64.2551 15.0199 64.6334 15.4482C65.0162 15.8766 65.5198 16.0908 66.1441 16.0908C67.0966 16.0908 67.7301 15.7581 68.0445 15.0928ZM71.0117 17V9.63086H72.1328V10.793H72.2422C72.6341 9.93164 73.3724 9.50098 74.457 9.50098C75.2819 9.50098 75.9176 9.73796 76.3643 10.2119C76.8109 10.6813 77.0342 11.3535 77.0342 12.2285V17H75.8584V12.5156C75.8584 11.8548 75.7148 11.3649 75.4277 11.0459C75.1452 10.7223 74.71 10.5605 74.1221 10.5605C73.5296 10.5605 73.0579 10.7474 72.707 11.1211C72.3607 11.4902 72.1875 11.9961 72.1875 12.6387V17H71.0117ZM79.5297 7.72363H80.7055V9.63086H82.3461V10.6152H80.7055V14.7852C80.7055 15.2181 80.7921 15.5326 80.9652 15.7285C81.1384 15.9245 81.4164 16.0225 81.7992 16.0225C81.9678 16.0225 82.1501 16.0133 82.3461 15.9951V16.9863C82.0863 17.0319 81.8562 17.0547 81.6557 17.0547C80.8946 17.0547 80.35 16.902 80.0219 16.5967C79.6937 16.2913 79.5297 15.7878 79.5297 15.0859V10.6152H78.3402V9.63086H79.5297V7.72363ZM93.2844 16.1113C92.6783 16.7904 91.8511 17.1299 90.8029 17.1299C89.7548 17.1299 88.9253 16.7904 88.3147 16.1113C87.7085 15.4277 87.4055 14.4958 87.4055 13.3154C87.4055 12.1305 87.7085 11.1986 88.3147 10.5195C88.9208 9.84049 89.7502 9.50098 90.8029 9.50098C91.8557 9.50098 92.6851 9.84049 93.2912 10.5195C93.8973 11.1986 94.2004 12.1305 94.2004 13.3154C94.2004 14.4958 93.8951 15.4277 93.2844 16.1113ZM89.1897 15.3525C89.5679 15.8311 90.1057 16.0703 90.8029 16.0703C91.5002 16.0703 92.038 15.8311 92.4162 15.3525C92.7945 14.8695 92.9836 14.1904 92.9836 13.3154C92.9836 12.4404 92.7945 11.7637 92.4162 11.2852C92.038 10.8021 91.5002 10.5605 90.8029 10.5605C90.1057 10.5605 89.5679 10.8021 89.1897 11.2852C88.8114 11.7637 88.6223 12.4404 88.6223 13.3154C88.6223 14.1904 88.8114 14.8695 89.1897 15.3525ZM95.8961 17V9.63086H97.0172V10.793H97.1266C97.5185 9.93164 98.2568 9.50098 99.3414 9.50098C100.166 9.50098 100.802 9.73796 101.249 10.2119C101.695 10.6813 101.919 11.3535 101.919 12.2285V17H100.743V12.5156C100.743 11.8548 100.599 11.3649 100.312 11.0459C100.03 10.7223 99.5943 10.5605 99.0064 10.5605C98.414 10.5605 97.9423 10.7474 97.5914 11.1211C97.2451 11.4902 97.0719 11.9961 97.0719 12.6387V17H95.8961ZM103.99 17V6.70508H105.166V17H103.99ZM107.928 19.666C107.741 19.666 107.566 19.6523 107.402 19.625V18.6201C107.52 18.6429 107.684 18.6543 107.894 18.6543C108.236 18.6543 108.507 18.5632 108.707 18.3809C108.912 18.1986 109.093 17.8864 109.247 17.4443L109.384 17.0068L106.657 9.63086H107.928L109.952 15.6943H110.061L112.078 9.63086H113.329L110.451 17.4512C110.136 18.3034 109.801 18.8844 109.446 19.1943C109.09 19.5088 108.584 19.666 107.928 19.666Z" fill="var(--text)"/>
      <defs>
        <clipPath id="co-clip">
          <rect width="12" height="12" fill="white" transform="translate(4 6)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 8.5C5 9.5 9 9.5 9.5 8.5" stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round" />
      <circle cx="5.5" cy="6" r="0.75" fill="currentColor" />
      <circle cx="8.5" cy="6" r="0.75" fill="currentColor" />
    </svg>
  );
}

// ─── SubtleIconBtn helper ─────────────────────────────────────────────────────

function SubtleIconBtn({ label, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center cursor-pointer transition-colors"
      style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none', flexShrink: 0 }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </button>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────
// Layout (left → right):
//   [✓ Approve/Approved]  [↺ undo]  [✕ reject]
//   · gap ·
//   [avatar1][avatar2] 6  [📊 Share]
//   · flex-1 ·
//   [👍] [🔗] [⤢] [⋯]  [→|]

const FACEPILE = [
  { bg: '6d8aad', fg: 'ffffff', initials: 'SS', name: 'Steve Smith' },
];

function Toolbar({ approvalState, assignee, onApprove, onReject, onUndo, onClose }) {
  const isApproved = approvalState === 'approved';
  const isRejected = approvalState === 'rejected';
  const isPending  = approvalState === 'pending';

  return (
    <div
      className="shrink-0 flex items-center"
      style={{ height: 44, padding: '0 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', gap: 6 }}
    >
      {/* ── Action buttons: Approve / Undo / Reject — disabled (comment-only access) ── */}
      <div className="flex items-center shrink-0" style={{ gap: 4, opacity: 0.38, pointerEvents: 'none' }}>

        {/* Approve */}
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5"
          style={{
            height: 26, padding: '0 9px', borderRadius: 6,
            fontSize: 12, fontWeight: 500,
            border: '1px solid var(--border)',
            background: 'var(--surface)', color: 'var(--text)',
            cursor: 'not-allowed', flexShrink: 0,
          }}
        >
          <CheckIcon12 />
          Approve
        </button>

        {/* Undo */}
        <button
          type="button"
          disabled
          aria-label="Undo"
          className="flex items-center justify-center"
          style={{
            width: 26, height: 26, borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'not-allowed', flexShrink: 0,
          }}
        >
          <UndoIcon12 />
        </button>

        {/* Reject */}
        <button
          type="button"
          disabled
          aria-label="Reject"
          className="flex items-center justify-center"
          style={{
            width: 26, height: 26, borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'not-allowed', flexShrink: 0,
          }}
        >
          <XIcon12 />
        </button>
      </div>

      {/* ── Flex spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Facepile + count ── */}
      <div className="flex items-center shrink-0" style={{ gap: 6, marginRight: 4 }}>
        <div className="flex items-center" style={{ gap: 0 }}>
          {FACEPILE.map((p, i) => (
            <img
              key={p.name}
              src={`https://placehold.co/26x26/${p.bg}/${p.fg}?text=${p.initials}`}
              alt={p.name}
              title={p.name}
              style={{
                width: 26, height: 26, borderRadius: '50%',
                outline: '2px solid var(--surface)',
                marginLeft: i === 0 ? 0 : -8,
                position: 'relative', zIndex: i,
                flexShrink: 0,
              }}
            />
          ))}
          {/* Assignee (Jen) */}
          <img
            src={`https://placehold.co/26x26/${assignee.bg}/${assignee.fg}?text=${assignee.initials}`}
            alt={assignee.name}
            title={assignee.name}
            style={{
              width: 26, height: 26, borderRadius: '50%',
              outline: '2px solid var(--surface)',
              marginLeft: -8,
              position: 'relative', zIndex: 2,
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* ── Share button ── */}
      <button
        type="button"
        className="flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
        style={{
          height: 26, padding: '0 9px', borderRadius: 6,
          fontSize: 12, fontWeight: 400,
          border: '1px solid var(--border)',
          background: 'var(--surface)', color: 'var(--text)',
          marginRight: 2,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
      >
        <BarChartIcon12 />
        Share
      </button>

      {/* ── Right icon buttons ── */}
      <div className="flex items-center shrink-0" style={{ gap: 0 }}>
        <SubtleIconBtn label="Like"><ThumbsUpIcon /></SubtleIconBtn>
        <SubtleIconBtn label="Copy link"><LinkIcon16 /></SubtleIconBtn>
        <SubtleIconBtn label="Expand"><ExpandIcon16 /></SubtleIconBtn>
        <SubtleIconBtn label="More options"><DotsHIcon /></SubtleIconBtn>
      </div>

      {/* ── Comment only pill ── */}
      <CommentOnlyPill />

      {/* ── Collapse / close panel ── */}
      <SubtleIconBtn label="Close panel" onClick={onClose}>
        <CollapseRightIcon />
      </SubtleIconBtn>
    </div>
  );
}

// ─── InfoBanner ──────────────────────────────────────────────────────────────

function InfoBanner() {
  return (
    <div
      className="shrink-0 flex items-center gap-2"
      style={{ padding: '8px 20px', background: 'var(--background-medium)', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-weak)', lineHeight: '18px' }}
    >
      <span style={{ flexShrink: 0, color: 'var(--text-disabled)' }}><LockIcon /></span>
      <span>This approval is visible to its collaborator and people who can see its parent task.</span>
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

function FieldRow({ label, children }) {
  return (
    <div className="flex items-center" style={{ minHeight: 36, gap: 0 }}>
      <span style={{ width: 100, flexShrink: 0, fontSize: 13, color: 'var(--text-weak)' }}>{label}</span>
      <div style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{children}</div>
    </div>
  );
}

// ─── Comment items ────────────────────────────────────────────────────────────

function AiComment({ text, time }) {
  return (
    <div className="flex items-center gap-2.5" style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '20px' }}>
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--selected-background-strong)' }}
      >
        <LightningIcon />
      </div>
      <span>
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>IT Agent</span>
        {' '}{text}
      </span>
      <span style={{ color: 'var(--text-disabled)', whiteSpace: 'nowrap', marginLeft: 2 }}>· {time}</span>
    </div>
  );
}

function ApprovalComment({ actor, actorBg, actorInitials, isRejection, time }) {
  return (
    <div className="flex items-center gap-2.5" style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '20px' }}>
      <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
        <img
          src={`https://placehold.co/24x24/${actorBg}/ffffff?text=${actorInitials}`}
          style={{ width: 24, height: 24, borderRadius: '50%' }}
          alt={actor}
        />
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 13, height: 13, borderRadius: '50%',
          background: isRejection ? 'var(--danger-text)' : 'var(--success-text)',
          border: '1.5px solid var(--surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isRejection
            ? <svg viewBox="0 0 8 8" width="7" height="7" fill="none"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>
            : <svg viewBox="0 0 8 8" width="7" height="7" fill="none"><path d="M1.5 4l1.5 1.5L6.5 2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          }
        </div>
      </div>
      <span>
        <span style={{ fontWeight: 600, color: isRejection ? 'var(--danger-text)' : 'var(--success-text)' }}>{actor}</span>
        {' '}{isRejection ? 'rejected this request' : 'approved this request'}
      </span>
      <span style={{ color: 'var(--text-disabled)', whiteSpace: 'nowrap', marginLeft: 2 }}>· {time}</span>
    </div>
  );
}

// ─── ApprovalTaskView ─────────────────────────────────────────────────────────

export default function ApprovalTaskView({
  title = 'Approval Requested: SFDC License for Martin Ludington',
  assignee = { name: 'Jen Williams', bg: 'b58a7a', fg: 'ffffff', initials: 'JW' },
  dueDate = 'Today',
  ticketId = 'TICKET-66',
  parentTaskLabel = 'SFDC License Request – Martin Ludington (m.ludington@acme.com)',
  summaryText = 'Martin Ludington from RevOps has requested a Salesforce Professional Edition license. He requires full reporting capabilities to prepare Q1 pipeline analysis for a board presentation.',
  linkChipLabel = 'SFDC License Request – Martin Ludington (m.ludington@acme.com)',
  approvalState = 'pending',
  onApprove,
  onReject,
  onUndo,
  onClose,
}) {
  const [comments, setComments] = useState(() => {
    const base = [{ id: 1, type: 'ai', text: 'created this task', time: 'Just now' }];
    if (approvalState === 'approved') return [...base, { id: 2, type: 'approval', actor: assignee.name, actorBg: assignee.bg, actorInitials: assignee.initials, time: 'Just now' }];
    if (approvalState === 'rejected') return [...base, { id: 2, type: 'rejection', actor: assignee.name, actorBg: assignee.bg, actorInitials: assignee.initials, time: 'Just now' }];
    return base;
  });
  const [commentInput, setCommentInput] = useState('');
  const prevStateRef = useRef(approvalState);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (approvalState === prevStateRef.current) return;
    if (approvalState === 'approved') {
      setComments(c => [...c, { id: Date.now(), type: 'approval', actor: assignee.name, actorBg: assignee.bg, actorInitials: assignee.initials, time: 'Just now' }]);
    } else if (approvalState === 'rejected') {
      setComments(c => [...c, { id: Date.now(), type: 'rejection', actor: assignee.name, actorBg: assignee.bg, actorInitials: assignee.initials, time: 'Just now' }]);
    } else {
      setComments(c => c.filter(cm => cm.type !== 'approval' && cm.type !== 'rejection'));
    }
    prevStateRef.current = approvalState;
  }, [approvalState, assignee.name, assignee.bg, assignee.initials]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]);

  function handleSendComment() {
    const text = commentInput.trim();
    if (!text) return;
    setComments(c => [...c, { id: Date.now(), type: 'user', text, time: 'Just now' }]);
    setCommentInput('');
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--surface)' }}>

      {/* ── Toolbar ── */}
      <Toolbar
        approvalState={approvalState}
        assignee={assignee}
        onApprove={onApprove}
        onReject={onReject}
        onUndo={onUndo}
        onClose={onClose}
      />

      {/* ── Info banner ── */}
      <InfoBanner />

      {/* ── Scrollable content ── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ padding: '20px 28px 28px', overscrollBehavior: 'none' }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1" style={{ marginBottom: 14 }}>
          <button
            type="button"
            className="border-0 bg-transparent cursor-pointer hover:underline truncate"
            style={{ fontSize: 12, color: 'var(--text-weak)', padding: 0, maxWidth: 380 }}
          >
            {parentTaskLabel}
          </button>
          <ChevronRightSmallIcon />
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: '30px', margin: '0 0 22px', letterSpacing: '-0.3px' }}>
          {title}
        </h2>

        {/* Fields */}
        <div style={{ marginBottom: 20 }}>
          <FieldRow label="Assignee">
            <div className="flex items-center gap-2">
              <img
                src={`https://placehold.co/24x24/${assignee.bg}/${assignee.fg}?text=${assignee.initials}`}
                style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0 }}
                alt={assignee.name}
              />
              <span style={{ fontSize: 13 }}>{assignee.name}</span>
            </div>
          </FieldRow>
          <FieldRow label="Due date">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-weak)' }}>
              <CalendarIcon />
              <span style={{ fontSize: 13 }}>{dueDate}</span>
            </div>
          </FieldRow>
          <FieldRow label="Fields">
            <div
              className="inline-flex items-stretch overflow-hidden"
              style={{ border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}
            >
              <div
                className="flex items-center gap-1.5"
                style={{ padding: '5px 12px', background: 'var(--background-medium)', borderRight: '1px solid var(--border)', color: 'var(--text-weak)', whiteSpace: 'nowrap' }}
              >
                <TicketFieldIcon />
                Ticket ID (IT)
              </div>
              <span style={{ padding: '5px 12px', color: 'var(--text)', whiteSpace: 'nowrap' }}>{ticketId}</span>
            </div>
          </FieldRow>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', margin: '0 0 8px' }}>
            Description
          </p>
          <p style={{ fontSize: 13, lineHeight: '22px', color: 'var(--text)', margin: '0 0 16px' }}>
            Action Item: <em>Please complete this approval subtask at your earliest convenience.</em>
          </p>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

        {/* Body */}
        <div style={{ fontSize: 13, lineHeight: '22px', color: 'var(--text)' }}>
          <p style={{ margin: '0 0 14px' }}>Hello!</p>
          <p style={{ margin: '0 0 14px' }}>
            Your approval has been requested, and it is required before further action can be taken.
            Please review the request in the{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'var(--selected-text)' }}>parent</span>
            {' '}task for more context, and feel free to comment with any questions you may have.
          </p>
          <p style={{ margin: '0 0 16px' }}>
            <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'var(--selected-text)' }}>Parent Task Request</span>
          </p>
          <p style={{ margin: '0 2px 4px', fontStyle: 'italic', fontWeight: 500 }}>Summary:</p>
          <p style={{ margin: '0 0 14px' }}>{summaryText}</p>
          <p style={{ margin: '0 2px 6px', fontStyle: 'italic', fontWeight: 500 }}>Link:</p>
          <div
            className="inline-flex items-center gap-1.5"
            style={{ padding: '5px 10px', background: 'var(--background-medium)', borderRadius: 6, fontSize: 12, color: 'var(--text)' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 18, height: 18, borderRadius: 4,
              background: 'var(--icon)', color: 'var(--surface)',
              fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>
              C
            </span>
            <span>{linkChipLabel}</span>
          </div>
        </div>

        <div style={{ height: 32 }} />
      </div>

      {/* ── Comments (fixed footer) ── */}
      <div className="shrink-0" style={{ borderTop: '1px solid var(--border)' }}>

        {/* Tab bar */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '0 20px', borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-end gap-4">
            <button
              type="button"
              className="border-0 bg-transparent cursor-pointer"
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', padding: '10px 0 9px', borderBottom: '2px solid var(--text)', marginBottom: -1 }}
            >
              Comments
            </button>
            <button
              type="button"
              className="border-0 bg-transparent cursor-pointer"
              style={{ fontSize: 13, color: 'var(--text-weak)', padding: '10px 0 9px', borderBottom: '2px solid transparent' }}
            >
              All activity
            </button>
          </div>
          <button
            type="button"
            className="border-0 bg-transparent cursor-pointer"
            style={{ fontSize: 12, color: 'var(--text-weak)' }}
          >
            ↕ Oldest
          </button>
        </div>

        {/* Activity entries */}
        <div
          style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 130, overflowY: 'auto' }}
        >
          {comments.map(c => {
            if (c.type === 'ai')       return <AiComment key={c.id} text={c.text} time={c.time} />;
            if (c.type === 'approval') return <ApprovalComment key={c.id} actor={c.actor} actorBg={c.actorBg} actorInitials={c.actorInitials} isRejection={false} time={c.time} />;
            if (c.type === 'rejection')return <ApprovalComment key={c.id} actor={c.actor} actorBg={c.actorBg} actorInitials={c.actorInitials} isRejection={true}  time={c.time} />;
            return <p key={c.id} style={{ fontSize: 13, color: 'var(--text)', margin: 0 }}>{c.text}</p>;
          })}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment input */}
        <div style={{ padding: '8px 20px 14px', borderTop: '1px solid var(--border)' }}>
          <div
            className="flex items-center gap-2.5"
            style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px 7px 12px' }}
          >
            <img
              src={`https://placehold.co/28x28/${assignee.bg}/${assignee.fg}?text=${assignee.initials}`}
              style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }}
              alt={assignee.name}
            />
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
              className="flex-1 border-0 bg-transparent outline-none"
              style={{ fontSize: 13, color: 'var(--text)' }}
            />
            <button
              type="button"
              aria-label="Add emoji"
              className="flex items-center justify-center cursor-pointer border-0 bg-transparent transition-colors"
              style={{ color: 'var(--text-disabled)', flexShrink: 0, padding: 2 }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-weak)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-disabled)'}
            >
              <SmileIcon />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
