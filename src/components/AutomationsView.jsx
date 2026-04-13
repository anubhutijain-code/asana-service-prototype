import { useState } from 'react';
import Pill from './Pill';
import RightPanelOverlay from './RightPanelOverlay';
import { Builder, DetailModal } from './PlaybookGallery';

const B = import.meta.env.BASE_URL;

// ─── Integration icon paths ───────────────────────────────────────────────────

const INT = {
  globe : `${B}integrations/globe.svg`,
  word  : `${B}integrations/microsoft-word.svg`,
  drive : `${B}integrations/google-drive.svg`,
};

// ─── Avatar pool (cycles across workflows) ────────────────────────────────────

const AVATARS = [
  `${B}avatars/Teammate.svg`,
  `${B}avatars/Teammate1.svg`,
  `${B}avatars/Teammate-1.svg`,
  `${B}avatars/Teammate-2.svg`,
  `${B}avatars/Teammate-3.svg`,
  `${B}avatars/Teammate-4.svg`,
  `${B}avatars/Teammate-5.svg`,
];

// ─── Workflow data ─────────────────────────────────────────────────────────────

const WORKFLOWS = [
  // Featured
  {
    id: 'w1', section: 'featured', avatar: 0,
    title: 'Auto-assign IT Tickets by Category', subtitle: 'Auto-routing', domain: 'IT',
    description: 'Automatically routes new tickets to the right agent based on category — hardware, software, network.',
    approval: 'No approval needed', uses: '28 teams', enabled: true,
    integrations: ['globe', 'word', 'drive'],
  },
  {
    id: 'w2', section: 'featured', avatar: 1,
    title: 'New Hire Cross-team Onboarding', subtitle: 'Onboarding', domain: 'Cross-team',
    description: 'Coordinates IT setup, HR paperwork, and equipment provisioning for new employees in a single workflow.',
    approval: 'Needs approval', uses: '41 teams', enabled: true,
    integrations: ['globe', 'word', 'drive'],
  },
  {
    id: 'w3', section: 'featured', avatar: 2,
    title: 'SLA Breach Auto-escalation', subtitle: 'SLA management', domain: 'IT',
    description: 'Automatically escalates tickets approaching SLA breach to senior agents and notifies team leads.',
    approval: 'No approval needed', uses: '35 teams', enabled: true,
    integrations: ['globe', 'word'],
  },
  // IT Queue
  {
    id: 'w4', section: 'it', avatar: 3,
    title: 'Software License Request & Approval', subtitle: 'Access control', domain: 'IT',
    description: 'Streamlines software license requests with automated manager approval and provisioning confirmation.',
    approval: 'Needs approval', uses: '19 teams', enabled: false,
    integrations: ['globe', 'word', 'drive'],
  },
  {
    id: 'w5', section: 'it', avatar: 4,
    title: 'Password Reset Self-Service', subtitle: 'Access control', domain: 'IT',
    description: 'Guides users through self-service password resets, reducing IT queue volume for routine requests.',
    approval: 'No approval needed', uses: '52 teams', enabled: true,
    integrations: ['globe', 'word'],
  },
  {
    id: 'w6', section: 'it', avatar: 5,
    title: 'Hardware Request Fulfillment', subtitle: 'Hardware', domain: 'IT',
    description: 'Manages end-to-end hardware requests from submission through approval, procurement, and delivery confirmation.',
    approval: 'Needs approval', uses: '14 teams', enabled: false,
    integrations: ['globe', 'drive'],
  },
  {
    id: 'w7', section: 'it', avatar: 6,
    title: 'Duplicate Ticket Detection & Merge', subtitle: 'Queue management', domain: 'IT',
    description: 'Detects and merges duplicate tickets automatically, keeping queues clean and preventing duplicated agent effort.',
    approval: 'No approval needed', uses: '22 teams', enabled: false,
    integrations: ['globe', 'word'],
  },
  // HR Queue
  {
    id: 'w8', section: 'hr', avatar: 0,
    title: 'Payroll Issue Auto-route to HR', subtitle: 'Payroll', domain: 'Cross-team',
    description: 'Automatically detects payroll-related tickets in the IT queue and routes them to the HR payroll team.',
    approval: 'No approval needed', uses: '31 teams', enabled: true,
    integrations: ['globe', 'word', 'drive'],
  },
  {
    id: 'w9', section: 'hr', avatar: 1,
    title: 'Benefits Enrollment Reminder', subtitle: 'Benefits', domain: 'HR',
    description: 'Sends automated reminders to employees during benefits enrollment windows with deadline alerts.',
    approval: 'No approval needed', uses: '17 teams', enabled: false,
    integrations: ['globe', 'word'],
  },
  {
    id: 'w10', section: 'hr', avatar: 2,
    title: 'Employee Offboarding Checklist', subtitle: 'Offboarding', domain: 'HR',
    description: 'Triggers a structured offboarding checklist for IT and HR when an employee departure is submitted.',
    approval: 'Needs approval', uses: '26 teams', enabled: true,
    integrations: ['globe', 'word', 'drive'],
  },
  // Cross-team
  {
    id: 'w11', section: 'cross', avatar: 3,
    title: 'CSAT Survey on Ticket Close', subtitle: 'Feedback', domain: 'Cross-team',
    description: 'Automatically sends a short satisfaction survey when a ticket is resolved, with results aggregated in dashboards.',
    approval: 'No approval needed', uses: '44 teams', enabled: false,
    integrations: ['globe', 'drive'],
  },
  {
    id: 'w12', section: 'cross', avatar: 4,
    title: 'Auto-close Inactive Resolved Tickets', subtitle: 'Queue management', domain: 'IT',
    description: 'Closes tickets that remain in Resolved state with no activity for 7 days, keeping queues tidy.',
    approval: 'No approval needed', uses: '38 teams', enabled: false,
    integrations: ['globe', 'word'],
  },
];

const WORKFLOW_DETAILS = {
  w1:  { trigger: 'New ticket submitted to IT queue', steps: ['AI classifies ticket category', 'Matches category to agent skill set', 'Assigns ticket and sends agent notification', 'Logs routing decision for audit trail'], lastRun: '2 hours ago' },
  w2:  { trigger: 'New hire added in Workday', steps: ['Creates onboarding task in IT queue', 'Creates parallel task in HR queue', 'Requests equipment provisioning from IT', 'Sends welcome email with checklist link'], lastRun: '3 days ago' },
  w3:  { trigger: 'Ticket SLA reaches 80% of threshold', steps: ['Detects approaching SLA breach', 'Re-assigns to available senior agent', 'Posts alert in team Slack channel', 'Logs escalation in ticket audit trail'], lastRun: '45 minutes ago' },
  w4:  { trigger: 'Software license request submitted', steps: ['Identifies required license tier from request', 'Sends approval request to manager via email', 'On approval, provisions license in system', 'Confirms activation and closes ticket'], lastRun: 'Never' },
  w5:  { trigger: 'Employee submits password reset request', steps: ['Verifies identity via MFA challenge', 'Initiates self-service reset flow', 'Sends reset link to verified email', 'Logs reset event in security audit log'], lastRun: '12 minutes ago' },
  w6:  { trigger: 'Hardware request form submitted', steps: ['Routes to IT procurement queue', 'Generates approval request to manager', 'On approval, creates purchase order', 'Notifies employee on shipping confirmation'], lastRun: 'Never' },
  w7:  { trigger: 'New ticket submitted', steps: ['Compares new ticket to open ticket corpus', 'Calculates similarity score using AI', 'If score > 85%, flags as potential duplicate', 'Prompts agent to review and optionally merge'], lastRun: '1 hour ago' },
  w8:  { trigger: 'IT ticket contains payroll keywords', steps: ['AI detects payroll-related content in ticket', 'Tags ticket with Payroll category', 'Routes to HR Payroll queue automatically', 'Notifies original IT agent of the transfer'], lastRun: '6 hours ago' },
  w9:  { trigger: 'Benefits enrollment window opens (system event)', steps: ['Pulls employee list from Workday', 'Sends reminder email with enrollment deadline', 'Sends follow-up 3 days before close', 'Logs acknowledgement responses'], lastRun: 'Never' },
  w10: { trigger: 'Employee departure submitted in Workday', steps: ['Creates IT offboarding ticket (device return, access revoke)', 'Creates HR offboarding ticket (final payroll, benefits end)', 'Requests manager approval for timeline', 'Sends checklist to employee and their manager'], lastRun: '2 weeks ago' },
  w11: { trigger: 'Ticket status changes to Resolved', steps: ['Waits 1 hour after resolution', 'Sends 3-question CSAT survey to requester', 'Captures response and logs CSAT score', 'Aggregates score into weekly dashboard report'], lastRun: 'Never' },
  w12: { trigger: 'Ticket in Resolved state with no activity', steps: ['Checks last-activity timestamp on all Resolved tickets', 'Flags tickets with > 7 days no activity', 'Sends requester a "still resolved?" confirmation', 'Auto-closes if no reply within 24 hours'], lastRun: '3 hours ago' },
};

// ─── Integration icons ────────────────────────────────────────────────────────

function IntegrationIcon({ type }) {
  const src = INT[type];
  if (!src) return null;
  return <img src={src} width="16" height="16" alt={type} style={{ display: 'block', flexShrink: 0 }} />;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 10, border: 'none',
        background: checked ? 'var(--selected-background-strong)' : 'var(--border)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s', flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: 'var(--surface)', transition: 'left 0.2s',
        boxShadow: 'var(--shadow-sm)',
      }} />
    </button>
  );
}

// ─── Workflow Card ─────────────────────────────────────────────────────────────

function WorkflowCard({ workflow, enabled, onToggle, onClick }) {
  const avatarSrc = AVATARS[workflow.avatar % AVATARS.length];

  return (
    <div onClick={onClick} style={{
      cursor: 'pointer',
      background: 'var(--background-weak)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>

      {/* Header: avatar + title + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img
          src={avatarSrc}
          width="48" height="48"
          alt=""
          style={{ borderRadius: '50%', flexShrink: 0 }}
        />
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.2px' }}>
          {workflow.title}
        </span>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      {/* Description */}
      <p style={{
        fontSize: 14, fontWeight: 400, color: 'var(--text-weak)',
        lineHeight: '22px', margin: 0, letterSpacing: '-0.15px',
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {workflow.description}
      </p>

      {/* Footer: pills + integrations */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
        <span style={{
          height: 28, padding: '0 10px',
          border: '1px solid var(--border)', borderRadius: 14,
          fontSize: 12, color: 'var(--text-weak)',
          display: 'inline-flex', alignItems: 'center', flexShrink: 0,
          maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {workflow.domain}
        </span>
        <span style={{
          height: 28, padding: '0 10px',
          border: '1px solid var(--border)', borderRadius: 14,
          fontSize: 12, color: 'var(--text-weak)',
          display: 'inline-flex', alignItems: 'center', flexShrink: 0,
          maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {workflow.subtitle}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {workflow.integrations.map(i => <IntegrationIcon key={i} type={i} />)}
        </div>
      </div>
    </div>
  );
}

// ─── AutomationDetailPanel ────────────────────────────────────────────────────

function AutomationDetailPanel({ workflow, enabled, onToggle, onClose }) {
  const details = WORKFLOW_DETAILS[workflow.id] ?? { trigger: 'Trigger not configured', steps: [], lastRun: 'Unknown' };
  const avatarSrc = AVATARS[workflow.avatar % AVATARS.length];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <img src={avatarSrc} width="40" height="40" alt="" style={{ borderRadius: '50%', flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: '22px', marginBottom: 4 }}>{workflow.title}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '1px 8px', borderRadius: 100, border: '1px solid var(--border)', color: 'var(--text-weak)' }}>{workflow.domain}</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '1px 8px', borderRadius: 100, border: '1px solid var(--border)', color: 'var(--text-weak)' }}>{workflow.subtitle}</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '1px 8px', borderRadius: 100, border: '1px solid var(--border)', color: workflow.approval === 'Needs approval' ? 'var(--warning-text)' : 'var(--text-weak)' }}>{workflow.approval}</span>
          </div>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', padding: 4, flexShrink: 0 }}>
          <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* Enable/disable */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 8, background: 'var(--background-medium)', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{enabled ? 'Active' : 'Inactive'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-weak)', marginTop: 2 }}>Last run: {details.lastRun} · Used by {workflow.uses}</div>
          </div>
          <Toggle checked={enabled} onChange={onToggle} />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Description</div>
          <p style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '20px', margin: 0 }}>{workflow.description}</p>
        </div>

        {/* Trigger */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Trigger</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'var(--background-medium)', border: '1px solid var(--border)' }}>
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="var(--selected-background-strong)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M7 1L8.5 5.5H13L9.5 8.5L11 13L7 10L3 13L4.5 8.5L1 5.5H5.5L7 1Z"/>
            </svg>
            <span style={{ fontSize: 13, color: 'var(--text)' }}>{details.trigger}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {details.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--selected-background)', border: '1.5px solid var(--selected-background-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--selected-background-strong)' }}>{i + 1}</span>
                  </div>
                  {i < details.steps.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', minHeight: 12, marginTop: 2, marginBottom: 2 }} />}
                </div>
                <div style={{ flex: 1, paddingTop: 2, paddingBottom: i < details.steps.length - 1 ? 10 : 0 }}>
                  <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: '20px' }}>{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected systems */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Connected systems</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {workflow.integrations.map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <IntegrationIcon type={i} />
                <span style={{ fontSize: 12, color: 'var(--text-weak)', textTransform: 'capitalize' }}>{i === 'globe' ? 'Web' : i === 'word' ? 'Microsoft 365' : 'Google Drive'}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── AutomationsView ──────────────────────────────────────────────────────────

const SECTION_DEFS = [
  { key: 'featured', label: 'Featured' },
  { key: 'it',       label: 'IT Queue' },
  { key: 'hr',       label: 'HR Queue' },
  { key: 'cross',    label: 'Cross-team' },
];

const FILTER_OPTIONS = ['All', 'IT', 'HR', 'Cross-team'];

export default function AutomationsView() {
  const [search,          setSearch]          = useState('');
  const [activeFilter,    setActiveFilter]    = useState('All');
  const [enabledState,    setEnabledState]    = useState(
    Object.fromEntries(WORKFLOWS.map(w => [w.id, w.enabled]))
  );
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [customPlaybooks,  setCustomPlaybooks]  = useState([]);
  const [builderTemplate,  setBuilderTemplate]  = useState(undefined); // undefined=closed null=blank obj=template
  const [detailTemplate,   setDetailTemplate]   = useState(null);
  const [promptText,       setPromptText]       = useState('');

  const q = search.toLowerCase();
  const filtered = WORKFLOWS.filter(w => {
    const domainMatch = activeFilter === 'All' || w.domain === activeFilter;
    const searchMatch = !q || w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q);
    return domainMatch && searchMatch;
  });

  const sections = SECTION_DEFS
    .map(def => ({ ...def, workflows: filtered.filter(w => w.section === def.key) }))
    .filter(s => s.workflows.length > 0);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '32px 32px 48px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', margin: '0 0 6px' }}>Playbooks</h1>
        <p style={{ fontSize: 13, color: 'var(--text-weak)', margin: 0 }}>
          Enable pre-built playbooks to automate your service queue, or build a custom one with AI.
        </p>
      </div>

      {/* Inline create prompt */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <textarea
          value={promptText}
          onChange={e => setPromptText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (promptText.trim()) setBuilderTemplate(null);
            }
          }}
          placeholder="Describe a playbook to build with AI — e.g. Auto-escalate tickets when SLA is at risk and notify the team lead"
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box',
            border: '1px solid var(--border)', borderRadius: 12,
            padding: '14px 16px 44px',
            fontSize: 14, color: 'var(--text)', lineHeight: '22px',
            background: 'var(--surface)', resize: 'none', outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
          <button style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-weak)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            @
          </button>
          <button
            onClick={() => { if (promptText.trim()) setBuilderTemplate(null); }}
            style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: promptText.trim() ? 'var(--selected-background-strong)' : 'var(--border)', color: '#fff', cursor: promptText.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 10V2M2 6l4-4 4 4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTER_OPTIONS.map(f => (
            <Pill
              key={f}
              as="button"
              label={f}
              bg={activeFilter === f ? 'var(--text)' : 'var(--background-medium)'}
              color={activeFilter === f ? 'var(--background-weak)' : 'var(--text-weak)'}
              onClick={() => setActiveFilter(f)}
            />
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)', pointerEvents: 'none' }}>
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search playbooks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 30, padding: '0 12px 0 32px',
              border: '1px solid var(--border)', borderRadius: 6,
              fontSize: 13, color: 'var(--text)', background: 'var(--background-weak)',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {sections.map(section => (
          <div key={section.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{section.label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-disabled)' }}>{section.workflows.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {section.workflows.map(w => (
                <WorkflowCard
                  key={w.id}
                  workflow={w}
                  enabled={enabledState[w.id]}
                  onToggle={() => setEnabledState(prev => ({ ...prev, [w.id]: !prev[w.id] }))}
                  onClick={() => setDetailTemplate(w)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Custom playbooks section */}
        {customPlaybooks.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Custom</span>
              <span style={{ fontSize: 13, color: 'var(--text-disabled)' }}>{customPlaybooks.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {customPlaybooks.map(w => (
                <WorkflowCard
                  key={w.id}
                  workflow={w}
                  enabled={enabledState[w.id] ?? true}
                  onToggle={() => setEnabledState(prev => ({ ...prev, [w.id]: !prev[w.id] }))}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {sections.length === 0 && customPlaybooks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-disabled)', fontSize: 14 }}>
            No playbooks match your search.
          </div>
        )}
      </div>

      {selectedWorkflow && (
        <RightPanelOverlay width={480} onClose={() => setSelectedWorkflow(null)}>
          <AutomationDetailPanel
            workflow={selectedWorkflow}
            enabled={enabledState[selectedWorkflow.id] ?? selectedWorkflow.enabled}
            onToggle={val => setEnabledState(prev => ({ ...prev, [selectedWorkflow.id]: val }))}
            onClose={() => setSelectedWorkflow(null)}
            onCustomize={() => {
              setSelectedWorkflow(null);
              // Convert workflow steps to builder canvas format
              const details = { trigger: '', steps: [] };
              const builtSteps = [
                { type: 'trigger', label: details.trigger || selectedWorkflow.title, desc: selectedWorkflow.subtitle },
                ...(WORKFLOW_DETAILS[selectedWorkflow.id]?.steps || []).map(s => ({ type: 'task', label: s, desc: '' })),
              ];
              setBuilderTemplate({ ...selectedWorkflow, steps: builtSteps });
            }}
          />
        </RightPanelOverlay>
      )}

      {detailTemplate && (
        <DetailModal
          template={{
            ...detailTemplate,
            capabilities: WORKFLOW_DETAILS[detailTemplate.id]?.steps || [],
            steps: [
              { type: 'trigger', label: WORKFLOW_DETAILS[detailTemplate.id]?.trigger || detailTemplate.title, desc: detailTemplate.subtitle },
              ...(WORKFLOW_DETAILS[detailTemplate.id]?.steps || []).map(s => ({ type: 'task', label: s, desc: '' })),
            ],
          }}
          onClose={() => setDetailTemplate(null)}
          onCustomize={() => {
            const steps = [
              { type: 'trigger', label: WORKFLOW_DETAILS[detailTemplate.id]?.trigger || detailTemplate.title, desc: detailTemplate.subtitle },
              ...(WORKFLOW_DETAILS[detailTemplate.id]?.steps || []).map(s => ({ type: 'task', label: s, desc: '' })),
            ];
            setBuilderTemplate({ ...detailTemplate, steps });
            setDetailTemplate(null);
          }}
        />
      )}

      {builderTemplate !== undefined && (
        <Builder
          template={builderTemplate}
          initialMessage={builderTemplate === null ? promptText : undefined}
          onBack={() => { setBuilderTemplate(undefined); }}
          onSave={(name, steps) => {
            const newPlaybook = {
              id: 'custom_' + Date.now(),
              title: name, subtitle: 'Custom', domain: 'IT',
              description: `Custom playbook: ${name}`,
              avatar: 6, integrations: ['globe'], uses: '1 team',
              enabled: true, section: 'featured',
            };
            setCustomPlaybooks(prev => [...prev, newPlaybook]);
            setEnabledState(prev => ({ ...prev, [newPlaybook.id]: true }));
            setBuilderTemplate(undefined);
            setPromptText('');
          }}
        />
      )}

    </div>
  );
}
