import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pill from './Pill';
import { AI_INTENT, AI_KB_REFS, AI_SUGGESTED_REPLY, AI_CHAT_RESPONSES } from '../data/aiAssist';
import { KB_ARTICLES, KB_DRAFTS, KB_LEARNINGS, TICKET_DRAFT_MAP, TICKET_LEARNING_MAP, LEARNING_DRAFT_MAP } from '../data/knowledgeBase';
import WorkflowStepsPanel from './WorkflowStepsPanel';

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

function WorkflowIcon({ color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="2" cy="2.5" r="1.2" />
      <circle cx="2" cy="9.5" r="1.2" />
      <circle cx="10" cy="6" r="1.2" />
      <path d="M3.2 2.5h2.5a1 1 0 011 1v1.3M3.2 9.5h2.5a1 1 0 001-1V7.2" />
      <path d="M6.7 6H8.8" />
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
    <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--icon)' }}>
      <path d="M7.5 0H2C1.4477 0 1 0.4477 1 1V11C1 11.5523 1.4477 12 2 12H10C10.5523 12 11 11.5523 11 11V3.5L7.5 0ZM7.5 1.207L9.793 3.5H7.5V1.207ZM10 11H2V1H6.5V4H10V11ZM3 5.5H9V6.5H3V5.5ZM3 7.5H9V8.5H3V7.5ZM3 9.5H7V10.5H3V9.5Z" />
    </svg>
  );
}

function SendUpIcon({ active }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill={active ? 'white' : 'var(--text-disabled)'} aria-hidden="true">
      <path d="M6 1L6 11M6 1L2 5M6 1L10 5" stroke={active ? 'white' : 'var(--text-disabled)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
      borderRadius: 4, background: 'var(--background-strong)', overflow: 'hidden', flexShrink: 0,
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
        fontSize: 12, color: 'var(--text)', fontFamily: SFT,
        padding: '0 6px', whiteSpace: 'nowrap', lineHeight: '24px',
      }}>
        {agent.name}
      </span>
      {/* Remove button — only when interactive */}
      {onRemove && (
        <>
          <div style={{ width: 1, height: 14, background: 'var(--border)', flexShrink: 0 }} />
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); onRemove(); }}
            style={{
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, lineHeight: 1, color: 'var(--icon)', background: 'none', border: 'none',
              cursor: 'pointer', flexShrink: 0, fontFamily: SFT,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
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

const CHAT_TABS_BASE = [
  { id: 'chat', label: 'Chat' },
  { id: 'ai',   label: 'AI Agent' },
];

function ChatTabBarMoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="4"  cy="8" r="1.5" />
      <circle cx="8"  cy="8" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
    </svg>
  );
}

function ChatTabBar({ active, onSelect, tabs = CHAT_TABS_BASE, viewOnly = false, moreMenuItems = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function down(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [menuOpen]);

  return (
    <div
      className="shrink-0 flex items-end gap-5 px-6"
      style={{ height: 44, borderBottom: '1px solid var(--border)' }}
    >
      {tabs.map(({ id, label }) => {
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
              color: isActive ? 'var(--text)' : 'var(--icon)',
              borderBottom: isActive ? '2px solid var(--text)' : '2px solid transparent',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {id === 'ai'       && <AiSparkleIcon color={isActive ? 'var(--text)' : 'var(--icon)'} />}
            {id === 'workflow' && <WorkflowIcon  color={isActive ? 'var(--text)' : 'var(--icon)'} />}
            {label}
          </button>
        );
      })}
      <div className="ml-auto flex items-center gap-2 mb-1">
        {viewOnly && <Pill label="View only" icon={<LockIcon color="var(--icon)" />} bg="#F3F4F6" color="var(--icon)" />}
        {moreMenuItems.length > 0 && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              type="button"
              aria-label="More options"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: 6, cursor: 'pointer', color: 'var(--icon)',
                background: menuOpen ? 'var(--background-medium)' : 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
              onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
            >
              <ChatTabBarMoreIcon />
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                border: '1px solid var(--border)', borderRadius: 6,
                boxShadow: 'var(--shadow-md)', background: 'var(--surface)',
                zIndex: 50, minWidth: 228, padding: '4px 0',
              }}>
                {moreMenuItems.map((item, i) =>
                  item.divider ? (
                    <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setMenuOpen(false); item.onClick?.(); }}
                      style={{
                        display: 'block', width: '100%', padding: '7px 12px',
                        border: 'none', background: 'transparent', textAlign: 'left',
                        fontSize: 13, color: item.blue ? 'var(--selected-text)' : 'var(--text)', cursor: 'pointer',
                        fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Message components ───────────────────────────────────────────────────────

const BUBBLE_WIDTH = '72%';

function OutboundBubble({ text, senderLabel, time, avatar }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 8 }}>
      <div style={{
        background: 'var(--background-medium)', borderRadius: 12, padding: '12px 14px',
        width: BUBBLE_WIDTH, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <span style={{ fontSize: 12, color: 'var(--icon)' }}>{senderLabel}</span>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{time}</span>
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
        background: 'var(--warning-background)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '10px 14px',
        width: BUBBLE_WIDTH,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Token + message on same line when someone is mentioned */}
        {mentionedAgent ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
            <MentionToken agent={mentionedAgent} />
            <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap', flex: 1, minWidth: 0 }}>{text}</p>
          </div>
        ) : (
          <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
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
            <span style={{ fontSize: 12, color: 'var(--icon)' }}>{senderLabel}</span>
            <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{time}</span>
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
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 12, color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

function InboundMessage({ text, name, time, bg, fg, initials, svgSrc }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PhotoAvatar bg={bg} fg={fg} initials={initials} size={32} svgSrc={svgSrc} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: '18px' }}>{name}</span>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', lineHeight: '16px' }}>{time}</span>
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
      <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 12 }}>
        <p style={{ fontSize: 12, lineHeight: '18px', color: 'var(--text-disabled)', margin: 0, fontStyle: 'italic' }}>{msg.text}</p>
      </div>
    );
  }
  const isBot = msg.type === 'outbound';
  const name = isBot ? msg.senderLabel : msg.name;
  return (
    <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--icon)' }}>{name}</span>
        <span style={{ fontSize: 11, color: '#C4C4C4' }}>{msg.time}</span>
      </div>
      <p style={{ fontSize: 13, lineHeight: '20px', color: 'var(--icon)', margin: 0 }}>{msg.text}</p>
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
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-disabled)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
          Prior conversation · {messages.length} messages
          <TranscriptChevron open={open} />
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
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
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
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
          onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <img
            src={`https://placehold.co/24x24/${agent.bg}/ffffff?text=${agent.initials}`}
            style={{ width: 24, height: 24, borderRadius: '50%' }}
            alt={agent.name}
          />
          <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{agent.name}</span>
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
    <div className="shrink-0 px-6 py-3" style={{ borderTop: '1px solid var(--border)', position: 'relative' }}>
      {/* @mention floating picker */}
      {showMentionPicker && (
        <MentionPicker query={mentionQuery} onSelect={onSelectAgent} />
      )}

      <div
        className="flex items-center gap-2"
        style={{
          minHeight: 44,
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '4px 6px 4px 10px',
          background: 'var(--surface)',
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
          style={{ fontSize: 14, color: 'var(--text)', minWidth: 0 }}
        />

        {/* Send split button */}
        <div
          ref={sendMenuRef}
          className="flex items-center shrink-0"
          style={{ borderRadius: 6, border: '1px solid var(--border)', overflow: 'visible', position: 'relative' }}
        >
          <button
            type="button"
            onClick={handleMainSend}
            className="cursor-pointer border-0 transition-colors"
            style={{
              height: 28, padding: '0 10px', fontSize: 12, fontWeight: 500,
              background: 'var(--surface)', color: 'var(--text)', borderRadius: '5px 0 0 5px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            {SEND_OPTIONS.find(o => o.id === sendMode).label}
          </button>
          <div style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }} />
          <button
            type="button"
            aria-label="More send options"
            onClick={() => setShowSendMenu(v => !v)}
            className="cursor-pointer border-0 flex items-center justify-center transition-colors"
            style={{ height: 28, width: 24, background: 'var(--surface)', color: 'var(--icon)', borderRadius: '0 5px 5px 0' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            <ChevronDownTiny />
          </button>

          {/* Dropdown menu */}
          {showSendMenu && (
            <div style={{
              position: 'absolute', bottom: 32, right: 0,
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
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
                      color: 'var(--text)', background: selected ? 'var(--background-medium)' : 'none',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
                    onMouseLeave={e => e.currentTarget.style.background = selected ? 'var(--background-medium)' : 'none'}
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

// ─── KB Article Panel (with "Did this help?" + draft callout) ────────────────

const SOURCE_ICON_CFG = {
  sharepoint: { label: 'SharePoint',  bg: '#EBF3FB', color: '#0078D4' },
  gdrive:     { label: 'Google Drive', bg: '#E8F0FE', color: '#1A73E8' },
  internal:   null,
};

function ArticleSourceBadge({ source }) {
  const cfg = source ? SOURCE_ICON_CFG[source] : null;
  if (!cfg) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
      background: cfg.bg, color: cfg.color, flexShrink: 0, whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

function WebRefRow({ webRef }) {
  return (
    <a
      href={webRef.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 10px', borderRadius: 6, background: 'var(--background-medium)',
        textDecoration: 'none', transition: 'background 0.1s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
    >
      {/* Globe icon */}
      <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="var(--icon)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="5.5"/>
        <path d="M7 1.5C7 1.5 5.5 3.5 5.5 7s1.5 5.5 1.5 5.5M7 1.5C7 1.5 8.5 3.5 8.5 7S7 12.5 7 12.5M1.5 7h11M2 4.5h10M2 9.5h10"/>
      </svg>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {webRef.title}
      </span>
      <span style={{
        fontSize: 10, color: 'var(--text-weak)', background: 'var(--background-weak)',
        padding: '1px 6px', borderRadius: 4, flexShrink: 0, fontWeight: 500,
      }}>
        {webRef.domain}
      </span>
    </a>
  );
}

function KBArticlePanel({ articles, webRefs = [], ticketId }) {
  const [feedback, setFeedback] = useState({}); // articleId → 'yes' | 'no'
  const draftId = ticketId ? TICKET_DRAFT_MAP[ticketId] : null;
  const draft = draftId ? KB_DRAFTS.find(d => d.id === draftId) : null;
  const learningId = ticketId ? TICKET_LEARNING_MAP[ticketId] : null;
  const learning = learningId ? KB_LEARNINGS.find(l => l.id === learningId) : null;

  return (
    <div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 8 }}>
        Knowledge base
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {articles.map(article => {
          const fb = feedback[article.id];
          return (
            <div key={article.id} style={{ borderRadius: 6, background: 'var(--background-medium)', overflow: 'hidden' }}>
              <div className="flex items-center gap-2" style={{ padding: '7px 10px' }}>
                <DocIcon />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {article.title}
                </span>
                <ArticleSourceBadge source={article.source} />
                <span style={{ fontSize: 11, color: 'var(--icon)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {article.category}
                </span>
              </div>
              {/* Did this help? */}
              {!fb ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px 7px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: 'inherit' }}>Did this solve it?</span>
                  {['yes', 'no'].map(val => (
                    <button key={val} type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, [article.id]: val }))}
                      style={{ height: 22, padding: '0 8px', fontSize: 11, borderRadius: 4, border: '1px solid var(--border)', cursor: 'pointer', background: 'var(--background-weak)', color: 'var(--text-weak)', transition: 'all 0.1s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-weak)'; }}
                    >
                      {val === 'yes' ? '👍 Yes' : '👎 No'}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '5px 10px 7px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: fb === 'yes' ? 'var(--success-text)' : 'var(--text-disabled)' }}>
                    {fb === 'yes' ? '✓ Marked as helpful' : '✗ Marked as not helpful — logged as gap signal'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {webRefs.map(ref => (
          <WebRefRow key={ref.id} webRef={ref} />
        ))}
      </div>

      {/* KB Draft callout — this ticket contributed to a draft */}
      {draft && (
        <div style={{
          marginTop: 10, borderRadius: 8,
          border: '1px solid var(--selected-background-strong)',
          background: 'var(--selected-background)',
          padding: '10px 12px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg viewBox="0 0 12 12" width="11" height="11" fill="var(--selected-background-strong)" aria-hidden="true">
              <path d="M6 0.5C6 0.5 6.4 3.1 7.5 4.5C8.6 5.9 11.5 6 11.5 6C11.5 6 8.6 6.1 7.5 7.5C6.4 8.9 6 11.5 6 11.5C6 11.5 5.6 8.9 4.5 7.5C3.4 6.1 0.5 6 0.5 6C0.5 6 3.4 5.9 4.5 4.5C5.6 3.1 6 0.5 6 0.5Z"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--selected-text)' }}>AI drafted a KB article from this resolution</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--selected-text)', margin: 0, lineHeight: '17px', opacity: 0.85 }}>
            "{draft.title}" — pending review in Knowledge Base
          </p>
        </div>
      )}

      {/* KB Learning callout — this ticket informed a KB gap/suggestion */}
      {learning && !draft && (
        <div style={{
          marginTop: 10, borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--background-medium)',
          padding: '10px 12px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg viewBox="0 0 12 12" width="11" height="11" fill="var(--text-disabled)" aria-hidden="true">
              <path d="M6 0.5C6 0.5 6.4 3.1 7.5 4.5C8.6 5.9 11.5 6 11.5 6C11.5 6 8.6 6.1 7.5 7.5C6.4 8.9 6 11.5 6 11.5C6 11.5 5.6 8.9 4.5 7.5C3.4 6.1 0.5 6 0.5 6C0.5 6 3.4 5.9 4.5 4.5C5.6 3.1 6 0.5 6 0.5Z"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-weak)' }}>Resolution informed a KB suggestion</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-weak)', margin: 0, lineHeight: '17px' }}>
            {learning.gap}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── AI Agent Panel ───────────────────────────────────────────────────────────

function AIAgentPanel({ ticket }) {
  const intentData = ticket?.id ? AI_INTENT[ticket.id] : null;
  const category = ticket?.category ?? 'General';
  const kbRefs = AI_KB_REFS[category] ?? [];
  const kbArticles = kbRefs
    .filter(r => typeof r === 'string')
    .map(id => KB_ARTICLES.find(a => a.id === id))
    .filter(Boolean);
  const webRefs = kbRefs.filter(r => typeof r === 'object' && r.type === 'web');

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
          <div style={{ borderRadius: 8, border: '1px solid var(--border)', background: 'var(--selected-background)', padding: '12px 14px' }}>
            <div className="flex items-center gap-1.5" style={{ marginBottom: 8 }}>
              <AiSparkleIcon color="var(--selected-background-strong)" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--selected-text)' }}>Intent</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: '0 0 6px', lineHeight: '20px' }}>
              {intentData.intent}
            </p>
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--icon)' }}>{intentData.confidence}% confidence</span>
              {intentData.tags.map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '1px 7px', borderRadius: 100, background: 'var(--selected-background)', color: 'var(--selected-text)', fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: 12, padding: '2px 9px', borderRadius: 100, background: 'var(--warning-background)', color: 'var(--warning-text)', fontWeight: 500 }}>
                {intentData.sentiment}
              </span>
              <span style={{ fontSize: 12, padding: '2px 9px', borderRadius: 100, background: 'var(--danger-background)', color: 'var(--danger-text)', fontWeight: 500 }}>
                {intentData.urgency}
              </span>
            </div>
          </div>
        )}

        {(kbArticles.length > 0 || webRefs.length > 0) && (
          <KBArticlePanel articles={kbArticles} webRefs={webRefs} ticketId={ticket?.id} />
        )}

        {aiMessages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiMessages.map((msg, i) =>
              msg.role === 'user' ? (
                <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    maxWidth: '80%', background: 'var(--background-medium)', borderRadius: '10px 10px 2px 10px',
                    padding: '8px 12px', fontSize: 13, color: 'var(--text)', lineHeight: '20px',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: 'var(--selected-background)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <AiSparkleIcon color="var(--selected-background-strong)" />
                  </div>
                  <div style={{
                    maxWidth: '85%', background: 'var(--selected-background)', borderRadius: '10px 10px 10px 2px',
                    padding: '8px 12px', fontSize: 13, color: 'var(--text)', lineHeight: '20px',
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

      <div className="shrink-0 px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div
          className="flex items-center gap-2"
          style={{ height: 38, border: '1px solid var(--border)', borderRadius: 8, padding: '0 6px 0 12px', background: 'var(--surface)' }}
        >
          <input
            type="text"
            placeholder="Ask anything about this ticket..."
            value={askInput}
            onChange={e => setAskInput(e.target.value)}
            onKeyDown={handleAskKeyDown}
            className="flex-1 border-0 bg-transparent outline-none"
            style={{ fontSize: 13, color: 'var(--text)' }}
          />
          <button
            type="button"
            onClick={handleAsk}
            aria-label="Send"
            className="flex items-center justify-center cursor-pointer border-0 flex-shrink-0 transition-colors"
            style={{ width: 26, height: 26, borderRadius: 6, background: askInput.trim() ? 'var(--selected-background-strong)' : 'var(--background-medium)' }}
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
  moreMenuItems = [],
  workflowCallbacks = null,
}) {
  const navigate = useNavigate();
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
      <div className="flex flex-col h-full overflow-hidden bg-[var(--surface)]">
        <div className="shrink-0 flex items-center px-6" style={{ height: 44, borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Chat</span>
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

  const hasWorkflow = ticket?.steps?.length > 0;
  const chatTabs = hasWorkflow
    ? [...CHAT_TABS_BASE, { id: 'workflow', label: 'Workflow' }]
    : CHAT_TABS_BASE;

  const learningId = ticket?.id ? TICKET_LEARNING_MAP[ticket.id] : null;
  const ticketLearning = learningId ? KB_LEARNINGS.find(l => l.id === learningId) : null;
  // Resolve draft: direct TICKET_DRAFT_MAP takes priority, then via LEARNING_DRAFT_MAP
  const directDraftId = ticket?.id ? TICKET_DRAFT_MAP[ticket.id] : null;
  const learningDraftId = learningId ? LEARNING_DRAFT_MAP[learningId] : null;
  const draftId = directDraftId ?? learningDraftId;
  const ticketDraft = draftId ? KB_DRAFTS.find(d => d.id === draftId) : null;
  // Only show learning banner if no draft covers it, and it's an update-article (links to article)
  // or a new-article without draft (links to learnings tab)
  const showLearningBanner = ticketLearning && !ticketDraft;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--surface)]">
      <ChatTabBar active={activeTab} onSelect={handleTabSelect} tabs={chatTabs} viewOnly={commentOnly} moreMenuItems={moreMenuItems} />

      {activeTab === 'chat' && (
        <>
          {/* KB draft provenance banner */}
          {ticketDraft && (
            <div style={{
              flexShrink: 0, display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '8px 16px', borderBottom: '1px solid var(--border)',
              background: 'var(--selected-background)',
            }}>
              <svg viewBox="0 0 12 12" width="11" height="11" fill="var(--selected-background-strong)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                <path d="M6 0.5C6 0.5 6.4 3.1 7.5 4.5C8.6 5.9 11.5 6 11.5 6C11.5 6 8.6 6.1 7.5 7.5C6.4 8.9 6 11.5 6 11.5C6 11.5 5.6 8.9 4.5 7.5C3.4 6.1 0.5 6 0.5 6C0.5 6 3.4 5.9 4.5 4.5C5.6 3.1 6 0.5 6 0.5Z"/>
              </svg>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--selected-text)', lineHeight: '17px' }}>
                <span style={{ fontWeight: 600 }}>Resolution used in KB draft · </span>
                <button
                  type="button"
                  onClick={() => navigate(`/knowledge-base/${ticketDraft.projectId}/${ticketDraft.id}`)}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: 12, color: 'var(--selected-text)', textDecoration: 'underline',
                    fontFamily: 'inherit',
                  }}
                >
                  {ticketDraft.title}
                </button>
                {' '}— pending review
              </p>
            </div>
          )}

          {/* KB learning provenance banner */}
          {showLearningBanner && (
            <div style={{
              flexShrink: 0, display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '8px 16px', borderBottom: '1px solid var(--border)',
              background: 'var(--background-medium)',
            }}>
              <svg viewBox="0 0 12 12" width="11" height="11" fill="var(--text-disabled)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                <path d="M6 0.5C6 0.5 6.4 3.1 7.5 4.5C8.6 5.9 11.5 6 11.5 6C11.5 6 8.6 6.1 7.5 7.5C6.4 8.9 6 11.5 6 11.5C6 11.5 5.6 8.9 4.5 7.5C3.4 6.1 0.5 6 0.5 6C0.5 6 3.4 5.9 4.5 4.5C5.6 3.1 6 0.5 6 0.5Z"/>
              </svg>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-weak)', lineHeight: '17px' }}>
                <span style={{ fontWeight: 600 }}>Resolution flagged for KB · </span>
                <button
                  type="button"
                  onClick={() => {
                    if (ticketLearning.type === 'update-article') {
                      navigate(`/knowledge-base/${ticketLearning.projectId}/${ticketLearning.linkedArticleId}?gap=${ticketLearning.id}`);
                    } else {
                      navigate(`/knowledge-base/${ticketLearning.projectId}?tab=learnings`);
                    }
                  }}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: 12, color: 'var(--text-weak)', textDecoration: 'underline',
                    fontFamily: 'inherit',
                  }}
                >
                  {ticketLearning.suggestion}
                </button>
              </p>
            </div>
          )}
          <MessageList messages={messages} transcript={initTranscript} transcriptEventText={transcriptEventText} />
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

      {activeTab === 'workflow' && hasWorkflow && (
        <WorkflowStepsPanel
          initialSteps={ticket.steps}
          onLinkedTicketClick={workflowCallbacks?.onLinkedTicketClick}
          onStepCreateTask={workflowCallbacks?.onStepCreateTask}
          onStepComplete={workflowCallbacks?.onStepComplete}
        />
      )}
    </div>
  );
}
