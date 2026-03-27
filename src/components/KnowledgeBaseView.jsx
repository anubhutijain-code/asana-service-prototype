import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Avatar from './ui/Avatar';
import RightPanelOverlay from './RightPanelOverlay';
import { KB_PROJECTS, KB_ARTICLES, KB_LEARNINGS, KB_DRAFTS, INTEGRATION_CONFIG, formatDate, formatRelativeTime } from '../data/knowledgeBase';
import FilterPanel, { applyFilters } from './ui/FilterPanel';
import { SFT, LIGA } from '../constants/typography';

// ─── Filter config ────────────────────────────────────────────────────────────
const KB_FILTER_FIELDS = [
  { id: 'status',   label: 'Status',   type: 'select', options: ['Published', 'Draft', 'Archived', 'Unpublished'] },
  { id: 'source',   label: 'Source',   type: 'select', options: ['confluence', 'slab', 'notion', 'internal'] },
  { id: 'category', label: 'Category', type: 'text' },
  { id: 'author',   label: 'Author',   type: 'text' },
];

const KB_QUICK_FILTERS = [
  { id: 'published', label: 'Published', rules: [{ field: 'status', op: 'is', value: 'Published' }] },
  { id: 'draft',     label: 'Draft',     rules: [{ field: 'status', op: 'is', value: 'Draft' }] },
  { id: 'internal',  label: 'Internal',  rules: [{ field: 'source', op: 'is', value: 'internal' }] },
];

const KB_ACCESSORS = {
  status:   a => a.status,
  source:   a => a.source ?? 'internal',
  category: a => a.category,
  author:   a => a.author,
};

// ─── Shared typography ─────────────────────────────────────────────────────────
const typoCell = { fontFamily: SFT, fontSize: '14px', fontWeight: 400, lineHeight: '20px', color: 'var(--text)', ...LIGA };
const typoMeta = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA };
const COL = 'text-xs font-medium text-text-weak px-2 py-2 text-left whitespace-nowrap flex items-center';
const CELL = 'px-2 flex items-center';
const divStyle = { borderRight: '1px solid var(--border)' };

// ─── Status badge config ───────────────────────────────────────────────────────
const STATUS_BADGE = {
  'Published':   { bg: 'var(--success-background)', color: 'var(--success-text)' },
  'Draft':       { bg: 'var(--warning-background)', color: 'var(--warning-text)' },
  'Archived':    { bg: 'var(--background-medium)',  color: 'var(--text-weak)' },
  'Unpublished': { bg: 'var(--danger-background)',  color: 'var(--danger-text)' },
};

// ─── Icons ─────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="5" /><path d="M12 12l-2.5-2.5" />
    </svg>
  );
}
function SortIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 5h12M4 8h8M6 11h4" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg className="animate-spin" viewBox="0 0 10 10" width="12" height="12" style={{ flexShrink: 0 }}>
      <circle cx="5" cy="5" r="3.5" stroke="var(--border-strong)" strokeWidth="1.5" fill="none" />
      <path d="M5 1.5A3.5 3.5 0 0 1 8.5 5" stroke="var(--selected-background-strong)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Integration source icon ───────────────────────────────────────────────────

function SourceIcon({ type, size = 16 }) {
  if (type === 'confluence') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} aria-label="Confluence">
        <path d="M1.3 11.6c-.2.3-.5.8-.7 1.1-.2.4 0 .8.4 1l2.6 1.5c.4.2.9.1 1.1-.3.2-.3.4-.7.7-1.1 1.8-2.7 3.8-2.4 5.7-.3l2.5 1.5c.4.2.9.1 1.1-.3l1.4-2.5c.2-.4.1-.9-.3-1.1l-2.6-1.5C9.6 8.1 5.2 7.3 1.3 11.6z" fill="#0065FF" opacity=".85"/>
        <path d="M14.7 4.4c.2-.3.5-.8.7-1.1.2-.4 0-.8-.4-1L12.4.8c-.4-.2-.9-.1-1.1.3-.2.3-.4.7-.7 1.1C8.8 4.9 6.8 4.6 4.9 2.5L2.4 1C2 .8 1.5.9 1.3 1.3L-.1 3.8c-.2.4-.1.9.3 1.1l2.6 1.5C6.4 7.9 10.8 8.7 14.7 4.4z" fill="#2684FF" opacity=".85"/>
      </svg>
    );
  }
  if (type === 'slab') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} aria-label="Slab">
        <rect x="1" y="1" width="14" height="14" rx="3" fill="#7C3AED" />
        <path d="M5 11.5V4.5h3.5a2 2 0 0 1 0 4H5m0 3h4a2 2 0 0 0 0-4H5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    );
  }
  if (type === 'notion') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} aria-label="Notion">
        <rect x="1" y="1" width="14" height="14" rx="3" fill="var(--text)" />
        <path d="M5 4h4.5L12 6.5V12H5V4z" fill="white" stroke="none"/>
        <path d="M9.5 4v2.5H12" stroke="var(--text)" strokeWidth="0.8" fill="none"/>
        <path d="M6.5 7.5h3M6.5 9.5h3" stroke="var(--text-disabled)" strokeWidth="0.8" strokeLinecap="round"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-label="Internal">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="var(--background-strong)" />
      <path d="M8 4v8M4 8h8" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Integration badge (shown in header) ──────────────────────────────────────

function IntegrationBadge({ source, onManage, onAdd }) {
  if (!source) {
    return (
      <button
        type="button"
        onClick={onAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          height: 26, padding: '0 10px', borderRadius: 6,
          fontSize: 12, fontFamily: SFT, fontWeight: 500,
          border: '1px dashed var(--border-strong)',
          background: 'transparent', color: 'var(--text-weak)', cursor: 'pointer',
          transition: 'border-color 0.1s, color 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--selected-background-strong)'; e.currentTarget.style.color = 'var(--selected-text)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-weak)'; }}
      >
        <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 1v10M1 6h10"/>
        </svg>
        Add integration
      </button>
    );
  }

  const cfg = INTEGRATION_CONFIG[source.type] ?? {};
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Source pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 8px 3px 6px', borderRadius: 6,
        background: cfg.bg, border: `1px solid ${cfg.color}22`,
        fontSize: 12, fontFamily: SFT, fontWeight: 500, color: cfg.color,
      }}>
        <SourceIcon type={source.type} size={13} />
        {cfg.label}
        <span style={{ width: 1, height: 10, background: `${cfg.color}44`, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 400, color: cfg.color, opacity: 0.8 }}>
          {source.space}
        </span>
      </div>

      {/* Sync status */}
      <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>
        Synced {formatRelativeTime(source.syncedAt)}
      </span>

      {/* Manage button */}
      <button
        type="button"
        onClick={onManage}
        style={{
          height: 24, padding: '0 8px', fontSize: 11, fontFamily: SFT, fontWeight: 500,
          borderRadius: 5, border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--text-weak)', cursor: 'pointer', transition: 'all 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-weak)'; }}
      >
        Manage
      </button>
    </div>
  );
}

// ─── Manage Integration Panel ──────────────────────────────────────────────────

function ManageIntegrationPanel({ project, allArticles, onClose }) {
  const source = project.source;
  const [autoSync, setAutoSync] = useState(source?.autoSync ?? false);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(source?.syncedAt ?? null);
  const cfg = source ? (INTEGRATION_CONFIG[source.type] ?? {}) : {};
  const syncedCount = allArticles.filter(a => a.source === source?.type).length;
  const internalCount = allArticles.filter(a => a.source === 'internal').length;

  function handleSyncNow() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSynced(new Date().toISOString());
    }, 2200);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>Integration settings</span>
        <button
          type="button" onClick={onClose}
          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: 'var(--text-disabled)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

        {source ? (
          <>
            {/* ── Connection ── */}
            <Section title="Connection">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${cfg.color}22` }}>
                  <SourceIcon type={source.type} size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, marginBottom: 4 }}>{cfg.label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FieldRow label="Workspace" value={source.workspace} />
                    <FieldRow label="Space" value={source.space} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999, background: 'var(--success-background)', flexShrink: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-text)', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--success-text)', fontFamily: SFT }}>Connected</span>
                </div>
              </div>
            </Section>

            <Divider />

            {/* ── Sync ── */}
            <Section title="Sync">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Last synced row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT, marginBottom: 2 }}>Last synced</div>
                    <div style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>
                      {lastSynced ? new Date(lastSynced).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncNow}
                    disabled={syncing}
                    style={{
                      height: 30, padding: '0 12px', fontSize: 12, fontFamily: SFT, fontWeight: 500,
                      borderRadius: 6, border: '1px solid var(--border)', cursor: syncing ? 'default' : 'pointer',
                      background: 'var(--background-weak)', color: syncing ? 'var(--text-disabled)' : 'var(--text)',
                      display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={e => { if (!syncing) e.currentTarget.style.background = 'var(--background-medium)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--background-weak)'; }}
                  >
                    {syncing && <SpinnerIcon />}
                    {syncing ? 'Syncing…' : 'Sync now'}
                  </button>
                </div>

                {/* Auto-sync toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: SFT, marginBottom: 2 }}>Auto-sync</div>
                    <div style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>Every {source.syncInterval}</div>
                  </div>
                  <Toggle value={autoSync} onChange={setAutoSync} />
                </div>
              </div>
            </Section>

            <Divider />

            {/* ── Content ── */}
            <Section title="Content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ContentRow icon={<SourceIcon type={source.type} size={14} />} label={`Synced from ${cfg.label}`} count={syncedCount} />
                <ContentRow icon={<InternalDot />} label="Created manually" count={internalCount} />
              </div>
            </Section>

            <Divider />

            {/* ── Danger zone ── */}
            <Section title="Danger zone">
              <button
                type="button"
                style={{
                  height: 32, padding: '0 14px', fontSize: 13, fontFamily: SFT, fontWeight: 500,
                  borderRadius: 6, border: '1px solid var(--danger-background-strong)', cursor: 'pointer',
                  background: 'var(--danger-background)', color: 'var(--danger-text)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-background-strong)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--danger-background)'; }}
              >
                <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 2l10 10M12 2L2 12"/>
                </svg>
                Disconnect integration
              </button>
              <p style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, margin: '8px 0 0' }}>
                Removes the sync connection. Existing articles are not deleted.
              </p>
            </Section>
          </>
        ) : (
          /* ── No integration ── */
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT, marginBottom: 20 }}>
              Connect a source to automatically sync articles from your documentation tools.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(INTEGRATION_CONFIG).map(([type, cfg]) => (
                <button
                  key={type}
                  type="button"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
                    background: 'var(--background-weak)', textAlign: 'left',
                    transition: 'border-color 0.1s, background 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--background-weak)'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SourceIcon type={type} size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontFamily: SFT }}>{cfg.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT }}>Sync articles from {cfg.label}</div>
                  </div>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 4l4 4-4 4"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Small helper components ───────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', fontFamily: SFT, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />;
}

function FieldRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, minWidth: 64 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{value}</span>
    </div>
  );
}

function ContentRow({ icon, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <span style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{count}</span>
    </div>
  );
}

function InternalDot() {
  return <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--background-strong)', border: '1px solid var(--border-strong)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} />;
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 2,
        background: value ? 'var(--selected-background-strong)' : 'var(--background-strong)',
        transition: 'background 0.2s', display: 'flex', alignItems: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: '50%', background: 'var(--surface)',
        boxShadow: 'var(--shadow-sm)',
        transform: value ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform 0.2s',
        display: 'block',
      }} />
    </button>
  );
}

// ─── Source chip (in table cell) ───────────────────────────────────────────────

function SourceChip({ type }) {
  if (type === 'internal') {
    return (
      <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>Internal</span>
    );
  }
  const cfg = INTEGRATION_CONFIG[type];
  if (!cfg) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '1px 6px', borderRadius: 4,
      background: cfg.bg, fontSize: 11, fontWeight: 500, color: cfg.color, fontFamily: SFT,
      whiteSpace: 'nowrap',
    }}>
      <SourceIcon type={type} size={11} />
      {cfg.label}
    </span>
  );
}

// ─── Table header ──────────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <div className="flex items-stretch w-full bg-[var(--surface)] sticky top-0 z-[2]" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className={`${COL} w-[44px] shrink-0 justify-center`}>#</div>
      <div className={`${COL} sticky left-[44px] bg-[var(--surface)] z-[3] w-[280px] shrink-0`} style={divStyle}>Article name</div>
      <div className={`${COL} sticky left-[324px] bg-[var(--surface)] z-[3] w-[120px] shrink-0`} style={divStyle}>Source</div>
      <div className={`${COL} w-[150px] shrink-0`} style={divStyle}>Author</div>
      <div className={`${COL} w-[120px] shrink-0`} style={divStyle}>Status</div>
      <div className={`${COL} w-[150px] shrink-0`} style={divStyle}>Category</div>
      <div className={`${COL} w-[130px] shrink-0`}>Last updated</div>
    </div>
  );
}

// ─── Table row ─────────────────────────────────────────────────────────────────

function TableRow({ article, index, onClick }) {
  const badge = STATUS_BADGE[article.status] ?? STATUS_BADGE['Archived'];
  const hasContent = article.content?.length > 0;
  return (
    <div
      role="row"
      onClick={hasContent ? onClick : undefined}
      className="group flex items-stretch w-full bg-background-weak hover:bg-background-medium transition-colors"
      style={{ height: 44, borderBottom: '1px solid var(--border)', cursor: hasContent ? 'pointer' : 'default' }}
    >
      <div className={`${CELL} w-[44px] shrink-0 justify-center`} style={{ ...typoMeta, fontSize: 11 }}>{index + 1}</div>
      <div className={`${CELL} sticky left-[44px] z-[1] w-[280px] shrink-0 bg-background-weak group-hover:bg-background-medium`} style={divStyle}>
        <span className="truncate max-w-[250px]" style={typoCell}>{article.title}</span>
      </div>
      <div className={`${CELL} sticky left-[324px] z-[1] w-[120px] shrink-0 bg-background-weak group-hover:bg-background-medium`} style={divStyle}>
        <SourceChip type={article.source ?? 'internal'} />
      </div>
      <div className={`${CELL} w-[150px] shrink-0 gap-2`} style={{ ...divStyle, ...typoCell }}>
        <Avatar name={article.author} size={22} />
        <span className="truncate max-w-[100px]">{article.author}</span>
      </div>
      <div className={`${CELL} w-[120px] shrink-0`} style={divStyle}>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: SFT, background: badge.bg, color: badge.color, whiteSpace: 'nowrap' }}>
          {article.status}
        </span>
      </div>
      <div className={`${CELL} w-[150px] shrink-0`} style={{ ...divStyle, ...typoMeta }}>
        <span className="truncate max-w-[130px]">{article.category}</span>
      </div>
      <div className={`${CELL} w-[130px] shrink-0`} style={typoMeta}>
        {formatDate(article.updatedAt)}
      </div>
    </div>
  );
}

// ─── Learnings view ────────────────────────────────────────────────────────────


const LEARNING_STATUS_BADGE = {
  new:       { bg: 'var(--selected-background)', color: 'var(--selected-text)' },
  reviewed:  { bg: 'var(--success-background)',  color: 'var(--success-text)'  },
  dismissed: { bg: 'var(--background-medium)',   color: 'var(--text-disabled)' },
};

function BulbIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2a4 4 0 0 1 2.5 7.1c-.3.3-.5.7-.5 1.1V11H6v-.8c0-.4-.2-.8-.5-1.1A4 4 0 0 1 8 2z"/>
      <path d="M6 13h4M7 15h2"/>
    </svg>
  );
}

function LearningCard({ learning, linkedArticle, onAction, onTicketClick }) {
  const navigate = useNavigate();
  const badge = LEARNING_STATUS_BADGE[learning.status];
  const ticketCount = learning.sourceTickets.length;
  const isUpdate = learning.type === 'update-article';

  return (
    <div style={{
      background: 'var(--background-weak)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Top row: type tag + category + status + date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: SFT,
          background: isUpdate ? 'var(--warning-background)' : 'var(--background-medium)',
          color: isUpdate ? 'var(--warning-text)' : 'var(--text-disabled)',
          flexShrink: 0,
        }}>
          {isUpdate
            ? <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6A5 5 0 1 1 3.5 10.3M1 9.5V6.5h3"/></svg>
            : <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
          }
          {isUpdate ? 'Update existing' : 'New article'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, padding: '2px 7px', borderRadius: 4, background: 'var(--background-medium)' }}>
          {learning.category}
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
          borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: SFT,
          background: badge.bg, color: badge.color, textTransform: 'capitalize',
        }}>
          {learning.status}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>
          Detected {formatDate(learning.detectedAt.slice(0, 10))}
        </span>
      </div>

      {/* Gap description */}
      <div>
        <p style={{ fontFamily: SFT, fontSize: 14, fontWeight: 500, color: 'var(--text)', margin: '0 0 4px', lineHeight: '20px' }}>
          {learning.gap}
        </p>
        <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '18px' }}>
          AI suggests: <span style={{ fontStyle: 'italic' }}>"{learning.suggestion}"</span>
        </p>
      </div>

      {/* Linked article (update type only) */}
      {isUpdate && linkedArticle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="var(--text-disabled)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="10" height="10" rx="1.5"/><path d="M3 4h6M3 6.5h6M3 9h4"/>
          </svg>
          <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)', flexShrink: 0 }}>Updates</span>
          <span style={{
            fontFamily: SFT, fontSize: 11, fontWeight: 500, color: 'var(--text-weak)',
            background: 'var(--background-medium)', borderRadius: 4, padding: '1px 7px',
            whiteSpace: 'nowrap', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer',
          }}>
            {linkedArticle.title}
          </span>
        </div>
      )}

      {/* Source tickets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="var(--text-disabled)" strokeWidth="1.4" strokeLinecap="round">
          <rect x="1" y="1" width="12" height="12" rx="2"/><path d="M4 7h6M4 4.5h6M4 9.5h4"/>
        </svg>
        <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>From</span>
        {learning.sourceTickets.slice(0, 2).map(t => (
          <span key={t.id} onClick={() => onTicketClick?.(t.id)} title={t.title} style={{
            fontFamily: SFT, fontSize: 11, color: 'var(--selected-text)',
            background: 'var(--selected-background)', borderRadius: 4, padding: '1px 6px',
            cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'underline', textDecorationColor: 'var(--selected-text)',
          }}>
            {t.id}
          </span>
        ))}
        {ticketCount > 2 && (
          <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>+{ticketCount - 2} more</span>
        )}
      </div>

      {/* Actions */}
      {learning.status !== 'dismissed' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
          <button
            type="button"
            onClick={() => {
              if (isUpdate && linkedArticle) {
                navigate(`/knowledge-base/${learning.projectId}/${learning.linkedArticleId}?gap=${learning.id}`);
              } else {
                onAction(learning.id, 'create');
              }
            }}
            style={{
              height: 30, padding: '0 12px', fontSize: 12, fontFamily: SFT, fontWeight: 500,
              borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
              background: 'var(--background-weak)', color: 'var(--text)',
              display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--background-weak)'; }}
          >
            {isUpdate
              ? <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 6A5 5 0 1 1 3.5 10.3M1 9.5V6.5h3"/></svg>
              : <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 1v10M1 6h10"/></svg>
            }
            {isUpdate ? 'Review suggestion' : 'Create article'}
          </button>
          {learning.status === 'new' && (
            <button
              type="button"
              onClick={() => onAction(learning.id, 'dismiss')}
              style={{
                height: 30, padding: '0 4px', fontSize: 12, fontFamily: SFT, fontWeight: 400,
                border: 'none', cursor: 'pointer', background: 'transparent',
                color: 'var(--text-disabled)', transition: 'color 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-weak)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; }}
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Confidence badge ─────────────────────────────────────────────────────────
const CONFIDENCE_STYLE = {
  high:   { bg: 'var(--success-background)',  color: 'var(--success-text)',  label: 'High confidence'   },
  medium: { bg: 'var(--warning-background)',  color: 'var(--warning-text)',  label: 'Medium confidence' },
  low:    { bg: 'var(--danger-background)',   color: 'var(--danger-text)',   label: 'Low confidence'    },
};

const DRAFT_STATUS_STYLE = {
  draft:           { bg: 'var(--selected-background)', color: 'var(--selected-text)',  label: 'AI Draft'         },
  agent_verified:  { bg: 'var(--success-background)',  color: 'var(--success-text)',   label: 'Agent verified'   },
};

function SparkleIcon() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor" aria-hidden="true">
      <path d="M6 0.5C6 0.5 6.4 3.1 7.5 4.5C8.6 5.9 11.5 6 11.5 6C11.5 6 8.6 6.1 7.5 7.5C6.4 8.9 6 11.5 6 11.5C6 11.5 5.6 8.9 4.5 7.5C3.4 6.1 0.5 6 0.5 6C0.5 6 3.4 5.9 4.5 4.5C5.6 3.1 6 0.5 6 0.5Z"/>
    </svg>
  );
}

function DraftCard({ draft, onAction, onTicketClick }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(draft.status);
  const conf = CONFIDENCE_STYLE[draft.confidence];
  const draftBadge = DRAFT_STATUS_STYLE[status];
  const previewPara = draft.content.find(c => c.type === 'p')?.text ?? '';

  function handleReviewAndPublish() {
    navigate(`/knowledge-base/${draft.projectId}/${draft.id}`);
  }
  function handleDismiss() { setStatus('dismissed'); onAction(draft.id, 'dismiss'); }

  if (status === 'dismissed') return null;

  return (
    <div style={{
      background: 'var(--background-weak)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Title + badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
          <p style={{ fontFamily: SFT, fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: '20px', flex: 1 }}>
            {draft.title}
          </p>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: SFT, background: 'var(--selected-background)', color: 'var(--selected-text)' }}>
              <SparkleIcon size={9} />
              AI draft
            </span>
            <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 500, fontFamily: SFT, background: conf.bg, color: conf.color }}>
              {conf.label}
            </span>
            <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>
              {formatRelativeTime(draft.generatedAt)}
            </span>
          </div>
        </div>

        {/* Trigger reason */}
        <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '18px' }}>
          {draft.triggerReason}
        </p>

        {/* Source tickets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>From</span>
          {draft.sourceTickets.map(t => (
            <span key={t.id} onClick={() => onTicketClick?.(t.id)} title={t.title} style={{
              fontFamily: SFT, fontSize: 11, color: 'var(--selected-text)',
              background: 'var(--selected-background)', borderRadius: 4, padding: '1px 6px',
              cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'underline', textDecorationColor: 'var(--selected-text)',
            }}>
              {t.id}
            </span>
          ))}
        </div>

        {/* Article preview (collapsed) */}
        <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '18px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {previewPara}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
          <button type="button" onClick={handleReviewAndPublish}
            style={{ height: 30, padding: '0 14px', fontSize: 12, fontFamily: SFT, fontWeight: 500, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', background: 'transparent', color: 'var(--text)', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Review &amp; publish
          </button>
          <button type="button" onClick={handleDismiss}
            style={{ height: 30, padding: '0 4px', fontSize: 12, fontFamily: SFT, fontWeight: 400, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-disabled)', transition: 'color 0.1s', marginLeft: 2 }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-weak)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-disabled)'}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function UpdateDraftCard({ learning, linkedArticle, onDismiss, onTicketClick }) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  function handleReview() {
    navigate(`/knowledge-base/${learning.projectId}/${learning.linkedArticleId}?gap=${learning.id}`);
  }
  function handleDismiss() { setDismissed(true); onDismiss?.(learning.id); }

  return (
    <div style={{ background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <p style={{ fontFamily: SFT, fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: '20px', flex: 1 }}>
            {linkedArticle?.title ?? 'Existing article'}
          </p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: SFT, background: 'var(--success-background)', color: 'var(--success-text)' }}>
              <SparkleIcon size={9} />
              AI suggested edit
            </span>
            <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>
              {formatRelativeTime(learning.detectedAt)}
            </span>
          </div>
        </div>

        {/* Gap description */}
        <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '18px' }}>
          {learning.gap}
        </p>

        {/* Source tickets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: SFT, fontSize: 11, color: 'var(--text-disabled)' }}>From</span>
          {learning.sourceTickets.map(t => (
            <span key={t.id} onClick={() => onTicketClick?.(t.id)} title={t.title} style={{
              fontFamily: SFT, fontSize: 11, color: 'var(--selected-text)',
              background: 'var(--selected-background)', borderRadius: 4, padding: '1px 6px',
              cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'underline', textDecorationColor: 'var(--selected-text)',
            }}>
              {t.id}
            </span>
          ))}
        </div>

        {/* Preview of suggested content */}
        {learning.suggestedBlocks?.[0] && (
          <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '18px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {learning.suggestedBlocks.find(b => b.type === 'p')?.text ?? learning.suggestedBlocks[0].text}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
          <button type="button" onClick={handleReview}
            style={{ height: 30, padding: '0 14px', fontSize: 12, fontFamily: SFT, fontWeight: 500, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', background: 'transparent', color: 'var(--text)', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Review edit
          </button>
          <button type="button" onClick={handleDismiss}
            style={{ height: 30, padding: '0 4px', fontSize: 12, fontFamily: SFT, fontWeight: 400, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-disabled)' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function DraftsTab({ projectId, allArticles }) {
  const allDrafts = KB_DRAFTS.filter(d => d.projectId === projectId);
  const updateSuggestions = KB_LEARNINGS.filter(l => l.projectId === projectId && l.type === 'update-article' && l.suggestedBlocks);
  const articleMap = Object.fromEntries((allArticles ?? []).map(a => [a.id, a]));
  const navigate = useNavigate();
  const [draftActions, setDraftActions] = useState({});
  const [dismissedUpdates, setDismissedUpdates] = useState({});

  function handleTicketClick(ticketId) { navigate(`/tickets/${ticketId}`); }
  function handleDraftAction(id, action) { setDraftActions(prev => ({ ...prev, [id]: action })); }
  function handleUpdateDismiss(id) { setDismissedUpdates(prev => ({ ...prev, [id]: true })); }

  const visibleDrafts = allDrafts.filter(d => draftActions[d.id] !== 'dismiss');
  const visibleUpdates = updateSuggestions.filter(l => !dismissedUpdates[l.id]);

  if (visibleDrafts.length === 0 && visibleUpdates.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-disabled)' }}>
        <SparkleIcon />
        <p style={{ fontFamily: SFT, fontSize: 13, margin: 0 }}>No AI drafts yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {visibleDrafts.length > 0 && (
        <>
          <p style={{ fontFamily: SFT, fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', margin: '4px 0 0', letterSpacing: '0.2px' }}>
            New articles · {visibleDrafts.length}
          </p>
          {visibleDrafts.map(d => (
            <DraftCard key={d.id} draft={d} onAction={handleDraftAction} onTicketClick={handleTicketClick} />
          ))}
        </>
      )}
      {visibleUpdates.length > 0 && (
        <>
          <p style={{ fontFamily: SFT, fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', margin: visibleDrafts.length > 0 ? '8px 0 0' : '4px 0 0', letterSpacing: '0.2px' }}>
            Article updates · {visibleUpdates.length}
          </p>
          {visibleUpdates.map(l => (
            <UpdateDraftCard
              key={l.id}
              learning={l}
              linkedArticle={l.linkedArticleId ? articleMap[l.linkedArticleId] : null}
              onDismiss={handleUpdateDismiss}
              onTicketClick={handleTicketClick}
            />
          ))}
        </>
      )}
    </div>
  );
}

function LearningsTab({ projectId, allArticles }) {
  const allLearnings = KB_LEARNINGS.filter(l => l.projectId === projectId);
  const articleMap = Object.fromEntries(allArticles.map(a => [a.id, a]));
  const navigate = useNavigate();

  function handleTicketClick(ticketId) { navigate(`/tickets/${ticketId}`); }
  const [learningStatuses, setLearningStatuses] = useState(() => {
    const s = {};
    allLearnings.forEach(l => { s[l.id] = l.status; });
    return s;
  });

  function handleLearningAction(id, action) {
    if (action === 'dismiss') setLearningStatuses(prev => ({ ...prev, [id]: 'dismissed' }));
    else if (action === 'create') setLearningStatuses(prev => ({ ...prev, [id]: 'reviewed' }));
  }

  if (allLearnings.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-disabled)' }}>
        <SparkleIcon />
        <p style={{ fontFamily: SFT, fontSize: 13, margin: 0 }}>No gaps detected yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {allLearnings.map(l => (
        <LearningCard
          key={l.id}
          learning={{ ...l, status: learningStatuses[l.id] ?? l.status }}
          linkedArticle={l.linkedArticleId ? articleMap[l.linkedArticleId] : null}
          onAction={handleLearningAction}
          onTicketClick={handleTicketClick}
        />
      ))}
    </div>
  );
}

// ─── KB Landing page ───────────────────────────────────────────────────────────

// Asana-style project icon colors per KB project
const PROJ_BG = { 'it-kb': '#E87264', 'hr-kb': '#4CA57E', 'eng-kb': '#4573D2', 'onb-kb': '#A97FD4' };

function KBProjectIcon({ project, size = 28 }) {
  const bg = PROJ_BG[project.id] ?? 'var(--text-disabled)';
  const iconSize = Math.round(size * 0.54);
  return (
    <div style={{
      width: size, height: size, borderRadius: 6, background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* List-rows icon — matches Asana list project icon */}
      <svg viewBox="0 0 14 12" width={iconSize} height={iconSize} fill="none" aria-hidden="true">
        <path d="M0 1.5h14M0 6h14M0 10.5h9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

const AGENT_HIDDEN_PROJECTS = new Set(['eng-kb', 'onb-kb']);
const articleCountByProject = Object.fromEntries(
  KB_PROJECTS.map(p => [p.id, KB_ARTICLES.filter(a => a.projectId === p.id).length])
);

function KBLandingPage({ isAgent }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const visibleProjects = isAgent
    ? KB_PROJECTS.filter(p => !AGENT_HIDDEN_PROJECTS.has(p.id))
    : KB_PROJECTS;

  const filtered = search
    ? visibleProjects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
    : visibleProjects;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background-weak)' }}>

      {/* ── Header ── */}
      <div style={{ flexShrink: 0, padding: '28px 32px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', margin: 0 }}>
          Browse knowledge bases
        </h1>
        {!isAgent && (
          <button
            type="button"
            style={{
              height: 32, padding: '0 14px', fontSize: 13, fontFamily: SFT, fontWeight: 500,
              borderRadius: 6, border: 'none', cursor: 'pointer',
              background: 'var(--selected-background-strong)', color: 'var(--selected-text-strong)',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'opacity 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 1v10M1 6h10"/>
            </svg>
            Create knowledge base
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div style={{ flexShrink: 0, padding: '0 32px 16px' }}>
        <div style={{ position: 'relative', maxWidth: 480 }}>
          <span style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Find a knowledge base…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 36, paddingLeft: 34, paddingRight: 12,
              fontSize: 13, fontFamily: SFT,
              border: '1px solid var(--border)', borderRadius: 8, outline: 'none',
              color: 'var(--text)', background: 'var(--surface)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--icon)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      {/* ── Table header ── */}
      <div style={{
        position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: '0 32px', height: 36,
        background: 'var(--surface)',
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 1, background: 'var(--border)', pointerEvents: 'none' }} />
        <span style={{ ...typoMeta, flex: 1, minWidth: 200, fontWeight: 500 }}>Name</span>
        <span style={{ ...typoMeta, width: 120, flexShrink: 0, fontWeight: 500 }}>Integration</span>
        <span style={{ ...typoMeta, width: 120, flexShrink: 0, fontWeight: 500 }}>Team</span>
        <span style={{ ...typoMeta, width: 120, flexShrink: 0, fontWeight: 500, textAlign: 'right' }}>Articles</span>
        <span style={{ ...typoMeta, width: 120, flexShrink: 0, fontWeight: 500, textAlign: 'right' }}>Last synced</span>
      </div>

      {/* ── Rows ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface)' }}>
        {filtered.map(proj => {
          const cfg = proj.source ? (INTEGRATION_CONFIG[proj.source.type] ?? {}) : null;
          const articleCount = articleCountByProject[proj.id] ?? 0;
          return (
            <div
              key={proj.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/knowledge-base/${proj.id}`)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/knowledge-base/${proj.id}`)}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                padding: '0 32px', height: 52,
                cursor: 'pointer', transition: 'background 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-weak)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}
            >
              <div style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 1, background: 'var(--border)', pointerEvents: 'none' }} />
              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
                <KBProjectIcon project={proj} size={28} />
                <span style={{ ...typoCell }}>{proj.name}</span>
              </div>

              {/* Integration */}
              <div style={{ width: 120, flexShrink: 0 }}>
                {cfg ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 7px', borderRadius: 4,
                    background: cfg.bg, fontSize: 11, fontWeight: 500, color: cfg.color, fontFamily: SFT,
                    whiteSpace: 'nowrap',
                  }}>
                    <SourceIcon type={proj.source.type} size={11} />
                    {cfg.label}
                  </span>
                ) : (
                  <span style={{ ...typoMeta }}>Internal</span>
                )}
              </div>

              {/* Team */}
              <div style={{ width: 120, flexShrink: 0 }}>
                <span style={{ ...typoCell, color: 'var(--text-weak)' }}>{proj.team}</span>
              </div>

              {/* Articles */}
              <div style={{ width: 120, flexShrink: 0, textAlign: 'right' }}>
                <span style={{ ...typoMeta }}>{articleCount}</span>
              </div>

              {/* Last synced */}
              <div style={{ width: 120, flexShrink: 0, textAlign: 'right' }}>
                <span style={{ ...typoMeta }}>
                  {proj.source ? formatRelativeTime(proj.source.syncedAt) : 'Never synced'}
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, fontFamily: SFT, fontSize: 13, color: 'var(--text-disabled)' }}>
            No knowledge bases match your search.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── KnowledgeBaseView ─────────────────────────────────────────────────────────

export default function KnowledgeBaseView({ role }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [manageOpen, setManageOpen] = useState(false);

  const activeTab = searchParams.get('tab') ?? 'articles';
  function setActiveTab(tab) {
    setSearchParams(tab === 'articles' ? {} : { tab }, { replace: false });
  }

  const isAgent = role === 'agent';

  const project = KB_PROJECTS.find(p => p.id === projectId);
  const allArticles = KB_ARTICLES.filter(a => a.projectId === projectId);
  const draftsCount = KB_DRAFTS.filter(d => d.projectId === projectId && d.status !== 'dismissed').length
    + KB_LEARNINGS.filter(l => l.projectId === projectId && l.type === 'update-article' && l.suggestedBlocks).length;
  const learningsCount = KB_LEARNINGS.filter(l => l.projectId === projectId && l.status === 'new').length;
  const searchFiltered = search
    ? allArticles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    : allArticles;
  const articles = applyFilters(searchFiltered, filters, KB_ACCESSORS);

  if (!projectId) {
    return <KBLandingPage isAgent={isAgent} />;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text-disabled)' }}>Knowledge base not found.</p>
      </div>
    );
  }

  const TABS = [
    { id: 'articles',  label: 'Articles',  count: allArticles.length },
    ...(!isAgent ? [
      { id: 'drafts',    label: 'Drafts',    count: draftsCount,    dot: draftsCount > 0 },
      { id: 'learnings', label: 'Learnings', count: learningsCount, dot: learningsCount > 0 },
    ] : []),
  ];

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-background-weak">

      {/* ── Header ── */}
      <div className="shrink-0 px-6 pt-7 pb-0">
        <div style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'} onClick={() => navigate('/knowledge-base')}>
            Knowledge Bases
          </span>
          <span style={{ color: 'var(--text-disabled)' }}>›</span>
          <span style={{ color: 'var(--text)' }}>{project.name}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <KBProjectIcon project={project} size={32} />
            <div>
              <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', margin: '0 0 4px' }}>
                {project.name}
              </h1>
              <p style={{ ...typoMeta, margin: 0 }}>
                {project.team} · {allArticles.length} article{allArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 2 }}>
            <IntegrationBadge
              source={project.source}
              onManage={() => setManageOpen(true)}
              onAdd={() => setManageOpen(true)}
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-border gap-6">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex items-center gap-1.5 pb-2.5 text-sm cursor-pointer border-0 bg-transparent whitespace-nowrap',
                  'transition-colors duration-150',
                  active
                    ? 'text-text font-medium shadow-[inset_0_-2px_0_var(--icon)]'
                    : 'text-text-weak hover:text-text',
                  'focus:outline-none',
                ].join(' ')}
              >
                {tab.label}
                <span className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
                  'rounded text-[11px] font-medium leading-none',
                  active ? 'bg-background-strong text-text' : 'bg-background-medium text-text-disabled',
                ].join(' ')}>
                  {tab.count}
                </span>
                {tab.dot && !active && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--selected-background-strong)', flexShrink: 0, marginLeft: -2 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'drafts' ? (
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-5">
          <DraftsTab projectId={projectId} allArticles={allArticles} />
        </div>
      ) : activeTab === 'articles' ? (
        <>
          {/* ── Toolbar ── */}
          <div className="shrink-0 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    height: 32, paddingLeft: 32, paddingRight: 12, fontSize: 13, fontFamily: SFT,
                    border: '1px solid var(--border)', borderRadius: 6, outline: 'none',
                    color: 'var(--text)', background: 'var(--background-weak)', width: 200,
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--icon)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FilterPanel
                  fields={KB_FILTER_FIELDS}
                  quickFilters={KB_QUICK_FILTERS}
                  filters={filters}
                  onChange={setFilters}
                />
                <button
                  type="button"
                  style={{
                    height: 32, padding: '0 10px', fontSize: 12, fontFamily: SFT,
                    borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: 'transparent', color: 'var(--text-weak)',
                    display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
                >
                  <SortIcon /> Sort
                </button>
              </div>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
            <div className="h-full overflow-auto" style={{ overscrollBehavior: 'none' }}>
              <div style={{ minWidth: '100%', width: 'max-content' }}>
                <TableHeader />
                {articles.length > 0
                  ? articles.map((article, i) => <TableRow key={article.id} article={article} index={i} onClick={() => navigate(`/knowledge-base/${projectId}/${article.id}`)} />)
                  : (
                    <div
                      className="flex items-center justify-center py-16 w-full"
                      style={{ borderBottom: '1px solid var(--border)', fontFamily: SFT, fontSize: 13, color: 'var(--text-disabled)' }}
                    >
                      {search ? 'No articles match your search.' : 'No articles yet.'}
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ── Learnings tab ── */
        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-5">
          <LearningsTab projectId={projectId} allArticles={allArticles} />
        </div>
      )}

      {/* ── Manage Integration Panel ── */}
      <RightPanelOverlay open={manageOpen} onClose={() => setManageOpen(false)} width="min(660px, 72%)">
        <ManageIntegrationPanel
          project={project}
          allArticles={allArticles}
          onClose={() => setManageOpen(false)}
        />
      </RightPanelOverlay>

    </div>
  );
}
