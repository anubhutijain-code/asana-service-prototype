import { useState, useRef, useEffect } from 'react';

const B = import.meta.env.BASE_URL;

const AVATARS = [
  `${B}avatars/Teammate.svg`,
  `${B}avatars/Teammate1.svg`,
  `${B}avatars/Teammate-1.svg`,
  `${B}avatars/Teammate-2.svg`,
  `${B}avatars/Teammate-3.svg`,
  `${B}avatars/Teammate-4.svg`,
  `${B}avatars/Teammate-5.svg`,
];

const INT = {
  globe: `${B}integrations/globe.svg`,
  word:  `${B}integrations/microsoft-word.svg`,
  drive: `${B}integrations/google-drive.svg`,
};

const FILTERS = ['All', 'Routing', 'SLA', 'Onboarding', 'Notifications', 'Custom'];

const TEMPLATES = [
  {
    id: 't1', filter: 'Routing', avatar: 0,
    title: 'Auto-assign IT Tickets by Category', subtitle: 'Auto-routing', domain: 'IT',
    description: 'Routes new tickets to the right agent based on category — hardware, software, or network.',
    uses: '28 teams', integrations: ['globe', 'word'],
    capabilities: ['AI ticket classification', 'Agent skill matching', 'Automatic assignment', 'Audit log entry'],
    steps: [
      { type: 'trigger',   label: 'New ticket submitted to IT queue', desc: 'IT Queue' },
      { type: 'ai',        label: 'AI classifies ticket category',    desc: 'Hardware · Software · Network' },
      { type: 'condition', label: 'Route by category', branches: ['If Hardware', 'If Software'] },
      { type: 'assign',    label: 'Assign to matching agent',         desc: 'By skill set' },
      { type: 'notify',    label: 'Notify agent via Slack',           desc: 'DM with ticket link' },
    ],
  },
  {
    id: 't2', filter: 'SLA', avatar: 1,
    title: 'SLA Breach Auto-escalation', subtitle: 'SLA management', domain: 'IT',
    description: 'Escalates tickets approaching SLA breach to senior agents and notifies team leads automatically.',
    uses: '35 teams', integrations: ['globe', 'word'],
    capabilities: ['SLA threshold monitoring', 'Auto-escalation to senior agent', 'Team lead notification', 'Audit trail'],
    steps: [
      { type: 'trigger', label: 'SLA reaches 80% of threshold',  desc: 'SLA monitor' },
      { type: 'ai',      label: 'Assess ticket and workload',     desc: 'Assignee capacity check' },
      { type: 'assign',  label: 'Re-assign to senior agent',      desc: 'Available + capacity' },
      { type: 'notify',  label: 'Alert team lead',                desc: '#it-alerts Slack' },
    ],
  },
  {
    id: 't3', filter: 'Onboarding', avatar: 2,
    title: 'New Hire Cross-team Onboarding', subtitle: 'Onboarding', domain: 'Cross-team',
    description: 'Coordinates IT setup, HR paperwork, and equipment provisioning in a single workflow.',
    uses: '41 teams', integrations: ['globe', 'word', 'drive'],
    capabilities: ['Cross-team task creation', 'Equipment provisioning', 'Welcome email automation', 'Progress tracking'],
    steps: [
      { type: 'trigger', label: 'New hire added in Workday',    desc: 'Workday integration' },
      { type: 'task',    label: 'Create IT onboarding ticket',  desc: 'Device + access' },
      { type: 'task',    label: 'Create HR onboarding ticket',  desc: 'Paperwork + benefits' },
      { type: 'notify',  label: 'Send welcome email',           desc: 'With checklist link' },
    ],
  },
  {
    id: 't4', filter: 'Notifications', avatar: 3,
    title: 'CSAT Survey on Ticket Close', subtitle: 'Feedback', domain: 'Cross-team',
    description: 'Sends a satisfaction survey when a ticket resolves, with results aggregated in dashboards.',
    uses: '44 teams', integrations: ['globe', 'drive'],
    capabilities: ['Automated survey delivery', 'Response tracking', 'CSAT score aggregation', 'Weekly dashboard report'],
    steps: [
      { type: 'trigger', label: 'Ticket status → Resolved', desc: 'Status change trigger' },
      { type: 'ai',      label: 'Wait 1 hour',              desc: 'Cool-down period' },
      { type: 'notify',  label: 'Send CSAT survey',         desc: '3-question via email' },
      { type: 'task',    label: 'Log score to dashboard',   desc: 'Weekly aggregate' },
    ],
  },
  {
    id: 't5', filter: 'Routing', avatar: 4,
    title: 'Duplicate Ticket Detection & Merge', subtitle: 'Queue management', domain: 'IT',
    description: 'Detects and merges duplicate tickets, keeping queues clean and preventing duplicated effort.',
    uses: '22 teams', integrations: ['globe', 'word'],
    capabilities: ['AI similarity scoring', 'Duplicate flagging', 'Agent merge prompt', 'Queue deduplication'],
    steps: [
      { type: 'trigger',   label: 'New ticket submitted',    desc: 'IT Queue' },
      { type: 'ai',        label: 'AI similarity check',     desc: 'vs. open ticket corpus' },
      { type: 'condition', label: 'Similarity score check',  branches: ['If score > 85%', 'If score ≤ 85%'] },
      { type: 'assign',    label: 'Prompt agent to merge',   desc: 'Show duplicate link' },
    ],
  },
  {
    id: 't6', filter: 'Routing', avatar: 5,
    title: 'Password Reset Self-Service', subtitle: 'Access control', domain: 'IT',
    description: 'Guides users through self-service password resets, reducing IT queue volume for routine requests.',
    uses: '52 teams', integrations: ['globe', 'word'],
    capabilities: ['MFA identity verification', 'Self-service reset flow', 'Security audit logging', 'Queue deflection'],
    steps: [
      { type: 'trigger', label: 'Password reset request submitted', desc: 'IT Queue · Access' },
      { type: 'ai',      label: 'Verify identity via MFA',          desc: 'Challenge-response' },
      { type: 'notify',  label: 'Send reset link',                  desc: 'To verified email' },
      { type: 'task',    label: 'Log reset to security audit',      desc: 'Compliance record' },
    ],
  },
];

// ─── Blank builder scripted chat ──────────────────────────────────────────────

const BLANK_SCRIPT = [
  {
    ai: "What should this playbook trigger on? For example, 'a new ticket is submitted' or 'an SLA is at risk'.",
    progressStep: null,
    canvasSteps: [],
  },
  {
    ai: "Got it — I'll trigger this when a new ticket lands in the IT queue. What should happen next? Classify it by category, or assign directly to an agent?",
    progressStep: 'Identified trigger condition',
    canvasSteps: [
      { type: 'trigger', label: 'New ticket submitted to IT queue', desc: 'IT Queue' },
    ],
  },
  {
    ai: "Added AI classification across Hardware, Software, and Network. Should I route to a specific team per category, or set a conditional branch?",
    progressStep: 'Added AI classification step',
    canvasSteps: [
      { type: 'trigger', label: 'New ticket submitted to IT queue', desc: 'IT Queue' },
      { type: 'ai',      label: 'AI classifies ticket category',    desc: 'Hardware · Software · Network' },
    ],
  },
  {
    ai: "I've set up routing branches. Want to notify the assigned agent via Slack, or add an SLA reminder if it isn't resolved in 4 hours?",
    progressStep: 'Added routing conditions',
    canvasSteps: [
      { type: 'trigger',   label: 'New ticket submitted to IT queue', desc: 'IT Queue' },
      { type: 'ai',        label: 'AI classifies ticket category',    desc: 'Hardware · Software · Network' },
      { type: 'condition', label: 'Route by category',               branches: ['If Hardware', 'If Other'] },
      { type: 'assign',    label: 'Assign to matching agent',        desc: 'By category skill set' },
    ],
  },
  {
    ai: "Your playbook is ready. Click **Save playbook** to add it to your queue. You can edit any step anytime.",
    progressStep: 'Playbook complete',
    canvasSteps: [
      { type: 'trigger',   label: 'New ticket submitted to IT queue', desc: 'IT Queue' },
      { type: 'ai',        label: 'AI classifies ticket category',    desc: 'Hardware · Software · Network' },
      { type: 'condition', label: 'Route by category',               branches: ['If Hardware', 'If Other'] },
      { type: 'assign',    label: 'Assign to matching agent',        desc: 'By category skill set' },
      { type: 'notify',    label: 'Notify agent via Slack',          desc: 'DM with ticket link' },
    ],
  },
];

// ─── Step icon circles (Image #6 style) ──────────────────────────────────────

const STEP_ICON_DATA = {
  trigger: {
    bg: '#F59E0B',
    icon: (
      <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
        <path d="M7.5 2L5 7.5h4L6.5 12.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  ai: {
    bg: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
    icon: <span style={{ fontSize: 13, color: '#fff', lineHeight: 1, userSelect: 'none' }}>✦</span>,
  },
  task: {
    bg: '#10B981',
    icon: (
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
        <path d="M2.5 7.5l3.5 3 5.5-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  assign: {
    bg: '#3B82F6',
    icon: (
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
        <circle cx="7" cy="5" r="2.2" stroke="#fff" strokeWidth="1.4"/>
        <path d="M2.5 12c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  condition: {
    bg: '#F59E0B',
    icon: (
      <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
        <path d="M6 1.5L10.5 6 6 10.5 1.5 6 6 1.5Z" fill="#fff"/>
      </svg>
    ),
  },
  notify: {
    bg: '#EC4899',
    icon: (
      <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
        <path d="M7 1.5c-2.5 0-4 1.8-4 4v3l-1 1.5h10l-1-1.5V5.5c0-2.2-1.5-4-4-4zM5.5 10.5a1.5 1.5 0 003 0" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
};

// Step colors for DetailModal step list (subtle tint)
const STEP_COLORS = {
  trigger:   { bg: '#FFFBEB', border: '#FDE68A' },
  ai:        { bg: '#F5F3FF', border: '#DDD6FE' },
  task:      { bg: '#ECFDF5', border: '#A7F3D0' },
  assign:    { bg: '#EFF6FF', border: '#BFDBFE' },
  condition: { bg: '#FFFBEB', border: '#FDE68A' },
  notify:    { bg: '#FDF2F8', border: '#FBCFE8' },
};

// ─── Canvas primitives (Image #6 style) ──────────────────────────────────────

function StepRow({ step, stepNumber }) {
  const iconData = STEP_ICON_DATA[step.type] || STEP_ICON_DATA.task;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', minHeight: 46 }}>
      <span style={{ fontSize: 12, color: '#9CA3AF', width: 16, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
        {stepNumber}
      </span>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: iconData.bg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {iconData.icon}
      </div>
      <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', fontWeight: 400, lineHeight: '20px' }}>
        {step.label}
      </span>
      {step.desc && (
        <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {step.desc}
        </span>
      )}
    </div>
  );
}

function CanvasConnector({ dashed }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: 24 }}>
      <div style={{
        width: 1, height: '100%',
        background: dashed ? 'transparent' : '#E5E7EB',
        borderLeft: dashed ? '2px dashed #E5E7EB' : 'none',
      }} />
    </div>
  );
}

function BranchPills({ branches }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '2px 0 2px' }}>
      {(branches || []).map((br, i) => {
        const active = i === 0;
        const label = br.replace(/^If\s+/i, '');
        return (
          <div key={i} style={{
            height: 28, padding: '0 10px',
            border: `1px solid ${active ? '#10B981' : '#D1D5DB'}`,
            borderRadius: 14,
            background: active ? '#ECFDF5' : '#fff',
            color: active ? '#059669' : '#6B7280',
            fontSize: 12, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
              <circle cx="6" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 11c0-2 1.8-3.2 4-3.2s4 1.2 4 3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            If {label}
          </div>
        );
      })}
    </div>
  );
}

// Render canvasSteps as Image #6 cards with connectors
function CanvasStepList({ steps }) {
  if (!steps || steps.length === 0) return null;

  const elements = [];
  let stepNum = 0;

  // Group consecutive non-condition steps into cards
  // For simplicity: each non-condition step is its own card; conditions become branch pills
  let i = 0;
  while (i < steps.length) {
    const step = steps[i];

    if (step.type === 'condition') {
      // Dashed connector before pills
      if (elements.length > 0) elements.push(<CanvasConnector key={`conn-pre-${i}`} dashed />);
      elements.push(<BranchPills key={`branch-${i}`} branches={step.branches} />);
      // Normal connector after pills if more steps follow
      if (i < steps.length - 1) elements.push(<CanvasConnector key={`conn-post-${i}`} />);
      i++;
    } else {
      // Normal step card
      if (elements.length > 0 && steps[i - 1]?.type !== 'condition') {
        elements.push(<CanvasConnector key={`conn-${i}`} />);
      }
      stepNum++;
      elements.push(
        <div key={`card-${i}`} style={{ border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
          <StepRow step={step} stepNumber={stepNum} />
        </div>
      );
      i++;
    }
  }

  return <>{elements}</>;
}

// ─── Small primitives ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={e => { e.stopPropagation(); onChange(!checked); }}
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
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  );
}

function IntegrationIcon({ type }) {
  const src = INT[type];
  if (!src) return null;
  return <img src={src} width="14" height="14" alt={type} style={{ display: 'block', flexShrink: 0 }} />;
}

// ─── TemplateCard ─────────────────────────────────────────────────────────────

function TemplateCard({ template, onClick }) {
  const [enabled, setEnabled] = useState(true);
  const [hovered, setHovered] = useState(false);
  const avatarSrc = AVATARS[template.avatar % AVATARS.length];
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: 'var(--background-weak)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={avatarSrc} width="48" height="48" alt="" style={{ borderRadius: '50%', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.2px' }}>
          {template.title}
        </span>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-weak)', lineHeight: '22px', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {template.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 14, fontSize: 12, color: 'var(--text-weak)', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          {template.domain}
        </span>
        <span style={{ height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 14, fontSize: 12, color: 'var(--text-weak)', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          {template.subtitle}
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {template.integrations.map(i => <IntegrationIcon key={i} type={i} />)}
        </div>
      </div>
    </div>
  );
}

// ─── DetailModal ──────────────────────────────────────────────────────────────

export function DetailModal({ template, onClose, onCustomize }) {
  const avatarSrc = AVATARS[template.avatar % AVATARS.length];
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 310, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.32)' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 520, maxHeight: '82vh', background: 'var(--surface)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
      >
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
            <img src={avatarSrc} width="48" height="48" alt="" style={{ borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: '22px' }}>{template.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[template.domain, template.subtitle, `Used by ${template.uses}`].map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, border: '1px solid var(--border)', color: 'var(--text-weak)' }}>{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', padding: 4, flexShrink: 0, marginTop: -2 }}>
              <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '20px', margin: 0 }}>{template.description}</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>What it does</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {template.capabilities.map((cap, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 6l3 3 5-5" stroke="var(--success-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Steps</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {template.steps.filter(s => s.type !== 'condition').map((step, i, arr) => {
                const c = STEP_COLORS[step.type] || STEP_COLORS.task;
                const iconData = STEP_ICON_DATA[step.type] || STEP_ICON_DATA.task;
                return (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: iconData.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {iconData.icon}
                      </div>
                      {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: '#E5E7EB', minHeight: 10, margin: '2px 0' }} />}
                    </div>
                    <div style={{ flex: 1, paddingTop: 3, paddingBottom: i < arr.length - 1 ? 10 : 0 }}>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{step.label}</span>
                      {step.desc && <span style={{ fontSize: 12, color: 'var(--text-weak)', marginLeft: 6 }}>— {step.desc}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Integrations</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {template.integrations.map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background-medium)' }}>
                  <IntegrationIcon type={i} />
                  <span style={{ fontSize: 12, color: 'var(--text-weak)' }}>{i === 'globe' ? 'Web' : i === 'word' ? 'Microsoft 365' : 'Google Drive'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ height: 34, padding: '0 16px', border: '1px solid var(--border)', borderRadius: 6, background: 'none', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onCustomize} style={{ height: 34, padding: '0 16px', border: 'none', borderRadius: 6, background: 'var(--selected-background-strong)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────

function Bubble({ role, text }) {
  return (
    <div style={{ display: 'flex', justifyContent: role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      <div style={{
        maxWidth: '86%', padding: '10px 14px',
        borderRadius: role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
        background: role === 'user' ? 'var(--selected-background-strong)' : 'var(--background-medium)',
        color: role === 'user' ? '#fff' : 'var(--text)',
        fontSize: 13, lineHeight: '20px',
      }}>
        {text.replace(/\*\*(.*?)\*\*/g, '$1')}
      </div>
    </div>
  );
}

function ProgressCard({ completedSteps }) {
  const ALL = [
    'Analyzed your request',
    'Identified trigger condition',
    'Added AI classification step',
    'Added routing conditions',
    'Playbook complete',
  ];
  const nextIdx = ALL.findIndex(s => !completedSteps.has(s));
  const visible = ALL.slice(0, nextIdx === -1 ? ALL.length : nextIdx + 1);
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Creating workflow</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((s, i) => {
          const done = completedSteps.has(s);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: done ? 'var(--success-text)' : 'var(--text-weak)' }}>
              {done ? (
                <svg viewBox="0 0 12 12" width="12" height="12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--selected-background-strong)', flexShrink: 0, margin: '0 2px' }} />
              )}
              {s}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export function Builder({ template, initialMessage, onBack, onSave }) {
  const isBlank = !template;
  const [name, setName] = useState(template ? template.title : 'My playbook');
  const [activeTab, setActiveTab] = useState('Build');
  const [messages, setMessages] = useState(() => {
    const initial = isBlank
      ? [{ role: 'ai', text: BLANK_SCRIPT[0].ai }]
      : [{ role: 'ai', text: `Here's your "${template.title}" playbook pre-filled with the standard steps. Ask me to modify any step or add new ones.` }];
    if (initialMessage) {
      // Seed with the user's typed prompt + first AI response
      const script = BLANK_SCRIPT[1];
      return [
        { role: 'user', text: initialMessage },
        { role: 'ai', text: script.ai },
      ];
    }
    return initial;
  });
  const [canvasSteps, setCanvasSteps] = useState(() => {
    if (isBlank && initialMessage) return BLANK_SCRIPT[1].canvasSteps;
    if (!isBlank) return template.steps;
    return [];
  });
  const [scriptIdx, setScriptIdx] = useState(initialMessage ? 1 : 0);
  const [completedProgress, setCompletedProgress] = useState(() =>
    new Set(initialMessage ? ['Analyzed your request', 'Identified trigger condition'] : ['Analyzed your request'])
  );
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text) {
    const msg = text.trim();
    if (!msg || saved) return;

    if (isBlank) {
      const nextIdx = Math.min(scriptIdx + 1, BLANK_SCRIPT.length - 1);
      const script = BLANK_SCRIPT[nextIdx];
      setMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'ai', text: script.ai }]);
      setScriptIdx(nextIdx);
      if (script.canvasSteps.length > 0) setCanvasSteps(script.canvasSteps);
      if (script.progressStep) setCompletedProgress(prev => new Set([...prev, script.progressStep]));
    } else {
      const replies = [
        "Got it, I've updated that step. Anything else you'd like to change?",
        "Done — I've adjusted the routing logic. Want to add a notification step?",
        "Updated. Your playbook looks good. Click Save when you're ready.",
      ];
      const reply = replies[Math.min(scriptIdx, replies.length - 1)];
      setMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'ai', text: reply }]);
      setScriptIdx(prev => Math.min(prev + 1, replies.length - 1));
    }
    setInput('');
  }

  const chips = isBlank
    ? ['Add an SLA reminder', 'Notify via Slack', 'Add approval step', 'Route by priority']
    : ['Change the trigger', 'Add a notification', 'Add approval step', 'Add SLA check'];
  const showChips = isBlank ? scriptIdx < BLANK_SCRIPT.length - 1 : scriptIdx < 2;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ height: 52, flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6, fontSize: 13 }}>
          <svg viewBox="0 0 14 10" width="14" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 5H1M5 1L1 5l4 4"/></svg>
          Back
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: 'var(--text)', background: 'transparent', minWidth: 0 }}
        />
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'var(--background-medium)', color: 'var(--text-weak)', fontWeight: 500, flexShrink: 0 }}>Draft</span>
        <div style={{ display: 'flex', gap: 2, background: 'var(--background-medium)', borderRadius: 8, padding: 3, flexShrink: 0 }}>
          {['Build', 'Monitor', 'Test'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              height: 28, padding: '0 12px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500,
              background: activeTab === tab ? 'var(--surface)' : 'transparent',
              color: activeTab === tab ? 'var(--text)' : 'var(--text-weak)',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{tab}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={onBack} style={{ height: 32, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 6, background: 'none', color: 'var(--text)', fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
          Cancel
        </button>
        <button
          onClick={() => { setSaved(true); setTimeout(() => onSave(name, canvasSteps), 300); }}
          style={{ height: 32, padding: '0 14px', border: 'none', borderRadius: 6, background: saved ? '#10B981' : 'var(--selected-background-strong)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}
        >
          {saved ? 'Saved ✓' : 'Save playbook'}
        </button>
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: chat */}
        <div style={{ width: '35%', minWidth: 280, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: '#fff' }}>✦</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Playbook builder</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column' }}>
            {isBlank && <ProgressCard completedSteps={completedProgress} />}
            {messages.map((m, i) => <Bubble key={i} role={m.role} text={m.text} />)}
            <div ref={chatEndRef} />
          </div>
          {showChips && (
            <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
              {chips.map((c, i) => (
                <button key={i} onClick={() => sendMessage(c)} style={{
                  height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 14,
                  background: 'var(--background-medium)', color: 'var(--text-weak)', fontSize: 12, cursor: 'pointer',
                }}>{c}</button>
              ))}
            </div>
          )}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder={saved ? 'Playbook saved' : 'Describe a change or ask a question…'}
              disabled={saved}
              style={{ flex: 1, height: 36, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', fontSize: 13, color: 'var(--text)', background: 'var(--background-weak)', outline: 'none' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || saved}
              style={{
                width: 36, height: 36, border: 'none', borderRadius: 8, flexShrink: 0,
                background: input.trim() && !saved ? 'var(--selected-background-strong)' : 'var(--border)',
                color: '#fff', cursor: input.trim() && !saved ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 1L1 6l5 1.5L7.5 13 13 1z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right: visual canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 0', background: '#F9FAFB' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 40px' }}>
            {canvasSteps.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text-disabled)' }}>
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none" style={{ margin: '0 auto 16px', opacity: 0.25 }}>
                  <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 16v16M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-weak)' }}>Describe your playbook in the chat</div>
                <div style={{ fontSize: 13, marginTop: 4, color: 'var(--text-disabled)' }}>Steps will appear here as you build</div>
              </div>
            ) : (
              <div>
                {/* Trigger event label */}
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6, paddingLeft: 2 }}>Trigger event</div>

                <CanvasStepList steps={canvasSteps} />

                {/* Add step */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                  <CanvasConnector />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: '1px solid #D1D5DB', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#9CA3AF', fontSize: 16, lineHeight: 1,
                  }}>+</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PlaybookGallery (standalone full-screen, kept for reference) ─────────────

export default function PlaybookGallery({ onClose, onSaved }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [builderTemplate, setBuilderTemplate] = useState(undefined);

  const filtered = TEMPLATES.filter(t => {
    const filterMatch = activeFilter === 'All' || t.filter === activeFilter;
    const q = search.toLowerCase();
    return filterMatch && (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  });

  if (builderTemplate !== undefined) {
    return (
      <Builder
        template={builderTemplate}
        onBack={() => setBuilderTemplate(undefined)}
        onSave={(name, steps) => {
          onSaved?.({ id: 'custom_' + Date.now(), title: name, subtitle: 'Custom', domain: 'IT', description: `Custom playbook: ${name}`, avatar: 6, integrations: ['globe'], uses: '1 team', enabled: true, section: 'featured', filter: 'Custom', capabilities: steps.map(s => s.label), steps });
          onClose?.();
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'var(--surface)', overflowY: 'auto' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: 16 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6, fontSize: 13 }}>
          <svg viewBox="0 0 14 10" width="14" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 5H1M5 1L1 5l4 4"/></svg>
          Back to Playbooks
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => setBuilderTemplate(null)} style={{ height: 34, padding: '0 14px', border: 'none', borderRadius: 6, background: 'var(--selected-background-strong)', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          + Blank playbook
        </button>
      </div>
      <div style={{ textAlign: 'center', padding: '48px 32px 28px' }}>
        <h1 style={{ fontFamily: '"SF Pro Display"', fontSize: 28, fontWeight: 500, color: 'var(--text)', margin: '0 0 8px' }}>What should this playbook do?</h1>
        <p style={{ fontSize: 15, color: 'var(--text-weak)', margin: '0 0 28px' }}>Start from a template or describe what you need.</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 32px 28px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{ height: 32, padding: '0 14px', border: `1px solid ${activeFilter === f ? 'var(--text)' : 'var(--border)'}`, borderRadius: 16, cursor: 'pointer', fontSize: 13, background: activeFilter === f ? 'var(--text)' : 'var(--surface)', color: activeFilter === f ? 'var(--surface)' : 'var(--text-weak)', fontWeight: activeFilter === f ? 500 : 400 }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: '0 32px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
          {filtered.map(t => <TemplateCard key={t.id} template={t} onClick={() => setSelectedTemplate(t)} />)}
        </div>
      </div>
      {selectedTemplate && <DetailModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} onCustomize={() => { setSelectedTemplate(null); setBuilderTemplate(selectedTemplate); }} />}
    </div>
  );
}
