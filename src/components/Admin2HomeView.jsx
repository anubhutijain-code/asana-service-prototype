// ─── Admin2HomeView — Command Center Home ────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TEAM_DATA, TICKET_TOPICS } from '../data/dashboard';

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

// ── Typography / style constants (match HomeView + DashboardView exactly) ─────

const H4 = {
  margin: 0,
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 16,
  fontWeight: 500,
  color: 'var(--Default-text, #1E1F21)',
  lineHeight: '20px',
  letterSpacing: '-0.32px',
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


const URGENCY_COLOR = { high: 'var(--danger-text)', normal: 'var(--warning-text)', low: 'var(--text-disabled)' };

// ── AI Summary Card ───────────────────────────────────────────────────────────

const AI_SUMMARY_TEXT = "3 tickets are within 2 hours of breaching SLA — all in the IT queue and likely connected to the Okta login spike this morning. Marcus and Devon are above capacity. AI deflection is up 7pp week-over-week.";

function AiSummaryCard() {
  return (
    <div style={{ background: 'var(--background-medium)', borderRadius: 8, padding: '14px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" style={{ flexShrink: 0 }}>
          <defs>
            <linearGradient id="aiGradHome" x1="3.375" y1="3.1875" x2="9.904" y2="10.437" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF594B" />
              <stop offset="1" stopColor="#4786FF" />
            </linearGradient>
          </defs>
          <path d="M8.8125 0H8.1875C8.1875 0.580161 7.95703 1.13656 7.5468 1.5468C7.13656 1.95703 6.58016 2.1875 6 2.1875V2.8125C6.58016 2.8125 7.13656 3.04297 7.5468 3.4532C7.95703 3.86344 8.1875 4.41984 8.1875 5H8.8125C8.8125 4.41984 9.04297 3.86344 9.4532 3.4532C9.86344 3.04297 10.4198 2.8125 11 2.8125V2.1875C10.4198 2.1875 9.86344 1.95703 9.4532 1.5468C9.04297 1.13656 8.8125 0.580161 8.8125 0ZM6.5 5.125C4.8335 5.125 3.875 4.1665 3.875 2.5H3.125C3.125 4.1665 2.1665 5.125 0.5 5.125V5.875C2.1665 5.875 3.125 6.8335 3.125 8.5H3.875C3.875 6.8335 4.8335 5.875 6.5 5.875V5.125ZM7.8125 7H7.1875C7.1875 7.28727 7.13092 7.57172 7.02099 7.83712C6.91105 8.10252 6.74992 8.34367 6.5468 8.5468C6.34367 8.74992 6.10252 8.91105 5.83712 9.02099C5.57172 9.13092 5.28727 9.1875 5 9.1875V9.8125C5.58016 9.8125 6.13656 10.043 6.5468 10.4532C6.95703 10.8634 7.1875 11.4198 7.1875 12H7.8125C7.8125 11.4198 8.04297 10.8634 8.4532 10.4532C8.86344 10.043 9.41984 9.8125 10 9.8125V9.1875C9.41984 9.1875 8.86344 8.95703 8.4532 8.5468C8.04297 8.13656 7.8125 7.58016 7.8125 7Z" fill="url(#aiGradHome)" />
        </svg>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>AI summary</span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>· just now</span>
      </div>
      <p style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text)', margin: 0, fontFamily: SFT }}>
        {AI_SUMMARY_TEXT}
      </p>
    </div>
  );
}

// ── Integrations Card ─────────────────────────────────────────────────────────

const CONNECTED_INTEGRATIONS = [
  { id: 'okta',  name: 'Okta'          },
  { id: 'ms365', name: 'Microsoft 365' },
];

const RECOMMENDED_INTEGRATIONS = [
  { id: 'workday', name: 'Workday', desc: 'Auto-provision accounts on hire — estimated 8 fewer tickets/week' },
  { id: 'slack',   name: 'Slack',   desc: 'Surface SLA alerts in team channels — reduce response lag by ~40 min' },
];

const LOGO_COMPONENTS = {
  okta:    <OktaLogo size={20} />,
  ms365:   <Microsoft365Logo size={20} />,
  workday: <WorkdayLogo size={32} />,
  slack:   <SlackLogo size={28} />,
};

// Slack — full official 4-color logo (from CreateQueueWizard.jsx)
function SlackLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M6.72313 20.2219C6.72313 22.0721 5.21173 23.5835 3.36156 23.5835C1.5114 23.5835 0 22.0721 0 20.2219C0 18.3718 1.5114 16.8604 3.36156 16.8604H6.72313V20.2219Z" fill="#E01E5A"/>
      <path d="M8.41602 20.2219C8.41602 18.3718 9.92742 16.8604 11.7776 16.8604C13.6277 16.8604 15.1391 18.3718 15.1391 20.2219V28.6389C15.1391 30.489 13.6277 32.0004 11.7776 32.0004C9.92742 32.0004 8.41602 30.489 8.41602 28.6389V20.2219Z" fill="#E01E5A"/>
      <path d="M11.7776 6.72313C9.92742 6.72313 8.41602 5.21173 8.41602 3.36156C8.41602 1.5114 9.92742 0 11.7776 0C13.6277 0 15.1391 1.5114 15.1391 3.36156V6.72313H11.7776Z" fill="#36C5F0"/>
      <path d="M11.7785 8.41699C13.6287 8.41699 15.1401 9.92839 15.1401 11.7786C15.1401 13.6287 13.6287 15.1401 11.7785 15.1401H3.36156C1.5114 15.1401 0 13.6287 0 11.7786C0 9.92839 1.5114 8.41699 3.36156 8.41699H11.7785Z" fill="#36C5F0"/>
      <path d="M25.2793 11.7776C25.2793 9.92742 26.7907 8.41602 28.6409 8.41602C30.491 8.41602 32.0024 9.92742 32.0024 11.7776C32.0024 13.6277 30.491 15.1391 28.6409 15.1391H25.2793V11.7776Z" fill="#2EB67D"/>
      <path d="M23.5825 11.7785C23.5825 13.6287 22.0711 15.1401 20.2209 15.1401C18.3708 15.1401 16.8594 13.6287 16.8594 11.7785V3.36156C16.8594 1.5114 18.3708 0 20.2209 0C22.0711 0 23.5825 1.5114 23.5825 3.36156V11.7785Z" fill="#2EB67D"/>
      <path d="M20.2209 25.2773C22.0711 25.2773 23.5825 26.7887 23.5825 28.6389C23.5825 30.4891 22.0711 32.0005 20.2209 32.0005C18.3708 32.0005 16.8594 30.4891 16.8594 28.6389V25.2773H20.2209Z" fill="#ECB22E"/>
      <path d="M20.2209 23.5835C18.3708 23.5835 16.8594 22.0721 16.8594 20.2219C16.8594 18.3718 18.3708 16.8604 20.2209 16.8604H28.6379C30.488 16.8604 31.9994 18.3718 31.9994 20.2219C31.9994 22.0721 30.488 23.5835 28.6379 23.5835H20.2209Z" fill="#ECB22E"/>
    </svg>
  );
}

// Workday — orange background + white wave (from SettingsView.jsx)
function WorkdayLogo({ size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#F7941D"/>
      <path d="M5 15L8 8l3 5 3-5 3 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

// Okta — blue background + white circle/dot (consistent with SettingsView icon style)
function OktaLogo({ size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#007DC1"/>
      <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  );
}

// Microsoft 365 — white background + 4-color quadrant squares
function Microsoft365Logo({ size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#fff" stroke="#E5E7EB" strokeWidth="0.75"/>
      <rect x="5"  y="5"  width="6" height="6" rx="1" fill="#F25022"/>
      <rect x="13" y="5"  width="6" height="6" rx="1" fill="#7FBA00"/>
      <rect x="5"  y="13" width="6" height="6" rx="1" fill="#00A4EF"/>
      <rect x="13" y="13" width="6" height="6" rx="1" fill="#FFB900"/>
    </svg>
  );
}

function RecommendedTile({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--background-medium)' : '#fff',
        borderRadius: 8,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {LOGO_COMPONENTS[item.id]}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, lineHeight: '18px' }}>
          {item.name}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '17px', fontFamily: SFT }}>
        {item.desc}
      </p>
    </div>
  );
}

function IntegrationsCard() {
  return (
    <div style={{ ...CARD_STYLE, overflow: 'hidden' }}>

      {/* ── White top section ── */}
      <div style={{ padding: '20px 24px 16px' }}>
        <h4 style={H4}>Integrations</h4>

        {/* Deflection stat */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '10px 0 12px' }}>
          <span style={{ fontFamily: SFT, fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
            23pp
          </span>
          <span style={{ fontSize: 14, color: 'var(--text-weak)', fontFamily: SFT }}>
            of AI deflection driven by integrations
          </span>
        </div>

        {/* Connected integrations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>Connected</span>
          {CONNECTED_INTEGRATIONS.map(int => (
            <div key={int.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px 3px 4px', borderRadius: 20, background: 'var(--background-medium)', border: '1px solid var(--border)' }}>
              {LOGO_COMPONENTS[int.id]}
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', fontFamily: SFT }}>{int.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Gradient bottom section ── */}
      <div style={{
        background: 'var(--Default-background-medium, #F2F3F4)',
        padding: '14px 20px 20px',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontFamily: SFT, margin: '0 0 12px' }}>
          Recommended integrations
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {RECOMMENDED_INTEGRATIONS.map(item => <RecommendedTile key={item.id} item={item} />)}
        </div>
      </div>

    </div>
  );
}

// ── Ticket Topics Card (sparklines per category) ──────────────────────────────

// Same blue scale as DashboardView TopicVolumeCard (darkest → lightest by volume)
const TOPIC_BLUES = [
  '#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6',
  '#4273D1', '#60a5fa', '#93c5fd', '#bfdbfe',
];

function TicketTopicsCard() {
  return (
    <div style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px', flexShrink: 0 }}>
        <h4 style={H4}>Ticket topics</h4>
        <p style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, margin: '4px 0 0' }}>7-day volume by category</p>
      </div>
      <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
        {TICKET_TOPICS.slice(0, 5).map((topic, i) => (
          <div key={topic.name} style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
            minHeight: 0,
          }}>
            <span style={{ width: 88, fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {topic.name}
            </span>
            <div style={{ flex: 1, minWidth: 0, height: 26 }}>
              <ResponsiveContainer width="100%" height={26}>
                <AreaChart data={topic.spark.map((v, idx) => ({ i: idx, v }))} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                  <Area type="monotone" dataKey="v" stroke={TOPIC_BLUES[i]} fill={TOPIC_BLUES[i]}
                    fillOpacity={0.18} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <span style={{ width: 28, fontSize: 11, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, textAlign: 'right', flexShrink: 0 }}>
              {topic.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Optimizations Card ────────────────────────────────────────────────────────

function OptimizationsCard() {
  const nav = useNavigate();
  const rows = TOP_INSIGHTS.slice(0, 2);
  return (
    <div style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', flexShrink: 0 }}>
        <h4 style={H4}>Optimizations</h4>
        <button
          onClick={() => nav('/optimize')}
          style={{ background: 'none', border: 'none', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}
        >
          See all
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
        {rows.map((insight, idx) => (
          <div key={insight.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0, borderBottom: idx < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <InsightRow insight={insight} divider={false} onClick={() => nav('/optimize')} />
          </div>
        ))}
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

// ── AI Performance Card ───────────────────────────────────────────────────────

const AI_DATA = {
  pct: 65, prevPct: 58,
  resolved: 183, kb: 28, escalated: 98,
};

const CAT_STYLES = {
  'Action gap':   { bg: 'var(--warning-background)',  color: 'var(--warning-text)'  },
  'Content gap':  { bg: 'var(--selected-background)', color: 'var(--selected-text)' },
  'Data gap':     { bg: 'var(--background-medium)',   color: 'var(--text-weak)'     },
  'AI CX rating': { bg: 'var(--danger-background)',   color: 'var(--danger-text)'   },
  'Anomaly':      { bg: 'var(--danger-background)',   color: 'var(--danger-text)'   },
  'SLA risk':     { bg: 'var(--warning-background)',  color: 'var(--warning-text)'  },
  'Capacity':     { bg: 'var(--warning-background)',  color: 'var(--warning-text)'  },
  'Optimize':     { bg: 'var(--selected-background)', color: 'var(--selected-text)' },
};

const TOP_INSIGHTS = [
  {
    id: 'a-001',
    category: 'Action gap',
    impact: 'high',
    gap: "Agents can't unlock Okta accounts — every lock escalates to L2",
    ticketCount: 12,
    suggestion: 'Grant L1 agents read + unlock permission in Okta admin console',
  },
  {
    id: 'cx-001',
    category: 'AI CX rating',
    cxScore: 2.3,
    impact: 'high',
    gap: 'AI gave generic password reset steps instead of Okta-specific flow',
    ticketCount: 11,
    suggestion: 'Update the Account Access KB article with Okta-specific reset steps',
  },
  {
    id: 'd-002',
    category: 'Data gap',
    impact: 'high',
    gap: 'Access requests missing department and role — agents verify manually',
    ticketCount: 9,
    suggestion: 'Add Department and Current Role as required fields on access request form',
  },
  {
    id: 'c-001',
    category: 'Content gap',
    impact: 'high',
    gap: 'No guidance on MFA re-enrollment after device replacement',
    ticketCount: 8,
    suggestion: 'Create article: MFA Device Re-enrollment After Hardware Replacement',
  },
];

function ImpactPill({ impact }) {
  const styles = {
    high:   { bg: 'var(--danger-background)',  color: 'var(--danger-text)'  },
    medium: { bg: 'var(--warning-background)', color: 'var(--warning-text)' },
    low:    { bg: 'var(--background-medium)',  color: 'var(--text-weak)'    },
  }[impact] ?? { bg: 'var(--background-medium)', color: 'var(--text-weak)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 500, fontFamily: SFT,
      padding: '2px 7px', borderRadius: 4,
      background: styles.bg, color: styles.color, flexShrink: 0,
    }}>
      {impact.charAt(0).toUpperCase() + impact.slice(1)} impact
    </span>
  );
}

function CxScorePill({ score }) {
  const styles = score < 2.5
    ? { bg: 'var(--danger-background)',  color: 'var(--danger-text)'  }
    : score < 3.5
    ? { bg: 'var(--warning-background)', color: 'var(--warning-text)' }
    : { bg: 'var(--success-background)', color: 'var(--success-text)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 11, fontWeight: 600, fontFamily: SFT,
      padding: '2px 7px', borderRadius: 4,
      background: styles.bg, color: styles.color, flexShrink: 0,
    }}>
      ★ {score.toFixed(1)} <span style={{ fontWeight: 400, opacity: 0.7 }}>/5</span>
    </span>
  );
}

function InsightRow({ insight, divider = true, onClick }) {
  const catStyle = CAT_STYLES[insight.category] ?? { bg: 'var(--background-medium)', color: 'var(--text-weak)' };
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
      style={{ padding: '13px 0', borderBottom: divider ? '1px solid var(--border)' : 'none', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.opacity = '0.75'; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.opacity = '1'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 7px', borderRadius: 4, background: catStyle.bg, color: catStyle.color, flexShrink: 0 }}>
          {insight.category}
        </span>
        {insight.cxScore != null
          ? <CxScorePill score={insight.cxScore} />
          : <ImpactPill impact={insight.impact} />
        }
        <span style={{ fontSize: 11, fontFamily: SFT, padding: '2px 7px', borderRadius: 4, background: 'var(--background-medium)', color: 'var(--text-disabled)' }}>
          {insight.ticketCount} tickets
        </span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: '0 0 4px', lineHeight: '20px' }}>
        {insight.gap}
      </p>
      <div style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, lineHeight: '18px' }}>
        {insight.suggestion}
      </div>
    </div>
  );
}

function AIPerformanceCard() {
  const { pct, prevPct, resolved, kb, escalated } = AI_DATA;
  const diff = pct - prevPct;
  const total = resolved + kb + escalated;

  return (
    <div style={{ ...CARD_STYLE, display: 'flex', overflow: 'hidden' }}>

      {/* ── Left: Deflection stats ─────────────────────────── */}
      <div style={{ width: 208, flexShrink: 0, padding: '20px 20px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', color: 'var(--text-disabled)', fontFamily: SFT, marginBottom: 10, textTransform: 'uppercase', lineHeight: '14px' }}>
          AI deflection
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
          <span style={{ fontFamily: '"SF Pro Display"', fontSize: 36, fontWeight: 500, color: 'var(--text)', lineHeight: 1, letterSpacing: '0.38px' }}>
            {pct}%
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success-text)', lineHeight: '18px' }}>↑ {diff}pp</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, lineHeight: '18px', marginBottom: 12 }}>
          Tier 1 · this week
        </p>

        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden', marginBottom: 5 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--selected-background-strong)', borderRadius: 3 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>AI {pct}%</span>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>Agents {100 - pct}%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'resolved',  value: resolved,  color: 'var(--selected-background-strong)' },
            { label: '→ KB',      value: kb,        color: 'var(--border-strong)' },
            { label: 'escalated', value: escalated, color: 'var(--text-disabled)' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>{row.value}</span> {row.label}
              </span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, marginTop: 2 }}>{total} total inbound</p>
        </div>
      </div>

      {/* ── Right: AI insights ─────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="var(--selected-background-strong)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M2.93 11.07l1.41-1.41M9.66 4.34l1.41-1.41"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontFamily: SFT }}>AI insights</span>
            <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>3 improvements detected this week</span>
          </div>
          <button style={{ background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}>
            View all
          </button>
        </div>

        <div style={{ padding: '0 20px' }}>
          {TOP_INSIGHTS.map((insight, idx) => (
            <InsightRow key={insight.id} insight={insight} divider={idx < TOP_INSIGHTS.length - 1} />
          ))}
        </div>
      </div>

    </div>
  );
}


// ── KPI stat card (matches DashboardView KpiCard design) ─────────────────────

function KpiStatCard({ label, value, sub, color }) {
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
      <p style={{ fontFamily: '"SF Pro Display"', fontSize: 38, fontWeight: 500, color: color ?? 'var(--text)', lineHeight: 1, letterSpacing: '0.38px', margin: '0 0 6px', fontFeatureSettings: "'liga' off" }}>{value}</p>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0, lineHeight: '18px' }}>{sub}</p>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function Admin2HomeView({ hideGreeting = false }) {
  const { agents, todayIndex, summary } = TEAM_DATA;

  const kpis = [
    { label: 'Escalations',   value: '3',                              sub: 'need attention',                                     color: 'var(--danger-text)'                },
    { label: 'Unassigned',    value: '18',                             sub: 'across queues',                                      color: 'var(--warning-text)'               },
    { label: 'SLA breaches',  value: String(summary.slaBreaches),      sub: 'this week',                                          color: 'var(--text)'                       },
    { label: 'Resolved',      value: String(summary.resolvedThisWeek), sub: 'this week',                                          color: 'var(--text)'                       },
    { label: 'AI deflection', value: `${AI_DATA.pct}%`,               sub: `↑ ${AI_DATA.pct - AI_DATA.prevPct}pp vs last week`,  color: 'var(--selected-background-strong)' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background-weak)' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 48 }}>

        {/* ── Greeting ─────────────────────────────────────────────────────── */}
        {!hideGreeting && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '40px 32px 28px', flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '18px', marginBottom: 6 }}>{getDateStr()}</p>
              <p style={{ fontFamily: '"SF Pro Display"', fontSize: 32, fontWeight: 400, color: 'var(--text)', letterSpacing: '0.38px', lineHeight: '40px', fontFeatureSettings: "'liga' off, 'clig' off" }}>
                {getGreeting()}, Anubhuti
              </p>
            </div>
          </div>
        )}

        {/* ── AI Summary ───────────────────────────────────────────────── */}
        <div style={{ padding: hideGreeting ? '28px 32px 0' : '0 32px', marginBottom: 16 }}>
          <AiSummaryCard />
        </div>

        {/* ── KPI cards ────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 14, padding: '0 32px', marginBottom: 24 }}>
          {kpis.map(k => (
            <KpiStatCard key={k.label} label={k.label} value={k.value} sub={k.sub} color={k.color} />
          ))}
        </div>

        {/* ── Bottom cards ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <IntegrationsCard />
            <OptimizationsCard />
            <TicketTopicsCard />
          </div>
          <TeamWorkloadCard agents={agents} todayIndex={todayIndex} />
        </div>

      </div>
    </div>
  );
}
