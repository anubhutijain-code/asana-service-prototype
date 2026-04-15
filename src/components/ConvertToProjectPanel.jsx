// ─── ConvertToProjectPanel — chat-to-project creation ─────────────────────────

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicTaskView from './BasicTaskView';
import RightPanelOverlay from './RightPanelOverlay';

// ─── Exported data (used by VendorOnboardingProject) ──────────────────────────

export const VENDOR_PROJECT_NAME = 'Acme Corp — Vendor Onboarding';

export const VENDOR_SECTIONS = [
  {
    id: 'procurement', label: 'Procurement', color: '#F1BD6C',
    tasks: [
      {
        id: 'VO-001', name: 'Review and sign Master Service Agreement',
        assignee: { name: 'Jordan Kim', bg: '#5a8f6b' },
        reporter: { name: 'Jordan Kim', bg: '#5a8f6b', dept: 'Procurement' },
        dept: 'Procurement', dueDate: 'Mar 5', status: 'Not started', priority: 'High',
        description: 'The MSA with Acme Corp needs to be reviewed by procurement and signed by the authorized signatory. The agreement covers service scope, payment terms, IP ownership, and liability caps. Legal has flagged two non-standard clauses requiring negotiation before signature.',
        nextSteps: [
          'Legal to complete redlines by Mar 4 and return markup to Acme Corp',
          'Jordan Kim to route final version for signatures via DocuSign once legal approves',
          'Store signed copy in the vendor contract repository and notify Finance',
        ],
      },
      {
        id: 'VO-002', name: 'Confirm budget approval and purchase order',
        assignee: { name: 'Jordan Kim', bg: '#5a8f6b' },
        reporter: { name: 'Jordan Kim', bg: '#5a8f6b', dept: 'Procurement' },
        dept: 'Procurement', dueDate: 'Mar 6', status: 'Not started', priority: 'Medium',
        description: 'Verify that the Acme Corp engagement has received formal budget approval and that a purchase order has been issued. The contract value is $48,000/year. Finance approval is required before provisioning access.',
        nextSteps: [
          'Confirm budget line item approved in Finance dashboard',
          'Issue PO in Coupa referencing the signed MSA once available',
          'Attach PO number to the vendor registry entry',
        ],
      },
      {
        id: 'VO-003', name: 'Add Acme Corp to vendor registry',
        assignee: { name: 'Jordan Kim', bg: '#5a8f6b' },
        reporter: { name: 'Jordan Kim', bg: '#5a8f6b', dept: 'Procurement' },
        dept: 'Procurement', dueDate: 'Mar 7', status: 'In Progress', priority: 'Low', aiAssignable: true,
        description: 'Register Acme Corp in the internal vendor registry with all required metadata: contract start/end dates, primary contact, payment terms, and risk classification. This entry is required before IT can begin provisioning.',
        nextSteps: [
          'Pull vendor details from the signed MSA and Acme Corp onboarding form',
          'Submit registry entry in the Vendor Management System with SOC 2 attestation link',
          'Verify entry completeness with Procurement lead and mark ready for IT',
        ],
      },
    ],
  },
  {
    id: 'legal', label: 'Legal', color: '#8D84E8',
    tasks: [
      {
        id: 'VO-004', name: 'Legal review of MSA and liability terms',
        assignee: { name: 'Legal Team', bg: '#8D84E8' },
        reporter: { name: 'Jordan Kim', bg: '#5a8f6b', dept: 'Procurement' },
        dept: 'Legal', dueDate: 'Mar 8', status: 'Not started', priority: 'High',
        description: 'Legal team to review the Master Service Agreement, focusing on liability caps, indemnification clauses, IP ownership, and governing law. Acme Corp has proposed uncapped liability on IP infringement — this needs to be negotiated down.',
        nextSteps: [
          'Legal team to complete initial review by Mar 7 and flag all non-standard terms',
          'Negotiate liability cap to 12 months of fees paid — coordinate with Acme Corp legal',
          'Approve final MSA language or escalate to GC if unresolved',
        ],
      },
      {
        id: 'VO-005', name: 'Review Data Processing Agreement (DPA)',
        assignee: { name: 'Legal Team', bg: '#8D84E8' },
        reporter: { name: 'Jordan Kim', bg: '#5a8f6b', dept: 'Procurement' },
        dept: 'Legal', dueDate: 'Mar 10', status: 'Not started', priority: 'Medium',
        description: 'Review the Data Processing Agreement to ensure compliance with GDPR, CCPA, and internal data governance policy. Acme Corp will process employee directory data and ticketing metadata under this agreement.',
        nextSteps: [
          'Privacy counsel to review data categories, retention periods, and sub-processor list',
          'Confirm Acme Corp\'s sub-processors are on the approved vendor list',
          'Execute DPA as an addendum to the MSA before any data transfer begins',
        ],
      },
    ],
  },
  {
    id: 'it-setup', label: 'IT Setup', color: '#4573D2',
    tasks: [
      {
        id: 'VO-006', name: 'Provision SSO and Okta application',
        assignee: { name: 'IT Ops', bg: '#4573D2' },
        reporter: { name: 'Jordan Kim', bg: '#5a8f6b', dept: 'Procurement' },
        dept: 'IT', dueDate: 'Mar 12', status: 'Not started', priority: 'High',
        description: 'Create and configure the Acme Corp application in Okta for SSO access. Assign appropriate user groups and validate the authentication flow with Acme Corp\'s technical team before go-live.',
        nextSteps: [
          'Create Okta app tile using SAML metadata provided by Acme Corp',
          'Assign IT Ops and pilot user group; run test login with Acme Corp technical contact',
          'Enable MFA enforcement for all Acme Corp app users before broader rollout',
        ],
      },
      {
        id: 'VO-007', name: 'Configure SAML integration',
        assignee: { name: 'IT Ops', bg: '#4573D2' },
        reporter: { name: 'IT Ops', bg: '#4573D2', dept: 'IT' },
        dept: 'IT', dueDate: 'Mar 13', status: 'Not started', priority: 'Medium',
        description: 'Set up SAML 2.0 federation between Okta and Acme Corp\'s identity provider. Configure attribute mappings for user provisioning and test round-trip authentication.',
        nextSteps: [
          'Exchange SAML metadata XML with Acme Corp — they need our SP entity ID and ACS URL',
          'Configure attribute mapping: email → NameID, department → custom attribute, role → group',
          'Run end-to-end login test with Acme Corp and confirm JIT provisioning works correctly',
        ],
      },
      {
        id: 'VO-008', name: 'Security review and vendor risk assessment',
        assignee: { name: 'InfoSec', bg: '#F06A6A' },
        reporter: { name: 'IT Ops', bg: '#4573D2', dept: 'IT' },
        dept: 'Security', dueDate: 'Mar 14', status: 'Not started', priority: 'High',
        description: 'Conduct a security review of Acme Corp covering their SOC 2 Type II compliance, data handling practices, and vulnerability management program. Risk score must be below threshold before provisioning completes.',
        nextSteps: [
          'Request SOC 2 Type II report and identify any exceptions relevant to our data',
          'Complete vendor risk questionnaire assessment and calculate risk score',
          'Approve provisioning or escalate to CISO if risk score exceeds threshold',
        ],
      },
      {
        id: 'VO-009', name: 'Confirm access granted and close ticket',
        assignee: { name: 'Jordan Kim', bg: '#5a8f6b' },
        reporter: { name: 'Jordan Kim', bg: '#5a8f6b', dept: 'Procurement' },
        dept: 'IT', dueDate: 'Mar 15', status: 'In Progress', priority: 'Medium', aiAssignable: true,
        description: 'Verify that all provisioning steps are complete across Procurement, Legal, and IT. Notify stakeholders and close the original service ticket TICKET-101 with a full resolution summary.',
        nextSteps: [
          'Confirm all target users can authenticate via SSO and have correct role assignments',
          'Send access-confirmed email to Jordan Kim and Acme Corp primary contact',
          'Close TICKET-101 with resolution notes and link to vendor registry entry',
        ],
      },
    ],
  },
];

const B = import.meta.env.BASE_URL;

// Only these two PNGs have valid image data
const PHOTO = {
  'Jordan Kim': `${B}avatars/spurti-kanduri.png`,
  'InfoSec':    `${B}avatars/robert-jones.png`,
};

// ─── Chat script ───────────────────────────────────────────────────────────────

const INITIAL_MSG = {
  role: 'ai',
  text: "I've read through TICKET-101 and the conversation history (6 messages). Based on the requirements Jordan Kim and Steve Smith outlined — MSA + DPA review, Okta/SAML provisioning, procurement sign-off — I'm building a cross-team project.",
  bullets: [
    'Procurement  ·  3 tasks  ·  due Mar 7',
    'Legal  ·  2 tasks  ·  due Mar 10',
    'IT Setup  ·  4 tasks  ·  due Mar 15',
  ],
};

const DONE_MSG = {
  role: 'ai',
  text: "Project created. 9 tasks across 3 sections, deadline March 15. I've pre-assigned 2 routine tasks to Onboarding AI.",
};

const SUGGESTIONS_MSG = {
  role: 'ai',
  text: "Want to add full AI monitoring and automation rules for this project?",
  suggestions: [
    {
      type: 'teammate',
      initials: 'OA',
      iconBg: '#5a8f6b',
      title: 'Onboarding AI',
      tag: 'AI teammate',
      summary: 'Monitors progress, surfaces blockers, keeps stakeholders updated',
      description: 'A custom AI teammate scoped to this project. It monitors task completion across all three sections, detects when work is stalling, and proactively surfaces blockers to the project owner.',
      handles: [
        'Daily progress check-ins across all sections',
        'Blocker detection when tasks go 2+ days without update',
        'Auto-draft status update for Jordan Kim each Friday',
        'Flag missing assignees before the Mar 15 deadline',
      ],
      aiTasks: [
        'Add Acme Corp to vendor registry',
        'Confirm access granted and close ticket',
      ],
    },
    {
      type: 'rule',
      icon: '⚡',
      iconBg: '#8D84E8',
      title: 'SLA breach auto-escalation',
      tag: 'AI rule',
      summary: 'Legal misses Mar 10 → escalate to team lead',
      trigger: 'Legal section tasks not completed by Mar 10',
      action: 'Escalate to team lead, send Slack notification to Jordan Kim',
      appliesTo: 'Legal section',
    },
    {
      type: 'rule',
      icon: '✓',
      iconBg: '#4573D2',
      title: 'Cross-team handoff',
      tag: 'AI rule',
      summary: 'IT Setup complete → notify HR and Facilities',
      trigger: 'All tasks in IT Setup section marked complete',
      action: 'Notify HR coordinator and Facilities team with summary',
      appliesTo: 'IT Setup section',
    },
  ],
};

const FALLBACK_REPLIES = [
  "Done — I've updated that. Anything else before you launch?",
  "Got it, adjusted. The project is ready when you are.",
  "Updated. Click \"Go to project\" to continue.",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function PersonAvatar({ name, bg, size = 20 }) {
  const src = PHOTO[name];
  const [imgFailed, setImgFailed] = useState(false);
  if (src && !imgFailed) {
    return (
      <img src={src} alt={name} onError={() => setImgFailed(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    );
  }
  const ini = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.38), fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>{ini}</div>
  );
}

function AiAvatar({ size = 32 }) {
  return (
    <img
      src={`${B}avatars/Teammate.svg`}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      alt="Asana AI"
    />
  );
}

// AI teammate avatar — uses Teammate-1.svg
function OaAvatar({ size = 20 }) {
  return (
    <img
      src={`${B}avatars/Teammate-1.svg`}
      alt="Onboarding AI"
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  );
}

// ─── Left: chat panel ─────────────────────────────────────────────────────────

function SuggestionCard({ s, onAdd }) {
  const [added, setAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const isTeammate = s.type === 'teammate';

  function handleAdd(e) {
    e.stopPropagation();
    setAdded(true);
    onAdd?.(s);
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', overflow: 'hidden' }}>

      {/* Collapsed header — always visible */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer', background: open ? 'var(--background-weak)' : 'var(--surface)' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'var(--background-weak)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'var(--surface)'; }}
      >
        {/* Avatar/icon */}
        <div style={{ width: 32, height: 32, borderRadius: isTeammate ? '50%' : 7, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>
          {isTeammate ? s.initials : s.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
            <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, border: '1px solid var(--border)', color: 'var(--text-weak)', flexShrink: 0 }}>{s.tag}</span>
            {added && (
              <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#10B981', fontWeight: 500, flexShrink: 0 }}>Added</span>
            )}
          </div>
          {!open && (
            <div style={{ fontSize: 12, color: 'var(--text-weak)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.summary}
            </div>
          )}
        </div>

        <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"
          style={{ flexShrink: 0, color: 'var(--text-disabled)', transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          <path d="M9.09 3.93L6 6.52 2.91 3.93a.75.75 0 10-.97 1.15l3.57 3a.75.75 0 00.97 0l3.57-3a.75.75 0 10-.97-1.15z"/>
        </svg>
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>

          {isTeammate ? (
            /* AI teammate detail */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text)', margin: 0 }}>{s.description}</p>

              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-disabled)', marginBottom: 6 }}>Handles</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {s.handles.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.iconBg, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '20px' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {s.aiTasks && s.aiTasks.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-disabled)', marginBottom: 6 }}>Will take ownership of</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {s.aiTasks.map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, background: 'var(--background-weak)', border: '1px solid var(--border)' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid var(--border-strong)', flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
                        <OaAvatar size={18} />
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 6 }}>
                    Already assigned to Onboarding AI — add teammate to enable full monitoring
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* AI rule detail */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['When', s.trigger], ['Then', s.action], ['Scope', s.appliesTo]].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-disabled)', width: 48, flexShrink: 0, paddingTop: 1 }}>{label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: '20px' }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={added}
            style={{
              marginTop: 12, height: 30, padding: '0 14px',
              border: added ? '1px solid var(--border)' : 'none',
              borderRadius: 6, fontSize: 13, fontWeight: 500,
              cursor: added ? 'default' : 'pointer',
              background: added ? 'var(--background-weak)' : 'var(--selected-background-strong)',
              color: added ? 'var(--text-weak)' : '#fff',
            }}
          >{added ? 'Added' : (isTeammate ? 'Add teammate' : 'Add rule')}</button>
        </div>
      )}
    </div>
  );
}

function ChatBubble({ msg, onAdd }) {
  const isAi = msg.role === 'ai';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
      {/* Bubble */}
      <div style={{
        background: 'var(--background-medium)',
        borderRadius: 12,
        padding: '12px 14px',
        alignSelf: isAi ? 'flex-start' : 'flex-end',
        width: '100%',
      }}>
        <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text)', margin: 0 }}>{msg.text}</p>
        {msg.bullets && (
          <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {msg.bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: ['#F1BD6C','#8D84E8','#4573D2'][i], flexShrink: 0 }} />
                <span style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text-weak)' }}>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Suggestion cards — outside bubble, full width */}
      {msg.suggestions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {msg.suggestions.map((s, i) => <SuggestionCard key={i} s={s} onAdd={onAdd} />)}
        </div>
      )}
      {/* Sender row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: isAi ? 'flex-start' : 'flex-end' }}>
        {isAi && <AiAvatar size={32} />}
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
          {isAi ? 'Asana AI' : 'You'}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
      <div style={{ background: 'var(--background-medium)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 5, alignItems: 'center', width: '100%' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--text-disabled)',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AiAvatar size={32} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Asana AI</span>
      </div>
    </div>
  );
}

// ─── Right: project preview ───────────────────────────────────────────────────

function SectionBlock({ section, visible, hasAiTeammate, onSelectTask, selectedTaskId }) {
  return (
    <div style={{
      marginBottom: 0,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: section.color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{section.label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', marginLeft: 2 }}>{section.tasks.length}</span>
      </div>
      {/* Tasks */}
      {section.tasks.map((task, i) => {
        const showAi = hasAiTeammate && task.aiAssignable;
        const isSelected = task.id === selectedTaskId;
        return (
          <div
            key={task.id}
            onClick={() => onSelectTask?.(task)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 24px', minHeight: 40,
              borderBottom: '1px solid var(--border)',
              background: isSelected ? 'var(--background-medium)' : showAi ? 'rgba(90,143,107,0.06)' : 'var(--surface)',
              opacity: visible ? 1 : 0,
              transition: `opacity 0.3s ease ${i * 0.08}s`,
              cursor: 'pointer',
            }}
            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--background-weak)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'var(--background-medium)' : showAi ? 'rgba(90,143,107,0.06)' : 'var(--surface)'; }}
          >
            {/* Task status circle */}
            {showAi ? (
              /* In-progress ring for AI tasks */
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" stroke="#c8dece" strokeWidth="1.5" fill="none" />
                <path d="M7 1 A6 6 0 0 1 13 7" stroke="#5a8f6b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="7" cy="7" r="2" fill="#5a8f6b" />
              </svg>
            ) : (
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--border-strong)', flexShrink: 0 }} />
            )}
            <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{task.name}</span>
            {showAi ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: 'rgba(90,143,107,0.12)', color: '#3d7a52', fontWeight: 500, flexShrink: 0 }}>In progress</span>
                <OaAvatar size={20} />
                <span style={{ fontSize: 11, color: 'var(--text-weak)', fontWeight: 500 }}>Onboarding AI</span>
              </div>
            ) : (
              <PersonAvatar name={task.assignee.name} bg={task.assignee.bg} size={20} />
            )}
            <span style={{ fontSize: 11, color: 'var(--text-disabled)', width: 44, textAlign: 'right', flexShrink: 0 }}>{task.dueDate}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProjectPreview({ visibleCount, done, addedTeammates, addedRules, onSelectTask, selectedTaskId }) {
  const totalTasks = VENDOR_SECTIONS.reduce((a, s) => a + s.tasks.length, 0);
  // AI tasks auto-assigned on creation; adding the teammate card adds monitoring capabilities
  const hasAiTeammate = done || addedTeammates.length > 0;
  const hasRules = addedRules.length > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--background-weak)', borderLeft: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Project header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{VENDOR_PROJECT_NAME}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', rowGap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-weak)' }}>From TICKET-101</span>
          {visibleCount > 0 && !done && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#10B981', fontWeight: 500 }}>
              {Math.min(visibleCount, VENDOR_SECTIONS.length)} of {VENDOR_SECTIONS.length} sections
            </span>
          )}
          {done && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#10B981', fontWeight: 500 }}>
              {totalTasks} tasks ready
            </span>
          )}
          {/* AI teammate avatar in members row */}
          {hasAiTeammate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4, padding: '2px 8px', borderRadius: 100, background: 'rgba(90,143,107,0.08)', border: '1px solid rgba(90,143,107,0.25)' }}>
              <OaAvatar size={16} />
              <span style={{ fontSize: 11, color: '#5a8f6b', fontWeight: 500 }}>Onboarding AI</span>
            </div>
          )}
        </div>

        {/* Rules shelf — appears when rules are added */}
        {hasRules && (
          <div style={{
            marginTop: 10,
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
            opacity: hasRules ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontWeight: 500 }}>Rules</span>
            {addedRules.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 8px', borderRadius: 100,
                background: r.iconBg + '18', border: `1px solid ${r.iconBg}44`,
              }}>
                <span style={{ fontSize: 11 }}>{r.icon}</span>
                <span style={{ fontSize: 11, color: r.iconBg, fontWeight: 500 }}>{r.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Column headers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 24px', borderBottom: '1px solid var(--border)', background: 'var(--background-weak)', flexShrink: 0 }}>
        <div style={{ width: 14, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 11, color: 'var(--text-disabled)', fontWeight: 500 }}>Task name</span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontWeight: 500 }}>Assignee</span>
        <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontWeight: 500, width: 44, textAlign: 'right' }}>Due</span>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {visibleCount === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)', animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }} />
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-disabled)' }}>Building project structure…</div>
          </div>
        )}
        {VENDOR_SECTIONS.map((s, i) => (
          <SectionBlock key={s.id} section={s} visible={visibleCount > i} hasAiTeammate={hasAiTeammate} onSelectTask={onSelectTask} selectedTaskId={selectedTaskId} />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConvertToProjectPanel({ ticket, onClose, onLaunched }) {
  const navigate  = useNavigate();
  const [messages, setMessages]           = useState([]);
  const [typing, setTyping]               = useState(true);
  const [visibleCount, setVisibleCount]   = useState(0);
  const [done, setDone]                   = useState(false);
  const [input, setInput]                 = useState('');
  const [replyIdx, setReplyIdx]           = useState(0);
  const [addedTeammates, setAddedTeammates] = useState([]);
  const [addedRules, setAddedRules]         = useState([]);
  const [selectedTask, setSelectedTask]     = useState(null);
  const chatEndRef = useRef(null);

  const hasAiTeammate = done || addedTeammates.length > 0;
  const resolvedTask = selectedTask && hasAiTeammate && selectedTask.aiAssignable
    ? { ...selectedTask, assignee: { name: 'Onboarding AI', bg: '#5a8f6b' } }
    : selectedTask;

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Boot sequence
  useEffect(() => {
    const t1 = setTimeout(() => {
      setMessages([INITIAL_MSG]);
      setTyping(false);
    }, 1100);

    const t2 = setTimeout(() => setVisibleCount(1), 2200);
    const t3 = setTimeout(() => setVisibleCount(2), 3500);
    const t4 = setTimeout(() => setVisibleCount(3), 4700);
    const t5 = setTimeout(() => setTyping(true), 5400);
    const t6 = setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, DONE_MSG]);
      setDone(true);
    }, 6500);
    const t7 = setTimeout(() => setTyping(true), 7400);
    const t8 = setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, SUGGESTIONS_MSG]);
    }, 8600);

    return () => [t1,t2,t3,t4,t5,t6,t7,t8].forEach(clearTimeout);
  }, []);

  function handleAdd(s) {
    if (s.type === 'teammate') {
      setAddedTeammates(prev => [...prev, s]);
    } else {
      setAddedRules(prev => [...prev, s]);
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: FALLBACK_REPLIES[replyIdx % FALLBACK_REPLIES.length] }]);
      setReplyIdx(i => i + 1);
    }, 1000);
  }

  function handleGoToProject() {
    onLaunched?.();
    onClose?.();
    navigate('/projects/vendor-onboarding?draft=1');
  }

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>

        {/* Top bar */}
        <div style={{ height: 52, flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-weak)', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6, fontSize: 13 }}>
            <svg viewBox="0 0 14 10" width="14" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 5H1M5 1L1 5l4 4"/></svg>
            Back
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Convert to project</span>
        </div>

        {/* Body: chat + project preview */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

          {/* Left: chat */}
          <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 8px' }}>
              {messages.map((m, i) => <ChatBubble key={i} msg={m} onAdd={handleAdd} />)}
              {typing && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '8px 16px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Adjust the project structure…"
                rows={2}
                style={{
                  flex: 1, border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px',
                  fontSize: 14, color: 'var(--text)', background: 'var(--background-weak)',
                  outline: 'none', resize: 'none', lineHeight: '22px', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  width: 32, height: 32, border: 'none', borderRadius: 8, flexShrink: 0,
                  background: input.trim() ? 'var(--selected-background-strong)' : 'var(--border)',
                  color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 10V2M2 6l4-4 4 4"/>
                </svg>
              </button>
            </div>

            {/* Go to project — appears when done */}
            <div style={{
              padding: '0 16px 16px', flexShrink: 0,
              opacity: done ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: done ? 'auto' : 'none',
            }}>
              <button
                onClick={handleGoToProject}
                style={{
                  width: '100%', height: 36, border: 'none', borderRadius: 6,
                  fontSize: 14, fontWeight: 500,
                  background: 'var(--selected-background-strong)', color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Go to project
              </button>
            </div>
          </div>

          {/* Right: project preview */}
          <ProjectPreview
            visibleCount={visibleCount}
            done={done}
            addedTeammates={addedTeammates}
            addedRules={addedRules}
            onSelectTask={setSelectedTask}
            selectedTaskId={selectedTask?.id}
          />

          {/* Task detail panel */}
          <RightPanelOverlay open={!!selectedTask} onClose={() => setSelectedTask(null)} width="min(620px, 65%)" noScrim>
            {resolvedTask && (
              <BasicTaskView
                key={resolvedTask.id}
                task={resolvedTask}
                onClose={() => setSelectedTask(null)}
                projectName="Acme Corp — Vendor Onboarding"
              />
            )}
          </RightPanelOverlay>
        </div>
      </div>
    </>
  );
}
