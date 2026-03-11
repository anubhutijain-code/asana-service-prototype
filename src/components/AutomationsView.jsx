import { useState } from 'react';
import Pill from './Pill';

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
        background: 'white', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

// ─── Workflow Card ─────────────────────────────────────────────────────────────

function WorkflowCard({ workflow, enabled, onToggle }) {
  const avatarSrc = AVATARS[workflow.avatar % AVATARS.length];

  return (
    <div style={{
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

// ─── AutomationsView ──────────────────────────────────────────────────────────

const SECTION_DEFS = [
  { key: 'featured', label: 'Featured' },
  { key: 'it',       label: 'IT Queue' },
  { key: 'hr',       label: 'HR Queue' },
  { key: 'cross',    label: 'Cross-team' },
];

const FILTER_OPTIONS = ['All', 'IT', 'HR', 'Cross-team'];

export default function AutomationsView() {
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [enabledState, setEnabledState] = useState(
    Object.fromEntries(WORKFLOWS.map(w => [w.id, w.enabled]))
  );

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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: '#1E1F21', margin: '0 0 6px' }}>Automations</h1>
        <p style={{ fontSize: 13, color: 'var(--text-weak)', margin: 0 }}>
          Enable pre-built workflows to automate your service queue. Agents can toggle automations for their queues.
        </p>
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
            placeholder="Search automations..."
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
                />
              ))}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-disabled)', fontSize: 14 }}>
            No automations match your search.
          </div>
        )}
      </div>

    </div>
  );
}
