import { useState, useRef, useEffect } from 'react';
import Pill from './Pill';
import { AI_INTENT, AI_KB_REFS, AI_SUGGESTED_REPLY, AI_CHAT_RESPONSES } from '../data/aiAssist';
import { KB_ARTICLES } from '../data/knowledgeBase';

// ─── Icons ────────────────────────────────────────────────────────────────────

function LockIcon({ color = 'currentColor', size = 12 }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M9.5 4H9V3C9 1.3455 7.6545 0 6 0C4.3455 0 3 1.3455 3 3V4H2.5C1.673 4 1 4.673 1 5.5V9.5C1 10.327 1.673 11 2.5 11H9.5C10.327 11 11 10.327 11 9.5V5.5C11 4.673 10.327 4 9.5 4ZM4 3C4 1.897 4.897 1 6 1C7.103 1 8 1.897 8 3V4H4V3ZM10 9.5C10 9.7755 9.776 10 9.5 10H2.5C2.224 10 2 9.7755 2 9.5V5.5C2 5.2245 2.224 5 2.5 5H9.5C9.776 5 10 5.2245 10 5.5V9.5Z" />
    </svg>
  );
}

function AiSparkleIcon({ color = 'currentColor', size = 12 }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M8.8125 0H8.1875C8.1875 0.580161 7.95703 1.13656 7.5468 1.5468C7.13656 1.95703 6.58016 2.1875 6 2.1875V2.8125C6.58016 2.8125 7.13656 3.04297 7.5468 3.4532C7.95703 3.86344 8.1875 4.41984 8.1875 5H8.8125C8.8125 4.41984 9.04297 3.86344 9.4532 3.4532C9.86344 3.04297 10.4198 2.8125 11 2.8125V2.1875C10.4198 2.1875 9.86344 1.95703 9.4532 1.5468C9.04297 1.13656 8.8125 0.580161 8.8125 0ZM6.5 5.125C4.8335 5.125 3.875 4.1665 3.875 2.5H3.125C3.125 4.1665 2.1665 5.125 0.5 5.125V5.875C2.1665 5.875 3.125 6.8335 3.125 8.5H3.875C3.875 6.8335 4.8335 5.875 6.5 5.875V5.125ZM7.8125 7H7.1875C7.1875 7.28727 7.13092 7.57172 7.02099 7.83712C6.91105 8.10252 6.74992 8.34367 6.5468 8.5468C6.34367 8.74992 6.10252 8.91105 5.83712 9.02099C5.57172 9.13092 5.28727 9.1875 5 9.1875V9.8125C5.58016 9.8125 6.13656 10.043 6.5468 10.4532C6.95703 10.8634 7.1875 11.4198 7.1875 12H7.8125C7.8125 11.4198 8.04297 10.8634 8.4532 10.4532C8.86344 10.043 9.41984 9.8125 10 9.8125V9.1875C9.41984 9.1875 8.86344 8.95703 8.4532 8.5468C8.04297 8.13656 7.8125 7.58016 7.8125 7Z" />
    </svg>
  );
}

function ChevronDownTiny() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" aria-hidden="true">
      <path d="M9.09175 3.92542L5.99875 6.52092L2.90575 3.92542C2.75338 3.79758 2.55647 3.73551 2.35834 3.75286C2.16021 3.77021 1.97708 3.86555 1.84925 4.01792C1.72141 4.17029 1.65934 4.36719 1.67669 4.56533C1.69404 4.76346 1.78938 4.94658 1.94175 5.07442L5.51675 8.07442C5.65172 8.1879 5.82241 8.25011 5.99875 8.25011C6.17509 8.25011 6.34577 8.1879 6.48075 8.07442L10.0557 5.07442C10.2047 4.94558 10.2971 4.7633 10.3128 4.56695C10.3285 4.37061 10.2663 4.17597 10.1397 4.02507C10.0131 3.87418 9.83224 3.77914 9.63615 3.76049C9.44007 3.74185 9.24452 3.80109 9.09175 3.92542Z" />
    </svg>
  );
}

function TranscriptChevron({ open }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true"
      style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
      <path d="M9.09175 3.92542L5.99875 6.52092L2.90575 3.92542C2.75338 3.79758 2.55647 3.73551 2.35834 3.75286C2.16021 3.77021 1.97708 3.86555 1.84925 4.01792C1.72141 4.17029 1.65934 4.36719 1.67669 4.56533C1.69404 4.76346 1.78938 4.94658 1.94175 5.07442L5.51675 8.07442C5.65172 8.1879 5.82241 8.25011 5.99875 8.25011C6.17509 8.25011 6.34577 8.1879 6.48075 8.07442L10.0557 5.07442C10.2047 4.94558 10.2971 4.7633 10.3128 4.56695C10.3285 4.37061 10.2663 4.17597 10.1397 4.02507C10.0131 3.87418 9.83224 3.77914 9.63615 3.76049C9.44007 3.74185 9.24452 3.80109 9.09175 3.92542Z" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0, color: '#6D6E6F' }}>
      <path d="M7.5 0H2C1.4477 0 1 0.4477 1 1V11C1 11.5523 1.4477 12 2 12H10C10.5523 12 11 11.5523 11 11V3.5L7.5 0ZM7.5 1.207L9.793 3.5H7.5V1.207ZM10 11H2V1H6.5V4H10V11ZM3 5.5H9V6.5H3V5.5ZM3 7.5H9V8.5H3V7.5ZM3 9.5H7V10.5H3V9.5Z" />
    </svg>
  );
}

function SendUpIcon({ active }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill={active ? 'white' : '#9ea0a2'} aria-hidden="true">
      <path d="M6 1L6 11M6 1L2 5M6 1L10 5" stroke={active ? 'white' : '#9ea0a2'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ─── Known agents for @mention ────────────────────────────────────────────────

const KNOWN_AGENTS = [
  { name: 'Liam Torres',   initials: 'LT', bg: '7a9abf' },
  { name: 'Marcus Rivera', initials: 'MR', bg: 'c4506a' },
  { name: 'Jaime Smith',   initials: 'JS', bg: '5DA283' },
  { name: 'Jordan Ellis',  initials: 'JE', bg: 'c9963a' },
  { name: 'Devon Walsh',   initials: 'DW', bg: '8D84E8' },
];

// ─── Avatars ──────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.BASE_URL;

function AiAvatar({ size = 32 }) {
  return (
    <img
      src={`${BASE_URL}avatars/Teammate.svg`}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      alt="AI agent"
    />
  );
}

function PhotoAvatar({ bg, fg, initials, size = 32, svgSrc }) {
  if (svgSrc) {
    return (
      <img
        src={svgSrc}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        alt="agent"
      />
    );
  }
  return (
    <img
      src={`https://placehold.co/${size}x${size}/${bg}/${fg}?text=${initials}`}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      alt={initials}
    />
  );
}

// ─── Mention token (matches Token.svg: colored avatar square + grey body + name + ×) ──

function MentionToken({ agent, onRemove }) {
  const SFT = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', height: 24,
      borderRadius: 4, background: '#E8E5E4', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Coloured avatar square */}
      <div style={{
        width: 24, height: 24, flexShrink: 0,
        background: `#${agent.bg}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, color: 'white', fontFamily: SFT,
        letterSpacing: '0.02em',
      }}>
        {agent.initials}
      </div>
      {/* Name */}
      <span style={{
        fontSize: 12, color: '#1D1F21', fontFamily: SFT,
        padding: '0 6px', whiteSpace: 'nowrap', lineHeight: '24px',
      }}>
        {agent.name}
      </span>
      {/* Remove button — only when interactive */}
      {onRemove && (
        <>
          <div style={{ width: 1, height: 14, background: '#C9C9C8', flexShrink: 0 }} />
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); onRemove(); }}
            style={{
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, lineHeight: 1, color: '#6D6E6F', background: 'none', border: 'none',
              cursor: 'pointer', flexShrink: 0, fontFamily: SFT,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#D8D5D4'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const CHAT_TABS = [
  { id: 'chat', label: 'Chat' },
  { id: 'ai',   label: 'AI Agent' },
];

function ChatTabBar({ active, onSelect, viewOnly = false }) {
  return (
    <div
      className="shrink-0 flex items-end gap-5 px-6"
      style={{ height: 44, borderBottom: '1px solid #EDEAE9' }}
    >
      {CHAT_TABS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="flex items-center gap-1.5 border-0 bg-transparent"
            style={{
              height: '100%',
              paddingBottom: 2,
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#1E1F21' : '#6D6E6F',
              borderBottom: isActive ? '2px solid #1E1F21' : '2px solid transparent',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {id === 'ai' && <AiSparkleIcon color={isActive ? '#1E1F21' : '#6D6E6F'} />}
            {label}
          </button>
        );
      })}
      {viewOnly && (
        <div className="ml-auto mb-1">
          <Pill label="View only" icon={<LockIcon color="#6D6E6F" />} bg="#F3F4F6" color="#6D6E6F" />
        </div>
      )}
    </div>
  );
}

// ─── Message components ───────────────────────────────────────────────────────

const BUBBLE_WIDTH = '72%';

function OutboundBubble({ text, senderLabel, time, avatar }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 8 }}>
      <div style={{
        background: '#F5F5F4', borderRadius: 12, padding: '12px 14px',
        width: BUBBLE_WIDTH, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <p style={{ fontSize: 14, lineHeight: '22px', color: '#1E1F21', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <span style={{ fontSize: 12, color: '#6D6E6F' }}>{senderLabel}</span>
          <span style={{ fontSize: 11, color: '#9ea0a2' }}>{time}</span>
        </div>
      </div>
      {avatar}
    </div>
  );
}

// Private @mention bubble (right-aligned, warm background)
function PrivateBubble({ text, senderLabel, time, avatar, mentionedAgent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 8 }}>
      <div style={{
        background: '#FFF8F5',
        border: '1px solid #F0DDD4',
        borderRadius: 12,
        padding: '10px 14px',
        width: BUBBLE_WIDTH,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Token + message on same line when someone is mentioned */}
        {mentionedAgent ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
            <MentionToken agent={mentionedAgent} />
            <p style={{ fontSize: 14, lineHeight: '22px', color: '#1E1F21', margin: 0, whiteSpace: 'pre-wrap', flex: 1, minWidth: 0 }}>{text}</p>
          </div>
        ) : (
          <p style={{ fontSize: 14, lineHeight: '22px', color: '#1E1F21', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
        )}
        {/* Bottom row: pill left, sender+time right */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <Pill
            label="Private internal"
            icon={<LockIcon color="#9D5700" size={10} />}
            bg="#F5E6DC"
            color="#9D5700"
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: '#6D6E6F' }}>{senderLabel}</span>
            <span style={{ fontSize: 11, color: '#9ea0a2' }}>{time}</span>
          </div>
        </div>
      </div>
      {avatar}
    </div>
  );
}

function SystemEvent({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: '#EDEAE9' }} />
      <span style={{ fontSize: 12, color: '#9ea0a2', whiteSpace: 'nowrap' }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: '#EDEAE9' }} />
    </div>
  );
}

function InboundMessage({ text, name, time, bg, fg, initials, svgSrc }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <p style={{ fontSize: 14, lineHeight: '22px', color: '#1E1F21', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PhotoAvatar bg={bg} fg={fg} initials={initials} size={32} svgSrc={svgSrc} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1E1F21', lineHeight: '18px' }}>{name}</span>
          <span style={{ fontSize: 11, color: '#9ea0a2', lineHeight: '16px' }}>{time}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Shared message renderer ──────────────────────────────────────────────────

function renderMsg(msg, i) {
  if (msg.type === 'system') {
    return <SystemEvent key={i} text={msg.text} />;
  }
  // Private messages: always right-aligned with warm background, regardless of inbound/outbound
  if (msg.isPrivate) {
    const senderLabel = msg.senderLabel || msg.name || 'Agent';
    const avatar = msg.isAi
      ? <AiAvatar size={32} />
      : <PhotoAvatar
          bg={msg.senderBg || msg.bg || '6d8aad'}
          fg={msg.fg || 'ffffff'}
          initials={msg.senderInitials || msg.initials || 'SS'}
          size={32}
          svgSrc={msg.svgSrc}
        />;
    return (
      <PrivateBubble
        key={i}
        text={msg.text}
        senderLabel={senderLabel}
        time={msg.time}
        mentionedAgent={msg.mentionedAgent}
        avatar={avatar}
      />
    );
  }
  if (msg.type === 'inbound') {
    return <InboundMessage key={i} text={msg.text} name={msg.name} time={msg.time} bg={msg.bg} fg={msg.fg} initials={msg.initials} svgSrc={msg.svgSrc} />;
  }
  const avatar = msg.isAi
    ? <AiAvatar size={32} />
    : <PhotoAvatar bg={msg.senderBg || '6d8aad'} fg="ffffff" initials={msg.senderInitials || 'SS'} size={32} svgSrc={msg.svgSrc} />;
  return <OutboundBubble key={i} text={msg.text} senderLabel={msg.senderLabel} time={msg.time} avatar={avatar} />;
}

// ─── Compact log message (transcript only) ───────────────────────────────────

function TranscriptMessage({ msg }) {
  if (msg.type === 'system') {
    return (
      <div style={{ borderLeft: '2px solid #EDEAE9', paddingLeft: 12 }}>
        <p style={{ fontSize: 12, lineHeight: '18px', color: '#9ea0a2', margin: 0, fontStyle: 'italic' }}>{msg.text}</p>
      </div>
    );
  }
  const isBot = msg.type === 'outbound';
  const name = isBot ? msg.senderLabel : msg.name;
  return (
    <div style={{ borderLeft: '2px solid #EDEAE9', paddingLeft: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#6D6E6F' }}>{name}</span>
        <span style={{ fontSize: 11, color: '#C4C4C4' }}>{msg.time}</span>
      </div>
      <p style={{ fontSize: 13, lineHeight: '20px', color: '#6D6E6F', margin: 0 }}>{msg.text}</p>
    </div>
  );
}

function TranscriptBlock({ messages }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center cursor-pointer border-0 bg-transparent"
        style={{ gap: 12, width: '100%' }}
      >
        <div style={{ flex: 1, height: 1, background: '#EDEAE9' }} />
        <span style={{ fontSize: 12, color: '#9ea0a2', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          Prior conversation · {messages.length} messages
          <TranscriptChevron open={open} />
        </span>
        <div style={{ flex: 1, height: 1, background: '#EDEAE9' }} />
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#F9F8F8', borderRadius: 8, padding: '14px 16px' }}>
          {messages.map((msg, i) => <TranscriptMessage key={i} msg={msg} />)}
        </div>
      )}
    </div>
  );
}

// ─── Message list ─────────────────────────────────────────────────────────────

function MessageList({ messages, transcript, transcriptEventText }) {
  const bottomRef = useRef(null);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto"
      style={{ padding: '24px 24px 8px', display: 'flex', flexDirection: 'column', gap: 20, overscrollBehavior: 'none' }}
    >
      {transcript?.length > 0 && (
        <>
          <TranscriptBlock messages={transcript} />
          {transcriptEventText && <SystemEvent text={transcriptEventText} />}
        </>
      )}
      {messages.map((msg, i) => renderMsg(msg, i))}
      <div ref={bottomRef} />
    </div>
  );
}

// ─── @mention picker ──────────────────────────────────────────────────────────

function MentionPicker({ query, onSelect }) {
  const filtered = KNOWN_AGENTS.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );
  if (!filtered.length) return null;
  return (
    <div style={{
      position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 4,
      background: 'white', border: '1px solid #EDEAE9', borderRadius: 8,
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: '4px 0', zIndex: 200,
    }}>
      {filtered.map(agent => (
        <button
          key={agent.name}
          type="button"
          onMouseDown={e => { e.preventDefault(); onSelect(agent); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <img
            src={`https://placehold.co/24x24/${agent.bg}/ffffff?text=${agent.initials}`}
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            alt={agent.name}
          />
          <span style={{ fontSize: 13, color: '#1E1F21', fontWeight: 500 }}>{agent.name}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Compose bar ──────────────────────────────────────────────────────────────

const SEND_OPTIONS = [
  { id: 'all',      label: 'Send to all' },
  { id: 'internal', label: 'Send internally' },
];

function ComposeBar({
  value, onChange, onSend, onKeyDown, placeholder = 'Reply or add a note...',
  mentionedAgent, onRemoveMention, onSelectAgent,
  showMentionPicker, mentionQuery,
  onSendPublic,
}) {
  const [showSendMenu, setShowSendMenu] = useState(false);
  const [sendMode, setSendMode] = useState('all');
  const sendMenuRef = useRef(null);

  // Auto-switch to internal when an @mention is added
  useEffect(() => {
    if (mentionedAgent) setSendMode('internal');
  }, [!!mentionedAgent]);

  function handleMainSend() {
    if (sendMode === 'all') onSendPublic();
    else onSend();
  }

  // Close send menu on outside click
  useEffect(() => {
    if (!showSendMenu) return;
    function handler(e) {
      if (!sendMenuRef.current?.contains(e.target)) setShowSendMenu(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSendMenu]);

  return (
    <div className="shrink-0 px-6 py-3" style={{ borderTop: '1px solid #EDEAE9', position: 'relative' }}>
      {/* @mention floating picker */}
      {showMentionPicker && (
        <MentionPicker query={mentionQuery} onSelect={onSelectAgent} />
      )}

      <div
        className="flex items-center gap-2"
        style={{
          minHeight: 44,
          border: '1px solid #EDEAE9',
          borderRadius: 8,
          padding: '4px 6px 4px 10px',
          background: 'white',
          gap: 8,
        }}
      >
        <PhotoAvatar bg="6d8aad" fg="ffffff" initials="SS" size={24} />

        {/* Mention chip */}
        {mentionedAgent && <MentionToken agent={mentionedAgent} onRemove={onRemoveMention} />}

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 border-0 bg-transparent outline-none"
          style={{ fontSize: 14, color: '#1E1F21', minWidth: 0 }}
        />

        {/* Send split button */}
        <div
          ref={sendMenuRef}
          className="flex items-center shrink-0"
          style={{ borderRadius: 6, border: '1px solid #C9C9C8', overflow: 'visible', position: 'relative' }}
        >
          <button
            type="button"
            onClick={handleMainSend}
            className="cursor-pointer border-0 transition-colors"
            style={{
              height: 28, padding: '0 10px', fontSize: 12, fontWeight: 500,
              background: 'white', color: '#1E1F21', borderRadius: '5px 0 0 5px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            {SEND_OPTIONS.find(o => o.id === sendMode).label}
          </button>
          <div style={{ width: 1, height: 16, background: '#C9C9C8', flexShrink: 0 }} />
          <button
            type="button"
            aria-label="More send options"
            onClick={() => setShowSendMenu(v => !v)}
            className="cursor-pointer border-0 flex items-center justify-center transition-colors"
            style={{ height: 28, width: 24, background: 'white', color: '#6D6E6F', borderRadius: '0 5px 5px 0' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <ChevronDownTiny />
          </button>

          {/* Dropdown menu */}
          {showSendMenu && (
            <div style={{
              position: 'absolute', bottom: 32, right: 0,
              background: 'white', border: '1px solid #EDEAE9', borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              padding: '4px 0', minWidth: 160, zIndex: 300,
            }}>
              {SEND_OPTIONS.map(({ id, label }) => {
                const selected = sendMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setSendMode(id); setShowSendMenu(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                      padding: '7px 12px', fontSize: 13, border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontWeight: selected ? 500 : 400,
                      color: '#1E1F21', background: selected ? '#F5F5F4' : 'none',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EFEFEE'}
                    onMouseLeave={e => e.currentTarget.style.background = selected ? '#F5F5F4' : 'none'}
                  >
                    <span style={{ width: 14, flexShrink: 0, color: '#4573D2', fontSize: 12 }}>
                      {selected ? '✓' : ''}
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AI Agent Panel ───────────────────────────────────────────────────────────

function AIAgentPanel({ ticket }) {
  const intentData = ticket?.id ? AI_INTENT[ticket.id] : null;
  const category = ticket?.category ?? 'General';
  const kbRefIds = AI_KB_REFS[category] ?? [];
  const kbArticles = kbRefIds.map(id => KB_ARTICLES.find(a => a.id === id)).filter(Boolean);

  const [aiMessages, setAiMessages] = useState([]);
  const [askInput, setAskInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (aiMessages.length > 0) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [aiMessages.length]);

  function handleAsk() {
    const text = askInput.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const match =
      AI_CHAT_RESPONSES.find(r => r.keywords.length > 0 && r.keywords.some(k => lower.includes(k))) ??
      AI_CHAT_RESPONSES.find(r => r.keywords.length === 0);
    setAiMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'ai', text: match.response },
    ]);
    setAskInput('');
  }

  function handleAskKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, overscrollBehavior: 'none' }}
      >
        {intentData && (
          <div style={{ borderRadius: 8, border: '1px solid #E8F0FF', background: '#F7F9FF', padding: '12px 14px' }}>
            <div className="flex items-center gap-1.5" style={{ marginBottom: 8 }}>
              <AiSparkleIcon color="#4573D2" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4573D2', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Intent</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1E1F21', margin: '0 0 6px', lineHeight: '20px' }}>
              {intentData.intent}
            </p>
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#6D6E6F' }}>{intentData.confidence}% confidence</span>
              {intentData.tags.map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: '#EEF4FF', color: '#4573D2', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: 12, padding: '2px 9px', borderRadius: 100, background: '#FEF3C7', color: '#92400E', fontWeight: 500 }}>
                {intentData.sentiment}
              </span>
              <span style={{ fontSize: 12, padding: '2px 9px', borderRadius: 100, background: '#FEE2E2', color: '#DC2626', fontWeight: 500 }}>
                {intentData.urgency}
              </span>
            </div>
          </div>
        )}

        {kbArticles.length > 0 && (
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1E1F21', display: 'block', marginBottom: 8 }}>
              Knowledge base
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {kbArticles.map(article => (
                <div
                  key={article.id}
                  className="flex items-center gap-2"
                  style={{ padding: '7px 10px', borderRadius: 6, background: '#F5F5F4', cursor: 'default' }}
                >
                  <DocIcon />
                  <span style={{ flex: 1, fontSize: 13, color: '#1E1F21', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title}
                  </span>
                  <span style={{ fontSize: 11, color: '#6D6E6F', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {article.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiMessages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiMessages.map((msg, i) =>
              msg.role === 'user' ? (
                <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    maxWidth: '80%', background: '#F5F5F4', borderRadius: '10px 10px 2px 10px',
                    padding: '8px 12px', fontSize: 13, color: '#1E1F21', lineHeight: '20px',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#EEF4FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <AiSparkleIcon color="#4573D2" />
                  </div>
                  <div style={{
                    maxWidth: '85%', background: '#EEF4FF', borderRadius: '10px 10px 10px 2px',
                    padding: '8px 12px', fontSize: 13, color: '#1E1F21', lineHeight: '20px',
                  }}>
                    {msg.text}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div style={{ height: 4, flexShrink: 0 }} />
      </div>

      <div className="shrink-0 px-4 py-3" style={{ borderTop: '1px solid #EDEAE9' }}>
        <div
          className="flex items-center gap-2"
          style={{ height: 38, border: '1px solid #EDEAE9', borderRadius: 8, padding: '0 6px 0 12px', background: 'white' }}
        >
          <input
            type="text"
            placeholder="Ask anything about this ticket..."
            value={askInput}
            onChange={e => setAskInput(e.target.value)}
            onKeyDown={handleAskKeyDown}
            className="flex-1 border-0 bg-transparent outline-none"
            style={{ fontSize: 13, color: '#1E1F21' }}
          />
          <button
            type="button"
            onClick={handleAsk}
            aria-label="Send"
            className="flex items-center justify-center cursor-pointer border-0 flex-shrink-0 transition-colors"
            style={{ width: 26, height: 26, borderRadius: 6, background: askInput.trim() ? '#4573D2' : '#F5F5F4' }}
          >
            <SendUpIcon active={!!askInput.trim()} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TicketChatPanel ──────────────────────────────────────────────────────────

export default function TicketChatPanel({
  ticket,
  externalEvents = [],
  commentOnly = false,
  notesMode = false,
  initPublic = [],
  initInternal = [],
  initTranscript = [],
  transcriptEventText,
}) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    ...initPublic,
    ...initInternal.map(m => ({ ...m, isPrivate: true })),
  ]);
  const [input, setInput] = useState('');
  const [mentionedAgent, setMentionedAgent] = useState(null);
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [replySuggDismissed, setReplySuggDismissed] = useState(false);
  const prevExternalLenRef = useRef(0);

  useEffect(() => {
    setReplySuggDismissed(false);
  }, [ticket?.id]);

  useEffect(() => {
    if (externalEvents.length > prevExternalLenRef.current) {
      const newEvents = externalEvents.slice(prevExternalLenRef.current);
      setMessages(m => [...m, ...newEvents]);
      prevExternalLenRef.current = externalEvents.length;
    }
  }, [externalEvents]);

  const suggestedReply = ticket?.id ? AI_SUGGESTED_REPLY[ticket.id] : null;
  const showSuggestedReply = !!suggestedReply && !replySuggDismissed && !commentOnly && activeTab === 'chat';

  function handleTabSelect(tab) {
    setInput('');
    setMentionedAgent(null);
    setShowMentionPicker(false);
    setActiveTab(tab);
  }

  function handleInputChange(text) {
    setInput(text);
    // Detect @mention trigger at end of input
    const match = text.match(/@(\w*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setShowMentionPicker(true);
    } else {
      setShowMentionPicker(false);
      setMentionQuery('');
    }
  }

  function handleSelectAgent(agent) {
    // Remove @query from input text
    const newText = input.replace(/@\w*$/, '').trimEnd();
    setInput(newText);
    setMentionedAgent(agent);
    setShowMentionPicker(false);
    setMentionQuery('');
  }

  function handleRemoveMention() {
    setMentionedAgent(null);
    setShowMentionPicker(false);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const msg = {
      type: 'outbound',
      isAi: false,
      isPrivate: !!mentionedAgent,
      mentionedAgent: mentionedAgent || undefined,
      text,
      senderLabel: 'You',
      time: 'just now',
    };
    setMessages(m => [...m, msg]);
    setInput('');
    setMentionedAgent(null);
    setShowMentionPicker(false);
  }

  function handleSendPublic() {
    const text = input.trim();
    if (!text) return;
    const msg = { type: 'outbound', isAi: false, text, senderLabel: 'You', time: 'just now' };
    setMessages(m => [...m, msg]);
    setInput('');
    setMentionedAgent(null);
    setShowMentionPicker(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setShowMentionPicker(false);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && !showMentionPicker) {
      e.preventDefault();
      handleSend();
    }
  }

  if (notesMode) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-white">
        <div className="shrink-0 flex items-center px-6" style={{ height: 44, borderBottom: '1px solid #EDEAE9' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1E1F21' }}>Chat</span>
        </div>
        <MessageList messages={messages} />
        <ComposeBar
          value={input}
          onChange={handleInputChange}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          mentionedAgent={mentionedAgent}
          onRemoveMention={handleRemoveMention}
          onSelectAgent={handleSelectAgent}
          showMentionPicker={showMentionPicker}
          mentionQuery={mentionQuery}
          onSendPublic={handleSendPublic}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <ChatTabBar active={activeTab} onSelect={handleTabSelect} viewOnly={commentOnly} />

      {activeTab === 'chat' && (
        <>
          <MessageList messages={messages} transcript={initTranscript} transcriptEventText={transcriptEventText} />
          {/* Suggested reply */}
          {showSuggestedReply && (
            <div
              className="shrink-0"
              style={{ borderTop: '1px solid #E8F0FF', background: '#F7F9FF', padding: '10px 16px 12px' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <div className="flex items-center gap-1.5">
                  <AiSparkleIcon color="#4573D2" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#4573D2', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Suggested reply</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplySuggDismissed(true)}
                  aria-label="Dismiss suggestion"
                  style={{ fontSize: 13, lineHeight: 1, color: '#9ea0a2', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6D6E6F'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ea0a2'}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#1E1F21', lineHeight: '19px', margin: '0 0 10px' }}>
                {suggestedReply}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setInput(suggestedReply)}
                  style={{ fontSize: 12, fontWeight: 500, color: '#4573D2', background: '#EEF4FF', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#DBEAFE'}
                  onMouseLeave={e => e.currentTarget.style.background = '#EEF4FF'}
                >
                  Use reply
                </button>
              </div>
            </div>
          )}
          {!commentOnly && (
            <ComposeBar
              value={input}
              onChange={handleInputChange}
              onSend={handleSend}
              onKeyDown={handleKeyDown}
              mentionedAgent={mentionedAgent}
              onRemoveMention={handleRemoveMention}
              onSelectAgent={handleSelectAgent}
              showMentionPicker={showMentionPicker}
              mentionQuery={mentionQuery}
              onSendPublic={handleSendPublic}
            />
          )}
        </>
      )}

      {activeTab === 'ai' && (
        <AIAgentPanel ticket={ticket} />
      )}
    </div>
  );
}
