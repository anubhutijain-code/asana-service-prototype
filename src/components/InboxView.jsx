// ─── InboxView ─────────────────────────────────────────────────────────────────
// Service Inbox: grouped notification feed.
// Row height / colors sourced from [UPDATED]Components.svg & Components-1.svg:
//   avatar bg green  #6FC991  (System Monitor)
//   avatar bg blue   #79ABFF  (photo fallback, Luna Kim)
//   unread dot       #3F6AC4
//   primary text     #1E1F21
//   secondary text   #6D6E6F / #9EA0A2

import { useState } from 'react';
import ApprovalTaskView from './ApprovalTaskView';

// ── Toolbar icons (stroke, 14 px grid) ────────────────────────────────────────

function FilterIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M1.5 3.5h11M3.5 7h7M5.5 10.5h3"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M4 2.5v9M4 11.5l-1.5-1.5M4 11.5l1.5-1.5
               M10 11.5v-9M10 2.5L8.5 4M10 2.5L11.5 4"
            stroke="currentColor" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DensityIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M1.5 4h11M1.5 7h11M1.5 10h11"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DotsHIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="8" r="1.3" />
      <circle cx="8"   cy="8" r="1.3" />
      <circle cx="12.5" cy="8" r="1.3" />
    </svg>
  );
}

// ── Item-type icons ────────────────────────────────────────────────────────────

// Gray circle + checkmark — for ticket items
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#9EA0A2" strokeWidth="1.2" />
      <path d="M5.5 8l2 2 3-3.5"
            stroke="#9EA0A2" strokeWidth="1.25"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Dark filled square — alert / high-severity
function DarkSquareIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2.5" fill="#1E1F21" />
    </svg>
  );
}

// Colored filled square — project
function ColorSquareIcon({ color }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2.5" fill={color} />
    </svg>
  );
}

// Orange circle + exclamation — SLA / warning
function WarningCircleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#E8AC44" strokeWidth="1.2" />
      <path d="M8 5.5v3.5" stroke="#E8AC44" strokeWidth="1.35" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.8" fill="#E8AC44" />
    </svg>
  );
}

// Chat bubble outline — knowledge base / comment
function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v6A1.5 1.5 0 0112.5 11H9L6 14v-3H3.5A1.5 1.5 0 012 9.5v-6z"
            stroke="#9EA0A2" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// Triangle outline — goal
function GoalIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M8 2.5L14 13.5H2L8 2.5z"
            stroke="#9EA0A2" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// Empty circle — status update / plain task
function EmptyCircleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#9EA0A2" strokeWidth="1.2" />
    </svg>
  );
}

// Person-in-box — approval request
function ApprovalIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="#9EA0A2" strokeWidth="1.2" />
      <circle cx="8" cy="7" r="2" stroke="#9EA0A2" strokeWidth="1.1" />
      <path d="M4.5 13.5c0-1.933 1.567-3 3.5-3s3.5 1.067 3.5 3"
            stroke="#9EA0A2" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────────

function Avatar({ initials, bg, botIcon }) {
  return (
    <div
      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {botIcon ?? (
        <span className="text-white leading-none select-none"
              style={{ fontSize: '10px', fontWeight: 600 }}>
          {initials}
        </span>
      )}
    </div>
  );
}

// ── Bot SVG icons (rendered inside avatar circles) ─────────────────────────────

const SYSTEM_BOT = (
  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true">
    <rect x="1.5" y="4.5" width="11" height="7" rx="1.75" stroke="white" strokeWidth="1.2" />
    <circle cx="5"  cy="8" r="1"   fill="white" />
    <circle cx="9"  cy="8" r="1"   fill="white" />
    <path d="M5 11h4" stroke="white" strokeWidth="1" strokeLinecap="round" />
    <rect x="5.5" y="2" width="3" height="2.5" rx="0.75" fill="white" />
  </svg>
);

const SLA_BOT = (
  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="10" height="8" rx="2" stroke="white" strokeWidth="1.2" />
    <circle cx="5"  cy="7.5" r="0.9" fill="white" />
    <circle cx="9"  cy="7.5" r="0.9" fill="white" />
    <path d="M5 10h4" stroke="white" strokeWidth="1" strokeLinecap="round" />
    <path d="M7 2v2"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="7" cy="1.5" r="0.75" fill="white" />
  </svg>
);

// ── Notification data ──────────────────────────────────────────────────────────

const SERVICE_NOTIFICATIONS = {
  Today: [
    {
      id: 1,
      avatarProps:  { bg: '#6FC991', botIcon: SYSTEM_BOT },
      actor:        'System Monitor',
      verb:         'triggered an alert on',
      itemIcon:     <DarkSquareIcon />,
      title:        'P0: East Coast Database Latency > 500ms',
      preview:      '',
      time:         '59m',
      unread:       false,
    },
    {
      id: 2,
      avatarProps:  { initials: 'LK', bg: '#79ABFF' },
      actor:        'Luna Kim',
      verb:         'assigned to you',
      itemIcon:     <CheckCircleIcon />,
      title:        'VPN Access Denied - New Engineering Cohort',
      preview:      'Can you please check?',
      time:         '1h',
      unread:       true,
    },
    {
      id: 3,
      avatarProps:  { initials: 'PS', bg: '#E8817D' },
      actor:        'Priya Singh',
      count:        '+1',
      verb:         'commented',
      itemIcon:     <CheckCircleIcon />,
      title:        'Incident #882: Laptop overheating on Zoom calls',
      preview:      'We have a total of 12 tickets on this',
      time:         '3h',
      unread:       true,
    },
    {
      id: 4,
      avatarProps:  { bg: '#3F6AC4', botIcon: SLA_BOT },
      actor:        'SLA Bot',
      verb:         'liked your comment',
      itemIcon:     <WarningCircleIcon />,
      title:        'Warning: Resolution time for Ticket #1042 expires in 15m',
      preview:      '',
      time:         '1d',
      unread:       false,
    },
  ],
  Yesterday: [
    {
      id: 5,
      avatarProps:  { initials: 'PS', bg: '#E8817D' },
      actor:        '6 new tickets',
      verb:         'added to IT Queue',
      itemIcon:     <ColorSquareIcon color="#E8817D" />,
      title:        'IT Support',
      preview:      '',
      time:         '1d',
      unread:       true,
      grouped:      true,
    },
    {
      id: 6,
      avatarProps:  { initials: 'SC', bg: '#4FBFA8' },
      actor:        'Sophia Chen',
      verb:         'liked your comment on',
      itemIcon:     <ChatBubbleIcon />,
      title:        'Knowledge Base: Troubleshooting M1 Chip Kernel Panics',
      preview:      '',
      time:         '1d',
      unread:       true,
    },
  ],
};

const ACTIVITY_NOTIFICATIONS = {
  Today: [
    {
      id: 'a0',
      avatarProps: { initials: 'IT', bg: '#4573D2' },
      actor: 'IT Team',
      verb: 'requested your approval',
      itemIcon: <ApprovalIcon />,
      title: 'Approve SFDC License for Martin Ludington',
      preview: '',
      time: 'Just now',
      unread: true,
    },
    {
      id: 'a1',
      avatarProps:  { initials: 'CD', bg: '#4FBFA8' },
      actor:        'Connie Darunia',
      verb:         'shared this goal with you',
      itemIcon:     <GoalIcon />,
      title:        'Capture 5,000 pre-orders by launch',
      preview:      '',
      time:         '59m',
      unread:       false,
    },
    {
      id: 'a2',
      avatarProps:  { initials: 'LK', bg: '#79ABFF' },
      actor:        'Luna Kim',
      verb:         'assigned to you',
      itemIcon:     <CheckCircleIcon />,
      title:        'Feedback on Marketing Workshop and Our Next Steps',
      preview:      'Thank you both!',
      time:         '1h',
      unread:       true,
    },
    {
      id: 'a3',
      avatarProps:  { initials: 'PS', bg: '#E8817D' },
      actor:        'Priya Singh',
      count:        '+1',
      verb:         'commented',
      itemIcon:     <CheckCircleIcon />,
      title:        'Frostline Brand Sentiment Survey',
      preview:      'We have a total of 144 sessions scheduled across dif...',
      time:         '3h',
      unread:       true,
    },
    {
      id: 'a4',
      avatarProps:  { initials: 'LT', bg: '#9B8EC4' },
      actor:        'Leo Torres',
      verb:         'liked your comment',
      itemIcon:     <CheckCircleIcon />,
      title:        'Reminder: Performance Review will be closed on June 30, 2025',
      preview:      'Thank you for the insi...',
      time:         '1d',
      unread:       false,
    },
  ],
  Yesterday: [
    {
      id: 'a5',
      avatarProps:  { initials: 'PS', bg: '#E8817D' },
      actor:        'Priya Singh',
      count:        '+6',
      verb:         'added new tasks',
      itemIcon:     <ColorSquareIcon color="#E8817D" />,
      title:        "Priya's Focus",
      preview:      '',
      time:         '1d',
      unread:       true,
      grouped:      true,
    },
    {
      id: 'a6',
      avatarProps:  { initials: 'SC', bg: '#4FBFA8' },
      actor:        'Sophia Chen',
      verb:         'sent a status update',
      itemIcon:     <EmptyCircleIcon />,
      title:        'Supply chain puts launch date at risk',
      preview:      'Last week was fairly slow catching back up after t...',
      time:         '1d',
      unread:       true,
    },
  ],
  'Past 7 days': [
    {
      id: 'a7',
      avatarProps:  { initials: 'DB', bg: '#8B7355' },
      actor:        'Dave Baloney',
      verb:         'requested your approval',
      itemIcon:     <ApprovalIcon />,
      title:        'SEO Content Revamp',
      preview:      '',
      time:         '3d',
      unread:       true,
    },
    {
      id: 'a8',
      avatarProps:  { initials: 'LT', bg: '#9B8EC4' },
      actor:        'Leo Torres',
      count:        '+3',
      verb:         'liked your comment',
      itemIcon:     <CheckCircleIcon />,
      title:        'Quarterly Social Media Content Calendar',
      preview:      'Thank you for the insightful analysis here!',
      time:         '5d',
      unread:       false,
    },
    {
      id: 'a9',
      avatarProps:  { initials: 'AD', bg: '#D4956A' },
      actor:        'Amrit Dhillon',
      verb:         'changed the due date to Nov 24',
      itemIcon:     <CheckCircleIcon />,
      title:        'Engage AI strategy',
      preview:      '',
      time:         '5d',
      unread:       false,
    },
    {
      id: 'a10',
      avatarProps:  { initials: 'PS', bg: '#E8817D' },
      actor:        'Priya Singh',
      verb:         'changed the due date to Apr 4',
      itemIcon:     <CheckCircleIcon />,
      title:        'Frostline Brand Sentiment Survey',
      preview:      '',
      time:         '5d',
      unread:       true,
    },
    {
      id: 'a11',
      avatarProps:  { initials: 'SC', bg: '#4FBFA8' },
      actor:        'Sophia Chen',
      verb:         'shared this project with you',
      itemIcon:     <ColorSquareIcon color="#E8AC44" />,
      title:        '[FYI] CommsX Inbox UXR Insights',
      preview:      '',
      time:         '6d',
      unread:       false,
    },
  ],
};

// ── NotifRow ───────────────────────────────────────────────────────────────────

function NotifRow({ avatarProps, actor, count, verb, itemIcon, title, preview, time, unread, grouped, active, onClick }) {
  return (
    <div
      className="group flex items-center px-8 cursor-pointer transition-colors"
      style={{
        minHeight: '40px',
        borderBottom: '1px solid #EDEAE9',
        background: active ? '#EBF0FB' : undefined,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F9F8F8'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = ''; }}
      onClick={onClick}
    >

      {/* ── Left: avatar + action text ─────────────────── ~38% */}
      <div className="flex items-center gap-2 shrink-0 pr-6" style={{ width: '38%' }}>
        {grouped && (
          <svg viewBox="0 0 10 10" width="10" height="10" fill="none"
               className="shrink-0 text-[#9EA0A2]" aria-hidden="true">
            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <Avatar {...avatarProps} />
        <p className="truncate" style={{ fontSize: '14px', color: '#6D6E6F', lineHeight: '1.35' }}>
          <span style={{ fontWeight: 400, color: '#1E1F21' }}>{actor}</span>
          {count && <span style={{ color: '#9EA0A2' }}> {count}</span>}
          {verb  && <span> {verb}</span>}
        </p>
      </div>

      {/* ── Middle: type icon + title + preview ─────────── flex */}
      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
        <span className="shrink-0">{itemIcon}</span>
        <span className="shrink-0 truncate" style={{ fontSize: '14px', fontWeight: 500, color: '#1E1F21', maxWidth: '55%' }}>
          {title}
        </span>
        {preview && (
          <span className="truncate" style={{ fontSize: '14px', color: '#9EA0A2' }}>
            {preview}
          </span>
        )}
      </div>

      {/* ── Right: time + unread dot ─────────────────────── fixed */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <span className="tabular-nums whitespace-nowrap" style={{ fontSize: '14px', color: '#9EA0A2' }}>
          {time}
        </span>
        <div className="w-2 h-2 flex items-center justify-center">
          {unread && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3F6AC4' }} />}
        </div>
      </div>

    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

function Section({ label, items, activeId, onNotifClick }) {
  return (
    <div>
      <div className="px-8 pt-4 pb-2">
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#9EA0A2' }}>{label}</span>
      </div>
      {items.map(n => (
        <NotifRow
          key={n.id}
          {...n}
          active={n.id === activeId}
          onClick={onNotifClick ? () => onNotifClick(n.id) : undefined}
        />
      ))}
    </div>
  );
}

// ── InboxView ──────────────────────────────────────────────────────────────────

const TABS = ['Activity', 'Bookmarks', 'Archive', 'Service'];

export default function InboxView({ defaultTab = 'Activity' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activeNotifId, setActiveNotifId] = useState(null);
  const [approvalState, setApprovalState] = useState('pending');

  const panelOpen = activeNotifId === 'a0';

  function handleNotifClick(id) {
    setActiveNotifId(prev => (prev === id ? null : id));
  }

  return (
    <div className="flex h-full bg-white overflow-hidden">

      {/* ── Left: inbox list ────────────────────────────────────────────────── */}
      <div
        className="flex flex-col h-full shrink-0 overflow-hidden"
        style={{
          width: panelOpen ? '42%' : '100%',
          borderRight: panelOpen ? '1px solid #EDEAE9' : 'none',
          transition: 'width 0.2s ease',
        }}
      >
        {/* Header */}
        <div className="shrink-0 px-8 pt-7">

          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#1E1F21', marginBottom: '12px', lineHeight: 1.2 }}>
            Inbox
          </h1>

          {/* Tab bar */}
          <div className="flex items-end justify-between" style={{ borderBottom: '1px solid #EDEAE9' }}>
            <div className="flex items-end">
              {TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="cursor-pointer border-0 bg-transparent transition-colors duration-100 border-b-2"
                  style={{
                    padding: `0 12px 10px ${tab === TABS[0] ? '0' : '12px'}`,
                    fontSize: '14px',
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? '#1E1F21' : '#6D6E6F',
                    borderBottomColor: activeTab === tab ? '#1E1F21' : 'transparent',
                    marginBottom: activeTab === tab ? '-1px' : '0',
                  }}
                >
                  {tab}
                </button>
              ))}
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent transition-colors border-b-2 border-transparent"
                style={{ padding: '0 8px 10px', fontSize: '14px', color: '#9EA0A2' }}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent hover:text-[#1E1F21] transition-colors"
              style={{ padding: '0 0 10px', fontSize: '13px', color: '#6D6E6F' }}
            >
              Manage notifications
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-5" style={{ color: '#6D6E6F' }}>
              <button type="button"
                      className="flex items-center gap-1.5 cursor-pointer border-0 bg-transparent hover:text-[#1E1F21] transition-colors"
                      style={{ fontSize: '14px' }}>
                <FilterIcon /> Filter
              </button>
              <button type="button"
                      className="flex items-center gap-1.5 cursor-pointer border-0 bg-transparent hover:text-[#1E1F21] transition-colors"
                      style={{ fontSize: '14px' }}>
                <SortIcon /> Sort: Relevance
              </button>
              <button type="button"
                      className="flex items-center gap-1.5 cursor-pointer border-0 bg-transparent hover:text-[#1E1F21] transition-colors"
                      style={{ fontSize: '14px' }}>
                <DensityIcon /> Density: Compact
              </button>
            </div>
            <button type="button"
                    className="cursor-pointer border-0 bg-transparent hover:text-[#1E1F21] transition-colors p-1 rounded"
                    style={{ color: '#6D6E6F' }}>
              <DotsHIcon />
            </button>
          </div>

        </div>

        {/* Notification list */}
        <div
          className="flex-1 min-h-0 overflow-auto"
          style={{ borderTop: '1px solid #EDEAE9', overscrollBehavior: 'none' }}
        >
          {activeTab === 'Activity' && (
            Object.entries(ACTIVITY_NOTIFICATIONS).map(([label, items]) => (
              <Section key={label} label={label} items={items} activeId={activeNotifId} onNotifClick={handleNotifClick} />
            ))
          )}
          {activeTab === 'Service' && (
            Object.entries(SERVICE_NOTIFICATIONS).map(([label, items]) => (
              <Section key={label} label={label} items={items} activeId={activeNotifId} />
            ))
          )}
          {(activeTab === 'Bookmarks' || activeTab === 'Archive') && (
            <div className="flex items-center justify-center h-full">
              <p style={{ fontSize: '14px', color: '#9EA0A2' }}>
                {activeTab} — coming soon
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: task detail panel ─────────────────────────────────────────── */}
      {panelOpen && (
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <ApprovalTaskView
            approvalState={approvalState}
            onApprove={() => setApprovalState('approved')}
            onReject={() => setApprovalState('rejected')}
            onUndo={() => setApprovalState('pending')}
            onClose={() => setActiveNotifId(null)}
          />
        </div>
      )}

    </div>
  );
}
