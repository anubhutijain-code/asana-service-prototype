// ─── My Tickets — 3-column pane ─────────────────────────────────────────────
// Col 1: compact list  Col 2: TicketChatPanel  Col 3: TicketInfoSidebar

import { useState, useRef, useEffect } from 'react';
import TicketChatPanel from './TicketChatPanel';
import TicketInfoSidebar from './TicketInfoSidebar';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ── Mock data ─────────────────────────────────────────────────────────────────

const APPROVALS = [
  {
    id: 'ap1',
    title: 'Policy exception — refund > $500',
    time: '2h ago',
    requestedBy: 'Marcus Rivera',
    initials: 'MR',
    color: '#D43D5D',
    ticket: {
      id: 'IT-4821',
      name: 'Customer damaged hardware, requesting full refund outside 30-day window',
      status: 'On hold',
      priority: 'Critical',
      category: 'Customer Support',
      sla: '2h remaining',
      slaType: 'warning',
      date: 'Today',
      updated: '2h ago',
      assignee: { name: 'Marcus Rivera', initials: 'MR', bg: 'D43D5D', fg: 'ffffff' },
      requester: { name: 'Alex Chen', initials: 'AC', bg: '4573D2', fg: 'ffffff' },
      submitter: { name: 'Alex Chen', email: 'a.chen@acme.com', location: 'Boston', org: 'Customer Success', deviceId: null },
      aiSummary: 'Customer Alex Chen is requesting a full hardware refund following accidental damage to a company laptop. The repair quote ($620) exceeds the standard $500 policy limit and falls outside the 30-day return window. A manager-level policy exception is required before processing.',
      initPublic: [
        { type: 'inbound', name: 'Alex Chen', time: '3h ago', bg: '4573D2', fg: 'ffffff', initials: 'AC',
          text: "Hi — I dropped my company laptop and the screen is cracked. I know it was my fault but the repair quote is $620. Can IT help arrange a replacement or refund?" },
        { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: '2.5h ago',
          text: "Hi Alex, I've logged this as IT-4821. Since the cost exceeds our $500 policy limit, this needs a policy exception approval. I've flagged it for review now." },
        { type: 'system', text: 'Policy exception approval requested from Marcus Rivera' },
        { type: 'inbound', name: 'Alex Chen', time: '2h ago', bg: '4573D2', fg: 'ffffff', initials: 'AC',
          text: "Thanks — any idea on timing? I need my laptop to work from home tomorrow." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Marcus Rivera', time: '2h ago', bg: 'D43D5D', fg: 'ffffff', initials: 'MR',
          text: "$620 is 24% over the $500 limit and outside the return window. Alex is a long-tenure employee with a clean record. Escalating for policy exception review — your call." },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'ap2',
    title: 'SLA time extension — Vertex Labs',
    time: '4h ago',
    requestedBy: 'Tom Reyes',
    initials: 'TR',
    color: '#C48B35',
    ticket: {
      id: 'IT-4756',
      name: 'Data sync failure ongoing since Tuesday — Vertex Labs',
      status: 'In Progress',
      priority: 'Critical',
      category: 'Integration',
      sla: '3h overdue',
      slaType: 'danger',
      date: 'Feb 28, 2026',
      updated: '4h ago',
      assignee: { name: 'Tom Reyes', initials: 'TR', bg: 'C48B35', fg: 'ffffff' },
      requester: { name: 'Vertex Labs', initials: 'VL', bg: '6B47DC', fg: 'ffffff' },
      submitter: { name: 'Vertex Labs Support', email: 'support@vertexlabs.io', location: 'Remote', org: 'External', deviceId: null },
      aiSummary: 'Data sync between the Vertex Labs integration and the internal CRM has been failing since Tuesday due to a breaking API change on Vertex\'s side. Their engineering team estimates +48h to deploy a patch. SLA is already in breach — Tom Reyes is requesting a formal extension to avoid triggering the escalation policy.',
      initPublic: [
        { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: '2 days ago',
          text: "Hi, we've identified the sync failure as a breaking API change on your side. Our team is coordinating with your engineering team on a fix." },
        { type: 'inbound', name: 'Vertex Labs', time: '1 day ago', bg: '6B47DC', fg: 'ffffff', initials: 'VL',
          text: "Our engineering team estimates 48 hours to deploy the patch. We understand this is past the original SLA — can this be formally extended?" },
        { type: 'outbound', isAi: false, senderLabel: 'Tom Reyes', time: '4h ago',
          text: "Hi — this is being escalated for SLA extension approval. We'll confirm in writing as soon as it's approved." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Tom Reyes', time: '4h ago', bg: 'C48B35', fg: 'ffffff', initials: 'TR',
          text: "SLA already breached. The API change is on their side — not ours. Requesting admin approval for a formal +48h extension to avoid auto-escalation. Customer has acknowledged the delay in writing." },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'ap3',
    title: 'Customer credit approval — $120',
    time: 'Yesterday',
    requestedBy: 'Priya Nair',
    initials: 'PN',
    color: '#5DA182',
    ticket: {
      id: 'IT-4903',
      name: 'Service disruption compensation — long-tenure customer',
      status: 'Pending approval',
      priority: 'Medium',
      category: 'Billing',
      sla: '1d',
      slaType: 'normal',
      date: 'Yesterday',
      updated: 'Yesterday',
      assignee: { name: 'Priya Nair', initials: 'PN', bg: '5DA182', fg: 'ffffff' },
      requester: { name: 'Dana Hollis', initials: 'DH', bg: 'C47B3A', fg: 'ffffff' },
      submitter: { name: 'Dana Hollis', email: 'd.hollis@example.com', location: 'Chicago', org: 'Customer', deviceId: null },
      aiSummary: 'Dana Hollis, a 6-year customer, experienced a confirmed 4-hour service disruption during a billing cycle. Priya Nair is requesting a $120 goodwill service credit. This falls within discretionary credit thresholds but requires manager sign-off per the updated billing policy.',
      initPublic: [
        { type: 'inbound', name: 'Dana Hollis', time: 'Yesterday', bg: 'C47B3A', fg: 'ffffff', initials: 'DH',
          text: "I was completely locked out for 4 hours during a billing period — I lost billable time because of your service outage. I've been a customer for 6 years and I'd appreciate some acknowledgment." },
        { type: 'outbound', isAi: false, senderLabel: 'Priya Nair', time: 'Yesterday',
          text: "Hi Dana, I sincerely apologise for the disruption. I'm requesting a $120 service credit for your next invoice as a goodwill gesture — pending one final approval on our end." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Priya Nair', time: 'Yesterday', bg: '5DA182', fg: 'ffffff', initials: 'PN',
          text: "6-year customer, first complaint on record. Outage confirmed on our side. $120 is within the $150 discretionary limit but needs manager sign-off per the billing policy update last month." },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'ap4',
    title: 'IT portal access upgrade request',
    time: 'Yesterday',
    requestedBy: 'Devon Walsh',
    initials: 'DW',
    color: '#7C5EA8',
    ticket: {
      id: 'IT-4612',
      name: 'Admin-level SSO portal access for Devon Walsh — migration project',
      status: 'Open',
      priority: 'Low',
      category: 'Access Management',
      sla: '3d',
      slaType: 'normal',
      date: 'Yesterday',
      updated: 'Yesterday',
      assignee: { name: 'Devon Walsh', initials: 'DW', bg: '7C5EA8', fg: 'ffffff' },
      requester: { name: 'Devon Walsh', initials: 'DW', bg: '7C5EA8', fg: 'ffffff' },
      submitter: { name: 'Devon Walsh', email: 'd.walsh@acme.com', location: 'Remote', org: 'IT Operations', deviceId: 'MBP-9021' },
      aiSummary: 'Devon Walsh from IT Operations requires temporary admin-level access to the SSO portal to complete an ongoing identity migration project. Current read-only access is blocking progress. Requires IT manager approval per the privilege escalation policy.',
      initPublic: [
        { type: 'inbound', name: 'Devon Walsh', time: 'Yesterday', bg: '7C5EA8', fg: 'ffffff', initials: 'DW',
          text: "Hi — I'm working on the SSO migration and I need admin-level access to the IT portal to complete the identity mapping phase. My read-only access is blocking progress." },
        { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Yesterday',
          text: "Hi Devon, I've logged this as IT-4612. Admin-level portal access requires manager approval. I've submitted the request — you'll hear back once reviewed." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Devon Walsh', time: 'Yesterday', bg: '7C5EA8', fg: 'ffffff', initials: 'DW',
          text: "Migration phase 2 is fully blocked without this. Access would be temporary — read/write to SSO portal only. Similar requests for migration work were approved within 24h previously." },
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

function ApprovalRow({ item, isSelected, onSelect }) {
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

export default function MyApprovalsView() {
  const [selectedId, setSelectedId] = useState(APPROVALS[0].id);

  // Sidebar dropdown state — reset when selection changes
  const [localStatus, setLocalStatus] = useState('');
  const [localPriority, setLocalPriority] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const statusRef = useRef(null);
  const priorityRef = useRef(null);

  const selected = APPROVALS.find(a => a.id === selectedId) ?? APPROVALS[0];

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
          {APPROVALS.map(item => (
            <ApprovalRow
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
          transcriptEventText={`Approval request: ${selected.title}`}
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
