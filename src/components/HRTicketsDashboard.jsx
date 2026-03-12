import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pill from './Pill';
import StatCard from './StatCard';
import { HR_STATS, HR_TABS, HR_TICKETS, filterHRTickets } from '../data/tickets';
import TicketDetailView from './TicketDetailView';
import FilterPanel, { applyFilters } from './ui/FilterPanel';
import { SFT, SFM, LIGA } from '../constants/typography';
import { StatusIcon, SlaIcon, SlaCell, PriorityPill, PersonCell, typoTicketNo, typoName, typoPriority, typoStatus, typoUpdated } from './ui/TicketCells';

// ─── Filter config ────────────────────────────────────────────────────────────
const HR_FILTER_FIELDS = [
  { id: 'status',    label: 'Status',    type: 'select', options: ['Not started', 'In Progress', 'On hold', 'Investigating', 'Resolved'] },
  { id: 'priority',  label: 'Priority',  type: 'select', options: ['Critical', 'High', 'Medium', 'Low'] },
  { id: 'issueType', label: 'Issue type', type: 'select', options: ['Leave', 'Payroll', 'Benefits', 'Onboarding', 'Performance', 'Other'] },
  { id: 'assignee',  label: 'Assignee',  type: 'text' },
];

const HR_QUICK_FILTERS = [
  { id: 'open',     label: 'Open cases', rules: [{ field: 'status', op: 'is not', value: 'Resolved' }] },
  { id: 'critical', label: 'Critical',   rules: [{ field: 'priority', op: 'is', value: 'Critical' }] },
  { id: 'overdue',  label: 'Overdue',    rules: [{ field: 'status', op: 'is', value: 'On hold' }] },
];

const HR_ACCESSORS = {
  status:    t => t.status,
  priority:  t => t.priority,
  issueType: t => t.issueType,
  assignee:  t => t.assignee?.name ?? '',
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function MoreIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M16,13c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S14.3,13,16,13z
               M3,13c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S1.3,13,3,13z
               M29,13c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S27.3,13,29,13z" />
    </svg>
  );
}

function SearchInputIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="var(--text-disabled)" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="5" />
      <path d="M12 12l-2.5-2.5" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4-4 4 4M12 10l-4 4-4-4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 7h12M5 1v4M11 1v4" />
    </svg>
  );
}

// ─── Issue type pill ──────────────────────────────────────────────────────────

const ISSUE_TYPE_COLORS = {
  Leave:       { bg: '#EDE9FE', color: '#5B21B6' },
  Payroll:     { bg: '#FEF3C7', color: '#92400E' },
  Benefits:    { bg: '#DCFCE7', color: '#166534' },
  Onboarding:  { bg: '#DBEAFE', color: '#1D4ED8' },
  Performance: { bg: '#FEE2E2', color: '#991B1B' },
  Policy:      { bg: '#F3F4F6', color: '#6D6E6F' },
  Offboarding: { bg: '#FFF7ED', color: '#9A3412' },
};

function IssueTypePill({ type }) {
  const { bg, color } = ISSUE_TYPE_COLORS[type] ?? { bg: '#F3F4F6', color: '#6D6E6F' };
  return <Pill bg={bg} color={color} label={type} />;
}

// ─── Status cell ──────────────────────────────────────────────────────────────

function StatusCell({ status }) {
  return <Pill icon={<StatusIcon status={status} />} label={status} />;
}

// ─── Table ────────────────────────────────────────────────────────────────────
// Columns: Ticket # (120) · Name (280) · Issue Type (150) · Status (175) ·
//          Last Updated (155) · Priority (130) · Employee (165) · Assigned to (flex)

const COL  = 'text-xs font-medium text-text-weak px-2 py-2 text-left whitespace-nowrap flex items-center';
const CELL = 'px-2 flex items-center';
const divStyle = { borderRight: '1px solid var(--border)' };

function TableHeader() {
  return (
    <div
      className="flex items-stretch w-full bg-white sticky top-0 z-[2]"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className={`${COL} sticky left-0       bg-white z-[3] w-[120px] shrink-0`} style={divStyle}>Case number</div>
      <div className={`${COL} sticky left-[120px] bg-white z-[3] w-[280px] shrink-0`} style={divStyle}>Name</div>
      <div className={`${COL} w-[150px] shrink-0`} style={divStyle}>Issue type</div>
      <div className={`${COL} w-[175px] shrink-0`} style={divStyle}>Status</div>
      <div className={`${COL} w-[155px] shrink-0`} style={divStyle}>Last updated</div>
      <div className={`${COL} w-[101px] shrink-0`} style={divStyle}>SLA</div>
      <div className={`${COL} w-[130px] shrink-0`} style={divStyle}>Priority</div>
      <div className={`${COL} w-[165px] shrink-0`} style={divStyle}>Employee</div>
      <div className={`${COL} w-[165px] shrink-0`} style={divStyle}>Assigned to</div>
      <div className={`${COL} flex-1 min-w-[165px]`}>Requested by</div>
    </div>
  );
}

function TableRow({ ticket, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group flex items-stretch w-full h-[64px] bg-background-weak hover:bg-background-medium transition-colors cursor-pointer"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className={`${CELL} sticky left-0       z-[1] bg-background-weak group-hover:bg-background-medium w-[120px] shrink-0 flex items-center`}
           style={{ ...divStyle, ...typoTicketNo }}>
        {ticket.id}
      </div>
      <div className={`${CELL} sticky left-[120px] z-[1] bg-background-weak group-hover:bg-background-medium w-[280px] shrink-0 flex flex-col justify-center`}
           style={divStyle}>
        <div className="flex flex-col gap-0.5 w-full min-w-0" style={typoName}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="truncate">{ticket.name}</span>
          </div>
          <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-disabled)' }}>
            <CalendarIcon />
            {ticket.date}
          </span>
        </div>
      </div>
      <div className={`${CELL} w-[150px] shrink-0 flex items-center`} style={divStyle}>
        <IssueTypePill type={ticket.issueType} />
      </div>
      <div className={`${CELL} w-[175px] shrink-0 flex items-center`} style={{ ...divStyle, ...typoStatus }}>
        <StatusCell status={ticket.status} />
      </div>
      <div className={`${CELL} w-[155px] shrink-0 flex items-center`} style={{ ...divStyle, ...typoUpdated }}>
        {ticket.updated}
      </div>
      <div className={`${CELL} w-[101px] shrink-0 flex items-center`} style={divStyle}>
        <SlaCell sla={ticket.sla} slaType={ticket.slaType} />
      </div>
      <div className={`${CELL} w-[130px] shrink-0 flex items-center`} style={{ ...divStyle, ...typoPriority }}>
        <PriorityPill priority={ticket.priority} />
      </div>
      <div className={`${CELL} w-[165px] shrink-0 overflow-hidden flex items-center`} style={divStyle}>
        <PersonCell person={ticket.employee} />
      </div>
      <div className={`${CELL} w-[165px] shrink-0 overflow-hidden flex items-center`} style={divStyle}>
        <PersonCell person={ticket.assignee} />
      </div>
      <div className={`${CELL} flex-1 min-w-[165px] overflow-hidden`}>
        <PersonCell person={ticket.requester ?? ticket.employee} />
      </div>
    </div>
  );
}

// ─── HRTicketsDashboard ───────────────────────────────────────────────────────

export default function HRTicketsDashboard({ extraTickets = [], onHRCaseStatusChange, onGoToLinkedITTicket, deepLinkTicketId, onDeepLinkHandled, onURLBack = null, initialTab = 'All Cases' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [hrStatusOverrides, setHrStatusOverrides] = useState({});

  const allTickets = [...extraTickets, ...HR_TICKETS].map(t =>
    hrStatusOverrides[t.id] ? { ...t, status: hrStatusOverrides[t.id] } : t
  );

  useEffect(() => {
    if (!deepLinkTicketId) return;
    const found = allTickets.find(t => t.id === deepLinkTicketId);
    if (found) setSelectedTicket(found);
    onDeepLinkHandled?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkTicketId]);
  const rows = applyFilters(filterHRTickets(allTickets, activeTab, search), filters, HR_ACCESSORS);

  function handleHRStatusChange(newStatus) {
    if (!selectedTicket) return;
    setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    setHrStatusOverrides(prev => ({ ...prev, [selectedTicket.id]: newStatus }));
    const itTicketId = selectedTicket.linkedFromId ?? null;
    onHRCaseStatusChange?.(selectedTicket.id, itTicketId, newStatus);
  }

  if (selectedTicket) {
    return (
      <TicketDetailView
        ticket={selectedTicket}
        onBack={() => { setSelectedTicket(null); onURLBack?.(); }}
        onHRStatusChange={handleHRStatusChange}
        onGoToLinkedITTicket={onGoToLinkedITTicket}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-weak">

      {/* ── Stat cards ── */}
      <div className="shrink-0 px-6 pt-8 pb-6">
        <div className="flex gap-4">
          {HR_STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── Title + tabs + search ── */}
      <div className="shrink-0 px-6">

        <h2 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: '#1E1F21', margin: '0 0 16px' }}>Case feed</h2>

        {/* Tab bar */}
        <div className="flex border-b border-border gap-6">
          {HR_TABS.map(tab => {
            const count = filterHRTickets(allTickets, tab, '').length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  'flex items-center gap-1.5 pb-2.5 text-sm cursor-pointer border-0 bg-transparent whitespace-nowrap',
                  'transition-colors duration-150',
                  isActive
                    ? 'text-text font-medium shadow-[inset_0_-2px_0_var(--icon)]'
                    : 'text-text-weak hover:text-text',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                ].join(' ')}
              >
                {tab}
                <span className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
                  'rounded text-[11px] font-medium leading-none',
                  isActive ? 'bg-background-strong text-text' : 'bg-background-medium text-text-disabled',
                ].join(' ')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + filter row */}
        <div className="flex flex-wrap items-center justify-between py-4 gap-3">
          <div className="relative w-96">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none">
              <SearchInputIcon />
            </span>
            <input
              type="text"
              placeholder="Search by name or case ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-8 pl-9 pr-3 text-sm border border-border rounded-md
                         bg-background-weak text-text placeholder:text-text-disabled
                         focus:outline-none focus:border-icon
                         transition-colors duration-150"
            />
          </div>

          <div className="flex items-center gap-1">
            <FilterPanel
              fields={HR_FILTER_FIELDS}
              quickFilters={HR_QUICK_FILTERS}
              filters={filters}
              onChange={setFilters}
            />
            <button type="button"
              className="flex items-center gap-1.5 px-3 h-8 text-sm text-text-weak
                         border-0 bg-transparent rounded-md cursor-pointer
                         hover:bg-background-medium hover:text-text transition-colors">
              <SortIcon /> Sort
            </button>
            <button type="button" aria-label="More options"
              className="w-8 h-8 flex items-center justify-center text-text-weak
                         border-0 bg-transparent rounded-md cursor-pointer
                         hover:bg-background-medium hover:text-text transition-colors">
              <MoreIcon />
            </button>
          </div>
        </div>

      </div>

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <div
          className="h-full overflow-auto"
          style={{ overscrollBehavior: 'none' }}
        >
          <div style={{ minWidth: '100%', width: 'max-content' }}>
            <TableHeader />
            {rows.length > 0
              ? rows.map(t => <TableRow key={t.id} ticket={t} onClick={() => navigate(`/hr-tickets/${t.id}`)} />)
              : (
                <div
                  className="flex items-center justify-center py-16 w-full text-sm text-text-disabled"
                  style={{ borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}
                >
                  No cases match your search.
                </div>
              )
            }
          </div>
        </div>
      </div>

    </div>
  );
}
