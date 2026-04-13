import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OPTIMIZE_GAPS } from '../data/optimize';
import { KB_LEARNINGS, KB_ARTICLES } from '../data/knowledgeBase';

// ─── Category config ───────────────────────────────────────────────────────────

export const CATEGORY_CONFIG = {
  content: { label: 'Content', bg: 'var(--selected-background)',  color: 'var(--selected-text)'  },
  action:  { label: 'Action',  bg: 'var(--warning-background)',   color: 'var(--warning-text)'   },
  data:    { label: 'Data',    bg: 'var(--background-medium)',    color: 'var(--text-weak)'      },
  cx:      { label: 'CX',     bg: 'var(--danger-background)',    color: 'var(--danger-text)'    },
};

// ─── Priority ranking — ROI score = hoursSaved / effortHours ──────────────────

export function getPriorityScore(item) {
  if (!item.hoursSaved || !item.effortHours) return 0;
  return item.hoursSaved / item.effortHours;
}

export function formatEffortHours(h) {
  if (h < 8)  return `~${h} hr${h === 1 ? '' : 's'}`;
  if (h === 8) return '~1 day';
  return `~${Math.round(h / 8)} days`;
}

export const ALL_ITEMS_RANKED = (() => {
  const all = [];
  Object.entries(OPTIMIZE_GAPS).forEach(([tabId, items]) => {
    items.forEach(item => all.push({ ...item, tabId }));
  });
  return all.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
})();

export const TOP_ACTIONS = ALL_ITEMS_RANKED.slice(0, 5);

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFD = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ─── Tab config ───────────────────────────────────────────────────────────────

export const TABS = [
  {
    id: 'content',
    label: 'Content gaps',
    description: 'Questions agents can\'t answer — no article or documented process covers it.',
    actionLabel: 'Create article',
    actionIcon: (
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M6 1v10M1 6h10"/>
      </svg>
    ),
  },
  {
    id: 'action',
    label: 'Action gaps',
    description: 'Steps where agents are blocked — missing permissions, tooling, or a defined process.',
    actionLabel: 'Create automation',
    actionIcon: (
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 1L1 7h4.5L4 11l7-6.5H7L8.5 1H6Z"/>
      </svg>
    ),
  },
  {
    id: 'data',
    label: 'Data gaps',
    description: 'Tickets where missing information at intake delayed or blocked resolution.',
    actionLabel: 'Update intake form',
    actionIcon: (
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="1" width="10" height="10" rx="1.5"/>
        <path d="M3.5 4h5M3.5 6.5h5M3.5 9h3"/>
      </svg>
    ),
  },
  {
    id: 'cx',
    label: 'AI CX ratings',
    description: 'Patterns in AI deflections that received low customer satisfaction scores — and what to fix.',
    actionLabel: 'Update AI playbook',
    actionIcon: (
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 1v2M6 9v2M1 6h2M9 6h2M2.93 2.93l1.41 1.41M7.66 7.66l1.41 1.41M2.93 9.07l1.41-1.41M7.66 4.34l1.41-1.41"/>
      </svg>
    ),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function ImpactPill({ impact }) {
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

export function StatusBadge({ status }) {
  if (!status || status === 'open') return null;
  const cfg = {
    'in-review': { bg: 'var(--warning-background)', color: 'var(--warning-text)', label: 'In review' },
    'done':      { bg: 'var(--success-background)', color: 'var(--success-text)', label: 'Done'      },
    'dismissed': { bg: 'var(--background-medium)',  color: 'var(--text-disabled)', label: 'Dismissed' },
  }[status];
  if (!cfg) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 600, fontFamily: SFT,
      padding: '2px 7px', borderRadius: 4, textTransform: 'capitalize',
      background: cfg.bg, color: cfg.color, flexShrink: 0,
    }}>
      {cfg.label}
    </span>
  );
}

export function CxScorePill({ score }) {
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

export function EffortBadge({ effortLabel, effortHours }) {
  const cfg = {
    'Quick win':  { bg: 'var(--success-background)', color: 'var(--success-text)' },
    'Half day':   { bg: 'var(--warning-background)', color: 'var(--warning-text)' },
    'Multi-day':  { bg: 'var(--background-medium)',  color: 'var(--text-weak)'    },
  }[effortLabel] ?? { bg: 'var(--background-medium)', color: 'var(--text-weak)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 500, fontFamily: SFT,
      padding: '2px 7px', borderRadius: 4,
      background: cfg.bg, color: cfg.color, flexShrink: 0,
    }}>
      {effortLabel} · {formatEffortHours(effortHours)}
    </span>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 3l10 10M13 3L3 13"/>
    </svg>
  );
}

// ─── Gap card (list item) ─────────────────────────────────────────────────────

function GapCard({ item, selected, status, onSelect }) {
  const isDone = status === 'done' || status === 'dismissed';
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(item); }}
      style={{
        background: selected ? 'var(--background-medium)' : 'transparent',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        cursor: 'pointer',
        outline: 'none',
        transition: 'background 0.1s',
        opacity: isDone ? 0.55 : 1,
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--background-medium)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Row 1: pills + ticket count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {item.cxScore != null
          ? <CxScorePill score={item.cxScore} />
          : <ImpactPill impact={item.impact} />
        }
        <StatusBadge status={status} />
        <span style={{ fontSize: 11, fontFamily: SFT, color: 'var(--text-disabled)', marginLeft: 'auto' }}>
          {item.ticketCount} tickets
        </span>
      </div>
      {/* Row 2: gap title */}
      <p style={{ fontFamily: SFT, fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0, lineHeight: '19px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.gap}
      </p>
      {/* Row 3: suggestion */}
      <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '17px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.suggestion}
      </p>
    </div>
  );
}

// ─── Gap detail panel ─────────────────────────────────────────────────────────

export function GapDetailPanel({ item, tabConfig, status, onStatusChange, onClose, onTicketClick }) {
  if (!item) return null;

  const navigate = useNavigate();
  const isOpen = !status || status === 'open';
  const isInReview = status === 'in-review';
  const isDone = status === 'done';
  const isDismissed = status === 'dismissed';

  // For content gaps linked to KB learnings, resolve the KB navigation target
  const isContentGap = tabConfig?.id === 'content';
  const kbLearning = isContentGap && item.learningId
    ? KB_LEARNINGS.find(l => l.id === item.learningId)
    : null;
  const linkedArticle = item.linkedArticleId
    ? KB_ARTICLES.find(a => a.id === item.linkedArticleId)
    : null;
  const linkedArticleIsSynced = linkedArticle && linkedArticle.source && linkedArticle.source !== 'internal';

  function handlePrimaryAction() {
    if (kbLearning) {
      if (item.draftId) {
        navigate(`/knowledge-base/${item.kbProjectId}/${item.draftId}`);
      } else if (kbLearning.type === 'update-article' && linkedArticleIsSynced) {
        // Synced article — navigate to learnings tab for addendum creation
        navigate(`/knowledge-base/${item.kbProjectId}?tab=learnings`);
      } else if (kbLearning.type === 'update-article') {
        navigate(`/knowledge-base/${item.kbProjectId}/${kbLearning.linkedArticleId}?gap=${item.learningId}`);
      } else {
        navigate(`/knowledge-base/${item.kbProjectId}?tab=drafts`);
      }
    } else {
      onStatusChange('done');
    }
  }

  const primaryLabel = kbLearning
    ? item.draftId
      ? 'Review draft'
      : kbLearning.type === 'update-article' && linkedArticleIsSynced
        ? 'Create addendum'
        : kbLearning.type === 'update-article'
          ? 'Review suggested edit'
          : tabConfig.actionLabel
    : tabConfig.actionLabel;

  const rank = ALL_ITEMS_RANKED.findIndex(i => i.id === item.id) + 1;
  const total = ALL_ITEMS_RANKED.length;
  const roiScore = item.effortHours ? (item.hoursSaved / item.effortHours).toFixed(1) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {item.cxScore != null
                ? <CxScorePill score={item.cxScore} />
                : <ImpactPill impact={item.impact} />
              }
              {item.effortLabel && <EffortBadge effortLabel={item.effortLabel} effortHours={item.effortHours} />}
              <StatusBadge status={status} />
            </div>
            <h2 style={{ fontFamily: SFT, fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: '22px' }}>
              {item.gap}
            </h2>
            {roiScore && (
              <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)', margin: '6px 0 0', lineHeight: '18px' }}>
                Ranked #{rank} of {total} · {roiScore}× return on time
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0, marginTop: 2,
              background: 'transparent', color: 'var(--text-disabled)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>

        {/* Impact + Effort — two columns */}
        {(item.hoursSaved || item.effortLabel) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {item.hoursSaved && (
              <div style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background-weak)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, fontFamily: SFT, color: 'var(--text-weak)', marginBottom: 6 }}>Impact</div>
                <div style={{ fontFamily: SFD, fontSize: 26, fontWeight: 400, color: 'var(--text)', letterSpacing: '0.35px', lineHeight: '32px', marginBottom: 4 }}>
                  {item.hoursSaved} hrs
                </div>
                <div style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-weak)' }}>saved per month</div>
                {item.avgTimeAdded && (
                  <div style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)', marginTop: 8, lineHeight: '16px' }}>
                    {item.avgTimeAdded}
                  </div>
                )}
              </div>
            )}
            {item.effortLabel && (
              <div style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background-weak)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, fontFamily: SFT, color: 'var(--text-weak)', marginBottom: 6 }}>Effort</div>
                <div style={{ fontFamily: SFD, fontSize: 26, fontWeight: 400, color: 'var(--text)', letterSpacing: '0.35px', lineHeight: '32px', marginBottom: 4 }}>
                  {formatEffortHours(item.effortHours)}
                </div>
                <div style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-weak)' }}>{item.effortLabel}</div>
                {item.integrations?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {item.integrations.map(name => (
                      <span key={name} style={{ fontFamily: SFT, fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 3, background: 'var(--background-medium)', color: 'var(--text-weak)' }}>
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <PanelSection label={item.cxScore != null ? 'What went wrong' : "What's happening"}>
          <p style={{ fontFamily: SFT, fontSize: 13, color: 'var(--text-weak)', margin: 0, lineHeight: '20px' }}>
            {item.detail}
          </p>
        </PanelSection>

        <PanelSection label={item.cxScore != null ? 'Interactions' : 'Source tickets'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {item.sourceTickets.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => { onClose(); onTicketClick?.(t.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 7,
                  border: 'none', cursor: 'pointer',
                  background: 'var(--background-medium)', textAlign: 'left',
                  transition: 'box-shadow 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--border)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{
                  fontFamily: SFT, fontSize: 11, fontWeight: 600, color: 'var(--selected-text)',
                  background: 'var(--selected-background)', borderRadius: 4, padding: '1px 6px',
                  flexShrink: 0,
                }}>
                  {t.id}
                </span>
                <span style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', flex: 1, minWidth: 0 }} className="truncate">
                  {t.name}
                </span>
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M4 2l4 4-4 4"/>
                </svg>
              </button>
            ))}
          </div>
        </PanelSection>

        <PanelSection label="Recommendation">
          <p style={{ fontFamily: SFT, fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: '0 0 8px', lineHeight: '20px' }}>
            {item.suggestion}
          </p>
          {item.summary && (
            <p style={{ fontFamily: SFT, fontSize: 13, color: 'var(--text-weak)', margin: 0, lineHeight: '20px' }}>
              {item.summary}
            </p>
          )}
        </PanelSection>

      </div>

      {/* Sticky footer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 20px',
        background: 'var(--background-weak)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        {!isDone && !isDismissed && (
          <button
            type="button"
            onClick={handlePrimaryAction}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 14px', borderRadius: 7,
              fontSize: 13, fontFamily: SFT, fontWeight: 500,
              background: 'var(--selected-background-strong)', color: 'var(--selected-text-strong)',
              border: 'none', cursor: 'pointer',
              transition: 'opacity 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {tabConfig.actionIcon}
            {primaryLabel}
          </button>
        )}

        {isOpen && (
          <button
            type="button"
            onClick={() => onStatusChange('in-review')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 12px', borderRadius: 7,
              fontSize: 13, fontFamily: SFT, fontWeight: 500,
              background: 'var(--background-weak)', color: 'var(--text)',
              border: '1px solid var(--border)', cursor: 'pointer',
              transition: 'border-color 0.1s, background 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--background-weak)'; }}
          >
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="5"/>
              <path d="M4 6l1.5 1.5L8 4"/>
            </svg>
            Mark in review
          </button>
        )}

        <div style={{ marginLeft: 'auto' }} />

        {!isDismissed && !isDone && (
          <button
            type="button"
            onClick={() => onStatusChange('dismissed')}
            style={{
              height: 32, padding: '0 6px', borderRadius: 6,
              fontSize: 12, fontFamily: SFT, fontWeight: 400,
              border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-disabled)',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-weak)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-disabled)'}
          >
            Dismiss
          </button>
        )}

        {(isInReview || isDone) && (
          <button
            type="button"
            onClick={() => onStatusChange('open')}
            style={{
              height: 32, padding: '0 6px', borderRadius: 6,
              fontSize: 12, fontFamily: SFT, fontWeight: 400,
              border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-disabled)',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-weak)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-disabled)'}
          >
            Undo
          </button>
        )}

        {isDismissed && (
          <button
            type="button"
            onClick={() => onStatusChange('open')}
            style={{
              height: 32, padding: '0 6px', borderRadius: 6,
              fontSize: 12, fontFamily: SFT, fontWeight: 400,
              border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-disabled)',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-weak)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-disabled)'}
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
}

function PanelSection({ label, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: 'var(--text-weak)', fontFamily: SFT,
        marginBottom: 10,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Focus this week (left pane, above tabs) ──────────────────────────────────

function FocusSection({ onSelectFocus, statuses }) {
  const openCount = TOP_ACTIONS.filter(a => !statuses[a.id] || statuses[a.id] === 'open').length;
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 6px' }}>
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: SFT, color: 'var(--text-weak)', letterSpacing: '0.04em' }}>
          Focus this week
        </span>
        <span style={{ fontSize: 11, fontFamily: SFT, color: 'var(--text-disabled)' }}>
          {openCount} open
        </span>
      </div>
      {TOP_ACTIONS.map(item => {
        const isDone = statuses[item.id] === 'done' || statuses[item.id] === 'dismissed';
        const cat = CATEGORY_CONFIG[item.tabId];
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectFocus(item)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '6px 16px', background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left', opacity: isDone ? 0.45 : 1,
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{
              fontSize: 10, fontWeight: 600, fontFamily: SFT,
              padding: '2px 6px', borderRadius: 4, flexShrink: 0,
              background: cat.bg, color: cat.color,
            }}>
              {cat.label}
            </span>
            <span style={{
              fontSize: 12, fontFamily: SFT, fontWeight: 500, color: 'var(--text)',
              flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {item.gap}
            </span>
            {item.cxScore != null
              ? <CxScorePill score={item.cxScore} />
              : <ImpactPill impact={item.impact} />
            }
          </button>
        );
      })}
    </div>
  );
}

// ─── Overview panel (default right state) ─────────────────────────────────────

function OptimizeOverview({ onTabSelect, statuses }) {
  const categoryStats = Object.entries(OPTIMIZE_GAPS).map(([id, items]) => {
    const tab = TABS.find(t => t.id === id);
    const highCount = items.filter(i => i.impact === 'high' || (i.cxScore != null && i.cxScore < 2.5)).length;
    const avgCx = id === 'cx'
      ? (items.reduce((s, i) => s + i.cxScore, 0) / items.length).toFixed(1)
      : null;
    const totalTickets = items.reduce((s, i) => s + i.ticketCount, 0);
    return { id, label: tab?.label, count: items.length, highCount, avgCx, totalTickets };
  });

  const totalTickets = categoryStats.reduce((s, t) => s + t.totalTickets, 0);
  const totalHigh = categoryStats.reduce((s, t) => s + t.highCount, 0);

  return (
    <div style={{ padding: '32px 28px', overflowY: 'auto', height: '100%' }}>

      {/* Headline */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)', margin: '0 0 6px' }}>
          AI analysis · Updated today
        </p>
        <p style={{ fontFamily: SFD, fontSize: 22, fontWeight: 400, color: 'var(--text)', margin: 0, letterSpacing: '0.38px', lineHeight: '30px' }}>
          {totalHigh} high-impact gaps<br />across {totalTickets} tickets
        </p>
      </div>

      {/* Category grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {categoryStats.map(s => {
          const cat = CATEGORY_CONFIG[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onTabSelect(s.id)}
              style={{
                display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'left',
                padding: '14px 16px', borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--background-weak)',
                cursor: 'pointer', transition: 'box-shadow 0.12s, border-color 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <span style={{ fontSize: 10, fontWeight: 600, fontFamily: SFT, padding: '2px 6px', borderRadius: 4, alignSelf: 'flex-start', background: cat.bg, color: cat.color }}>
                {cat.label}
              </span>
              <span style={{ fontFamily: SFD, fontSize: 32, fontWeight: 400, color: 'var(--text)', letterSpacing: '0.35px', lineHeight: '38px' }}>
                {s.count}
              </span>
              <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-weak)', lineHeight: '16px' }}>
                {s.id === 'cx'
                  ? `avg ★ ${s.avgCx}`
                  : `${s.highCount} high impact · ${s.totalTickets} tickets`
                }
              </span>
            </button>
          );
        })}
      </div>

      {/* Top priorities */}
      <div>
        <p style={{ fontFamily: SFT, fontSize: 11, fontWeight: 600, color: 'var(--text-weak)', margin: '0 0 10px', letterSpacing: '0.04em' }}>
          Highest priority
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOP_ACTIONS.map((item, i) => {
            const cat = CATEGORY_CONFIG[item.tabId];
            const isDone = statuses[item.id] === 'done' || statuses[item.id] === 'dismissed';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabSelect(item.tabId, item)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left',
                  padding: '12px 14px', borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--background-weak)',
                  cursor: 'pointer', opacity: isDone ? 0.5 : 1,
                  transition: 'box-shadow 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-disabled)', fontFamily: SFT, flexShrink: 0, minWidth: 16, paddingTop: 1 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, fontFamily: SFT, padding: '2px 6px', borderRadius: 4, background: cat.bg, color: cat.color }}>
                      {cat.label}
                    </span>
                    {item.cxScore != null ? <CxScorePill score={item.cxScore} /> : <ImpactPill impact={item.impact} />}
                    <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, marginLeft: 'auto' }}>
                      {item.ticketCount} tickets
                    </span>
                  </div>
                  <p style={{ fontFamily: SFT, fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: '0 0 3px', lineHeight: '19px' }}>
                    {item.gap}
                  </p>
                  <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '17px' }}>
                    {item.suggestion}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── OptimizeView ─────────────────────────────────────────────────────────────

export default function OptimizeView({ onNavigateToTicket }) {
  const [activeTab, setActiveTab] = useState('content');
  const [selectedItem, setSelectedItem] = useState(null);
  const [statuses, setStatuses] = useState({});

  const tab = TABS.find(t => t.id === activeTab);
  const items = OPTIMIZE_GAPS[activeTab] ?? [];
  const highCount = items.filter(i => i.impact === 'high').length;

  function handleSelect(item) {
    setSelectedItem(prev => (prev?.id === item.id ? null : item));
  }

  function handleStatusChange(status) {
    if (!selectedItem) return;
    setStatuses(prev => ({ ...prev, [selectedItem.id]: status === 'open' ? undefined : status }));
  }

  function handleTabChange(id) {
    setActiveTab(id);
    setSelectedItem(null);
  }

  // Called from FocusSection — switches tab + selects item
  function handleSelectFocus(item) {
    setActiveTab(item.tabId);
    setSelectedItem(item);
  }

  // Called from OptimizeOverview category cards / top priority items
  function handleTabSelectFromOverview(tabId, item = null) {
    setActiveTab(tabId);
    setSelectedItem(item ?? null);
  }

  const selectedItemInCurrentTab = selectedItem && items.find(i => i.id === selectedItem.id) ? selectedItem : null;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--background-weak)' }}>

      {/* ── Left: list pane ──────────────────────────────────────────────────── */}
      <div style={{ width: 380, flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '24px 16px 0', flexShrink: 0 }}>
          <h2 style={{ fontFamily: SFD, fontSize: 18, fontWeight: 500, color: 'var(--text)', margin: '0 0 14px', letterSpacing: '0.38px' }}>
            Optimize
          </h2>
        </div>

        {/* Focus this week */}
        <FocusSection onSelectFocus={handleSelectFocus} statuses={statuses} />

        {/* Tab bar */}
        <div style={{ padding: '0 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              const count = (OPTIMIZE_GAPS[t.id] ?? []).length;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTabChange(t.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    height: 32, padding: '0 9px', fontSize: 12, fontFamily: SFT,
                    fontWeight: active ? 500 : 400, cursor: 'pointer',
                    background: 'transparent', border: 'none',
                    color: active ? 'var(--text)' : 'var(--text-weak)',
                    borderBottom: active ? '2px solid var(--selected-background-strong)' : '2px solid transparent',
                    marginBottom: -1, transition: 'color 0.1s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-weak)'; }}
                >
                  {t.label}
                  <span style={{
                    fontSize: 10, fontWeight: 600, lineHeight: '14px', padding: '0 4px', borderRadius: 3,
                    background: active ? 'var(--selected-background-strong)' : 'var(--background-medium)',
                    color: active ? 'var(--selected-text-strong)' : 'var(--text-weak)',
                    minWidth: 16, textAlign: 'center',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div style={{ padding: '10px 16px 6px', flexShrink: 0 }}>
          <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-disabled)', margin: 0, lineHeight: '18px' }}>
            {tab?.description}
            {activeTab === 'cx' && items.length > 0 ? (
              <span style={{ marginLeft: 8, fontWeight: 600, color: 'var(--danger-text)' }}>
                avg ★ {(items.reduce((s, i) => s + (i.cxScore ?? 0), 0) / items.length).toFixed(1)}
              </span>
            ) : highCount > 0 ? (
              <span style={{ marginLeft: 8, fontWeight: 500, color: 'var(--danger-text)' }}>
                {highCount} high impact
              </span>
            ) : null}
          </p>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {items.map(item => (
            <GapCard
              key={item.id}
              item={item}
              selected={selectedItemInCurrentTab?.id === item.id}
              status={statuses[item.id]}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* ── Right: detail or overview ─────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {selectedItemInCurrentTab ? (
          <GapDetailPanel
            item={selectedItemInCurrentTab}
            tabConfig={tab}
            status={statuses[selectedItemInCurrentTab.id]}
            onStatusChange={handleStatusChange}
            onClose={() => setSelectedItem(null)}
            onTicketClick={onNavigateToTicket}
          />
        ) : (
          <OptimizeOverview
            onTabSelect={handleTabSelectFromOverview}
            statuses={statuses}
          />
        )}
      </div>

    </div>
  );
}
