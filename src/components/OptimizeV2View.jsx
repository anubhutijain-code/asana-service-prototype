// ─── OptimizeV2View — Automations-style card grid + side panel overlay ────────

import { useState } from 'react';
import { OPTIMIZE_GAPS } from '../data/optimize';
import { TABS, ImpactPill, CxScorePill, StatusBadge, GapDetailPanel } from './OptimizeView';
import RightPanelOverlay from './RightPanelOverlay';
import Pill from './Pill';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ─── Filter options ───────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'all',     label: 'All'           },
  { id: 'content', label: 'Content gaps'  },
  { id: 'action',  label: 'Action gaps'   },
  { id: 'data',    label: 'Data gaps'     },
  { id: 'cx',      label: 'AI CX ratings' },
];

const SECTIONS = [
  { id: 'content', label: 'Content gaps'  },
  { id: 'action',  label: 'Action gaps'   },
  { id: 'data',    label: 'Data gaps'     },
  { id: 'cx',      label: 'AI CX ratings' },
];

// ─── Gap card (Automations-style) ─────────────────────────────────────────────

function GapCardV2({ item, status, selected, onSelect }) {
  const [hov, setHov] = useState(false);
  const isDone = status === 'done' || status === 'dismissed';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(item); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? 'var(--selected-background)' : 'var(--background-weak)',
        border: `1px solid ${selected ? 'var(--selected-background-strong)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'pointer',
        outline: 'none',
        boxShadow: hov && !selected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow 0.15s, border-color 0.1s',
        opacity: isDone ? 0.6 : 1,
      }}
    >
      {/* Header: impact/score pill + ticket count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {item.cxScore != null
          ? <CxScorePill score={item.cxScore} />
          : <ImpactPill impact={item.impact} />
        }
        <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>
          {item.ticketCount} {item.cxScore != null ? 'interactions' : 'tickets'}
        </span>
      </div>

      {/* Gap */}
      <p style={{
        fontSize: 14, fontWeight: 600, color: 'var(--text)',
        lineHeight: '20px', margin: 0,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {item.gap}
      </p>

      {/* Suggestion */}
      <p style={{
        fontSize: 13, color: 'var(--text-weak)',
        lineHeight: '19px', margin: 0, flex: 1,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {item.suggestion}
      </p>

      {/* Footer: status */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}

// ─── OptimizeV2View ───────────────────────────────────────────────────────────

export default function OptimizeV2View({ onNavigateToTicket }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [statuses, setStatuses] = useState({});

  const allItems = Object.entries(OPTIMIZE_GAPS).flatMap(([tabId, items]) =>
    items.map(item => ({ ...item, _tabId: tabId }))
  );

  const activeTabConfig = TABS.find(t => t.id === (selectedItem?._tabId ?? activeFilter)) ?? TABS[0];

  function handleStatusChange(status) {
    if (!selectedItem) return;
    setStatuses(prev => ({ ...prev, [selectedItem.id]: status === 'open' ? undefined : status }));
  }

  const totalCount = activeFilter === 'all'
    ? allItems.length
    : (OPTIMIZE_GAPS[activeFilter] ?? []).length;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '32px 32px 48px', background: 'var(--background-weak)', position: 'relative' }}>

      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: '#1E1F21', margin: '0 0 4px' }}>
          Optimize
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-weak)', margin: 0, fontFamily: SFT }}>
          Patterns detected across tickets in the last 30 days — gaps in knowledge, capability, intake quality, and AI response effectiveness.
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
        {FILTERS.map(f => {
          const count = f.id === 'all' ? allItems.length : (OPTIMIZE_GAPS[f.id] ?? []).length;
          const active = activeFilter === f.id;
          return (
            <Pill
              key={f.id}
              as="button"
              label={`${f.label} ${count}`}
              bg={active ? 'var(--text)' : 'var(--background-medium)'}
              color={active ? 'var(--background-weak)' : 'var(--text-weak)'}
              onClick={() => { setActiveFilter(f.id); setSelectedItem(null); }}
            />
          );
        })}
      </div>

      {/* Sectioned card grid */}
      {(() => {
        const visibleSections = SECTIONS
          .map(s => ({
            ...s,
            items: (activeFilter === 'all' ? (OPTIMIZE_GAPS[s.id] ?? []) : (s.id === activeFilter ? (OPTIMIZE_GAPS[s.id] ?? []) : []))
              .map(item => ({ ...item, _tabId: s.id })),
          }))
          .filter(s => s.items.length > 0);

        if (visibleSections.length === 0) {
          return (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-disabled)', fontSize: 14, fontFamily: SFT }}>
              No gaps in this category.
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {visibleSections.map(section => (
              <div key={section.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{section.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-disabled)', fontFamily: SFT }}>{section.items.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                  {section.items.map(item => (
                    <GapCardV2
                      key={item.id}
                      item={item}
                      status={statuses[item.id]}
                      selected={selectedItem?.id === item.id}
                      onSelect={item => setSelectedItem(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Side panel overlay (same as original) */}
      <RightPanelOverlay
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        width="min(660px, 72%)"
      >
        <GapDetailPanel
          item={selectedItem}
          tabConfig={activeTabConfig}
          status={selectedItem ? statuses[selectedItem.id] : null}
          onStatusChange={handleStatusChange}
          onClose={() => setSelectedItem(null)}
          onTicketClick={onNavigateToTicket}
        />
      </RightPanelOverlay>

    </div>
  );
}
