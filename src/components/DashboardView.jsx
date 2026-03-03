import { useState, useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Label,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
} from 'recharts';
import { DASHBOARD_DATA, QUEUE_OPTIONS, TICKET_RESOLUTION_BY_TYPE, KB_PERFORMANCE } from '../data/dashboard';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
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
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, margin: '0 0 2px' }}>{title}</p>
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

// ─── KPI Card (no icon) ────────────────────────────────────────────────────────

function KpiCard({ label, value, trend, trendGood }) {
  const pillBg    = trendGood ? 'var(--success-background)'  : 'var(--danger-background)';
  const pillColor = trendGood ? 'var(--success-text)'         : 'var(--danger-text)';
  return (
    <div style={{ ...CARD, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, lineHeight: '18px' }}>{label}</span>
        {trendGood
          ? <TrendUp color="var(--success-background-strong)" size={11} />
          : <TrendDown color="var(--danger-background-strong)" size={11} />
        }
      </div>
      <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: SFT, lineHeight: 1, margin: '0 0 14px', letterSpacing: '-0.5px' }}>{value}</p>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 7px', borderRadius: 99,
        fontSize: 11, fontWeight: 500, fontFamily: SFT,
        background: pillBg, color: pillColor, alignSelf: 'flex-start',
      }}>
        {trendGood ? <TrendUp color={pillColor} size={9} /> : <TrendDown color={pillColor} size={9} />}
        {trend}
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
      <button type="button" onClick={() => setOpen(o => !o)} style={{
        height: 30, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 12, fontFamily: SFT, fontWeight: 500, color: 'var(--text)',
        background: 'var(--background-weak)', border: '1px solid var(--border)',
        borderRadius: 6, cursor: 'pointer',
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
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '7px 14px',
                fontSize: 13, fontFamily: SFT,
                color: opt.id === value ? 'var(--text)' : 'var(--text-weak)',
                fontWeight: opt.id === value ? 500 : 400,
                background: opt.id === value ? 'var(--background-medium)' : 'transparent',
                border: 'none', cursor: 'pointer',
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

// ─── Ticket Resolution by Type ─────────────────────────────────────────────────

const COL  = 'text-xs font-medium text-text-weak px-4 py-3 text-left whitespace-nowrap';
const DIV  = { borderRight: '1px solid var(--border)' };

function TicketResolutionTable() {
  const rows = TICKET_RESOLUTION_BY_TYPE;
  return (
    <div style={{ marginTop: 28 }}>
      {/* Section heading */}
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, margin: '0 0 3px' }}>Ticket Resolution by Type</p>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 12px' }}>Detailed breakdown of resolution methods by ticket category</p>

      {/* Column header */}
      <div className="flex items-center w-full bg-background-medium"
        style={{ border: '1px solid var(--border)', borderRadius: '8px 8px 0 0' }}>
        <div className={COL} style={{ ...DIV, flex: 1 }}>Ticket Type</div>
        <div className={`${COL} w-16 text-right`} style={DIV}>Total</div>
        <div className={`${COL} w-[116px] text-right`} style={DIV}>AI Self-Service</div>
        <div className={`${COL} w-[104px] text-right`} style={DIV}>AI-Assisted</div>
        <div className={`${COL} w-24 text-right`} style={DIV}>Human Only</div>
        <div className={`${COL} w-[116px] text-right`} style={DIV}>Avg Time</div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i}
          className="group flex items-stretch w-full bg-background-weak hover:bg-background-medium transition-colors"
          style={{
            borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)',
            borderRadius: i === rows.length - 1 ? '0 0 8px 8px' : 0,
          }}>
          {/* Ticket Type */}
          <div className="px-4 flex flex-col justify-center" style={{ flex: 1, ...DIV, paddingTop: 10, paddingBottom: 10, minHeight: 56 }}>
            <p style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT, margin: 0, lineHeight: '20px' }}>{row.type}</p>
            {row.insight && (
              <p style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, margin: '2px 0 0', lineHeight: '15px' }}>{row.insight}</p>
            )}
          </div>
          {/* Total */}
          <div className="flex items-center justify-end px-4 w-16" style={DIV}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.total}</span>
          </div>
          {/* AI Self-Service */}
          <div className="flex flex-col justify-center items-end px-4 w-[116px]" style={DIV}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.aiSelf.count}</span>
            <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>{row.aiSelf.pct}%</span>
          </div>
          {/* AI-Assisted */}
          <div className="flex flex-col justify-center items-end px-4 w-[104px]" style={DIV}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.aiAssisted.count}</span>
            <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>{row.aiAssisted.pct}%</span>
          </div>
          {/* Human Only */}
          <div className="flex flex-col justify-center items-end px-4 w-24" style={DIV}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{row.humanOnly.count}</span>
            <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>{row.humanOnly.pct}%</span>
          </div>
          {/* Avg Time */}
          <div className="flex flex-col justify-center items-end px-4 w-[116px]" style={DIV}>
            <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT, marginBottom: 4 }}>{row.avgTime}</span>
            <div style={{ height: 3, borderRadius: 2, background: 'var(--background-strong)', overflow: 'hidden', width: 56 }}>
              <div style={{ height: '100%', width: `${row.avgTimePct}%`, background: 'var(--selected-background-strong)', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

// ─── KB Performance ─────────────────────────────────────────────────────────────

function KBPerformanceCard() {
  const kb = KB_PERFORMANCE;
  return (
    <div style={{ marginTop: 28 }}>
      {/* Section heading */}
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, margin: '0 0 3px' }}>Knowledge Base Performance</p>
      <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 12px' }}>Article views, ticket deflections, and content gaps</p>

      {/* Column header */}
      <div className="flex items-center w-full bg-background-medium"
        style={{ border: '1px solid var(--border)', borderRadius: '8px 8px 0 0' }}>
        <div className={COL} style={{ ...DIV, flex: 1 }}>Article</div>
        <div className={`${COL} w-20 text-right`} style={DIV}>Views</div>
        <div className={`${COL} w-[110px] text-right`} style={DIV}>Deflections</div>
        <div className={`${COL} w-24 text-right`} style={DIV}>Deflect %</div>
      </div>

      {/* Article rows */}
      {kb.topArticles.map((a, i) => (
        <div key={i}
          className="group flex items-stretch w-full bg-background-weak hover:bg-background-medium transition-colors"
          style={{ borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
          {/* Article */}
          <div className="px-4 flex items-center" style={{ flex: 1, ...DIV, minHeight: 52 }}>
            <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT }}>{a.title}</span>
          </div>
          {/* Views */}
          <div className="flex items-center justify-end px-4 w-20" style={DIV}>
            <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT }}>{a.views.toLocaleString()}</span>
          </div>
          {/* Deflections */}
          <div className="flex items-center justify-end px-4 w-[110px]" style={DIV}>
            <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT }}>{a.deflections.toLocaleString()}</span>
          </div>
          {/* Deflect % */}
          <div className="flex flex-col justify-center items-end px-4 w-24" style={DIV}>
            <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, marginBottom: 3 }}>{a.pct}%</span>
            <div style={{ height: 3, borderRadius: 2, background: 'var(--background-strong)', overflow: 'hidden', width: 48 }}>
              <div style={{ height: '100%', width: `${a.pct}%`, background: 'var(--success-background-strong)', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      ))}

      {/* Search gaps footer */}
      <div className="bg-background-weak"
        style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '11px 16px 13px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, margin: '0 0 7px' }}>Search gaps — top queries with no KB match</p>
        <div className="flex flex-wrap gap-2">
          {kb.searchGaps.map(g => (
            <span key={g.query} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 9px', borderRadius: 99, fontSize: 11, fontFamily: SFT,
              background: 'var(--background-medium)', border: '1px solid var(--border)', color: 'var(--text-weak)',
            }}>
              "{g.query}"
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--danger-text)' }}>{g.count}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DashboardView ─────────────────────────────────────────────────────────────

export default function DashboardView() {
  const [queueId, setQueueId] = useState('all');

  const data = DASHBOARD_DATA[queueId];
  const total = data.ticketsByCategory.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--background-weak)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 40px 64px' }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', fontFamily: SFT, margin: '0 0 3px', letterSpacing: '-0.3px' }}>Dashboard</h1>
            <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>Real-time visibility into IT operations and business impact</p>
          </div>
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
        </div>

        {/* ── KPI strip ───────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginBottom: 24 }}>
          {data.kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
        </div>

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginBottom: 14 }}>

              {/* Donut */}
              <ChartCard title="Tickets by Category" subtitle="Current month distribution">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flexShrink: 0 }}>
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie data={data.ticketsByCategory} cx="50%" cy="50%" innerRadius={52} outerRadius={82}
                          paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                          {data.ticketsByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                          <Label position="center" content={<DonutCenter total={total} />} />
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {data.ticketsByCategory.map(item => (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{item.name}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{item.value}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, background: 'var(--border)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}>Total</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: SFT }}>{total}</span>
                    </div>
                  </div>
                </div>
              </ChartCard>

              {/* Line */}
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
            </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
              <AutomationCoverageCard data={data.automationCoverage} />
              <ChartCard title="Weekly Ticket Volume" subtitle="Deflected vs resolved">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.weeklyVolume} margin={{ top: 4, right: 8, bottom: 0, left: -16 }} barCategoryGap="32%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" tick={TICK} axisLine={false} tickLine={false} />
                    <YAxis tick={TICK} axisLine={false} tickLine={false} width={38} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="Deflected" stackId="a" fill="var(--success-background-strong)" />
                    <Bar dataKey="Resolved"  stackId="a" fill="var(--selected-background-strong)" radius={[4, 4, 0, 0]} />
                    <Legend verticalAlign="bottom" height={26} iconType="circle" iconSize={6}
                      wrapperStyle={{ fontSize: 11, fontFamily: SFT, color: '#9ea0a2', paddingTop: 6 }} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row 3 — Ticket Resolution by Type */}
            <TicketResolutionTable />

            {/* Row 4 — KB Performance */}
            <KBPerformanceCard />

      </div>
    </div>
  );
}
