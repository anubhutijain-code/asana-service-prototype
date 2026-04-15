import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pill from './Pill';
import StatCard from './StatCard';
import { STATS, TABS, filterTickets, HR_TICKETS } from '../data/tickets';
import { useTickets } from '../store/useTickets';
import { useAppStore } from '../store/AppStore';
import TicketDetailView from './TicketDetailView';
import FilterPanel, { applyFilters } from './ui/FilterPanel';
import { SFT, SFM, LIGA } from '../constants/typography';
import { StatusIcon, SlaIcon, SlaCell, PriorityPill, PersonCell, typoTicketNo, typoName, typoPriority, typoStatus, typoUpdated } from './ui/TicketCells';
import TicketMoreMenu from './ui/TicketMoreMenu';

// ─── Filter config ────────────────────────────────────────────────────────────
const TICKET_FIELDS = [
  { id: 'status',   label: 'Status',   type: 'select', options: ['Not started', 'In Progress', 'On hold', 'Resolved', 'Closed', 'AI Deflected'] },
  { id: 'priority', label: 'Priority', type: 'select', options: ['Critical', 'High', 'Medium', 'Low'] },
  { id: 'category', label: 'Category', type: 'select', options: ['Access Management', 'Hardware', 'Software', 'Network', 'Other'] },
  { id: 'assignee', label: 'Assignee', type: 'text' },
];

const TICKET_QUICK_FILTERS = [
  { id: 'open',     label: 'Open tickets', rules: [{ field: 'status', op: 'is not', value: 'Resolved' }] },
  { id: 'critical', label: 'Critical',     rules: [{ field: 'priority', op: 'is', value: 'Critical' }] },
  { id: 'unassigned', label: 'Unassigned', rules: [{ field: 'assignee', op: 'is', value: '' }] },
];

const TICKET_ACCESSORS = {
  status:   t => t.status,
  priority: t => t.priority,
  category: t => t.category,
  assignee: t => t.assignee?.name ?? '',
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

function ImageAttachmentIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <circle cx="5.5" cy="7" r="1.5" />
      <path d="M1 11l4-4 3 3 2-2 5 4.5" />
    </svg>
  );
}

// ─── Status cell — uses existing Pill + StatusIcon ────────────────────────────

function StatusCell({ status }) {
  if (status === 'Routed') return <Pill icon={<StatusIcon status={status} />} label={status} bg="var(--priority-low-bg)" color="var(--priority-low-text)" />;
  return <Pill icon={<StatusIcon status={status} />} label={status} />;
}

// ─── Table ────────────────────────────────────────────────────────────────────
// Row widths:  120 + 300 + 130 + 175 + 155 + 101 + 165 + flex
// Frozen cols: sticky left-0 (120px) · sticky left-[120px] (300px)

const COL  = 'text-xs font-medium text-text-weak px-2 py-2 text-left whitespace-nowrap flex items-center';
const CELL = 'px-2 flex items-center';
const divStyle = { borderRight: '1px solid var(--border)' };

function TableHeader() {
  return (
    <div
      className="flex items-stretch w-full bg-[var(--surface)] sticky top-0 z-[2]"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className={`${COL} sticky left-0       bg-[var(--surface)] z-[3] w-[120px] shrink-0`} style={divStyle}>Ticket number</div>
      <div className={`${COL} sticky left-[120px] bg-[var(--surface)] z-[3] w-[300px] shrink-0`} style={divStyle}>Name</div>
      <div className={`${COL} w-[130px] shrink-0`} style={divStyle}>Priority</div>
      <div className={`${COL} w-[175px] shrink-0`} style={divStyle}>Status</div>
      <div className={`${COL} w-[155px] shrink-0`} style={divStyle}>Last updated</div>
      <div className={`${COL} w-[101px] shrink-0`} style={divStyle}>SLA</div>
      <div className={`${COL} w-[165px] shrink-0`} style={divStyle}>Assigned to</div>
      <div className={`${COL} flex-1 min-w-[165px]`}>Requested by</div>
    </div>
  );
}

function TableRow({ ticket, onClick, onMoreAction }) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-stretch w-full h-[64px] bg-background-weak hover:bg-background-medium transition-colors cursor-pointer"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className={`${CELL} sticky left-0       z-[1] bg-background-weak group-hover:bg-background-medium w-[120px] shrink-0 flex items-center`}
           style={{ ...divStyle, ...typoTicketNo }}>
        {ticket.id}
      </div>
      <div className={`${CELL} sticky left-[120px] z-[1] bg-background-weak group-hover:bg-background-medium w-[300px] shrink-0 flex flex-col justify-center`}
           style={divStyle}>
        <div className="flex flex-col gap-0.5 w-full min-w-0" style={typoName}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="truncate">{ticket.name}</span>
            {ticket.hasImage && (
              <span className="shrink-0 text-text-disabled"><ImageAttachmentIcon /></span>
            )}
          </div>
          <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-disabled)' }}>
            <CalendarIcon />
            {ticket.date}
          </span>
        </div>
      </div>
      <div className={`${CELL} w-[130px] shrink-0 flex items-center`} style={{ ...divStyle, ...typoPriority }}>
        <PriorityPill priority={ticket.priority} />
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
      <div className={`${CELL} w-[165px] shrink-0 overflow-hidden flex items-center`} style={divStyle}>
        <PersonCell person={ticket.assignee} />
      </div>
      <div className={`${CELL} flex-1 min-w-[165px] overflow-hidden`}>
        <PersonCell person={ticket.requester} />
      </div>
      {/* More button — floats over right side on row hover */}
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-[2]"
        onClick={e => e.stopPropagation()}
      >
        <TicketMoreMenu ticketId={ticket.id} onAction={onMoreAction} />
      </div>
    </div>
  );
}

// ─── TicketsDashboard ─────────────────────────────────────────────────────────
// Layout: flex-col h-full so the table area fills the remaining viewport.
// Stats + tabs + search are shrink-0 — always visible, never scroll away.
// Only the table rows scroll, inside a single overflow:auto container.
// That container is also the sticky context for the header and frozen cols.

export default function TicketsDashboard({ onRouteToHR = () => {}, onCreateHRTicket = () => {}, deepLinkTicketId = null, onDeepLinkHandled = () => {}, onURLBack = null, linkedHRTickets = {}, onLinkHRTicket = () => {}, onGoToLinkedHRTicket, initialTab = 'My Tickets' }) {
  const navigate = useNavigate();
  const { dispatch } = useAppStore();
  const tickets = useTickets();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  function handleMoreAction(actionId, ticketId) {
    if (actionId === 'mark_resolved') {
      dispatch({ type: 'UPDATE_TICKET', id: ticketId, patch: { status: 'Resolved', resolvedAt: Date.now() } });
    } else if (actionId === 'close_and_move') {
      dispatch({ type: 'UPDATE_TICKET', id: ticketId, patch: { status: 'Closed', resolvedAt: Date.now() } });
      navigate('/projects/it-escalations');
    }
  }

  // Auto-open a ticket navigated to from the HR ticket banner
  useEffect(() => {
    if (!deepLinkTicketId) return;
    const found = tickets.find(t => t.id === deepLinkTicketId);
    if (found) setSelectedTicket(found);
    onDeepLinkHandled();
  }, [deepLinkTicketId]);

  // Routed tickets leave the IT queue entirely — they live in HR now
  const queueTickets = tickets.filter(t => t.status !== 'Routed');
  const rows = applyFilters(filterTickets(queueTickets, activeTab, search), filters, TICKET_ACCESSORS);

  function handleRouteComplete(ticket, chatSnapshot, notes) {
    dispatch({ type: 'UPDATE_TICKET', id: ticket.id, patch: { status: 'Routed', routedToHR: true } });
    const nextHRNum = HR_TICKETS.reduce((m, t) => Math.max(m, parseInt(t.id.split('-')[1], 10)), 0) + 1;
    const emp = ticket.submitter?.name ?? ticket.requester?.name ?? 'the employee';
    const org = ticket.submitter?.org ?? '';

    // ── Context note: what IT knows, passed to HR ──────────────────────────
    const contextLines = [`Routed from IT queue (${ticket.id}).`];
    if (ticket.aiSummary) contextLines.push('', ticket.aiSummary);
    if (notes?.trim())    contextLines.push('', `IT agent notes: ${notes.trim()}`);
    const contextNote = {
      type: 'inbound', name: 'HR Agent', time: 'just now',
      svgSrc: `${import.meta.env.BASE_URL}avatars/Teammate1.svg`,
      text: contextLines.join('\n'),
    };

    // ── Recommended next steps: category-specific ──────────────────────────
    const cat = (ticket.category ?? '').toLowerCase();
    let steps;
    if (cat === 'payroll') {
      steps = `1. Review ${emp}'s payroll records for the period in question and confirm whether the discrepancy is valid.\n2. If confirmed, process a corrected payment and notify ${emp} directly of the resolution.\n3. Update this ticket with the outcome so IT can close their linked case.`;
    } else if (cat === 'software access') {
      steps = `1. Confirm ${emp}'s current department and role in your HR system.\n2. Verify the department transfer is marked as complete (not pending) — this is what's blocking the licence sync.\n3. Once confirmed, reply here so IT can apply the correct licence immediately.\n4. Update this ticket with the outcome.`;
    } else {
      steps = `1. Review the context above and assess what HR action is required.\n2. Contact ${emp} directly if you need any further information.\n3. Take the appropriate action and update this ticket with the outcome.`;
    }
    const stepsNote = {
      type: 'inbound', name: 'HR Agent', time: 'just now',
      svgSrc: `${import.meta.env.BASE_URL}avatars/Teammate1.svg`,
      text: `Suggested next steps:\n\n${steps}`,
    };

    // ── HR-focused AI summary for the sidebar ─────────────────────────────
    let hrSummary;
    if (cat === 'payroll') {
      hrSummary = `${emp}${org ? ` (${org})` : ''} has reported a payroll discrepancy, routed from the IT help desk (${ticket.id}). HR to review records, confirm the discrepancy, and process a corrected payment if applicable.`;
    } else if (cat === 'software access') {
      hrSummary = `IT has routed a licence or access issue for ${emp}${org ? ` (${org})` : ''} that is blocked pending HR confirmation of a department transfer. Once HR marks the transfer as complete, IT can apply the fix immediately. Ref: ${ticket.id}.`;
    } else {
      hrSummary = `Case routed from IT queue (${ticket.id}) for HR resolution.${org ? ` Employee: ${emp}, ${org}.` : ''} See internal notes for full context and recommended next steps.`;
    }

    const hrTicket = {
      id: `HR-0${nextHRNum}`,
      date: 'Feb 24, 2026',
      name: ticket.name,
      issueType: ticket.category ?? 'General',
      priority: ticket.priority,
      status: 'Not started',
      updated: 'just now',
      sla: '2d',
      slaType: 'normal',
      assignee: null,
      employee: ticket.requester,
      requester: ticket.requester,
      submitter: ticket.submitter,
      category: ticket.category,
      aiSummary: hrSummary,
      // IT public chat becomes the collapsible "Prior conversation" block;
      // HR agents start with a clean public thread below it.
      initPublic: [],
      initTranscript: chatSnapshot.public,
      initInternal: [contextNote, stepsNote],
      routedFromId: ticket.id,
    };
    onLinkHRTicket(ticket.id, hrTicket);
    onRouteToHR(hrTicket);
  }

  function handleITStatusChange(newStatus) {
    if (!selectedTicket) return;
    const isResolved = newStatus === 'Resolved' || newStatus === 'Closed';
    dispatch({ type: 'UPDATE_TICKET', id: selectedTicket.id, patch: {
      status: newStatus,
      ...(isResolved ? { resolvedAt: Date.now() } : {}),
    }});
  }

  function handleCreateHRComplete(ticket, chatSnapshot, notes) {
    const base = HR_TICKETS.reduce((m, t) => Math.max(m, parseInt(t.id.split('-')[1], 10)), 0);
    const nextHRNum = base + Object.keys(linkedHRTickets).length + 1;
    const emp = ticket.submitter?.name ?? ticket.requester?.name ?? 'the employee';
    const org = ticket.submitter?.org ?? '';

    // ── Context note: what IT knows, passed to HR ──────────────────────────
    const contextLines = [`Referred from IT queue (${ticket.id}).`];
    if (ticket.aiSummary) contextLines.push('', ticket.aiSummary);
    if (notes.trim())     contextLines.push('', `IT agent notes: ${notes.trim()}`);
    const contextNote = {
      type: 'inbound', name: 'HR Agent', time: 'just now',
      svgSrc: `${import.meta.env.BASE_URL}avatars/Teammate1.svg`,
      text: contextLines.join('\n'),
    };

    // ── Recommended next steps: category-specific ──────────────────────────
    const cat = (ticket.category ?? '').toLowerCase();
    let steps;
    if (cat === 'payroll') {
      steps = `1. Review ${emp}'s payroll records for the period in question and confirm whether the discrepancy is valid.\n2. If confirmed, process a corrected payment and notify ${emp} directly of the resolution.\n3. Update this ticket with the outcome so IT can close their linked case.`;
    } else if (cat === 'software access') {
      steps = `1. Confirm ${emp}'s current department and role in your HR system.\n2. Verify the department transfer is marked as complete (not pending) — this is what's blocking the licence sync.\n3. Once confirmed, reply here so IT can apply the correct licence immediately.\n4. Update this ticket with the outcome.`;
    } else {
      steps = `1. Review the context above and assess what HR action is required.\n2. Contact ${emp} directly if you need any further information.\n3. Take the appropriate action and update this ticket with the outcome.`;
    }
    const stepsNote = {
      type: 'inbound', name: 'HR Agent', time: 'just now',
      svgSrc: `${import.meta.env.BASE_URL}avatars/Teammate1.svg`,
      text: `Suggested next steps:\n\n${steps}`,
    };

    // ── HR-focused AI summary for the sidebar ─────────────────────────────
    let hrSummary;
    if (cat === 'payroll') {
      hrSummary = `${emp}${org ? ` (${org})` : ''} has reported a payroll discrepancy, referred from the IT help desk (${ticket.id}). HR to review records, confirm the discrepancy, and process a corrected payment if applicable.`;
    } else if (cat === 'software access') {
      hrSummary = `IT has referred a licence or access issue for ${emp}${org ? ` (${org})` : ''} that is blocked pending HR confirmation of a department transfer. Once HR marks the transfer as complete, IT can apply the fix immediately. Ref: ${ticket.id}.`;
    } else {
      hrSummary = `Case referred from IT queue (${ticket.id}) for HR attention.${org ? ` Employee: ${emp}, ${org}.` : ''} See internal notes for full context and recommended next steps.`;
    }

    const hrTicket = {
      id: `HR-0${nextHRNum}`,
      date: 'Feb 24, 2026',
      name: ticket.name,
      issueType: ticket.category ?? 'General',
      priority: ticket.priority,
      status: 'Not started',
      updated: 'just now',
      sla: '2d',
      slaType: 'normal',
      assignee: null,
      employee: ticket.requester,
      requester: ticket.requester,
      submitter: ticket.submitter,
      category: ticket.category,
      aiSummary: hrSummary,
      initPublic: [],
      initTranscript: [],    // fresh ticket — no prior IT chat shown
      initInternal: [contextNote, stepsNote],
      linkedFromId: ticket.id,
    };
    onLinkHRTicket(ticket.id, hrTicket);
    onCreateHRTicket(hrTicket);
  }

  if (selectedTicket) {
    return (
      <TicketDetailView
        ticket={selectedTicket}
        onBack={() => { setSelectedTicket(null); onURLBack?.(); }}
        onAddLinkedHRTicket={(hrTicket) => {
          onLinkHRTicket(selectedTicket.id, hrTicket);
          onCreateHRTicket(hrTicket);
        }}
        onRouteComplete={handleRouteComplete}
        onCreateHRTicket={handleCreateHRComplete}
        onITStatusChange={handleITStatusChange}
        hrLinkedTicket={linkedHRTickets[selectedTicket?.id] ?? null}
        onGoToLinkedHRTicket={onGoToLinkedHRTicket}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-weak">

      {/* ── Stat cards — always visible ──────────────────────────────────── */}
      <div className="shrink-0 px-6 pt-8 pb-6">
        <div className="flex gap-4">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── Ticket feed title + tabs + search — always visible ───────────── */}
      <div className="shrink-0 px-6">

        <h2 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', margin: '0 0 16px' }}>Ticket feed</h2>

        {/* Tab bar */}
        <div className="flex border-b border-border gap-6">
          {TABS.map(tab => {
            const count = filterTickets(queueTickets, tab, '').length;
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

        {/* Search + filter row — flex-wrap so controls stack on narrow viewports */}
        <div className="flex flex-wrap items-center justify-between py-4 gap-3">
          <div className="relative w-96">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none">
              <SearchInputIcon />
            </span>
            <input
              type="text"
              placeholder="Search by name or ticket ID…"
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
              fields={TICKET_FIELDS}
              quickFilters={TICKET_QUICK_FILTERS}
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

      {/* ── Table — fills remaining height, rows scroll inside ───────────── */}
      {/*
          Single overflow:auto container = the sticky context for both axes:
            • sticky top-0  on the header → sticks at the top of this div
            • sticky left-0 on frozen cols → sticks at the left of this div
          overscrollBehavior:'none' as inline style kills macOS rubber-band bounce
          (Tailwind class alone is unreliable in Safari; inline style is applied directly). */}
      <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <div
          className="h-full overflow-auto"
          style={{ overscrollBehavior: 'none' }}
        >
          <div style={{ minWidth: '100%', width: 'max-content' }}>
            <TableHeader />
            {rows.length > 0
              ? rows.map((t, i) => (
                  <TableRow
                    key={t.id}
                    ticket={t}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    onMoreAction={handleMoreAction}
                  />
                ))
              : (
                <div
                  className="flex items-center justify-center py-16 w-full text-sm text-text-disabled"
                  style={{ borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}
                >
                  No tickets match your search.
                </div>
              )
            }
          </div>
        </div>
      </div>

    </div>
  );
}
