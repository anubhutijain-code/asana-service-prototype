import { useState, useRef, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Label,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
  AreaChart, Area,
  Treemap,
} from 'recharts';
import { DASHBOARD_DATA, QUEUE_OPTIONS, TICKET_RESOLUTION_BY_TYPE, KB_PERFORMANCE, TEAM_DATA, TICKET_TOPICS } from '../data/dashboard';
import { SFT } from '../constants/typography';

const TICK = { fontSize: 11, fill: '#9ea0a2', fontFamily: SFT };
const CARD = {
  background: 'var(--background-weak)',
  border: '1px solid var(--border)',
  borderRadius: 8,
};

// ─── Icons ─────────────────────────────────────────────────────────────────────

function AiGradientIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="aiGradDash" x1="3.375" y1="3.1875" x2="9.904" y2="10.437" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF594B" /><stop offset="1" stopColor="#4786FF" />
        </linearGradient>
      </defs>
      <path d="M8.8125 0H8.1875C8.1875 0.580161 7.95703 1.13656 7.5468 1.5468C7.13656 1.95703 6.58016 2.1875 6 2.1875V2.8125C6.58016 2.8125 7.13656 3.04297 7.5468 3.4532C7.95703 3.86344 8.1875 4.41984 8.1875 5H8.8125C8.8125 4.41984 9.04297 3.86344 9.4532 3.4532C9.86344 3.04297 10.4198 2.8125 11 2.8125V2.1875C10.4198 2.1875 9.86344 1.95703 9.4532 1.5468C9.04297 1.13656 8.8125 0.580161 8.8125 0ZM6.5 5.125C4.8335 5.125 3.875 4.1665 3.875 2.5H3.125C3.125 4.1665 2.1665 5.125 0.5 5.125V5.875C2.1665 5.875 3.125 6.8335 3.125 8.5H3.875C3.875 6.8335 4.8335 5.875 6.5 5.875V5.125ZM7.8125 7H7.1875C7.1875 7.28727 7.13092 7.57172 7.02099 7.83712C6.91105 8.10252 6.74992 8.34367 6.5468 8.5468C6.34367 8.74992 6.10252 8.91105 5.83712 9.02099C5.57172 9.13092 5.28727 9.1875 5 9.1875V9.8125C5.58016 9.8125 6.13656 10.043 6.5468 10.4532C6.95703 10.8634 7.1875 11.4198 7.1875 12H7.8125C7.8125 11.4198 8.04297 10.8634 8.4532 10.4532C8.86344 10.043 9.41984 9.8125 10 9.8125V9.1875C9.41984 9.1875 8.86344 8.95703 8.4532 8.5468C8.04297 8.13656 7.8125 7.58016 7.8125 7Z" fill="url(#aiGradDash)" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true">
      <path d="M9.09 3.93L6 6.52 2.91 3.93a.75.75 0 10-.97 1.14l3.58 3a.75.75 0 001.0 0l3.57-3a.75.75 0 10-.97-1.14z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M1 3h12M3.5 7h7M6 11h2" />
    </svg>
  );
}

function TrendUp({ color = 'currentColor', size = 10 }) {
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M5 1L9 5.5H6.5V9h-3V5.5H1L5 1Z" />
    </svg>
  );
}

function TrendDown({ color = 'currentColor', size = 10 }) {
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M5 9L1 4.5H3.5V1h3v3.5H9L5 9Z" />
    </svg>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, style }) {
  return (
    <div style={{ ...CARD, padding: '20px 24px', ...style }}>
      <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', fontFamily: SFT, lineHeight: '20px', letterSpacing: '-0.32px', fontFeatureSettings: "'liga' off, 'clig' off", margin: '0 0 2px' }}>{title}</p>
      {subtitle && <p style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 16px' }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...CARD, padding: '8px 12px', boxShadow: 'var(--shadow-md)', fontFamily: SFT, fontSize: 12 }}>
      {label && <p style={{ color: 'var(--text-weak)', marginBottom: 4, fontSize: 11 }}>{label}</p>}
      {payload.map((item, i) => (
        <p key={i} style={{ color: item.color || 'var(--text)', margin: '2px 0', fontWeight: 500 }}>
          {item.name}: {item.value ?? '—'}
        </p>
      ))}
    </div>
  );
}

// ─── KPI Card — borderless + sparkline ────────────────────────────────────────

function KpiCard({ label, value, trend, trendGood, spark = [] }) {
  const [hov, setHov] = useState(false);
  const trendColor  = trendGood ? 'var(--success-text)' : 'var(--danger-text)';
  const strokeColor = 'var(--selected-background-strong)';
  const trendPrefix = trendGood ? '↑' : '↓';
  const data = spark.map((v, i) => ({ i, v }));
  const minV = Math.min(...spark);
  const maxV = Math.max(...spark);
  const pad  = (maxV - minV) * 0.25 || 1;
  const domain = [minV - pad, maxV + pad];

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
      <p style={{ fontFamily: '"SF Pro Display"', fontSize: 48, fontWeight: 400, color: 'var(--neutrals-lm-text, var(--Default-text, #1E1F21))', lineHeight: '56px', letterSpacing: '0.35px', margin: '0 0 6px', fontFeatureSettings: "'liga' off, 'clig' off" }}>{value}</p>
      <p style={{ fontSize: 12, color: trendColor, fontFamily: SFT, margin: 0, lineHeight: '18px' }}>
        {trendPrefix} {trend}
      </p>
    </div>
  );
}

// ─── Topic Volume Card ─────────────────────────────────────────────────────────

// Blue scale: index 0 = highest volume (darkest) → index 7 = lowest (lightest)
const TOPIC_BLUES = [
  '#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6',
  '#4273D1', '#60a5fa', '#93c5fd', '#bfdbfe',
];

function TreemapContent(props) {
  const { x, y, width, height, name, count, sla, colorIdx } = props;
  if (!width || !height || width < 4 || height < 4) return null;
  const bg = TOPIC_BLUES[colorIdx ?? 0];
  const isDark = (colorIdx ?? 0) < 5;
  const textFill = isDark ? '#ffffff' : '#1e3a8a';
  return (
    <g>
      <rect
        x={x + 1} y={y + 1}
        width={Math.max(0, width - 2)} height={Math.max(0, height - 2)}
        fill={bg} rx={4}
      />
      {width > 52 && height > 28 && (
        <text x={x + 9} y={y + 18} fill={textFill} fontSize={11} fontWeight={600} fontFamily={SFT} style={{ userSelect: 'none' }}>
          {name}
        </text>
      )}
      {width > 52 && height > 44 && (
        <text x={x + 9} y={y + 32} fill={textFill} fontSize={10} opacity={0.8} fontFamily={SFT} style={{ userSelect: 'none' }}>
          {count} tickets
        </text>
      )}
      {width > 52 && height > 58 && (
        <text x={x + 9} y={y + 46} fill={textFill} fontSize={10} opacity={0.7} fontFamily={SFT} style={{ userSelect: 'none' }}>
          {sla}% SLA
        </text>
      )}
    </g>
  );
}

function TopicVolumeCard() {
  const treemapData = TICKET_TOPICS.map((t, i) => ({
    name: t.name, count: t.count, sla: t.sla, colorIdx: i, value: t.count,
  }));

  return (
    <div style={{ ...CARD, display: 'flex', height: 480, overflow: 'hidden' }}>

      {/* ── Left: treemap ──────────────────────────────────────────────── */}
      <div style={{ flex: '0 0 60%', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px 8px', flexShrink: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', fontFamily: SFT, lineHeight: '20px', letterSpacing: '-0.32px', fontFeatureSettings: "'liga' off, 'clig' off", margin: '0 0 1px' }}>Ticket topics</p>
          <p style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>Volume by category · this month</p>
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: '0 16px 16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="value"
              aspectRatio={1.4}
              content={<TreemapContent />}
              isAnimationActive={false}
            />
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Right: sparkline rows ──────────────────────────────────────── */}
      <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px 8px', flexShrink: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', fontFamily: SFT, lineHeight: '20px', letterSpacing: '-0.32px', fontFeatureSettings: "'liga' off, 'clig' off", margin: '0 0 1px' }}>7-day trend</p>
          <p style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>Daily ticket volume per topic</p>
        </div>
        <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
          {TICKET_TOPICS.map((topic, i) => (
            <div key={topic.name} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              borderBottom: i < TICKET_TOPICS.length - 1 ? '1px solid var(--border)' : 'none',
              minHeight: 0,
            }}>
              <span style={{ width: 86, fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {topic.name}
              </span>
              <div style={{ flex: 1, minWidth: 0, height: 26 }}>
                <ResponsiveContainer width="100%" height={26}>
                  <AreaChart data={topic.spark.map((v, idx) => ({ i: idx, v }))} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                    <Area
                      type="monotone" dataKey="v"
                      stroke={TOPIC_BLUES[i]} fill={TOPIC_BLUES[i]}
                      fillOpacity={0.18} strokeWidth={1.5}
                      dot={false} isAnimationActive={false}
                    />
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

    </div>
  );
}

// ─── Queue dropdown ─────────────────────────────────────────────────────────────

function QueueDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  function handleBlur(e) { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); }
  const label = QUEUE_OPTIONS.find(o => o.id === value)?.label ?? 'All Queues';
  return (
    <div ref={ref} tabIndex="-1" onBlur={handleBlur} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--background-weak)'; }}
        style={{
          height: 30, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 12, fontFamily: SFT, fontWeight: 500, color: 'var(--text)',
          background: 'var(--background-weak)', border: '1px solid var(--border)',
          borderRadius: 6, cursor: 'pointer', transition: 'background 0.1s',
        }}>
        {label}<ChevronDownIcon />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: 'var(--background-weak)', border: '1px solid var(--border)',
          borderRadius: 8, boxShadow: 'var(--shadow-md)', zIndex: 30, minWidth: 150, paddingBlock: 4,
        }}>
          {QUEUE_OPTIONS.map(opt => (
            <button key={opt.id} type="button"
              onMouseDown={e => { e.preventDefault(); onChange(opt.id); setOpen(false); }}
              onMouseEnter={e => { if (opt.id !== value) e.currentTarget.style.background = 'var(--background-medium)'; }}
              onMouseLeave={e => { if (opt.id !== value) e.currentTarget.style.background = 'transparent'; }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '7px 14px',
                fontSize: 13, fontFamily: SFT,
                color: opt.id === value ? 'var(--text)' : 'var(--text-weak)',
                fontWeight: opt.id === value ? 500 : 400,
                background: opt.id === value ? 'var(--background-medium)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background 0.1s',
              }}
            >{opt.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Donut center label ────────────────────────────────────────────────────────

function DonutCenter({ viewBox, total }) {
  const { cx, cy } = viewBox;
  return (
    <text textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} y={cy - 7} fontSize="20" fontWeight="700" fill="#1E1F21" fontFamily={SFT}>{total}</tspan>
      <tspan x={cx} y={cy + 11} fontSize="10" fill="#9ea0a2" fontFamily={SFT}>tickets</tspan>
    </text>
  );
}

// ─── Automation Coverage card ──────────────────────────────────────────────────

function AutomationCoverageCard({ data }) {
  const pct = Math.round((data.aiResolved + data.ruleBased) / data.total * 100);
  return (
    <ChartCard title="Automation Coverage" subtitle="% tickets resolved by AI or rules">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <AiGradientIcon />
          <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>Automated Resolution</span>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', fontFamily: SFT }}>{pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'var(--background-strong)', overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--selected-background-strong)', borderRadius: 3, transition: 'width 0.4s' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[['AI-Resolved', data.aiResolved], ['Rule-Based', data.ruleBased]].map(([label, val]) => (
          <div key={label} style={{ background: 'var(--background-medium)', borderRadius: 6, padding: '10px 14px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 3px' }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', fontFamily: SFT, margin: 0, lineHeight: 1 }}>{val}</p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ─── Integrations Card (dashboard) ────────────────────────────────────────────

const CONNECTED_INTEGRATIONS = [
  { id: 'okta',  name: 'Okta'          },
  { id: 'ms365', name: 'Microsoft 365' },
];
const RECOMMENDED_INTEGRATIONS = [
  { id: 'workday', name: 'Workday', desc: 'Auto-provision accounts on hire — estimated 8 fewer tickets/week' },
  { id: 'slack',   name: 'Slack',   desc: 'Surface SLA alerts in team channels — reduce response lag by ~40 min' },
];

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
function WorkdayLogo({ size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#F7941D"/>
      <path d="M5 15L8 8l3 5 3-5 3 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function OktaLogo({ size = 28 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#007DC1"/>
      <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  );
}
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

const DASH_LOGO = {
  okta: <OktaLogo size={20} />, ms365: <Microsoft365Logo size={20} />,
  workday: <WorkdayLogo size={32} />, slack: <SlackLogo size={28} />,
};

function DashRecommendedTile({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div role="button" tabIndex={0} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? 'var(--background-medium)' : '#fff', borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', transition: 'background 0.1s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {DASH_LOGO[item.id]}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, lineHeight: '18px' }}>{item.name}</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '17px', fontFamily: SFT }}>{item.desc}</p>
    </div>
  );
}

function DashIntegrationsCard() {
  return (
    <div style={{ ...CARD, overflow: 'hidden' }}>
      <div style={{ padding: '20px 20px 18px' }}>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', fontFamily: SFT, lineHeight: '20px', letterSpacing: '-0.32px', fontFeatureSettings: "'liga' off, 'clig' off", margin: '0 0 10px' }}>Integrations</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
          <span style={{ fontFamily: SFT, fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>23pp</span>
          <span style={{ fontSize: 14, color: 'var(--text-weak)', fontFamily: SFT }}>of AI deflection driven by integrations</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>Connected</span>
          {CONNECTED_INTEGRATIONS.map(int => (
            <div key={int.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px 3px 4px', borderRadius: 20, background: 'var(--background-medium)', border: '1px solid var(--border)' }}>
              {DASH_LOGO[int.id]}
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', fontFamily: SFT }}>{int.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--Default-background-medium, #F2F3F4)', padding: '14px 20px 20px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontFamily: SFT, margin: '0 0 12px' }}>Recommended integrations</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {RECOMMENDED_INTEGRATIONS.map(item => <DashRecommendedTile key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Ticket Resolution by Type ─────────────────────────────────────────────────

const COL  = 'text-xs font-medium text-text-weak px-2 py-2 text-left whitespace-nowrap flex items-center';
const divStyle = { borderRight: '1px solid var(--border)' };

function TicketResolutionTable() {
  const rows = TICKET_RESOLUTION_BY_TYPE;
  return (
    <div style={{ ...CARD, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', fontFamily: SFT, lineHeight: '20px', letterSpacing: '-0.32px', fontFeatureSettings: "'liga' off, 'clig' off", margin: '0 0 3px' }}>Ticket Resolution by Type</p>
        <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>Detailed breakdown of resolution methods by ticket category</p>
      </div>

      <div style={{ padding: '0 24px' }}>
      {/* Column headers — no background */}
      <div className="flex items-center w-full" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className={COL} style={{ ...divStyle, flex: 1 }}>Ticket Type</div>
        <div className={`${COL} w-[110px] text-right`} style={divStyle}>Total</div>
        <div className={`${COL} w-[110px] text-right`} style={divStyle}>AI Self-Service</div>
        <div className={`${COL} w-[110px] text-right`} style={divStyle}>AI-Assisted</div>
        <div className={`${COL} w-[110px] text-right`} style={divStyle}>Human Only</div>
        <div className={`${COL} w-[110px] text-right`}>Avg Time</div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i}
          className="group flex items-stretch w-full bg-background-weak hover:bg-background-medium transition-colors"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="px-2 flex flex-col justify-center" style={{ flex: 1, ...divStyle, paddingTop: 8, paddingBottom: 8, minHeight: 52 }}>
            <p style={{ fontSize: 14, color: 'var(--text)', fontFamily: SFT, margin: 0, lineHeight: '22px' }}>{row.type}</p>
            {row.insight && (
              <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '2px 0 0', lineHeight: '18px' }}>{row.insight}</p>
            )}
          </div>
          <div className="flex items-center justify-end px-4 w-[110px]" style={divStyle}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.total}</span>
          </div>
          <div className="flex flex-col justify-center items-end px-4 w-[110px]" style={divStyle}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.aiSelf.count}</span>
            <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{row.aiSelf.pct}%</span>
          </div>
          <div className="flex flex-col justify-center items-end px-4 w-[110px]" style={divStyle}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.aiAssisted.count}</span>
            <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{row.aiAssisted.pct}%</span>
          </div>
          <div className="flex flex-col justify-center items-end px-4 w-[110px]" style={divStyle}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.humanOnly.count}</span>
            <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{row.humanOnly.pct}%</span>
          </div>
          <div className="flex flex-col justify-center items-end px-4 w-[110px]">
            <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: SFT, marginBottom: 4 }}>{row.avgTime}</span>
            <div style={{ height: 3, borderRadius: 2, background: 'var(--background-strong)', overflow: 'hidden', width: 56 }}>
              <div style={{ height: '100%', width: `${row.avgTimePct}%`, background: 'var(--selected-background-strong)', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

// ─── KB Performance ─────────────────────────────────────────────────────────────

const KB_INSIGHTS = [
  {
    id: 'kb-001',
    category: 'Content gap',
    impact: 'high',
    gap: 'No guidance on MFA re-enrollment after device replacement',
    ticketCount: 8,
    suggestion: 'Create article: MFA Device Re-enrollment After Hardware Replacement',
  },
  {
    id: 'kb-002',
    category: 'Action gap',
    impact: 'high',
    gap: 'Salesforce login article missing SSO troubleshooting steps — low deflect rate',
    ticketCount: 12,
    suggestion: 'Add SSO and MFA reset instructions to Salesforce Login Issues article',
  },
  {
    id: 'kb-003',
    category: 'Content gap',
    impact: 'medium',
    gap: 'VPN article screenshots outdated — reported in 12 recent tickets',
    ticketCount: 12,
    suggestion: 'Update VPN Setup screenshots for latest client version',
  },
];

const KB_CAT_STYLES = {
  'Content gap': { bg: 'var(--warning-background)', color: 'var(--warning-text)' },
  'Action gap':  { bg: 'var(--danger-background)',  color: 'var(--danger-text)'  },
};

function KBImpactPill({ impact }) {
  const styles = {
    high:   { bg: 'var(--danger-background)',  color: 'var(--danger-text)'  },
    medium: { bg: 'var(--warning-background)', color: 'var(--warning-text)' },
    low:    { bg: 'var(--background-medium)',  color: 'var(--text-weak)'    },
  }[impact] ?? { bg: 'var(--background-medium)', color: 'var(--text-weak)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 7px', borderRadius: 4, background: styles.bg, color: styles.color, flexShrink: 0 }}>
      {impact.charAt(0).toUpperCase() + impact.slice(1)} impact
    </span>
  );
}

function KBInsightRow({ insight, divider }) {
  const catStyle = KB_CAT_STYLES[insight.category] ?? { bg: 'var(--background-medium)', color: 'var(--text-weak)' };
  return (
    <div style={{ padding: '13px 0', borderBottom: divider ? '1px solid var(--border)' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 7px', borderRadius: 4, background: catStyle.bg, color: catStyle.color, flexShrink: 0 }}>
          {insight.category}
        </span>
        <KBImpactPill impact={insight.impact} />
        <span style={{ fontSize: 11, fontFamily: SFT, padding: '2px 7px', borderRadius: 4, background: 'var(--background-medium)', color: 'var(--text-disabled)' }}>
          {insight.ticketCount} tickets
        </span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--text)', fontFamily: SFT, margin: '0 0 4px', lineHeight: '22px', letterSpacing: '-0.15px' }}>{insight.gap}</p>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0, lineHeight: '18px' }}>{insight.suggestion}</p>
    </div>
  );
}

function KBPerformanceCard() {
  const kb = KB_PERFORMANCE;
  return (
    <div style={{ ...CARD, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', fontFamily: SFT, lineHeight: '20px', letterSpacing: '-0.32px', fontFeatureSettings: "'liga' off, 'clig' off", margin: '0 0 3px' }}>Knowledge Base Performance</p>
        <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>Article views, ticket deflections, and content gaps</p>
      </div>
      <div style={{ padding: '0 24px' }}>
        <div className="flex items-center w-full" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className={COL} style={{ ...divStyle, flex: 1 }}>Article</div>
          <div className={`${COL} w-[110px] text-right`} style={divStyle}>Views</div>
          <div className={`${COL} w-[110px] text-right`} style={divStyle}>Deflections</div>
          <div className={`${COL} w-[110px] text-right`}>Deflect %</div>
        </div>
        {kb.topArticles.map((a, i) => (
          <div key={i}
            className="group flex items-stretch w-full bg-background-weak hover:bg-background-medium transition-colors"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="px-4 flex items-center" style={{ flex: 1, ...divStyle, minHeight: 52 }}>
              <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: SFT }}>{a.title}</span>
            </div>
            <div className="flex items-center justify-end px-4 w-[110px]" style={divStyle}>
              <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: SFT }}>{a.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-end px-4 w-[110px]" style={divStyle}>
              <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: SFT }}>{a.deflections.toLocaleString()}</span>
            </div>
            <div className="flex flex-col justify-center items-end px-4 w-[110px]">
              <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, marginBottom: 3 }}>{a.pct}%</span>
              <div style={{ height: 3, borderRadius: 2, background: 'var(--background-strong)', overflow: 'hidden', width: 48 }}>
                <div style={{ height: '100%', width: `${a.pct}%`, background: 'var(--success-background-strong)', borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KBOptimizationsCard() {
  return (
    <div style={{ ...CARD, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--Default-text, #1E1F21)', fontFamily: SFT, lineHeight: '20px', letterSpacing: '-0.32px', fontFeatureSettings: "'liga' off, 'clig' off", margin: '0 0 3px' }}>KB Optimizations</p>
        <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>Suggested improvements to KB content</p>
      </div>
      <div style={{ padding: '0 24px' }}>
        {KB_INSIGHTS.map((insight, i) => (
          <KBInsightRow key={insight.id} insight={insight} divider={i < KB_INSIGHTS.length - 1} />
        ))}
      </div>
    </div>
  );
}

// ─── Team Tab ──────────────────────────────────────────────────────────────────

const CAPACITY = 40;
const PX_PER_DAY = 30;
const N_DAYS = TEAM_DATA.dates.length;
const CHART_W = (N_DAYS - 1) * PX_PER_DAY; // 39 * 30 = 1170

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
  return (count / CAPACITY) >= 0.85 ? 'danger' : 'normal';
}

const WL_THRESHOLD = CAPACITY * 0.85; // 34

function WorkloadTooltip({ active, payload, label, dates }) {
  if (!active || !payload?.length) return null;
  const idx = Math.round(Number(label));
  const date = dates?.[idx] ?? '';
  const base = payload.find(p => p.dataKey === 'base');
  if (!base) return null;
  return (
    <div style={{ ...CARD, padding: '8px 12px', boxShadow: 'var(--shadow-md)', fontFamily: SFT, fontSize: 12 }}>
      {date && <p style={{ color: 'var(--text-weak)', marginBottom: 4, fontSize: 11 }}>{date}</p>}
      <p style={{ color: 'var(--text)', margin: 0, fontWeight: 500 }}>
        {base.name}: {base.value} open
      </p>
    </div>
  );
}

function TeamKpiCard({ label, value }) {
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
      <p style={{ fontFamily: '"SF Pro Display"', fontSize: 48, fontWeight: 400, color: 'var(--neutrals-lm-text, var(--Default-text, #1E1F21))', lineHeight: '56px', letterSpacing: '0.35px', margin: 0, fontFeatureSettings: "'liga' off, 'clig' off" }}>{value}</p>
    </div>
  );
}

function AgentDropdown({ agents, selectedAgent, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  function handleBlur(e) { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); }
  const options = [{ id: null, label: 'All Agents' }, ...agents.map(a => ({ id: a.id, label: a.name }))];
  const label = options.find(o => o.id === selectedAgent)?.label ?? 'All Agents';
  return (
    <div ref={ref} tabIndex="-1" onBlur={handleBlur} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--background-weak)'; }}
        style={{
          height: 30, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 12, fontFamily: SFT, fontWeight: 500, color: 'var(--text)',
          background: 'var(--background-weak)', border: '1px solid var(--border)',
          borderRadius: 6, cursor: 'pointer', transition: 'background 0.1s',
        }}>
        {label}<ChevronDownIcon />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4,
          background: 'var(--background-weak)', border: '1px solid var(--border)',
          borderRadius: 8, boxShadow: 'var(--shadow-md)', zIndex: 30, minWidth: 180, paddingBlock: 4,
        }}>
          {options.map(opt => (
            <button key={opt.id ?? 'all'} type="button"
              onMouseDown={e => { e.preventDefault(); onChange(opt.id); setOpen(false); }}
              onMouseEnter={e => { if (opt.id !== selectedAgent) e.currentTarget.style.background = 'var(--background-medium)'; }}
              onMouseLeave={e => { if (opt.id !== selectedAgent) e.currentTarget.style.background = 'transparent'; }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '7px 14px',
                fontSize: 13, fontFamily: SFT,
                color: opt.id === selectedAgent ? 'var(--text)' : 'var(--text-weak)',
                fontWeight: opt.id === selectedAgent ? 500 : 400,
                background: opt.id === selectedAgent ? 'var(--background-medium)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background 0.1s',
              }}
            >{opt.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamTab() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { dates, agents, summary, todayIndex } = TEAM_DATA;
  const todayX = todayIndex * PX_PER_DAY;
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(0, todayX - 200);
    }
  }, []);
  const chartHeight = selectedAgent ? 200 : 80;
  const visibleAgents = selectedAgent ? agents.filter(a => a.id === selectedAgent) : agents;
  const selectedAgentData = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;

  const kpiCards = selectedAgentData
    ? [
        { label: 'Open Tickets',   value: String(selectedAgentData.daily[todayIndex]) },
        { label: 'CSAT Score',     value: `${selectedAgentData.csat.toFixed(1)} / 5` },
        { label: 'Avg Resolution', value: selectedAgentData.avgResolution },
        { label: 'SLA Health',     value: `${selectedAgentData.slaHealth}%` },
      ]
    : [
        { label: 'Total Open',    value: String(summary.totalOpen) },
        { label: 'Avg CSAT',      value: `${summary.avgCsat.toFixed(1)} / 5` },
        { label: 'SLA Breaches',  value: String(summary.slaBreaches) },
        { label: 'Resolved / wk', value: String(summary.resolvedThisWeek) },
      ];

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: 12 }}>
        <AgentDropdown agents={agents} selectedAgent={selectedAgent} onChange={setSelectedAgent} />
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 24 }}>
        {kpiCards.map((card, i) => <TeamKpiCard key={i} {...card} />)}
      </div>

      {/* Timeline block */}
      <div style={{ ...CARD, border: 'none', display: 'flex', overflow: 'hidden' }}>

        {/* Left column — agent names/badges (does not scroll) */}
        <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid var(--border)' }}>
          {/* Header cell matching date header height */}
          <div style={{
            height: 32, background: 'white',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 10px',
            fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT,
          }}>Agent</div>
          {/* Agent rows */}
          {visibleAgents.map((agent, i) => (
            <div key={agent.id} style={{
              height: chartHeight,
              borderBottom: i < visibleAgents.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', background: agent.color, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff',
              }}>
                {agent.initials}
              </div>
              <p style={{
                fontSize: 14, fontFamily: SFT, color: 'var(--text)', margin: 0,
                whiteSpace: 'nowrap', lineHeight: '22px', letterSpacing: '-0.15px',
              }}>{agent.name}</p>
            </div>
          ))}
        </div>

        {/* Right — horizontally scrollable chart area */}
        <div ref={scrollRef} style={{ flex: 1, overflowX: 'auto' }}>
          <div style={{ width: CHART_W, position: 'relative' }}>

            {/* Today vertical line spanning all rows */}
            <div style={{
              position: 'absolute', left: todayX, top: 0, bottom: 0,
              width: 1, background: 'var(--selected-background-strong)', opacity: 0.4,
              zIndex: 2, pointerEvents: 'none',
            }} />

            {/* Date header */}
            <div style={{
              height: 32, borderBottom: '1px solid var(--border)',
              background: 'white', position: 'relative',
            }}>
              {WEEK_STARTS.map(ws => (
                <span key={ws.label} style={{
                  position: 'absolute',
                  left: ws.index * PX_PER_DAY + 4,
                  top: '50%', transform: 'translateY(-50%)',
                  fontSize: 10, color: 'var(--text-weak)', fontFamily: SFT, whiteSpace: 'nowrap',
                }}>{ws.label}</span>
              ))}
              {/* Today label */}
              <span style={{
                position: 'absolute', left: todayX,
                top: '50%', transform: 'translateY(-50%) translateX(-50%)',
                fontSize: 10, fontWeight: 600,
                color: 'var(--selected-background-strong)', fontFamily: SFT,
                zIndex: 3, whiteSpace: 'nowrap',
              }}>Today</span>
            </div>

            {/* Agent chart rows */}
            {visibleAgents.map((agent, i) => (
              <div key={agent.id} style={{
                height: chartHeight,
                borderBottom: i < visibleAgents.length - 1 ? '1px solid var(--border)' : 'none',
                overflow: 'hidden',
              }}>
                <AreaChart
                  data={agent.daily.map((v, idx) => ({
                    idx,
                    base: v,
                    over: v > WL_THRESHOLD ? v : null,
                  }))}
                  width={CHART_W}
                  height={chartHeight}
                  margin={{ top: 8, right: 0, bottom: 8, left: 0 }}
                  syncId="wl"
                >
                  <YAxis domain={[0, CAPACITY]} hide />
                  <XAxis dataKey="idx" type="number" domain={[0, N_DAYS - 1]} hide />
                  {/* Grey base — full data */}
                  <Area
                    type="monotone" dataKey="base" name={agent.name}
                    stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.15}
                    strokeWidth={1.5} dot={false}
                    activeDot={{ r: 3, fill: '#9CA3AF', strokeWidth: 0 }}
                  />
                  {/* Red overload — full bar from bottom on over-capacity days */}
                  <Area
                    type="monotone" dataKey="over"
                    stroke="#D43D5D" fill="#D43D5D" fillOpacity={0.3}
                    strokeWidth={1.5} dot={false} connectNulls={false}
                    activeDot={false}
                  />
                  <RechartsTooltip
                    content={(props) => <WorkloadTooltip {...props} dates={dates} />}
                  />
                </AreaChart>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

// ─── LeaderboardTab ────────────────────────────────────────────────────────────

const LEADERBOARD_AGENTS = [
  { id: 'me',  name: 'Sarah Mitchell', initials: 'SM', color: '#c0856a', resolved: 12, csat: 4.6, fcr: 87, mtta: 1.8, sla: 94, isMe: true  },
  { id: 'a3',  name: 'Priya Nair',     initials: 'PN', color: '#5DA182', resolved: 15, csat: 4.5, fcr: 85, mtta: 2.0, sla: 92, isMe: false },
  { id: 'a2',  name: 'Jamie Chen',     initials: 'JC', color: '#4273D1', resolved: 11, csat: 4.4, fcr: 83, mtta: 2.2, sla: 91, isMe: false },
  { id: 'a1',  name: 'Marcus Rivera',  initials: 'MR', color: '#D43D5D', resolved: 14, csat: 4.3, fcr: 80, mtta: 2.3, sla: 89, isMe: false },
  { id: 'a4',  name: 'Devon Walsh',    initials: 'DW', color: '#7C5EA8', resolved: 10, csat: 4.2, fcr: 79, mtta: 2.5, sla: 88, isMe: false },
  { id: 'a5',  name: 'Sana Okafor',   initials: 'SO', color: '#7C5EA8', resolved:  9, csat: 4.0, fcr: 76, mtta: 2.8, sla: 85, isMe: false },
  { id: 'a6',  name: 'Tom Reyes',      initials: 'TR', color: '#ECBD85', resolved:  8, csat: 3.8, fcr: 72, mtta: 3.1, sla: 81, isMe: false },
];

const LB_COLS = [
  { key: 'resolved', label: 'Resolved',    fmt: v => v,          higherBetter: true  },
  { key: 'csat',     label: 'CSAT',         fmt: v => v.toFixed(1), higherBetter: true  },
  { key: 'fcr',      label: 'FCR %',        fmt: v => `${v}%`,    higherBetter: true  },
  { key: 'mtta',     label: 'MTTA',         fmt: v => `${v}h`,    higherBetter: false },
  { key: 'sla',      label: 'SLA compliance', fmt: v => `${v}%`,  higherBetter: true  },
];

const RANK_STYLE = {
  1: { bg: '#FEF9C3', color: '#854D0E', label: '#1' },
  2: { bg: '#F1F5F9', color: '#475569', label: '#2' },
  3: { bg: '#FEF3C7', color: '#92400E', label: '#3' },
};

const LB_PERIODS = ['This week', 'This month', 'Last quarter'];

function LeaderboardTab() {
  const [sortKey, setSortKey] = useState('csat');
  const [sortDir, setSortDir] = useState('desc');
  const [period, setPeriod] = useState('This week');

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      const col = LB_COLS.find(c => c.key === key);
      setSortDir(col?.higherBetter ? 'desc' : 'asc');
    }
  }

  const sorted = [...LEADERBOARD_AGENTS].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDir === 'desc' ? -diff : diff;
  });

  return (
    <div>
      {/* Sub-header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#1E1F21', fontFamily: SFT, margin: '0 0 2px' }}>Team performance</p>
          <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>Ranked by {LB_COLS.find(c => c.key === sortKey)?.label ?? sortKey} · click any column to re-sort</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--background-medium)', borderRadius: 8, padding: 3, gap: 2 }}>
          {LB_PERIODS.map(p => (
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

      {/* Table */}
      <div style={{ background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px 80px 80px 120px',
          padding: '0 20px', height: 36, alignItems: 'center',
          borderBottom: '1px solid var(--border)', background: 'white',
        }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}>#</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}>Agent</span>
          {LB_COLS.map(col => (
            <button key={col.key} type="button" onClick={() => handleSort(col.key)} style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 11, fontWeight: sortKey === col.key ? 600 : 500,
              color: sortKey === col.key ? 'var(--text)' : 'var(--text-weak)',
              fontFamily: SFT, textAlign: 'left', whiteSpace: 'nowrap',
            }}>
              {col.label}
              {sortKey === col.key && (
                <svg viewBox="0 0 8 8" width="8" height="8" fill="currentColor">
                  {sortDir === 'desc'
                    ? <path d="M4 6L1 2h6L4 6z"/>
                    : <path d="M4 2l3 4H1L4 2z"/>}
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Rows */}
        {sorted.map((agent, i) => {
          const rank = i + 1;
          const rs = RANK_STYLE[rank];
          return (
            <LbRow key={agent.id} agent={agent} rank={rank} rankStyle={rs} last={i === sorted.length - 1} />
          );
        })}
      </div>

      {/* Team averages footer */}
      <div style={{ marginTop: 16, padding: '12px 20px', background: 'var(--background-medium)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT, minWidth: 80 }}>Team avg</span>
        {LB_COLS.map(col => {
          const avg = LEADERBOARD_AGENTS.reduce((s, a) => s + a[col.key], 0) / LEADERBOARD_AGENTS.length;
          return (
            <span key={col.key} style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, minWidth: col.key === 'sla' ? 120 : 80 }}>
              {col.fmt(Math.round(avg * 10) / 10)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function LbRow({ agent, rank, rankStyle, last }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px 80px 80px 120px',
        padding: '0 20px', height: 52, alignItems: 'center',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        background: agent.isMe
          ? 'rgba(71, 134, 255, 0.06)'
          : hov ? 'var(--background-medium)' : 'transparent',
        transition: 'background 0.1s',
        cursor: 'pointer',
      }}
    >
      {/* Rank */}
      <div>
        {rankStyle ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 20, borderRadius: 4,
            background: rankStyle.bg, color: rankStyle.color,
            fontSize: 11, fontWeight: 700, fontFamily: SFT,
          }}>
            {rankStyle.label}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>#{rank}</span>
        )}
      </div>

      {/* Agent */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: agent.color, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, fontFamily: SFT, flexShrink: 0,
        }}>
          {agent.initials}
        </div>
        <div>
          <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT, fontWeight: agent.isMe ? 500 : 400 }}>
            {agent.name}
          </span>
          {agent.isMe && (
            <span style={{ fontSize: 10, color: 'var(--selected-background-strong)', fontFamily: SFT, marginLeft: 6, fontWeight: 500 }}>you</span>
          )}
        </div>
      </div>

      {/* Metrics */}
      {LB_COLS.map(col => (
        <span key={col.key} style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT }}>
          {col.fmt(agent[col.key])}
        </span>
      ))}
    </div>
  );
}

// ─── DashboardView ─────────────────────────────────────────────────────────────

const DASH_TABS = ['Overview', 'Team', 'Leaderboard'];

export default function DashboardView({ initialTab = 'Overview', hideTabs = false }) {
  const [queueId, setQueueId] = useState('all');
  const [activeTab, setActiveTab] = useState(initialTab);

  const data = DASHBOARD_DATA[queueId];
  const total = data.ticketsByCategory.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--background-weak)' }}>
      <div style={{ padding: '32px 32px 64px' }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: '#1E1F21', margin: '0 0 3px' }}>
              {hideTabs ? 'Team workload' : 'Dashboard'}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>
              {hideTabs ? 'Live capacity and workload across your team' : 'Real-time visibility into IT operations and business impact'}
            </p>
          </div>
          {!hideTabs && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <QueueDropdown value={queueId} onChange={setQueueId} />
              <button type="button" style={{
                height: 30, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 400, fontFamily: SFT,
                background: 'var(--background-weak)', color: 'var(--text-weak)',
                border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--background-weak)'; e.currentTarget.style.color = 'var(--text-weak)'; }}
              >
                <AiGradientIcon />Ask
              </button>
              <button type="button" style={{
                height: 30, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 400, fontFamily: SFT,
                background: 'var(--background-weak)', color: 'var(--text-weak)',
                border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--background-weak)'; e.currentTarget.style.color = 'var(--text-weak)'; }}
              >
                <FilterIcon />Filter Graphs
              </button>
            </div>
          )}
        </div>

        {/* ── Tab bar (hidden in workload mode) ───────────────────────────── */}
        {!hideTabs && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {DASH_TABS.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              onMouseEnter={e => { if (tab !== activeTab) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (tab !== activeTab) e.currentTarget.style.color = 'var(--text-weak)'; }}
              style={{
                padding: '7px 16px 8px',
                fontSize: 13, fontFamily: SFT,
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? 'var(--text)' : 'var(--text-weak)',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--text)' : '2px solid transparent',
                marginBottom: -1, transition: 'color 0.1s',
              }}>{tab}</button>
          ))}
        </div>
        )}

        {/* ── Overview Tab ─────────────────────────────────────────────────── */}
        {!hideTabs && activeTab === 'Overview' && (
          <>
            {/* KPI strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24, marginBottom: 24 }}>
              {data.kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
            </div>

            {/* Row 1 — Topic volume (full-width) */}
            <div style={{ marginBottom: 24 }}>
              <TopicVolumeCard />
            </div>

            {/* Row 2 — Backlog trend + Integrations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, marginBottom: 24 }}>
              <ChartCard title="Ticket Backlog Trend" subtitle="6-month trend">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.backlogTrend} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
                    <YAxis tick={TICK} axisLine={false} tickLine={false} width={38} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="count" name="Backlog" stroke="var(--selected-background-strong)"
                      strokeWidth={2} dot={{ r: 3, fill: 'var(--selected-background-strong)', strokeWidth: 0 }} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <DashIntegrationsCard />
            </div>

            {/* Row 3 — Ticket Resolution by Type */}
            <div style={{ marginBottom: 24 }}><TicketResolutionTable /></div>

            {/* Row 4 — KB Performance + KB Optimizations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <KBPerformanceCard />
              <KBOptimizationsCard />
            </div>
          </>
        )}

        {/* ── Team Tab ──────────────────────────────────────────────────────── */}
        {(hideTabs || activeTab === 'Team') && <TeamTab />}

        {/* ── Leaderboard Tab ───────────────────────────────────────────────── */}
        {!hideTabs && activeTab === 'Leaderboard' && <LeaderboardTab />}

      </div>
    </div>
  );
}
