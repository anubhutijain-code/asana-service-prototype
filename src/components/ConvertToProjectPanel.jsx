import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SFT, SFD, LIGA } from '../constants/typography';

const B = import.meta.env.BASE_URL;
const AVATARS = [
  `${B}avatars/Teammate.svg`,
  `${B}avatars/Teammate1.svg`,
  `${B}avatars/Teammate-1.svg`,
  `${B}avatars/Teammate-2.svg`,
];

// ─── Data ─────────────────────────────────────────────────────────────────────

export const VENDOR_PROJECT_NAME = 'Acme Corp — Vendor Onboarding';

export const VENDOR_SECTIONS = [
  {
    id: 'procurement', label: 'Procurement', color: '#F1BD6C',
    tasks: [
      { id: 'VO-001', name: 'Review and sign Master Service Agreement',      assignee: { name: 'Jordan Kim',  bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 5',  status: 'Not started', priority: 'High'   },
      { id: 'VO-002', name: 'Confirm budget approval and purchase order',    assignee: { name: 'Jordan Kim',  bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 6',  status: 'Not started', priority: 'Medium' },
      { id: 'VO-003', name: 'Add Acme Corp to vendor registry',              assignee: { name: 'Jordan Kim',  bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 7',  status: 'Not started', priority: 'Low'    },
    ],
  },
  {
    id: 'legal', label: 'Legal', color: '#8D84E8',
    tasks: [
      { id: 'VO-004', name: 'Legal review of MSA and liability terms',       assignee: { name: 'Legal Team',  bg: '#8D84E8' }, dept: 'Legal',       dueDate: 'Mar 8',  status: 'Not started', priority: 'High'   },
      { id: 'VO-005', name: 'Review Data Processing Agreement (DPA)',         assignee: { name: 'Legal Team',  bg: '#8D84E8' }, dept: 'Legal',       dueDate: 'Mar 10', status: 'Not started', priority: 'Medium' },
    ],
  },
  {
    id: 'it-setup', label: 'IT Setup', color: '#4573D2',
    tasks: [
      { id: 'VO-006', name: 'Provision SSO and Okta application',            assignee: { name: 'IT Ops',      bg: '#4573D2' }, dept: 'IT',          dueDate: 'Mar 12', status: 'Not started', priority: 'High'   },
      { id: 'VO-007', name: 'Configure SAML integration',                    assignee: { name: 'IT Ops',      bg: '#4573D2' }, dept: 'IT',          dueDate: 'Mar 13', status: 'Not started', priority: 'Medium' },
      { id: 'VO-008', name: 'Security review and vendor risk assessment',     assignee: { name: 'InfoSec',     bg: '#F06A6A' }, dept: 'Security',    dueDate: 'Mar 14', status: 'High',        priority: 'High'   },
      { id: 'VO-009', name: 'Confirm access granted and close ticket',        assignee: { name: 'Jordan Kim',  bg: '#5a8f6b' }, dept: 'Procurement', dueDate: 'Mar 15', status: 'Not started', priority: 'Medium' },
    ],
  },
];

const STATUS_STYLE  = {
  'Not started': { bg: 'var(--background-strong)',    color: 'var(--text-disabled)' },
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

// ─── ProjectPreviewPanel — shared right-side realistic preview ─────────────────

// Pill colors matching Image #10 style
const PILL_PALETTES = [
  ['#4ECDC4', '#2B6CB0'],
  ['#48BB78', '#E53E3E'],
  ['#9F7AEA', '#ED8936'],
  ['#F6AD55', '#FC8181'],
  ['#68D391', '#7F9CF5'],
];

function PreviewTaskRow({ w, pills = [], done = false, nameText = null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 38, padding: '0 20px', borderBottom: '1px solid #F0F0F0', gap: 10 }}>
      {/* Circle checkbox */}
      {done ? (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" fill="#3D9970" stroke="#3D9970" strokeWidth="1.5"/>
          <path d="M4.5 8.5l2.5 2 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" stroke="#C2C7CE" strokeWidth="1.5"/>
        </svg>
      )}
      {/* Name — blurred bar or readable text */}
      {nameText ? (
        <span style={{ flex: 1, fontSize: 13, color: '#1E1F21', fontFamily: SFT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nameText}</span>
      ) : (
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#DCDFE3', maxWidth: w }} />
      )}
      {/* Person icon */}
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E8EAED', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 14 14" width="11" height="11" fill="none">
          <circle cx="7" cy="5" r="2.5" fill="#B0B7C0"/>
          <path d="M2 12c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="#B0B7C0" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      {/* Calendar icon */}
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E8EAED', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 14 14" width="11" height="11" fill="none">
          <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="#B0B7C0" strokeWidth="1.2"/>
          <path d="M1.5 5.5h11M4.5 1.5v2M9.5 1.5v2" stroke="#B0B7C0" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Status pills */}
      {pills.map((color, i) => (
        <div key={i} style={{ width: 52, height: 8, borderRadius: 4, background: color, flexShrink: 0, opacity: 0.75 }} />
      ))}
    </div>
  );
}

function ProjectPreviewPanel({ projectName = 'Vendor Onboarding' }) {
  const PREVIEW_SECTIONS = [
    {
      id: 'onboarding', label: 'Onboarding tasks',
      tasks: [
        { w: 180, pills: PILL_PALETTES[0], nameText: 'How to Sign Up' },
        { w: 210, pills: PILL_PALETTES[1], nameText: 'Submit onboarding feedback' },
        { w: 155, pills: [], nameText: null },
      ],
    },
    {
      id: 'live', label: 'Live Sessions',
      tasks: [
        { w: 190, pills: PILL_PALETTES[2] },
        { w: 160, pills: PILL_PALETTES[3] },
        { w: 200, pills: [] },
      ],
    },
    {
      id: 'reference', label: 'Reference',
      done: true,
      tasks: [
        { w: 195, pills: [PILL_PALETTES[0][0], PILL_PALETTES[1][0], PILL_PALETTES[4][0]], done: true },
        { w: 175, pills: [PILL_PALETTES[2][0], PILL_PALETTES[1][1], PILL_PALETTES[3][0]], done: true },
        { w: 200, pills: [PILL_PALETTES[4][1]], done: true },
      ],
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', borderLeft: '1px solid #E8EAED' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '14px 20px 0', borderBottom: '1px solid #E8EAED', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#E8EAED', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 14 12" width="13" height="13" fill="none">
              <path d="M1 3h12M1 7h9M1 11h6" stroke="#9EA0A2" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1E1F21', fontFamily: SFT }}>{projectName}</span>
          <div style={{ flex: 1 }} />
          {/* Avatar strip (blurred) */}
          <div style={{ display: 'flex', gap: -4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: '#C2C7CE', border: '2px solid #fff', marginLeft: i > 0 ? -6 : 0, opacity: 0.5 }} />
            ))}
          </div>
          <div style={{ width: 60, height: 7, borderRadius: 4, background: '#DCDFE3', opacity: 0.6 }} />
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {['Overview', 'List', 'Board', 'Timeline', 'Calendar', 'Workflow'].map((tab, i) => (
            <div key={tab} style={{
              padding: '6px 12px 8px',
              fontSize: 13, fontFamily: SFT,
              color: i === 1 ? '#4573D2' : '#6F7782',
              fontWeight: i === 1 ? 500 : 400,
              borderBottom: i === 1 ? '2px solid #4573D2' : '2px solid transparent',
              cursor: 'default',
            }}>{tab}</div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {PREVIEW_SECTIONS.map(sec => (
          <div key={sec.id}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px 6px', background: '#fff' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1E1F21', fontFamily: SFT }}>{sec.label}</span>
            </div>
            {sec.tasks.map((t, i) => (
              <PreviewTaskRow key={i} w={t.w} pills={t.pills || []} done={t.done} nameText={t.nameText} />
            ))}
          </div>
        ))}
      </div>

      {/* Description/Usage tabs at bottom */}
      <div style={{ flexShrink: 0, borderTop: '1px solid #E8EAED', background: '#fff' }}>
        <div style={{ display: 'flex', padding: '0 20px' }}>
          {['Description', 'Usage'].map((tab, i) => (
            <div key={tab} style={{
              padding: '10px 14px 10px 0', marginRight: 8,
              fontSize: 13, fontFamily: SFT,
              color: i === 0 ? '#1E1F21' : '#6F7782',
              borderBottom: i === 0 ? '2px solid #1E1F21' : '2px solid transparent',
              cursor: 'default',
            }}>{tab}</div>
          ))}
        </div>
        <div style={{ padding: '8px 20px 16px', fontSize: 13, color: '#6F7782', fontFamily: SFT }}>No description provided</div>
      </div>
    </div>
  );
}

// ─── Step 0: Template gallery (Image #9 style) ────────────────────────────────

function TemplateGallery({ ticket, onUseTemplate, onClose }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>

      {/* Left panel */}
      <div style={{ width: 420, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#F5F6F7', overflow: 'hidden', padding: '32px 32px 40px' }}>

        {/* Top row: close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32, flexShrink: 0 }}>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6F7782', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E8EAED'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
          </button>
        </div>

        {/* Creator row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E879A0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: SFT }}>
            Ta
          </div>
          <span style={{ fontSize: 13, color: '#6F7782', fontFamily: SFT }}>Created by Tala</span>
          <div style={{ flex: 1 }} />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9EA0A2', padding: 2 }}>
            <svg viewBox="0 0 16 4" width="14" height="4" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/></svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9EA0A2', padding: 2 }}>
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z"/></svg>
          </button>
        </div>

        {/* Template title */}
        <h1 style={{ fontFamily: SFD, fontSize: 34, fontWeight: 700, color: '#1E1F21', margin: '0 0 14px', lineHeight: '40px', letterSpacing: '-0.3px', flexShrink: 0 }}>
          Vendor Onboarding
        </h1>

        {/* Used by */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 32, flexShrink: 0 }}>
          <svg viewBox="0 0 16 12" width="14" height="12" fill="none">
            <circle cx="5" cy="4.5" r="2.5" stroke="#9EA0A2" strokeWidth="1.3"/>
            <circle cx="11" cy="4.5" r="2.5" stroke="#9EA0A2" strokeWidth="1.3"/>
            <path d="M0 11c0-2.5 2.2-4 5-4" stroke="#9EA0A2" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
            <path d="M7 11c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="#9EA0A2" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          </svg>
          <span style={{ fontSize: 13, color: '#6F7782', fontFamily: SFT }}>Used by Jordan Kim</span>
        </div>

        {/* AI match badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: '#EEF4FF', border: '1px solid #C7D9FF', marginBottom: 28, alignSelf: 'flex-start', flexShrink: 0 }}>
          <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="#4573D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 1l1.2 3.5H11L8.2 6.6l1 3.4L6 8l-3.2 2 1-3.4L1 4.5h3z"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#4573D2', fontFamily: SFT }}>AI selected · 97% match</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <button type="button" onClick={onUseTemplate}
            style={{ height: 46, borderRadius: 8, border: 'none', cursor: 'pointer', background: '#4573D2', color: '#fff', fontSize: 15, fontFamily: SFT, fontWeight: 600, letterSpacing: '0.1px', transition: 'opacity 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Use template
          </button>
          <button type="button"
            style={{ height: 46, borderRadius: 8, border: '1px solid #C9CDD2', cursor: 'pointer', background: '#fff', color: '#1E1F21', fontSize: 15, fontFamily: SFT, fontWeight: 500, transition: 'background 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F6F7'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            Request edit access
          </button>
        </div>

        {/* Source ticket pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: '#EAEDEF', border: '1px solid #DDDFE2', marginTop: 24, alignSelf: 'flex-start', flexShrink: 0 }}>
          <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#9EA0A2" strokeWidth="1.4" strokeLinecap="round"><rect x="1" y="1" width="10" height="10" rx="1.5"/><path d="M3 4h6M3 6.5h6M3 9h4"/></svg>
          <span style={{ fontSize: 11, color: '#9EA0A2', fontFamily: SFT }}>From {ticket.id}: {ticket.name}</span>
        </div>
      </div>

      {/* Right panel */}
      <ProjectPreviewPanel projectName="Vendor Onboarding" />
    </div>
  );
}

// ─── Step 1: New project form (Image #10 style) ────────────────────────────────

function NewProjectForm({ onBack, onSubmit }) {
  const [projectName, setProjectName] = useState(VENDOR_PROJECT_NAME);
  const [privacy, setPrivacy] = useState('Private');
  const [shareInput, setShareInput] = useState('');
  const [shareWith, setShareWith] = useState([{ name: 'Tala A.', bg: '#E879A0', initials: 'Ta' }]);
  const inputRef = useRef(null);

  function removeShare(i) {
    setShareWith(prev => prev.filter((_, idx) => idx !== i));
  }

  function handleShareKey(e) {
    if ((e.key === 'Enter' || e.key === ',') && shareInput.trim()) {
      e.preventDefault();
      setShareWith(prev => [...prev, { name: shareInput.trim(), bg: '#6B8CDE', initials: shareInput.trim()[0].toUpperCase() }]);
      setShareInput('');
    }
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>

      {/* Left panel */}
      <div style={{ width: 520, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#F5F6F7', padding: '28px 48px 40px', overflow: 'auto' }}>

        {/* Back arrow */}
        <div style={{ marginBottom: 24, flexShrink: 0 }}>
          <button type="button" onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6F7782', display: 'flex', alignItems: 'center', padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#1E1F21'}
            onMouseLeave={e => e.currentTarget.style.color = '#6F7782'}>
            <svg viewBox="0 0 14 12" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M13 6H1M6 1L1 6l5 5"/></svg>
          </button>
        </div>

        {/* Heading row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36, flexShrink: 0 }}>
          <h1 style={{ fontFamily: SFD, fontSize: 34, fontWeight: 700, color: '#1E1F21', margin: 0, letterSpacing: '-0.3px', lineHeight: '40px' }}>
            New project
          </h1>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#4573D2', fontFamily: SFT, padding: 0, textDecoration: 'underline', textUnderlineOffset: 2 }}>
            Send feedback
          </button>
        </div>

        {/* Template field */}
        <div style={{ marginBottom: 24, flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6F7782', fontFamily: SFT, marginBottom: 4 }}>Template</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E1F21', fontFamily: SFT }}>Vendor Onboarding</div>
        </div>

        {/* Project name */}
        <div style={{ marginBottom: 24, flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6F7782', fontFamily: SFT, marginBottom: 6 }}>Project name</div>
          <input
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            autoFocus
            style={{
              width: '100%', height: 42, boxSizing: 'border-box',
              border: '2px solid #4573D2', borderRadius: 6,
              padding: '0 12px', fontSize: 14, fontFamily: SFT, color: '#1E1F21',
              background: '#fff', outline: 'none',
            }}
          />
        </div>

        {/* Privacy */}
        <div style={{ marginBottom: 24, flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6F7782', fontFamily: SFT, marginBottom: 6 }}>Privacy</div>
          <div style={{ position: 'relative' }}>
            <select
              value={privacy}
              onChange={e => setPrivacy(e.target.value)}
              style={{ width: '100%', height: 42, boxSizing: 'border-box', border: '1px solid #C9CDD2', borderRadius: 6, padding: '0 12px 0 36px', fontSize: 14, fontFamily: SFT, color: '#1E1F21', background: '#fff', appearance: 'none', cursor: 'pointer', outline: 'none' }}
            >
              <option>Private</option>
              <option>My workspace</option>
              <option>Public</option>
            </select>
            <svg viewBox="0 0 12 14" width="11" height="14" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="#6F7782" strokeWidth="1.3"/>
              <path d="M4 6V4a2 2 0 014 0v2" stroke="#6F7782" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <svg viewBox="0 0 10 6" width="10" height="6" fill="none" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <path d="M1 1l4 4 4-4" stroke="#6F7782" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Share with */}
        <div style={{ marginBottom: 40, flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#6F7782', fontFamily: SFT, marginBottom: 6 }}>Share with <span style={{ fontWeight: 400 }}>(optional)</span></div>
          <div
            onClick={() => inputRef.current?.focus()}
            style={{ minHeight: 42, border: '1px solid #C9CDD2', borderRadius: 6, padding: '6px 10px', background: '#fff', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', cursor: 'text' }}
          >
            {shareWith.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28, padding: '0 8px', background: '#EEF4FF', border: '1px solid #C7D9FF', borderRadius: 14 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: SFT }}>{s.initials}</div>
                <span style={{ fontSize: 13, color: '#1E1F21', fontFamily: SFT }}>{s.name}</span>
                <button onClick={() => removeShare(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6F7782', padding: 0, display: 'flex', alignItems: 'center', fontSize: 12, lineHeight: 1 }}>×</button>
              </div>
            ))}
            <input
              ref={inputRef}
              value={shareInput}
              onChange={e => setShareInput(e.target.value)}
              onKeyDown={handleShareKey}
              placeholder={shareWith.length === 0 ? 'Add people…' : ''}
              style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: SFT, color: '#1E1F21', background: 'transparent', minWidth: 80, flex: 1 }}
            />
          </div>
        </div>

        {/* Create project button */}
        <button type="button" onClick={onSubmit}
          style={{ height: 46, borderRadius: 8, border: 'none', cursor: 'pointer', background: '#4573D2', color: '#fff', fontSize: 15, fontFamily: SFT, fontWeight: 600, flexShrink: 0, transition: 'opacity 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Create project
        </button>
      </div>

      {/* Right panel */}
      <ProjectPreviewPanel projectName={projectName || 'New project'} />
    </div>
  );
}

// ─── Step 2: AI analyzing ──────────────────────────────────────────────────────

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24, padding: 40, background: '#F5F6F7' }}>
      <SpinnerIcon />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {PHASES.map((p, i) => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: i <= phase ? 1 : 0.25, transition: 'opacity 0.4s' }}>
            {i < phase
              ? <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5"/></svg>
              : i === phase
              ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4573D2', flexShrink: 0 }} />
              : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9CDD2', flexShrink: 0 }} />
            }
            <span style={{ fontSize: 14, fontFamily: SFT, color: i <= phase ? '#1E1F21' : '#9EA0A2' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Review draft ──────────────────────────────────────────────────────

const REVIEW_CW = { assignee: 140, dept: 110, dueDate: 90, status: 110, priority: 90 };
const COL_BASE = { fontFamily: SFT, fontSize: 12, fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA, whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center' };

function ReviewSection({ sec }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
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
      {open && sec.tasks.map(task => <ReviewTaskRow key={task.id} task={task} />)}
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
      <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid var(--border-strong)', flexShrink: 0 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
        {editing ? (
          <input autoFocus value={name} onChange={e => setName(e.target.value)} onBlur={() => setEditing(false)} onKeyDown={e => e.key === 'Enter' && setEditing(false)}
            style={{ flex: 1, height: 26, padding: '0 6px', fontSize: 13, fontFamily: SFT, border: '1px solid #4573D2', borderRadius: 4, outline: 'none', color: 'var(--text)', background: 'var(--surface)' }} />
        ) : (
          <span onClick={() => setEditing(true)} style={{ fontSize: 13, fontFamily: SFT, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'text', flex: 1, ...LIGA }} title="Click to edit">{name}</span>
        )}
      </div>
      <div style={{ width: REVIEW_CW.assignee, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Avi name={task.assignee.name} bg={task.assignee.bg} size={20} />
        <span style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...LIGA }}>{task.assignee.name.split(' ')[0]}</span>
      </div>
      <div style={{ width: REVIEW_CW.dept, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text-weak)', ...LIGA }}>{task.dept}</span>
      </div>
      <div style={{ width: REVIEW_CW.dueDate, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontFamily: SFT, color: 'var(--text-weak)', ...LIGA }}>{task.dueDate}</span>
      </div>
      <div style={{ width: REVIEW_CW.status, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 8px', borderRadius: 4, background: ss.bg, color: ss.color, whiteSpace: 'nowrap', ...LIGA }}>{task.status}</span>
      </div>
      <div style={{ width: REVIEW_CW.priority, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 8px', borderRadius: 4, background: ps.bg, color: ps.color, whiteSpace: 'nowrap', ...LIGA }}>{task.priority}</span>
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
      <div style={{ flexShrink: 0, padding: '14px 24px 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#5a8f6b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10.5 2C11.3285 2 12 2.67158 12 3.5V8.5C12 9.32845 11.3285 10 10.5 10H1.5C0.671575 10 0 9.32845 0 8.5V0.5C0 0.22386 0.223857 0 0.5 0H4.8L5.85435 1.75725C5.9447 1.90785 6.10745 2 6.2831 2H10.5ZM11 3.5V8.5C11 8.77615 10.7761 9 10.5 9H1.5C1.22386 9 1 8.77615 1 8.5V3H10.5C10.7761 3 11 3.22386 11 3.5ZM4.83381 2L4.23381 1H1V2H4.83381Z" fill="white"/></svg>
            </div>
            {editingName ? (
              <input autoFocus value={projectName} onChange={e => setProjectName(e.target.value)} onBlur={() => setEditingName(false)} onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                style={{ height: 32, padding: '0 8px', fontSize: 18, fontFamily: SFD, fontWeight: 500, border: '1px solid #4573D2', borderRadius: 6, outline: 'none', color: 'var(--text)', background: 'var(--surface)', minWidth: 280 }} />
            ) : (
              <h2 onClick={() => setEditingName(true)} title="Click to rename" style={{ fontFamily: SFD, fontSize: 18, fontWeight: 500, color: 'var(--text)', letterSpacing: '0.2px', lineHeight: '28px', margin: 0, cursor: 'text', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>{projectName}</h2>
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: 'var(--background-medium)', border: '1px solid var(--border)', flexShrink: 0 }}>
              <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="var(--text-disabled)" strokeWidth="1.4" strokeLinecap="round"><rect x="1" y="1" width="8" height="8" rx="1"/><path d="M3 3.5h4M3 5h4M3 6.5h2.5"/></svg>
              <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, whiteSpace: 'nowrap' }}>from {ticket.id}</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, background: '#EEF4FF', flexShrink: 0 }}>
              <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="#4573D2" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 1l1 2.8H9L6.5 5.5l.8 2.8L5 6.5l-2.3 1.8.8-2.8L1 3.8h3z"/></svg>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4573D2', fontFamily: SFT }}>AI pre-filled</span>
            </div>
          </div>
          <button type="button" onClick={handleLaunch} disabled={launching}
            style={{ height: 34, padding: '0 18px', borderRadius: 7, border: 'none', cursor: launching ? 'default' : 'pointer', background: launching ? 'var(--background-strong)' : '#4573D2', color: launching ? 'var(--text-disabled)' : 'white', fontSize: 13, fontFamily: SFT, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, transition: 'all 0.15s' }}>
            {launching
              ? <><SpinnerIcon /> Creating project…</>
              : <><svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg> Launch project</>
            }
          </button>
        </div>
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
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'stretch', paddingLeft: 24, paddingRight: 24, background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 2, borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...COL_BASE, flex: 1, padding: '8px 8px 8px 24px' }}>Task name</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.assignee, padding: '8px', borderLeft: '1px solid var(--border)' }}>Assignee</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.dept,     padding: '8px', borderLeft: '1px solid var(--border)' }}>Department</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.dueDate,  padding: '8px', borderLeft: '1px solid var(--border)' }}>Due date</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.status,   padding: '8px', borderLeft: '1px solid var(--border)' }}>Status</div>
        <div style={{ ...COL_BASE, width: REVIEW_CW.priority, padding: '8px', borderLeft: '1px solid var(--border)' }}>Priority</div>
      </div>
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
  // 0=template gallery, 1=new project form, 2=analyzing
  const [step, setStep] = useState(0);

  function handleAnalyzingDone() {
    onLaunched?.();           // marks ticket as launched/closed in TicketDetailView
    onClose?.();              // dismisses the full-screen overlay
    navigate('/projects/vendor-onboarding?draft=1'); // lands in work mode, draft review
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#F5F6F7', display: 'flex', flexDirection: 'column' }}>
      {step === 0 && <TemplateGallery ticket={ticket} onClose={onClose} onUseTemplate={() => setStep(1)} />}
      {step === 1 && <NewProjectForm onBack={() => setStep(0)} onSubmit={() => setStep(2)} />}
      {step === 2 && <AnalyzingStep onDone={handleAnalyzingDone} />}
    </div>
  );
}
