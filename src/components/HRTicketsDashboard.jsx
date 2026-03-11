import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pill from './Pill';
import StatCard from './StatCard';
import Avatar from './ui/Avatar';
import { HR_STATS, HR_TABS, HR_TICKETS, filterHRTickets } from '../data/tickets';
import TicketDetailView from './TicketDetailView';
import FilterPanel, { applyFilters } from './ui/FilterPanel';

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

function FilterIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 4h12M4 8h8M6 12h4" />
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

// ─── Status icons ─────────────────────────────────────────────────────────────

function StatusIcon({ status }) {
  if (status === 'Not started') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M10 8C7.7945 8 6 9.7945 6 12C6 14.2055 7.7945 16 10 16C12.2055 16 14 14.2055 14 12C14 9.795 12.2055 8 10 8ZM10 15C8.3455 15 7 13.6545 7 12C7 10.3455 8.3455 9 10 9C11.6545 9 13 10.3455 13 12C13 13.6545 11.6545 15 10 15Z" fill="#6D6E6F"/>
    </svg>
  );
  if (status === 'On hold') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M10 6C6.692 6 4 8.6915 4 12C4 15.3085 6.692 18 10 18C13.309 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.2435 17 5 14.757 5 12C5 9.243 7.2435 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12 9.5L12 14.5C12 14.6326 11.9473 14.7598 11.8536 14.8536C11.7598 14.9473 11.6326 15 11.5 15C11.3674 15 11.2402 14.9473 11.1464 14.8536C11.0527 14.7598 11 14.6326 11 14.5L11 9.5C11 9.36739 11.0527 9.24021 11.1464 9.14645C11.2402 9.05268 11.3674 9 11.5 9C11.6326 9 11.7598 9.05268 11.8536 9.14645C11.9473 9.24021 12 9.36739 12 9.5ZM9 9.5L9 14.5C9 14.6326 8.94732 14.7598 8.85355 14.8536C8.75979 14.9473 8.63261 15 8.5 15C8.36739 15 8.24021 14.9473 8.14645 14.8536C8.05268 14.7598 8 14.6326 8 14.5L8 9.5C8 9.36739 8.05268 9.24021 8.14645 9.14645C8.24021 9.05268 8.36739 9 8.5 9C8.63261 9 8.75979 9.05268 8.85355 9.14645C8.94732 9.24021 9 9.36739 9 9.5Z" fill="#F1BD6C"/>
    </svg>
  );
  if (status === 'Investigating') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <circle cx="10" cy="12" r="5.5" stroke="#79ABFF"/>
      <path d="M7 12H13M13 12L11 10M13 12L11 14" stroke="#79ABFF" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (status === 'Resolved') return (
    <svg viewBox="4 6 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d="M10 6C6.6915 6 4 8.6915 4 12C4 15.3085 6.6915 18 10 18C13.3085 18 16 15.3085 16 12C16 8.6915 13.3085 6 10 6ZM10 17C7.243 17 5 14.757 5 12C5 9.243 7.243 7 10 7C12.757 7 15 9.243 15 12C15 14.757 12.757 17 10 17ZM12.8535 10.1465C12.9 10.1929 12.9368 10.248 12.962 10.3087C12.9872 10.3693 13.0001 10.4343 13.0001 10.5C13.0001 10.5657 12.9872 10.6307 12.962 10.6913C12.9368 10.752 12.9 10.8071 12.8535 10.8535L9.52 14.187C9.47367 14.2336 9.41859 14.2706 9.35793 14.2958C9.29726 14.321 9.2322 14.334 9.1665 14.334C9.1008 14.334 9.03574 14.321 8.97507 14.2958C8.91441 14.2706 8.85933 14.2336 8.813 14.187L7.1465 12.52C7.05275 12.4262 7.00008 12.2991 7.00008 12.1665C7.00008 12.0339 7.05275 11.9068 7.1465 11.813C7.24025 11.7192 7.36741 11.6666 7.5 11.6666C7.63259 11.6666 7.75975 11.7192 7.8535 11.813L9.1665 13.1265L12.1465 10.1465C12.1929 10.1 12.248 10.0632 12.3087 10.038C12.3693 10.0128 12.4343 9.9999 12.5 9.9999C12.5657 9.9999 12.6307 10.0128 12.6913 10.038C12.752 10.0632 12.8071 10.1 12.8535 10.1465Z" fill="#58A182"/>
    </svg>
  );
  return null;
}

// ─── SLA icon ─────────────────────────────────────────────────────────────────

const SLA_RING      = "M20 14.0001C20 17.3129 17.3137 19.9984 14 19.9984C10.6863 19.9984 8 17.3129 8 14.0001C8 10.6873 10.6863 8.00171 14 8.00171C17.3137 8.00171 20 10.6873 20 14.0001ZM9.14 14.0001C9.14 16.6834 11.3159 18.8587 14 18.8587C16.6841 18.8587 18.86 16.6834 18.86 14.0001C18.86 11.3167 16.6841 9.1414 14 9.1414C11.3159 9.1414 9.14 11.3167 9.14 14.0001Z";
const SLA_ARC_LEFT   = "M8.83576 12.322C8.53637 12.2248 8.21195 12.3883 8.14351 12.6956C7.97981 13.4305 7.95554 14.1915 8.07387 14.9386C8.22199 15.8738 8.58935 16.7607 9.1459 17.5267C9.70245 18.2927 10.4324 18.9162 11.2761 19.346C11.95 19.6894 12.6812 19.9015 13.4308 19.9729C13.7442 20.0028 14 19.7448 14 19.43C14 19.1152 13.7439 18.8634 13.4313 18.8266C12.8618 18.7595 12.3072 18.592 11.7936 18.3303C11.1102 17.9821 10.519 17.4771 10.0682 16.8566C9.61737 16.2362 9.31981 15.5178 9.19984 14.7603C9.10967 14.191 9.12172 13.6117 9.23388 13.0494C9.29546 12.7406 9.13516 12.4193 8.83576 12.322Z";
const SLA_ARC_BOTTOM = "M12.322 19.1674C12.2248 19.4668 12.3883 19.7912 12.6956 19.8597C13.4305 20.0234 14.1915 20.0476 14.9386 19.9293C15.8738 19.7812 16.7607 19.4138 17.5267 18.8573C18.2927 18.3007 18.9162 17.5708 19.346 16.7271C19.6894 16.0532 19.9015 15.3219 19.9729 14.5723C20.0028 14.2589 19.7448 14.0032 19.43 14.0032C19.1152 14.0032 18.8634 14.2592 18.8266 14.5719C18.7595 15.1413 18.592 15.696 18.3303 16.2096C17.9821 16.8929 17.4771 17.4842 16.8566 17.935C16.2362 18.3858 15.5178 18.6834 14.7603 18.8033C14.191 18.8935 13.6117 18.8815 13.0494 18.7693C12.7406 18.7077 12.4193 18.868 12.322 19.1674Z";
const SLA_ARC_RIGHT  = "M19.1642 15.6811C19.4636 15.7784 19.788 15.6149 19.8565 15.3076C20.0202 14.5726 20.0445 13.8116 19.9261 13.0646C19.778 12.1294 19.4107 11.2425 18.8541 10.4765C18.2976 9.71043 17.5676 9.087 16.7239 8.65713C16.05 8.31374 15.3188 8.10166 14.5692 8.03023C14.2558 8.00037 14 8.25837 14 8.57317C14 8.88798 14.2561 9.13972 14.5687 9.17656C15.1382 9.24366 15.6928 9.4112 16.2064 9.67288C16.8898 10.0211 17.481 10.5261 17.9318 11.1465C18.3826 11.767 18.6802 12.4854 18.8002 13.2429C18.8903 13.8122 18.8783 14.3915 18.7661 14.9538C18.7045 15.2625 18.8648 15.5839 19.1642 15.6811Z";

function SlaIcon({ type }) {
  const arcs = type === 'overdue'
    ? [{ d: SLA_ARC_RIGHT,  fill: '#DE5F73' }]
    : type === 'warning'
    ? [{ d: SLA_ARC_BOTTOM, fill: '#F1BD6C' }, { d: SLA_ARC_RIGHT, fill: '#F1BD6C' }]
    : [{ d: SLA_ARC_LEFT,   fill: '#6D6E6F' }, { d: SLA_ARC_BOTTOM, fill: '#6D6E6F' }, { d: SLA_ARC_RIGHT, fill: '#6D6E6F' }];
  return (
    <svg viewBox="8 8 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path d={SLA_RING} fill="#EDEAE9"/>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.fill}/>)}
    </svg>
  );
}

// ─── Cell typography constants ────────────────────────────────────────────────

const LIGA = { fontFeatureSettings: "'liga' off, 'clig' off" };
const SFT  = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SFM  = '"SF Mono", ui-monospace, "Cascadia Code", monospace';

const typoTicketNo = { fontFamily: SFM, fontSize: '12px', fontWeight: 500, lineHeight: '22px', color: 'var(--text-disabled)', ...LIGA };
const typoName     = { fontFamily: SFT, fontSize: '14px', fontWeight: 400, lineHeight: '22px', letterSpacing: '-0.15px', color: 'var(--text)', ...LIGA };
const typoPriority = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA };
const typoStatus   = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text)', ...LIGA };
const typoUpdated  = { fontFamily: SFT, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA };
const typoPerson   = { fontFamily: SFT, fontSize: '14px', fontWeight: 400, lineHeight: '22px', letterSpacing: '-0.15px', color: 'var(--text)', ...LIGA };

// ─── Priority pill ────────────────────────────────────────────────────────────

const PRIORITY_COLORS = {
  Critical: { bg: '#FEF3C7', color: '#92400E' },
  Medium:   { bg: '#DBEAFE', color: '#1D4ED8' },
  Low:      { bg: '#F3F4F6', color: '#6D6E6F' },
};

function PriorityPill({ priority }) {
  const { bg, color } = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.Low;
  return <Pill bg={bg} color={color} label={priority} />;
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

// ─── SLA cell ─────────────────────────────────────────────────────────────────

const SLA_TEXT_COLOR = { normal: 'var(--text-weak)', warning: 'var(--text-weak)', overdue: 'var(--danger-text)' };

function SlaCell({ sla, slaType }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: SLA_TEXT_COLOR[slaType] }}>
      <SlaIcon type={slaType} />
      {sla}
    </span>
  );
}

// ─── Person cell ──────────────────────────────────────────────────────────────

const AVATAR = { width: 24, height: 24, flexShrink: 0, borderRadius: '50%' };

function PersonCell({ person }) {
  if (!person) {
    return (
      <span className="flex items-center gap-2" style={{ ...typoPerson, color: 'var(--text-disabled)' }}>
        <span style={{ width: 24, height: 24, flexShrink: 0, borderRadius: '50%', border: '1px dashed var(--border-strong)', background: 'var(--background-medium)' }} />
        Unassigned
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 truncate" style={typoPerson}>
      <Avatar name={person.name} size={24} bg={person.bg ? `#${person.bg}` : undefined} />
      <span className="truncate">{person.name}</span>
    </span>
  );
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
              ? rows.map((t, i) => <TableRow key={t.id + i} ticket={t} onClick={() => navigate(`/hr-tickets/${t.id}`)} />)
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
