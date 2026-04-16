import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RECOMMENDATIONS, RECOMMENDATION_CATEGORIES, RECOMMENDATIONS_SUMMARY } from '../data/recommendations';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ─── Priority badge ────────────────────────────────────────────────────────────
function PriorityDot({ priority }) {
  const color = priority === 'High' ? 'var(--danger-text)' : priority === 'Medium' ? 'var(--warning-text)' : 'var(--text-weak)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, color, fontFamily: SFT }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
      {priority} priority
    </span>
  );
}

// ─── Category chip ─────────────────────────────────────────────────────────────
function CategoryChip({ category }) {
  const cfg = RECOMMENDATION_CATEGORIES[category] ?? { label: category, bg: 'var(--background-medium)', color: 'var(--text-weak)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 500, fontFamily: SFT,
      background: cfg.bg, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
}

// ─── Confidence pill ───────────────────────────────────────────────────────────
function ConfidencePill({ value }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20,
      fontSize: 11, fontWeight: 500, fontFamily: SFT,
      background: 'rgba(90,143,107,0.1)', color: '#2e7d32',
    }}>
      <svg viewBox="0 0 10 10" width="9" height="9" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="#2e7d32" strokeWidth="1.2"/>
        <path d="M3.2 5l1.2 1.2L6.8 3.5" stroke="#2e7d32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {value}% confidence
    </span>
  );
}

// ─── Effort badge ──────────────────────────────────────────────────────────────
function EffortBadge({ label, level }) {
  const colors = {
    low:    { bg: 'rgba(90,143,107,0.08)', color: '#2e7d32' },
    medium: { bg: 'var(--warning-background)', color: 'var(--warning-text)' },
    high:   { bg: 'var(--danger-background)', color: 'var(--danger-text)' },
  };
  const c = colors[level] ?? colors.medium;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 500, fontFamily: SFT,
      background: c.bg, color: c.color,
    }}>
      Effort: {label}
    </span>
  );
}

// ─── Impact metric ─────────────────────────────────────────────────────────────
function Metric({ value, label, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 28, fontWeight: 400, fontFamily: SFD, lineHeight: '32px', color: 'var(--text)', letterSpacing: 0 }}>
        {value}
      </span>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT, lineHeight: '14px' }}>{label}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>{sub}</span>}
    </div>
  );
}

// ─── Agent quote callout ───────────────────────────────────────────────────────
function AgentQuote({ quote }) {
  return (
    <div style={{
      background: 'var(--background-weak)',
      border: '1px solid var(--border)',
      borderLeft: '3px solid var(--border-strong)',
      borderRadius: '0 6px 6px 0',
      padding: '10px 14px',
    }}>
      <p style={{
        fontSize: 12.5, lineHeight: '18px', color: 'var(--text)',
        fontFamily: SFT, margin: 0, fontStyle: 'italic',
      }}>
        "{quote.text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-weak)', fontFamily: SFT }}>{quote.author}</span>
        {quote.ticket !== 'System' && (
          <span style={{
            fontSize: 11, color: 'var(--selected-text)', fontFamily: SFT,
            background: 'var(--selected-background)', padding: '1px 6px', borderRadius: 4,
          }}>
            {quote.ticket}
          </span>
        )}
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>{quote.time}</span>
      </div>
    </div>
  );
}

// ─── Source ticket tag ─────────────────────────────────────────────────────────
function TicketTag({ ticket, onClick }) {
  const statusColor = {
    'Resolved': 'var(--success-text)',
    'Closed': 'var(--text-weak)',
    'AI Deflected': 'var(--selected-text)',
    'In Progress': 'var(--warning-text)',
    'Investigating': 'var(--warning-text)',
    'On hold': 'var(--text-weak)',
    'Not started': 'var(--text-weak)',
  }[ticket.status] ?? 'var(--text-weak)';

  return (
    <button
      onClick={() => onClick(ticket.id)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 6,
        border: '1px solid var(--border)',
        background: 'var(--background-weak)',
        cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--background-weak)'}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--selected-text)', fontFamily: SFT }}>{ticket.id}</span>
      <span style={{ fontSize: 11, color: 'var(--text)', fontFamily: SFT, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.name}</span>
      <span style={{ fontSize: 10, color: statusColor, fontFamily: SFT, marginLeft: 2, flexShrink: 0 }}>{ticket.status}</span>
    </button>
  );
}

// ─── Action button ─────────────────────────────────────────────────────────────
function ActionButton({ action, dismissed }) {
  const [done, setDone] = useState(false);
  if (done) return (
    <span style={{ fontSize: 12, color: 'var(--success-text)', fontFamily: SFT, padding: '6px 0' }}>✓ Done</span>
  );
  if (action.type === 'dismiss') return (
    <button
      onClick={() => setDone(true)}
      style={{
        padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)',
        background: 'transparent', cursor: 'pointer',
        fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT,
      }}
    >
      {action.label}
    </button>
  );
  return (
    <button
      onClick={() => setDone(true)}
      style={{
        padding: '6px 14px', borderRadius: 6,
        border: action.primary ? 'none' : '1px solid var(--border)',
        background: action.primary ? 'var(--selected-text)' : 'var(--background-weak)',
        cursor: 'pointer',
        fontSize: 12, fontWeight: 500,
        color: action.primary ? '#fff' : 'var(--text)',
        fontFamily: SFT,
        transition: 'opacity 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {action.label}
    </button>
  );
}

// ─── Recommendation card ───────────────────────────────────────────────────────
function RecommendationCard({ rec, onTicketClick, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.09)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
    >
      {/* Card header */}
      <div style={{ padding: '20px 24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%', background: 'var(--background-medium)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, color: 'var(--text-weak)', fontFamily: SFT, flexShrink: 0,
            }}>{index + 1}</span>
            <CategoryChip category={rec.category} />
            <PriorityDot priority={rec.priority} />
            <ConfidencePill value={rec.confidence} />
          </div>
          <EffortBadge label={rec.impact.effortLabel} level={rec.impact.effortLevel} />
        </div>

        <h3 style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text)',
          fontFamily: SFT, margin: '0 0 12px', lineHeight: '20px',
        }}>
          {rec.title}
        </h3>

        {/* Impact metrics row */}
        <div style={{
          display: 'flex', alignItems: 'stretch', gap: 0,
          background: 'var(--background-weak)', borderRadius: 8,
          border: '1px solid var(--border)',
          overflow: 'hidden', marginBottom: 16,
        }}>
          {rec.impact.ticketsPerMonth != null && (
            <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
              <Metric value={rec.impact.ticketsPerMonth} label="tickets/mo eliminated" />
            </div>
          )}
          {rec.impact.hoursSaved != null && (
            <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
              <Metric value={`${rec.impact.hoursSaved}h`} label="agent hours saved/mo" />
            </div>
          )}
          {rec.impact.costSaved && (
            <div style={{ flex: 1, padding: '12px 16px' }}>
              <Metric value={rec.impact.costSaved} label="estimated savings" />
            </div>
          )}
          {rec.impact.ticketsPerMonth == null && rec.impact.hoursSaved == null && (
            <div style={{ flex: 1, padding: '12px 16px' }}>
              <Metric value="4" label="tickets currently breaching SLA" />
            </div>
          )}
        </div>

        {/* AI summary */}
        <p style={{ fontSize: 13, lineHeight: '19px', color: 'var(--text)', fontFamily: SFT, margin: '0 0 0' }}>
          {rec.aiSummary}
        </p>
      </div>

      {/* Expandable detail section */}
      {expanded && (
        <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          {/* Additional analysis */}
          <p style={{ fontSize: 13, lineHeight: '19px', color: 'var(--text-weak)', fontFamily: SFT, margin: '0 0 16px' }}>
            {rec.detail}
          </p>

          {/* Agent quotes */}
          {rec.agentQuotes?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', fontFamily: SFT, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                From the tickets
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rec.agentQuotes.map((q, i) => <AgentQuote key={i} quote={q} />)}
              </div>
            </div>
          )}

          {/* Source tickets */}
          {rec.sourceTickets?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', fontFamily: SFT, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
                Source tickets ({rec.sourceTickets.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {rec.sourceTickets.map(t => (
                  <TicketTag key={t.id} ticket={t} onClick={onTicketClick} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--background-weak)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {rec.actions.map((a, i) => <ActionButton key={i} action={a} />)}
        </div>
        <button
          onClick={() => setExpanded(x => !x)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 6,
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
            color: 'var(--text-weak)', fontFamily: SFT,
          }}
        >
          {expanded ? 'Show less' : `See analysis & ${rec.sourceTickets.length} tickets`}
          <svg
            viewBox="0 0 10 6" width="9" height="5"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          >
            <path d="M1 1l4 4 4-4"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Filter bar ────────────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'all',            label: 'All recommendations' },
  { id: 'kb_gap',         label: 'KB gaps' },
  { id: 'automation',     label: 'Automation' },
  { id: 'process',        label: 'Process gaps' },
  { id: 'routing',        label: 'Routing' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'workload',       label: 'Workload' },
];

// ─── Hero summary bar ──────────────────────────────────────────────────────────
function HeroBar({ summary }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '20px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 24,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      marginBottom: 24,
    }}>
      {/* Left: headline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 4,
            background: 'rgba(90,143,107,0.1)', color: '#2e7d32',
            fontSize: 11, fontWeight: 600, fontFamily: SFT,
          }}>
            <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="#2e7d32" strokeWidth="1.3"/>
              <path d="M3 5l1.5 1.5L7.5 3" stroke="#2e7d32" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            AI analyzed {summary.totalOpportunities * 4}+ tickets
          </span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', fontFamily: SFD, margin: 0, lineHeight: '24px' }}>
          {summary.totalOpportunities} recommendations identified
        </h2>
        <p style={{ fontSize: 12.5, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>
          {summary.highPriority} high priority · {summary.lowEffort} low effort · updated today
        </p>
      </div>

      {/* Right: impact numbers */}
      <div style={{ display: 'flex', gap: 32, flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 400, fontFamily: SFD, color: 'var(--text)', lineHeight: '40px', letterSpacing: '0.3px' }}>
            {summary.ticketsEliminatedPerMonth}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, marginTop: 2 }}>tickets/mo<br/>eliminatable</div>
        </div>
        <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 400, fontFamily: SFD, color: 'var(--text)', lineHeight: '40px', letterSpacing: '0.3px' }}>
            {summary.hoursSavedPerMonth}h
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, marginTop: 2 }}>agent hours<br/>saved/mo</div>
        </div>
        <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 400, fontFamily: SFD, color: '#2e7d32', lineHeight: '40px', letterSpacing: '0.3px' }}>
            ${(summary.hoursSavedPerMonth * 80).toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, marginTop: 2 }}>est. monthly<br/>savings</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ─────────────────────────────────────────────────────────────────
export default function RecommendationsView({ onNavigateToTicket }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? RECOMMENDATIONS
    : RECOMMENDATIONS.filter(r => r.category === activeFilter);

  const handleTicketClick = (ticketId) => {
    if (onNavigateToTicket) onNavigateToTicket(ticketId);
    else navigate(`/tickets/${ticketId}`);
  };

  return (
    <div style={{ padding: '32px 32px 64px', overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', fontFamily: SFD, margin: 0 }}>
            AI Recommendations
          </h1>
          <span style={{
            padding: '2px 8px', borderRadius: 4,
            background: 'var(--background-medium)', color: 'var(--text-weak)',
            fontSize: 11, fontWeight: 500, fontFamily: SFT,
          }}>
            {RECOMMENDATIONS.length}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT, margin: 0 }}>
          Patterns detected across your ticket history. Each recommendation includes source evidence and a suggested action.
        </p>
      </div>

      {/* Hero summary */}
      <HeroBar summary={RECOMMENDATIONS_SUMMARY} />

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: '5px 12px', borderRadius: 20,
              border: '1px solid ' + (activeFilter === f.id ? 'var(--selected-text)' : 'var(--border)'),
              background: activeFilter === f.id ? 'var(--selected-background)' : 'transparent',
              color: activeFilter === f.id ? 'var(--selected-text)' : 'var(--text-weak)',
              fontSize: 12, fontWeight: 500, fontFamily: SFT,
              cursor: 'pointer', transition: 'all 0.1s',
            }}
          >
            {f.label}
            {f.id !== 'all' && (
              <span style={{ marginLeft: 5, opacity: 0.6 }}>
                {RECOMMENDATIONS.filter(r => r.category === f.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((rec, i) => (
          <RecommendationCard
            key={rec.id}
            rec={rec}
            index={RECOMMENDATIONS.indexOf(rec)}
            onTicketClick={handleTicketClick}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          color: 'var(--text-weak)', fontSize: 14, fontFamily: SFT,
        }}>
          No recommendations in this category.
        </div>
      )}
    </div>
  );
}
