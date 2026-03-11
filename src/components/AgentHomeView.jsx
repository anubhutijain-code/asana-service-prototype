// ─── AgentHomeView — Personal home for the agent ─────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const CARD = {
  background: 'var(--background-weak)',
  border: '1px solid var(--border)',
  borderRadius: 8,
};

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

// ── Mock data ─────────────────────────────────────────────────────────────────

const KPIS = [
  { label: 'Open tickets',   value: '5',    sub: 'assigned to me', color: 'var(--text)'        },
  { label: 'SLA at risk',    value: '2',    sub: 'need attention',  color: 'var(--danger-text)' },
  { label: 'Resolved today', value: '3',    sub: 'closed by me',    color: 'var(--text)'        },
  { label: 'Avg response',   value: '1.2h', sub: 'this week',       color: 'var(--text)'        },
];

const SLA_TICKETS = [
  { id: 'IT-4917', title: 'MacBook Pro overheating — kernel_task 100% CPU',      priority: 'Critical', sla: '1h remaining',  slaType: 'warning', time: '1h ago',  requestedBy: 'Jordan Ellis'  },
  { id: 'IT-4851', title: 'All outbound email bouncing — mail server error',      priority: 'Medium',   sla: '28m remaining', slaType: 'danger',  time: '2h ago',  requestedBy: 'Finance Team'  },
  { id: 'IT-4783', title: 'User locked out after failed password reset attempt',  priority: 'Medium',   sla: '45m remaining', slaType: 'warning', time: '3h ago',  requestedBy: 'Lee Park'      },
];

const CRITICAL_TICKETS = [
  { id: 'IT-4917', title: 'MacBook Pro overheating — kernel_task 100% CPU',      priority: 'Critical', sla: '1h remaining',  slaType: 'warning', time: '1h ago',  requestedBy: 'Jordan Ellis'  },
  { id: 'IT-4902', title: 'Production API returning 502 — payment service down', priority: 'Critical', sla: '2h remaining',  slaType: 'warning', time: '45m ago', requestedBy: 'DevOps'        },
  { id: 'IT-4869', title: 'VPN service unreachable for all remote staff',         priority: 'Critical', sla: '3h remaining',  slaType: 'normal',  time: '2h ago',  requestedBy: 'Marcus Rivera' },
];

const PRIORITY_PILL = {
  Critical: { bg: '#FEF3C7', color: '#92400E' },
  Medium:   { bg: '#DBEAFE', color: '#1D4ED8' },
  Low:      { bg: '#F3F4F6', color: '#6D6E6F' },
};

const SLA_CLR = {
  danger:  'var(--danger-text)',
  warning: 'var(--warning-text)',
  normal:  'var(--text-disabled)',
};

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color }) {
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
      }}>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 8px', lineHeight: '16px' }}>{label}</p>
      <p style={{ fontFamily: '"SF Pro Display"', fontSize: 48, fontWeight: 400, color: color ?? 'var(--neutrals-lm-text, var(--Default-text, #1E1F21))', lineHeight: '56px', letterSpacing: '0.35px', margin: '0 0 6px', fontFeatureSettings: "'liga' off, 'clig' off" }}>{value}</p>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0, lineHeight: '18px' }}>{sub}</p>
    </div>
  );
}

// ── Ticket row ────────────────────────────────────────────────────────────────

function TicketCard({ ticket, showSla, onClick }) {
  const [hovered, setHovered] = useState(false);
  const pill = PRIORITY_PILL[ticket.priority] ?? PRIORITY_PILL.Low;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '12px 16px',
        cursor: 'pointer',
        background: hovered ? 'var(--background-medium)' : 'transparent',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.1s',
      }}
    >
      {/* Line 1: ticket ID + time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, letterSpacing: '0.2px' }}>
          {ticket.id}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>
          {ticket.time}
        </span>
      </div>

      {/* Line 2: title */}
      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: '19px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.1px', fontFamily: SFT, margin: '0 0 4px' }}>
        {ticket.title}
      </p>

      {/* Line 3: SLA or requester + priority pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {showSla ? (
          <span style={{ fontSize: 11, fontWeight: 500, color: SLA_CLR[ticket.slaType], fontFamily: SFT }}>
            {ticket.sla}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ticket.requestedBy}
          </span>
        )}
        <span style={{ fontSize: 10, fontWeight: 600, color: pill.color, background: pill.bg, borderRadius: 3, padding: '1px 6px', lineHeight: '16px', fontFamily: SFT, flexShrink: 0 }}>
          {ticket.priority}
        </span>
      </div>
    </div>
  );
}

// ── Ticket column panel ───────────────────────────────────────────────────────

function TicketColumn({ title, tickets, showSla, onTicketClick }) {
  return (
    <div style={{ flex: 1, ...CARD, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <h4 style={{ fontFamily: SFT, fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', letterSpacing: '-0.32px', lineHeight: '20px', fontFeatureSettings: "'liga' off, 'clig' off", margin: 0 }}>
          {title}
        </h4>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-disabled)', fontFamily: SFT }}>
          {tickets.length}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tickets.map(t => (
          <TicketCard
            key={t.id + t.sla}
            ticket={t}
            showSla={showSla}
            onClick={onTicketClick}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function AgentHomeView() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '28px 32px',
      gap: 20,
      boxSizing: 'border-box',
    }}>
      {/* Greeting */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: '#1E1F21', margin: 0 }}>
          {getGreeting()}, Sarah
        </h1>
        <p style={{ fontFamily: SFT, fontSize: 13, color: 'var(--text-disabled)', margin: '2px 0 0' }}>
          {getDateStr()}
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, flexShrink: 0 }}>
        {KPIS.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Two-column ticket panels */}
      <div style={{ flex: 1, display: 'flex', gap: 16, overflow: 'hidden', minHeight: 0 }}>
        <TicketColumn
          title="SLA at risk"
          tickets={SLA_TICKETS}
          showSla
          onTicketClick={() => navigate('/my-tickets')}
        />
        <TicketColumn
          title="Critical"
          tickets={CRITICAL_TICKETS}
          onTicketClick={() => navigate('/my-tickets')}
        />
      </div>
    </div>
  );
}
