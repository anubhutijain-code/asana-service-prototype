// ─── Collaborating — 3-column pane ───────────────────────────────────────────
// Tickets where the agent is CC'd / following but not the primary assignee

import { useState, useRef, useEffect } from 'react';
import TicketChatPanel from './TicketChatPanel';
import TicketInfoSidebar from './TicketInfoSidebar';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ── Mock data ─────────────────────────────────────────────────────────────────

const COLLABORATING = [
  {
    id: 'co1',
    title: 'New hire onboarding — 5 workstation setups',
    time: '2h ago',
    assignedTo: 'Devon Walsh',
    initials: 'DW',
    color: '#7C5EA8',
    ticket: {
      id: 'IT-4845',
      name: 'New hire onboarding — 5 workstation setups for design team',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Onboarding',
      sla: '2d',
      slaType: 'normal',
      date: 'Today',
      updated: '2h ago',
      assignee: { name: 'Devon Walsh', initials: 'DW', bg: '7C5EA8', fg: 'ffffff' },
      requester: { name: 'Alex Torres', initials: 'AT', bg: '4573D2', fg: 'ffffff' },
      submitter: { name: 'Alex Torres', email: 'a.torres@acme.com', location: 'San Francisco', org: 'Design', deviceId: null },
      aiSummary: 'Five new designers are joining next Monday and need full workstation setups including MacBook Pros, peripherals, software licenses (Adobe CC, Figma), and SSO provisioning. Devon Walsh is the primary assignee. Sarah Kim is CC\'d to assist with software provisioning.',
      initPublic: [
        { type: 'inbound', name: 'Alex Torres', time: '3h ago', bg: '4573D2', fg: 'ffffff', initials: 'AT',
          text: "Hi — we have 5 new designers starting Monday. They'll each need a MacBook Pro 14\", external display, keyboard, mouse, and Adobe Creative Cloud + Figma licenses. Can we get this set up before their first day?" },
        { type: 'outbound', isAi: false, senderLabel: 'Devon Walsh', time: '2.5h ago',
          text: "Hi Alex, confirmed — I've logged this as IT-4845 and we'll have everything ready for Monday. I'll coordinate with Sarah on the software provisioning side." },
        { type: 'inbound', name: 'Alex Torres', time: '2h ago', bg: '4573D2', fg: 'ffffff', initials: 'AT',
          text: "Great, thank you! Can you also make sure they have access to the design Slack channels and the shared Figma workspace?" },
      ],
      initInternal: [
        { type: 'inbound', name: 'Devon Walsh', time: '2h ago', bg: '7C5EA8', fg: 'ffffff', initials: 'DW',
          text: "Hardware ordered — arriving Friday. @Sarah Kim can you handle the Adobe CC and Figma license provisioning? 5 seats needed. Also need SSO group memberships: design-team, figma-editors." },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'co2',
    title: 'Adobe CC license audit — 30 seats over limit',
    time: 'Yesterday',
    assignedTo: 'Priya Nair',
    initials: 'PN',
    color: '#5DA182',
    ticket: {
      id: 'IT-4831',
      name: 'Adobe Creative Cloud license audit — 30 seats over subscription limit',
      status: 'Open',
      priority: 'Low',
      category: 'License Management',
      sla: '5d',
      slaType: 'normal',
      date: 'Yesterday',
      updated: 'Yesterday',
      assignee: { name: 'Priya Nair', initials: 'PN', bg: '5DA182', fg: 'ffffff' },
      requester: { name: 'Finance Team', initials: 'FT', bg: 'C47B3A', fg: 'ffffff' },
      submitter: { name: 'Robin Chen', email: 'r.chen@acme.com', location: 'Remote', org: 'Finance', deviceId: null },
      aiSummary: "Finance flagged that Adobe CC license usage is 30 seats over the contracted 120-seat limit, generating unexpected overage charges. Priya Nair is auditing active vs. inactive users. Sarah Kim is CC'd to identify provisioning gaps and reclaim unused licenses.",
      initPublic: [
        { type: 'inbound', name: 'Robin Chen', time: 'Yesterday', bg: 'C47B3A', fg: 'ffffff', initials: 'FT',
          text: "Our Adobe CC invoice this month shows 150 active seats against a 120-seat contract. That's $1,800 in unexpected overage. Can IT audit who's using licenses and reclaim the unused ones?" },
        { type: 'outbound', isAi: false, senderLabel: 'Priya Nair', time: 'Yesterday',
          text: "Hi Robin, I've opened IT-4831 for this. I'll pull the active user report from the Adobe Admin Console today and identify which accounts can be reclaimed." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Priya Nair', time: 'Yesterday', bg: '5DA182', fg: 'ffffff', initials: 'PN',
          text: "Adobe admin report shows 23 accounts haven't logged in for 90+ days. @Sarah Kim can you cross-reference these against Okta to confirm which are inactive/departed employees before I revoke?" },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'co3',
    title: 'Network switch replacement — floor 2',
    time: '2d ago',
    assignedTo: 'Tom Reyes',
    initials: 'TR',
    color: '#C48B35',
    ticket: {
      id: 'IT-4798',
      name: 'Floor 2 network switch replacement — intermittent packet loss',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Network',
      sla: '1d overdue',
      slaType: 'danger',
      date: '2 days ago',
      updated: '2d ago',
      assignee: { name: 'Tom Reyes', initials: 'TR', bg: 'C48B35', fg: 'ffffff' },
      requester: { name: 'Floor 2 Users', initials: 'F2', bg: '6B47DC', fg: 'ffffff' },
      submitter: { name: 'Tom Reyes', email: 't.reyes@acme.com', location: 'On-site', org: 'IT Infrastructure', deviceId: null },
      aiSummary: "Floor 2's core network switch is experiencing intermittent packet loss affecting ~40 users. Replacement switch has arrived. Tom Reyes is handling the physical swap during tonight's maintenance window. Sarah Kim is CC'd to coordinate the config backup and VLAN reconfiguration.",
      initPublic: [
        { type: 'outbound', isAi: false, senderLabel: 'Tom Reyes', time: '2d ago',
          text: "Floor 2 is experiencing intermittent 5-10% packet loss throughout the day, affecting about 40 employees. Root cause identified as the aging Cisco 2960X switch showing hardware faults. Replacement scheduled for tonight's maintenance window (11 PM – 1 AM)." },
        { type: 'inbound', name: 'Floor 2 Users', time: '2d ago', bg: '6B47DC', fg: 'ffffff', initials: 'F2',
          text: "Thank you for the update. Will there be a service interruption tonight?" },
        { type: 'outbound', isAi: false, senderLabel: 'Tom Reyes', time: '2d ago',
          text: "Yes — expect approximately 20–30 minutes of network downtime on floor 2 between 11 PM and 1 AM. All other floors will be unaffected." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Tom Reyes', time: '2d ago', bg: 'C48B35', fg: 'ffffff', initials: 'TR',
          text: "New Cisco switch is racked and ready. @Sarah Kim need you to pull the running config backup from the old switch before tonight — specifically VLAN 10, 20, 30 and the trunk port config. I'll handle the physical swap and port-channel setup." },
      ],
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

function CollabRow({ item, isSelected, onSelect }) {
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
      {/* Line 1: ticket ID + time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, letterSpacing: '0.2px' }}>
          {item.ticket.id}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>
          {item.time}
        </span>
      </div>

      {/* Line 2: ticket title */}
      <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--text)', lineHeight: '19px', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.1px' }}>
        {item.title}
      </p>

      {/* Line 3: assigned agent + priority pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {item.initials}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.assignedTo}
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

export default function CollaboratingView() {
  const [selectedId, setSelectedId] = useState(COLLABORATING[0].id);

  const [localStatus, setLocalStatus] = useState('');
  const [localPriority, setLocalPriority] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const statusRef = useRef(null);
  const priorityRef = useRef(null);

  const selected = COLLABORATING.find(t => t.id === selectedId) ?? COLLABORATING[0];

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
          <h2 style={{ fontFamily: '"SF Pro Display"', fontSize: 18, fontWeight: 500, color: 'var(--text)', letterSpacing: '0.38px', margin: 0 }}>
            Collaborating
          </h2>
        </div>

        {/* Flat list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {COLLABORATING.map(item => (
            <CollabRow
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
