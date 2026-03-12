// ─── AgentHomeView — Agent 3 merged overview: performance + focus ──────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateStr() {
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

// ── Per-period data ────────────────────────────────────────────────────────────

const PERIOD_DATA = {
  'This week': {
    kpis: [
      { label: 'Tickets resolved', value: '12',   suffix: 'vs team avg 11',   better: true  },
      { label: 'CSAT score',        value: '4.6',  suffix: 'vs team avg 4.2',  better: true  },
      { label: 'FCR rate',          value: '87%',  suffix: 'vs team avg 81%',  better: true  },
      { label: 'MTTA',              value: '1.8h', suffix: 'vs team avg 2.4h', better: true  },
      { label: 'Open tickets',      value: '6',    suffix: 'vs team avg 8',    better: true  },
    ],
    trend: [
      { label: 'Mon', resolved: 2,  teamResolved: 2,  csat: 4.8, teamCsat: 4.1, fcr: 90, teamFcr: 79, mtta: 1.6, teamMtta: 2.6 },
      { label: 'Tue', resolved: 3,  teamResolved: 2,  csat: 4.5, teamCsat: 4.2, fcr: 88, teamFcr: 80, mtta: 1.9, teamMtta: 2.5 },
      { label: 'Wed', resolved: 2,  teamResolved: 3,  csat: 4.6, teamCsat: 4.3, fcr: 85, teamFcr: 82, mtta: 1.8, teamMtta: 2.4 },
      { label: 'Thu', resolved: 3,  teamResolved: 2,  csat: 4.7, teamCsat: 4.2, fcr: 87, teamFcr: 81, mtta: 1.7, teamMtta: 2.3 },
      { label: 'Fri', resolved: 2,  teamResolved: 2,  csat: 4.6, teamCsat: 4.2, fcr: 86, teamFcr: 81, mtta: 1.8, teamMtta: 2.4 },
    ],
    insight: 'Your CSAT improved 15% vs last week — 3 five-star ratings so far.',
    slaTickets: [
      { id: 'IT-4851', title: 'All outbound email bouncing — mail server error',     sla: '28m', slaType: 'danger'  },
      { id: 'IT-4917', title: 'MacBook Pro overheating — kernel_task 100% CPU',      sla: '1h',  slaType: 'warning' },
      { id: 'IT-4783', title: 'User locked out after failed password reset attempt', sla: '45m', slaType: 'warning' },
    ],
    kbNudge: { count: 2, label: 'articles relevant to your open tickets', articles: ['VPN troubleshooting guide', 'M365 license activation'] },
    tickets: [
      { id: 'IT-4901', title: 'VPN access for new hire — unable to connect after setup',  resolved: '2h ago',    time: '45m',  csat: 5 },
      { id: 'IT-4888', title: 'Outlook calendar not syncing on mobile device',             resolved: '5h ago',    time: '1.2h', csat: 4 },
      { id: 'IT-4871', title: 'Printer offline — Finance dept floor 3',                    resolved: 'Yesterday', time: '30m',  csat: 5 },
      { id: 'IT-4853', title: 'Software license request — Adobe Creative Suite',           resolved: 'Yesterday', time: '2.1h', csat: 4 },
      { id: 'IT-4840', title: 'Laptop disk encryption failing on Windows 11 upgrade',      resolved: '2 days ago', time: '3.4h', csat: 3 },
    ],
  },
  'This month': {
    kpis: [
      { label: 'Tickets resolved', value: '48',   suffix: 'vs team avg 43',   better: true  },
      { label: 'CSAT score',        value: '4.5',  suffix: 'vs team avg 4.2',  better: true  },
      { label: 'FCR rate',          value: '85%',  suffix: 'vs team avg 80%',  better: true  },
      { label: 'MTTA',              value: '2.0h', suffix: 'vs team avg 2.6h', better: true  },
      { label: 'Open tickets',      value: '11',   suffix: 'vs team avg 13',   better: true  },
    ],
    trend: [
      { label: 'Wk 6', resolved: 14, teamResolved: 11, csat: 4.3, teamCsat: 4.1, fcr: 82, teamFcr: 78, mtta: 2.2, teamMtta: 2.8 },
      { label: 'Wk 7', resolved: 11, teamResolved: 12, csat: 4.5, teamCsat: 4.2, fcr: 85, teamFcr: 79, mtta: 1.9, teamMtta: 2.6 },
      { label: 'Wk 8', resolved: 16, teamResolved: 11, csat: 4.7, teamCsat: 4.3, fcr: 88, teamFcr: 80, mtta: 1.7, teamMtta: 2.5 },
      { label: 'Wk 9', resolved: 12, teamResolved: 11, csat: 4.6, teamCsat: 4.2, fcr: 87, teamFcr: 81, mtta: 1.8, teamMtta: 2.4 },
    ],
    insight: 'You\'re ranked #1 in CSAT on the team this month — above average on all metrics.',
    slaTickets: [
      { id: 'IT-4851', title: 'All outbound email bouncing — mail server error',     sla: '28m', slaType: 'danger'  },
      { id: 'IT-4917', title: 'MacBook Pro overheating — kernel_task 100% CPU',      sla: '1h',  slaType: 'warning' },
    ],
    kbNudge: { count: 3, label: 'articles that could help with recurring ticket types', articles: ['VPN troubleshooting guide', 'M365 license activation', 'Disk encryption reset'] },
    tickets: [
      { id: 'IT-4901', title: 'VPN access for new hire — unable to connect after setup',  resolved: '2h ago',     time: '45m',  csat: 5 },
      { id: 'IT-4888', title: 'Outlook calendar not syncing on mobile device',             resolved: '5h ago',     time: '1.2h', csat: 4 },
      { id: 'IT-4871', title: 'Printer offline — Finance dept floor 3',                    resolved: 'Yesterday',  time: '30m',  csat: 5 },
      { id: 'IT-4853', title: 'Software license request — Adobe Creative Suite',           resolved: 'Yesterday',  time: '2.1h', csat: 4 },
      { id: 'IT-4840', title: 'Laptop disk encryption failing on Windows 11 upgrade',      resolved: '2 days ago', time: '3.4h', csat: 3 },
    ],
  },
  'Last month': {
    kpis: [
      { label: 'Tickets resolved', value: '41',   suffix: 'vs team avg 43',   better: false },
      { label: 'CSAT score',        value: '4.1',  suffix: 'vs team avg 4.2',  better: false },
      { label: 'FCR rate',          value: '79%',  suffix: 'vs team avg 80%',  better: false },
      { label: 'MTTA',              value: '2.8h', suffix: 'vs team avg 2.6h', better: false },
      { label: 'Open tickets',      value: '14',   suffix: 'vs team avg 12',   better: false },
    ],
    trend: [
      { label: 'Wk 2', resolved: 10, teamResolved: 12, csat: 4.0, teamCsat: 4.2, fcr: 76, teamFcr: 79, mtta: 3.1, teamMtta: 2.7 },
      { label: 'Wk 3', resolved:  9, teamResolved: 11, csat: 4.1, teamCsat: 4.1, fcr: 78, teamFcr: 80, mtta: 2.9, teamMtta: 2.6 },
      { label: 'Wk 4', resolved: 11, teamResolved: 10, csat: 4.2, teamCsat: 4.2, fcr: 80, teamFcr: 80, mtta: 2.7, teamMtta: 2.6 },
      { label: 'Wk 5', resolved: 11, teamResolved: 11, csat: 4.2, teamCsat: 4.3, fcr: 81, teamFcr: 81, mtta: 2.6, teamMtta: 2.5 },
    ],
    insight: 'CSAT and FCR were just below team avg. Reviewing your 3-star tickets may help identify patterns.',
    slaTickets: [],
    kbNudge: { count: 2, label: 'articles on topics where your FCR was lower', articles: ['Password reset and lockout guide', 'Laptop hardware diagnostics'] },
    tickets: [
      { id: 'IT-4700', title: 'Audio not working on video calls — headset issue',         resolved: 'Feb 28', time: '40m',  csat: 4 },
      { id: 'IT-4685', title: 'Shared mailbox permissions missing for Marketing team',    resolved: 'Feb 27', time: '1.1h', csat: 4 },
      { id: 'IT-4671', title: 'Zoom not launching on Windows — corrupted install',        resolved: 'Feb 26', time: '35m',  csat: 5 },
      { id: 'IT-4658', title: 'Password reset loop — user cannot log in to VDI',         resolved: 'Feb 25', time: '2.0h', csat: 3 },
      { id: 'IT-4641', title: 'Printer driver update required — HP LaserJet',            resolved: 'Feb 24', time: '25m',  csat: 4 },
    ],
  },
};

const PERIODS = ['This week', 'This month', 'Last month'];

const SLA_CLR = { danger: 'var(--danger-text)', warning: 'var(--warning-text)' };

// My Tickets data keyed by period
const MY_TICKETS_DATA = {
  'This week': {
    sla: [
      { id: 'IT-4851', title: 'All outbound email bouncing — mail server error',     sla: '28m', slaType: 'danger'  },
      { id: 'IT-4917', title: 'MacBook Pro overheating — kernel_task 100% CPU',      sla: '1h',  slaType: 'warning' },
      { id: 'IT-4783', title: 'User locked out after failed password reset attempt', sla: '45m', slaType: 'warning' },
    ],
    critical: [
      { id: 'IT-4851', title: 'All outbound email bouncing — mail server error',     priority: 'Critical', age: '2h' },
      { id: 'IT-4844', title: 'VPN tunnel down for entire engineering org',           priority: 'Critical', age: '3h' },
    ],
    all: [
      { id: 'IT-4851', title: 'All outbound email bouncing',              status: 'Open',        priority: 'Critical' },
      { id: 'IT-4917', title: 'MacBook Pro overheating',                   status: 'In progress', priority: 'High'     },
      { id: 'IT-4783', title: 'User locked out after password reset',      status: 'In progress', priority: 'High'     },
      { id: 'IT-4844', title: 'VPN tunnel down for engineering org',       status: 'Open',        priority: 'Critical' },
      { id: 'IT-4922', title: 'Slow Wi-Fi on floor 4 — multiple reports',  status: 'In progress', priority: 'Medium'   },
      { id: 'IT-4908', title: 'Outlook crashes on startup — 3 affected',   status: 'Open',        priority: 'Medium'   },
    ],
  },
  'This month': {
    sla: [
      { id: 'IT-4851', title: 'All outbound email bouncing — mail server error',     sla: '28m', slaType: 'danger'  },
      { id: 'IT-4917', title: 'MacBook Pro overheating — kernel_task 100% CPU',      sla: '1h',  slaType: 'warning' },
    ],
    critical: [
      { id: 'IT-4851', title: 'All outbound email bouncing — mail server error',     priority: 'Critical', age: '2h'  },
    ],
    all: [
      { id: 'IT-4851', title: 'All outbound email bouncing',              status: 'Open',        priority: 'Critical' },
      { id: 'IT-4917', title: 'MacBook Pro overheating',                   status: 'In progress', priority: 'High'     },
      { id: 'IT-4922', title: 'Slow Wi-Fi on floor 4 — multiple reports',  status: 'In progress', priority: 'Medium'   },
    ],
  },
  'Last month': {
    sla: [],
    critical: [],
    all: [
      { id: 'IT-4700', title: 'Audio not working on video calls',           status: 'Resolved', priority: 'Medium' },
      { id: 'IT-4685', title: 'Shared mailbox permissions missing',          status: 'Resolved', priority: 'High'   },
    ],
  },
};

const PRIORITY_CLR = { Critical: '#dc2626', High: '#ea580c', Medium: '#ca8a04' };

// ── KPI card (dashboard shadow style) ─────────────────────────────────────────

function KpiCard({ label, value, suffix, better }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--background-weak)',
        borderRadius: 10, padding: '18px 20px',
        boxShadow: hov
          ? '0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)'
          : '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.15s',
      }}
    >
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 8px', lineHeight: '16px' }}>{label}</p>
      <p style={{ fontFamily: SFD, fontSize: 48, fontWeight: 400, color: 'var(--neutrals-lm-text, var(--Default-text, #1E1F21))', lineHeight: '56px', letterSpacing: '0.35px', margin: '0 0 6px', fontFeatureSettings: "'liga' off, 'clig' off" }}>{value}</p>
      <p style={{ fontSize: 12, color: better ? '#16a34a' : 'var(--danger-text)', fontFamily: SFT, margin: 0, lineHeight: '18px' }}>
        {better ? '↑' : '↓'} {suffix}
      </p>
    </div>
  );
}

// ── AI summary card ────────────────────────────────────────────────────────────

function AiSparkIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="aiGradOv" x1="0" y1="0" x2="12" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF594B" /><stop offset="1" stopColor="#4786FF" />
        </linearGradient>
      </defs>
      <path d="M8.8125 0H8.1875C8.1875 0.580161 7.95703 1.13656 7.5468 1.5468C7.13656 1.95703 6.58016 2.1875 6 2.1875V2.8125C6.58016 2.8125 7.13656 3.04297 7.5468 3.4532C7.95703 3.86344 8.1875 4.41984 8.1875 5H8.8125C8.8125 4.41984 9.04297 3.86344 9.4532 3.4532C9.86344 3.04297 10.4198 2.8125 11 2.8125V2.1875C10.4198 2.1875 9.86344 1.95703 9.4532 1.5468C9.04297 1.13656 8.8125 0.580161 8.8125 0ZM6.5 5.125C4.8335 5.125 3.875 4.1665 3.875 2.5H3.125C3.125 4.1665 2.1665 5.125 0.5 5.125V5.875C2.1665 5.875 3.125 6.8335 3.125 8.5H3.875C3.875 6.8335 4.8335 5.875 6.5 5.875V5.125ZM7.8125 7H7.1875C7.1875 7.58016 6.95703 8.13656 6.5468 8.5468C6.13656 8.95703 5.58016 9.1875 5 9.1875V9.8125C5.58016 9.8125 6.13656 10.043 6.5468 10.4532C6.95703 10.8634 7.1875 11.4198 7.1875 12H7.8125C7.8125 11.4198 8.04297 10.8634 8.4532 10.4532C8.86344 10.043 9.41984 9.8125 10 9.8125V9.1875C9.41984 9.1875 8.86344 8.95703 8.4532 8.5468C8.04297 8.13656 7.8125 7.58016 7.8125 7Z" fill="url(#aiGradOv)" />
    </svg>
  );
}

function AiSummaryCard({ insight }) {
  return (
    <div style={{ background: 'var(--background-medium)', borderRadius: 10, padding: '14px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <AiSparkIcon />
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>AI summary</span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>· just now</span>
      </div>
      <p style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text)', margin: 0, fontFamily: SFT }}>{insight}</p>
    </div>
  );
}

// ── Filler card ────────────────────────────────────────────────────────────────

function ResolvedTicketsCard({ tickets }) {
  const SHOW = 5;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? tickets : tickets.slice(0, SHOW);

  return (
    <div style={{
      background: 'var(--background-weak)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>Recently resolved</span>
        <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-weak)', display: 'flex', alignItems: 'center' }}>
          <svg viewBox="0 0 16 4" width="16" height="4" fill="currentColor">
            <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Divider under title */}
      <div style={{ height: 12 }} />
      <div style={{ borderBottom: '1px solid var(--border)' }} />

      {/* Rows */}
      {visible.map((t, i) => (
        <ResolvedTicketRow key={t.id + i} ticket={t} />
      ))}

      {/* Show more */}
      {tickets.length > SHOW && (
        <button
          type="button"
          onClick={() => setShowAll(v => !v)}
          style={{
            display: 'block', width: '100%', padding: '12px 20px', border: 'none',
            background: 'none', cursor: 'pointer', textAlign: 'left',
            fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT,
            borderTop: '1px solid var(--border)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

function ResolvedTicketRow({ ticket }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', minHeight: 48, padding: '0 20px',
        background: hov ? 'var(--background-medium)' : 'transparent',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 0.1s', gap: 12,
      }}
    >
      {/* Filled check circle */}
      <svg viewBox="0 0 18 18" width="18" height="18" fill="none" style={{ flexShrink: 0, color: '#16a34a' }}>
        <circle cx="9" cy="9" r="8.5" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
        <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* Title */}
      <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: SFT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</span>
      {/* CSAT stars */}
      <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} viewBox="0 0 12 12" width="11" height="11" fill={i <= ticket.csat ? '#F59E0B' : '#E5E7EB'}>
            <path d="M6 1l1.3 2.6L10 4.1 8 6.1l.5 2.9L6 7.6 3.5 9 4 6.1 2 4.1l2.7-.5L6 1z"/>
          </svg>
        ))}
      </div>
      {/* Time */}
      <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT, flexShrink: 0, width: 32, textAlign: 'right' }}>{ticket.time}</span>
    </div>
  );
}

// ── My Tickets card ───────────────────────────────────────────────────────────

const MY_TICKET_TABS = ['SLA at risk', 'Critical', 'All'];

// Pill configs: { bg, dot, text }
const SLA_PILL = {
  danger:  { bg: '#fef2f2', dot: '#dc2626', text: '#dc2626' },
  warning: { bg: '#fffbeb', dot: '#d97706', text: '#d97706' },
};
const PRIORITY_PILL = {
  Critical: { bg: '#fef2f2', dot: '#dc2626', text: '#dc2626' },
  High:     { bg: '#fff7ed', dot: '#ea580c', text: '#ea580c' },
  Medium:   { bg: '#fefce8', dot: '#ca8a04', text: '#ca8a04' },
  Low:      { bg: '#f0fdf4', dot: '#16a34a', text: '#16a34a' },
};

function TagPill({ bg, dot, text, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20,
      background: bg, flexShrink: 0,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: text, fontFamily: SFT, whiteSpace: 'nowrap' }}>{label}</span>
    </span>
  );
}

function MyTicketRow({ ticket, tab }) {
  const [hov, setHov] = useState(false);

  let pill = null;
  if (tab === 'SLA at risk') {
    const p = SLA_PILL[ticket.slaType];
    pill = <TagPill {...p} label={ticket.sla + ' left'} />;
  } else if (tab === 'Critical') {
    const p = PRIORITY_PILL['Critical'];
    pill = <TagPill {...p} label="Critical" />;
  } else {
    const p = PRIORITY_PILL[ticket.priority] || PRIORITY_PILL['Low'];
    pill = <TagPill {...p} label={ticket.priority} />;
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', minHeight: 48, padding: '0 20px',
        background: hov ? 'var(--background-medium)' : 'transparent',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background 0.1s', gap: 12,
      }}
    >
      {/* Circle check icon */}
      <svg viewBox="0 0 18 18" width="18" height="18" fill="none" style={{ flexShrink: 0, color: 'var(--text-disabled)' }}>
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* Title */}
      <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: SFT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</span>
      {/* Pill */}
      {pill}
    </div>
  );
}

function MyTicketsCard({ myTickets }) {
  const [activeTab, setActiveTab] = useState('SLA at risk');
  const tabKey = activeTab === 'SLA at risk' ? 'sla' : activeTab === 'Critical' ? 'critical' : 'all';
  const rows = myTickets[tabKey];
  const SHOW = 5;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? rows : rows.slice(0, SHOW);

  return (
    <div style={{
      background: 'var(--background-weak)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>My tickets</span>
        {/* ··· */}
        <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-weak)', display: 'flex', alignItems: 'center' }}>
          <svg viewBox="0 0 16 4" width="16" height="4" fill="currentColor">
            <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Tab row with underline */}
      <div style={{ display: 'flex', padding: '8px 20px 0', borderBottom: '1px solid var(--border)', gap: 4 }}>
        {MY_TICKET_TABS.map(tab => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setShowAll(false); }}
              style={{
                padding: '6px 4px', border: 'none', background: 'none',
                cursor: 'pointer', fontFamily: SFT, fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--text)' : 'var(--text-weak)',
                borderBottom: active ? '2px solid var(--text)' : '2px solid transparent',
                marginBottom: -1,
                marginRight: 16,
                transition: 'color 0.12s',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Rows */}
      {visible.length === 0 ? (
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>No tickets in this category</p>
        </div>
      ) : (
        visible.map((t, i) => (
          <MyTicketRow key={t.id + i} ticket={t} tab={activeTab} />
        ))
      )}

      {/* Show more footer */}
      {rows.length > SHOW && (
        <button
          type="button"
          onClick={() => setShowAll(v => !v)}
          style={{
            display: 'block', width: '100%', padding: '12px 20px', border: 'none',
            background: 'none', cursor: 'pointer', textAlign: 'left',
            fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT,
            borderTop: '1px solid var(--border)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────────

export default function AgentHomeView() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('This week');
  const { kpis, insight, tickets } = PERIOD_DATA[period];
  const myTickets = MY_TICKETS_DATA[period];

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '32px 32px 64px', boxSizing: 'border-box' }}>

      {/* ── Header: greeting + period picker (full-width) ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 4px' }}>{getDateStr()}</p>
          <h1 style={{ fontFamily: SFD, fontSize: 32, fontWeight: 400, color: '#1E1F21', margin: 0, letterSpacing: '-0.3px', lineHeight: '38px' }}>
            {getGreeting()}, Sarah
          </h1>
        </div>
        <div style={{ display: 'flex', background: 'var(--background-medium)', borderRadius: 8, padding: 3, gap: 2, flexShrink: 0 }}>
          {PERIODS.map(p => (
            <button key={p} type="button" onClick={() => setPeriod(p)} style={{
              padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: period === p ? 500 : 400, fontFamily: SFT,
              background: period === p ? 'white' : 'transparent',
              color: period === p ? 'var(--text)' : 'var(--text-weak)',
              boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.12s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* ── KPI cards (full-width) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginBottom: 24 }}>
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* ── AI summary (full-width) ── */}
      <div style={{ marginBottom: 24 }}>
        <AiSummaryCard insight={insight} />
      </div>

      {/* ── 2-column: My Tickets + Filler ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <MyTicketsCard myTickets={myTickets} />
        <ResolvedTicketsCard tickets={tickets} />
      </div>


    </div>
  );
}
