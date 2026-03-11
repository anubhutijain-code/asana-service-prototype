import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button   from './ui/Button';
import Badge    from './ui/Badge';
import Avatar   from './ui/Avatar';
import Dropdown from './Dropdown';

// ── Design tokens ─────────────────────────────────────────────────────────────
const SFT  = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const LIGA = { fontFeatureSettings: "'liga' off, 'clig' off" };
const base = { fontFamily: SFT, ...LIGA };

const H5 = {
  fontFamily: '"SF Pro Text"', fontFeatureSettings: "'liga' off, 'clig' off",
  fontSize: 16, fontWeight: 500, lineHeight: '20px', letterSpacing: '-0.32px',
  color: 'var(--neutrals-lm-text, var(--Default-text, #1E1F21))',
};

const inputStyle = {
  ...base, fontSize: 13, height: 32, padding: '0 10px',
  border: '1px solid var(--border)', borderRadius: 6,
  outline: 'none', color: 'var(--text)', background: 'white',
  boxSizing: 'border-box',
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',      label: 'General'        },
  { id: 'integrations', label: 'Integrations'   },
  { id: 'kb',           label: 'Knowledge Base' },
  { id: 'ai',           label: 'AI'             },
  { id: 'automations',  label: 'Automations'    },
];

// ── Static data ───────────────────────────────────────────────────────────────
const TIME_OPTS = ['15 min','30 min','1 hr','2 hrs','4 hrs','8 hrs','1 day','2 days','3 days','5 days'];
const PRIORITY_VARIANT = { Critical: 'danger', High: 'warning', Medium: 'info', Low: 'neutral' };

const INITIAL_SLA = [
  { priority: 'Critical', response: '15 min', resolution: '1 hr'   },
  { priority: 'High',     response: '30 min', resolution: '4 hrs'  },
  { priority: 'Medium',   response: '2 hrs',  resolution: '1 day'  },
  { priority: 'Low',      response: '4 hrs',  resolution: '3 days' },
];

const INTEGRATIONS = {
  MDM: [
    { id: 'intune', name: 'Intune', subtitle: '847 managed devices',   connected: true  },
    { id: 'jamf',   name: 'Jamf',   subtitle: '213 managed devices',   connected: true  },
  ],
  'Knowledge Base': [
    { id: 'confluence', name: 'Confluence', subtitle: '2,140 articles synced', connected: true  },
    { id: 'notion',     name: 'Notion',     subtitle: '318 articles synced',   connected: false },
  ],
  HRIS: [
    { id: 'workday', name: 'Workday', subtitle: '847 employees', connected: false },
  ],
};

// One row per connected integration + scope (not per article)
const KB_SOURCES = [
  { id: 'confluence', tool: 'Confluence', space: 'IT Team Space',  articles: 142, syncedAt: 'Mar 2 · 8:00 AM', status: 'synced'  },
  { id: 'notion',     tool: 'Notion',     space: 'IT Runbooks',    articles:  38, syncedAt: 'Mar 1 · 2:15 PM', status: 'synced'  },
];

const PANEL_TITLES = {
  'queue-name':        'Queue name',
  'queue-description': 'Description',
  'inbound-email':     'Email channel',
  'inbound-slack':     'Slack channel',
  'business-hours':    'Business hours',
  'ai-guidance':       'AI guidance',
};

function trunc(str, n) {
  return str && str.length > n ? str.slice(0, n) + '…' : str;
}

// ── Integration logos ─────────────────────────────────────────────────────────
function IntegrationLogo({ id, size = 28 }) {
  if (id === 'intune') return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 5, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#0078D4" />
      <path d="M7 17V8l3.5 5 3.5-5v9M14 8h3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
  if (id === 'jamf') return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 5, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#53A7D6" />
      <path d="M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5zm0 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="white" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
  if (id === 'confluence') return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 5, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#1868DB" />
      <path d="M5 16.5c-.2.3-.5.9-.7 1.2-.2.45 0 .9.45 1.1l2.9 1.7c.45.2 1 .1 1.2-.35.2-.35.45-.8.8-1.25 2-3 4.3-2.7 6.4-.35l2.8 1.7c.45.2 1 .1 1.2-.35l1.6-2.8c.2-.45.1-1-.35-1.2l-2.9-1.7C15 12.9 10.3 12 5 16.5z" fill="white" opacity=".9" />
      <path d="M19 7.5c.2-.3.5-.9.7-1.2.2-.45 0-.9-.45-1.1L16.35 3.5c-.45-.2-1-.1-1.2.35-.2.35-.45.8-.8 1.25-2 3-4.3 2.7-6.4.35L5.15 3.5c-.45-.2-1-.1-1.2.35L2.35 6.65c-.2.45-.1 1 .35 1.2l2.9 1.7C9 11.1 13.7 12 19 7.5z" fill="white" />
    </svg>
  );
  if (id === 'notion') return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 5, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#1E1F21" />
      <path d="M7 6h7.5L19 9.75V18H7V6z" fill="white" />
      <path d="M14.5 6v3.75H19" stroke="#1E1F21" strokeWidth="1.2" fill="none" />
      <path d="M9.5 11.25h5M9.5 14.25h5" stroke="#9ea0a2" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
  if (id === 'workday') return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ borderRadius: 5, flexShrink: 0 }}>
      <rect width="24" height="24" rx="5" fill="#F7941D" />
      <path d="M5 15L8 8l3 5 3-5 3 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
  return null;
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)}
      style={{
        position: 'relative', width: 36, height: 20, borderRadius: 10,
        border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
        background: value ? 'var(--selected-background-strong)' : 'var(--background-strong)',
        transition: 'background 0.15s',
      }}>
      <span style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: 8, background: 'white', transition: 'left 0.15s', left: value ? 18 : 2 }} />
    </button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ title, description, children, action, noDivider }) {
  return (
    <div style={{ marginBottom: 40 }}>
      {/* Header with rule beneath */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 8, borderBottom: noDivider ? 'none' : '1px solid var(--border)' }}>
        <div>
          <p style={{ ...H5, margin: 0 }}>{title}</p>
          {description && (
            <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '2px 0 0', lineHeight: 1.4 }}>
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {/* Indented content */}
      <div style={{ paddingLeft: 16 }}>
        {children}
      </div>
    </div>
  );
}

// ── SettingRow — clickable, opens detail panel ─────────────────────────────────
function SettingRow({ id, label, description, value, selected, onSelect, last }) {
  return (
    <button type="button" onClick={() => onSelect(id)}
      style={{
        display: 'flex', alignItems: 'center', width: '100%',
        padding: '14px 0', paddingLeft: selected ? 10 : 0,
        gap: 16, textAlign: 'left', cursor: 'pointer',
        background: 'transparent', border: 'none',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        borderLeft: `2px solid ${selected ? 'var(--selected-background-strong)' : 'transparent'}`,
        transition: 'border-color 0.15s, padding 0.15s',
      }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...base, fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{label}</p>
        {description && (
          <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '2px 0 0', lineHeight: 1.4 }}>
            {description}
          </p>
        )}
      </div>
      {value && (
        <span style={{ ...base, fontSize: 13, color: 'var(--text-weak)', flexShrink: 0, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </span>
      )}
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none" style={{ flexShrink: 0, color: 'var(--text-weak)' }}>
        <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ── InlineRow — non-clickable with embedded controls ─────────────────────────
function InlineRow({ label, description, children, last, alignTop, indent, disabled }) {
  return (
    <div style={{
      display: 'flex', alignItems: alignTop ? 'flex-start' : 'center',
      padding: alignTop ? '13px 0' : '12px 0',
      paddingLeft: indent ? 20 : 0,
      gap: 16,
      borderBottom: last ? 'none' : '1px solid var(--border)',
      opacity: disabled ? 0.38 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      transition: 'opacity 0.2s',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ ...base, fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{label}</p>
        {description && (
          <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '2px 0 0', lineHeight: 1.45 }}>
            {description}
          </p>
        )}
      </div>
      {children && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: alignTop ? 'flex-start' : 'center', gap: 6 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── PanelField — label + control in detail panel ──────────────────────────────
function PanelField({ label, description, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '0 0 4px' }}>{label}</p>
      {description && (
        <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '0 0 8px', lineHeight: 1.45, opacity: 0.75 }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ settingId, values, draft, setDraft, onSave, onCancel }) {
  if (!settingId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" style={{ color: 'var(--text-weak)', opacity: 0.3 }}>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 8h10M7 12h7M7 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p style={{ ...base, fontSize: 13, color: 'var(--text-weak)', margin: 0, opacity: 0.5 }}>
          Select a setting to edit
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexShrink: 0 }}>
        <span style={{ ...H5 }}>{PANEL_TITLES[settingId]}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={onSave}>Save</Button>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1 }}>
        {settingId === 'queue-name' && (
          <PanelField label="Name" description="Shown in the portal and all outbound emails">
            <input value={draft.queueName ?? ''} onChange={e => setDraft(d => ({ ...d, queueName: e.target.value }))}
              style={{ ...inputStyle, width: '100%' }} autoFocus />
          </PanelField>
        )}

        {settingId === 'queue-description' && (
          <PanelField label="Description" description="Shown to employees on the request portal">
            <input value={draft.queueDesc ?? ''} onChange={e => setDraft(d => ({ ...d, queueDesc: e.target.value }))}
              style={{ ...inputStyle, width: '100%' }} autoFocus />
          </PanelField>
        )}

        {settingId === 'inbound-email' && (
          <PanelField label="Email address" description="Emails to this address automatically open a ticket">
            <input value={draft.email ?? ''} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
              style={{ ...inputStyle, width: '100%' }} autoFocus />
          </PanelField>
        )}

        {settingId === 'inbound-slack' && (
          <PanelField label="Slack channel" description="Messages in this channel automatically open a ticket">
            <input value={draft.slack ?? ''} onChange={e => setDraft(d => ({ ...d, slack: e.target.value }))}
              style={{ ...inputStyle, width: '100%' }} autoFocus />
          </PanelField>
        )}

        {settingId === 'business-hours' && (
          <>
            <PanelField label="Days">
              <Dropdown value={draft.dayRange} onChange={v => setDraft(d => ({ ...d, dayRange: v }))}
                options={['Mon–Fri', 'Mon–Sat', 'Every day']} />
            </PanelField>
            <PanelField label="Hours">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <Dropdown value={draft.startTime} onChange={v => setDraft(d => ({ ...d, startTime: v }))}
                    options={['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM']} />
                </div>
                <span style={{ ...base, fontSize: 13, color: 'var(--text-weak)' }}>–</span>
                <div style={{ flex: 1 }}>
                  <Dropdown value={draft.endTime} onChange={v => setDraft(d => ({ ...d, endTime: v }))}
                    options={['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']} />
                </div>
              </div>
            </PanelField>
          </>
        )}

        {settingId === 'ai-guidance' && (
          <PanelField label="Instructions" description="Guides how AI triages, classifies, and responds to tickets in this queue">
            <textarea rows={8} value={draft.aiGuidance ?? ''}
              onChange={e => setDraft(d => ({ ...d, aiGuidance: e.target.value }))}
              style={{ ...inputStyle, width: '100%', height: 'auto', padding: '8px 10px', resize: 'vertical', lineHeight: 1.55 }}
              autoFocus />
          </PanelField>
        )}
      </div>
    </div>
  );
}

// ── General Tab ───────────────────────────────────────────────────────────────
function GeneralTab({ values, selectedSetting, onOpen }) {
  const [categories,    setCategories]    = useState(['Access Management', 'Hardware', 'Software', 'Network']);
  const [autoClose,     setAutoClose]     = useState(7);
  const [surveyOnClose, setSurveyOnClose] = useState(true);

  return (
    <div>
      <Section title="Queue" description="How this queue is identified in the portal and emails">
        <SettingRow id="queue-name" label="Name" description="Shown in portal and outbound emails"
          value={values.queueName} selected={selectedSetting === 'queue-name'} onSelect={onOpen} />
        <SettingRow id="queue-description" label="Description" description="Shown to employees on the request portal"
          value={trunc(values.queueDesc, 40)} selected={selectedSetting === 'queue-description'} onSelect={onOpen} last />
      </Section>

      <Section title="Inbound" description="Channels where employees submit new requests">
        <SettingRow id="inbound-email" label="Email" description="Emails automatically open a ticket"
          value={values.email} selected={selectedSetting === 'inbound-email'} onSelect={onOpen} />
        <SettingRow id="inbound-slack" label="Slack" description="Messages automatically open a ticket"
          value={values.slack} selected={selectedSetting === 'inbound-slack'} onSelect={onOpen} last />
      </Section>

      <Section title="Schedule" description="When the queue is active and SLAs are tracked">
        <SettingRow id="business-hours" label="Business hours" description="Tickets outside these hours are queued until the next business day"
          value={`${values.dayRange} · ${values.startTime} – ${values.endTime}`}
          selected={selectedSetting === 'business-hours'} onSelect={onOpen} last />
      </Section>

      <Section title="Categories" description="Tags used to route tickets and filter reports">
        <InlineRow label="Queue tags" description="Used to route tickets, apply automations, and filter reports" last>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {categories.map(cat => (
              <div key={cat} className="group"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'var(--background-medium)', color: 'var(--text)', fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 999, fontFamily: SFT, ...LIGA }}>
                {cat}
                <button type="button" onClick={() => setCategories(p => p.filter(c => c !== cat))}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', fontSize: 13, padding: '0 0 0 2px', lineHeight: 1 }}>×</button>
              </div>
            ))}
            <button type="button" style={{ fontSize: 12, fontWeight: 500, padding: '3px 9px', borderRadius: 999, fontFamily: SFT, ...LIGA, border: '1px dashed var(--border-strong)', color: 'var(--text-weak)', background: 'transparent', cursor: 'pointer' }}>
              + Add
            </button>
          </div>
        </InlineRow>
      </Section>

      <Section title="SLA" description="Response and resolution time targets by priority level">
        {/* Column headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--background-weak)' }}>
          <div style={{ width: 240, flexShrink: 0, ...base, fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', padding: '8px 12px', borderRight: '1px solid var(--border)' }}>Priority</div>
          <div style={{ width: 240, flexShrink: 0, ...base, fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', padding: '8px 12px', borderRight: '1px solid var(--border)' }}>First response</div>
          <div style={{ width: 240, flexShrink: 0, ...base, fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', padding: '8px 12px' }}>Resolution time</div>
        </div>
        {/* Rows */}
        {INITIAL_SLA.map((row, i) => (
          <div key={row.priority} style={{ display: 'flex', alignItems: 'center', borderBottom: i < INITIAL_SLA.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 240, flexShrink: 0, padding: '10px 12px', borderRight: '1px solid var(--border)' }}>
              <Badge variant={PRIORITY_VARIANT[row.priority]} size="sm">{row.priority}</Badge>
            </div>
            <div style={{ width: 240, flexShrink: 0, padding: '10px 12px', borderRight: '1px solid var(--border)' }}>
              <select defaultValue={row.response} style={{ ...inputStyle, height: 28, width: 'auto' }}>
                {TIME_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ width: 240, flexShrink: 0, padding: '10px 12px' }}>
              <select defaultValue={row.resolution} style={{ ...inputStyle, height: 28, width: 'auto' }}>
                {TIME_OPTS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Lifecycle" description="Automated ticket state transitions">
        <InlineRow label="Auto-close resolved tickets after" description="Tickets in Resolved status for this many days are closed automatically">
          <input type="number" value={autoClose} onChange={e => setAutoClose(e.target.value)}
            style={{ ...inputStyle, width: 52, textAlign: 'right' }} />
          <span style={{ ...base, fontSize: 13, color: 'var(--text-weak)' }}>days</span>
        </InlineRow>
        <InlineRow label="Satisfaction survey on close" description="Send a one-question CSAT survey when a ticket is marked resolved" last>
          <Toggle value={surveyOnClose} onChange={setSurveyOnClose} />
        </InlineRow>
      </Section>
    </div>
  );
}

// ── Integrations Tab ──────────────────────────────────────────────────────────
function IntegrationsTab() {
  return (
    <div>
      {Object.entries(INTEGRATIONS).map(([category, items]) => (
        <Section key={category} title={category}>
          {items.map((int, i) => (
            <div key={int.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <IntegrationLogo id={int.id} size={28} />
              <div style={{ flex: 1 }}>
                <p style={{ ...base, fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{int.name}</p>
                <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '2px 0 0' }}>{int.subtitle}</p>
              </div>
              <span style={{ ...base, fontSize: 12, color: int.connected ? 'var(--success-text)' : 'var(--text-weak)', marginRight: 8 }}>
                {int.connected ? '● Connected' : '○ Not connected'}
              </span>
              <Button variant={int.connected ? 'outline' : 'primary'} size="sm">
                {int.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </Section>
      ))}
      <Button variant="ghost" size="sm">+ Connect integration</Button>
    </div>
  );
}

// ── Knowledge Base Tab ────────────────────────────────────────────────────────
function KnowledgeBaseTab() {
  const [learnings, setLearnings] = useState(true);
  const [sources, setSources] = useState(KB_SOURCES);

  return (
    <div>
      <Section
        title="Sources"
        description="Which content from connected integrations feeds this queue's knowledge base"
      >
        {sources.map((src, i) => (
          <div key={src.id} className="group" style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '12px 0',
            borderBottom: i < sources.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            {/* Logo + name + space */}
            <IntegrationLogo id={src.id} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ ...base, fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{src.tool}</p>
              <p style={{ ...base, fontSize: 12, color: 'var(--text-weak)', margin: '1px 0 0' }}>{src.space}</p>
            </div>
            {/* Sync status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-text)', flexShrink: 0 }} />
              <span style={{ ...base, fontSize: 12, color: 'var(--text-weak)' }}>Synced {src.syncedAt}</span>
            </div>
            {/* Article count */}
            <span style={{ ...base, fontSize: 12, color: 'var(--text-weak)', flexShrink: 0 }}>
              {src.articles} articles
            </span>
            {/* Actions */}
            <Button variant="outline" size="sm">Manage</Button>
            <Button
              variant="ghost" size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setSources(s => s.filter(x => x.id !== src.id))}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path d="M3 4h10M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M13 4l-.8 8.5a1 1 0 0 1-1 .5H4.8a1 1 0 0 1-1-.5L3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </Button>
          </div>
        ))}

        <div style={{ paddingTop: sources.length > 0 ? 8 : 0 }}>
          <span style={{ ...base, fontSize: 12, color: 'var(--text-disabled)' }}>
            Connections managed in
            <button type="button" style={{ ...base, fontSize: 12, color: 'var(--selected-text)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 3px' }}>
              Integrations
            </button>
          </span>
        </div>
      </Section>

      <Section title="Learnings" description="AI monitors resolved tickets and flags knowledge gaps">
        <InlineRow label="Enable learnings" description="AI detects missing or outdated documentation and surfaces gaps in the Knowledge Base">
          <Toggle value={learnings} onChange={setLearnings} />
        </InlineRow>
        <InlineRow label="Notification frequency" description="How often to surface new learnings in the Knowledge Base" indent disabled={!learnings} last>
          <select defaultValue="Daily" style={{ ...inputStyle, height: 28, width: 'auto' }}>
            {['Real-time', 'Daily', 'Weekly'].map(o => <option key={o}>{o}</option>)}
          </select>
        </InlineRow>
      </Section>
    </div>
  );
}

// ── Automations Tab ───────────────────────────────────────────────────────────

const SETTINGS_AUTOMATIONS = [
  { id: 'w1',  section: 'it',    title: 'Auto-assign IT Tickets by Category', subtitle: 'Auto-routing',     enabled: true  },
  { id: 'w3',  section: 'it',    title: 'SLA Breach Auto-escalation',         subtitle: 'SLA management',   enabled: true  },
  { id: 'w5',  section: 'it',    title: 'Password Reset Self-Service',        subtitle: 'Access control',   enabled: true  },
  { id: 'w4',  section: 'it',    title: 'Software License Request & Approval',subtitle: 'Access control',   enabled: false },
  { id: 'w6',  section: 'it',    title: 'Hardware Request Fulfillment',       subtitle: 'Hardware',         enabled: false },
  { id: 'w7',  section: 'it',    title: 'Duplicate Ticket Detection & Merge', subtitle: 'Queue management', enabled: false },
  { id: 'w12', section: 'it',    title: 'Auto-close Inactive Resolved Tickets',subtitle:'Queue management', enabled: false },
  { id: 'w2',  section: 'cross', title: 'New Hire Cross-team Onboarding',     subtitle: 'Onboarding',       enabled: true  },
  { id: 'w8',  section: 'cross', title: 'Payroll Issue Auto-route to HR',     subtitle: 'Payroll',          enabled: true  },
  { id: 'w11', section: 'cross', title: 'CSAT Survey on Ticket Close',        subtitle: 'Feedback',         enabled: false },
];

function AutomationsTab() {
  const navigate = useNavigate();
  const [enabledState, setEnabledState] = useState(
    Object.fromEntries(SETTINGS_AUTOMATIONS.map(a => [a.id, a.enabled]))
  );

  const itList    = SETTINGS_AUTOMATIONS.filter(a => a.section === 'it');
  const crossList = SETTINGS_AUTOMATIONS.filter(a => a.section === 'cross');

  function renderRow(auto, isLast) {
    return (
      <InlineRow key={auto.id} label={auto.title} last={isLast}>
        <span style={{
          ...base, fontSize: 11, color: 'var(--text-disabled)',
          padding: '2px 7px', borderRadius: 4, background: 'var(--background-medium)',
          whiteSpace: 'nowrap',
        }}>
          {auto.subtitle}
        </span>
        <Toggle value={enabledState[auto.id]} onChange={v => setEnabledState(p => ({ ...p, [auto.id]: v }))} />
      </InlineRow>
    );
  }

  return (
    <div>
      <Section title="IT Queue" description="Automations active for the IT Tickets queue">
        {itList.map((auto, i) => renderRow(auto, i === itList.length - 1))}
      </Section>
      <Section title="Cross-team" description="Workflows that span multiple queues">
        {crossList.map((auto, i) => renderRow(auto, i === crossList.length - 1))}
      </Section>
      <button
        type="button"
        onClick={() => navigate('/automations')}
        style={{ ...base, fontSize: 13, color: 'var(--selected-text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
      >
        View all automations
      </button>
    </div>
  );
}

// ── AI Tab ────────────────────────────────────────────────────────────────────
function AITab({ values, selectedSetting, onOpen }) {
  const [autoClassify, setAutoClassify] = useState(true);
  const [threshold,    setThreshold]    = useState(85);

  return (
    <div>
      <Section title="Classification" description="How AI handles incoming ticket triage">
        <InlineRow label="Auto-classify incoming tickets" description="AI assigns category and priority when a ticket arrives">
          <Toggle value={autoClassify} onChange={setAutoClassify} />
        </InlineRow>
        <InlineRow label="Confidence threshold" description="Only auto-assign when AI confidence meets or exceeds this level"
          indent disabled={!autoClassify} last>
          <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)}
            style={{ ...inputStyle, width: 52, textAlign: 'right' }} />
          <span style={{ ...base, fontSize: 13, color: 'var(--text-weak)' }}>%</span>
        </InlineRow>
      </Section>

      <Section title="Instructions" description="Custom guidance for how AI triages and responds in this queue">
        <SettingRow id="ai-guidance" label="AI guidance" description="Routing rules, escalation logic, and tone instructions"
          value={trunc(values.aiGuidance, 48)} selected={selectedSetting === 'ai-guidance'} onSelect={onOpen} last />
      </Section>
    </div>
  );
}

// ── SettingsView ──────────────────────────────────────────────────────────────
export default function SettingsView() {
  const [tab, setTab] = useState('general');

  // Committed values shown in the list
  const [values, setValues] = useState({
    queueName:  'IT Tickets',
    queueDesc:  'IT support for hardware, software, and network issues',
    email:      'it-help@acme.com',
    slack:      '#it-help',
    dayRange:   'Mon–Fri',
    startTime:  '9:00 AM',
    endTime:    '6:00 PM',
    aiGuidance: 'Always escalate hardware issues to on-site team if unresolved after 2 hrs. Route Salesforce tickets to Sales Eng.',
  });

  // In-flight edits while panel is open
  const [draft,           setDraft]           = useState(null);
  const [selectedSetting, setSelectedSetting] = useState(null);

  function openSetting(id) {
    setDraft({ ...values });
    setSelectedSetting(id);
  }

  function save() {
    setValues({ ...draft });
    setSelectedSetting(null);
    setDraft(null);
  }

  function cancel() {
    setSelectedSetting(null);
    setDraft(null);
  }

  function switchTab(id) {
    setTab(id);
    setSelectedSetting(null);
    setDraft(null);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div style={{ padding: '32px 40px 0', flexShrink: 0 }}>
        <p style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: '#1E1F21', margin: '0 0 24px' }}>Settings</p>

        {/* Tab bar */}
        <div className="flex border-b border-border">
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => switchTab(t.id)}
              className={[
                'px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.id ? 'text-text shadow-[inset_0_-2px_0_var(--text)]' : 'text-text-weak hover:text-text',
              ].join(' ')}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: scrollable setting list — full width when panel closed, 55% when open */}
        <div style={{
          flex: selectedSetting ? '0 0 55%' : '1 1 100%',
          overflowY: 'auto', padding: '28px 40px 48px',
          borderRight: selectedSetting ? '1px solid var(--border)' : 'none',
          transition: 'flex 0.2s ease',
        }}>
          {tab === 'general'      && <GeneralTab      values={values} selectedSetting={selectedSetting} onOpen={openSetting} />}
          {tab === 'integrations' && <IntegrationsTab />}
          {tab === 'kb'           && <KnowledgeBaseTab />}
          {tab === 'ai'           && <AITab            values={values} selectedSetting={selectedSetting} onOpen={openSetting} />}
          {tab === 'automations'  && <AutomationsTab />}
        </div>

        {/* Right: detail panel — hidden until a row is selected */}
        {selectedSetting && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <DetailPanel
              settingId={selectedSetting}
              values={values}
              draft={draft}
              setDraft={setDraft}
              onSave={save}
              onCancel={cancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
