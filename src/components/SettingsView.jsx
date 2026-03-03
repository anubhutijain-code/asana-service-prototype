import { useState } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const SFT  = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const LIGA = { fontFeatureSettings: "'liga' off, 'clig' off" };
const base = { fontFamily: SFT, ...LIGA };

const inputStyle = {
  ...base, fontSize: 13, height: 32, padding: '0 10px',
  border: '1px solid var(--border)', borderRadius: 6,
  outline: 'none', color: 'var(--text)', background: 'white',
  boxSizing: 'border-box',
};

const btnPrimary = {
  ...base, fontSize: 13, fontWeight: 500, height: 28, padding: '0 12px',
  background: 'var(--selected-background-strong)', color: 'white',
  border: 'none', borderRadius: 6, cursor: 'pointer',
};
const btnSecondary = {
  ...base, fontSize: 13, fontWeight: 500, height: 28, padding: '0 12px',
  background: 'transparent', color: 'var(--text-weak)',
  border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer',
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general', label: 'General'    },
  { id: 'it',      label: 'IT Tickets' },
  { id: 'hr',      label: 'HR Tickets' },
];

// ── Static data ───────────────────────────────────────────────────────────────
const AGENTS = [
  { name: 'Jordan Ng', initials: 'JN', role: 'Admin', color: '4573D2' },
  { name: 'Alex M.',   initials: 'AM', role: 'Agent', color: '5DA182' },
  { name: 'Sarah K.',  initials: 'SK', role: 'Agent', color: 'ECBD85' },
];

const TIME_OPTS = ['15 min','30 min','1 hr','2 hrs','4 hrs','8 hrs','1 day','2 days','3 days','5 days'];

const PRIORITY_CHIP = {
  Critical: { background: 'var(--danger-background)',   color: 'var(--danger-text)'   },
  High:     { background: 'var(--warning-background)',  color: 'var(--warning-text)'  },
  Medium:   { background: 'var(--selected-background)', color: 'var(--selected-text)' },
  Low:      { background: 'var(--background-medium)',   color: 'var(--text-weak)'     },
};

const QUEUE_DATA = {
  it: {
    sla: [
      { priority: 'Critical', response: '15 min', resolution: '1 hr'   },
      { priority: 'High',     response: '30 min', resolution: '4 hrs'  },
      { priority: 'Medium',   response: '2 hrs',  resolution: '1 day'  },
      { priority: 'Low',      response: '4 hrs',  resolution: '3 days' },
    ],
    categories:   ['Access Management', 'Hardware', 'Software', 'Network'],
    integrations: [
      { id: 'intune',     name: 'Intune',     subtitle: '847 managed devices',   connected: true },
      { id: 'jamf',       name: 'Jamf',       subtitle: '213 managed devices',   connected: true },
      { id: 'confluence', name: 'Confluence', subtitle: '2,140 articles synced', connected: true },
    ],
    emailChannel: 'it-help@acme.com',
    slackChannel: '#it-help',
    aiGuidance:   'Always escalate hardware issues to on-site team if unresolved after 2 hrs. Route Salesforce tickets to Sales Eng.',
  },
  hr: {
    sla: [
      { priority: 'Critical', response: '1 hr',   resolution: '4 hrs'  },
      { priority: 'High',     response: '4 hrs',  resolution: '1 day'  },
      { priority: 'Medium',   response: '1 day',  resolution: '3 days' },
      { priority: 'Low',      response: '2 days', resolution: '5 days' },
    ],
    categories:   ['Leave Requests', 'Benefits', 'Onboarding', 'Payroll'],
    integrations: [
      { id: 'notion',  name: 'Notion',  subtitle: '318 articles synced', connected: true },
      { id: 'workday', name: 'Workday', subtitle: '847 employees',       connected: true },
    ],
    emailChannel: 'hr@acme.com',
    slackChannel: '#hr-help',
    aiGuidance:   'For leave requests, always confirm manager approval before processing. Route payroll queries to Finance team.',
  },
};

// ── Integration logos ─────────────────────────────────────────────────────────
function IntegrationLogo({ id, size = 28 }) {
  if (id === 'intune') return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Intune" style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#0078D4" />
      <path d="M7 17V8l3.5 5 3.5-5v9M14 8h3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
  if (id === 'jamf') return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Jamf" style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#53A7D6" />
      <path d="M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5zm0 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="white" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
  if (id === 'confluence') return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Confluence" style={{ borderRadius: 6, flexShrink: 0 }}>
      <path d="M2 17.4c-.3.4-.7 1.2-1 1.65-.3.6 0 1.2.6 1.5l3.9 2.25c.6.3 1.35.15 1.65-.45.3-.45.6-1.05 1.05-1.65 2.7-4.05 5.7-3.6 8.55-.45l3.75 2.25c.6.3 1.35.15 1.65-.45l2.1-3.75c.3-.6.15-1.35-.45-1.65l-3.9-2.25C17.4 12.15 11.3 10.95 2 17.4z" fill="#0065FF" opacity=".85" />
      <path d="M22 6.6c.3-.4.7-1.2 1-1.65.3-.6 0-1.2-.6-1.5L18.5 1.2c-.6-.3-1.35-.15-1.65.45-.3.45-.6 1.05-1.05 1.65-2.7 4.05-5.7 3.6-8.55.45L3.5 1.5c-.6-.3-1.35-.15-1.65.45L-.25 5.7c-.3.6-.15 1.35.45 1.65L4.1 9.6C6.6 11.85 12.7 13.05 22 6.6z" fill="#2684FF" opacity=".85" />
    </svg>
  );
  if (id === 'notion') return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Notion" style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#1E1F21" />
      <path d="M7 6h7.5L19 9.75V18H7V6z" fill="white" />
      <path d="M14.5 6v3.75H19" stroke="#1E1F21" strokeWidth="1.2" fill="none" />
      <path d="M9.5 11.25h5M9.5 14.25h5" stroke="#9ea0a2" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
  if (id === 'workday') return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Workday" style={{ borderRadius: 6, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#F7941D" />
      <path d="M5 15L8 8l3 5 3-5 3 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
  return null;
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      type="button" role="switch" aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        position: 'relative', width: 36, height: 20, borderRadius: 10,
        border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
        background: value ? 'var(--selected-background-strong)' : 'var(--background-strong)',
        transition: 'background 0.15s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, width: 16, height: 16, borderRadius: 8,
        background: 'white', transition: 'left 0.15s',
        left: value ? 18 : 2,
      }} />
    </button>
  );
}

// ── Layout primitives ─────────────────────────────────────────────────────────

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, transition: 'transform 0.18s ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
      <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Section: collapsible — header is a full-width button, content fades under tinted container
function Section({ title, children, action, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Clickable header row */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '5px 0', gap: 8, color: 'var(--text-weak)',
        }}
      >
        <span style={{ ...base, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Action (e.g. + Invite agent) only shown when open */}
          {open && action && (
            <span onClick={e => e.stopPropagation()}>
              {action}
            </span>
          )}
          <Chevron open={open} />
        </div>
      </button>
      {/* Collapsible content with smooth max-height transition */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? 1200 : 0,
        transition: 'max-height 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ background: 'var(--background-weak)', borderRadius: 8, overflow: 'hidden', marginTop: 6 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Row: label + description on the left (stacked), control on the right
// Rows live inside the tinted container so they carry horizontal padding
function Row({ label, description, children, last, alignTop }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: alignTop ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      padding: alignTop ? '13px 16px' : '11px 16px',
      gap: 24,
      borderBottom: last ? 'none' : '1px solid var(--border)',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ ...base, fontSize: 13, color: 'var(--text)', margin: 0 }}>{label}</p>
        {description && (
          <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '2px 0 0', lineHeight: 1.45 }}>
            {description}
          </p>
        )}
      </div>
      {children && (
        <div style={{ flex: 1, display: 'flex', alignItems: alignTop ? 'flex-start' : 'center', gap: 6 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── General Tab ───────────────────────────────────────────────────────────────
function GeneralTab() {
  const [agentRoles, setAgentRoles] = useState(
    Object.fromEntries(AGENTS.map(a => [a.name, a.role]))
  );
  const [autoClassify, setAutoClassify] = useState(true);
  const [surveyOnClose, setSurveyOnClose] = useState(true);

  return (
    <div>
      <Section title="Service desk">
        <Row
          label="Name"
          description="Shown in your portal and outbound emails">
          <input defaultValue="IT Help Desk" style={{ ...inputStyle, flex: 1 }} />
        </Row>
        <Row
          label="Portal URL"
          description="The address where employees submit new requests"
          last>
          <input defaultValue="acme.service.io" style={{ ...inputStyle, flex: 1 }} />
        </Row>
      </Section>

      <Section title="Business hours">
        <Row
          label="Active hours"
          description="Tickets outside these hours are queued until the next business day"
          last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select defaultValue="Mon–Fri" style={{ ...inputStyle, paddingRight: 28 }}>
              {['Mon–Fri', 'Mon–Sat', 'Every day'].map(o => <option key={o}>{o}</option>)}
            </select>
            <select defaultValue="9:00 AM" style={{ ...inputStyle, paddingRight: 28 }}>
              {['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM'].map(o => <option key={o}>{o}</option>)}
            </select>
            <span style={{ ...base, fontSize: 13, color: 'var(--text-weak)' }}>–</span>
            <select defaultValue="6:00 PM" style={{ ...inputStyle, paddingRight: 28 }}>
              {['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </Row>
      </Section>

      <Section
        title="Team"
        action={
          <button type="button" style={{ ...base, fontSize: 12, color: 'var(--text-weak)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            + Invite agent
          </button>
        }
      >
        {AGENTS.map((a, i) => (
          <div key={a.name}
            className="group flex items-center gap-3"
            style={{ padding: '9px 16px', borderBottom: i < AGENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{
              width: 26, height: 26, borderRadius: 13, background: `#${a.color}`, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, color: 'white', fontFamily: SFT,
            }}>
              {a.initials}
            </div>
            <span style={{ ...base, fontSize: 13, color: 'var(--text)', flex: 1 }}>{a.name}</span>
            <select
              value={agentRoles[a.name]}
              onChange={e => setAgentRoles(prev => ({ ...prev, [a.name]: e.target.value }))}
              style={{ ...inputStyle, height: 28, padding: '0 8px', width: 88 }}
            >
              {['Admin', 'Agent', 'Viewer'].map(r => <option key={r}>{r}</option>)}
            </select>
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ ...base, fontSize: 12, color: 'var(--text-weak)', background: 'none', border: 'none', cursor: 'pointer', width: 52 }}
            >
              Remove
            </button>
          </div>
        ))}
      </Section>

      <Section title="Automation">
        <Row
          label="Auto-classify incoming tickets"
          description="AI assigns category and priority when a ticket arrives">
          <Toggle value={autoClassify} onChange={setAutoClassify} />
        </Row>
        <Row
          label="Confidence threshold"
          description="Only auto-assign when AI confidence meets or exceeds this level">
          <input type="number" defaultValue={85} style={{ ...inputStyle, width: 56, textAlign: 'right' }} />
          <span style={{ ...base, fontSize: 12, color: 'var(--text-weak)' }}>%</span>
        </Row>
        <Row
          label="Auto-close resolved tickets after"
          description="Tickets in Resolved status for this many days are closed automatically">
          <input type="number" defaultValue={7} style={{ ...inputStyle, width: 56, textAlign: 'right' }} />
          <span style={{ ...base, fontSize: 12, color: 'var(--text-weak)' }}>days</span>
        </Row>
        <Row
          label="Send satisfaction survey on close"
          description="Send a one-question CSAT survey when a ticket is marked resolved"
          last>
          <Toggle value={surveyOnClose} onChange={setSurveyOnClose} />
        </Row>
      </Section>
    </div>
  );
}

// ── Queue Tab ─────────────────────────────────────────────────────────────────
function QueueTab({ queue }) {
  const data = QUEUE_DATA[queue];
  const [categories, setCategories] = useState(data.categories);

  return (
    <div>
      <Section title="Response times">
        {data.sla.map((row, i) => {
          const chip = PRIORITY_CHIP[row.priority];
          return (
            <div key={row.priority}
              style={{
                display: 'flex', alignItems: 'center', gap: 20,
                padding: '10px 16px',
                borderBottom: i < data.sla.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
              <span style={{
                ...chip, ...base, fontSize: 11, fontWeight: 500,
                padding: '2px 8px', borderRadius: 999, ...LIGA,
                width: 72, textAlign: 'center', flexShrink: 0,
              }}>
                {row.priority}
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...base, fontSize: 12, color: 'var(--text-weak)', width: 86, flexShrink: 0 }}>First response</span>
                <select defaultValue={row.response} style={{ ...inputStyle, height: 28, width: 94 }}>
                  {TIME_OPTS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...base, fontSize: 12, color: 'var(--text-weak)', width: 72, flexShrink: 0 }}>Resolution</span>
                <select defaultValue={row.resolution} style={{ ...inputStyle, height: 28, width: 94 }}>
                  {TIME_OPTS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          );
        })}
      </Section>

      <Section title="Categories">
        <Row
          label="Queue tags"
          description="Used to route tickets, apply automations, and filter reports"
          last>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
            {categories.map(cat => (
              <div key={cat} className="group"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  background: 'var(--background-medium)', color: 'var(--text)',
                  fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 999,
                  fontFamily: SFT, ...LIGA,
                }}>
                {cat}
                <button
                  type="button"
                  onClick={() => setCategories(prev => prev.filter(c => c !== cat))}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', fontSize: 13, padding: '0 0 0 2px', lineHeight: 1 }}
                >×</button>
              </div>
            ))}
            <button type="button"
              style={{
                fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 999,
                fontFamily: SFT, ...LIGA,
                border: '1px dashed var(--border-strong)',
                color: 'var(--text-weak)', background: 'transparent', cursor: 'pointer',
              }}
            >+ Add</button>
          </div>
        </Row>
      </Section>

      <Section title="Integrations">
        {data.integrations.map((int, i) => (
          <div key={int.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px',
              borderBottom: i < data.integrations.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
            <IntegrationLogo id={int.id} size={28} />
            <div style={{ flex: 1 }}>
              <p style={{ ...base, fontSize: 13, color: 'var(--text)', margin: 0 }}>{int.name}</p>
              <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '1px 0 0' }}>{int.subtitle}</p>
            </div>
            <span style={{ ...base, fontSize: 12, color: int.connected ? 'var(--success-text)' : 'var(--text-weak)', marginRight: 8 }}>
              {int.connected ? '● Connected' : '○ Not connected'}
            </span>
            <button type="button" style={int.connected ? btnSecondary : btnPrimary}>
              {int.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
        <div style={{ padding: '8px 16px' }}>
          <button type="button" style={{ ...base, fontSize: 12, color: 'var(--text-weak)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            + Connect integration
          </button>
        </div>
      </Section>

      <Section title="Input channels">
        <Row
          label="Email"
          description="Emails to this address automatically open a ticket">
          <input defaultValue={data.emailChannel} style={{ ...inputStyle, flex: 1 }} />
        </Row>
        <Row
          label="Slack"
          description="Messages in this channel automatically open a ticket"
          last>
          <input defaultValue={data.slackChannel} style={{ ...inputStyle, flex: 1 }} />
        </Row>
      </Section>

      <Section title="AI guidance">
        <Row
          label="Instructions"
          description="Guides how AI triages, classifies, and responds to tickets in this queue"
          alignTop last>
          <textarea
            rows={4}
            style={{
              ...inputStyle, height: 'auto', padding: '8px 10px',
              flex: 1, resize: 'vertical', lineHeight: 1.5,
            }}
            defaultValue={data.aiGuidance}
          />
        </Row>
      </Section>
    </div>
  );
}

// ── SettingsView ──────────────────────────────────────────────────────────────
export default function SettingsView() {
  const [tab, setTab] = useState('general');

  return (
    <div className="h-full overflow-y-auto">
      <div style={{ padding: '32px 40px' }}>
        <p style={{ ...base, fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: '0 0 24px' }}>
          Settings
        </p>

        {/* Tab bar */}
        <div className="flex border-b border-border mb-8">
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={[
                'px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'text-text shadow-[inset_0_-2px_0_var(--text)]'
                  : 'text-text-weak hover:text-text',
              ].join(' ')}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'general' && <GeneralTab />}
        {tab === 'it'      && <QueueTab queue="it" />}
        {tab === 'hr'      && <QueueTab queue="hr" />}
      </div>
    </div>
  );
}
