// ─── RequestsView — AI-deflected chat requests ────────────────────────────────

import { useState } from 'react';

const BASE_URL = import.meta.env.BASE_URL;

const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const LIGA = { fontFeatureSettings: "'liga' off, 'clig' off" };

// ── Mock data ─────────────────────────────────────────────────────────────────

const CHATS = [
  {
    id: 'req-001',
    user: { name: 'Emily Chen',     initials: 'EC', color: '#5DA182' },
    subject: 'Can\'t log in to Okta after password reset',
    preview: 'Glad to hear it worked! Is there anything else?',
    time: '9:14 AM',
    status: 'Deflected',
    channel: 'Web',
    category: 'Account Access',
    messages: [
      { from: 'user', text: 'Hi, I\'m having trouble logging into Okta. It says my password is incorrect but I just reset it.' },
      { from: 'ai',   text: 'Hi Emily! I can help with that. After a password reset, Okta sometimes needs a moment to sync. Please try these steps:\n\n1. Clear your browser cache and cookies\n2. Open a fresh incognito window\n3. Go to your Okta portal and sign in with the new password\n\nIf it still fails after 5 minutes, let me know.' },
      { from: 'user', text: 'The incognito window worked! Thank you.' },
      { from: 'ai',   text: 'Glad to hear it worked! For future reference, clearing your browser cache is often the quickest fix after an Okta password reset. Is there anything else I can help you with?' },
      { from: 'user', text: 'No that\'s all, thanks!' },
      { from: 'event', text: 'Chat resolved by AI' },
      { from: 'rating', stars: 5 },
    ],
  },
  {
    id: 'req-002',
    user: { name: 'James Park',     initials: 'JP', color: '#6d8aad' },
    subject: 'Request Editor access to Figma',
    preview: 'Your request has been logged as TICKET-64.',
    time: '8:52 AM',
    status: 'Deflected',
    channel: 'Web',
    category: 'Access Request',
    messages: [
      { from: 'user', text: 'I need access to Figma for the new product project. Who do I contact?' },
      { from: 'ai',   text: 'I can help you request Figma access. To get started:\n\n- What type of access do you need? (Viewer or Editor)\n- Which team or project?\n- Do you have manager approval?' },
      { from: 'user', text: 'Editor access, Product Design team. My manager Sarah already approved it.' },
      { from: 'ai',   text: 'Okay, here is your ticket. Please confirm that all the details are accurate. Once you confirm, I will send the ticket to an IT admin.' },
      { from: 'event', text: 'TICKET-64 created · Figma Editor Access — assigned to IT Admin' },
      { from: 'rating', stars: 4 },
    ],
  },
  {
    id: 'req-003',
    user: { name: 'Sarah Mitchell',  initials: 'SM', color: '#9B6B9E' },
    subject: 'WiFi keeps dropping in Vancouver office',
    preview: 'I\'m escalating this to the IT team — expect a reply within 2 hours.',
    time: '8:31 AM',
    status: 'Escalated',
    channel: 'Web',
    category: 'Network',
    messages: [
      { from: 'user', text: 'The WiFi in the Vancouver office keeps dropping every 10 minutes. It\'s been happening since Monday.' },
      { from: 'ai',   text: 'I\'m sorry to hear that. Let\'s try a quick fix first:\n\n1. Forget the WiFi network on your device\n2. Restart your device\n3. Reconnect to the network\n\nDoes your device also have trouble on other networks, or only this one?' },
      { from: 'user', text: 'Only in the Vancouver office. My phone and laptop both drop at the same time, so it\'s not my device.' },
      { from: 'ai',   text: 'That points to a network infrastructure issue rather than your device — I\'ll need to escalate this to the IT network team. I\'m escalating this now and you should hear back within 2 hours. Your ticket number is TICKET-65.' },
      { from: 'event', text: 'Escalated to IT Network team · TICKET-65 created' },
    ],
  },
  {
    id: 'req-004',
    user: { name: 'Kevin Torres',   initials: 'KT', color: '#D43D5D' },
    subject: 'How do I reset my Microsoft 365 password?',
    preview: 'Let me know if the self-service reset worked for you.',
    time: '8:07 AM',
    status: 'Deflected',
    channel: 'Slack',
    category: 'Account Access',
    messages: [
      { from: 'user', text: 'I forgot my Microsoft 365 password. How do I reset it?' },
      { from: 'ai',   text: 'You can reset it in a few ways:\n\n**Self-service (fastest):**\nGo to aka.ms/sspr and follow the prompts — you\'ll verify via your registered phone or email.\n\n**If SSPR is blocked:**\nContact IT at it-support@company.com or call ext. 4100.\n\nWould you like me to walk you through the self-service steps?' },
      { from: 'user', text: 'The self-service link worked, thanks!' },
      { from: 'ai',   text: 'Great! Let me know if the reset completes successfully — sometimes it takes a few minutes to sync across apps like Teams and Outlook.' },
      { from: 'event', text: 'Chat resolved by AI' },
      { from: 'rating', stars: 5 },
    ],
  },
  {
    id: 'req-005',
    user: { name: 'Priya Nair',     initials: 'PN', color: '#ECBD85' },
    subject: 'VPN split-tunnel config for AWS Workspaces',
    preview: 'Escalating — L1 doesn\'t have a runbook for this config.',
    time: 'Yesterday',
    status: 'Escalated',
    channel: 'Web',
    category: 'VPN / Network',
    messages: [
      { from: 'user', text: 'I need to configure split tunneling on the VPN so AWS Workspaces traffic doesn\'t go through the corporate tunnel. How do I do this?' },
      { from: 'ai',   text: 'Split-tunnel VPN configuration can vary by your VPN client. Which client are you using — Cisco AnyConnect, GlobalProtect, or something else?' },
      { from: 'user', text: 'GlobalProtect. I need the AWS Workspaces subnet excluded from the tunnel.' },
      { from: 'ai',   text: 'GlobalProtect split-tunnel exclusions require changes to the VPN gateway config — this isn\'t something you can do on the client side. I\'m escalating this to the network team who can add the AWS subnet to your gateway\'s split-tunnel exclusion list. Ticket number TICKET-63.' },
    ],
  },
  {
    id: 'req-006',
    user: { name: 'Devon Walsh',    initials: 'DW', color: '#7C5EA8' },
    subject: 'MacBook stuck on macOS 13 — can\'t update',
    preview: 'The Software Update setting was greyed out — try MDM enrollment.',
    time: 'Yesterday',
    status: 'Deflected',
    channel: 'Web',
    category: 'Hardware / OS',
    messages: [
      { from: 'user', text: 'I\'m trying to update my MacBook to the latest macOS but the Software Update setting is completely greyed out. I can\'t click it.' },
      { from: 'ai',   text: 'A greyed-out Software Update is usually caused by MDM (device management) policy or a pending admin lock. A few things to check:\n\n1. Are you signed in with your corporate Apple ID (not a personal one)?\n2. Is the machine enrolled in Jamf/MDM? Check System Settings > Privacy & Security > Profiles.\n3. If MDM is listed, the update might need to be pushed by IT rather than initiated by you.' },
      { from: 'user', text: 'It shows "Configuration Profile" under Profiles. So IT has to push it?' },
      { from: 'ai',   text: 'Yes — since your device is MDM-managed, OS updates are typically pushed by IT to ensure compatibility. I\'ve created a ticket (TICKET-67) requesting an OS update for your device. The IT team will push the update during your next login, usually within 24 hours.' },
      { from: 'user', text: 'Perfect, thank you!' },
    ],
  },
  {
    id: 'req-007',
    user: { name: 'Marcus Rivera',  initials: 'MR', color: '#D43D5D' },
    subject: 'Paycheck missing overtime from February',
    preview: 'This has been escalated to HR Payroll — expect contact within 4 hours.',
    time: 'Yesterday',
    status: 'Escalated',
    channel: 'Web',
    category: 'Payroll',
    messages: [
      { from: 'user', text: 'My February paycheck is missing about 12 hours of overtime that I worked the last week of the month. What do I do?' },
      { from: 'ai',   text: 'I\'m sorry to hear that — I understand payroll issues are urgent. This is outside the IT support scope, but I want to make sure you get help quickly.\n\nI\'m escalating this directly to HR Payroll now. Can you confirm your employee ID so I can attach it to the request?' },
      { from: 'user', text: 'Sure, it\'s EMP-4821.' },
      { from: 'ai',   text: 'Thank you. I\'ve escalated this to HR Payroll (TICKET-68) with your employee ID attached and marked it as high priority. You should hear from someone within 4 hours. If you don\'t receive a response by end of day, reply here and I\'ll follow up on your behalf.' },
      { from: 'event', text: 'Escalated to HR Payroll · TICKET-68 created' },
    ],
  },
  {
    id: 'req-008',
    user: { name: 'Tom Reyes',      initials: 'TR', color: '#5D9B6B' },
    subject: 'Teams notifications stopped working on mobile',
    preview: 'Glad the notification reset worked — all set!',
    time: '2 days ago',
    status: 'Deflected',
    channel: 'Slack',
    category: 'Collaboration Tools',
    messages: [
      { from: 'user', text: 'Microsoft Teams stopped sending me notifications on my iPhone two days ago. I\'ve checked my phone settings and notifications are on.' },
      { from: 'ai',   text: 'A few things to check on the Teams side (not just iOS settings):\n\n1. Open Teams on your phone → tap your profile icon → Notifications → make sure they\'re not set to "Off" or "Quiet hours"\n2. Check that "Quiet Hours" isn\'t active under Notifications > Quiet time\n3. Sign out of Teams on mobile and sign back in — this refreshes the push notification token' },
      { from: 'user', text: 'Signing out and back in fixed it! Notifications are coming through now.' },
      { from: 'ai',   text: 'Glad that worked! The push notification token can occasionally get stuck, and a sign-out/sign-in always refreshes it. Let me know if it stops again.' },
      { from: 'event', text: 'Chat resolved by AI' },
      { from: 'rating', stars: 4 },
    ],
  },
];

const STATUS_STYLE = {
  'Deflected': { bg: 'var(--success-background)',  color: 'var(--success-text)'  },
  'Escalated': { bg: 'var(--warning-background)',  color: 'var(--warning-text)'  },
  'Pending':   { bg: 'var(--selected-background)', color: 'var(--selected-text)' },
};

const CHANNEL_STYLE = {
  'Web':   { bg: 'var(--background-medium)', color: 'var(--text-disabled)' },
  'Slack': { bg: '#ECF2FF', color: '#4A6CF7' },
};

const TABS = [
  { id: 'all',       label: 'All',       filter: () => true },
  { id: 'deflected', label: 'Deflected', filter: c => c.status === 'Deflected' },
  { id: 'escalated', label: 'Escalated', filter: c => c.status === 'Escalated' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function InitialsAvatar({ initials, color, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: '#fff', fontFamily: SFT,
    }}>
      {initials}
    </div>
  );
}

function ChatListItem({ chat, selected, onClick }) {
  const ss = STATUS_STYLE[chat.status] ?? STATUS_STYLE['Pending'];
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        background: selected ? 'var(--background-medium)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--background-medium)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <InitialsAvatar initials={chat.user.initials} color={chat.user.color} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + time */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text)', fontFamily: SFT, letterSpacing: '-0.15px', ...LIGA }}>{chat.user.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: SFT, flexShrink: 0, marginLeft: 8 }}>{chat.time}</span>
          </div>
          {/* Subject */}
          <p style={{ fontSize: 12, fontWeight: 400, color: 'var(--text)', fontFamily: SFT, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...LIGA }}>
            {chat.subject}
          </p>
          {/* Preview + status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--text-weak)', fontFamily: SFT, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {chat.preview}
            </p>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3,
              background: ss.bg, color: ss.color, fontFamily: SFT, flexShrink: 0, whiteSpace: 'nowrap,',
            }}>
              {chat.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiChatAvatar() {
  return (
    <img
      src={`${BASE_URL}avatars/Teammate.svg`}
      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      alt="AI"
    />
  );
}

function ChatMessage({ msg, userInfo }) {
  // System event (escalation, resolution)
  if (msg.from === 'event') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-disabled)', whiteSpace: 'nowrap', fontFamily: SFT }}>{msg.text}</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
    );
  }

  // Customer rating
  if (msg.from === 'rating') {
    const filled = '★'.repeat(msg.stars);
    const empty  = '☆'.repeat(5 - msg.stars);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-disabled)', whiteSpace: 'nowrap', fontFamily: SFT }}>
          Customer rated&nbsp;
          <span style={{ color: '#F59E0B', letterSpacing: 1 }}>{filled}</span>
          <span style={{ color: 'var(--border-strong)', letterSpacing: 1 }}>{empty}</span>
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
    );
  }

  const lines = msg.text.split('\n');

  // AI message — outbound bubble style (grey, avatar right)
  if (msg.from === 'ai') {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 8 }}>
        <div style={{
          background: '#F5F5F4', borderRadius: 12, padding: '10px 14px', maxWidth: '68%',
        }}>
          <p style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap', fontFamily: SFT }}>
            {lines.map((line, i) => <span key={i}>{line}{i < lines.length - 1 && <br />}</span>)}
          </p>
        </div>
        <AiChatAvatar />
      </div>
    );
  }

  // Customer message — inbound style (no bubble, avatar+name below)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <p style={{ fontSize: 13, lineHeight: '20px', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap', fontFamily: SFT }}>
        {lines.map((line, i) => <span key={i}>{line}{i < lines.length - 1 && <br />}</span>)}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <InitialsAvatar initials={userInfo.initials} color={userInfo.color} size={24} />
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-weak)', fontFamily: SFT }}>{userInfo.name}</span>
      </div>
    </div>
  );
}

function ChatPanel({ chat }) {
  const ss = STATUS_STYLE[chat.status] ?? STATUS_STYLE['Pending'];
  const cs = CHANNEL_STYLE[chat.channel] ?? CHANNEL_STYLE['Web'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '14px 24px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--background-weak)',
      }}>
        <InitialsAvatar initials={chat.user.initials} color={chat.user.color} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: SFT, ...LIGA }}>{chat.user.name}</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 7px', borderRadius: 4, background: ss.bg, color: ss.color, fontFamily: SFT }}>{chat.status}</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 7px', borderRadius: 4, background: cs.bg, color: cs.color, fontFamily: SFT }}>{chat.channel}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-weak)', margin: '2px 0 0', fontFamily: SFT, ...LIGA }}>
            {chat.subject} · <span style={{ color: 'var(--text-disabled)' }}>{chat.category}</span>
          </p>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT, flexShrink: 0 }}>{chat.time}</span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px',
        background: 'var(--background-weak)',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {chat.messages.map((msg, i) => (
          <ChatMessage key={i} msg={msg} userInfo={chat.user} />
        ))}
      </div>

    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: 'var(--text-disabled)' }}>
      <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 6h22a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-5 4V8a2 2 0 0 1 1-1.73V6z"/>
        <path d="M10 13h12M10 17h7"/>
      </svg>
      <p style={{ fontSize: 13, fontFamily: SFT, margin: 0 }}>Select a request to view the conversation</p>
    </div>
  );
}

// ── RequestsView ──────────────────────────────────────────────────────────────

export default function RequestsView() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedId, setSelectedId] = useState(CHATS[0]?.id ?? null);

  const filtered = CHATS.filter(TABS.find(t => t.id === activeTab)?.filter ?? (() => true));
  const selected = CHATS.find(c => c.id === selectedId) ?? null;

  const tabCounts = Object.fromEntries(
    TABS.map(t => [t.id, CHATS.filter(t.filter).length])
  );

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--background-weak)' }}>

      {/* ── Left: chat list ─────────────────────────────────────────────── */}
      <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* List header */}
        <div style={{ padding: '24px 16px 0', flexShrink: 0 }}>
          <h2 style={{ fontFamily: '"SF Pro Display"', fontSize: 20, fontWeight: 500, lineHeight: '28px', letterSpacing: '0.38px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', margin: '0 0 14px' }}>
            Requests
          </h2>

          {/* Tab bar */}
          <div className="flex border-b border-border gap-6">
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'flex items-center gap-1.5 pb-2.5 text-sm cursor-pointer border-0 bg-transparent whitespace-nowrap',
                    'transition-colors duration-150',
                    active
                      ? 'text-text font-medium shadow-[inset_0_-2px_0_var(--icon)]'
                      : 'text-text-weak hover:text-text',
                    'focus:outline-none',
                  ].join(' ')}
                >
                  {tab.label}
                  <span className={[
                    'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
                    'rounded text-[11px] font-medium leading-none',
                    active ? 'bg-background-strong text-text' : 'bg-background-medium text-text-disabled',
                  ].join(' ')}>
                    {tabCounts[tab.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length > 0
            ? filtered.map(chat => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  selected={selectedId === chat.id}
                  onClick={() => setSelectedId(chat.id)}
                />
              ))
            : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, fontSize: 13, color: 'var(--text-disabled)', fontFamily: SFT }}>
                No requests
              </div>
            )
          }
        </div>
      </div>

      {/* ── Right: chat portal ───────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {selected ? <ChatPanel chat={selected} /> : <EmptyState />}
      </div>

    </div>
  );
}
