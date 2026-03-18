// ─── AgentPerformanceView — Individual agent performance dashboard ─────────────

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const TICK = { fontSize: 11, fill: 'var(--text-disabled)', fontFamily: SFT };

// ── Mock data per period ───────────────────────────────────────────────────────

const PERIOD_DATA = {
  'This week': {
    kpis: [
      { label: 'Tickets resolved', value: '12',   suffix: 'vs team avg 11',   better: true  },
      { label: 'CSAT score',        value: '4.6',  suffix: 'vs team avg 4.2',  better: true  },
      { label: 'FCR rate',          value: '87%',  suffix: 'vs team avg 81%',  better: true  },
      { label: 'MTTA',              value: '1.8h', suffix: 'vs team avg 2.4h', better: true  },
    ],
    trend: [
      { label: 'Mon', resolved: 2,  teamResolved: 2,  csat: 4.8, teamCsat: 4.1, fcr: 90, teamFcr: 79, mtta: 1.6, teamMtta: 2.6 },
      { label: 'Tue', resolved: 3,  teamResolved: 2,  csat: 4.5, teamCsat: 4.2, fcr: 88, teamFcr: 80, mtta: 1.9, teamMtta: 2.5 },
      { label: 'Wed', resolved: 2,  teamResolved: 3,  csat: 4.6, teamCsat: 4.3, fcr: 85, teamFcr: 82, mtta: 1.8, teamMtta: 2.4 },
      { label: 'Thu', resolved: 3,  teamResolved: 2,  csat: 4.7, teamCsat: 4.2, fcr: 87, teamFcr: 81, mtta: 1.7, teamMtta: 2.3 },
      { label: 'Fri', resolved: 2,  teamResolved: 2,  csat: 4.6, teamCsat: 4.2, fcr: 86, teamFcr: 81, mtta: 1.8, teamMtta: 2.4 },
    ],
    tickets: [
      { id: 'IT-4901', title: 'VPN access for new hire — unable to connect after setup',  resolved: '2h ago',    time: '45m',  csat: 5 },
      { id: 'IT-4888', title: 'Outlook calendar not syncing on mobile device',             resolved: '5h ago',    time: '1.2h', csat: 4 },
      { id: 'IT-4871', title: 'Printer offline — Finance dept floor 3',                    resolved: 'Yesterday', time: '30m',  csat: 5 },
      { id: 'IT-4853', title: 'Software license request — Adobe Creative Suite',           resolved: 'Yesterday', time: '2.1h', csat: 4 },
      { id: 'IT-4840', title: 'Laptop disk encryption failing on Windows 11 upgrade',      resolved: '2 days ago', time: '3.4h', csat: 3 },
      { id: 'IT-4821', title: 'New hire onboarding — access to 5 systems needed',          resolved: '2 days ago', time: '1.5h', csat: 5 },
      { id: 'IT-4809', title: 'Slack notifications not working on macOS 14',               resolved: '3 days ago', time: '20m',  csat: 5 },
    ],
  },
  'This month': {
    kpis: [
      { label: 'Tickets resolved', value: '48',   suffix: 'vs team avg 43',   better: true  },
      { label: 'CSAT score',        value: '4.5',  suffix: 'vs team avg 4.2',  better: true  },
      { label: 'FCR rate',          value: '85%',  suffix: 'vs team avg 80%',  better: true  },
      { label: 'MTTA',              value: '2.0h', suffix: 'vs team avg 2.6h', better: true  },
    ],
    trend: [
      { label: 'Wk 6', resolved: 14, teamResolved: 11, csat: 4.3, teamCsat: 4.1, fcr: 82, teamFcr: 78, mtta: 2.2, teamMtta: 2.8 },
      { label: 'Wk 7', resolved: 11, teamResolved: 12, csat: 4.5, teamCsat: 4.2, fcr: 85, teamFcr: 79, mtta: 1.9, teamMtta: 2.6 },
      { label: 'Wk 8', resolved: 16, teamResolved: 11, csat: 4.7, teamCsat: 4.3, fcr: 88, teamFcr: 80, mtta: 1.7, teamMtta: 2.5 },
      { label: 'Wk 9', resolved: 12, teamResolved: 11, csat: 4.6, teamCsat: 4.2, fcr: 87, teamFcr: 81, mtta: 1.8, teamMtta: 2.4 },
    ],
    tickets: [
      { id: 'IT-4901', title: 'VPN access for new hire — unable to connect after setup',    resolved: '2h ago',     time: '45m',  csat: 5 },
      { id: 'IT-4888', title: 'Outlook calendar not syncing on mobile device',               resolved: '5h ago',     time: '1.2h', csat: 4 },
      { id: 'IT-4871', title: 'Printer offline — Finance dept floor 3',                      resolved: 'Yesterday',  time: '30m',  csat: 5 },
      { id: 'IT-4853', title: 'Software license request — Adobe Creative Suite',             resolved: 'Yesterday',  time: '2.1h', csat: 4 },
      { id: 'IT-4840', title: 'Laptop disk encryption failing on Windows 11 upgrade',        resolved: '2 days ago', time: '3.4h', csat: 3 },
      { id: 'IT-4821', title: 'New hire onboarding — access to 5 systems needed',            resolved: '2 days ago', time: '1.5h', csat: 5 },
      { id: 'IT-4809', title: 'Slack notifications not working on macOS 14',                 resolved: '3 days ago', time: '20m',  csat: 5 },
      { id: 'IT-4792', title: 'Security certificate expired — internal dashboard',           resolved: '4 days ago', time: '55m',  csat: 4 },
      { id: 'IT-4778', title: 'M365 license not activating after account migration',         resolved: '5 days ago', time: '1.8h', csat: 5 },
      { id: 'IT-4761', title: 'Remote desktop dropping connection every 10 minutes',         resolved: '1 wk ago',   time: '2.2h', csat: 4 },
      { id: 'IT-4744', title: 'Two-factor authentication reset request',                     resolved: '1 wk ago',   time: '15m',  csat: 5 },
    ],
  },
  'Last month': {
    kpis: [
      { label: 'Tickets resolved', value: '41',   suffix: 'vs team avg 43',   better: false },
      { label: 'CSAT score',        value: '4.1',  suffix: 'vs team avg 4.2',  better: false },
      { label: 'FCR rate',          value: '79%',  suffix: 'vs team avg 80%',  better: false },
      { label: 'MTTA',              value: '2.8h', suffix: 'vs team avg 2.6h', better: false },
    ],
    trend: [
      { label: 'Wk 2', resolved: 10, teamResolved: 12, csat: 4.0, teamCsat: 4.2, fcr: 76, teamFcr: 79, mtta: 3.1, teamMtta: 2.7 },
      { label: 'Wk 3', resolved: 9,  teamResolved: 11, csat: 4.1, teamCsat: 4.1, fcr: 78, teamFcr: 80, mtta: 2.9, teamMtta: 2.6 },
      { label: 'Wk 4', resolved: 11, teamResolved: 10, csat: 4.2, teamCsat: 4.2, fcr: 80, teamFcr: 80, mtta: 2.7, teamMtta: 2.6 },
      { label: 'Wk 5', resolved: 11, teamResolved: 11, csat: 4.2, teamCsat: 4.3, fcr: 81, teamFcr: 81, mtta: 2.6, teamMtta: 2.5 },
    ],
    tickets: [
      { id: 'IT-4700', title: 'Audio not working on video calls — headset issue',            resolved: 'Feb 28',  time: '40m',  csat: 4 },
      { id: 'IT-4685', title: 'Shared mailbox permissions missing for Marketing team',       resolved: 'Feb 27',  time: '1.1h', csat: 4 },
      { id: 'IT-4671', title: 'Zoom not launching on Windows — corrupted install',           resolved: 'Feb 26',  time: '35m',  csat: 5 },
      { id: 'IT-4658', title: 'Password reset loop — user cannot log in to VDI',            resolved: 'Feb 25',  time: '2.0h', csat: 3 },
      { id: 'IT-4641', title: 'Printer driver update required — HP LaserJet',               resolved: 'Feb 24',  time: '25m',  csat: 4 },
      { id: 'IT-4629', title: 'GitHub access request — new engineering hire',               resolved: 'Feb 22',  time: '30m',  csat: 5 },
      { id: 'IT-4614', title: 'Laptop screen flickering — display cable loose',             resolved: 'Feb 21',  time: '1.5h', csat: 3 },
      { id: 'IT-4601', title: 'Slack integration with Jira not posting updates',            resolved: 'Feb 20',  time: '50m',  csat: 4 },
    ],
  },
};

const PERIODS = ['This week', 'This month', 'Last month'];

// ── KPI card (dashboard shadow style) ─────────────────────────────────────────

function KpiCard({ label, value, suffix, better }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--background-weak)',
        borderRadius: 10,
        padding: '18px 20px',
        boxShadow: hov
          ? '0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)'
          : '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.15s',
      }}
    >
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 8px', lineHeight: '16px' }}>{label}</p>
      <p style={{ fontFamily: SFD, fontSize: 48, fontWeight: 400, color: 'var(--text)', lineHeight: '56px', letterSpacing: '0.35px', margin: '0 0 6px', fontFeatureSettings: "'liga' off, 'clig' off" }}>{value}</p>
      <p style={{ fontSize: 12, color: better ? 'var(--success-text)' : 'var(--danger-text)', fontFamily: SFT, margin: 0, lineHeight: '18px' }}>
        {better ? '↑' : '↓'} {suffix}
      </p>
    </div>
  );
}

// ── Trend chart ────────────────────────────────────────────────────────────────

function TrendChart({ title, dataKey, teamKey, data, color, unit, domain }) {
  return (
    <div style={{
      background: 'var(--background-weak)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '16px 20px 12px',
    }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', fontFamily: SFT, margin: '0 0 4px', letterSpacing: '-0.2px' }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>
          <span style={{ width: 16, height: 2, background: color, display: 'inline-block', borderRadius: 1, flexShrink: 0 }} /> Me
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>
          <span style={{ width: 16, height: 0, borderTop: '2px dashed var(--text-disabled)', display: 'inline-block', flexShrink: 0 }} /> Team avg
        </span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} domain={domain} tickFormatter={v => unit ? `${v}${unit}` : v} />
          <RechartsTooltip
            formatter={(val, name) => [`${val}${unit ?? ''}`, name === dataKey ? 'Me' : 'Team avg']}
            contentStyle={{ fontSize: 12, fontFamily: SFT, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', color: 'var(--text)' }}
            labelStyle={{ color: 'var(--text-weak)', marginBottom: 4 }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3, fill: color }} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey={teamKey} stroke="var(--text-disabled)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Star rating ────────────────────────────────────────────────────────────────

function StarRating({ value }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 12 12" width="11" height="11" fill={i <= value ? 'var(--warning-background-strong)' : 'var(--border)'}>
          <path d="M6 1l1.3 2.6L10 4.1 8 6.1l.5 2.9L6 7.6 3.5 9 4 6.1 2 4.1l2.7-.5L6 1z"/>
        </svg>
      ))}
    </div>
  );
}

// ── Ticket row (flat table with column dividers) ───────────────────────────────

const COL_WIDTHS = '80px 1fr 110px 70px 100px';

function TableHeader() {
  const cols = ['Ticket', 'Title', 'Resolved', 'Time', 'CSAT'];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: COL_WIDTHS,
      borderBottom: '1px solid var(--border)',
    }}>
      {cols.map((h, i) => (
        <div key={h} style={{
          padding: '0 16px', height: 36, display: 'flex', alignItems: 'center',
          borderRight: i < cols.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}>{h}</span>
        </div>
      ))}
    </div>
  );
}

function TicketRow({ ticket, last }) {
  const [hov, setHov] = useState(false);
  const cells = [
    <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>{ticket.id}</span>,
    <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</span>,
    <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{ticket.resolved}</span>,
    <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{ticket.time}</span>,
    <StarRating value={ticket.csat} />,
  ];
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: COL_WIDTHS,
        borderBottom: last ? 'none' : '1px solid var(--border)',
        background: hov ? 'var(--background-medium)' : 'transparent',
        transition: 'background 0.1s', cursor: 'pointer',
      }}
    >
      {cells.map((cell, i) => (
        <div key={i} style={{
          padding: '0 16px', height: 48, display: 'flex', alignItems: 'center',
          borderRight: i < cells.length - 1 ? '1px solid var(--border)' : 'none',
          overflow: 'hidden',
        }}>
          {cell}
        </div>
      ))}
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────────

export default function AgentPerformanceView() {
  const [period, setPeriod] = useState('This week');
  const { kpis, trend, tickets } = PERIOD_DATA[period];

  return (
    <div style={{
      height: '100%', overflowY: 'auto',
      padding: '32px 32px 64px', boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: SFD, fontSize: 20, fontWeight: 500, color: 'var(--text)', margin: 0, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off" }}>
          My performance
        </h1>

        {/* Period picker */}
        <div style={{ display: 'flex', background: 'var(--background-medium)', borderRadius: 8, padding: 3, gap: 2, flexShrink: 0 }}>
          {PERIODS.map(p => (
            <button key={p} type="button" onClick={() => setPeriod(p)} style={{
              padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: period === p ? 500 : 400, fontFamily: SFT,
              background: period === p ? 'var(--surface)' : 'transparent',
              color: period === p ? 'var(--text)' : 'var(--text-weak)',
              boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.12s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 24 }}>
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Trend charts — 2×2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <TrendChart title="Tickets resolved" dataKey="resolved" teamKey="teamResolved" data={trend} color="var(--chart-4)" domain={[0, 20]} />
        <TrendChart title="CSAT score"       dataKey="csat"     teamKey="teamCsat"     data={trend} color="var(--success-text)" domain={[3.5, 5.0]} />
        <TrendChart title="FCR rate (%)"     dataKey="fcr"      teamKey="teamFcr"      data={trend} color="#8b5cf6" unit="%" domain={[70, 95]} />
        <TrendChart title="MTTA (hours)"     dataKey="mtta"     teamKey="teamMtta"     data={trend} color="var(--warning-background-strong)" unit="h" domain={[1, 3.5]} />
      </div>

      {/* Recently resolved — flat table with column dividers */}
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: '0 0 10px', fontFamily: SFT, letterSpacing: '-0.2px' }}>Recently resolved</p>
        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <TableHeader />
          {tickets.map((t, i) => (
            <TicketRow key={t.id} ticket={t} last={i === tickets.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
