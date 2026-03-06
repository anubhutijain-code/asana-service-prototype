// ─── Agent My Tickets — 3-column pane ────────────────────────────────────────
// Col 1: compact list  Col 2: TicketChatPanel  Col 3: TicketInfoSidebar

import { useState, useRef, useEffect } from 'react';
import TicketChatPanel from './TicketChatPanel';
import TicketInfoSidebar from './TicketInfoSidebar';

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
    },
  },
];

const PRIORITY_PILL = {
  Critical: { bg: '#FEF3C7', color: '#92400E' },
  Medium:   { bg: '#DBEAFE', color: '#1D4ED8' },
  Low:      { bg: '#F3F4F6', color: '#6D6E6F' },
};

// ── List row ──────────────────────────────────────────────────────────────────

function TicketRow({ item, isSelected, onSelect }) {
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
      {/* Line 1: priority pill + ticket ID + time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: pill.color, background: pill.bg, borderRadius: 10, padding: '1px 6px', lineHeight: '16px', fontFamily: SFT }}>
            {item.ticket.priority}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, letterSpacing: '0.2px' }}>
            {item.ticket.id}
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>
          {item.time}
        </span>
      </div>

      {/* Line 2: ticket title */}
      <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--text)', lineHeight: '19px', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.1px' }}>
        {item.title}
      </p>

      {/* Line 3: requester */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {item.initials}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.requestedBy}
        </span>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function AgentMyTicketsView() {
  const [selectedId, setSelectedId] = useState(MY_TICKETS[0].id);

  const [localStatus, setLocalStatus] = useState('');
  const [localPriority, setLocalPriority] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const statusRef = useRef(null);
  const priorityRef = useRef(null);

  const selected = MY_TICKETS.find(t => t.id === selectedId) ?? MY_TICKETS[0];

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
        width: 268, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--background-weak)',
      }}>
        {/* Header — 44px to match TicketChatPanel header */}
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          <h4 style={{ fontFamily: '"SF Pro Display"', fontSize: 15, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.15px', margin: 0 }}>
            My tickets
          </h4>
        </div>

        {/* Flat list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {MY_TICKETS.map(item => (
            <TicketRow
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>

      {/* ── Col 2: Chat panel ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TicketChatPanel
          key={selectedId}
          ticket={selected.ticket}
          externalEvents={[]}
          initPublic={selected.ticket.initPublic}
          initInternal={selected.ticket.initInternal}
          initTranscript={selected.ticket.initTranscript}
          transcriptEventText={selected.title}
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
          onStatusChange={setLocalStatus}
          onPriorityChange={setLocalPriority}
        />
      </div>

    </div>
  );
}
