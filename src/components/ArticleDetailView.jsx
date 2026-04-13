// ─── ArticleDetailView — Asana Notes–style document viewer ───────────────────

import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Avatar from './ui/Avatar';
import { KB_ARTICLES, KB_DRAFTS, KB_LEARNINGS, KB_PROJECTS, INTEGRATION_CONFIG, formatDate, formatRelativeTime } from '../data/knowledgeBase';
import Banner from './ui/Banner';
import { TICKETS } from '../data/tickets';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", "SF Pro Text", -apple-system, sans-serif';

// ─── Icons ─────────────────────────────────────────────────────────────────────

function DocIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
      <rect x="2" y="1" width="10" height="14" rx="2" fill="var(--background-strong)" stroke="var(--border-strong)" strokeWidth="1"/>
      <path d="M5 5h6M5 8h6M5 11h4" stroke="var(--text-disabled)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l1.6 3.3 3.6.5-2.6 2.6.6 3.6L8 10.3l-3.2 1.7.6-3.6L2.8 5.8l3.6-.5L8 2z"/>
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
      <circle cx="4" cy="8" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="12" cy="8" r="1.2"/>
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10 3L5 8l5 5"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="10" height="8" rx="1.5"/>
      <path d="M5 7V5a3 3 0 0 1 6 0v2"/>
    </svg>
  );
}

// ── Real Asana toolbar icons (paths from design files) ──────────────────────

function UndoIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="currentColor">
      <path d="M2.61603 12.5C2.33988 12.5 2.11603 12.7239 2.11603 13C2.11603 13.2761 2.33988 13.5 2.61603 13.5V13V12.5ZM0.5 4.5L0.146447 4.14645C0.0526785 4.24021 0 4.36739 0 4.5C0 4.63261 0.0526784 4.75978 0.146447 4.85355L0.5 4.5ZM4.85355 0.853553C5.04882 0.658291 5.04882 0.341709 4.85355 0.146447C4.65829 -0.0488155 4.34171 -0.0488155 4.14645 0.146447L4.5 0.5L4.85355 0.853553ZM4.14645 8.85355C4.34171 9.04881 4.65829 9.04881 4.85355 8.85355C5.04882 8.65829 5.04882 8.34171 4.85355 8.14645L4.5 8.5L4.14645 8.85355ZM2.61603 13V13.5H8.5V13V12.5H2.61603V13ZM8.5 4.5V4H0.5V4.5V5H8.5V4.5ZM8.5 13V13.5C9.59381 13.5 10.8325 13.1603 11.8089 12.3932C12.8014 11.6134 13.5 10.4074 13.5 8.75H13H12.5C12.5 10.0926 11.9486 11.0116 11.1911 11.6068C10.4175 12.2147 9.40619 12.5 8.5 12.5V13ZM13 8.75H13.5C13.5 7.09258 12.8014 5.88664 11.8089 5.10684C10.8325 4.33965 9.59381 4 8.5 4V4.5V5C9.40619 5 10.4175 5.28535 11.1911 5.89316C11.9486 6.48836 12.5 7.40743 12.5 8.75H13ZM0.5 4.5L0.853553 4.85355L4.85355 0.853553L4.5 0.5L4.14645 0.146447L0.146447 4.14645L0.5 4.5ZM0.5 4.5L0.146447 4.85355L4.14645 8.85355L4.5 8.5L4.85355 8.14645L0.853553 4.14645L0.5 4.5Z"/>
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="currentColor">
      <path d="M10.884 12.5C11.1601 12.5 11.384 12.7239 11.384 13C11.384 13.2761 11.1601 13.5 10.884 13.5V13V12.5ZM13 4.5L13.3536 4.14645C13.4473 4.24021 13.5 4.36739 13.5 4.5C13.5 4.63261 13.4473 4.75978 13.3536 4.85355L13 4.5ZM8.64645 0.853553C8.45118 0.658291 8.45118 0.341709 8.64645 0.146447C8.84171 -0.0488155 9.15829 -0.0488155 9.35355 0.146447L9 0.5L8.64645 0.853553ZM9.35355 8.85355C9.15829 9.04881 8.84171 9.04881 8.64645 8.85355C8.45118 8.65829 8.45118 8.34171 8.64645 8.14645L9 8.5L9.35355 8.85355ZM10.884 13V13.5H5V13V12.5H10.884V13ZM5 4.5V4H13V4.5V5H5V4.5ZM5 13V13.5C3.90619 13.5 2.66751 13.1603 1.69109 12.3932C0.698621 11.6134 0 10.4074 0 8.75H0.5H1C1 10.0926 1.55138 11.0116 2.30891 11.6068C3.08249 12.2147 4.09381 12.5 5 12.5V13ZM0.5 8.75H0C0 7.09258 0.698621 5.88664 1.69109 5.10684C2.66751 4.33965 3.90619 4 5 4V4.5V5C4.09381 5 3.08249 5.28535 2.30891 5.89316C1.55138 6.48836 1 7.40743 1 8.75H0.5ZM13 4.5L12.6464 4.85355L8.64645 0.853553L9 0.5L9.35355 0.146447L13.3536 4.14645L13 4.5ZM13 4.5L13.3536 4.85355L9.35355 8.85355L9 8.5L8.64645 8.14645L12.6464 4.14645L13 4.5Z"/>
    </svg>
  );
}
function BoldIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M10.3415 5.53C10.766 5.0341 10.9992 4.40277 10.999 3.75V3.25C10.999 1.458 9.54102 0 7.74902 0H1.74902C1.55011 0 1.35935 0.0790176 1.21869 0.21967C1.07804 0.360322 0.999023 0.551088 0.999023 0.75V11.25C0.999023 11.4489 1.07804 11.6397 1.21869 11.7803C1.35935 11.921 1.55011 12 1.74902 12H8.49902C10.429 12 11.999 10.43 11.999 8.5C11.9984 7.9048 11.8458 7.31962 11.5557 6.79988C11.2657 6.28014 10.8477 5.84305 10.3415 5.53ZM2.49902 1.5H7.74902C8.71402 1.5 9.49902 2.285 9.49902 3.25V3.75C9.49902 4.439 8.93802 5 8.24902 5H2.49902V1.5ZM8.49902 10.5H2.49902V6.5H8.49902C9.60202 6.5 10.499 7.397 10.499 8.5C10.499 9.603 9.60202 10.5 8.49902 10.5Z"/>
    </svg>
  );
}
function ItalicIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M3 11C2.86739 11 2.74021 11.0527 2.64645 11.1464C2.55268 11.2402 2.5 11.3674 2.5 11.5C2.5 11.6326 2.55268 11.7598 2.64645 11.8536C2.74021 11.9473 2.86739 12 3 12H7C7.13261 12 7.25979 11.9473 7.35355 11.8536C7.44732 11.7598 7.5 11.6326 7.5 11.5C7.5 11.3674 7.44732 11.2402 7.35355 11.1464C7.25979 11.0527 7.13261 11 7 11H5.5985L7.417 1H9C9.13261 1 9.25979 0.947322 9.35355 0.853553C9.44732 0.759785 9.5 0.632608 9.5 0.5C9.5 0.367392 9.44732 0.240215 9.35355 0.146447C9.25979 0.0526784 9.13261 0 9 0L5 0C4.86739 0 4.74021 0.0526784 4.64645 0.146447C4.55268 0.240215 4.5 0.367392 4.5 0.5C4.5 0.632608 4.55268 0.759785 4.64645 0.853553C4.74021 0.947322 4.86739 1 5 1H6.401L4.583 11H3Z"/>
    </svg>
  );
}
function UnderlineIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M2 0.5V4.5C2 6.705 3.7945 8.5 6 8.5C8.2055 8.5 10 6.705 10 4.5V0.5C10 0.367392 10.0527 0.240215 10.1464 0.146447C10.2402 0.0526784 10.3674 0 10.5 0C10.6326 0 10.7598 0.0526784 10.8536 0.146447C10.9473 0.240215 11 0.367392 11 0.5V4.5C11 7.257 8.757 9.5 6 9.5C3.243 9.5 1 7.257 1 4.5V0.5C1 0.367392 1.05268 0.240215 1.14645 0.146447C1.24021 0.0526784 1.36739 0 1.5 0C1.63261 0 1.75979 0.0526784 1.85355 0.146447C1.94732 0.240215 2 0.367392 2 0.5ZM0.5 11.5C0.5 11.6326 0.552678 11.7598 0.646447 11.8536C0.740215 11.9473 0.867392 12 1 12H11C11.1326 12 11.2598 11.9473 11.3536 11.8536C11.4473 11.7598 11.5 11.6326 11.5 11.5C11.5 11.3674 11.4473 11.2402 11.3536 11.1464C11.2598 11.0527 11.1326 11 11 11H1C0.867392 11 0.740215 11.0527 0.646447 11.1464C0.552678 11.2402 0.5 11.3674 0.5 11.5Z"/>
    </svg>
  );
}
function StrikeIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M8.07152 7H9.44802C9.80619 7.51336 9.99864 8.12405 9.99952 8.75C9.99952 10.861 7.93852 12 5.99952 12C4.10402 12 2.61802 10.9375 2.02552 9.158C1.9986 8.96314 2.00261 8.89704 2.04892 8.77297C2.07812 8.71354 2.11884 8.6605 2.16871 8.61693C2.21857 8.57336 2.2766 8.54013 2.33941 8.51917C2.40223 8.49821 2.46858 8.48994 2.53462 8.49483C2.60065 8.49973 2.66506 8.51769 2.7241 8.54767C2.78314 8.57766 2.83563 8.61907 2.87854 8.66951C2.92144 8.71995 2.9539 8.77841 2.97402 8.8415C3.43152 10.213 4.53402 10.9995 6.00002 10.9995C7.45402 10.9995 9.00002 10.211 9.00002 8.7495C9.00002 8.1245 8.67852 7.4815 8.07202 6.9995L8.07152 7ZM12 5.5005C12 5.36789 11.9473 5.24072 11.8536 5.14695C11.7598 5.05318 11.6326 5.0005 11.5 5.0005H4.66702C3.73152 4.6875 3.24952 4.1055 3.24952 3.2505C3.24952 1.957 4.29002 1.1155 5.99952 0.9995C7.18752 0.9995 8.11402 1.5955 8.67702 2.7235C8.70641 2.78227 8.74708 2.83467 8.79671 2.87772C8.84635 2.92077 8.90398 2.95362 8.96631 2.9744C9.02864 2.99517 9.09445 3.00347 9.15999 2.99881C9.22553 2.99415 9.28951 2.97663 9.34827 2.94725C9.40704 2.91787 9.45944 2.8772 9.50249 2.82756C9.54554 2.77793 9.57839 2.7203 9.59917 2.65797C9.61995 2.59563 9.62824 2.52982 9.62359 2.46428C9.61893 2.39875 9.60141 2.33477 9.57202 2.276C8.83752 0.809 7.57052 0 5.96852 0H5.96502C3.70752 0.1515 2.24852 1.427 2.24852 3.25C2.24852 3.943 2.46452 4.531 2.86852 5.0005H0.499023C0.366415 5.0005 0.239238 5.05318 0.14547 5.14695C0.0517019 5.24072 -0.000976562 5.36789 -0.000976562 5.5005C-0.000976562 5.63311 0.0517019 5.76029 0.14547 5.85405C0.239238 5.94782 0.366415 6.0005 0.499023 6.0005H11.499C11.5647 6.00057 11.6298 5.98768 11.6905 5.96258C11.7512 5.93749 11.8064 5.90067 11.8529 5.85423C11.8994 5.80779 11.9363 5.75265 11.9614 5.69196C11.9866 5.63126 12 5.5662 12 5.5005Z"/>
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M11.8244 5.51806C11.9377 5.65312 11.9998 5.82378 11.9998 6.00006C11.9998 6.17635 11.9377 6.347 11.8244 6.48206L8.82439 10.0571C8.69582 10.221 8.51 9.8387 8.49256 9.64057C8.47512 9.44244 8.54 9.2455 8.667 9.09306L10.2704 5.99956L7.67489 2.90606C7.54991 2.75331 7.49018 2.55744 7.50866 2.36094C7.52713 2.16444 7.62232 1.98314 7.77358 1.85635C7.92484 1.72956 8.11998 1.66751 8.31669 1.68365C8.5134 1.69979 8.69582 1.79282 8.82439 1.94256L11.8244 5.51756V5.51806ZM4.23189 1.85006C4.07934 1.72256 3.88246 1.66075 3.68442 1.67819C3.48637 1.69562 3.30332 1.79087 3.17539 1.94306L0.175391 5.51806C0.0620973 5.65312 0 5.82378 0 6.00006C0 6.17635 0.0620973 6.347 0.175391 6.48206L3.17539 10.0571C3.30396 10.221 3.49 9.8387 3.50744 9.64057C3.52488 9.44244 3.46 9.2455 3.33489 9.09306L1.72939 5.99956L4.32489 2.90606C4.38813 2.83062 4.4359 2.74346 4.46545 2.64956C4.495 2.55566 4.50577 2.45686 4.49713 2.3588C4.4885 2.26074 4.46063 2.16534 4.41512 2.07805C4.36961 1.99076 4.30735 1.91329 4.23189 1.85006Z"/>
    </svg>
  );
}
function BulletIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M-0.000964844 2.00259C-0.00397629 1.86942 0.019648 1.73699 0.0685209 1.61308C0.117394 1.48916 0.190531 1.37626 0.283637 1.281C0.376743 1.18574 0.487943 1.11004 0.610707 1.05835C0.733471 1.00666 0.865326 0.980014 0.998529 0.979981C1.26374 0.979947 1.51811 1.08531 1.70564 1.27284C1.89318 1.46038 1.99854 1.7148 1.99854 1.98002C1.99854 2.24523 1.89318 2.49966 1.70564 2.68719C1.51811 2.87473 1.26374 2.98009 0.998529 2.98009C0.733313 2.98009 0.478959 2.87473 0.291423 2.68719C0.103886 2.49966 -0.000964844 2.24523 -0.000964844 1.98002V2.00259ZM0.999035 7.00259C1.26425 7.00259 1.51861 6.89723 1.70614 6.70969C1.89368 6.52216 1.99904 6.2678 1.99904 6.00259C1.99904 5.73737 1.89368 5.48302 1.70614 5.29548C1.51861 5.10795 1.26425 5.00259 0.999035 5.00259C0.733819 5.00259 0.479465 5.10795 0.291928 5.29548C0.104392 5.48302 -0.000964844 5.73737 -0.000964844 6.00259C-0.000964844 6.2678 0.104392 6.52216 0.291928 6.70969C0.479465 6.89723 0.733819 7.00259 0.999035 7.00259ZM0.999035 11.0026C1.26425 11.0026 1.51861 10.8972 1.70614 10.7097C1.89368 10.5222 1.99904 10.2678 1.99904 10.0026C1.99904 9.73737 1.89368 9.48302 1.70614 9.29548C1.51861 9.10795 1.26425 9.00259 0.999035 9.00259C0.733819 9.00259 0.479465 9.10795 0.291928 9.29548C0.104392 9.48302 -0.000964844 9.73737 -0.000964844 10.0026C-0.000964844 10.2678 0.104392 10.5222 0.291928 10.7097C0.479465 10.8972 0.733819 11.0026 0.999035 11.0026ZM11.499 1.50259H3.99904C3.86643 1.50259 3.73925 1.55527 3.64548 1.64903C3.55171 1.7428 3.49904 1.86998 3.49904 2.00259C3.49904 2.1352 3.55171 2.26237 3.64548 2.35614C3.73925 2.44991 3.86643 2.50259 3.99904 2.50259H11.499C11.6316 2.50259 11.7588 2.44991 11.8526 2.35614C11.9464 2.26237 11.999 2.1352 11.999 2.00259C11.999 1.86998 11.9464 1.7428 11.8526 1.64903C11.7588 1.55527 11.6316 1.50259 11.499 1.50259ZM11.499 5.50259H3.99904C3.86643 5.50259 3.73925 5.55527 3.64548 5.64903C3.55171 5.7428 3.49904 5.86998 3.49904 6.00259C3.49904 6.1352 3.55171 6.26237 3.64548 6.35614C3.73925 6.44991 3.86643 6.50259 3.99904 6.50259H11.499C11.6316 6.50259 11.7588 6.44991 11.8526 6.35614C11.9464 6.26237 11.999 6.1352 11.999 6.00259C11.999 5.86998 11.9464 5.7428 11.8526 5.64903C11.7588 5.55527 11.6316 5.50259 11.499 5.50259ZM11.499 9.50259H3.99904C3.86643 9.50259 3.73925 9.55527 3.64548 9.64903C3.55171 9.7428 3.49904 9.86998 3.49904 10.0026C3.49904 10.1352 3.55171 10.2624 3.64548 10.3561C3.73925 10.4499 3.86643 10.5026 3.99904 10.5026H11.499C11.6316 10.5026 11.7588 10.4499 11.8526 10.3561C11.9464 10.2624 11.999 10.1352 11.999 10.0026C11.999 9.86998 11.9464 9.7428 11.8526 9.64903C11.7588 9.55527 11.6316 9.50259 11.499 9.50259Z"/>
    </svg>
  );
}
function NumberedIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M0.107907 1.443L1.65441 0.511L2.49941 0.5V5.5H1.57891V1.539L0.544407 2.162L0.107907 1.443ZM1.71991 9.238L1.05691 9.6325C0.164907 10.1525 -0.0100928 10.796 -9.28102e-05 11.2415V11.5H3.21741V10.7465H1.01241C1.12341 10.475 1.40641 10.304 1.55841 10.2125L2.34341 9.7565C2.86691 9.4455 3.17991 8.94 3.17991 8.4045C3.17991 7.7065 2.64591 6.9995 1.62591 6.9995C1.15041 6.9995 0.745407 7.1555 0.454407 7.451C0.187314 7.72364 0.0380855 8.09033 0.0389072 8.472L0.0399072 8.5345L0.869907 8.6465V8.5635C0.869907 8.428 0.878907 8.272 0.943407 8.1425C1.06941 7.902 1.31341 7.764 1.61441 7.764C2.08891 7.764 2.33691 8.092 2.33691 8.416C2.33691 8.7975 2.09041 9.02 1.71991 9.237V9.238ZM11.4999 1.5H4.99991C4.8673 1.5 4.74012 1.55268 4.64635 1.64645C4.55259 1.74021 4.49991 1.86739 4.49991 2C4.49991 2.13261 4.55259 2.25979 4.64635 2.35355C4.74012 2.44732 4.8673 2.5 4.99991 2.5H11.4999C11.6325 2.5 11.7597 2.44732 11.8535 2.35355C11.9472 2.25979 11.9999 2.13261 11.9999 2C11.9999 1.86739 11.9472 1.74021 11.8535 1.64645C11.7597 1.55268 11.6325 1.5 11.4999 1.5ZM11.4999 5.5H4.99991C4.8673 5.5 4.74012 5.55268 4.64635 5.64645C4.55259 5.74021 4.49991 5.86739 4.49991 6C4.49991 6.13261 4.55259 6.25979 4.64635 6.35355C4.74012 6.44732 4.8673 6.5 4.99991 6.5H11.4999C11.6325 6.5 11.7597 6.44732 11.8535 6.35355C11.9472 6.25979 11.9999 6.13261 11.9999 6C11.9999 5.86739 11.9472 5.74021 11.8535 5.64645C11.7597 5.55268 11.6325 5.5 11.4999 5.5ZM11.4999 9.5H4.99991C4.8673 9.5 4.74012 9.55268 4.64635 9.64645C4.55259 9.74021 4.49991 9.86739 4.49991 10C4.49991 10.1326 4.55259 10.2598 4.64635 10.3536C4.74012 10.4473 4.8673 10.5 4.99991 10.5H11.4999C11.6325 10.5 11.7597 10.4473 11.8535 10.3536C11.9472 10.2598 11.9999 10.1326 11.9999 10C11.9999 9.86739 11.9472 9.74021 11.8535 9.64645C11.7597 9.55268 11.6325 9.5 11.4999 9.5Z"/>
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M7.32654 4.67031C7.96962 5.31451 8.3308 6.18756 8.3308 7.09781C8.3308 8.00805 7.96962 8.88111 7.32654 9.52531L5.86004 10.9928C5.54143 11.3117 5.16297 11.5646 4.7464 11.7369C4.32983 11.9092 3.88333 11.9975 3.43254 11.9968C2.98171 11.9977 2.53515 11.9095 2.11855 11.7372C1.70194 11.5649 1.32352 11.3119 1.00504 10.9928C0.361003 10.3483 0 9.47537 0 8.56529C0 7.65520 0.361003 6.78228 1.00504 6.13831L1.89554 5.24731C1.98929 5.15355 2.11645 5.10088 2.24904 5.10088C2.38163 5.10088 2.50878 5.15355 2.60254 5.24731C2.69629 5.34106 2.74896 5.46822 2.74896 5.60081C2.74896 5.7334 2.69629 5.86055 2.60254 5.95431L1.71254 6.84481C1.4857 7.07013 1.30584 7.33822 1.18336 7.63355C1.06089 7.92889 0.999037 8.56531 0.999037 8.56531C0.999037 9.21531 1.25204 9.82681 1.71204 10.2863C2.18204 10.7453 2.79354 10.9978 3.43254 10.9978C4.07154 10.9978 4.68304 10.7453 5.15254 10.2858L6.61954 8.81881C6.88911 8.54855 7.0914 8.21873 7.21009 7.85594C7.32878 7.49315 7.36056 7.10754 7.30285 6.73021C7.24514 6.35288 7.09957 5.9944 6.87788 5.68366C6.65618 5.37293 6.36456 5.11864 6.02654 4.94131C5.81529 4.82058 5.76024 4.45334 5.81529 4.26606C5.84575 4.20785 5.88739 4.15621 5.93781 4.11409C5.98823 4.07197 6.04646 4.0402 6.10916 4.02058C6.2358 3.98097 6.37298 3.99328 6.49054 4.05481C6.79881 4.21638 7.0807 4.42393 7.32654 4.67031ZM6.13804 1.00331L4.67104 2.47081C4.29053 2.85197 4.00496 3.31724 3.83736 3.82908C3.66976 4.34092 3.62483 4.88499 3.70619 5.41738C3.78755 5.94978 3.99293 6.4556 4.30575 6.89402C4.61856 7.33244 5.03006 7.69118 5.50704 7.94131C5.62453 8.00284 5.76165 8.01517 5.88824 7.97561C6.01482 7.93603 6.12051 7.8478 6.18204 7.73031C6.24357 7.61282 6.2559 7.4757 6.21633 7.34911C6.17676 7.22252 6.08853 7.11684 5.97104 7.05531C5.63301 6.87797 5.3414 6.62369 5.1197 6.31295C4.898 6.00222 4.75243 5.64373 4.69472 5.2664C4.63702 4.88908 4.66879 4.50347 4.78749 4.14068C4.90618 3.77788 5.10847 3.44806 5.37804 3.17781L6.84504 1.71131C7.31454 1.25181 7.92604 0.999308 8.56554 0.999308C9.20504 0.999308 9.81604 1.25131 10.2855 1.71031C10.512 1.93561 10.692 2.20364 10.8143 2.49888C10.9367 2.79412 10.9993 3.11071 10.9985 3.43031C10.9994 3.74999 10.9368 4.06667 10.8144 4.36201C10.6921 4.65734 10.5123 4.92545 10.2855 5.15081L9.39504 6.04281C9.29004 6.14781 9.24844 6.39638 9.24844 6.39638C9.24841 6.46206 9.26132 6.52709 9.28644 6.58778C9.31155 6.64846 9.34836 6.7036 9.39479 6.75006C9.44121 6.79651 9.49633 6.83337 9.55699 6.85852C9.61766 6.88368 9.68269 6.89664 9.74836 6.89666C9.81403 6.89668 9.87907 6.88377 9.93975 6.85866C10.0004 6.83355 10.0556 6.79673 10.102 6.75031L10.9925 5.85931C11.3125 5.54137 11.5662 5.1631 11.7389 4.7464C11.9116 4.3297 11.9998 3.88287 11.9985 3.43181C11.9999 2.98066 11.9117 2.53373 11.739 2.11693C11.5663 1.70014 11.3126 1.32178 10.9925 1.00381C10.3483 0.361003 9.47537 0 8.56529 0C7.6552 0 6.78228 0.361003 6.13804 1.00381V1.00331Z"/>
    </svg>
  );
}
function AtIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
      <path d="M6 0C2.69175 0 0 2.69175 0 6C0 9.30825 2.69175 12 6 12C7.37775 12 8.72363 11.5215 9.78938 10.6519C9.84911 10.6061 9.89904 10.5487 9.93621 10.4833C9.97338 10.4178 9.99703 10.3455 10.0058 10.2708C10.0145 10.196 10.0081 10.1202 9.98704 10.048C9.96595 9.9757 9.93058 9.9084 9.883 9.85006C9.83543 9.79171 9.77663 9.74351 9.71009 9.70831C9.64354 9.67311 9.57061 9.65162 9.49561 9.64513C9.42061 9.63863 9.34507 9.64725 9.27347 9.67048C9.20186 9.69372 9.13565 9.73108 9.07875 9.78037C8.20852 10.4877 7.12146 10.8742 6 10.875C3.312 10.875 1.125 8.688 1.125 6C1.125 3.312 3.312 1.125 6 1.125C8.688 1.125 10.875 3.312 10.875 6V6.51975C10.8735 6.56737 10.815 7.6875 9.9375 7.6875C9.08663 7.6875 9.006 6.63638 9 6.54375V6C9 4.34588 7.65412 3 6 3C4.34588 3 3 4.34588 3 6C3 7.65412 4.34588 9 6 9C6.43889 8.99996 6.8724 8.90344 7.26983 8.71726C7.66727 8.53108 8.01892 8.2598 8.29988 7.92263C8.61375 8.41388 9.12825 8.8125 9.9375 8.8125C11.4923 8.8125 11.9663 7.34438 12 6.54375V6C12 2.69175 9.30825 0 6 0ZM6 7.875C4.96613 7.875 4.125 7.03387 4.125 6C4.125 4.96613 4.96613 4.125 6 4.125C7.03387 4.125 7.875 4.96613 7.875 6C7.875 7.03387 7.03387 7.875 6 7.875Z"/>
    </svg>
  );
}
function CommentsLargeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M10 1H6C2.6915 1 0 3.6915 0 7V8C0 9.5515 0.6195 11.05 1.712 12.171L2.005 15.0995C2.02276 15.279 2.08876 15.4504 2.19602 15.5954C2.30328 15.7405 2.4478 15.8538 2.61424 15.9233C2.78068 15.9929 2.96284 16.0161 3.14141 15.9905C3.31997 15.9649 3.48829 15.8915 3.6285 15.778L5.831 14H10.0005C13.309 14 16.0005 11.3085 16.0005 8V7C16.0005 3.6915 13.3085 1 10 1ZM5.4775 13L3 15L2.6705 11.7055C1.6525 10.79 1 9.4765 1 8V7C1 4.2385 3.2385 2 6 2H10C12.7615 2 15 4.2385 15 7V8C15 10.7615 12.7615 13 10 13H5.4775Z"/>
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 1.5H10.5V4.5M4.5 10.5H1.5V7.5M10.5 1.5L6.5 5.5M1.5 10.5L5.5 6.5"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2H2v10h10V9M8 2h4v4M12 2L6 8"/>
    </svg>
  );
}

// ─── Toolbar button ────────────────────────────────────────────────────────────

function TBtn({ children, label }) {
  return (
    <button
      type="button"
      title={label}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 28, height: 26, padding: '0 5px', borderRadius: 5,
        border: 'none', background: 'transparent', cursor: 'pointer',
        color: 'var(--text-weak)', transition: 'background 0.1s, color 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
    >
      {children}
    </button>
  );
}

function TDivider() {
  return <span style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0, margin: '0 4px' }} />;
}

// ─── Content block renderer ────────────────────────────────────────────────────

function ContentBlocks({ blocks }) {
  if (!blocks || blocks.length === 0) return null;

  // Group consecutive 'li' blocks together
  const elements = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type === 'li') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'li') {
        items.push(blocks[i].text);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '0 0 16px', paddingLeft: 24, listStyleType: 'disc' }}>
          {items.map((text, j) => (
            <li key={j} style={{ fontFamily: SFT, fontSize: 15, color: 'var(--text)', lineHeight: '26px' }}>
              {text}
            </li>
          ))}
        </ul>
      );
    } else {
      switch (block.type) {
        case 'h2':
          elements.push(
            <h2 key={i} style={{ fontFamily: SFD, fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: '28px 0 10px', lineHeight: '28px' }}>
              {block.text}
            </h2>
          );
          break;
        case 'p':
          elements.push(
            <p key={i} style={{ fontFamily: SFT, fontSize: 15, color: 'var(--text)', lineHeight: '26px', margin: '0 0 16px' }}>
              {block.text}
            </p>
          );
          break;
        case 'link':
          elements.push(
            <p key={i} style={{ margin: '0 0 16px' }}>
              <a
                href="#"
                onClick={e => e.preventDefault()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontFamily: SFT, fontSize: 14, color: 'var(--selected-text)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                <ExternalLinkIcon />
                {block.text}
              </a>
            </p>
          );
          break;
        case 'table':
          elements.push(
            <div key={i} style={{ margin: '0 0 20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: SFT, fontSize: 13 }}>
                {block.headers && (
                  <thead>
                    <tr>
                      {block.headers.map((h, ci) => (
                        <th key={ci} style={{
                          textAlign: 'left', padding: '8px 12px',
                          background: 'var(--background-medium)', color: 'var(--text-weak)',
                          fontWeight: 600, fontSize: 11,
                          borderBottom: '1px solid var(--border)',
                          borderRight: ci < block.headers.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {(block.rows ?? []).map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid var(--border)' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: '8px 12px', color: 'var(--text)', lineHeight: '20px',
                          borderRight: ci < row.length - 1 ? '1px solid var(--border)' : 'none',
                          verticalAlign: 'top',
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          break;
        case 'image':
          elements.push(
            <div key={i} style={{ margin: '0 0 20px' }}>
              <div style={{
                background: 'var(--background-medium)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '32px 24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                textAlign: 'center',
              }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
                <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)' }}>
                  {block.alt ?? 'Screenshot'}
                </span>
              </div>
              {block.caption && (
                <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)', margin: '6px 0 0', textAlign: 'center', lineHeight: '18px' }}>
                  {block.caption}
                </p>
              )}
            </div>
          );
          break;
        case 'callout':
          elements.push(
            <div key={i} style={{
              margin: '0 0 20px',
              padding: '12px 16px',
              borderRadius: 8,
              background: block.variant === 'warning' ? 'var(--warning-background)' : block.variant === 'danger' ? 'var(--danger-background)' : 'var(--selected-background)',
              borderLeft: `3px solid ${block.variant === 'warning' ? 'var(--warning-text)' : block.variant === 'danger' ? 'var(--danger-text)' : 'var(--selected-text)'}`,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                {block.variant === 'warning' ? '⚠️' : block.variant === 'danger' ? '🚫' : 'ℹ️'}
              </span>
              <p style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text)', margin: 0, lineHeight: '22px' }}>
                {block.text}
              </p>
            </div>
          );
          break;
        default:
          break;
      }
      i++;
    }
  }
  return <>{elements}</>;
}

// ─── Main component ────────────────────────────────────────────────────────────

function SparkleIcon({ size = 13 }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M6 0.5C6 0.5 6.4 3.1 7.5 4.5C8.6 5.9 11.5 6 11.5 6C11.5 6 8.6 6.1 7.5 7.5C6.4 8.9 6 11.5 6 11.5C6 11.5 5.6 8.9 4.5 7.5C3.4 6.1 0.5 6 0.5 6C0.5 6 3.4 5.9 4.5 4.5C5.6 3.1 6 0.5 6 0.5Z"/>
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="1" y="1" width="12" height="12" rx="2"/><path d="M4 7h6M4 4.5h6M4 9.5h4"/>
    </svg>
  );
}

export default function ArticleDetailView({ role }) {
  const { projectId, articleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const article = KB_ARTICLES.find(a => a.id === articleId && a.projectId === projectId);
  const draft = !article ? KB_DRAFTS.find(d => d.id === articleId && d.projectId === projectId) : null;
  const doc = article ?? (draft ? { ...draft, status: 'Draft', author: 'AI Generated', updatedAt: draft.generatedAt?.slice(0, 10) } : null);
  const project = KB_PROJECTS.find(p => p.id === projectId);

  // All pending AI suggestions for this article (from any gap card, not just ?gap= param)
  const allSuggestions = KB_LEARNINGS.filter(
    l => l.type === 'update-article' && l.linkedArticleId === articleId && l.suggestedBlocks
  );

  const [starred, setStarred] = useState(false);
  const [published, setPublished] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  // Per-suggestion state map: gapId → null (pending) | 'accepted' | 'dismissed'
  const [gapStates, setGapStates] = useState(() =>
    Object.fromEntries(allSuggestions.map(g => [g.id, null]))
  );
  const isAdmin = role === 'admin' || role === 'admin2';
  const hasContent = doc?.content?.length > 0;
  const isDraft = !!draft && !published;

  // Source / editability
  const isSynced = !draft && article && article.source && article.source !== 'internal';
  const isAddendum = article?.articleType === 'addendum';
  const canEdit = !isSynced; // editable if internal or a draft

  // Related addenda (for synced articles) and parent article (for addenda)
  const relatedAddenda = isSynced ? KB_ARTICLES.filter(a => a.parentArticleId === articleId) : [];
  const pendingAddendaDrafts = isSynced
    ? KB_DRAFTS.filter(d => d.targetArticleId === articleId)
    : [];
  const parentArticle = isAddendum && article.parentArticleId
    ? KB_ARTICLES.find(a => a.id === article.parentArticleId)
    : null;

  // Open learnings pointing to this synced article (for "create addendum" CTA)
  const openGapsForArticle = isSynced
    ? KB_LEARNINGS.filter(l => l.linkedArticleId === articleId && l.status !== 'dismissed')
    : [];

  const pendingSuggestions = allSuggestions.filter(g => gapStates[g.id] === null);
  const acceptedSuggestions = allSuggestions.filter(g => gapStates[g.id] === 'accepted');
  const hasPending = pendingSuggestions.length > 0;
  const hasAccepted = acceptedSuggestions.length > 0;
  const activeSuggestions = allSuggestions.filter(g => gapStates[g.id] !== 'dismissed');
  const showGutter = showSuggestions && activeSuggestions.length > 0;

  function acceptGap(id) { setGapStates(s => ({ ...s, [id]: 'accepted' })); }
  function dismissGap(id) { setGapStates(s => ({ ...s, [id]: 'dismissed' })); }

  // Fake collaborators using article author + a couple extras
  const collaborators = doc
    ? [doc.author, 'Sarah Lin', 'James Carter'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)
    : [];

  if (!doc) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
        <p style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text-weak)' }}>Article not found.</p>
        <button
          type="button"
          onClick={() => navigate(`/knowledge-base/${projectId}`)}
          style={{ fontFamily: SFT, fontSize: 13, color: 'var(--selected-text)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Back to knowledge base
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--background-weak)' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 48, borderBottom: '1px solid var(--border)',
        background: 'var(--background-weak)',
      }}>
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(`/knowledge-base/${projectId}`)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, height: 28,
            padding: '0 8px', borderRadius: 6, border: 'none', background: 'transparent',
            color: 'var(--text-weak)', cursor: 'pointer', fontFamily: SFT, fontSize: 12,
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
        >
          <ChevronLeftIcon />
          {project?.name ?? 'Knowledge base'}
        </button>

        <span style={{ color: 'var(--border-strong)', fontSize: 14 }}>/</span>

        {/* Doc icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          <DocIcon />
          <span style={{ fontFamily: SFT, fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doc.title}
          </span>
          {isDraft && (
            <span style={{ flexShrink: 0, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: SFT, background: 'var(--selected-background)', color: 'var(--selected-text)' }}>
              AI Draft
            </span>
          )}
          {published && (
            <span style={{ flexShrink: 0, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: SFT, background: 'var(--success-background)', color: 'var(--success-text)' }}>
              Published
            </span>
          )}
          {isAddendum && (
            <span style={{ flexShrink: 0, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: SFT, background: 'var(--background-medium)', color: 'var(--text-weak)' }}>
              Addendum
            </span>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Collaborator avatars */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {collaborators.map((name, i) => (
              <div key={name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: collaborators.length - i }}>
                <Avatar name={name} size={22} />
              </div>
            ))}
          </div>

          {isSynced ? null : isDraft ? (
            /* Draft mode — publish CTA */
            <button
              type="button"
              onClick={() => setPublished(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                height: 28, padding: '0 12px', borderRadius: 6,
                border: 'none', background: 'var(--selected-background-strong)',
                fontFamily: SFT, fontSize: 12, fontWeight: 500, color: '#fff',
                cursor: 'pointer', transition: 'opacity 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Publish article
            </button>
          ) : (showSuggestions && (hasPending || hasAccepted)) ? (
            /* Suggestion mode — save / publish changes */
            <>
              <button
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 10px',
                  borderRadius: 6, border: '1px solid var(--border)', background: 'transparent',
                  fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text)', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Save as draft
              </button>
              <button
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px',
                  borderRadius: 6, border: 'none', background: 'var(--selected-background-strong)',
                  fontFamily: SFT, fontSize: 12, fontWeight: 500, color: '#fff',
                  cursor: 'pointer', transition: 'opacity 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Publish changes
              </button>
            </>
          ) : (
            <>
              {/* Share */}
              <button
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  height: 28, padding: '0 10px', borderRadius: 6,
                  border: '1px solid var(--border)', background: 'transparent',
                  fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <LockIcon />
                Share
              </button>

              {/* Star */}
              <button
                type="button"
                onClick={() => setStarred(s => !s)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 6, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  color: starred ? '#f59e0b' : 'var(--text-disabled)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <StarIcon filled={starred} />
              </button>

              {/* More */}
              <button
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 6, border: 'none',
                  background: 'transparent', cursor: 'pointer', color: 'var(--text-disabled)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
              >
                <MoreIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Addendum breadcrumb moved into doc body — removed from header */}

      {/* ── Synced banner (replaces toolbar for synced articles) ───────── */}
      {isSynced && (() => {
        const srcType = article.source;
        const cfg = INTEGRATION_CONFIG[srcType] ?? {};
        const proj = KB_PROJECTS.find(p => p.id === projectId);
        const lastSynced = proj?.source?.syncedAt;
        const daysSince = lastSynced
          ? Math.floor((Date.now() - new Date(lastSynced).getTime()) / 86400000)
          : null;
        return (
          <div style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 24px', height: 40, borderBottom: '1px solid var(--border)',
            background: 'var(--background-weak)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="var(--text-disabled)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="8" height="6" rx="1"/>
                <path d="M5 7V5a2 2 0 0 1 4 0v2"/>
              </svg>
              <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)' }}>
                Read only · synced from
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '1px 7px', borderRadius: 4,
                background: cfg.bg, fontSize: 11, fontWeight: 500, color: cfg.color, fontFamily: SFT,
              }}>
                {cfg.label ?? srcType}
              </span>
              {proj?.source?.space && (
                <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>
                  · {proj.source.space}
                </span>
              )}
              {daysSince !== null && (
                <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>
                  · synced {daysSince === 0 ? 'today' : `${daysSince}d ago`}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 10px',
                borderRadius: 5, border: '1px solid var(--border)', background: 'transparent',
                fontFamily: SFT, fontSize: 11, color: 'var(--text-weak)', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 1v7M3 5l3 3 3-3M1 9v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9"/>
              </svg>
              Open in {cfg.label ?? srcType}
              <svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginLeft: 1 }}>
                <path d="M2 2h6v6M8 2L2 8"/>
              </svg>
            </button>
          </div>
        );
      })()}

      {/* Supplement banner moved into doc body — below title */}

      {/* ── Toolbar (admin only, editable articles) ─────────────────────── */}
      {isAdmin && canEdit && (
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2,
          padding: '0 24px', height: 40, borderBottom: '1px solid var(--border)',
          background: 'var(--background-weak)',
        }}>
          {/* Undo / Redo */}
          <TBtn label="Undo"><UndoIcon /></TBtn>
          <TBtn label="Redo"><RedoIcon /></TBtn>

          <TDivider />

          {/* + insert */}
          <TBtn label="Insert block">
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 1v12M1 7h12"/>
            </svg>
          </TBtn>

          <TDivider />

          {/* Paragraph style dropdown */}
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              height: 26, padding: '0 8px', borderRadius: 5,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
          >
            Paragraph
            <svg viewBox="0 0 10 6" width="9" height="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l4 4 4-4"/>
            </svg>
          </button>

          <TDivider />

          <TBtn label="Bold"><BoldIcon /></TBtn>
          <TBtn label="Italic"><ItalicIcon /></TBtn>
          <TBtn label="Underline"><UnderlineIcon /></TBtn>
          <TBtn label="Strikethrough"><StrikeIcon /></TBtn>
          <TBtn label="Code"><CodeIcon /></TBtn>

          <TDivider />

          <TBtn label="Bulleted list"><BulletIcon /></TBtn>
          <TBtn label="Numbered list"><NumberedIcon /></TBtn>
          <TBtn label="Link"><LinkIcon /></TBtn>
          <TBtn label="Mention"><AtIcon /></TBtn>
          <TBtn label="Full screen"><ExpandIcon /></TBtn>

          <TDivider />

          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 26, padding: '0 10px', borderRadius: 5,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text-weak)',
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
          >
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="12" height="8" rx="1.5"/>
              <path d="M4 6h6M4 8.5h4"/>
            </svg>
            Create task
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Narrow view */}
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              height: 26, padding: '0 8px', borderRadius: 5,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
          >
            Narrow view
            <svg viewBox="0 0 10 6" width="9" height="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l4 4 4-4"/>
            </svg>
          </button>

          <TDivider />

          {/* Comments */}
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 26, padding: '0 8px', borderRadius: 5,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
          >
            <CommentsLargeIcon />
            Comments
          </button>

          {/* AI suggestions toggle — only for articles with active suggestions */}
          {activeSuggestions.length > 0 && (
            <>
              <TDivider />
              <button
                type="button"
                onClick={() => setShowSuggestions(s => !s)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  height: 26, padding: '0 8px', borderRadius: 5,
                  border: 'none', background: showSuggestions ? 'var(--selected-background)' : 'transparent',
                  cursor: 'pointer', fontFamily: SFT, fontSize: 12,
                  color: showSuggestions ? 'var(--selected-text)' : 'var(--text-disabled)',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { if (!showSuggestions) { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}}
                onMouseLeave={e => { if (!showSuggestions) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}}
              >
                <SparkleIcon size={10} />
                {activeSuggestions.length} AI suggestion{activeSuggestions.length !== 1 ? 's' : ''}
              </button>
            </>
          )}

          {/* Saved status */}
          <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)', marginLeft: 4 }}>
            Saved
          </span>
        </div>
      )}

      {/* ── Content area ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 60px' }}>
        {/* Fixed-left container — no centering so text always starts at same x as toolbar */}
        <div style={{ maxWidth: showGutter ? 980 : 680, paddingTop: 48 }}>

          {/* Addendum provenance — inline in doc, above meta */}
          {isAddendum && parentArticle && (() => {
            const cfg = INTEGRATION_CONFIG[parentArticle.source];
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, maxWidth: 640 }}>
                <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="var(--text-disabled)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M9 3L4 6l5 3"/>
                </svg>
                <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)' }}>Addendum to</span>
                <button
                  type="button"
                  onClick={() => navigate(`/knowledge-base/${projectId}/${parentArticle.id}`)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--selected-text)', textDecoration: 'underline', textDecorationColor: 'var(--selected-text)' }}
                >
                  {parentArticle.title}
                </button>
                {cfg && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: cfg.bg, color: cfg.color, fontFamily: SFT }}>
                    <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><rect x="1" y="1" width="14" height="14" rx="2.5"/></svg>
                    {cfg.label}
                  </span>
                )}
              </div>
            );
          })()}

          {/* Article meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, maxWidth: 640 }}>
            <Avatar name={doc.author} size={20} />
            <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)' }}>{doc.author}</span>
            <span style={{ color: 'var(--border-strong)', fontSize: 12 }}>·</span>
            <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)' }}>
              Updated {formatDate(doc.updatedAt)}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: SFD, fontSize: 30, fontWeight: 700, color: 'var(--text)', margin: '0 0 24px', lineHeight: '38px', maxWidth: 640 }}>
            {doc.title}
          </h1>

          {/* Draft addendum banners — only shown when a draft addendum is pending */}
          {isSynced && pendingAddendaDrafts.length > 0 && (
            <div style={{ maxWidth: 640, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingAddendaDrafts.map(d => (
                <Banner
                  key={d.id}
                  variant="neutral"
                  message={`Draft addendum: ${d.title}`}
                  label="Review draft"
                  onLabel={() => navigate(`/knowledge-base/${projectId}/${d.id}`)}
                />
              ))}
            </div>
          )}

          {/* Draft provenance banner — shown only for AI-generated drafts */}
          {isDraft && draft?.sourceTickets?.length > 0 && (
            <div style={{
              maxWidth: 640, marginBottom: 32,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--background-medium)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <svg viewBox="0 0 12 12" width="12" height="12" fill="var(--text-weak)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                  <path d="M6 0.5C6 0.5 6.4 3.1 7.5 4.5C8.6 5.9 11.5 6 11.5 6C11.5 6 8.6 6.1 7.5 7.5C6.4 8.9 6 11.5 6 11.5C6 11.5 5.6 8.9 4.5 7.5C3.4 6.1 0.5 6 0.5 6C0.5 6 3.4 5.9 4.5 4.5C5.6 3.1 6 0.5 6 0.5Z"/>
                </svg>
                <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: '18px' }}>
                  <span style={{ fontWeight: 600 }}>AI draft · </span>
                  {draft.triggerReason}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingLeft: 20 }}>
                {draft.sourceTickets.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      height: 22, padding: '0 8px', borderRadius: 4,
                      background: 'var(--background-strong)', color: 'var(--text)',
                      border: 'none', cursor: 'pointer',
                      fontFamily: SFT, fontSize: 11, fontWeight: 600,
                      transition: 'opacity 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {t.id}
                  </button>
                ))}
                <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-weak)' }}>
                  {draft.sourceTickets.length} source ticket{draft.sourceTickets.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{ maxWidth: 640 }}>
            {hasContent ? (
              <ContentBlocks blocks={doc.content} />
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '60px 0', gap: 8,
              }}>
                <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
                  <rect x="8" y="4" width="28" height="40" rx="4" fill="var(--background-strong)" stroke="var(--border)" strokeWidth="1.5"/>
                  <path d="M14 14h16M14 20h16M14 26h10" stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text-disabled)', margin: 0 }}>
                  {isAdmin && canEdit ? 'Start writing to add content.' : 'No content yet.'}
                </p>
              </div>
            )}
          </div>

          {/* ── Published addenda section ───────────────────────────────── */}
          {isSynced && relatedAddenda.length > 0 && (
            <div style={{ maxWidth: 640, marginTop: 48 }}>
              <p style={{ fontFamily: SFT, fontSize: 12, fontWeight: 600, color: 'var(--text-weak)', margin: '0 0 10px', letterSpacing: 0 }}>
                Addenda
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {relatedAddenda.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => navigate(`/knowledge-base/${projectId}/${a.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 6, border: 'none',
                      background: 'transparent', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <DocIcon />
                    <span style={{ fontFamily: SFT, fontSize: 13, fontWeight: 500, color: 'var(--text)', flex: 1 }}>
                      {a.title}
                    </span>
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="var(--text-disabled)" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M6 3l5 5-5 5"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}



          {/* ── Per-suggestion blocks with anchored comment cards ─────── */}
          {canEdit && showSuggestions && allSuggestions.map(g => {
            const state = gapStates[g.id];
            if (state === 'dismissed') return null;

            if (state === 'accepted') {
              // Accepted — render as plain article content, no card
              return (
                <div key={g.id} style={{ maxWidth: 640, marginTop: 32 }}>
                  <ContentBlocks blocks={g.suggestedBlocks} />
                </div>
              );
            }

            // Pending — green highlight + floating comment card
            return (
              <div key={g.id} style={{ position: 'relative', marginTop: 40 }}>
                {/* Green highlighted block */}
                <div style={{
                  maxWidth: 620,
                  borderLeft: '3px solid #4AB86E',
                  background: 'rgba(74, 184, 110, 0.07)',
                  borderRadius: '0 8px 8px 0',
                  padding: '14px 18px',
                }}>
                  <ContentBlocks blocks={g.suggestedBlocks} />
                </div>

                {/* Floating comment card — Asana style, anchored top-right */}
                {(() => {
                  const srcTicket = TICKETS.find(t => t.id === g.sourceTickets[0]?.id);
                  const reviewer = srcTicket?.assignee ?? { name: 'IT Agent', initials: 'IA', bg: '4573D2', fg: 'ffffff' };
                  return (
                    <div style={{
                      position: 'absolute', top: -6, left: 642, width: 280, zIndex: 10,
                      background: 'var(--background-weak)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
                    }}>
                      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>

                        {/* Avatar + name + time row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                          <div style={{ flexShrink: 0, marginTop: 1 }}>
                            <Avatar name={reviewer.name} size={30} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                              <span style={{ fontFamily: SFT, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                                {reviewer.name}
                              </span>
                              <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}>
                                {formatRelativeTime(g.detectedAt)}
                              </span>
                            </div>
                            {/* AI attribution tag */}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3, padding: '1px 6px', borderRadius: 4, background: 'var(--selected-background)' }}>
                              <SparkleIcon size={9} />
                              <span style={{ fontFamily: SFT, fontSize: 10, fontWeight: 600, color: 'var(--selected-text)' }}>AI suggested</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => dismissGap(g.id)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-disabled)', borderRadius: 3, flexShrink: 0, marginTop: 2 }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text-weak)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
                          >
                            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l8 8M10 2L2 10"/></svg>
                          </button>
                        </div>

                        {/* Gap reason */}
                        <p style={{ fontFamily: SFT, fontSize: 13, color: 'var(--text)', lineHeight: '19px', margin: 0 }}>
                          {g.gap}
                        </p>

                        {/* Source tickets */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>From</span>
                          {g.sourceTickets.slice(0, 2).map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => navigate(`/tickets/${t.id}`)}
                              style={{
                                fontFamily: SFT, fontSize: 11, fontWeight: 600, color: 'var(--selected-text)',
                                background: 'var(--selected-background)', borderRadius: 4, padding: '1px 6px',
                                border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--selected-text)',
                              }}
                              title={t.title}
                            >
                              {t.id}
                            </button>
                          ))}
                          {g.sourceTickets.length > 2 && (
                            <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>+{g.sourceTickets.length - 2}</span>
                          )}
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: 'var(--border)', margin: '0 -14px' }} />

                        {/* Accept / Dismiss */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => acceptGap(g.id)}
                            style={{
                              height: 28, padding: '0 12px', borderRadius: 6,
                              border: '1px solid var(--border)', background: 'transparent',
                              fontFamily: SFT, fontSize: 12, fontWeight: 500, color: 'var(--text)',
                              cursor: 'pointer', transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => dismissGap(g.id)}
                            style={{
                              height: 28, padding: '0 4px',
                              border: 'none', background: 'transparent',
                              fontFamily: SFT, fontSize: 12, fontWeight: 400, color: 'var(--text-disabled)',
                              cursor: 'pointer', textDecoration: 'none',
                            }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                          >
                            Dismiss
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}
