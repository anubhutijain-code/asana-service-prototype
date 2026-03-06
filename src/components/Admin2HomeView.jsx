// ─── Admin2HomeView — Command Center Home ────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { TEAM_DATA } from '../data/dashboard';

// ── Typography / style constants (match HomeView + DashboardView exactly) ─────

const H4 = {
  margin: 0,
  fontFamily: '"SF Pro Display"',
  fontSize: 20,
  fontWeight: 500,
  color: 'var(--text)',
  lineHeight: '28px',
  letterSpacing: '0.38px',
  fontFeatureSettings: "'liga' off, 'clig' off",
};

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const CARD_STYLE = {
  background: 'var(--background-weak)',
  border: '1px solid var(--border)',
  borderRadius: 8,
};

// ── Workload chart constants (same as DashboardView TeamTab) ──────────────────

const WL_CAPACITY  = 40;
const PX_PER_DAY   = 30;
const N_DAYS       = TEAM_DATA.dates.length;
const CHART_W      = (N_DAYS - 1) * PX_PER_DAY;
const CHART_H      = 72;

const WEEK_STARTS = [
  { label: 'Jan 13', index: 0  },
  { label: 'Jan 20', index: 5  },
  { label: 'Jan 27', index: 10 },
  { label: 'Feb 3',  index: 15 },
  { label: 'Feb 10', index: 20 },
  { label: 'Feb 17', index: 25 },
  { label: 'Feb 24', index: 30 },
  { label: 'Mar 3',  index: 35 },
];

const STATUS_STYLE = {
  danger: { color: 'var(--danger-text)', bg: 'var(--danger-background)' },
  normal: { color: 'var(--text-weak)',   bg: 'var(--background-medium)' },
};

function getBadgeStatus(count) {
  return (count / WL_CAPACITY) >= 0.85 ? 'danger' : 'normal';
}

const WL_THRESHOLD = WL_CAPACITY * 0.85; // 34

function WorkloadTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const idx = Math.round(Number(label));
  const date = TEAM_DATA.dates?.[idx] ?? '';
  const base = payload.find(p => p.dataKey === 'base');
  if (!base) return null;
  return (
    <div style={{ ...CARD_STYLE, padding: '8px 12px', boxShadow: 'var(--shadow-md)', fontFamily: SFT, fontSize: 12 }}>
      {date && <p style={{ color: 'var(--text-weak)', marginBottom: 4, fontSize: 11 }}>{date}</p>}
      <p style={{ color: 'var(--text)', margin: 0, fontWeight: 500 }}>
        {base.name}: {base.value} open
      </p>
    </div>
  );
}

// ── Static mock data ──────────────────────────────────────────────────────────

const MOCK_APPROVALS = [
  { id: 'ap1', title: 'Policy exception — refund > $500',        ticket: 'IT-4821 · Customer damaged hardware, requesting full refund outside 30-day window', requestedBy: 'Marcus Rivera', initials: 'MR', color: '#D43D5D', urgency: 'high',   time: '2h ago'   },
  { id: 'ap2', title: 'SLA time extension — Vertex Labs',        ticket: 'IT-4756 · Data sync failure ongoing since Tuesday, team needs +48h to resolve',      requestedBy: 'Tom Reyes',     initials: 'TR', color: '#ECBD85', urgency: 'high',   time: '4h ago'   },
  { id: 'ap3', title: 'Customer credit approval — $120',         ticket: 'IT-4903 · Long-tenure customer, service disruption during billing cycle',             requestedBy: 'Priya Nair',    initials: 'PN', color: '#5DA182', urgency: 'normal', time: 'Yesterday' },
  { id: 'ap4', title: 'IT portal access upgrade request',        ticket: 'IT-4612 · Devon needs admin-level access to SSO portal for ongoing migration',        requestedBy: 'Devon Walsh',   initials: 'DW', color: '#7C5EA8', urgency: 'low',    time: 'Yesterday' },
];

const QUEUE_HEALTH = [
  { id: 'it',      label: 'IT Support',     active: 12, unassigned: 8, sla: 84, route: '/tickets'    },
  { id: 'hr',      label: 'HR',             active: 9,  unassigned: 3, sla: 91, route: '/hr-tickets'  },
  { id: 'finance', label: 'Finance',        active: 6,  unassigned: 1, sla: 97, route: '/tickets'    },
  { id: 'ops',     label: 'Operations',     active: 15, unassigned: 6, sla: 78, route: '/tickets'    },
];

const URGENCY_COLOR = { high: 'var(--danger-text)', normal: 'var(--warning-text)', low: 'var(--text-disabled)' };

// ── My Approvals Card ─────────────────────────────────────────────────────────

function ApprovalItem({ item }) {
  const timeColor = URGENCY_COLOR[item.urgency];
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background-weak)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Pending circle icon */}
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="var(--text-disabled)" strokeWidth="1.2"/>
            <path d="M6 9.5L8 11.5L12 7" stroke="var(--text-disabled)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.title}
          </p>
          {/* Ticket context */}
          <p style={{ fontSize: 12, color: 'var(--text-weak)', lineHeight: '18px', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.ticket}
          </p>
          {/* Requester */}
          <p style={{ fontSize: 12, color: 'var(--text-weak)', lineHeight: '18px', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: item.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {item.initials}
            </span>
            {item.requestedBy}
          </p>
        </div>

        {/* Time */}
        <div style={{ flexShrink: 0, marginTop: 3 }}>
          <span style={{ fontSize: 12, color: timeColor, lineHeight: '18px' }}>{item.time}</span>
        </div>
      </div>
    </div>
  );
}

function ApprovalsCard({ approvals }) {
  return (
    <div style={{ flex: 1, ...CARD_STYLE, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

      {/* Header — no border-bottom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 24px', height: 64, flexShrink: 0, boxSizing: 'border-box' }}>
        <h4 style={H4}>My tickets</h4>
      </div>

      {/* Approval cards — stacked with gap, same as TicketsQueueCard */}
      {approvals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 4px' }}>
          {approvals.map(item => (
            <ApprovalItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--text-disabled)' }}>All caught up — no pending approvals</p>
        </div>
      )}

      <div style={{ padding: '8px 16px 12px' }}>
        <button style={{ background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)' }}>
          View all tickets
        </button>
      </div>
    </div>
  );
}

// ── Team Workload Card (same visual as Dashboard > Team tab) ──────────────────

function TeamWorkloadCard({ agents, todayIndex }) {
  const chartRowH = CHART_H;
  const scrollRef = useRef(null);
  const todayX = todayIndex * PX_PER_DAY;
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(0, todayX - 200);
    }
  }, []);

  return (
    <div style={{ flex: 1, ...CARD_STYLE, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', height: 64, flexShrink: 0, boxSizing: 'border-box' }}>
        <h4 style={H4}>Team workload</h4>
      </div>

      {/* Timeline — left fixed column + right scrollable (identical to TeamTab) */}
      <div style={{ display: 'flex', overflow: 'hidden' }}>

        {/* Left column */}
        <div style={{ width: 140, flexShrink: 0, borderRight: '1px solid var(--border)' }}>
          <div style={{ height: 32, background: 'var(--background-medium)', borderBottom: '1px solid var(--border)' }} />
          {agents.map((agent, i) => (
            <div key={agent.id} style={{
              height: chartRowH,
              borderBottom: i < agents.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
            }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: agent.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>
                {agent.initials}
              </div>
              <p style={{ fontSize: 11, fontFamily: SFT, color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '14px' }}>
                {agent.name}
              </p>
            </div>
          ))}
        </div>

        {/* Right scrollable chart */}
        <div ref={scrollRef} style={{ flex: 1, overflowX: 'auto' }}>
          <div style={{ width: CHART_W, position: 'relative' }}>

            {/* Today vertical line */}
            <div style={{ position: 'absolute', left: todayX, top: 0, bottom: 0, width: 1, background: 'var(--selected-background-strong)', opacity: 0.4, zIndex: 2, pointerEvents: 'none' }} />

            {/* Date header */}
            <div style={{ height: 32, borderBottom: '1px solid var(--border)', background: 'var(--background-medium)', position: 'relative' }}>
              {WEEK_STARTS.map(ws => (
                <span key={ws.label} style={{ position: 'absolute', left: ws.index * PX_PER_DAY + 4, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--text-weak)', fontFamily: SFT, whiteSpace: 'nowrap' }}>
                  {ws.label}
                </span>
              ))}
              <span style={{ position: 'absolute', left: todayX, top: '50%', transform: 'translateY(-50%) translateX(-50%)', fontSize: 10, fontWeight: 600, color: 'var(--selected-background-strong)', fontFamily: SFT, zIndex: 3, whiteSpace: 'nowrap' }}>
                Today
              </span>
            </div>

            {/* Agent chart rows */}
            {agents.map((agent, i) => (
              <div key={agent.id} style={{ borderBottom: i < agents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <AreaChart
                  data={agent.daily.map((v, idx) => ({
                    idx,
                    base: v,
                    over: v > WL_THRESHOLD ? v : null,
                  }))}
                  width={CHART_W}
                  height={chartRowH}
                  margin={{ top: 8, right: 0, bottom: 8, left: 0 }}
                  syncId="wl-home"
                >
                  <YAxis domain={[0, WL_CAPACITY]} hide />
                  <XAxis dataKey="idx" type="number" domain={[0, N_DAYS - 1]} hide />
                  {/* Grey base — full data */}
                  <Area type="monotone" dataKey="base" name={agent.name}
                    stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.15}
                    strokeWidth={1.5} dot={false}
                    activeDot={{ r: 3, fill: '#9CA3AF', strokeWidth: 0 }}
                  />
                  {/* Red overload — full bar from bottom on over-capacity days */}
                  <Area type="monotone" dataKey="over"
                    stroke="#D43D5D" fill="#D43D5D" fillOpacity={0.3}
                    strokeWidth={1.5} dot={false} connectNulls={false}
                    activeDot={false}
                  />
                  <RechartsTooltip content={<WorkloadTooltip />} />
                </AreaChart>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI Deflection Card ────────────────────────────────────────────────────────

const AI_DATA = {
  pct: 65, prevPct: 58,
  resolved: 183, kb: 28, escalated: 98,
};

function AIDeflectionCard() {
  const { pct, prevPct, resolved, kb, escalated } = AI_DATA;
  const diff = pct - prevPct;
  const total = resolved + kb + escalated;

  return (
    <div style={{ ...CARD_STYLE, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 28 }}>

      {/* Big stat */}
      <div style={{ flexShrink: 0, minWidth: 120 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: '"SF Pro Display"', fontSize: 40, fontWeight: 500, color: 'var(--text)', lineHeight: 1, letterSpacing: '0.38px' }}>
            {pct}%
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success-text)', lineHeight: '18px' }}>
            ↑ {diff}pp
          </span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginTop: 6, lineHeight: '18px' }}>AI deflection rate</p>
        <p style={{ fontSize: 12, color: 'var(--text-weak)', marginTop: 2, lineHeight: '18px' }}>Tier 1 · this week</p>
      </div>

      <div style={{ width: 1, height: 64, background: 'var(--border)', flexShrink: 0 }} />

      {/* Description + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: '20px', marginBottom: 10 }}>
          The AI handled <strong>{pct}%</strong> of Tier 1 requests this week without agent involvement — up from {prevPct}% last week.
        </p>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--selected-background-strong)', borderRadius: 3, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>AI — {pct}%</span>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>Agents — {100 - pct}%</span>
        </div>
      </div>

      <div style={{ width: 1, height: 64, background: 'var(--border)', flexShrink: 0 }} />

      {/* Breakdown */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[
          { label: 'resolved autonomously', value: resolved, color: 'var(--selected-background-strong)' },
          { label: 'redirected to knowledge base', value: kb, color: 'var(--border-strong)' },
          { label: 'escalated to agents', value: escalated, color: 'var(--text-disabled)' },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{row.value}</span> {row.label}
            </span>
          </div>
        ))}
        <p style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, marginTop: 2 }}>{total} total inbound this week</p>
      </div>

    </div>
  );
}

// ── Queue Health Card ─────────────────────────────────────────────────────────

const QUEUE_CAPACITY = 20; // max active tickets per queue for bar scaling

function QueueRow({ queue, onNavigate }) {
  const slaColor = queue.sla < 85 ? 'var(--danger-text)' : queue.sla < 92 ? 'var(--warning-text)' : 'var(--success-text)';
  const slaBg    = queue.sla < 85 ? 'var(--danger-background)' : queue.sla < 92 ? 'var(--warning-background)' : 'var(--success-background)';
  const barPct   = Math.min(100, (queue.active / QUEUE_CAPACITY) * 100);
  const unassignedPct = Math.min(100, (queue.unassigned / queue.active) * 100);

  return (
    <div
      onClick={() => onNavigate(queue.route)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onNavigate(queue.route)}
      style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
    >
      {/* Queue name */}
      <span style={{ width: 120, flexShrink: 0, fontSize: 14, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.15px', lineHeight: '22px' }}>
        {queue.label}
      </span>

      {/* Stacked bar — active (with unassigned sub-segment) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden', position: 'relative' }}>
          {/* Active tickets */}
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${barPct}%`, background: 'var(--selected-background-strong)', borderRadius: 4 }} />
          {/* Unassigned sub-segment (darker overlay at left) */}
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${barPct * unassignedPct / 100}%`, background: 'var(--danger-background-strong, #F87171)', borderRadius: 4, opacity: 0.6 }} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{queue.active}</span> active
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>
            <span style={{ color: 'var(--danger-text)', fontWeight: 600 }}>{queue.unassigned}</span> unassigned
          </span>
        </div>
      </div>

      {/* SLA badge */}
      <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, color: slaColor, background: slaBg, borderRadius: 20, padding: '2px 10px', lineHeight: '18px', fontFamily: SFT }}>
        {queue.sla}% SLA
      </span>

      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
        <path d="M5.07 1.94a.75.75 0 0 0-1.14 1l2.6 3.06-2.6 3.09a.75.75 0 0 0 1.14 1l3-3.52a.75.75 0 0 0 0-.99l-3-3.64z" fill="var(--text-disabled)"/>
      </svg>
    </div>
  );
}

function QueueHealthCard({ onNavigate }) {
  return (
    <div style={{ ...CARD_STYLE, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', height: 64, boxSizing: 'border-box' }}>
        <h4 style={H4}>Queue health</h4>
        <button style={{ background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}>
          View all
        </button>
      </div>
      {QUEUE_HEALTH.map(q => (
        <QueueRow key={q.id} queue={q} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function Admin2HomeView() {
  const navigate = useNavigate();
  const [pendingIds] = useState(MOCK_APPROVALS.map(a => a.id));

  const { agents, todayIndex, summary } = TEAM_DATA;

  const pendingApprovals = MOCK_APPROVALS.filter(a => pendingIds.includes(a.id));

  const totalUnassigned = QUEUE_HEALTH.reduce((s, q) => s + q.unassigned, 0);

  const kpis = [
    { label: 'Escalations',  value: '3',                              sub: 'need attention', color: 'var(--danger-text)'   },
    { label: 'Approvals',    value: String(pendingApprovals.length),  sub: 'pending review', color: 'var(--text)'          },
    { label: 'Unassigned',   value: String(totalUnassigned),          sub: 'across queues',  color: 'var(--warning-text)'  },
    { label: 'SLA breaches', value: String(summary.slaBreaches),      sub: 'this week',      color: 'var(--text)'          },
    { label: 'Resolved',     value: String(summary.resolvedThisWeek), sub: 'this week',      color: 'var(--text)'          },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background-weak)' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 48 }}>

        {/* ── Greeting ─────────────────────────────────────────────────────── */}
        <div style={{ padding: '40px 32px 28px', flexShrink: 0 }}>
          <p style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '18px', marginBottom: 6 }}>Thursday, March 5</p>
          <p style={{ fontFamily: '"SF Pro Display"', fontSize: 32, fontWeight: 400, color: 'var(--text)', letterSpacing: '0.38px', lineHeight: '40px', fontFeatureSettings: "'liga' off, 'clig' off" }}>
            Good morning
          </p>
        </div>

        {/* ── KPI cards ────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, padding: '0 32px', marginBottom: 16 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ ...CARD_STYLE, padding: '20px 24px' }}>
              <p style={{ fontSize: 32, fontWeight: 500, color: k.color, lineHeight: '40px', fontFamily: '"SF Pro Display"', letterSpacing: '0.38px' }}>{k.value}</p>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.15px', marginTop: 2 }}>{k.label}</p>
              <p style={{ fontSize: 12, color: 'var(--text-weak)', lineHeight: '18px', marginTop: 1 }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── AI Deflection ────────────────────────────────────────────────── */}
        <div style={{ padding: '0 32px', marginBottom: 16 }}>
          <AIDeflectionCard />
        </div>

        {/* ── Two-column body — Approvals + Workload same height ───────────── */}
        <div style={{ display: 'flex', gap: 16, padding: '0 32px', alignItems: 'stretch' }}>
          <ApprovalsCard approvals={pendingApprovals} />
          <TeamWorkloadCard agents={agents} todayIndex={todayIndex} />
        </div>

        {/* ── Queue Health — full width ─────────────────────────────────────── */}
        <div style={{ padding: '16px 32px 0' }}>
          <QueueHealthCard onNavigate={navigate} />
        </div>

      </div>
    </div>
  );
}
