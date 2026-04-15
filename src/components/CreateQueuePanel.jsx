// ─── CreateQueuePanel — 4-step wizard, full-screen overlay ───────────────────

import { useState } from 'react';
import { SFT, SFD, LIGA } from '../constants/typography';
import { DetailModal } from './PlaybookGallery';

const B = import.meta.env.BASE_URL;
const AVATARS = [
  `${B}avatars/Teammate.svg`,
  `${B}avatars/Teammate1.svg`,
  `${B}avatars/Teammate-1.svg`,
  `${B}avatars/Teammate-2.svg`,
  `${B}avatars/Teammate-3.svg`,
  `${B}avatars/Teammate-4.svg`,
];

const BASE = { fontFamily: SFT, ...LIGA };

const COLORS = [
  '#E8534A', '#F1BD6C', '#4ECBC4', '#1E1F21',
  '#8D84E8', '#4573D2', '#B3DF97', '#F4A5B0',
  '#C4AADF', '#E56020', '#2F8A80', '#84C9E5',
];

const COLOR_NAMES = {
  '#E8534A': 'Red', '#F1BD6C': 'Yellow', '#4ECBC4': 'Teal', '#1E1F21': 'Black',
  '#8D84E8': 'Purple', '#4573D2': 'Blue', '#B3DF97': 'Lime', '#F4A5B0': 'Pink',
  '#C4AADF': 'Lavender', '#E56020': 'Orange', '#2F8A80': 'Dark teal', '#84C9E5': 'Sky',
};

const DAY_OPTIONS   = ['Mon–Fri', 'Mon–Sat', 'Every day'];
const TIME_OPTIONS  = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                       '1:00 PM',  '2:00 PM',  '3:00 PM',  '4:00 PM',  '5:00 PM',
                       '6:00 PM',  '7:00 PM',  '8:00 PM'];
const SLA_OPTIONS   = ['15 min', '30 min', '1h', '2h', '4h', '8h', '12h', '24h', '48h', '5 days'];

const WORKSPACE_MEMBERS = [
  { name: 'Jordan Ellis',  bg: '#F1BD6C' },
  { name: 'Marcus Rivera', bg: '#4ECBC4' },
  { name: 'Ajeet Cyrus',   bg: '#4573D2' },
  { name: 'Zoe Wong',      bg: '#5DA283' },
  { name: 'Riya Desai',    bg: '#B3DF97' },
  { name: 'David Park',    bg: '#8D84E8' },
  { name: 'Lisa Nakamura', bg: '#4ECBC4' },
  { name: 'Rachel Kim',    bg: '#F06A6A' },
];

const PLAYBOOK_TEMPLATES = [
  {
    id: 'pb1', section: 'Queue', avatar: 0, domain: 'IT', title: 'Auto-assign by Category',
    subtitle: 'Auto-routing', defaultOn: true, integrations: ['globe', 'word'], uses: '12 teams',
    desc: 'Routes incoming tickets to the right agent based on category tags and workload.',
    description: 'Routes incoming tickets to the right agent based on category tags and current workload balance. Eliminates manual triage and ensures even distribution across your team.',
    capabilities: ['Parse ticket category tags on creation', 'Match category to agent skill profile', 'Check agent current workload before assigning', 'Reassign if agent is over capacity'],
    steps: [{ type: 'trigger', label: 'Ticket created' }, { type: 'condition', label: 'Has category tag?' }, { type: 'ai', label: 'Match to agent by skill' }, { type: 'task', label: 'Assign ticket' }, { type: 'notify', label: 'Notify agent via email' }],
  },
  {
    id: 'pb2', section: 'Queue', avatar: 1, domain: 'IT', title: 'SLA Breach Auto-escalation',
    subtitle: 'SLA management', defaultOn: true, integrations: ['globe', 'word'], uses: '8 teams',
    desc: 'Automatically escalates tickets approaching or past their SLA deadline.',
    description: 'Monitors ticket age against SLA targets and automatically escalates to a senior agent or manager when a breach is imminent or has occurred.',
    capabilities: ['Monitor ticket age continuously', 'Warn agent at 75% SLA threshold', 'Escalate at 100% breach', 'Notify queue admin on repeated breaches'],
    steps: [{ type: 'trigger', label: 'SLA threshold reached' }, { type: 'condition', label: 'Priority level?' }, { type: 'notify', label: 'Warn assigned agent' }, { type: 'task', label: 'Escalate to senior agent' }, { type: 'notify', label: 'Notify queue admin' }],
  },
  {
    id: 'pb3', section: 'Queue', avatar: 2, domain: 'IT', title: 'Duplicate Ticket Detection & Merge',
    subtitle: 'Queue management', defaultOn: false, integrations: ['globe'], uses: '5 teams',
    desc: 'Detects similar open tickets and merges them to prevent duplicate work.',
    description: 'Uses AI to compare new tickets against open tickets and detect semantic duplicates. Merges duplicates automatically and notifies the requester.',
    capabilities: ['Embed ticket text for semantic comparison', 'Detect duplicates above similarity threshold', 'Merge duplicate into parent ticket', 'Notify requester of merge'],
    steps: [{ type: 'trigger', label: 'Ticket created' }, { type: 'ai', label: 'Scan for duplicates' }, { type: 'condition', label: 'Duplicate found?' }, { type: 'task', label: 'Merge tickets' }, { type: 'notify', label: 'Notify requester' }],
  },
  {
    id: 'pb4', section: 'Queue', avatar: 3, domain: 'IT', title: 'Auto-close Inactive Resolved Tickets',
    subtitle: 'Queue management', defaultOn: false, integrations: ['globe'], uses: '9 teams',
    desc: 'Closes tickets that have been resolved but inactive for 7+ days.',
    description: 'Keeps your queue clean by automatically closing tickets that were resolved but never officially closed by the requester after a configurable inactivity window.',
    capabilities: ['Detect resolved tickets with no recent activity', 'Send closure warning to requester', 'Auto-close after inactivity window', 'Log closure reason in ticket history'],
    steps: [{ type: 'trigger', label: 'Daily schedule' }, { type: 'condition', label: 'Resolved & inactive 7+ days?' }, { type: 'notify', label: 'Send 48h warning to requester' }, { type: 'task', label: 'Auto-close ticket' }],
  },
  {
    id: 'pb5', section: 'Cross-team', avatar: 4, domain: 'Cross-team', title: 'New Hire Cross-team Onboarding',
    subtitle: 'Onboarding', defaultOn: true, integrations: ['globe', 'word', 'drive'], uses: '6 teams',
    desc: 'Coordinates with HR and Facilities when a new hire ticket is opened.',
    description: 'When an IT onboarding ticket is created, this playbook automatically coordinates equipment provisioning, software access, and workspace setup across HR, IT, and Facilities.',
    capabilities: ['Detect new hire ticket from subject/tag', 'Create subtasks for IT, HR, and Facilities', 'Provision software access list', 'Track completion across teams'],
    steps: [{ type: 'trigger', label: 'New hire ticket created' }, { type: 'ai', label: 'Extract start date and role' }, { type: 'task', label: 'Create IT provisioning task' }, { type: 'task', label: 'Create Facilities workspace task' }, { type: 'notify', label: 'Notify HR coordinator' }],
  },
  {
    id: 'pb6', section: 'Cross-team', avatar: 5, domain: 'Cross-team', title: 'CSAT Survey on Ticket Close',
    subtitle: 'Feedback', defaultOn: false, integrations: ['globe', 'drive'], uses: '11 teams',
    desc: 'Sends a satisfaction survey to the requester when their ticket is closed.',
    description: 'Automatically sends a short CSAT survey to the ticket requester 30 minutes after their ticket is closed. Responses are logged and surfaced in the Optimize dashboard.',
    capabilities: ['Trigger survey 30 min after ticket close', 'Send personalized survey link via email', 'Log CSAT score to ticket record', 'Surface low scores for agent review'],
    steps: [{ type: 'trigger', label: 'Ticket closed' }, { type: 'wait', label: 'Wait 30 minutes' }, { type: 'notify', label: 'Send CSAT survey email' }, { type: 'condition', label: 'Response received?' }, { type: 'task', label: 'Log score to ticket' }],
  },
];

const INT = {
  globe: `${B}integrations/globe.svg`,
  word:  `${B}integrations/microsoft-word.svg`,
  drive: `${B}integrations/google-drive.svg`,
};

const STEPS = [
  { title: 'Queue details',  sub: 'Set up the name and visual identity for this queue.' },
  { title: 'Team',           sub: 'Add admins who manage this queue and editors who work tickets.' },
  { title: 'Configuration',  sub: 'Set up intake channels, business hours, and SLA targets.' },
  { title: 'Playbooks',      sub: 'Enable automations that run on tickets in this queue.' },
];

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
      style={{ position: 'relative', width: 36, height: 20, borderRadius: 10, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, background: value ? 'var(--selected-background-strong)' : 'var(--background-strong)', transition: 'background 0.15s' }}>
      <span style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: 8, background: 'var(--surface)', transition: 'left 0.15s', left: value ? 18 : 2 }} />
    </button>
  );
}

// ── Avi ───────────────────────────────────────────────────────────────────────
function Avi({ name, bg, size = 28 }) {
  const ini = name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.37), fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: SFT }}>
      {ini}
    </div>
  );
}

// ── Form input / select primitives ────────────────────────────────────────────
const inputSt = { ...BASE, fontSize: 14, height: 38, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 7, outline: 'none', color: 'var(--text)', background: 'var(--surface)', boxSizing: 'border-box', width: '100%' };
const labelSt = { ...BASE, fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 6 };
const hintSt  = { ...BASE, fontSize: 12, color: 'var(--text-weak)', marginTop: 5 };

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={labelSt}>{label}{required && <span style={{ color: 'var(--danger-text)', marginLeft: 4, fontSize: 12 }}>Required</span>}</label>
      {children}
      {hint && <p style={hintSt}>{hint}</p>}
    </div>
  );
}

// ── Step header ───────────────────────────────────────────────────────────────
function StepHeader({ step }) {
  const s = STEPS[step - 1];
  return (
    <div style={{ marginBottom: 36 }}>
      <h1 style={{ fontFamily: SFD, fontSize: 32, fontWeight: 400, color: 'var(--text)', margin: '0 0 6px', lineHeight: '40px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off" }}>
        {s.title}
      </h1>
      <p style={{ ...BASE, fontSize: 16, color: 'var(--text-weak)', margin: 0, lineHeight: '24px', letterSpacing: '-0.32px' }}>
        {s.sub}
      </p>
    </div>
  );
}

// ── Step 1: Details ───────────────────────────────────────────────────────────
function Step1({ form, setForm }) {
  return (
    <>
      <StepHeader step={1} />
      <Field label="Queue name" required hint="All agents will see this name when routing tickets to this queue.">
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Infrastructure ops"
          style={inputSt}
          autoFocus
        />
      </Field>
      <Field label="Description" hint="Shown to employees on the request portal.">
        <textarea
          value={form.desc}
          onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
          placeholder="What type of work is routed to this queue?"
          rows={3}
          style={{ ...inputSt, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: '20px' }}
        />
      </Field>
      <Field label="Color">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setForm(f => ({ ...f, color: c }))}
              style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid var(--text)' : '3px solid transparent', cursor: 'pointer', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.1s', padding: 0 }}
            />
          ))}
        </div>
        {/* Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: form.color, flexShrink: 0 }} />
          <span style={{ ...BASE, fontSize: 13, color: 'var(--text-weak)' }}>
            {form.name || 'Queue name'} — {COLOR_NAMES[form.color] ?? 'Custom'}
          </span>
        </div>
      </Field>
    </>
  );
}

// ── Reusable member search + list sub-section ─────────────────────────────────
function MemberPicker({ title, hint, members, allAdded, onAdd, onRemove, autoFocus }) {
  const [search, setSearch] = useState('');

  const suggestions = WORKSPACE_MEMBERS.filter(m =>
    !allAdded.has(m.name) &&
    (!search || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  function handleAdd(m) {
    onAdd(m);
    setSearch('');
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <label style={{ ...{ fontFamily: SFT, fontSize: 13, fontWeight: 500, color: 'var(--text)', display: 'block', marginBottom: 4 } }}>{title}</label>
      {hint && <p style={{ fontFamily: SFT, fontSize: 12, color: 'var(--text-weak)', margin: '0 0 8px' }}>{hint}</p>}
      <div style={{ position: 'relative' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          style={inputSt}
          autoFocus={autoFocus}
        />
        {search && suggestions.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, border: '1px solid var(--border)', borderRadius: 7, marginTop: 4, background: 'var(--surface)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {suggestions.slice(0, 5).map(m => (
              <button
                key={m.name}
                type="button"
                onClick={() => handleAdd(m)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: SFT, fontSize: 13, color: 'var(--text)', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--background-weak)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Avi name={m.name} bg={m.bg} size={26} />
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>
      {members.length > 0 ? (
        <div style={{ marginTop: 6 }}>
          {members.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <Avi name={m.name} bg={m.bg} size={28} />
              <span style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text)', flex: 1 }}>{m.name}</span>
              <button
                type="button"
                onClick={() => onRemove(m.name)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', padding: '2px 4px', fontSize: 16, lineHeight: 1, borderRadius: 4 }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; e.currentTarget.style.background = 'none'; }}
              >×</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontFamily: SFT, fontSize: 13, color: 'var(--text-disabled)', margin: '8px 0 0' }}>None added yet.</p>
      )}
    </div>
  );
}

// ── Step 2: Team ──────────────────────────────────────────────────────────────
function Step2({ form, setForm }) {
  const allAdded = new Set([...form.admins.map(m => m.name), ...form.members.map(m => m.name)]);

  return (
    <>
      <StepHeader step={2} />
      <MemberPicker
        title="Queue admins"
        hint="Admins can edit queue settings, manage members, and configure playbooks."
        members={form.admins}
        allAdded={allAdded}
        onAdd={m => setForm(f => ({ ...f, admins: [...f.admins, m] }))}
        onRemove={name => setForm(f => ({ ...f, admins: f.admins.filter(m => m.name !== name) }))}
        autoFocus
      />
      <MemberPicker
        title="Editors"
        hint="Editors can view and work tickets in this queue but cannot change queue settings."
        members={form.members}
        allAdded={allAdded}
        onAdd={m => setForm(f => ({ ...f, members: [...f.members, m] }))}
        onRemove={name => setForm(f => ({ ...f, members: f.members.filter(m => m.name !== name) }))}
      />
    </>
  );
}

// ── Config section accordion ──────────────────────────────────────────────────
function ConfigSection({ icon, title, count, description, footer, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 0 16px', textAlign: 'left' }}
      >
        {icon}
        <span style={{ ...BASE, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        {count !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 500, padding: '1px 8px', borderRadius: 100, background: 'var(--background-medium)', color: 'var(--text-weak)', flexShrink: 0 }}>{count}</span>
        )}
        <div style={{ flex: 1 }} />
        <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"
          style={{ flexShrink: 0, color: 'var(--text-disabled)', transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          <path d="M9.09 3.93L6 6.52 2.91 3.93a.75.75 0 10-.97 1.15l3.57 3a.75.75 0 00.97 0l3.57-3a.75.75 0 10-.97-1.15z"/>
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: 24 }}>
          {description && <p style={{ ...BASE, fontSize: 13, color: 'var(--text-weak)', margin: '0 0 16px', lineHeight: '20px' }}>{description}</p>}
          {children}
          {footer && <p style={{ ...BASE, fontSize: 12, color: 'var(--text-disabled)', margin: '12px 0 0', lineHeight: '18px' }}>{footer}</p>}
        </div>
      )}
    </div>
  );
}

const KB_OPTIONS = [
  'IT Knowledge Base', 'HR Policies', 'Security Runbooks', 'Onboarding Guides', 'Product Docs',
];

const CHANNEL_TYPE_LABELS = { email: 'Email', slack: 'Slack', form: 'Form', web: 'Web form' };

// ── Step 3: Configuration ─────────────────────────────────────────────────────
function Step3({ form, setForm }) {
  const [addingChannel, setAddingChannel] = useState(false);
  const [channelType, setChannelType] = useState('email');
  const [channelValue, setChannelValue] = useState('');
  const [kbSearch, setKbSearch] = useState('');
  const [kbOpen, setKbOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const channelCount = 1 + (form.channels?.length ?? 0); // 1 = AI Portal always
  const kbCount = (form.kbSources?.length ?? 0);

  function addChannel() {
    if (!channelValue.trim()) return;
    setForm(f => ({ ...f, channels: [...(f.channels ?? []), { type: channelType, value: channelValue.trim() }] }));
    setChannelValue('');
    setAddingChannel(false);
  }

  function removeChannel(i) {
    setForm(f => ({ ...f, channels: f.channels.filter((_, idx) => idx !== i) }));
  }

  function addKb(name) {
    if ((form.kbSources ?? []).some(s => s.value === name)) return;
    setForm(f => ({ ...f, kbSources: [...(f.kbSources ?? []), { type: 'kb', value: name }] }));
    setKbSearch(''); setKbOpen(false);
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    setForm(f => ({ ...f, kbSources: [...(f.kbSources ?? []), { type: 'url', value: url }] }));
    setUrlInput('');
  }

  function removeKbSource(i) {
    setForm(f => ({ ...f, kbSources: f.kbSources.filter((_, idx) => idx !== i) }));
  }

  const filteredKbs = KB_OPTIONS.filter(k =>
    !kbSearch || k.toLowerCase().includes(kbSearch.toLowerCase())
  ).filter(k => !(form.kbSources ?? []).some(s => s.value === k));

  return (
    <>
      <StepHeader step={3} />

      {/* ── Intake channels ── */}
      <ConfigSection
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, color: 'var(--success-text)' }}>
            <path d="M8 2C5.24 2 3 4.24 3 7c0 1.5.63 2.86 1.64 3.83L3 14h4.5c.16.01.33.01.5.01 2.76 0 5-2.24 5-5S10.76 2 8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M6 7.5l1.5 1.5L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        title="Intake channels"
        count={channelCount}
        description="Configure how tickets enter this queue"
        footer="The AI portal automatically routes tickets based on queue name and description."
      >
        {/* AI Portal — always connected */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', marginBottom: 8 }}>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, color: 'var(--success-text)' }}>
            <path d="M8 2C5.24 2 3 4.24 3 7c0 1.5.63 2.86 1.64 3.83L3 14h4.5c.16.01.33.01.5.01 2.76 0 5-2.24 5-5S10.76 2 8 2z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
            <path d="M6 7.5l1.5 1.5L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...BASE, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI Portal</div>
            <div style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)', marginTop: 1 }}>Auto-routes from shared portal</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--success-text)', padding: '3px 10px', borderRadius: 6, background: 'var(--success-background)', border: '1px solid var(--success-background-strong)', flexShrink: 0 }}>Connected</span>
        </div>

        {/* Added channels */}
        {(form.channels ?? []).map((ch, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', marginBottom: 8 }}>
            <span style={{ ...BASE, fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: 'var(--background-medium)', color: 'var(--text-weak)', flexShrink: 0 }}>{CHANNEL_TYPE_LABELS[ch.type]}</span>
            <span style={{ ...BASE, fontSize: 13, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.value}</span>
            <button type="button" onClick={() => removeChannel(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', padding: '2px 4px', fontSize: 16, lineHeight: 1, borderRadius: 4 }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; e.currentTarget.style.background = 'none'; }}
            >×</button>
          </div>
        ))}

        {/* Add channel row */}
        {addingChannel ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 16px', border: '1px dashed var(--border)', borderRadius: 8, background: 'var(--background-weak)', marginBottom: 8 }}>
            <select value={channelType} onChange={e => setChannelType(e.target.value)}
              style={{ ...inputSt, width: 100, height: 32, padding: '0 8px', flexShrink: 0, appearance: 'auto' }}>
              <option value="email">Email</option>
              <option value="slack">Slack</option>
              <option value="form">Form</option>
              <option value="web">Web form</option>
            </select>
            <input
              value={channelValue}
              onChange={e => setChannelValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addChannel(); if (e.key === 'Escape') setAddingChannel(false); }}
              placeholder={channelType === 'email' ? 'e.g. it-help@acme.com' : channelType === 'slack' ? '#channel-name' : 'https://...'}
              autoFocus
              style={{ ...inputSt, height: 32, flex: 1 }}
            />
            <button type="button" onClick={addChannel}
              style={{ height: 32, padding: '0 14px', border: 'none', borderRadius: 6, background: 'var(--selected-background-strong)', color: '#fff', ...BASE, fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}>
              Add
            </button>
            <button type="button" onClick={() => { setAddingChannel(false); setChannelValue(''); }}
              style={{ height: 32, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'none', ...BASE, fontSize: 13, color: 'var(--text-weak)', cursor: 'pointer', flexShrink: 0 }}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingChannel(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 16px', border: '1px dashed var(--border)', borderRadius: 8, background: 'none', cursor: 'pointer', ...BASE, fontSize: 13, color: 'var(--text-weak)', marginBottom: 8 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-weak)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-weak)'; }}
          >
            <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2v8M2 6h8"/></svg>
            Add Slack, Email, or Form
          </button>
        )}
      </ConfigSection>

      {/* ── Knowledge Base ── */}
      <ConfigSection
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, color: 'var(--text-disabled)' }}>
            <path d="M3 3h6l4 4v6H3V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M9 3v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M5 9h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        }
        title="Knowledge base"
        count={kbCount}
        description="Link knowledge bases for AI deflection in this queue"
        defaultOpen={false}
      >
        {/* Added KB sources */}
        {(form.kbSources ?? []).map((src, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', marginBottom: 8 }}>
            {src.type === 'url' ? (
              <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="var(--text-disabled)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M2 7h10M7 2l5 5-5 5"/>
              </svg>
            ) : (
              <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="var(--text-disabled)" strokeWidth="1.3" style={{ flexShrink: 0 }}>
                <path d="M2.5 2.5h5l3.5 3.5V12h-8.5V2.5z" strokeLinejoin="round"/>
                <path d="M7.5 2.5V6H11" strokeLinejoin="round"/>
              </svg>
            )}
            <span style={{ ...BASE, fontSize: 13, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.value}</span>
            {src.type === 'url' && <span style={{ ...BASE, fontSize: 11, color: 'var(--text-disabled)', flexShrink: 0 }}>URL</span>}
            <button type="button" onClick={() => removeKbSource(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', padding: '2px 4px', fontSize: 16, lineHeight: 1, borderRadius: 4 }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--background-medium)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; e.currentTarget.style.background = 'none'; }}
            >×</button>
          </div>
        ))}

        {/* Search KBs */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="var(--text-disabled)" strokeWidth="1.3" strokeLinecap="round" style={{ position: 'absolute', left: 12, flexShrink: 0 }}>
              <circle cx="6" cy="6" r="4"/><path d="M10 10l2.5 2.5"/>
            </svg>
            <input
              value={kbSearch}
              onChange={e => { setKbSearch(e.target.value); setKbOpen(true); }}
              onFocus={() => setKbOpen(true)}
              onBlur={() => setTimeout(() => setKbOpen(false), 150)}
              placeholder="Search knowledge bases..."
              style={{ ...inputSt, paddingLeft: 34 }}
            />
            <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" style={{ position: 'absolute', right: 12, color: 'var(--text-disabled)', pointerEvents: 'none' }}>
              <path d="M9.09 3.93L6 6.52 2.91 3.93a.75.75 0 10-.97 1.15l3.57 3a.75.75 0 00.97 0l3.57-3a.75.75 0 10-.97-1.15z"/>
            </svg>
          </div>
          {kbOpen && filteredKbs.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, border: '1px solid var(--border)', borderRadius: 7, marginTop: 4, background: 'var(--surface)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              {filteredKbs.map(kb => (
                <button key={kb} type="button" onClick={() => addKb(kb)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', ...BASE, fontSize: 13, color: 'var(--text)', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--background-weak)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >{kb}</button>
              ))}
            </div>
          )}
        </div>

        {/* Web URL input */}
        <div style={{ marginTop: 12 }}>
          <label style={{ ...labelSt, fontSize: 12, color: 'var(--text-weak)', marginBottom: 6 }}>Or add a web URL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addUrl(); }}
              placeholder="https://docs.example.com/it-guide"
              style={{ ...inputSt, flex: 1 }}
            />
            <button type="button" onClick={addUrl} disabled={!urlInput.trim()}
              style={{ height: 38, padding: '0 14px', border: 'none', borderRadius: 6, background: urlInput.trim() ? 'var(--selected-background-strong)' : 'var(--background-strong)', color: urlInput.trim() ? '#fff' : 'var(--text-disabled)', ...BASE, fontSize: 13, fontWeight: 500, cursor: urlInput.trim() ? 'pointer' : 'default', flexShrink: 0 }}>
              Add
            </button>
          </div>
        </div>
      </ConfigSection>

      {/* ── Business hours ── */}
      <ConfigSection
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, color: 'var(--text-disabled)' }}>
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        title="Business hours"
        description="Define when your team is available to handle tickets."
        defaultOpen={false}
      >
        <Field label="Active days">
          <select value={form.dayRange} onChange={e => setForm(f => ({ ...f, dayRange: e.target.value }))} style={{ ...inputSt, appearance: 'auto' }}>
            {DAY_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
          <div style={{ flex: 1 }}>
            <label style={labelSt}>Start time</label>
            <select value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} style={{ ...inputSt, appearance: 'auto' }}>
              {TIME_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelSt}>End time</label>
            <select value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} style={{ ...inputSt, appearance: 'auto' }}>
              {TIME_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </ConfigSection>

      {/* ── SLA targets ── */}
      <ConfigSection
        icon={
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0, color: 'var(--text-disabled)' }}>
            <path d="M2 12L6 8l3 3 5-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        title="SLA targets"
        description="Set response and resolution time expectations for this queue."
      >
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { key: 'slaFirst',      label: 'First response' },
            { key: 'slaUpdate',     label: 'Update'         },
            { key: 'slaResolution', label: 'Resolution'     },
          ].map(({ key, label }) => (
            <div key={key} style={{ flex: 1 }}>
              <label style={{ ...labelSt, fontSize: 12, color: 'var(--text-weak)', marginBottom: 4 }}>{label}</label>
              <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ ...inputSt, appearance: 'auto' }}>
                {SLA_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </ConfigSection>
    </>
  );
}

// ── Playbook card — exact AutomationsView WorkflowCard design ────────────────
function PlaybookCard({ p, on, onToggle, onPreview }) {
  const avatarSrc = AVATARS[p.avatar % AVATARS.length];
  return (
    <div
      onClick={onPreview}
      style={{ background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Header: avatar + title + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={avatarSrc} width="48" height="48" alt="" style={{ borderRadius: '50%', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.2px', fontFamily: SFT }}>
          {p.title}
        </span>
        <div onClick={e => { e.stopPropagation(); onToggle(); }}>
          <Toggle value={on} onChange={() => {}} />
        </div>
      </div>
      {/* Description */}
      <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-weak)', lineHeight: '22px', margin: 0, letterSpacing: '-0.15px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: SFT }}>
        {p.desc}
      </p>
      {/* Footer: domain pill + subtitle pill + integration icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 14, fontSize: 12, color: 'var(--text-weak)', display: 'inline-flex', alignItems: 'center', flexShrink: 0, fontFamily: SFT }}>{p.domain}</span>
        <span style={{ height: 28, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 14, fontSize: 12, color: 'var(--text-weak)', display: 'inline-flex', alignItems: 'center', flexShrink: 0, fontFamily: SFT }}>{p.subtitle}</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {p.integrations.map(i => (
            <img key={i} src={INT[i]} width="16" height="16" alt={i} style={{ display: 'block', flexShrink: 0 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Playbooks ─────────────────────────────────────────────────────────
function Step4({ form, setForm }) {
  const sections = [...new Set(PLAYBOOK_TEMPLATES.map(p => p.section))];
  const [preview, setPreview] = useState(null);

  function toggle(id) {
    setForm(f => ({ ...f, playbooks: { ...f.playbooks, [id]: !f.playbooks[id] } }));
  }

  return (
    <>
      <StepHeader step={4} />
      {sections.map(sec => (
        <div key={sec} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: SFT }}>{sec}</span>
            <span style={{ fontSize: 13, color: 'var(--text-disabled)', fontFamily: SFT }}>{PLAYBOOK_TEMPLATES.filter(p => p.section === sec).length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PLAYBOOK_TEMPLATES.filter(p => p.section === sec).map(p => (
              <PlaybookCard key={p.id} p={p} on={!!form.playbooks[p.id]} onToggle={() => toggle(p.id)} onPreview={() => setPreview(p)} />
            ))}
          </div>
        </div>
      ))}
      {preview && <DetailModal template={preview} onClose={() => setPreview(null)} />}
    </>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function CreateQueuePanel({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', desc: '', color: '#4573D2',
    admins: [], members: [],
    channels: [], kbSources: [],
    dayRange: 'Mon–Fri', startTime: '9:00 AM', endTime: '6:00 PM',
    slaFirst: '4h', slaUpdate: '8h', slaResolution: '24h',
    playbooks: Object.fromEntries(PLAYBOOK_TEMPLATES.map(p => [p.id, p.defaultOn])),
  });

  const canContinue = step === 1 ? form.name.trim().length > 0 : true;

  function handleCreate() {
    onCreated?.(form);
    onClose?.();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontFamily: SFD, fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFeatureSettings: "'liga' off, 'clig' off" }}>Create new queue</div>
          <div style={{ ...BASE, fontSize: 12, color: 'var(--text-weak)', marginTop: 1 }}>Define a routing container for tickets</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ height: 32, padding: '0 14px', border: '1px solid var(--border-strong)', borderRadius: 7, background: 'var(--surface)', ...BASE, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--background-weak)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
        >
          Cancel
        </button>
      </div>

      {/* Progress bar — 4 segments */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 3, padding: '0 32px', height: 4, background: 'var(--surface)' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, borderRadius: 2, background: s <= step ? 'var(--selected-background-strong)' : 'var(--background-strong)', transition: 'background 0.2s' }} />
        ))}
      </div>

      {/* Scrollable body — page-like, no inner scrollbar */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '48px 64px 0', maxWidth: step === 4 ? 'none' : 560 }}>
          {step === 1 && <Step1 form={form} setForm={setForm} />}
          {step === 2 && <Step2 form={form} setForm={setForm} />}
          {step === 3 && <Step3 form={form} setForm={setForm} />}
          {step === 4 && <Step4 form={form} setForm={setForm} />}

          {/* Inline actions — scroll with content */}
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 64 }}>
            {step < STEPS.length ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={!canContinue}
                style={{ height: 36, padding: '0 20px', border: 'none', borderRadius: 7, background: canContinue ? 'var(--selected-background-strong)' : 'var(--background-strong)', ...BASE, fontSize: 13, fontWeight: 500, color: canContinue ? 'var(--selected-text-strong)' : 'var(--text-disabled)', cursor: canContinue ? 'pointer' : 'default', transition: 'background 0.12s' }}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreate}
                style={{ height: 36, padding: '0 20px', border: 'none', borderRadius: 7, background: 'var(--selected-background-strong)', ...BASE, fontSize: 13, fontWeight: 500, color: 'var(--selected-text-strong)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Create queue
              </button>
            )}
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                style={{ height: 36, padding: '0 4px', border: 'none', borderRadius: 7, background: 'transparent', ...BASE, fontSize: 14, fontWeight: 400, color: 'var(--text-disabled)', cursor: 'pointer' }}
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
