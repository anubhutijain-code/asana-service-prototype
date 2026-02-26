import { useState, useRef, useEffect } from 'react';
import Pill from './Pill';

// ─── Icons ────────────────────────────────────────────────────────────────────

function UsersIcon({ color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M8 7C9.9295 7 11.5 5.43 11.5 3.5C11.5 1.57 9.9295 0 8 0C6.0705 0 4.5 1.57 4.5 3.5C4.5 5.43 6.0705 7 8 7ZM8 1C9.3785 1 10.5 2.1215 10.5 3.5C10.5 4.8785 9.3785 6 8 6C6.6215 6 5.5 4.8785 5.5 3.5C5.5 2.1215 6.6215 1 8 1ZM12 10.5V11.5C12 11.6326 11.9473 11.7598 11.8536 11.8536C11.7598 11.9473 11.6326 12 11.5 12C11.3674 12 11.2402 11.9473 11.1464 11.8536C11.0527 11.7598 11 11.6326 11 11.5V10.5C11 9.673 10.327 9 9.5 9H6.5C5.673 9 5 9.673 5 10.5V11.5C5 11.6326 4.94732 11.7598 4.85355 11.8536C4.75979 11.9473 4.63261 12 4.5 12C4.36739 12 4.24021 11.9473 4.14645 11.8536C4.05268 11.7598 4 11.6326 4 11.5V10.5C4 9.1215 5.1215 8 6.5 8H9.5C10.8785 8 12 9.1215 12 10.5ZM0.5 3.5C0.5 1.57 2.0705 0 4 0C4.13261 0 4.25979 0.0526784 4.35355 0.146447C4.44732 0.240215 4.5 0.367392 4.5 0.5C4.5 0.632608 4.44732 0.759785 4.35355 0.853553C4.25979 0.947322 4.13261 1 4 1C2.6215 1 1.5 2.1215 1.5 3.5C1.5 4.8785 2.6215 6 4 6C4.13261 6 4.25979 6.05268 4.35355 6.14645C4.44732 6.24021 4.5 6.36739 4.5 6.5C4.5 6.63261 4.44732 6.75979 4.35355 6.85355C4.25979 6.94732 4.13261 7 4 7C2.0705 7 0.5 5.43 0.5 3.5ZM3.5 8.5C3.5 8.63261 3.44732 8.75979 3.35355 8.85355C3.25979 8.94732 3.13261 9 3 9H2.5C1.673 9 1 9.673 1 10.5V11.5C1 11.6326 0.947322 11.7598 0.853553 11.8536C0.759785 11.9473 0.632608 12 0.5 12C0.367392 12 0.240215 11.9473 0.146447 11.8536C0.0526784 11.7598 0 11.6326 0 11.5V10.5C0 9.1215 1.1215 8 2.5 8H3C3.13261 8 3.25979 8.05268 3.35355 8.14645C3.44732 8.24021 3.5 8.36739 3.5 8.5Z" />
    </svg>
  );
}

function LockIcon({ color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M9.5 4H9V3C9 1.3455 7.6545 0 6 0C4.3455 0 3 1.3455 3 3V4H2.5C1.673 4 1 4.673 1 5.5V9.5C1 10.327 1.673 11 2.5 11H9.5C10.327 11 11 10.327 11 9.5V5.5C11 4.673 10.327 4 9.5 4ZM4 3C4 1.897 4.897 1 6 1C7.103 1 8 1.897 8 3V4H4V3ZM10 9.5C10 9.7755 9.776 10 9.5 10H2.5C2.224 10 2 9.7755 2 9.5V5.5C2 5.2245 2.224 5 2.5 5H9.5C9.776 5 10 5.2245 10 5.5V9.5Z" />
    </svg>
  );
}

function AiSparkleIcon({ color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill={color} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M8.8125 0H8.1875C8.1875 0.580161 7.95703 1.13656 7.5468 1.5468C7.13656 1.95703 6.58016 2.1875 6 2.1875V2.8125C6.58016 2.8125 7.13656 3.04297 7.5468 3.4532C7.95703 3.86344 8.1875 4.41984 8.1875 5H8.8125C8.8125 4.41984 9.04297 3.86344 9.4532 3.4532C9.86344 3.04297 10.4198 2.8125 11 2.8125V2.1875C10.4198 2.1875 9.86344 1.95703 9.4532 1.5468C9.04297 1.13656 8.8125 0.580161 8.8125 0ZM6.5 5.125C4.8335 5.125 3.875 4.1665 3.875 2.5H3.125C3.125 4.1665 2.1665 5.125 0.5 5.125V5.875C2.1665 5.875 3.125 6.8335 3.125 8.5H3.875C3.875 6.8335 4.8335 5.875 6.5 5.875V5.125ZM7.8125 7H7.1875C7.1875 7.28727 7.13092 7.57172 7.02099 7.83712C6.91105 8.10252 6.74992 8.34367 6.5468 8.5468C6.34367 8.74992 6.10252 8.91105 5.83712 9.02099C5.57172 9.13092 5.28727 9.1875 5 9.1875V9.8125C5.58016 9.8125 6.13656 10.043 6.5468 10.4532C6.95703 10.8634 7.1875 11.4198 7.1875 12H7.8125C7.8125 11.4198 8.04297 10.8634 8.4532 10.4532C8.86344 10.043 9.41984 9.8125 10 9.8125V9.1875C9.41984 9.1875 8.86344 8.95703 8.4532 8.5468C8.04297 8.13656 7.8125 7.58016 7.8125 7Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M7.99805 2C7.73283 2 7.47848 2.10536 7.29094 2.29289C7.1034 2.48043 6.99805 2.73478 6.99805 3V7H2.99805C2.73283 7 2.47848 7.10536 2.29094 7.29289C2.1034 7.48043 1.99805 7.73478 1.99805 8C1.99805 8.26522 2.1034 8.51957 2.29094 8.70711C2.47848 8.89464 2.73283 9 2.99805 9H6.99805V13C6.99805 13.2652 7.1034 13.5196 7.29094 13.7071C7.47848 13.8946 7.73283 14 7.99805 14C8.26326 14 8.51762 13.8946 8.70515 13.7071C8.89269 13.5196 8.99805 13.2652 8.99805 13V9H12.998C13.2633 9 13.5176 8.89464 13.7052 8.70711C13.8927 8.51957 13.998 8.26522 13.998 8C13.998 7.73478 13.8927 7.48043 13.7052 7.29289C13.5176 7.10536 13.2633 7 12.998 7H8.99805V3C8.99805 2.73478 8.89269 2.48043 8.70515 2.29289C8.51762 2.10536 8.26326 2 7.99805 2Z" />
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

// Chevron that rotates: down when open, right when closed
function TranscriptChevron({ open }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true"
      style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
      <path d="M9.09175 3.92542L5.99875 6.52092L2.90575 3.92542C2.75338 3.79758 2.55647 3.73551 2.35834 3.75286C2.16021 3.77021 1.97708 3.86555 1.84925 4.01792C1.72141 4.17029 1.65934 4.36719 1.67669 4.56533C1.69404 4.76346 1.78938 4.94658 1.94175 5.07442L5.51675 8.07442C5.65172 8.1879 5.82241 8.25011 5.99875 8.25011C6.17509 8.25011 6.34577 8.1879 6.48075 8.07442L10.0557 5.07442C10.2047 4.94558 10.2971 4.7633 10.3128 4.56695C10.3285 4.37061 10.2663 4.17597 10.1397 4.02507C10.0131 3.87418 9.83224 3.77914 9.63615 3.76049C9.44007 3.74185 9.24452 3.80109 9.09175 3.92542Z" />
    </svg>
  );
}

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

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const CHAT_TABS = [
  { id: 'public',   label: 'Public chat',   icon: UsersIcon },
  { id: 'internal', label: 'Internal chat', icon: LockIcon },
  { id: 'ai',       label: 'AI Agent',      icon: AiSparkleIcon },
];

function ChatTabBar({ active, onSelect, viewOnly = false }) {
  return (
    <div
      className="shrink-0 flex items-end gap-5 px-6"
      style={{ height: 44, borderBottom: '1px solid #EDEAE9' }}
    >
      {CHAT_TABS.map(({ id, label, icon: Icon }) => {
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
            <Icon color={isActive ? '#1E1F21' : '#6D6E6F'} />
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

function OutboundBubble({ text, senderLabel, time, avatar }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 8 }}>
      <div style={{
        background: '#F5F5F4', borderRadius: 12, padding: '12px 14px',
        maxWidth: '65%', display: 'flex', flexDirection: 'column', gap: 8,
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
  if (msg.type === 'inbound') {
    return <InboundMessage key={i} text={msg.text} name={msg.name} time={msg.time} bg={msg.bg} fg={msg.fg} initials={msg.initials} svgSrc={msg.svgSrc} />;
  }
  return (
    <OutboundBubble
      key={i}
      text={msg.text}
      senderLabel={msg.senderLabel}
      time={msg.time}
      avatar={msg.isAi
        ? <AiAvatar size={32} />
        : <PhotoAvatar bg="6d8aad" fg="ffffff" initials="SS" size={32} />
      }
    />
  );
}

// ─── Compact log message (transcript only) ───────────────────────────────────
// All messages left-aligned, no bubbles, muted colors. Avatar 24px.
// Signals read-only archived context vs active conversation.

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

// ─── Collapsible prior-chat transcript block ──────────────────────────────────
// Header row matches the SystemEvent ─── text ─── style, but is a clickable
// button. Expanding reveals the prior messages inline below the divider.

function TranscriptBlock({ messages }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Header row — same visual as SystemEvent but clickable ── */}
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

      {/* ── Expanded compact log ── */}
      {open && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 14,
          background: '#F9F8F8', borderRadius: 8, padding: '14px 16px',
        }}>
          {messages.map((msg, i) => <TranscriptMessage key={i} msg={msg} />)}
        </div>
      )}
    </div>
  );
}

// ─── Message list (scrolls to bottom on new messages) ────────────────────────

function MessageList({ messages, transcript, transcriptEventText }) {
  const bottomRef = useRef(null);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {
    // Only scroll to bottom when a NEW message is added (not on initial render)
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

// ─── Comment input bar ────────────────────────────────────────────────────────

function CommentBar({ value, onChange, onSend, onKeyDown, placeholder = 'Add a comment...' }) {
  return (
    <div className="shrink-0 px-6 py-3" style={{ borderTop: '1px solid #EDEAE9' }}>
      <div
        className="flex items-center gap-3"
        style={{ height: 44, border: '1px solid #EDEAE9', borderRadius: 8, padding: '0 8px 0 12px', background: 'white' }}
      >
        <PhotoAvatar bg="6d8aad" fg="ffffff" initials="SS" size={24} />

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 border-0 bg-transparent outline-none"
          style={{ fontSize: 14, color: '#1E1F21' }}
        />

        <div
          className="flex items-center shrink-0"
          style={{ borderRadius: 6, border: '1px solid #C9C9C8', overflow: 'hidden' }}
        >
          <button
            type="button"
            onClick={onSend}
            className="cursor-pointer border-0 transition-colors"
            style={{ height: 28, padding: '0 10px', fontSize: 12, fontWeight: 500, background: 'white', color: '#1E1F21' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            Send
          </button>
          <div style={{ width: 1, height: 16, background: '#C9C9C8' }} />
          <button
            type="button"
            aria-label="More send options"
            className="cursor-pointer border-0 flex items-center justify-center transition-colors"
            style={{ height: 28, width: 24, background: 'white', color: '#6D6E6F' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <ChevronDownTiny />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TicketChatPanel ──────────────────────────────────────────────────────────

export default function TicketChatPanel({ externalEvents = [], commentOnly = false, notesMode = false, initPublic = [], initInternal = [], initTranscript = [], transcriptEventText }) {
  const [activeTab, setActiveTab] = useState('public');
  const [publicMessages,   setPublicMessages]   = useState(initPublic);
  const [internalMessages, setInternalMessages] = useState(initInternal);
  const [input, setInput] = useState('');
  const prevExternalLenRef = useRef(0);

  useEffect(() => {
    if (externalEvents.length > prevExternalLenRef.current) {
      const newEvents = externalEvents.slice(prevExternalLenRef.current);
      setPublicMessages(m => [...m, ...newEvents]);
      prevExternalLenRef.current = externalEvents.length;
    }
  }, [externalEvents]);

  function handleTabSelect(tab) {
    setInput('');
    setActiveTab(tab);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const msg = { type: 'outbound', isAi: false, text, senderLabel: 'You', time: 'just now' };
    if (notesMode || activeTab === 'internal') setInternalMessages(m => [...m, msg]);
    else if (activeTab === 'public') setPublicMessages(m => [...m, msg]);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (notesMode) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-white">
        <div className="shrink-0 flex items-center px-6" style={{ height: 44, borderBottom: '1px solid #EDEAE9' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1E1F21' }}>Internal chat</span>
        </div>
        <MessageList messages={internalMessages} />
        <CommentBar value={input} onChange={setInput} onSend={handleSend} onKeyDown={handleKeyDown} placeholder="Add a comment..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <ChatTabBar active={activeTab} onSelect={handleTabSelect} viewOnly={commentOnly} />

      {activeTab === 'public' && (
        <>
          <MessageList messages={publicMessages} transcript={initTranscript} transcriptEventText={transcriptEventText} />
          {!commentOnly && <CommentBar value={input} onChange={setInput} onSend={handleSend} onKeyDown={handleKeyDown} />}
        </>
      )}

      {activeTab === 'internal' && (
        <>
          <MessageList messages={internalMessages} />
          {!commentOnly && <CommentBar value={input} onChange={setInput} onSend={handleSend} onKeyDown={handleKeyDown} />}
        </>
      )}

      {activeTab === 'ai' && (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <p style={{ fontSize: 14, color: '#9ea0a2' }}>AI Agent — coming soon</p>
        </div>
      )}
    </div>
  );
}
