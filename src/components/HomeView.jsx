import { useState } from 'react';
import { TICKETS } from '../data/tickets';
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

// ─── Queue data ───────────────────────────────────────────────────────────────

const SLA_URGENCY   = { overdue: 0, warning: 1, normal: 2 };
const PRIORITY_RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function computeQueueStats() {
  const active = TICKETS.filter(t => t.status !== 'Resolved');
  const sorted = [...active].sort((a, b) => {
    const sd = (SLA_URGENCY[a.slaType] ?? 2) - (SLA_URGENCY[b.slaType] ?? 2);
    if (sd !== 0) return sd;
    return (PRIORITY_RANK[a.priority] ?? 2) - (PRIORITY_RANK[b.priority] ?? 2);
  });
  return { topTickets: sorted.slice(0, 3) };
}

// ─── Static data ──────────────────────────────────────────────────────────────

const TASKS = [
  { id: 1, text: 'Review SFDC license provisioning for RevOps team',        date: 'Today',  dateColor: 'var(--success-text)' },
  { id: 2, text: 'Complete Q1 IT security audit checklist',                 date: 'Today',  dateColor: 'var(--success-text)' },
  { id: 3, text: 'Update VPN access policy documentation',                  date: 'Today',  dateColor: 'var(--success-text)' },
  { id: 4, text: 'Close out TICKET-62: Lost laptop — Patrick Tuckey',       date: 'Feb 28', dateColor: 'var(--text-weak)' },
  { id: 5, text: 'Review and approve device management policy update',       date: 'Feb 28', dateColor: 'var(--text-weak)' },
  { id: 6, text: 'Prepare weekly IT team standup notes',                    date: 'Feb 28', dateColor: 'var(--text-weak)' },
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

// ─── Tickets Queue Card ───────────────────────────────────────────────────────

function TicketRow({ ticket, showAISuggestion, onOpen }) {
  const slaOver = ticket.slaType === 'overdue';
  const slaWarn = ticket.slaType === 'warning';
  const slaColor = slaOver ? 'var(--danger-text)' : slaWarn ? 'var(--warning-text)' : 'var(--text-disabled)';

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background-weak)', overflow: 'hidden' }}>
      <button
        onClick={onOpen}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }}
      >
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="var(--text-disabled)" strokeWidth="1.2"/>
            <path d="M5.5 9L7.8 11.5L12.5 6.5" stroke="var(--text-disabled)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--text)', lineHeight: '22px', letterSpacing: '-0.15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ticket.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-weak)', lineHeight: '18px', marginTop: 2 }}>
            {ticket.id}
          </p>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
          <SlaRingIcon color={slaColor} />
          <span style={{ fontSize: 12, color: slaColor, lineHeight: '18px' }}>{ticket.sla}</span>
        </div>
      </button>

      {showAISuggestion && (
        <div style={{ margin: '0 14px 14px', background: 'var(--background-medium)', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-weak)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p style={{ flex: 1, fontSize: 13, color: 'var(--text)', lineHeight: '19px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            I've reviewed this request. The Professional edition includes the full reporting suite and would resolve this access issue.
          </p>
          <button onClick={onOpen} style={{ flexShrink: 0, marginLeft: 8, padding: '5px 12px', background: 'var(--background-weak)', border: '1px solid var(--border-strong)', borderRadius: 6, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
            Respond
          </button>
        </div>
      )}
    </div>
  );
}

function TicketsQueueCard({ onOpenServiceMode }) {
  const { topTickets } = computeQueueStats();

  return (
    <div style={{ flex: 1, background: 'var(--background-weak)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 24px', height: 64, flexShrink: 0, boxSizing: 'border-box' }}>
        <h4 style={H4}>
          Tickets queue
        </h4>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: 'none', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, color: 'var(--text-weak)', lineHeight: '18px' }}>
          Critical <ChevronDown size={10} />
        </button>
        <div style={{ flex: 1 }} />
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)', padding: '4px 6px', borderRadius: 4, fontSize: 16, lineHeight: 1, letterSpacing: '0.1em' }}>
          ···
        </button>
      </div>

      {/* Ticket rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {topTickets.map((t, i) => (
          <TicketRow key={t.id} ticket={t} onOpen={onOpenServiceMode}
            showAISuggestion={i === topTickets.length - 1} />
        ))}
      </div>

      <div style={{ padding: '12px 16px 16px' }}>
        <button onClick={onOpenServiceMode} style={{ background: 'none', border: 'none', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--text-weak)' }}>
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
          <TicketsQueueCard onOpenServiceMode={onOpenServiceMode} />
        </div>

        {/* Row 2: People */}
        <div style={{ padding: '0 32px' }}>
          <PeopleCard />
        </div>

      </div>
    </div>
  );
}
