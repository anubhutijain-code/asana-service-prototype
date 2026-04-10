import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SFT, SFD, LIGA } from '../constants/typography';

// ─── Vendor onboarding project data ───────────────────────────────────────────

export const VENDOR_PROJECT_NAME = 'Acme Corp — Vendor Onboarding';

export const VENDOR_SECTIONS = [
  {
    id: 'procurement',
    label: 'Procurement',
    color: '#F1BD6C',
    tasks: [
      { id: 'VO-001', name: 'Review and sign Master Service Agreement', assignee: { name: 'Jordan Kim',  bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 5',  status: 'Not started', priority: 'High'   },
      { id: 'VO-002', name: 'Confirm budget approval and purchase order', assignee: { name: 'Jordan Kim',  bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 6',  status: 'Not started', priority: 'Medium' },
      { id: 'VO-003', name: 'Add Acme Corp to vendor registry',           assignee: { name: 'Jordan Kim',  bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 7',  status: 'Not started', priority: 'Low'    },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    color: '#8D84E8',
    tasks: [
      { id: 'VO-004', name: 'Legal review of MSA and liability terms',       assignee: { name: 'Legal Team', bg: '#8D84E8' }, dept: 'Legal', dueDate: 'Mar 8',  status: 'Not started', priority: 'High'   },
      { id: 'VO-005', name: 'Review Data Processing Agreement (DPA)',         assignee: { name: 'Legal Team', bg: '#8D84E8' }, dept: 'Legal', dueDate: 'Mar 10', status: 'Not started', priority: 'Medium' },
    ],
  },
  {
    id: 'it-setup',
    label: 'IT Setup',
    color: '#4573D2',
    tasks: [
      { id: 'VO-006', name: 'Provision SSO and Okta application for Acme Corp', assignee: { name: 'IT Ops',   bg: '#4573D2' }, dept: 'IT',       dueDate: 'Mar 12', status: 'Not started', priority: 'High'   },
      { id: 'VO-007', name: 'Configure SAML integration',                        assignee: { name: 'IT Ops',   bg: '#4573D2' }, dept: 'IT',       dueDate: 'Mar 13', status: 'Not started', priority: 'Medium' },
      { id: 'VO-008', name: 'Security review and vendor risk assessment',         assignee: { name: 'InfoSec',  bg: '#F06A6A' }, dept: 'Security', dueDate: 'Mar 14', status: 'High',        priority: 'High'   },
      { id: 'VO-009', name: 'Confirm access granted and close TICKET-101',        assignee: { name: 'Jordan Kim', bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 15', status: 'Not started', priority: 'Medium' },
    ],
  },
];

const OTHER_TEMPLATES = [
  { name: 'Employee Onboarding',   match: 41, icon: '👤', desc: 'Structured onboarding for new hires across IT, HR, and Facilities' },
  { name: 'Incident Response',     match: 28, icon: '🚨', desc: 'Containment, investigation, and comms for security or service incidents' },
  { name: 'IT Project Plan',       match: 22, icon: '🗂️',  desc: 'General IT project with phases, milestones, and stakeholder sign-offs' },
];

const STATUS_STYLE = {
  'Not started': { bg: 'var(--background-strong)',  color: 'var(--text-disabled)' },
  'In progress':  { bg: 'var(--selected-background)', color: 'var(--selected-text)' },
  'Blocked':      { bg: 'var(--danger-background)',   color: 'var(--danger-text)'   },
  'High':         { bg: 'var(--priority-high-bg)',    color: 'var(--priority-high-text)' },
};
const PRIORITY_STYLE = {
  High:   { bg: 'var(--priority-high-bg)',   color: 'var(--priority-high-text)'   },
  Medium: { bg: 'var(--priority-medium-bg)', color: 'var(--priority-medium-text)' },
  Low:    { bg: 'var(--priority-low-bg)',    color: 'var(--priority-low-text)'    },
};

// ─── Shared micro-components ───────────────────────────────────────────────────

function Avi({ name, bg, size = 22 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.42, fontWeight: 600, fontFamily: SFT, flexShrink: 0, letterSpacing: 0 }}>
      {initials}
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" viewBox="0 0 14 14" width="18" height="18" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5" stroke="var(--border-strong)" strokeWidth="2" fill="none" />
      <path d="M7 2A5 5 0 0 1 12 7" stroke="var(--selected-background-strong)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CheckCircle({ size = 20 }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M6 10l3 3 5-5" />
    </svg>
  );
}

// ─── Step 0: Template gallery ──────────────────────────────────────────────────

function TemplateGallery({ ticket, onUseTemplate, onClose }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>

      {/* Left panel */}
      <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ flexShrink: 0, padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="button" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', fontSize: 13, fontFamily: SFT, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-weak)'}>
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 2L4 7l5 5"/></svg>
            Back to ticket
          </button>
          <button type="button" onClick={onClose} style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: 'var(--text-disabled)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-disabled)'; }}>
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
          </button>
        </div>

        {/* Scrollable left body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>

          {/* Asana logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <circle cx="12" cy="7" r="4" fill="#F06A6A"/>
              <circle cx="6" cy="17" r="4" fill="#F06A6A"/>
              <circle cx="18" cy="17" r="4" fill="#F06A6A"/>
            </svg>
            <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>Created by Asana</span>
          </div>

          {/* AI match badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: '#EEF4FF', border: '1px solid #C7D9FF', marginBottom: 14 }}>
            <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="#4573D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 1l1.2 3.5H11L8.2 6.6l1 3.4L6 8l-3.2 2 1-3.4L1 4.5h3.8z"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#4573D2', fontFamily: SFT }}>AI selected · 97% match</span>
          </div>

          {/* Template title */}
          <h1 style={{ fontFamily: SFD, fontSize: 28, fontWeight: 500, color: 'var(--text)', margin: '0 0 10px', lineHeight: '34px', letterSpacing: '0.2px' }}>
            Vendor Onboarding
          </h1>

          <p style={{ fontFamily: SFT, fontSize: 14, color: 'var(--text-weak)', margin: '0 0 20px', lineHeight: '20px' }}>
            Coordinate procurement, legal, and IT to onboard a new vendor on time and within compliance.
          </p>

          {/* Source ticket pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: 'var(--background-medium)', border: '1px solid var(--border)', marginBottom: 24 }}>
            <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="var(--text-disabled)" strokeWidth="1.4" strokeLinecap="round"><rect x="1" y="1" width="10" height="10" rx="1.5"/><path d="M3 4h6M3 6.5h6M3 9h4"/></svg>
            <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT }}>From {ticket.id}: {ticket.name}</span>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {[
              { icon: '📋', text: 'AI pre-filled tasks from ticket context' },
              { icon: '👥', text: 'Assignees mapped to Procurement, Legal, IT' },
              { icon: '📅', text: 'Due dates calculated from target go-live (Mar 15)' },
              { icon: '🔗', text: 'Linked to this ticket as origin record' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-weak)', fontFamily: SFT, lineHeight: '20px' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Use template CTA */}
          <button type="button" onClick={onUseTemplate}
            style={{ width: '100%', height: 42, borderRadius: 8, border: 'none', cursor: 'pointer', background: '#4573D2', color: 'white', fontSize: 14, fontFamily: SFT, fontWeight: 600, letterSpacing: '0.1px', transition: 'opacity 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Use template
          </button>

          {/* Other templates */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)', fontFamily: SFT, marginBottom: 10, letterSpacing: '0.04em' }}>OTHER TEMPLATES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {OTHER_TEMPLATES.map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--background-weak)', opacity: 0.55 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontFamily: SFT }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-disabled)', fontFamily: SFT, flexShrink: 0 }}>{t.match}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — abstract template preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F4F6F8', overflow: 'hidden' }}>

        {/* Mock toolbar strip */}
        <div style={{ flexShrink: 0, height: 40, borderBottom: '1px solid #E1E5EA', background: '#FAFBFC', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
          {['List', 'Board', 'Timeline', 'Calendar'].map((tab, i) => (
            <div key={tab} style={{ height: 28, display: 'flex', alignItems: 'center', borderBottom: i === 0 ? '2px solid #4573D2' : 'none', paddingBottom: i === 0 ? 0 : 0 }}>
              <div style={{ width: 28 + tab.length * 5, height: 8, borderRadius: 4, background: i === 0 ? '#4573D2' : '#D4D8DD', opacity: i === 0 ? 1 : 0.7 }} />
            </div>
          ))}
        </div>

        {/* Mock column headers */}
        <div style={{ flexShrink: 0, height: 32, borderBottom: '1px solid #E1E5EA', background: '#FAFBFC', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 0 }}>
          <div style={{ flex: 1, height: 7, borderRadius: 3, background: '#D4D8DD', maxWidth: 160, opacity: 0.6 }} />
          {[48, 40, 52, 36].map((w, i) => (
            <div key={i} style={{ width: w + 20, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: w, height: 7, borderRadius: 3, background: '#D4D8DD', opacity: 0.5 }} />
            </div>
          ))}
        </div>

        {/* Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {VENDOR_SECTIONS.map((sec, si) => (
            <div key={sec.id} style={{ marginBottom: 6 }}>
              {/* Section label row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: sec.color, flexShrink: 0 }} />
                <div style={{ width: 60 + si * 12, height: 8, borderRadius: 4, background: sec.color, opacity: 0.55 }} />
                <div style={{ width: 14, height: 14, borderRadius: 3, background: sec.color, opacity: 0.22, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sec.color, fontWeight: 700 }}>{sec.tasks.length}</div>
              </div>
              {/* Abstract task rows */}
              {sec.tasks.map((task, ti) => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 20px', borderBottom: '1px solid #E8ECF0' }}>
                  {/* Checkbox */}
                  <div style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${sec.color}`, opacity: 0.5, flexShrink: 0 }} />
                  {/* Task name bar — varying widths */}
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#CDD2D9', opacity: 0.55, maxWidth: [200, 170, 220, 150, 190, 180, 210, 160][ti % 8] }} />
                  {/* Avatar circle */}
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: task.assignee.bg, opacity: 0.45, flexShrink: 0 }} />
                  {/* Date pill */}
                  <div style={{ width: 30, height: 7, borderRadius: 3, background: '#CDD2D9', opacity: 0.45, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: AI analyzing ──────────────────────────────────────────────────────

function AnalyzingStep({ onDone }) {
  const [phase, setPhase] = useState(0);
  const PHASES = ['Reading ticket context…', 'Matching to template library…', 'Pre-filling tasks and assignees…'];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1300),
      setTimeout(() => { onDone(); }, 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24, padding: 40 }}>
      <SpinnerIcon />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {PHASES.map((p, i) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: i <= phase ? 1 : 0.25, transition: 'opacity 0.4s' }}>
            {i < phase
              ? <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5"/></svg>
              : i === phase
              ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--selected-background-strong)', flexShrink: 0 }} />
              : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--background-strong)', flexShrink: 0 }} />
            }
            <span style={{ fontSize: 14, fontFamily: SFT, color: i <= phase ? 'var(--text)' : 'var(--text-disabled)' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Review draft ──────────────────────────────────────────────────────

const REVIEW_CW = { assignee: 140, dept: 110, dueDate: 90, status: 110, priority: 90 };
const COL_BASE = { fontFamily: SFT, fontSize: 12, fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA, whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center' };

function ReviewSection({ sec }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', height: 46, padding: '0 24px', background: 'var(--background-weak)' }}>
        <button type="button" onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0', display: 'flex', alignItems: 'center', color: 'var(--icon)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.12s' }}>
            <path d="M10.249 4H1.74904C1.55016 4.00002 1.35351 4.02936 1.27131 4.0843C1.1891 4.13924 1.12504 4.21732 1.0872 4.30867C1.04936 4.40002 1.03946 4.50054 1.05875 4.59752C1.07803 4.69449 1.12563 4.78357 1.19554 4.8535L5.44554 9.1035C5.49187 9.15009 5.54695 9.18707 5.60761 9.2123C5.66828 9.23753 5.73334 9.25052 5.79904 9.25052C5.86474 9.25052 5.9298 9.23753 5.99047 9.2123C6.05113 9.18707 6.10621 9.15009 6.15254 9.1035L10.4025 4.8535C10.4724 4.78357 10.52 4.69449 10.5393 4.59752C10.5586 4.50054 10.5487 4.40002 10.5109 4.30867C10.473 4.21732 10.409 4.13924 10.3268 4.0843C10.2446 4.02936 10.1479 4.00002 10.049 4H10.249Z" fill="currentColor"/>
          </svg>
        </button>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: sec.color, flexShrink: 0, marginRight: 8 }} />
        <span style={{ fontFamily: SFT, fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{sec.label}</span>
        <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>{sec.tasks.length}</span>
      </div>
      <div style={{ marginLeft: 24, marginRight: 24, height: 1, background: 'var(--border)' }} />

      {open && sec.tasks.map(task => (
        <ReviewTaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}

function ReviewTaskRow({ task }) {
  const [hov, setHov] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const ps = PRIORITY_STYLE[task.priority] ?? {};
  const ss = STATUS_STYLE[task.status] ?? {};

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'stretch', height: 40, background: hov ? 'var(--background-medium)' : 'var(--background-weak)', transition: 'background 0.08s', paddingLeft: 48, paddingRight: 24 }}
    >
      {/* Checkbox */}
      <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid var(--border-strong)', flexShrink: 0 }} />
      </div>

      {/* Name — inline editable */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setEditing(false)}
            style={{ flex: 1, height: 26, padding: '0 6px', fontSize: 13, fontFamily: SFT, border: '1px solid var(--selected-background-strong)', borderRadius: 4, outline: 'none', color: 'var(--text)', background: 'var(--surface)' }}
          />
        ) : (
          <span
            onClick={() => setEditing(true)}
            style={{ fontSize: 13, fontFamily: SFT, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'text', flex: 1, ...LIGA }}
            title="Click to edit"
          >
            {name}
          </span>
        )}
      </div>

      {/* Assignee */}
      <div style={{ width: REVIEW_CW.assignee, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Avi name={task.assignee.name} bg={task.assignee.bg} size={20} />
        <span style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...LIGA }}>
          {task.assignee.name.split(' ')[0]}
        </span>
      </div>

      {/* Dept */}
      <div style={{ width: REVIEW_CW.dept, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text-weak)', ...LIGA }}>{task.dept}</span>
      </div>

      {/* Due date */}
      <div style={{ width: REVIEW_CW.dueDate, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text-weak)', ...LIGA }}>{task.dueDate}</span>
      </div>

      {/* Status */}
      <div style={{ width: REVIEW_CW.status, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 8px', borderRadius: 4, background: ss.bg, color: ss.color, whiteSpace: 'nowrap', ...LIGA }}>
          {task.status}
        </span>
      </div>

      {/* Priority */}
      <div style={{ width: REVIEW_CW.priority, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 8px', borderRadius: 4, background: ps.bg, color: ps.color, whiteSpace: 'nowrap', ...LIGA }}>
          {task.priority}
        </span>
      </div>
    </div>
  );
}

function ReviewDraft({ ticket, onLaunch, onBack }) {
  const [projectName, setProjectName] = useState(VENDOR_PROJECT_NAME);
  const [editingName, setEditingName] = useState(false);
  const [launching, setLaunching] = useState(false);

  function handleLaunch() {
    setLaunching(true);
    setTimeout(() => onLaunch(), 1200);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Project header (mimics ITEscalationsProject) */}
      <div style={{ flexShrink: 0, padding: '14px 24px 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-disabled)', fontSize: 12, fontFamily: SFT }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-weak)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-disabled)'}>
            <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M7 2L3 5l4 4"/></svg>
            Back to template
          </button>
          <span style={{ color: 'var(--border-strong)', fontSize: 12 }}>›</span>
          <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>Draft review</span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#5a8f6b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.5 2C11.3285 2 12 2.67158 12 3.5V8.5C12 9.32845 11.3285 10 10.5 10H1.5C0.671575 10 0 9.32845 0 8.5V0.5C0 0.22386 0.223857 0 0.5 0H4.8L5.85435 1.75725C5.9447 1.90785 6.10745 2 6.2831 2H10.5ZM11 3.5V8.5C11 8.77615 10.7761 9 10.5 9H1.5C1.22386 9 1 8.77615 1 8.5V3H10.5C10.7761 3 11 3.22386 11 3.5ZM4.83381 2L4.23381 1H1V2H4.83381Z" fill="white"/>
              </svg>
            </div>
            {editingName ? (
              <input autoFocus value={projectName} onChange={e => setProjectName(e.target.value)}
                onBlur={() => setEditingName(false)} onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                style={{ height: 32, padding: '0 8px', fontSize: 18, fontFamily: SFD, fontWeight: 500, border: '1px solid var(--selected-background-strong)', borderRadius: 6, outline: 'none', color: 'var(--text)', background: 'var(--surface)', minWidth: 280 }}
              />
            ) : (
              <h2 onClick={() => setEditingName(true)} title="Click to rename" style={{ fontFamily: SFD, fontSize: 18, fontWeight: 500, color: 'var(--text)', letterSpacing: '0.2px', lineHeight: '28px', margin: 0, cursor: 'text', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>
                {projectName}
              </h2>
            )}
            {/* Source ticket pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: 'var(--background-medium)', border: '1px solid var(--border)', flexShrink: 0 }}>
              <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="var(--text-disabled)" strokeWidth="1.4" strokeLinecap="round"><rect x="1" y="1" width="8" height="8" rx="1"/><path d="M3 3.5h4M3 5h4M3 6.5h2.5"/></svg>
              <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, whiteSpace: 'nowrap' }}>from {ticket.id}</span>
            </div>
            {/* AI badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, background: '#EEF4FF', flexShrink: 0 }}>
              <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="#4573D2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 1l1 2.8H9L6.5 5.5l.8 2.8L5 6.5l-2.3 1.8.8-2.8L1 3.8h3z"/>
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4573D2', fontFamily: SFT }}>AI pre-filled</span>
            </div>
          </div>

          {/* Launch button */}
          <button type="button" onClick={handleLaunch} disabled={launching}
            style={{ height: 34, padding: '0 18px', borderRadius: 7, border: 'none', cursor: launching ? 'default' : 'pointer', background: launching ? 'var(--background-strong)' : '#4573D2', color: launching ? 'var(--text-disabled)' : 'white', fontSize: 13, fontFamily: SFT, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, transition: 'all 0.15s' }}>
            {launching
              ? <><SpinnerIcon /> Creating project…</>
              : <><svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg> Launch project</>
            }
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0 }}>
          {['List', 'Board', 'Timeline', 'Dashboard'].map((tab, i) => (
            <button key={tab} type="button"
              style={{ padding: '8px 14px 9px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontFamily: SFT, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--text)' : 'var(--text-weak)', borderBottom: i === 0 ? '2px solid var(--text)' : '2px solid transparent', marginBottom: -1, transition: 'color 0.1s' }}
              onMouseEnter={e => { if (i !== 0) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (i !== 0) e.currentTarget.style.color = 'var(--text-weak)'; }}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Column header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'stretch', paddingLeft: 24, paddingRight: 24, background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 2, borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...COL_BASE, flex: 1, padding: '8px 8px 8px 24px' }}>Task name</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.assignee, padding: '8px', borderLeft: '1px solid var(--border)' }}>Assignee</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.dept,     padding: '8px', borderLeft: '1px solid var(--border)' }}>Department</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.dueDate,  padding: '8px', borderLeft: '1px solid var(--border)' }}>Due date</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.status,   padding: '8px', borderLeft: '1px solid var(--border)' }}>Status</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.priority, padding: '8px', borderLeft: '1px solid var(--border)' }}>Priority</div>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--background-weak)' }}>
        {VENDOR_SECTIONS.map(sec => <ReviewSection key={sec.id} sec={sec} />)}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function ConvertToProjectPanel({ ticket, onClose, onLaunched }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=gallery, 1=analyzing, 2=review

  function handleLaunch() {
    navigate('/projects/vendor-onboarding');
    onLaunched?.();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      {step === 0 && (
        <TemplateGallery ticket={ticket} onClose={onClose} onUseTemplate={() => setStep(1)} />
      )}
      {step === 1 && (
        <AnalyzingStep onDone={() => setStep(2)} />
      )}
      {step === 2 && (
        <ReviewDraft ticket={ticket} onBack={() => setStep(0)} onLaunch={handleLaunch} />
      )}
    </div>
  );
}
