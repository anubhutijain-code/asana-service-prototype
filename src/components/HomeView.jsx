import { useState } from 'react';
import Avatar from './ui/Avatar';

const B = import.meta.env.BASE_URL;

// ─── Typography ───────────────────────────────────────────────────────────────

const H4 = {
  margin: 0,
  fontFamily: '"SF Pro Display"',
  fontSize: 20,
  fontWeight: 500,
  color: 'var(--text)',
  lineHeight: '28px',
  letterSpacing: '0.38px',
  fontFeatureSettings: "'liga' off, 'clig' off",
};

// ─── Assets ──────────────────────────────────────────────────────────────────

const ICON = {
  checkCircle : `${B}home/check-circle.svg`,
  chevronDown : `${B}home/chevron-down.svg`,
  plus        : `${B}home/plus.svg`,
  usersIcon   : `${B}home/users-icon.svg`,
};

const PHOTO = {
  ajeet : `${B}avatars/spurti-kanduri.png`,
  bryan : `${B}avatars/robert-jones.png`,
  zoe   : `${B}avatars/jenny-thai.png`,
  ian   : `${B}avatars/chris-swanson.png`,
  jason : `${B}avatars/jason-smith.png`,
};

// ─── Static data ──────────────────────────────────────────────────────────────

const TASKS = [
  { id: 1, text: 'Prep talking points for exec leadership sync',      date: 'Today',   dateColor: 'var(--success-text)' },
  { id: 2, text: 'Review cross-functional OKRs for Q2 planning',      date: 'Today',   dateColor: 'var(--success-text)' },
  { id: 3, text: "Send follow-up notes from yesterday's design review", date: 'Today',  dateColor: 'var(--success-text)' },
  { id: 4, text: 'Approve budget proposal for content team offsite',   date: 'Mar 14',  dateColor: 'var(--text-weak)' },
  { id: 5, text: 'Respond to partner co-marketing proposal',           date: 'Mar 14',  dateColor: 'var(--text-weak)' },
  { id: 6, text: 'Finalize hire plan for H1 headcount asks',           date: 'Mar 14',  dateColor: 'var(--text-weak)' },
];

const PEOPLE_ROWS = [
  [
    { type: 'invite' },
    { name: 'Dmitry Orlov',         initials: 'DO', bg: '#d2c3ec' },
    { name: 'Ajeet Cyrus',          photo: PHOTO.ajeet, photoBg: '#4573d2' },
    { name: 'Bryan Totino',         photo: PHOTO.bryan, photoBg: '#5da283' },
  ],
  [
    { name: 'Zoe Wong',             photo: PHOTO.zoe,   photoBg: '#8d84e8' },
    { name: 'Ian Bryson',           photo: PHOTO.ian,   photoBg: '#f1bd6c' },
    { name: 'Monsurat Olaosebikan', initials: 'MO', bg: '#e88fa0' },
    { name: 'Nick Lam',             initials: 'NL', bg: '#f1bd6c' },
  ],
  [
    { name: 'Dave Jung',            initials: 'DJ', bg: '#5da283' },
    { name: 'Alex Mooney',          photo: PHOTO.jason, photoBg: '#e8a87c' },
    { name: 'Maggie Gold',          initials: 'MG', bg: '#fc979a' },
    { name: 'Erika Otieno',         initials: 'EO', bg: '#9ee7e3' },
  ],
];

// ─── Icon primitives ──────────────────────────────────────────────────────────

function ChevronDown({ size = 12 }) {
  return (
    <img src={ICON.chevronDown} alt="" style={{ width: size, height: size, flexShrink: 0, opacity: 0.5 }} />
  );
}

function CheckCircle() {
  return <img src={ICON.checkCircle} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />;
}

function CheckMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8.5L6 12.5L14 4.5" stroke="#6d6e6f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SlaRingIcon({ color = '#c92f54' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: 'rotate(-100deg)', flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.6" strokeDasharray="25.8 5.6" strokeLinecap="round" />
    </svg>
  );
}

// ─── My Tasks Card ────────────────────────────────────────────────────────────

function MyTasksCard() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  return (
    <div style={{ flex: 1, background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

      {/* Header: avatar + title + tabs */}
      <div style={{ height: 84, flexShrink: 0, position: 'relative', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', left: 24, bottom: 20, width: 48, height: 48, borderRadius: '50%', background: 'var(--background-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.03em' }}>SD</span>
        </div>
        <h4 style={{ ...H4, position: 'absolute', left: 88, bottom: 60, transform: 'translateY(100%)' }}>
          My tasks
        </h4>
        <div style={{ position: 'absolute', left: 88, bottom: 0, display: 'flex', gap: 24 }}>
          {['Upcoming', 'Overdue (24)', 'Completed'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', padding: '0 0 10px', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab ? 500 : 400, letterSpacing: '-0.15px', lineHeight: '22px', color: activeTab === tab ? 'var(--text)' : 'var(--text-weak)', borderBottom: activeTab === tab ? '2px solid var(--icon)' : '2px solid transparent' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Create task row */}
      <div style={{ padding: '12px 24px 8px', borderBottom: '1px solid var(--border)' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)' }}>
          <img src={ICON.plus} alt="" style={{ width: 12, height: 12 }} />
          Create task
        </button>
      </div>

      {/* Task rows */}
      {TASKS.map(task => (
        <div key={task.id} style={{ padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0' }}>
            <CheckCircle />
            <span style={{ flex: 1, fontSize: 14, fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.15px', lineHeight: '22px' }}>{task.text}</span>
            <span style={{ flexShrink: 0, fontSize: 12, color: task.dateColor, lineHeight: '18px' }}>{task.date}</span>
          </div>
        </div>
      ))}

      <div style={{ padding: '8px 24px 16px' }}>
        <button style={{ background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)' }}>
          Show more
        </button>
      </div>
    </div>
  );
}

// ─── Tasks I've Assigned Card ─────────────────────────────────────────────────

const TAG_COLORS = {
  'Marketing': { bg: '#e8f5e9', color: '#2e7d32', dot: '#43a047' },
  'Design':    { bg: '#f3e8ff', color: '#7c3aed', dot: '#9333ea' },
  'Planning':  { bg: '#fff3e0', color: '#c25e00', dot: '#f59e0b' },
};

const ASSIGNED_TASKS = [
  { id: 1, text: 'Review Q2 campaign brief and share feedback',          tag: 'Marketing', assignee: { photo: PHOTO.ajeet,  bg: '#4573d2' } },
  { id: 2, text: 'Finalize brand guidelines deck for stakeholder review', tag: 'Design',   assignee: { photo: PHOTO.zoe,    bg: '#8d84e8' } },
  { id: 3, text: 'Draft agenda for all-hands meeting on March 20',       tag: 'Planning',  assignee: { photo: PHOTO.bryan,  bg: '#5da283' } },
  { id: 4, text: 'Collect team input for annual performance review',     tag: null,        assignee: { photo: PHOTO.ian,    bg: '#f1bd6c' } },
  { id: 5, text: 'Update project roadmap with revised launch dates',     tag: 'Planning',  assignee: { photo: PHOTO.jason,  bg: '#e8a87c' } },
  { id: 6, text: 'Share homepage redesign comps with content team',      tag: 'Design',    assignee: { photo: PHOTO.zoe,    bg: '#8d84e8' } },
];

function TasksAssignedCard() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  return (
    <div style={{ flex: 1, background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <h4 style={H4}>Tasks I've assigned</h4>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: 'none', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, color: 'var(--text-weak)', marginLeft: 8 }}>
            Everyone <ChevronDown size={10} />
          </button>
          <div style={{ flex: 1 }} />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', padding: '4px 6px', borderRadius: 4, fontSize: 16, lineHeight: 1, letterSpacing: '0.1em' }}>···</button>
        </div>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)' }}>
          {['Upcoming', 'Overdue', 'Completed'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', padding: '0 0 10px', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab ? 500 : 400, letterSpacing: '-0.15px', lineHeight: '22px', color: activeTab === tab ? 'var(--text)' : 'var(--text-weak)', borderBottom: activeTab === tab ? '2px solid var(--icon)' : '2px solid transparent', marginBottom: -1 }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assign task row */}
      <div style={{ padding: '10px 24px 8px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: '3px 0', cursor: 'pointer', fontSize: 13, color: 'var(--text-weak)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 1v10M1 6h10" />
          </svg>
          Assign task
        </button>
      </div>

      {/* Task rows */}
      {ASSIGNED_TASKS.map(task => (
        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 24px', borderBottom: '1px solid var(--border)' }}>
          <CheckCircle />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.15px', lineHeight: '22px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.text}</span>
          {task.tag && (() => { const tc = TAG_COLORS[task.tag] ?? TAG_COLORS['IT Ops']; return (
            <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: tc.bg, color: tc.color, whiteSpace: 'nowrap' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: tc.dot, flexShrink: 0 }} />
              {task.tag}
            </span>
          ); })()}
          <Avatar name="" src={task.assignee.photo} size={22} bg={task.assignee.bg} />
        </div>
      ))}

      <div style={{ padding: '8px 24px 16px' }}>
        <button style={{ background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)' }}>
          Show more
        </button>
      </div>
    </div>
  );
}

// ─── People Card ──────────────────────────────────────────────────────────────

function PersonCell({ person }) {
  if (person.type === 'invite') {
    return (
      <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 12px', borderRadius: 8, minWidth: 0, cursor: 'pointer' }}>
        <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: '50%', border: '2px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-medium)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v14M1 8h14" stroke="var(--text-disabled)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ flex: 1, fontSize: 16, fontWeight: 500, color: 'var(--text-weak)', letterSpacing: '-0.32px', lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Invite
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 12px', borderRadius: 8, minWidth: 0, cursor: 'pointer' }}>
      <Avatar name={person.name} src={person.photo} size={56} bg={person.bg ?? person.photoBg} />
      <p style={{ flex: 1, fontSize: 16, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.32px', lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {person.name}
      </p>
    </div>
  );
}

function PeopleCard() {
  return (
    <div style={{ background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 24px 0', marginBottom: 4 }}>
        <h4 style={H4}>People</h4>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', marginLeft: 4 }}>
          Frequent collaborators <ChevronDown />
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', background: 'none', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', marginLeft: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-weak)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Browse teams
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0 12px' }}>
        {PEOPLE_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', padding: '0 12px' }}>
            {row.map((person, pi) => <PersonCell key={pi} person={person} />)}
          </div>
        ))}
      </div>
      <div style={{ padding: '0 24px 16px' }}>
        <button style={{ background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)' }}>
          Show more
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HomeView({ onOpenServiceMode, hideGreeting = false }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background-weak)' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 48 }}>

        {/* Greeting header */}
        {!hideGreeting && <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '40px 32px 28px', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '18px', marginBottom: 6 }}>
              Wednesday, February 25
            </p>
            <p style={{ fontFamily: '"SF Pro Display"', fontSize: 32, fontWeight: 400, color: 'var(--text)', letterSpacing: '0.38px', lineHeight: '40px', fontFeatureSettings: "'liga' off, 'clig' off" }}>
              Good evening, Anubhuti
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, flexShrink: 0 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '18px' }}>My week</span>
              <ChevronDown />
            </button>
            <span style={{ color: '#d5d2ce', fontSize: 12 }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckMark />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: '18px' }}>17</span>
              <span style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '18px' }}>tasks completed</span>
            </div>
            <span style={{ color: 'var(--border-strong)', fontSize: 12 }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <img src={ICON.usersIcon} alt="" style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: '18px' }}>42</span>
              <span style={{ fontSize: 13, color: 'var(--text-weak)', lineHeight: '18px' }}>collaborated with</span>
            </div>
            <span style={{ color: 'var(--border-strong)', fontSize: 12 }}>·</span>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--background-weak)', border: '1px solid var(--border-strong)', borderRadius: 6, fontSize: 13, color: 'var(--text)', cursor: 'pointer', letterSpacing: '-0.15px', fontWeight: 500 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="0" y="0" width="5" height="5" rx="0.5" fill="#F06A6A"/>
                <rect x="7" y="0" width="5" height="5" rx="0.5" fill="#F1BD6C"/>
                <rect x="0" y="7" width="5" height="5" rx="0.5" fill="#83C9A9"/>
                <rect x="7" y="7" width="5" height="5" rx="0.5" fill="#4573D2"/>
              </svg>
              Customize
            </button>
          </div>
        </div>}

        {/* Row 1: My Tasks + Tickets Queue */}
        <div style={{ display: 'flex', gap: 16, padding: hideGreeting ? '28px 32px 0' : '0 32px', marginBottom: 16 }}>
          <MyTasksCard />
          <TasksAssignedCard />
        </div>

        {/* Row 2: People */}
        <div style={{ padding: '0 32px' }}>
          <PeopleCard />
        </div>

      </div>
    </div>
  );
}
