// ─── Escalations — 3-column monitoring pane ──────────────────────────────────
// Col 1: escalated ticket list  Col 2: TicketChatPanel  Col 3: TicketInfoSidebar
// Read-only view for admin visibility into high/critical tickets in flight.

import { useState, useRef, useEffect } from 'react';
import TicketChatPanel from './TicketChatPanel';
import TicketInfoSidebar from './TicketInfoSidebar';

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

// ── Mock data ─────────────────────────────────────────────────────────────────

const ESCALATIONS = [
  {
    id: 'es1',
    title: 'Production DB failover — data integrity risk',
    time: '38m ago',
    assignedTo: 'Jamie Chen',
    initials: 'JC',
    color: '#4273D1',
    ticket: {
      id: 'IT-4889',
      name: 'Production database hit failover threshold mid-deployment — potential record inconsistency',
      status: 'In Progress',
      priority: 'Critical',
      category: 'Infrastructure',
      sla: '1h overdue',
      slaType: 'danger',
      date: 'Today',
      updated: '38m ago',
      assignee: { name: 'Jamie Chen', initials: 'JC', bg: '4273D1', fg: 'ffffff' },
      requester: { name: 'Platform Engineering', initials: 'PE', bg: '374151', fg: 'ffffff' },
      submitter: { name: 'Automated Monitor', email: 'monitor@internal.acme.com', location: 'AWS us-east-1', org: 'Platform Engineering', deviceId: 'DB-PROD-01' },
      aiSummary: 'The production PostgreSQL cluster triggered a failover at 14:22 during a routine schema migration. The primary node became unresponsive mid-transaction, leaving approximately 340 records in an uncertain state. Jamie Chen is investigating data consistency. Read replicas are currently serving traffic with degraded write capacity.',
      initPublic: [
        { type: 'system', text: 'Auto-escalated: DB failover threshold exceeded on prod cluster' },
        { type: 'outbound', isAi: false, senderLabel: 'Jamie Chen', time: '35m ago',
          text: "Investigating now. Failover triggered at 14:22 during the v2.4.1 migration. Primary node is recovering — replica is serving reads. I'm auditing the transaction log to identify any records that need rollback." },
        { type: 'inbound', name: 'Platform Engineering', time: '30m ago', bg: '374151', fg: 'ffffff', initials: 'PE',
          text: "Thanks Jamie. We've paused the deployment pipeline. Engineering confirms no customer-facing writes have been rejected — but we're seeing some inconsistent timestamps on the orders table. Can you confirm?" },
        { type: 'outbound', isAi: false, senderLabel: 'Jamie Chen', time: '20m ago',
          text: "Confirmed — I'm seeing 342 rows in orders where updated_at doesn't match the audit log. Running the reconciliation script now. ETA on primary recovery is 20 minutes per the DBA team." },
        { type: 'inbound', name: 'Platform Engineering', time: '12m ago', bg: '374151', fg: 'ffffff', initials: 'PE',
          text: "Understood. Please keep us posted. We're holding the v2.4.1 release until this is fully clear." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Jamie Chen', time: '38m ago', bg: '4273D1', fg: 'ffffff', initials: 'JC',
          text: "Escalating to admin visibility. DB failover mid-migration is a P0 situation. DBA confirmed the primary will come back online but reconciliation is needed for ~342 rows. No customer data loss expected but this is high risk until confirmed. Will update every 10 minutes." },
        { type: 'inbound', name: 'Jamie Chen', time: '15m ago', bg: '4273D1', fg: 'ffffff', initials: 'JC',
          text: "Update: primary node back online. Replica sync in progress. Running row-level reconciliation on orders table. 340 of 342 rows resolved. 2 remain — flagging for manual review. Expect full resolution in ~15 min." },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'es2',
    title: 'VPN auth failure — 47 users locked out',
    time: '1h ago',
    assignedTo: 'Marcus Rivera',
    initials: 'MR',
    color: '#D43D5D',
    ticket: {
      id: 'IT-4801',
      name: 'VPN authentication broken for ~47 users after identity provider cert update',
      status: 'In Progress',
      priority: 'Critical',
      category: 'Network / Access',
      sla: '28m remaining',
      slaType: 'warning',
      date: 'Today',
      updated: '1h ago',
      assignee: { name: 'Marcus Rivera', initials: 'MR', bg: 'D43D5D', fg: 'ffffff' },
      requester: { name: 'Multiple Users', initials: 'MU', bg: '6B7280', fg: 'ffffff' },
      submitter: { name: 'Slack Alert — #it-helpdesk', email: null, location: 'Remote', org: 'All Departments', deviceId: null },
      aiSummary: 'At 13:45, the identity provider (Okta) pushed a certificate rotation that invalidated existing VPN session tokens. Approximately 47 remote workers are unable to authenticate. Marcus Rivera has confirmed the root cause and implemented a partial fix — affected users in the US-East region are back online. EMEA users (~12) are pending a second fix pass.',
      initPublic: [
        { type: 'inbound', name: 'Multiple Users', time: '1h ago', bg: '6B7280', fg: 'ffffff', initials: 'MU',
          text: "VPN is completely broken — I can't get in at all. Getting 'certificate validation failed' every time. This started around 1:45pm." },
        { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: '58m ago',
          text: "Hi — we're aware of an ongoing authentication issue affecting VPN access. Our team is working on a fix. We'll update you within 30 minutes. In the meantime, please try clearing your VPN client cache and retrying." },
        { type: 'system', text: 'Escalated to Critical — 47 users impacted' },
        { type: 'outbound', isAi: false, senderLabel: 'Marcus Rivera', time: '40m ago',
          text: "Root cause confirmed: Okta pushed a cert rotation at 13:45 without standard change notice. We've re-issued tokens for US-East region users — if you're in the US-East region, please retry your VPN connection now." },
        { type: 'inbound', name: 'Multiple Users', time: '35m ago', bg: '6B7280', fg: 'ffffff', initials: 'MU',
          text: "US-East is working now — thank you! Are EMEA users going to get a fix too?" },
        { type: 'outbound', isAi: false, senderLabel: 'Marcus Rivera', time: '30m ago',
          text: "Yes — working on EMEA region now. Expect a resolution in the next 15–20 minutes. We'll post an update in #it-status when all regions are clear." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Marcus Rivera', time: '55m ago', bg: 'D43D5D', fg: 'ffffff', initials: 'MR',
          text: "Escalating. Okta cert rotation took out VPN tokens for everyone who had an active session before 13:45. I've re-issued creds for US-East (35 users restored). EMEA push is queued — Okta admin portal is slow due to load. Expect 15 min to clear EMEA. No data exposure, just access disruption." },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'es3',
    title: 'Security: brute-force on admin portal — IP blocked',
    time: '2h ago',
    assignedTo: 'Tom Reyes',
    initials: 'TR',
    color: '#C48B35',
    ticket: {
      id: 'IT-4744',
      name: 'WAF detected 340 failed login attempts on IT admin portal — external IP blocked',
      status: 'In Progress',
      priority: 'Critical',
      category: 'Security',
      sla: '2h remaining',
      slaType: 'warning',
      date: 'Today',
      updated: '2h ago',
      assignee: { name: 'Tom Reyes', initials: 'TR', bg: 'C48B35', fg: 'ffffff' },
      requester: { name: 'WAF Monitor', initials: 'WM', bg: '374151', fg: 'ffffff' },
      submitter: { name: 'Cloudflare WAF Alert', email: 'alerts@internal.acme.com', location: 'External IP: 91.134.x.x', org: 'Security Systems', deviceId: null },
      aiSummary: 'The Cloudflare WAF detected 340 failed login attempts against the IT admin portal originating from a single external IP (91.134.x.x) between 11:50 and 12:10. The IP has been blocked at the firewall level. Tom Reyes is conducting a post-incident audit to confirm no successful logins occurred and to assess whether additional hardening is needed.',
      initPublic: [
        { type: 'system', text: 'WAF Alert: 340 failed auth attempts in 20 min — auto-blocked 91.134.x.x' },
        { type: 'outbound', isAi: false, senderLabel: 'Tom Reyes', time: '2h ago',
          text: "Confirmed: WAF auto-blocked the source IP at 12:10. I'm reviewing the auth logs now to confirm no successful logins during the attack window (11:50–12:10). No admin sessions were opened from an unknown IP in that period based on initial review." },
        { type: 'outbound', isAi: false, senderLabel: 'Tom Reyes', time: '1.5h ago',
          text: "Auth log review complete. 340 attempts, all failed — no successful authentication from the blocked IP. Admin portal is locked to MFA which likely stopped any access. Keeping the IP on the deny list permanently and flagging the attack pattern for the security team." },
        { type: 'inbound', name: 'WAF Monitor', time: '1h ago', bg: '374151', fg: 'ffffff', initials: 'WM',
          text: "Follow-up: same IP subnet has been seen on 2 other industry peer networks this week. Likely a coordinated scan. Recommend submitting to the threat intelligence feed." },
        { type: 'outbound', isAi: false, senderLabel: 'Tom Reyes', time: '55m ago',
          text: "Noted — submitting to Cloudflare threat feed now. Also enabling rate-limiting on the login endpoint (max 5 attempts/min from any single IP). Will document in the security runbook." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Tom Reyes', time: '2h ago', bg: 'C48B35', fg: 'ffffff', initials: 'TR',
          text: "Escalating for admin visibility. 340 brute-force attempts on IT admin portal — all failed, IP blocked. MFA held. Running full audit now. This looks like a credential stuffing scan, not targeted. Will confirm and update in 30 min. No breach at this time." },
        { type: 'inbound', name: 'Tom Reyes', time: '1h ago', bg: 'C48B35', fg: 'ffffff', initials: 'TR',
          text: "Audit done. No compromise confirmed. Adding enhanced monitoring on the admin portal for the next 24h. Recommend we review whether the portal should be moved behind a VPN-only access rule — creating a follow-up ticket for that." },
      ],
      initTranscript: [],
    },
  },
  {
    id: 'es4',
    title: 'Email delivery failure — finance domain blocked',
    time: '3h ago',
    assignedTo: 'Priya Nair',
    initials: 'PN',
    color: '#5DA182',
    ticket: {
      id: 'IT-4712',
      name: 'Outbound emails from finance@acme.com bouncing — domain flagged by recipient MX servers',
      status: 'In Progress',
      priority: 'Critical',
      category: 'Email / Comms',
      sla: '1h remaining',
      slaType: 'warning',
      date: 'Today',
      updated: '3h ago',
      assignee: { name: 'Priya Nair', initials: 'PN', bg: '5DA182', fg: 'ffffff' },
      requester: { name: 'Finance Team', initials: 'FT', bg: 'C47B3A', fg: 'ffffff' },
      submitter: { name: 'Jordan Wu', email: 'j.wu@acme.com', location: 'Chicago', org: 'Finance', deviceId: null },
      aiSummary: 'Outbound emails sent from the finance@acme.com address have been bouncing since approximately 09:30. Recipient mail servers are returning a 550 error citing a blacklisted sending IP. Priya Nair has confirmed the issue is related to a misconfigured SPF record following last week\'s mail relay migration. A fix has been submitted but DNS propagation is pending.',
      initPublic: [
        { type: 'inbound', name: 'Finance Team', time: '3h ago', bg: 'C47B3A', fg: 'ffffff', initials: 'FT',
          text: "Urgent — all outbound email from finance@acme.com is bouncing. We can't reach clients. Getting back 'message rejected' errors. This is a P0 for month-end close." },
        { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: '2.8h ago',
          text: "Hi — I've logged this as IT-4712 and escalated to Critical priority. Our team is investigating the mail delivery failure now." },
        { type: 'outbound', isAi: false, senderLabel: 'Priya Nair', time: '2.5h ago',
          text: "Root cause identified: our SPF record wasn't updated to include the new mail relay IPs after last week's migration. Recipient MX servers are correctly rejecting messages from unlisted IPs. I've submitted the SPF update — DNS propagation typically takes 1–2 hours." },
        { type: 'inbound', name: 'Finance Team', time: '2h ago', bg: 'C47B3A', fg: 'ffffff', initials: 'FT',
          text: "1–2 hours is a problem for us. Is there any workaround? We have client invoices that need to go out today." },
        { type: 'outbound', isAi: false, senderLabel: 'Priya Nair', time: '1.8h ago',
          text: "For immediate sending: you can use the shared finance-backup@acme.com address which routes through the legacy relay (still valid). I've confirmed it's working. I'll notify you as soon as the SPF update propagates and your primary address is restored." },
      ],
      initInternal: [
        { type: 'inbound', name: 'Priya Nair', time: '2.5h ago', bg: '5DA182', fg: 'ffffff', initials: 'PN',
          text: "Escalating. SPF record gap post-migration is causing all finance domain sends to bounce. SPF TTL is 3600s so propagation delay is unavoidable. Workaround provided to finance. Monitoring propagation — will update when primary address is restored. No data issue, just delivery disruption." },
      ],
      initTranscript: [],
    },
  },
];

const PRIORITY_PILL = {
  Critical: { bg: '#FEF3C7', color: '#92400E' },
  High:     { bg: '#FEE2E2', color: '#991B1B' },
  Medium:   { bg: '#DBEAFE', color: '#1D4ED8' },
  Low:      { bg: '#F3F4F6', color: '#6D6E6F' },
};

const SLA_COLOR = {
  danger:  'var(--danger-text)',
  warning: 'var(--warning-text)',
  normal:  'var(--text-disabled)',
};

// ── List row ──────────────────────────────────────────────────────────────────

function EscalationRow({ item, isSelected, onSelect }) {
  const pill = PRIORITY_PILL[item.ticket.priority] ?? PRIORITY_PILL.Critical;
  const slaColor = SLA_COLOR[item.ticket.slaType] ?? SLA_COLOR.normal;
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
      {/* Line 1: priority pill + ticket ID + SLA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: pill.color, background: pill.bg, borderRadius: 10, padding: '1px 6px', lineHeight: '16px', fontFamily: SFT }}>
            {item.ticket.priority}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, letterSpacing: '0.2px' }}>
            {item.ticket.id}
          </span>
        </div>
        <span style={{ fontSize: 11, color: slaColor, fontFamily: SFT, fontWeight: item.ticket.slaType === 'danger' ? 600 : 400 }}>
          {item.ticket.sla}
        </span>
      </div>

      {/* Line 2: title */}
      <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--text)', lineHeight: '19px', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.1px' }}>
        {item.title}
      </p>

      {/* Line 3: assigned agent */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {item.initials}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-weak)', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.assignedTo}
        </span>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function EscalationsView() {
  const [selectedId, setSelectedId] = useState(ESCALATIONS[0].id);

  // Sidebar dropdown state — reset when selection changes
  const [localStatus, setLocalStatus] = useState('');
  const [localPriority, setLocalPriority] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const statusRef = useRef(null);
  const priorityRef = useRef(null);

  const selected = ESCALATIONS.find(e => e.id === selectedId) ?? ESCALATIONS[0];

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

      {/* ── Col 1: Escalation list ──────────────────────────────────────────── */}
      <div style={{
        width: 268, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'var(--background-weak)',
      }}>
        {/* Header — 44px to match TicketChatPanel header */}
        <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          <h4 style={{ fontFamily: '"SF Pro Display"', fontSize: 15, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.15px', margin: 0 }}>
            Escalations
          </h4>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {ESCALATIONS.map(item => (
            <EscalationRow
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
          transcriptEventText={`Escalation: ${selected.title}`}
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
