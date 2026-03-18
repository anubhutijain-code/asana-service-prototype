// ─── Agent My Tickets — 3-column pane ────────────────────────────────────────
// Col 1: compact list  Col 2: TicketChatPanel  Col 3: TicketInfoSidebar

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketChatPanel from './TicketChatPanel';
import TicketInfoSidebar from './TicketInfoSidebar';
import TicketMoreMenu from './ui/TicketMoreMenu';
import CloseAndMoveModal from './CloseAndMoveModal';
import { useAppStore } from '../store/AppStore';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ── Mock data ─────────────────────────────────────────────────────────────────

const MY_TICKETS = [
  {
    id: 'mt1',
    title: 'MacBook overheating — kernel_task 100% CPU',
    time: '1h ago',
    requestedBy: 'Jordan Ellis',
    initials: 'JE',
    color: '#4573D2',
    ticket: {
      id: 'IT-4917',
      name: 'MacBook Pro overheating — kernel_task consuming 100% CPU',
      status: 'In Progress',
      priority: 'Critical',
      category: 'Hardware',
      sla: '1h remaining',
      slaType: 'warning',
      date: 'Today',
      updated: '1h ago',
      assignee: { name: 'Sarah Kim', initials: 'SK', bg: '5DA182', fg: 'ffffff' },
      requester: { name: 'Jordan Ellis', initials: 'JE', bg: '4573D2', fg: 'ffffff' },
      submitter: { name: 'Jordan Ellis', email: 'j.ellis@acme.com', location: 'Austin', org: 'Engineering', deviceId: 'MBP-7834' },
      aiSummary: 'Jordan Ellis reports their MacBook Pro is severely overheating with kernel_task consuming over 100% CPU. The machine is throttling heavily and becoming unusable. Likely caused by a thermal management issue post-OS update.',
      initPublic: [
        { type: 'inbound', name: 'Jordan Ellis', time: '2h ago', bg: '4573D2', fg: 'ffffff', initials: 'JE',
          text: "My MacBook Pro has been running incredibly hot all morning. kernel_task is at 100%+ CPU and the machine is almost completely unresponsive. I have a deadline today." },
        { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: '1.5h ago',
          text: "Hi Jordan, I've logged this as IT-4917 and I'm looking into it now. This sounds like it could be related to the macOS update yesterday. Can you tell me your current macOS version?" },
        { type: 'inbound', name: 'Jordan Ellis', time: '1h ago', bg: '4573D2', fg: 'ffffff', initials: 'JE',
          text: "macOS 15.3.1 — updated yesterday evening. The fan is running at full speed constantly." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Sarah Kim', time: '1h ago', bg: '5DA182', fg: 'ffffff', initials: 'SK',
          text: "Thermal issue post-15.3.1 update. Checking Apple's known issues list. May need SMC reset + clean boot. Possibly scheduling hardware inspection if that doesn't resolve it." },
      ],
      initTranscript: [],
      steps: [
        { id: 's1', type: 'agent', label: 'Intake & classification', team: 'IT Bot', status: 'completed', completedAt: '1h ago', outcomeNote: 'Classified as Hardware > Thermal. Assigned to Sarah Kim. Linked to macOS 15.3.1 known issues.' },
        { id: 's2', type: 'agent', label: 'Software diagnosis', team: 'Sarah Kim', status: 'active' },
        { id: 's3', type: 'agent', label: 'SMC reset & thermal test', team: 'Sarah Kim', status: 'pending' },
        { id: 's4', type: 'agent', label: 'Hardware escalation (if needed)', team: 'Hardware Team', status: 'pending' },
      ],
    },
  },
  {
    id: 'mt2',
    title: 'Outlook calendar not syncing with Teams',
    time: '3h ago',
    requestedBy: 'Casey Morgan',
    initials: 'CM',
    color: '#7C5EA8',
    ticket: {
      id: 'IT-4934',
      name: 'Outlook calendar not syncing with Microsoft Teams',
      status: 'Open',
      priority: 'Medium',
      category: 'Software',
      sla: '4h remaining',
      slaType: 'normal',
      date: 'Today',
      updated: '3h ago',
      assignee: { name: 'Sarah Kim', initials: 'SK', bg: '5DA182', fg: 'ffffff' },
      requester: { name: 'Casey Morgan', initials: 'CM', bg: '7C5EA8', fg: 'ffffff' },
      submitter: { name: 'Casey Morgan', email: 'c.morgan@acme.com', location: 'New York', org: 'Operations', deviceId: 'WIN-5521' },
      aiSummary: "Casey Morgan's Outlook calendar events are not appearing in Microsoft Teams calendar view, and vice versa. Meetings created in Teams are not visible in Outlook. Issue started 3 days ago after a Microsoft 365 update.",
      initPublic: [
        { type: 'inbound', name: 'Casey Morgan', time: '3h ago', bg: '7C5EA8', fg: 'ffffff', initials: 'CM',
          text: "Hi — my Outlook and Teams calendars stopped syncing about 3 days ago. Meetings I create in Teams don't show in Outlook and the other way around. It's causing me to miss meetings." },
        { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: '2.5h ago',
          text: "Hi Casey, I've opened IT-4934 for this. This is a known issue with Microsoft 365 sync. I'll walk you through some steps to fix it. First, can you try signing out of Teams completely and signing back in?" },
      ],
      initInternal: [],
      initTranscript: [],
      steps: [
        { id: 's1', type: 'agent', label: 'Intake & classification', team: 'IT Bot', status: 'completed', completedAt: '3h ago', outcomeNote: 'Classified as Software > M365 Sync. Assigned to Sarah Kim.' },
        { id: 's2', type: 'agent', label: 'Sign-out / sign-in test', team: 'Sarah Kim', status: 'active' },
        { id: 's3', type: 'agent', label: 'Microsoft 365 token refresh', team: 'Sarah Kim', status: 'pending' },
        { id: 's4', type: 'agent', label: 'Confirm sync restored', team: 'Sarah Kim', status: 'pending' },
      ],
    },
  },
  {
    id: 'mt3',
    title: 'VPN drops every 30 min on home network',
    time: 'Yesterday',
    requestedBy: 'Riley Thompson',
    initials: 'RT',
    color: '#C48B35',
    ticket: {
      id: 'IT-4896',
      name: 'VPN connection drops every 30 minutes — home network',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Network',
      sla: '1d',
      slaType: 'normal',
      date: 'Yesterday',
      updated: 'Yesterday',
      assignee: { name: 'Sarah Kim', initials: 'SK', bg: '5DA182', fg: 'ffffff' },
      requester: { name: 'Riley Thompson', initials: 'RT', bg: 'C48B35', fg: 'ffffff' },
      submitter: { name: 'Riley Thompson', email: 'r.thompson@acme.com', location: 'Remote', org: 'Sales', deviceId: 'MBP-6210' },
      aiSummary: 'Riley Thompson experiences VPN disconnects exactly every 30 minutes when working from home. Issue does not occur on the office network. Suspected MTU mismatch or router idle timeout causing the session drops.',
      initPublic: [
        { type: 'inbound', name: 'Riley Thompson', time: 'Yesterday', bg: 'C48B35', fg: 'ffffff', initials: 'RT',
          text: "The VPN has been dropping exactly every 30 minutes for the past week when I work from home. It reconnects automatically but I lose about 2 minutes of work each time and it's interrupting calls." },
        { type: 'outbound', isAi: false, senderLabel: 'Sarah Kim', time: 'Yesterday',
          text: "Hi Riley, this sounds like a router keep-alive timeout. Can you tell me the make/model of your home router? Also, have you tried connecting via your phone's hotspot to see if the drops still occur?" },
        { type: 'inbound', name: 'Riley Thompson', time: 'Yesterday', bg: 'C48B35', fg: 'ffffff', initials: 'RT',
          text: "Netgear Nighthawk R7000. Just tried the hotspot — no drops after 45 minutes! So it's definitely my router." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Sarah Kim', time: 'Yesterday', bg: '5DA182', fg: 'ffffff', initials: 'SK',
          text: "Confirmed router issue — hotspot test eliminates ISP/device. Sending router config guide for UDP idle timeout. Will close once confirmed resolved." },
      ],
      initTranscript: [],
      steps: [
        { id: 's1', type: 'agent', label: 'Intake & classification', team: 'IT Bot', status: 'completed', completedAt: 'Yesterday', outcomeNote: 'Classified as Network > VPN. Assigned to Sarah Kim.' },
        { id: 's2', type: 'agent', label: 'Root cause isolation', team: 'Sarah Kim', status: 'completed', completedAt: 'Yesterday', outcomeNote: 'Hotspot test confirms router UDP idle timeout. Not ISP or device issue.' },
        { id: 's3', type: 'agent', label: 'Router config guide sent', team: 'Sarah Kim', status: 'active' },
        { id: 's4', type: 'agent', label: 'Confirm resolved', team: 'Sarah Kim', status: 'pending' },
      ],
    },
  },
  {
    id: 'mt4',
    title: 'Floor 3 printer offline — HP LaserJet',
    time: '2d ago',
    requestedBy: 'Sam Patel',
    initials: 'SP',
    color: '#D43D5D',
    ticket: {
      id: 'IT-4871',
      name: 'HP LaserJet MFP offline — floor 3 print queue stuck',
      status: 'Resolved',
      priority: 'Low',
      category: 'Hardware',
      sla: '3d',
      slaType: 'normal',
      date: '2 days ago',
      updated: '2d ago',
      assignee: { name: 'Sarah Kim', initials: 'SK', bg: '5DA182', fg: 'ffffff' },
      requester: { name: 'Sam Patel', initials: 'SP', bg: 'D43D5D', fg: 'ffffff' },
      submitter: { name: 'Sam Patel', email: 's.patel@acme.com', location: 'Chicago', org: 'Finance', deviceId: null },
      aiSummary: 'The HP LaserJet MFP on floor 3 went offline with a stuck print queue. Multiple users were affected. Resolved by clearing the print spooler service and restarting the printer. Root cause was a corrupt print job from an unsupported file format.',
      initPublic: [
        { type: 'inbound', name: 'Sam Patel', time: '2d ago', bg: 'D43D5D', fg: 'ffffff', initials: 'SP',
          text: "The floor 3 printer has been offline since this morning. There's a print queue that won't clear and nobody can print." },
        { type: 'outbound', isAi: false, senderLabel: 'Sarah Kim', time: '2d ago',
          text: "Hi Sam, I've cleared the print spooler and restarted the MFP. Can you try printing a test page now?" },
        { type: 'inbound', name: 'Sam Patel', time: '2d ago', bg: 'D43D5D', fg: 'ffffff', initials: 'SP',
          text: "Test page printed successfully. Thanks — the queue is clear and everyone can print again!" },
        { type: 'system', text: 'Ticket resolved by Sarah Kim' },
      ],
      initInternal: [],
      initTranscript: [],
      steps: [
        { id: 's1', type: 'agent', label: 'Intake & classification', team: 'IT Bot', status: 'completed', completedAt: '2d ago', outcomeNote: 'Classified as Hardware > Printer. Assigned to Sarah Kim.' },
        { id: 's2', type: 'agent', label: 'Print spooler clear & restart', team: 'Sarah Kim', status: 'completed', completedAt: '2d ago', outcomeNote: 'Spooler cleared, printer restarted. Test page confirmed successful.' },
        { id: 's3', type: 'agent', label: 'Root cause logged', team: 'Sarah Kim', status: 'completed', completedAt: '2d ago', outcomeNote: 'Corrupt print job from unsupported file format. Added to KB.' },
      ],
    },
  },
];

const PRIORITY_PILL = {
  Critical: { bg: 'var(--priority-critical-bg)', color: 'var(--priority-critical-text)' },
  Medium:   { bg: 'var(--priority-medium-bg)',   color: 'var(--priority-medium-text)'   },
  Low:      { bg: 'var(--priority-low-bg)',      color: 'var(--priority-low-text)'      },
};

// ── List row ──────────────────────────────────────────────────────────────────

function TicketRow({ item, isSelected, onSelect, onMoreAction }) {
  const pill = PRIORITY_PILL[item.ticket.priority] ?? PRIORITY_PILL.Low;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={e => e.key === 'Enter' && onSelect(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '14px 16px',
        cursor: 'pointer',
        background: isSelected ? 'var(--background-medium)' : hovered ? 'var(--background-weak)' : 'transparent',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.1s',
      }}
    >
      {/* Line 1: ticket ID + time (or more button on hover) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, letterSpacing: '0.2px' }}>
          {item.ticket.id}
        </span>
        {hovered ? (
          <div onClick={e => e.stopPropagation()}>
            <TicketMoreMenu ticketId={item.ticket.id} onAction={onMoreAction} />
          </div>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>
            {item.time}
          </span>
        )}
      </div>

      {/* Line 2: ticket title */}
      <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--text)', lineHeight: '19px', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.1px' }}>
        {item.title}
      </p>

      {/* Line 3: requester + priority pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {item.initials}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.requestedBy}
          </span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: pill.color, background: pill.bg, borderRadius: 3, padding: '1px 6px', lineHeight: '16px', fontFamily: SFT, flexShrink: 0 }}>
          {item.ticket.priority}
        </span>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function AgentMyTicketsView() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppStore();
  const [selectedId, setSelectedId] = useState(MY_TICKETS[0].id);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closedIds, setClosedIds] = useState(new Set());

  function handleMoreAction() {
    // row-level menu (no-op for close_and_move — modal handles it)
  }

  const [localStatus, setLocalStatus] = useState('');
  const [localPriority, setLocalPriority] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const statusRef = useRef(null);
  const priorityRef = useRef(null);

  const rawSelected = MY_TICKETS.find(t => t.id === selectedId) ?? MY_TICKETS[0];
  // Merge store overrides onto MY_TICKETS ticket data
  const ticketOverride = state.ticketOverrides[rawSelected.ticket.id] ?? {};
  const { extraPublicComments, extraInternalComments, ...statusOverrides } = ticketOverride;
  const selected = {
    ...rawSelected,
    ticket: {
      ...rawSelected.ticket,
      ...statusOverrides,
      initPublic: extraPublicComments?.length
        ? [...(rawSelected.ticket.initPublic ?? []), ...extraPublicComments]
        : rawSelected.ticket.initPublic,
      initInternal: extraInternalComments?.length
        ? [...(rawSelected.ticket.initInternal ?? []), ...extraInternalComments]
        : rawSelected.ticket.initInternal,
    },
  };

  useEffect(() => {
    setLocalStatus(selected.ticket.status);
    setLocalPriority(selected.ticket.priority);
    setStatusDropdownOpen(false);
    setPriorityDropdownOpen(false);
  }, [selectedId]);

  useEffect(() => {
    if (!statusDropdownOpen) return;
    function h(e) { if (statusRef.current && !statusRef.current.contains(e.target)) setStatusDropdownOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [statusDropdownOpen]);

  useEffect(() => {
    if (!priorityDropdownOpen) return;
    function h(e) { if (priorityRef.current && !priorityRef.current.contains(e.target)) setPriorityDropdownOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [priorityDropdownOpen]);

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>

      {/* ── Col 1: Ticket list ──────────────────────────────────────────────── */}
      <div style={{
        width: 340, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--background-weak)',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 16px 16px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', margin: 0 }}>
            My tickets
          </h2>
        </div>

        {/* Flat list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {MY_TICKETS.map(item => (
            <TicketRow
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={setSelectedId}
              onMoreAction={handleMoreAction}
            />
          ))}
        </div>
      </div>

      {/* ── Col 2: Chat panel ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Banner: ticket closed and moved to Asana */}
        {closedIds.has(selectedId) && (
          <div
            className="shrink-0 flex items-center gap-1"
            style={{ height: 38, padding: '0 24px', background: 'var(--success-background)', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--success-text)' }}
          >
            <span>Ticket resolved — task created in IT Escalations</span>
            <span style={{ margin: '0 2px' }}>—</span>
            <button
              type="button"
              onClick={() => navigate('/projects/it-escalations')}
              style={{ background: 'none', border: 'none', padding: '0 2px', color: 'var(--success-text)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}
            >
              View in IT Escalations
            </button>
          </div>
        )}
        <TicketChatPanel
          key={selectedId}
          ticket={selected.ticket}
          externalEvents={[]}
          initPublic={selected.ticket.initPublic}
          initInternal={selected.ticket.initInternal}
          initTranscript={selected.ticket.initTranscript}
          transcriptEventText={selected.title}
          moreMenuItems={[
            { label: 'Request approval' },
            { label: 'Create ticket for HR' },
            { label: 'Route to HR' },
            { divider: true },
            { label: 'Close ticket and move to Asana', onClick: () => setCloseModalOpen(true) },
          ]}
        />
      </div>

      {/* ── Col 3: Info sidebar ─────────────────────────────────────────────── */}
      <div style={{ width: '30%', maxWidth: 560, minWidth: 280, flexShrink: 0 }}>
        <TicketInfoSidebar
          key={selectedId}
          ticket={selected.ticket}
          onViewApproval={() => {}}
          hrLinkedTicket={null}
          localStatus={localStatus}
          localPriority={localPriority}
          statusRef={statusRef}
          priorityRef={priorityRef}
          statusDropdownOpen={statusDropdownOpen}
          setStatusDropdownOpen={setStatusDropdownOpen}
          priorityDropdownOpen={priorityDropdownOpen}
          setPriorityDropdownOpen={setPriorityDropdownOpen}
          onStatusChange={opt => {
            setLocalStatus(opt);
            const isResolved = opt === 'Resolved' || opt === 'Closed';
            dispatch({ type: 'UPDATE_TICKET', id: selected.ticket.id, patch: {
              status: opt,
              ...(isResolved ? { resolvedAt: Date.now() } : {}),
            }});
          }}
          onPriorityChange={opt => {
            setLocalPriority(opt);
            dispatch({ type: 'UPDATE_TICKET', id: selected.ticket.id, patch: { priority: opt } });
          }}
          steps={selected.ticket.steps}
          onLinkedTicketClick={() => {}}
          onStepCreateTask={() => {}}
          onStepComplete={() => {}}
        />
      </div>

      <CloseAndMoveModal
        open={closeModalOpen}
        ticket={selected.ticket}
        onClose={() => setCloseModalOpen(false)}
        onConfirm={() => {
          setCloseModalOpen(false);
          setClosedIds(prev => new Set([...prev, selectedId]));
          dispatch({ type: 'UPDATE_TICKET', id: selected.ticket.id, patch: { status: 'Closed', resolvedAt: Date.now() } });
        }}
      />
    </div>
  );
}
