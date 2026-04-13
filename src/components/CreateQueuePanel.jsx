// ─── CreateQueuePanel — 4-step wizard, full-screen overlay ───────────────────

import { useState } from 'react';
import { SFT, SFD, LIGA } from '../constants/typography';

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
  { id: 'pb1', section: 'Queue',      avatar: 0, domain: 'IT',         title: 'Auto-assign by Category',             subtitle: 'Auto-routing',     defaultOn: true,  integrations: ['globe', 'word'],        desc: 'Routes incoming tickets to the right agent based on category tags and workload.' },
  { id: 'pb2', section: 'Queue',      avatar: 1, domain: 'IT',         title: 'SLA Breach Auto-escalation',           subtitle: 'SLA management',   defaultOn: true,  integrations: ['globe', 'word'],        desc: 'Automatically escalates tickets approaching or past their SLA deadline.' },
  { id: 'pb3', section: 'Queue',      avatar: 2, domain: 'IT',         title: 'Duplicate Ticket Detection & Merge',   subtitle: 'Queue management', defaultOn: false, integrations: ['globe'],               desc: 'Detects similar open tickets and merges them to prevent duplicate work.' },
  { id: 'pb4', section: 'Queue',      avatar: 3, domain: 'IT',         title: 'Auto-close Inactive Resolved Tickets', subtitle: 'Queue management', defaultOn: false, integrations: ['globe'],               desc: 'Closes tickets that have been resolved but inactive for 7+ days.' },
  { id: 'pb5', section: 'Cross-team', avatar: 4, domain: 'Cross-team', title: 'New Hire Cross-team Onboarding',       subtitle: 'Onboarding',       defaultOn: true,  integrations: ['globe', 'word', 'drive'], desc: 'Coordinates with HR and Facilities when a new hire ticket is opened.' },
  { id: 'pb6', section: 'Cross-team', avatar: 5, domain: 'Cross-team', title: 'CSAT Survey on Ticket Close',          subtitle: 'Feedback',         defaultOn: false, integrations: ['globe', 'drive'],       desc: 'Sends a satisfaction survey to the requester when their ticket is closed.' },
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

// ── Step 3: Configuration ─────────────────────────────────────────────────────
function Step3({ form, setForm }) {
  return (
    <>
      <StepHeader step={3} />
      <div style={{ ...BASE, fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Intake channels</div>
      <Field label="Email channel" hint="Emails to this address automatically open a ticket.">
        <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. it-help@acme.com" style={inputSt} autoFocus />
      </Field>
      <Field label="Slack channel" hint="Messages in this channel automatically open a ticket.">
        <input value={form.slack} onChange={e => setForm(f => ({ ...f, slack: e.target.value }))} placeholder="#channel-name" style={inputSt} />
      </Field>

      <div style={{ ...BASE, fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '8px 0 16px' }}>Business hours</div>
      <Field label="Active days">
        <select value={form.dayRange} onChange={e => setForm(f => ({ ...f, dayRange: e.target.value }))} style={{ ...inputSt, appearance: 'auto' }}>
          {DAY_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Field label="Start time" style={{ flex: 1 }}>
          <select value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} style={{ ...inputSt, appearance: 'auto' }}>
            {TIME_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="End time" style={{ flex: 1 }}>
          <select value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} style={{ ...inputSt, appearance: 'auto' }}>
            {TIME_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ ...BASE, fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '8px 0 16px' }}>SLA targets</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
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
    </>
  );
}

// ── Playbook card — exact AutomationsView WorkflowCard design ────────────────
function PlaybookCard({ p, on, onToggle }) {
  const avatarSrc = AVATARS[p.avatar % AVATARS.length];
  return (
    <div style={{ background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header: avatar + title + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={avatarSrc} width="48" height="48" alt="" style={{ borderRadius: '50%', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.2px', fontFamily: SFT }}>
          {p.title}
        </span>
        <Toggle value={on} onChange={onToggle} />
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
              <PlaybookCard key={p.id} p={p} on={!!form.playbooks[p.id]} onToggle={() => toggle(p.id)} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function CreateQueuePanel({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', desc: '', color: '#4573D2',
    admins: [], members: [],
    email: '', slack: '', dayRange: 'Mon–Fri', startTime: '9:00 AM', endTime: '6:00 PM',
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
