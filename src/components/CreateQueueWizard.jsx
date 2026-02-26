import { useState } from 'react';
import Dropdown from './Dropdown';

const B = import.meta.env.BASE_URL;

const AVATARS = [
  `${B}avatars/Teammate.svg`,
  `${B}avatars/Teammate1.svg`,
  `${B}avatars/Teammate-1.svg`,
  `${B}avatars/Teammate-2.svg`,
];

function IntegrationIcon({ type }) {
  const src = {
    globe : `${B}integrations/globe.svg`,
    word  : `${B}integrations/microsoft-word.svg`,
    drive : `${B}integrations/google-drive.svg`,
  }[type];
  if (!src) return null;
  return <img src={src} width="16" height="16" alt={type} style={{ display: 'block', flexShrink: 0 }} />;
}

// ─── Steps (4 steps) ──────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Let's get started", sub: 'Name, category, and agent group'  },
  { id: 2, label: 'Ticket intake',     sub: 'Email and chat integrations'       },
  { id: 3, label: 'Configuration',     sub: 'SLA policy and custom fields'      },
  { id: 4, label: 'Workflows',         sub: 'Out-of-the-box automations'        },
];

// ─── Intake icons ──────────────────────────────────────────────────────────────

function SlackIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6.72313 20.2219C6.72313 22.0721 5.21173 23.5835 3.36156 23.5835C1.5114 23.5835 0 22.0721 0 20.2219C0 18.3718 1.5114 16.8604 3.36156 16.8604H6.72313V20.2219Z" fill="#E01E5A"/>
      <path d="M8.41602 20.2219C8.41602 18.3718 9.92742 16.8604 11.7776 16.8604C13.6277 16.8604 15.1391 18.3718 15.1391 20.2219V28.6389C15.1391 30.489 13.6277 32.0004 11.7776 32.0004C9.92742 32.0004 8.41602 30.489 8.41602 28.6389V20.2219Z" fill="#E01E5A"/>
      <path d="M11.7776 6.72313C9.92742 6.72313 8.41602 5.21173 8.41602 3.36156C8.41602 1.5114 9.92742 0 11.7776 0C13.6277 0 15.1391 1.5114 15.1391 3.36156V6.72313H11.7776Z" fill="#36C5F0"/>
      <path d="M11.7785 8.41699C13.6287 8.41699 15.1401 9.92839 15.1401 11.7786C15.1401 13.6287 13.6287 15.1401 11.7785 15.1401H3.36156C1.5114 15.1401 0 13.6287 0 11.7786C0 9.92839 1.5114 8.41699 3.36156 8.41699H11.7785Z" fill="#36C5F0"/>
      <path d="M25.2793 11.7776C25.2793 9.92742 26.7907 8.41602 28.6409 8.41602C30.491 8.41602 32.0024 9.92742 32.0024 11.7776C32.0024 13.6277 30.491 15.1391 28.6409 15.1391H25.2793V11.7776Z" fill="#2EB67D"/>
      <path d="M23.5825 11.7785C23.5825 13.6287 22.0711 15.1401 20.2209 15.1401C18.3708 15.1401 16.8594 13.6287 16.8594 11.7785V3.36156C16.8594 1.5114 18.3708 0 20.2209 0C22.0711 0 23.5825 1.5114 23.5825 3.36156V11.7785Z" fill="#2EB67D"/>
      <path d="M20.2209 25.2773C22.0711 25.2773 23.5825 26.7887 23.5825 28.6389C23.5825 30.4891 22.0711 32.0005 20.2209 32.0005C18.3708 32.0005 16.8594 30.4891 16.8594 28.6389V25.2773H20.2209Z" fill="#ECB22E"/>
      <path d="M20.2209 23.5835C18.3708 23.5835 16.8594 22.0721 16.8594 20.2219C16.8594 18.3718 18.3708 16.8604 20.2209 16.8604H28.6379C30.488 16.8604 31.9994 18.3718 31.9994 20.2219C31.9994 22.0721 30.488 23.5835 28.6379 23.5835H20.2209Z" fill="#ECB22E"/>
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
      <path d="M22.321 11.1631H30.5867C31.3676 11.1631 32.0006 11.7961 32.0006 12.577V20.106C32.0006 22.976 29.674 25.3026 26.804 25.3026H26.7794C23.9094 25.303 21.5824 22.9767 21.582 20.1067C21.582 20.1065 21.582 20.1062 21.582 20.106V11.9021C21.582 11.4939 21.9129 11.1631 22.321 11.1631Z" fill="#5059C9"/>
      <path d="M27.9074 9.67424C29.7569 9.67424 31.2563 8.17491 31.2563 6.3254C31.2563 4.47589 29.7569 2.97656 27.9074 2.97656C26.0579 2.97656 24.5586 4.47589 24.5586 6.3254C24.5586 8.17491 26.0579 9.67424 27.9074 9.67424Z" fill="#5059C9"/>
      <path d="M17.4876 9.67443C20.1591 9.67443 22.3248 7.50874 22.3248 4.83721C22.3248 2.16569 20.1591 0 17.4876 0C14.8161 0 12.6504 2.16569 12.6504 4.83721C12.6504 7.50874 14.8161 9.67443 17.4876 9.67443Z" fill="#7B83EB"/>
      <path d="M23.9381 11.1631H10.2941C9.52253 11.1822 8.91215 11.8225 8.93005 12.5942V21.1813C8.8223 25.8118 12.4857 29.6544 17.1161 29.7678C21.7465 29.6544 25.4099 25.8118 25.3022 21.1813V12.5942C25.32 11.8225 24.7097 11.1822 23.9381 11.1631Z" fill="#7B83EB"/>
      <path d="M1.36409 6.69775H15.008C15.7614 6.69775 16.3721 7.30848 16.3721 8.06184V21.7057C16.3721 22.4591 15.7613 23.0698 15.008 23.0698H1.36409C0.610716 23.0698 0 22.4591 0 21.7057V8.06184C0 7.30848 0.61073 6.69775 1.36409 6.69775Z" fill="url(#tg)"/>
      <path d="M11.7756 11.8904H9.04816V19.3174H7.31049V11.8904H4.5957V10.4497H11.7756V11.8904Z" fill="white"/>
      <defs>
        <linearGradient id="tg" x1="2.844" y1="5.632" x2="13.528" y2="24.136" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5A62C3"/>
          <stop offset="0.5" stopColor="#4D55BD"/>
          <stop offset="1" stopColor="#3940AB"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#F3F2F2"/>
      <path d="M6 11a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V11z" stroke="#6D6E6F" strokeWidth="1.5"/>
      <path d="M6 11.5l10 7 10-7" stroke="#6D6E6F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ['IT', 'HR', 'Facilities', 'Legal', 'Finance'];
const GROUPS     = ['IT Team', 'HR Team', 'Facilities Team', 'Legal Team', 'Finance Team', 'All Agents'];

const VISIBILITY = [
  { value: 'agents',   label: 'Agents Only',       desc: 'Only service agents can view tickets'  },
  { value: 'managers', label: 'Agents & Managers',  desc: 'Agents and their managers'             },
  { value: 'all',      label: 'All Staff',          desc: 'Everyone in the organization'          },
];

const SLA_OPTIONS = [
  { value: 'standard', label: 'Standard', detail: '8-hour first response',  dot: '#5da283' },
  { value: 'priority', label: 'Priority', detail: '4-hour first response',  dot: '#f1bd6c' },
  { value: 'critical', label: 'Critical', detail: '1-hour first response',  dot: '#c92f54' },
];

const SLA_DROPDOWN_OPTIONS = SLA_OPTIONS.map(o => ({
  value: o.value,
  label: `${o.label}  —  ${o.detail}`,
}));

const CUSTOM_FIELDS = [
  { id: 'ticket_category',      label: 'Ticket Category',      required: true  },
  { id: 'priority_level',       label: 'Priority Level',       required: true  },
  { id: 'submitter_department', label: 'Submitter Department', required: true  },
  { id: 'impact',               label: 'Impact',               required: false },
  { id: 'asset_tag',            label: 'Asset Tag',            required: false },
  { id: 'request_for',          label: 'Request For',          required: false },
];

const OOB_WORKFLOWS = [
  {
    id: 'auto_assign', avatar: 0,
    title: 'Auto-Assignment by Category', subtitle: 'Routing', domain: 'IT',
    description: 'Routes new tickets to the right agent group based on ticket category — hardware, software, network.',
    integrations: ['globe', 'word'],
  },
  {
    id: 'ack_reply', avatar: 1,
    title: 'Acknowledgment Reply', subtitle: 'Notifications', domain: 'IT',
    description: 'Sends an automated acknowledgment to submitters within 15 minutes of ticket creation.',
    integrations: ['globe', 'drive'],
  },
  {
    id: 'sla_warn', avatar: 2,
    title: 'SLA Breach Warning', subtitle: 'SLA management', domain: 'IT',
    description: 'Notifies agents and team leads when a ticket approaches SLA breach.',
    integrations: ['globe', 'word', 'drive'],
  },
  {
    id: 'stale_nudge', avatar: 3,
    title: 'Stale Ticket Nudge', subtitle: 'Queue management', domain: 'IT',
    description: 'Reminds the assigned agent for tickets with no activity in 7 days.',
    integrations: ['globe'],
  },
  {
    id: 'priority_escalation', avatar: 0,
    title: 'Priority Escalation', subtitle: 'SLA management', domain: 'IT',
    description: 'Automatically upgrades ticket priority and reassigns to senior agents when response time thresholds are missed.',
    integrations: ['globe', 'word'],
  },
  {
    id: 'csat_survey', avatar: 1,
    title: 'CSAT Survey on Close', subtitle: 'Feedback', domain: 'Cross-team',
    description: 'Sends a short satisfaction survey to the submitter when a ticket is resolved, with results aggregated in dashboards.',
    integrations: ['globe', 'drive'],
  },
  {
    id: 'duplicate_merge', avatar: 2,
    title: 'Duplicate Ticket Detection', subtitle: 'Queue management', domain: 'IT',
    description: 'Detects and merges duplicate tickets automatically, keeping queues clean and preventing duplicated agent effort.',
    integrations: ['globe', 'word'],
  },
  {
    id: 'hr_routing', avatar: 3,
    title: 'Cross-team HR Routing', subtitle: 'Routing', domain: 'Cross-team',
    description: 'Automatically detects HR-related tickets submitted to the IT queue and routes them to the correct HR team.',
    integrations: ['globe', 'word', 'drive'],
  },
  {
    id: 'auto_close', avatar: 0,
    title: 'Auto-close Inactive Tickets', subtitle: 'Queue management', domain: 'IT',
    description: 'Closes tickets that remain in Resolved state with no submitter response for 7 days, keeping queues tidy.',
    integrations: ['globe'],
  },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const INPUT_STYLE = {
  width: '100%', height: 42, padding: '0 13px',
  border: '1.5px solid #EDEAE9', borderRadius: 8,
  fontSize: 14, color: '#1E1F21', background: 'white',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color 0.15s',
};

const LABEL_STYLE = {
  display: 'block', marginBottom: 7,
  fontFamily: '"SF Pro Text", -apple-system, sans-serif',
  fontSize: 12, fontWeight: 500, color: '#6D6E6F',
  lineHeight: '18px', fontFeatureSettings: "'liga' off, 'clig' off",
};

function Label({ children, required }) {
  return (
    <label style={LABEL_STYLE}>
      {children}
      {required && <span style={{ color: '#c92f54', marginLeft: 3 }}>*</span>}
    </label>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 10, border: 'none',
        background: checked ? '#3F6AC4' : '#D1D5DB',
        position: 'relative', cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.2s', flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: 'white', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

// ─── Step 1: Let's get started ────────────────────────────────────────────────

function Step1({ form, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Field label="Queue Name" required>
        <input
          type="text"
          placeholder="e.g. IT Helpdesk — Americas"
          value={form.name}
          onChange={e => onChange({ ...form, name: e.target.value })}
          style={INPUT_STYLE}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Service Category" required>
          <Dropdown
            value={form.category}
            onChange={val => onChange({ ...form, category: val })}
            options={CATEGORIES}
            placeholder="Select…"
          />
        </Field>
        <Field label="Assigned Agent Group" required>
          <Dropdown
            value={form.group}
            onChange={val => onChange({ ...form, group: val })}
            options={GROUPS}
            placeholder="Select…"
          />
        </Field>
      </div>

    </div>
  );
}

// ─── Step 2: Ticket intake ────────────────────────────────────────────────────

const APP_NAME_STYLE = {
  fontFamily: '"SF Pro Text", -apple-system, sans-serif',
  fontSize: 14, fontWeight: 500, color: '#1E1F21',
  lineHeight: '22px', letterSpacing: '-0.15px',
  fontFeatureSettings: "'liga' off, 'clig' off",
};

const INTAKE_DESC_STYLE = {
  fontFamily: '"SF Pro Text", -apple-system, sans-serif',
  fontSize: 14, fontWeight: 400, color: '#1D1F21',
  lineHeight: '22px', letterSpacing: '-0.15px',
  margin: 0, fontFeatureSettings: "'liga' off, 'clig' off",
};

const CONNECT_BTN = {
  height: 32, padding: '0 14px', flexShrink: 0,
  border: '1px solid #EDEAE9', borderRadius: 6,
  fontFamily: '"SF Pro Text", -apple-system, sans-serif',
  fontSize: 12, fontWeight: 400, color: '#1E1F21',
  background: 'white', cursor: 'pointer',
  fontFeatureSettings: "'liga' off, 'clig' off",
};

const CARD_BASE = {
  border: '1px solid #EDEAE9', borderRadius: 8,
  padding: '18px 20px', background: 'white',
};

function IntakeCard({ icon, name, description, fieldLabel, fieldPlaceholder, fieldType = 'text', value, onValue, connectingMsg }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...CARD_BASE, display: 'flex', flexDirection: 'column', gap: open ? 16 : 0 }}>
      {/* Header row — always visible */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flexShrink: 0 }}>{icon}</div>
        <span style={{ ...APP_NAME_STYLE, flex: 1 }}>{name}</span>
        {!open && (
          <button type="button" style={CONNECT_BTN} onClick={() => setOpen(true)}>
            Connect
          </button>
        )}
        {open && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ea0a2', padding: 4, lineHeight: 1 }}
            aria-label="Collapse"
          >
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Expanded content */}
      {open && (
        <>
          <p style={INTAKE_DESC_STYLE}>{description}</p>
          <div>
            <label style={{ ...LABEL_STYLE, marginBottom: 6 }}>{fieldLabel}</label>
            <input
              autoFocus
              type={fieldType}
              placeholder={fieldPlaceholder}
              value={value}
              onChange={e => onValue(e.target.value)}
              style={{ ...INPUT_STYLE, borderColor: value ? '#3F6AC4' : '#EDEAE9' }}
            />
            {value && connectingMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="#9ea0a2" strokeWidth="1.2"/>
                  <path d="M5 8.5l2 2 4-4" stroke="#9ea0a2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: '"SF Pro Text", -apple-system, sans-serif', fontSize: 12, fontWeight: 400, color: '#9ea0a2' }}>{connectingMsg}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Step2({ intake, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <IntakeCard
        icon={<EmailIcon />}
        name="Email"
        description="Tickets submitted by email are automatically created in this queue. Use a dedicated address or alias."
        fieldLabel="Queue email address"
        fieldPlaceholder="e.g. it-helpdesk@yourcompany.com"
        fieldType="email"
        value={intake.email}
        onValue={v => onChange({ ...intake, email: v })}
      />
      <IntakeCard
        icon={<SlackIcon />}
        name="Slack"
        description="Select a Slack channel from your workspace. When messages are posted to this channel, a ticket will be created automatically in Asana."
        fieldLabel="Slack channel"
        fieldPlaceholder="e.g. it-support"
        value={intake.slack}
        onValue={v => onChange({ ...intake, slack: v })}
        connectingMsg="Connecting..."
      />
      <IntakeCard
        icon={<TeamsIcon />}
        name="Microsoft Teams"
        description="Connect your Microsoft Teams workspace to allow users to submit tickets directly from Teams channels."
        fieldLabel="Teams channel"
        fieldPlaceholder="e.g. IT Support"
        value={intake.teams || ''}
        onValue={v => onChange({ ...intake, teams: v })}
        connectingMsg="Connecting..."
      />
    </div>
  );
}

function Step3({ form, onChange }) {
  const [addingField, setAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  const extraFields = form.extraFields || [];
  const allFields   = [...CUSTOM_FIELDS, ...extraFields];

  function commitNewField() {
    const trimmed = newFieldName.trim();
    if (!trimmed) { setAddingField(false); setNewFieldName(''); return; }
    const id = `extra_${Date.now()}`;
    onChange({
      ...form,
      extraFields: [...extraFields, { id, label: trimmed, required: false }],
      fields: { ...(form.fields || {}), [id]: true },
    });
    setNewFieldName('');
    setAddingField(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* SLA Policy — dropdown */}
      <Field label="SLA Policy" required>
        <Dropdown
          value={form.sla}
          onChange={val => onChange({ ...form, sla: val })}
          options={SLA_DROPDOWN_OPTIONS}
          placeholder="Select a policy…"
        />
      </Field>

      {/* Custom fields — pill row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
          <Label>Custom Fields</Label>
          <span style={{ fontSize: 12, color: '#9ea0a2' }}>Included fields are always on.</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {allFields.map(f => {
            const isOn = f.required || !!(form.fields || {})[f.id];
            return (
              <button
                key={f.id}
                type="button"
                disabled={f.required}
                onClick={() => !f.required && onChange({ ...form, fields: { ...(form.fields || {}), [f.id]: !isOn } })}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 32, padding: '0 12px',
                  borderRadius: 16,
                  border: `1.5px solid ${isOn ? '#3F6AC4' : '#EDEAE9'}`,
                  background: isOn ? '#EEF2FC' : 'white',
                  cursor: f.required ? 'default' : 'pointer',
                  fontSize: 13, fontWeight: 500,
                  color: isOn ? '#3F6AC4' : '#6D6E6F',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* checkbox mark */}
                <span style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isOn ? '#3F6AC4' : 'transparent',
                  border: `1.5px solid ${isOn ? '#3F6AC4' : '#C5C7C9'}`,
                  transition: 'all 0.15s',
                }}>
                  {isOn && (
                    <svg viewBox="0 0 10 8" width="8" height="8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                {f.label}
              </button>
            );
          })}

          {/* Add field pill */}
          {addingField ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 32, padding: '0 10px 0 12px',
              borderRadius: 16,
              border: '1.5px dashed #3F6AC4',
              background: '#EEF2FC',
            }}>
              <input
                autoFocus
                type="text"
                placeholder="Field name"
                value={newFieldName}
                onChange={e => setNewFieldName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitNewField(); if (e.key === 'Escape') { setAddingField(false); setNewFieldName(''); } }}
                style={{
                  border: 'none', outline: 'none', fontSize: 13, fontWeight: 500,
                  color: '#1E1F21', fontFamily: 'inherit', background: 'transparent',
                  width: 100,
                }}
              />
              <button type="button" onClick={commitNewField}
                style={{ fontSize: 11, fontWeight: 600, color: '#3F6AC4', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                ↵
              </button>
              <button type="button" onClick={() => { setAddingField(false); setNewFieldName(''); }}
                style={{ fontSize: 16, color: '#9ea0a2', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingField(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 32, padding: '0 12px',
                borderRadius: 16,
                border: '1.5px dashed #D1D5DB',
                background: 'white', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: '#9ea0a2',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ea0a2'; e.currentTarget.style.color = '#6D6E6F'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#9ea0a2'; }}
            >
              <svg viewBox="0 0 12 12" width="11" height="11" fill="none">
                <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add field
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Workflows ────────────────────────────────────────────────────────
// Exact same card as AutomationsView

function WorkflowCard({ workflow, enabled, onToggle }) {
  const avatarSrc = AVATARS[workflow.avatar % AVATARS.length];
  return (
    <div style={{
      background: 'white',
      border: '1px solid #EDEAE9',
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
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: '#1E1F21', lineHeight: '22px', letterSpacing: '-0.2px' }}>
          {workflow.title}
        </span>
        <ToggleSwitch checked={enabled} onChange={onToggle} />
      </div>

      {/* Description */}
      <p style={{
        fontSize: 14, fontWeight: 400, color: '#6D6E6F',
        lineHeight: '22px', margin: 0, letterSpacing: '-0.15px',
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {workflow.description}
      </p>

      {/* Footer: domain pill + subtitle pill + integration icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
        <span style={{
          height: 28, padding: '0 10px',
          border: '1px solid #E5E7EB', borderRadius: 14,
          fontSize: 12, color: '#6D6E6F',
          display: 'inline-flex', alignItems: 'center', flexShrink: 0,
        }}>
          {workflow.domain}
        </span>
        <span style={{
          height: 28, padding: '0 10px',
          border: '1px solid #E5E7EB', borderRadius: 14,
          fontSize: 12, color: '#6D6E6F',
          display: 'inline-flex', alignItems: 'center', flexShrink: 0,
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

function Step4({ workflows, onToggle }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {OOB_WORKFLOWS.map(w => (
        <WorkflowCard
          key={w.id}
          workflow={w}
          enabled={workflows[w.id] ?? true}
          onToggle={() => onToggle(w.id)}
        />
      ))}

      {/* Add workflow card */}
      <button
        type="button"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, minHeight: 180,
          background: 'white',
          border: '1.5px dashed #D1D5DB', borderRadius: 12,
          cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ea0a2'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#F3F2F2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="#9ea0a2" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#9ea0a2' }}>Add workflow</span>
      </button>
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ queueName, onOpenQueue, onCreateAnother }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 56px', textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: '#EDFAF2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
      }}>
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="#5da283" strokeWidth="2"/>
          <path d="M12 20l6 7 11-12" stroke="#5da283" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1E1F21', margin: '0 0 10px' }}>
        Queue created!
      </h2>
      <p style={{ fontSize: 15, color: '#6D6E6F', margin: '0 0 36px', lineHeight: '24px', maxWidth: 400 }}>
        <strong style={{ color: '#1E1F21' }}>{queueName || 'Your queue'}</strong> is live. Agents in the assigned group can start triaging tickets right away.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={onCreateAnother}
          style={{
            height: 42, padding: '0 22px',
            border: '1.5px solid #EDEAE9', borderRadius: 8,
            fontSize: 14, fontWeight: 500, color: '#9ea0a2',
            background: 'white', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Create another
        </button>
        <button
          type="button"
          onClick={onOpenQueue}
          style={{
            height: 42, padding: '0 22px',
            border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 600, color: 'white',
            background: '#3F6AC4', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Open queue →
        </button>
      </div>
    </div>
  );
}

// ─── Step meta ────────────────────────────────────────────────────────────────

const STEP_META = {
  1: { title: "Let's get started",  sub: 'Name your queue and assign it to an agent group.'                                      },
  2: { title: 'Ticket intake',      sub: 'Connect the channels where tickets will come from.'                                    },
  3: { title: 'Configuration',      sub: 'Set the SLA policy and choose which custom fields to include.'                        },
  4: { title: 'Included workflows', sub: 'These automations are enabled by default. You can customize them from Automations after setup.' },
};

function canProceed(step, identity, config) {
  if (step === 1) return !!(identity.name.trim() && identity.category && identity.group);
  if (step === 2) return true; // intake is optional
  if (step === 3) return !!config.sla;
  return true;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CreateQueueWizard({ onDone }) {
  const [step,      setStep]      = useState(1);
  const [identity,  setIdentity]  = useState({ name: '', category: '', group: '', visibility: '' });
  const [intake,    setIntake]    = useState({ email: '', slack: '', teams: '' });
  const [config,    setConfig]    = useState({ sla: '', fields: {}, extraFields: [] });
  const [workflows, setWorkflows] = useState(
    Object.fromEntries(OOB_WORKFLOWS.map(w => [w.id, true]))
  );
  const [submitted, setSubmitted] = useState(false);

  function handleNext() {
    if (step < STEPS.length) setStep(s => s + 1);
    else setSubmitted(true);
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1);
  }

  function handleReset() {
    setStep(1);
    setIdentity({ name: '', category: '', group: '', visibility: '' });
    setIntake({ email: '', slack: '', teams: '' });
    setConfig({ sla: '', fields: {}, extraFields: [] });
    setWorkflows(Object.fromEntries(OOB_WORKFLOWS.map(w => [w.id, true])));
    setSubmitted(false);
  }

  function handleToggleWorkflow(id) {
    setWorkflows(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const isLastStep = step === STEPS.length;
  const valid      = canProceed(step, identity, config);
  const meta       = STEP_META[step];

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'white' }}>

      {submitted ? (
        <SuccessState
          queueName={identity.name}
          onOpenQueue={onDone}
          onCreateAnother={handleReset}
        />
      ) : (
        <>
          {/* X close button — top right */}
          <button
            type="button"
            onClick={onDone}
            style={{
              position: 'absolute', top: 16, right: 20,
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              cursor: 'pointer', borderRadius: 6,
              color: '#9ea0a2',
              transition: 'background 0.12s, color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F5F5F4'; e.currentTarget.style.color = '#1E1F21'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ea0a2'; }}
            aria-label="Close"
          >
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '56px 64px 32px' }}>

            <h1 style={{
              fontFamily: '"SF Pro Display", -apple-system, sans-serif',
              fontSize: 32, fontWeight: 400, color: '#1E1F21',
              margin: '0 0 6px', lineHeight: '40px', letterSpacing: '0.38px',
              fontFeatureSettings: "'liga' off, 'clig' off",
            }}>
              {meta.title}
            </h1>
            <p style={{
              fontFamily: '"SF Pro Text", -apple-system, sans-serif',
              fontSize: 16, fontWeight: 400, color: '#6D6E6F',
              margin: '0 0 36px', lineHeight: '24px', letterSpacing: '-0.32px',
              fontFeatureSettings: "'liga' off, 'clig' off",
            }}>
              {meta.sub}
            </p>

            {/* Step 4 uses full width; others are constrained */}
            <div style={{ maxWidth: step === 4 ? 'none' : 620 }}>
              {step === 1 && <Step1 form={identity} onChange={setIdentity} />}
              {step === 2 && <Step2 intake={intake} onChange={setIntake} />}
              {step === 3 && <Step3 form={config}   onChange={setConfig}  />}
              {step === 4 && <Step4 workflows={workflows} onToggle={handleToggleWorkflow} />}

              {/* Actions — 64px below content, left-aligned */}
              <div style={{ marginTop: 64, display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 56 }}>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!valid}
                  style={{
                    height: 36, padding: '0 22px',
                    border: 'none', borderRadius: 8,
                    fontSize: 14, fontWeight: 600, color: 'white',
                    background: valid ? '#3F6AC4' : '#D1D5DB',
                    cursor: valid ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {isLastStep ? 'Create Queue' : 'Continue'}
                </button>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{
                      height: 36, padding: '0 4px',
                      border: 'none', borderRadius: 8,
                      fontSize: 14, fontWeight: 400, color: '#9ea0a2',
                      background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
