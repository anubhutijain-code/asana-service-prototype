// ─── SettingsView — Admin queue management ────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateQueuePanel from './CreateQueuePanel';
import { session } from '../data/sessionState';
import { SFT, SFD, LIGA } from '../constants/typography';

const B = import.meta.env.BASE_URL;
const AVATARS = [
  `${B}avatars/Teammate.svg`, `${B}avatars/Teammate1.svg`,
  `${B}avatars/Teammate-1.svg`, `${B}avatars/Teammate-2.svg`,
  `${B}avatars/Teammate-3.svg`, `${B}avatars/Teammate-4.svg`,
  `${B}avatars/Teammate-5.svg`,
];
const INT = {
  globe: `${B}integrations/globe.svg`,
  word:  `${B}integrations/microsoft-word.svg`,
  drive: `${B}integrations/google-drive.svg`,
};

const BASE     = { fontFamily: SFT, ...LIGA };
const typoCell = { ...BASE, fontSize: '14px', fontWeight: 400, lineHeight: '20px', color: 'var(--text)' };
const typoMeta = { ...BASE, fontSize: '12px', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)' };

// ── Data ──────────────────────────────────────────────────────────────────────

const QUEUE_CONFIGS = {
  it: {
    id: 'it', name: 'IT Tickets', initials: 'IT', color: '#0078D4',
    isDefault: true,
    desc: 'Handles all IT service requests and incidents including endpoint devices, access management, and change advisory.',
    createdBy: 'Alex Morgan', createdAt: 'Jan 15, 2025',
    email: 'it-help@acme.com', slack: '#it-help',
    dayRange: 'Mon–Fri', startTime: '9:00 AM', endTime: '6:00 PM',
    members: [
      { name: 'Jordan Ellis',  bg: '#F1BD6C' },
      { name: 'Marcus Rivera', bg: '#4ECBC4' },
      { name: 'Ajeet Cyrus',   bg: '#4573D2' },
      { name: 'Zoe Wong',      bg: '#5DA283' },
      { name: 'Riya Desai',    bg: '#B3DF97' },
    ],
    sla: { firstResponse: '4h', update: '8h', resolution: '24h', autoEscalate: true, usingDefaults: false },
    kb:  { name: 'IT Knowledge Base', articles: 142, aiDeflection: true,  lastUpdated: '2 days ago' },
    aiEnabled: true, integrationsConnected: 3, automationsActive: 5,
  },
  hr: {
    id: 'hr', name: 'HR Tickets', initials: 'HR', color: '#E56020',
    isDefault: false,
    desc: 'Employee requests for HR policies, payroll, benefits, and workplace questions.',
    createdBy: 'Sarah Chen', createdAt: 'Feb 3, 2025',
    email: 'hr-help@acme.com', slack: '#hr-help',
    dayRange: 'Mon–Fri', startTime: '8:00 AM', endTime: '5:00 PM',
    members: [
      { name: 'Priya Kapoor',  bg: '#F1BD6C' },
      { name: 'Lisa Nakamura', bg: '#4ECBC4' },
      { name: 'Rachel Kim',    bg: '#F06A6A' },
    ],
    sla: { firstResponse: '8h', update: '12h', resolution: '48h', autoEscalate: true, usingDefaults: true },
    kb:  { name: 'HR Knowledge Base',  articles: 87, aiDeflection: true, lastUpdated: '5 days ago' },
    aiEnabled: true, integrationsConnected: 2, automationsActive: 3,
  },
};

const QUEUES_LIST = [QUEUE_CONFIGS.it, QUEUE_CONFIGS.hr];

// Playbooks per queue
const ALL_PLAYBOOKS = {
  it: [
    { id: 'w1',  section: 'Queue',      avatar: 0, domain: 'IT',         title: 'Auto-assign by Category',             subtitle: 'Auto-routing',     enabled: true,  integrations: ['globe','word'],         desc: 'Routes incoming tickets to the right agent based on category tags and workload.' },
    { id: 'w3',  section: 'Queue',      avatar: 1, domain: 'IT',         title: 'SLA Breach Auto-escalation',           subtitle: 'SLA management',   enabled: true,  integrations: ['globe','word'],         desc: 'Automatically escalates tickets approaching or past their SLA deadline.' },
    { id: 'w5',  section: 'Queue',      avatar: 2, domain: 'IT',         title: 'Password Reset Self-Service',          subtitle: 'Access control',   enabled: true,  integrations: ['globe'],               desc: 'Lets employees reset passwords without agent involvement via the AI portal.' },
    { id: 'w4',  section: 'Queue',      avatar: 3, domain: 'IT',         title: 'Software License Request & Approval',  subtitle: 'Access control',   enabled: false, integrations: ['globe','word','drive'], desc: 'Routes software requests to the right approver and tracks fulfillment.' },
    { id: 'w6',  section: 'Queue',      avatar: 4, domain: 'IT',         title: 'Hardware Request Fulfillment',         subtitle: 'Hardware',         enabled: false, integrations: ['globe','drive'],        desc: 'Manages hardware orders, shipping, and asset tagging end-to-end.' },
    { id: 'w7',  section: 'Queue',      avatar: 5, domain: 'IT',         title: 'Duplicate Ticket Detection & Merge',   subtitle: 'Queue management', enabled: false, integrations: ['globe','word'],         desc: 'Detects similar open tickets and merges them to prevent duplicate work.' },
    { id: 'w2',  section: 'Cross-team', avatar: 6, domain: 'Cross-team', title: 'New Hire Cross-team Onboarding',       subtitle: 'Onboarding',       enabled: true,  integrations: ['globe','word','drive'], desc: 'Coordinates with HR and Facilities when a new hire IT ticket is opened.' },
    { id: 'w8',  section: 'Cross-team', avatar: 0, domain: 'Cross-team', title: 'Payroll Issue Auto-route to HR',       subtitle: 'Payroll',          enabled: true,  integrations: ['globe','word'],         desc: 'Detects payroll-related tickets and reroutes them to the HR queue.' },
    { id: 'w11', section: 'Cross-team', avatar: 1, domain: 'Cross-team', title: 'CSAT Survey on Ticket Close',          subtitle: 'Feedback',         enabled: false, integrations: ['globe','drive'],        desc: 'Sends a satisfaction survey to the requester when their ticket is closed.' },
  ],
  hr: [
    { id: 'h1',  section: 'Queue',      avatar: 0, domain: 'HR',         title: 'Benefits Inquiry Auto-response',       subtitle: 'Benefits',         enabled: true,  integrations: ['globe','word'],         desc: 'Answers common benefits questions automatically using the HR knowledge base.' },
    { id: 'h2',  section: 'Queue',      avatar: 1, domain: 'HR',         title: 'Payroll Issue Escalation',             subtitle: 'Payroll',          enabled: true,  integrations: ['globe','word'],         desc: 'Flags and escalates payroll discrepancies to the payroll team immediately.' },
    { id: 'h3',  section: 'Queue',      avatar: 2, domain: 'HR',         title: 'PTO Request Routing',                  subtitle: 'Leave management', enabled: true,  integrations: ['globe'],               desc: 'Routes PTO requests to the correct manager and tracks approval status.' },
    { id: 'h4',  section: 'Queue',      avatar: 3, domain: 'HR',         title: 'New Hire Onboarding Checklist',        subtitle: 'Onboarding',       enabled: false, integrations: ['globe','word','drive'], desc: 'Generates and tracks a checklist of onboarding tasks for each new hire.' },
    { id: 'w2',  section: 'Cross-team', avatar: 4, domain: 'Cross-team', title: 'New Hire Cross-team Onboarding',       subtitle: 'Onboarding',       enabled: true,  integrations: ['globe','word','drive'], desc: 'Coordinates with IT and Facilities when a new hire HR ticket is opened.' },
    { id: 'w11', section: 'Cross-team', avatar: 5, domain: 'Cross-team', title: 'CSAT Survey on Ticket Close',          subtitle: 'Feedback',         enabled: false, integrations: ['globe','drive'],        desc: 'Sends a satisfaction survey to the requester when their ticket is closed.' },
  ],
};

// ── Primitives ────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
      style={{ position: 'relative', width: 36, height: 20, borderRadius: 10, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, background: value ? 'var(--selected-background-strong)' : 'var(--border)', transition: 'background 0.15s' }}>
      <span style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: 8, background: 'var(--surface)', transition: 'left 0.15s', left: value ? 18 : 2, boxShadow: 'var(--shadow-sm)' }} />
    </button>
  );
}

function Avi({ name, bg, size = 26, border = false }) {
  const ini = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div title={name} style={{ width: size, height: size, borderRadius: '50%', background: bg, border: border ? '2px solid var(--surface)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.37), fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: SFT, boxSizing: 'border-box' }}>
      {ini}
    </div>
  );
}

function EditBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', ...BASE, fontSize: 12, color: 'var(--text-weak)', cursor: 'pointer', flexShrink: 0 }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}>
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z"/>
      </svg>
      Edit
    </button>
  );
}

// Section divider — replaces SectionCard
function Section({ title, onEdit, children, style }) {
  return (
    <div style={{ marginBottom: 48, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        <span style={{ ...BASE, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        {onEdit && <EditBtn onClick={onEdit} />}
      </div>
      {children}
    </div>
  );
}

// ── Queue detail sections ─────────────────────────────────────────────────────

// ── Queue detail sections ─────────────────────────────────────────────────────

function MembersSection({ q }) {
  return (
    <Section title="Members" onEdit={() => {}}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {q.members.map(m => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px 5px 7px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-weak)' }}>
            <Avi name={m.name} bg={m.bg} size={22} />
            <span style={{ ...BASE, fontSize: 13, color: 'var(--text)' }}>{m.name}</span>
          </div>
        ))}
      </div>
      <p style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '18px' }}>
        Only listed members can see and work tickets in this queue. All others can still transfer tickets in.
      </p>
    </Section>
  );
}

function ChannelsSection({ q }) {
  const rows = [
    { icon: <svg viewBox="0 0 16 16" width="15" height="15" fill="none" style={{ color: '#4573D2' }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: 'AI Portal', value: 'Auto-routes from shared portal', badge: 'Connected' },
    { icon: <span style={{ ...BASE, fontSize: 14, color: 'var(--text-weak)', lineHeight: 1 }}>#</span>, label: 'Slack', value: q.slack },
    { icon: <svg viewBox="0 0 16 16" width="15" height="15" fill="none" style={{ color: 'var(--text-weak)' }}><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, label: 'Email', value: q.email },
  ];
  return (
    <Section title="Intake channels" onEdit={() => {}}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
            <span style={{ ...BASE, fontSize: 13, fontWeight: 500, color: 'var(--text)', width: 80, flexShrink: 0 }}>{r.label}</span>
            <span style={{ ...BASE, fontSize: 13, color: 'var(--text-weak)', flex: 1 }}>{r.value}</span>
            {r.badge && <span style={{ ...BASE, fontSize: 11, fontWeight: 500, color: 'var(--success-text)', background: 'var(--success-background)', padding: '2px 8px', borderRadius: 4 }}>{r.badge}</span>}
          </div>
        ))}
      </div>
    </Section>
  );
}

function SlaSection({ q }) {
  const { sla } = q;
  return (
    <Section title="SLA targets" onEdit={() => {}}>
      {sla.usingDefaults && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', ...BASE, fontSize: 12, color: 'var(--text-weak)', marginBottom: 16 }}>
          Using workspace defaults
        </div>
      )}
      <div style={{ display: 'flex', gap: 48, marginBottom: 14 }}>
        {[
          { label: 'First response', value: sla.firstResponse },
          { label: 'Update',         value: sla.update        },
          { label: 'Resolution',     value: sla.resolution    },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: SFD, fontSize: 32, fontWeight: 400, color: 'var(--text)', lineHeight: '38px', fontFeatureSettings: "'liga' off, 'clig' off" }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <svg viewBox="0 0 12 12" width="11" height="11" fill="none" style={{ color: '#F1BD6C', flexShrink: 0 }}>
          <path d="M6 1l1 3h3l-2.5 2 1 3L6 7.5 3.5 9l1-3L2 4h3z" fill="currentColor"/>
        </svg>
        <span style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)' }}>
          Auto-escalate on breach:{' '}
          <span style={{ color: sla.autoEscalate ? 'var(--success-text)' : 'var(--text-disabled)', fontWeight: 500 }}>
            {sla.autoEscalate ? 'Enabled' : 'Disabled'}
          </span>
        </span>
      </div>
    </Section>
  );
}

function KbSection({ q }) {
  const { kb } = q;
  return (
    <Section title="Knowledge Base" onEdit={() => {}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#4573D2" strokeWidth="1.4" strokeLinecap="round"><rect x="2" y="1" width="10" height="12" rx="1.5"/><path d="M4.5 4h5M4.5 6.5h5M4.5 9h3"/></svg>
        <span style={{ ...BASE, fontSize: 13, fontWeight: 500, color: '#4573D2' }}>{kb.name}</span>
        <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="#4573D2" strokeWidth="1.4" strokeLinecap="round"><path d="M4 2H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V6M7 1h2v2M4.5 5.5l4.5-4.5" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ display: 'flex', gap: 40 }}>
        {[
          { label: 'Articles', value: `${kb.articles}` },
          { label: 'AI deflection', value: kb.aiDeflection ? 'Enabled' : 'Disabled', color: kb.aiDeflection ? 'var(--success-text)' : 'var(--text-disabled)' },
          { label: 'Last updated', value: kb.lastUpdated },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)', marginBottom: 4 }}>{label}</div>
            <div style={{ ...BASE, fontSize: 14, fontWeight: 500, color: color ?? 'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function PlaybookCard({ p, on, onToggle }) {
  const src = AVATARS[p.avatar % AVATARS.length];
  return (
    <div style={{ background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={src} width="48" height="48" alt="" style={{ borderRadius: '50%', flexShrink: 0 }} />
        <span style={{ flex: 1, ...BASE, fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.2px' }}>{p.title}</span>
        <Toggle value={on} onChange={onToggle} />
      </div>
      <p style={{ ...BASE, fontSize: 14, color: 'var(--text-weak)', lineHeight: '22px', margin: 0, letterSpacing: '-0.15px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 14, ...BASE, fontSize: 12, color: 'var(--text-weak)', display: 'inline-flex', alignItems: 'center' }}>{p.domain}</span>
        <span style={{ height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 14, ...BASE, fontSize: 12, color: 'var(--text-weak)', display: 'inline-flex', alignItems: 'center' }}>{p.subtitle}</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {p.integrations.map(i => <img key={i} src={INT[i]} width="16" height="16" alt={i} style={{ display: 'block' }} />)}
        </div>
      </div>
    </div>
  );
}

function PlaybooksSection({ queueId }) {
  const playbooks = ALL_PLAYBOOKS[queueId] ?? [];
  const [enabled, setEnabled] = useState(
    Object.fromEntries(playbooks.map(p => [p.id, p.enabled]))
  );
  const [exploring, setExploring] = useState(false);

  const activePlaybooks = playbooks.filter(p => enabled[p.id]);

  function toggle(id) {
    setEnabled(e => ({ ...e, [id]: !e[id] }));
  }

  return (
    <Section title="Playbooks">
      {/* Compact enabled list */}
      {activePlaybooks.length > 0 ? (
        <div style={{ marginBottom: 16 }}>
          {activePlaybooks.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < activePlaybooks.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <img src={AVATARS[p.avatar % AVATARS.length]} width="26" height="26" alt="" style={{ borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ flex: 1, ...BASE, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{p.title}</span>
              <span style={{ ...BASE, fontSize: 11, color: 'var(--text-disabled)', marginRight: 6 }}>{p.subtitle}</span>
              <Toggle value={true} onChange={() => toggle(p.id)} />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ ...BASE, fontSize: 13, color: 'var(--text-disabled)', marginBottom: 16 }}>No playbooks enabled.</p>
      )}

      {/* Explore & add trigger */}
      <button
        type="button"
        onClick={() => setExploring(v => !v)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 6, background: exploring ? 'var(--background-medium)' : 'transparent', ...BASE, fontSize: 13, color: 'var(--text-weak)', cursor: 'pointer', transition: 'background 0.12s' }}
        onMouseEnter={e => { if (!exploring) e.currentTarget.style.background = 'var(--background-weak)'; }}
        onMouseLeave={e => { if (!exploring) e.currentTarget.style.background = 'transparent'; }}
      >
        {exploring ? (
          <>
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 6h8"/></svg>
            Collapse
          </>
        ) : (
          <>
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 2v8M2 6h8"/></svg>
            Explore & add playbooks
          </>
        )}
      </button>

      {/* Full card grid — all playbooks */}
      {exploring && (
        <div style={{ marginTop: 24 }}>
          {[...new Set(playbooks.map(p => p.section))].map((sec, si, arr) => (
            <div key={sec} style={{ marginBottom: si < arr.length - 1 ? 32 : 0 }}>
              <div style={{ ...BASE, fontSize: 12, fontWeight: 600, color: 'var(--text-disabled)', letterSpacing: '0.04em', marginBottom: 12 }}>{sec.toUpperCase()}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {playbooks.filter(p => p.section === sec).map(p => (
                  <PlaybookCard key={p.id} p={p} on={!!enabled[p.id]} onToggle={() => toggle(p.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function DangerZone({ q }) {
  return (
    <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
      <span style={{ ...BASE, fontSize: 14, fontWeight: 600, color: 'var(--danger-text)' }}>Danger zone</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <div>
          <div style={{ ...BASE, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Archive queue</div>
          {q.isDefault && <div style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)', marginTop: 2 }}>Cannot archive the default queue. Change the default first.</div>}
        </div>
        <button type="button" disabled={q.isDefault}
          style={{ height: 32, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 6, ...BASE, fontSize: 13, color: q.isDefault ? 'var(--text-disabled)' : 'var(--danger-text)', background: 'transparent', cursor: q.isDefault ? 'default' : 'pointer', opacity: q.isDefault ? 0.5 : 1 }}>
          Archive
        </button>
      </div>
    </div>
  );
}

// ── Queue detail view ─────────────────────────────────────────────────────────

function QueueDetail({ q }) {
  const navigate = useNavigate();
  const shown    = q.members.slice(0, 4);
  const rest     = q.members.length - shown.length;

  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--background-weak)' }}>
      {/* Page header */}
      <div style={{ padding: '24px 64px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
          <button type="button" onClick={() => navigate('/settings')}
            style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}>
            ← Settings
          </button>
          <span style={{ ...BASE, fontSize: 12, color: 'var(--text-disabled)' }}>/</span>
          <span style={{ ...BASE, fontSize: 12, color: 'var(--text-disabled)' }}>Queue Management</span>
          <span style={{ ...BASE, fontSize: 12, color: 'var(--text-disabled)' }}>/</span>
          <span style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)' }}>{q.name}</span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: q.color, flexShrink: 0 }} />
              <h1 style={{ fontFamily: SFD, fontSize: 22, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: '28px', fontFeatureSettings: "'liga' off, 'clig' off" }}>{q.name}</h1>
              <span style={{ ...BASE, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--text-weak)', background: 'var(--background-weak)' }}>
                {q.isDefault ? 'Default' : 'Private'}
              </span>
            </div>
            <p style={{ ...BASE, fontSize: 13, color: 'var(--text-weak)', margin: '0 0 6px', lineHeight: '18px' }}>{q.desc}</p>
            <p style={{ ...BASE, fontSize: 11, color: 'var(--text-disabled)', margin: 0 }}>
              Created by {q.createdBy} on {q.createdAt}
            </p>
          </div>
          {/* Member avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {shown.map((m, i) => (
                <Avi key={m.name} name={m.name} bg={m.bg} size={26} border style={{ marginLeft: i === 0 ? 0 : -8, zIndex: shown.length - i, position: 'relative' }} />
              ))}
              {rest > 0 && (
                <div style={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid var(--surface)', background: 'var(--background-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8, fontSize: 9, fontWeight: 700, color: 'var(--text-weak)', fontFamily: SFT, boxSizing: 'border-box', zIndex: 0, position: 'relative' }}>
                  +{rest}
                </div>
              )}
            </div>
            <span style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)' }}>{q.members.length} members</span>
          </div>
        </div>
      </div>

      {/* Default queue banner */}
      {q.isDefault && (
        <div style={{ padding: '10px 64px', background: '#EEF4FF', borderBottom: '1px solid #C7D9FF', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <svg viewBox="0 0 14 14" width="13" height="13" fill="none" style={{ color: '#4573D2', flexShrink: 0, marginTop: 2 }}>
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M7 6v4M7 4v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ ...BASE, fontSize: 13, color: '#4573D2', lineHeight: '18px' }}>
            This is the default queue. Unrouted tickets are automatically sent here. To change the default queue, go to Settings.
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '40px 64px 80px' }}>
        <MembersSection q={q} />
        <ChannelsSection q={q} />
        <SlaSection q={q} />
        <KbSection q={q} />
        <PlaybooksSection queueId={q.id} />
        <DangerZone q={q} />
      </div>
    </div>
  );
}

// ── Admin landing page ─────────────────────────────────────────────────────────
export function SettingsLandingPage() {
  const navigate    = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [queues, setQueues] = useState(() => [...QUEUES_LIST, ...session.createdQueues]);

  function handleCreated(form) {
    const initials = form.name.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('').slice(0, 2);
    const newQueue = {
      id: `q_${Date.now()}`,
      name: form.name.trim(),
      initials,
      color: form.color,
      isDefault: false,
      desc: form.desc || '',
      createdBy: 'You',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      email: form.email || '—',
      slack: form.slack || '—',
      dayRange: form.dayRange,
      startTime: form.startTime,
      endTime: form.endTime,
      members: form.members ?? [],
      sla: { firstResponse: form.slaFirst, update: form.slaUpdate, resolution: form.slaResolution, autoEscalate: true, usingDefaults: false },
      kb: { name: '', articles: 0, aiDeflection: false, lastUpdated: '—' },
      aiEnabled: true,
      integrationsConnected: 0,
      automationsActive: Object.values(form.playbooks).filter(Boolean).length,
    };
    session.createdQueues.push(newQueue);
    setQueues(prev => [...prev, newQueue]);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background-weak)' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '28px 32px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: SFD, fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', margin: 0 }}>
            Admin
          </h1>
          <p style={{ ...BASE, fontSize: 13, color: 'var(--text-weak)', margin: '2px 0 0' }}>Manage queues, channels, and team settings</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: 'none', borderRadius: 7, background: 'var(--selected-background-strong)', ...BASE, fontSize: 13, fontWeight: 500, color: 'var(--selected-text-strong)', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
          Create queue
        </button>
      </div>

      {/* Table header */}
      <div style={{ position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 32px', height: 36, background: 'var(--surface)' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 1, background: 'var(--border)' }} />
        <span style={{ ...typoMeta, flex: 1, minWidth: 220, fontWeight: 500 }}>Queue</span>
        <span style={{ ...typoMeta, width: 140, flexShrink: 0, fontWeight: 500 }}>Email</span>
        <span style={{ ...typoMeta, width: 180, flexShrink: 0, fontWeight: 500 }}>Business hours</span>
        <span style={{ ...typoMeta, width: 80,  flexShrink: 0, fontWeight: 500 }}>AI</span>
        <span style={{ ...typoMeta, width: 120, flexShrink: 0, fontWeight: 500 }}>Integrations</span>
        <span style={{ ...typoMeta, width: 110, flexShrink: 0, fontWeight: 500 }}>Playbooks</span>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface)' }}>
        {queues.map(q => (
          <div
            key={q.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/settings/${q.id}`)}
            onKeyDown={e => e.key === 'Enter' && navigate(`/settings/${q.id}`)}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 32px', height: 64, cursor: 'pointer', transition: 'background 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-weak)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}
          >
            <div style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 1, background: 'var(--border)', pointerEvents: 'none' }} />
            {/* Queue */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: SFT, fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.2px' }}>{q.initials}</span>
              </div>
              <div>
                <div style={{ ...typoCell }}>{q.name}</div>
                <div style={{ ...typoMeta, marginTop: 1 }}>
                  {q.members.length} members
                  {q.isDefault && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 500, padding: '1px 5px', borderRadius: 3, background: 'var(--background-medium)', color: 'var(--text-weak)' }}>Default</span>}
                </div>
              </div>
            </div>
            {/* Email */}
            <div style={{ width: 140, flexShrink: 0 }}>
              <span style={{ ...typoCell }}>{q.email}</span>
            </div>
            {/* Business hours */}
            <div style={{ width: 180, flexShrink: 0 }}>
              <span style={{ ...typoCell }}>{q.dayRange}, {q.startTime}–{q.endTime}</span>
            </div>
            {/* AI */}
            <div style={{ width: 80, flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 4, background: q.aiEnabled ? 'var(--success-background)' : 'var(--background-medium)', fontSize: 11, fontWeight: 500, color: q.aiEnabled ? 'var(--success-text)' : 'var(--text-weak)', fontFamily: SFT }}>
                {q.aiEnabled ? 'On' : 'Off'}
              </span>
            </div>
            {/* Integrations */}
            <div style={{ width: 120, flexShrink: 0 }}>
              <span style={{ ...typoCell }}>{q.integrationsConnected} connected</span>
            </div>
            {/* Playbooks */}
            <div style={{ width: 110, flexShrink: 0 }}>
              <span style={{ ...typoCell }}>{q.automationsActive} active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create queue panel */}
      {createOpen && <CreateQueuePanel onClose={() => setCreateOpen(false)} onCreated={handleCreated} />}
    </div>
  );
}

// ── SettingsView (default export) ─────────────────────────────────────────────
export default function SettingsView({ queueId = 'it' }) {
  const q = QUEUE_CONFIGS[queueId] ?? QUEUE_CONFIGS.it;
  return <QueueDetail q={q} />;
}
