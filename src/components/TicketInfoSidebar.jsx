import { useState, useRef, useEffect } from 'react';
import Pill from './Pill';
import { PRIORITY_COLORS, STATUS_BORDER, PRIORITY_OPTIONS, STATUS_OPTIONS, PillStatusIcon } from './TicketDetailHeader';
import WorkflowStepsPanel from './WorkflowStepsPanel';

// ─── SLA ring icon ────────────────────────────────────────────────────────────

function SlaRingIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M0.835764 4.32204C0.536369 4.22476 0.211954 4.38828 0.143513 4.69555C-0.0201944 5.43055 -0.044456 6.19152 0.0738701 6.93861C0.221992 7.87381 0.589346 8.76068 1.1459 9.52671C1.70245 10.2927 2.4324 10.9162 3.27606 11.346C3.95001 11.6894 4.68124 11.9015 5.43085 11.9729C5.74423 12.0028 6 11.7448 6 11.43C6 11.1152 5.74394 10.8634 5.4313 10.8266C4.86183 10.7595 4.30719 10.592 3.79361 10.3303C3.11024 9.9821 2.51898 9.47712 2.06818 8.85664C1.61737 8.23615 1.31981 7.51779 1.19984 6.76027C1.10967 6.19096 1.12172 5.61169 1.23388 5.04936C1.29546 4.74064 1.13516 4.41932 0.835764 4.32204Z" fill="#6A696A" />
      <path d="M0.835764 4.32521C0.536369 4.22793 0.211954 4.39146 0.143513 4.69873C-0.0201944 5.43372 -0.044456 6.1947 0.0738701 6.94178C0.221992 7.87698 0.589346 8.76386 1.1459 9.52988C1.70245 10.2959 2.4324 10.9193 3.27606 11.3492C3.95001 11.6926 4.68124 11.9047 5.43085 11.9761C5.74423 12.006 6 11.748 6 11.4332C6 11.1184 5.74394 10.8666 5.4313 10.8298C4.86183 10.7627 4.30719 10.5951 3.79361 10.3335C3.11024 9.98527 2.51898 9.48029 2.06818 8.85981C1.61737 8.23933 1.31981 7.52096 1.19984 6.76344C1.10967 6.19414 1.12172 5.61487 1.23388 5.05253C1.29546 4.74381 1.13516 4.42249 0.835764 4.32521Z" fill="#5DA283" />
      <path d="M4.32204 11.1674C4.22476 11.4668 4.38828 11.7912 4.69556 11.8597C5.43055 12.0234 6.19153 12.0476 6.93861 11.9293C7.87381 11.7812 8.76068 11.4138 9.52671 10.8573C10.2927 10.3007 10.9162 9.57078 11.346 8.72712C11.6894 8.05317 11.9015 7.32193 11.9729 6.57233C12.0028 6.25894 11.7448 6.00317 11.43 6.00317C11.1152 6.00317 10.8634 6.25923 10.8266 6.57187C10.7595 7.14134 10.592 7.69599 10.3303 8.20957C9.9821 8.89293 9.47712 9.48419 8.85664 9.935C8.23615 10.3858 7.51779 10.6834 6.76027 10.8033C6.19096 10.8935 5.61169 10.8815 5.04936 10.7693C4.74064 10.7077 4.41932 10.868 4.32204 11.1674Z" fill="#5DA283" />
      <path d="M11.1642 7.68114C11.4636 7.77842 11.788 7.61489 11.8565 7.30762C12.0202 6.57263 12.0445 5.81165 11.9261 5.06457C11.778 4.12936 11.4107 3.24249 10.8541 2.47646C10.2976 1.71043 9.5676 1.087 8.72394 0.657135C8.04999 0.313739 7.31876 0.101657 6.56915 0.0302283C6.25577 0.000366578 6 0.258372 6 0.573174C6 0.887976 6.25606 1.13972 6.5687 1.17656C7.13817 1.24366 7.69281 1.4112 8.20639 1.67288C8.88976 2.02107 9.48102 2.52605 9.93182 3.14654C10.3826 3.76702 10.6802 4.48539 10.8002 5.2429C10.8903 5.81221 10.8783 6.39148 10.7661 6.95381C10.7045 7.26253 10.8648 7.58386 11.1642 7.68114Z" fill="#5DA283" />
    </svg>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronDownIcon({ open }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"
      style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
      <path d="M13.937 5.51788C13.8091 5.36554 13.626 5.27021 13.4279 5.25286C13.2298 5.23551 13.0329 5.29757 12.8805 5.42538L8 9.52088L3.1195 5.42538C2.96713 5.29754 2.77022 5.23547 2.57209 5.25282C2.37396 5.27017 2.19083 5.36551 2.06299 5.51788C1.93516 5.67025 1.87309 5.86715 1.89044 6.06528C1.90779 6.26341 2.00313 6.44654 2.1555 6.57438L7.5185 11.0744C7.65347 11.1879 7.82416 11.2501 8.0005 11.2501C8.17684 11.2501 8.34752 11.1879 8.4825 11.0744L13.8455 6.57438C13.9978 6.44654 14.0932 6.26341 14.1105 6.06529C14.1279 5.86716 14.0658 5.67026 13.938 5.51788H13.937Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="#58A182" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 1V0.5C12 0.2 11.8 0 11.5 0C11.2 0 11 0.2 11 0.5V1H5V0.5C5 0.2 4.8 0 4.5 0C4.2 0 4 0.2 4 0.5V1C2.35 1 1 2.35 1 4V12C1 13.65 2.35 15 4 15H12C13.65 15 15 13.65 15 12V4C15 2.35 13.65 1 12 1ZM4 2V2.5C4 2.8 4.2 3 4.5 3C4.8 3 5 2.8 5 2.5V2H11V2.5C11 2.8 11.2 3 11.5 3C11.8 3 12 2.8 12 2.5V2C13.1 2 14 2.9 14 4V5H2V4C2 2.9 2.9 2 4 2ZM12 14H4C2.9 14 2 13.1 2 12V6H14V12C14 13.1 13.1 14 12 14Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M7.99805 2C7.73283 2 7.47848 2.10536 7.29094 2.29289C7.1034 2.48043 6.99805 2.73478 6.99805 3V7H2.99805C2.73283 7 2.47848 7.10536 2.29094 7.29289C2.1034 7.48043 1.99805 7.73478 1.99805 8C1.99805 8.26522 2.1034 8.51957 2.29094 8.70711C2.47848 8.89464 2.73283 9 2.99805 9H6.99805V13C6.99805 13.2652 7.1034 13.5196 7.29094 13.7071C7.47848 13.8946 7.73283 14 7.99805 14C8.26326 14 8.51762 13.8946 8.70515 13.7071C8.89269 13.5196 8.99805 13.2652 8.99805 13V9H12.998C13.2633 9 13.5176 8.89464 13.7052 8.70711C13.8927 8.51957 13.998 8.26522 13.998 8C13.998 7.73478 13.8927 7.48043 13.7052 7.29289C13.5176 7.10536 13.2633 7 12.998 7H8.99805V3C8.99805 2.73478 8.89269 2.48043 8.70515 2.29289C8.51762 2.10536 8.26326 2 7.99805 2Z" />
    </svg>
  );
}

// Gradient AI sparkle (matches Sender icon.svg)
function AiGradientIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="aiGrad" x1="3.375" y1="3.1875" x2="9.904" y2="10.437" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF594B" />
          <stop offset="1" stopColor="#4786FF" />
        </linearGradient>
      </defs>
      <path d="M8.8125 0H8.1875C8.1875 0.580161 7.95703 1.13656 7.5468 1.5468C7.13656 1.95703 6.58016 2.1875 6 2.1875V2.8125C6.58016 2.8125 7.13656 3.04297 7.5468 3.4532C7.95703 3.86344 8.1875 4.41984 8.1875 5H8.8125C8.8125 4.41984 9.04297 3.86344 9.4532 3.4532C9.86344 3.04297 10.4198 2.8125 11 2.8125V2.1875C10.4198 2.1875 9.86344 1.95703 9.4532 1.5468C9.04297 1.13656 8.8125 0.580161 8.8125 0ZM6.5 5.125C4.8335 5.125 3.875 4.1665 3.875 2.5H3.125C3.125 4.1665 2.1665 5.125 0.5 5.125V5.875C2.1665 5.875 3.125 6.8335 3.125 8.5H3.875C3.875 6.8335 4.8335 5.875 6.5 5.875V5.125ZM7.8125 7H7.1875C7.1875 7.28727 7.13092 7.57172 7.02099 7.83712C6.91105 8.10252 6.74992 8.34367 6.5468 8.5468C6.34367 8.74992 6.10252 8.91105 5.83712 9.02099C5.57172 9.13092 5.28727 9.1875 5 9.1875V9.8125C5.58016 9.8125 6.13656 10.043 6.5468 10.4532C6.95703 10.8634 7.1875 11.4198 7.1875 12H7.8125C7.8125 11.4198 8.04297 10.8634 8.4532 10.4532C8.86344 10.043 9.41984 9.8125 10 9.8125V9.1875C9.41984 9.1875 8.86344 8.95703 8.4532 8.5468C8.04297 8.13656 7.8125 7.58016 7.8125 7Z" fill="url(#aiGrad)" />
    </svg>
  );
}

// ─── Team members (for assignee dropdown) ─────────────────────────────────────

const TEAM_MEMBERS = [
  { bg: '5f8dd3', fg: 'ffffff', initials: 'SS', name: 'Steve Smith' },
  { bg: '58a182', fg: 'ffffff', initials: 'AR', name: 'Alex Rivera' },
  { bg: '9b7ab5', fg: 'ffffff', initials: 'JL', name: 'Jordan Lee' },
];

// ─── Section (collapsible) ────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #EDEAE9' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between cursor-pointer border-0 bg-transparent"
        style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#1E1F21' }}
      >
        {title}
        <ChevronDownIcon open={open} />
      </button>
      {open && <div style={{ padding: '0 20px 16px' }}>{children}</div>}
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({ label, children }) {
  return (
    <div className="flex items-center" style={{ minHeight: 36, gap: 8, paddingBottom: 4 }}>
      <span style={{ width: 90, flexShrink: 0, fontSize: 12, color: '#9ea0a2' }}>{label}</span>
      <div style={{ flex: 1, fontSize: 13, color: '#1E1F21' }}>{children}</div>
    </div>
  );
}

// AssigneeToken — mirrors AssigneeTokenButton.svg:
//   36px tall, 28px avatar (4px vertical inset), name text after avatar,
//   transparent bg with pill hover state, no border.
function AssigneeToken({ bg, fg, initials, name }) {
  return (
    <button
      type="button"
      className="inline-flex items-center cursor-pointer border-0 transition-colors"
      style={{
        height: 36,
        gap: 8,
        padding: '0 10px 0 4px',
        borderRadius: 4,
        background: 'transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <img
        src={`https://placehold.co/28x28/${bg}/${fg}?text=${initials}`}
        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        alt={name}
      />
      <span style={{ fontSize: 13, color: '#1E1F21', whiteSpace: 'nowrap' }}>{name}</span>
    </button>
  );
}

// ─── LinkedTaskCard (Approvals) ───────────────────────────────────────────────

const APPROVAL_STATUS = {
  pending:  { bg: '#FEF9EC', color: '#92400E', dot: '#F59E0B', label: 'Pending' },
  approved: { bg: '#DCFCE7', color: '#166534', dot: '#22C55E', label: 'Approved' },
  rejected: { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444', label: 'Rejected' },
};

function LinkedTaskCard({ approvalState, onViewApproval }) {
  const [hovered, setHovered] = useState(false);
  const s = APPROVAL_STATUS[approvalState];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onViewApproval}
      onKeyDown={e => e.key === 'Enter' && onViewApproval?.()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid #EDEAE9',
        borderRadius: 8,
        padding: 12,
        cursor: 'pointer',
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.15s',
      }}
    >
      {/* Header: pill + truncated title, same row */}
      <div className="flex items-baseline gap-2" style={{ marginBottom: 8, minWidth: 0 }}>
        <div style={{ flexShrink: 0 }}>
          <Pill
            label={s.label}
            icon={<div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />}
            bg={s.bg}
            color={s.color}
          />
        </div>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, color: '#1E1F21', lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Approve SFDC License for Martin Ludington
        </span>
      </div>

      {/* Assignee + due */}
      <div className="flex items-center gap-1.5">
        <img
          src="https://placehold.co/20x20/b58a7a/ffffff?text=JW"
          style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0 }}
          alt="Jen Williams"
        />
        <span style={{ fontSize: 12, color: '#6D6E6F' }}>Jen Williams · Due today</span>
      </div>
    </div>
  );
}

// ─── Assignee dropdown option ─────────────────────────────────────────────────

function AssigneeOption({ member, selected, onSelect }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-2 border-0 cursor-pointer"
      style={{ height: 36, padding: '0 12px', background: 'transparent', fontSize: 13, color: '#1E1F21' }}
      onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      onClick={onSelect}
    >
      <span style={{ width: 16, flexShrink: 0, fontSize: 12, color: '#4573D2' }}>
        {selected ? '✓' : ''}
      </span>
      <img
        src={`https://placehold.co/24x24/${member.bg}/${member.fg}?text=${member.initials}`}
        style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        alt={member.name}
      />
      <span>{member.name}</span>
    </button>
  );
}

// ─── Attachment components ────────────────────────────────────────────────────

function FileCard({ name, meta }) {
  return (
    <div className="flex items-center gap-2.5"
      style={{ flex: 1, border: '1px solid #EDEAE9', borderRadius: 8, padding: '10px 12px', background: 'white', minWidth: 0 }}>
      {/* PDF-style icon (Subtract.svg shape) */}
      <div style={{ width: 36, height: 40, flexShrink: 0, position: 'relative' }}>
        <svg viewBox="0 0 32 32" width="36" height="40" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M21.0236 0H6C2.68629 0 0 2.68629 0 6V26C0 29.3137 2.68629 32 6 32H26C29.3137 32 32 29.3137 32 26V10.9678L21.0236 0Z"
            fill="#EC5E67" />
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#1E1F21', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
        <p style={{ fontSize: 11, color: '#9ea0a2', margin: 0 }}>{meta}</p>
      </div>
    </div>
  );
}

function AddFileCard() {
  return (
    <button type="button" className="flex items-center justify-center cursor-pointer"
      style={{ width: 72, height: 62, border: '1.5px dashed #D1D5DB', borderRadius: 8, background: 'white', color: '#9ea0a2', flexShrink: 0 }}>
      <PlusIcon />
    </button>
  );
}

// ─── LinkedHRTicketCard ───────────────────────────────────────────────────────

const HR_STATUS_PILL = {
  'Not started':   { bg: '#F3F4F6', color: '#6D6E6F' },
  'Investigating': { bg: '#EFF6FF', color: '#1D4ED8' },
  'On hold':       { bg: '#FFFBEB', color: '#92400E' },
  'Resolved':      { bg: '#DCFCE7', color: '#166534' },
};

function LinkedHRTicketCard({ hrTicket, onGoToLinkedHRTicket }) {
  const [hovered, setHovered] = useState(false);
  const status = hrTicket.status ?? 'Not started';
  const { bg, color } = HR_STATUS_PILL[status] ?? HR_STATUS_PILL['Not started'];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onGoToLinkedHRTicket?.(hrTicket.id)}
      onKeyDown={e => e.key === 'Enter' && onGoToLinkedHRTicket?.(hrTicket.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid #EDEAE9',
        borderRadius: 8,
        padding: 12,
        cursor: onGoToLinkedHRTicket ? 'pointer' : 'default',
        boxShadow: hovered && onGoToLinkedHRTicket ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Pill label={status} bg={bg} color={color} icon={<PillStatusIcon status={status} />} />
        <span style={{ fontSize: 12, color: '#9ea0a2' }}>{hrTicket.id}</span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 500, color: '#1E1F21', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {hrTicket.name}
      </p>
    </div>
  );
}

// ─── TicketInfoSidebar ────────────────────────────────────────────────────────

export default function TicketInfoSidebar({
  ticket, approvalState, onViewApproval, hrLinkedTicket, onGoToLinkedHRTicket, onAssigneeChange = () => {},
  localStatus, localPriority, statusRef, priorityRef,
  statusDropdownOpen, setStatusDropdownOpen,
  priorityDropdownOpen, setPriorityDropdownOpen,
  onStatusChange, onPriorityChange,
  readOnly = false,
  steps, onLinkedTicketClick, onStepCreateTask, onStepComplete,
}) {
  const [sidebarTab, setSidebarTab] = useState('details');
  const [attachmentsOpen, setAttachmentsOpen] = useState(true);
  const [localAssignee, setLocalAssignee] = useState(ticket.assignee);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [assigneeRowHovered, setAssigneeRowHovered] = useState(false);
  const assigneeRef = useRef(null);

  useEffect(() => {
    if (!assigneeDropdownOpen) return;
    function handleOutsideClick(e) {
      if (assigneeRef.current && !assigneeRef.current.contains(e.target)) {
        setAssigneeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [assigneeDropdownOpen]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white" style={{ borderLeft: '1px solid #EDEAE9' }}>

      {/* ── Priority / Status / SLA pills strip ── */}
      <div className="shrink-0 flex items-center gap-2" style={{ padding: '10px 16px', borderBottom: '1px solid #EDEAE9' }}>

        {/* Priority pill */}
        {ticket.priority && (
          readOnly ? (
            <Pill label={localPriority}
              bg={(PRIORITY_COLORS[localPriority] ?? PRIORITY_COLORS.Low).bg}
              color={(PRIORITY_COLORS[localPriority] ?? PRIORITY_COLORS.Low).color}
            />
          ) : (
            <div style={{ position: 'relative' }} ref={priorityRef}>
              <Pill as="button" label={localPriority}
                bg={(PRIORITY_COLORS[localPriority] ?? PRIORITY_COLORS.Low).bg}
                color={(PRIORITY_COLORS[localPriority] ?? PRIORITY_COLORS.Low).color}
                dropdown onClick={() => setPriorityDropdownOpen(o => !o)}
              />
              {priorityDropdownOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50, background: 'white', border: '1px solid #EDEAE9', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 140, overflow: 'hidden' }}>
                  {PRIORITY_OPTIONS.map(opt => (
                    <button key={opt} type="button"
                      className="w-full flex items-center gap-2 border-0 cursor-pointer"
                      style={{ height: 36, padding: '0 12px', background: 'transparent', fontSize: 13, color: '#1E1F21' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => { onPriorityChange(opt); setPriorityDropdownOpen(false); }}
                    >
                      <span style={{ width: 16, flexShrink: 0, fontSize: 12, color: '#4573D2' }}>{localPriority === opt ? '✓' : ''}</span>
                      <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: (PRIORITY_COLORS[opt] ?? PRIORITY_COLORS.Low).bg, color: (PRIORITY_COLORS[opt] ?? PRIORITY_COLORS.Low).color }}>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* Status pill */}
        {readOnly ? (
          <Pill label={localStatus} icon={<PillStatusIcon status={localStatus} />}
            bg="white" border={STATUS_BORDER[localStatus] ?? '#D1D5DB'}
          />
        ) : (
          <div style={{ position: 'relative' }} ref={statusRef}>
            <Pill as="button" label={localStatus} icon={<PillStatusIcon status={localStatus} />}
              bg="white" border={STATUS_BORDER[localStatus] ?? '#D1D5DB'} dropdown
              onClick={() => setStatusDropdownOpen(o => !o)}
            />
            {statusDropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50, background: 'white', border: '1px solid #EDEAE9', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 170, overflow: 'hidden' }}>
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt} type="button"
                    className="w-full flex items-center gap-2 border-0 cursor-pointer"
                    style={{ height: 36, padding: '0 12px', background: 'transparent', fontSize: 13, color: '#1E1F21' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { onStatusChange(opt); setStatusDropdownOpen(false); }}
                  >
                    <span style={{ width: 16, flexShrink: 0, fontSize: 12, color: '#4573D2' }}>{localStatus === opt ? '✓' : ''}</span>
                    <PillStatusIcon status={opt} />
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SLA */}
        {ticket.sla && (
          <div className="flex items-center gap-1.5 ml-auto" style={{ color: '#6D6E6F', fontSize: 12 }}>
            <SlaRingIcon />
            <span>{ticket.sla}</span>
          </div>
        )}
      </div>

      {/* ── Tabs (Details / Workflow) — only when ticket has workflow steps ── */}
      {steps?.length > 0 && (
        <div className="shrink-0 flex" style={{ borderBottom: '1px solid #EDEAE9', padding: '0 20px', gap: 24 }}>
          {['details', 'workflow'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setSidebarTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: sidebarTab === tab ? '2px solid #1E1F21' : '2px solid transparent',
                padding: '10px 0',
                fontSize: 13,
                fontWeight: sidebarTab === tab ? 600 : 400,
                color: sidebarTab === tab ? '#1E1F21' : '#6D6E6F',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'details' ? 'Details' : 'Workflow'}
            </button>
          ))}
        </div>
      )}

      {/* ── Workflow tab content ── */}
      {steps?.length > 0 && sidebarTab === 'workflow' && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <WorkflowStepsPanel
            initialSteps={steps}
            onLinkedTicketClick={onLinkedTicketClick}
            onStepCreateTask={onStepCreateTask}
            onStepComplete={onStepComplete}
          />
        </div>
      )}

      {/* ── Scrollable sections ── */}
      {(!(steps?.length > 0) || sidebarTab === 'details') && (
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ overscrollBehavior: 'none' }}>

        {/* Submitter */}
        <Section title="Submitter">
          {ticket.requester && (
            <FieldRow label="Submitter">
              <AssigneeToken
                bg={ticket.requester.bg}
                fg={ticket.requester.fg}
                initials={ticket.requester.initials}
                name={ticket.submitter?.name ?? ticket.requester.name}
              />
            </FieldRow>
          )}
          {ticket.submitter?.email    && <FieldRow label="Email">{ticket.submitter.email}</FieldRow>}
          {ticket.submitter?.location && <FieldRow label="Location">{ticket.submitter.location}</FieldRow>}
          {ticket.submitter?.org      && <FieldRow label="Org">{ticket.submitter.org}</FieldRow>}
          {ticket.submitter?.deviceId && (
            <FieldRow label="Device ID">
              <span style={{ color: '#4573D2', cursor: 'pointer' }}>{ticket.submitter.deviceId}</span>
            </FieldRow>
          )}
        </Section>

        {/* Linked work — surfaced above People */}
        {(approvalState || hrLinkedTicket) && (
          <Section title="Linked work">
            {approvalState && <LinkedTaskCard approvalState={approvalState} onViewApproval={onViewApproval} />}
            {hrLinkedTicket && (
              <div style={{ marginTop: approvalState ? 10 : 0 }}>
                <LinkedHRTicketCard hrTicket={hrLinkedTicket} onGoToLinkedHRTicket={onGoToLinkedHRTicket} />
              </div>
            )}
          </Section>
        )}

        {/* People — Assignee + Collaborators */}
        <Section title="People">
          <div style={{ position: 'relative' }} ref={assigneeRef}>
            <button
              type="button"
              className="w-full flex items-center border-0 cursor-pointer"
              style={{
                minHeight: 36,
                gap: 8,
                paddingBottom: 4,
                background: assigneeRowHovered ? '#F5F5F4' : 'transparent',
                borderRadius: 4,
                textAlign: 'left',
              }}
              onMouseEnter={() => setAssigneeRowHovered(true)}
              onMouseLeave={() => setAssigneeRowHovered(false)}
              onClick={() => setAssigneeDropdownOpen(o => !o)}
            >
              <span style={{ width: 90, flexShrink: 0, fontSize: 12, color: '#9ea0a2' }}>Assignee</span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                {localAssignee ? (
                  <>
                    <img
                      src={`https://placehold.co/28x28/${localAssignee.bg}/${localAssignee.fg}?text=${localAssignee.initials}`}
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      alt={localAssignee.name}
                    />
                    <span style={{ fontSize: 13, color: '#1E1F21', whiteSpace: 'nowrap' }}>{localAssignee.name}</span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px dashed #D1D5DB', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#9ea0a2' }}>
                      {assigneeRowHovered ? 'Assign…' : 'No assignee'}
                    </span>
                  </div>
                )}
              </div>
              {(assigneeRowHovered || assigneeDropdownOpen) && (
                <span aria-hidden="true" style={{ fontSize: 11, color: '#9ea0a2', paddingRight: 4, flexShrink: 0 }}>▾</span>
              )}
            </button>

            {/* Assignee dropdown */}
            {assigneeDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 98,
                zIndex: 50,
                background: 'white',
                border: '1px solid #EDEAE9',
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: 200,
                overflow: 'hidden',
              }}>
                {localAssignee && (
                  <>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 border-0 cursor-pointer"
                      style={{ height: 36, padding: '0 12px', background: 'transparent', fontSize: 13, color: '#6D6E6F' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        setLocalAssignee(null);
                        setAssigneeDropdownOpen(false);
                        onAssigneeChange(null);
                      }}
                    >
                      <span style={{ width: 16, flexShrink: 0 }} />
                      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px dashed #D1D5DB', flexShrink: 0 }} />
                      <span>No assignee</span>
                    </button>
                    <div style={{ height: 1, background: '#EDEAE9', margin: '2px 0' }} />
                  </>
                )}
                {TEAM_MEMBERS.map(member => (
                  <AssigneeOption
                    key={member.name}
                    member={member}
                    selected={localAssignee?.name === member.name}
                    onSelect={() => {
                      setLocalAssignee(member);
                      setAssigneeDropdownOpen(false);
                      onAssigneeChange(member);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Collaborators */}
          <FieldRow label="Collaborators">
            <div className="flex items-center gap-2 flex-wrap">
              {[ticket.assignee, ticket.requester].filter(Boolean).length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {[ticket.assignee, ticket.requester].filter(Boolean).map((p, i) => (
                    <img
                      key={p.name ?? i}
                      src={`https://placehold.co/24x24/${p.bg}/${p.fg}?text=${p.initials}`}
                      alt={p.name}
                      title={p.name}
                      style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, outline: '2px solid white', marginLeft: i === 0 ? 0 : -8, position: 'relative', zIndex: i }}
                    />
                  ))}
                </div>
              )}
              <button
                type="button"
                style={{ height: 22, padding: '0 8px', fontSize: 11, borderRadius: 4, border: '1px solid #C9C9C8', background: 'white', color: '#6D6E6F', cursor: 'pointer', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                Add
              </button>
            </div>
          </FieldRow>
        </Section>

        {/* Issue */}
        <Section title="Issue">
          <FieldRow label="Issued on">
            <div className="flex items-center gap-1.5">
              <CalendarIcon />
              <span style={{ color: '#58A182', fontWeight: 500 }}>{ticket.date}</span>
            </div>
          </FieldRow>
          {ticket.category && (
            <FieldRow label="Category">
              <Pill as="button" label={ticket.category} bg="#F3F4F6" color="#6D6E6F" dropdown />
            </FieldRow>
          )}

          {/* AI summary */}
          {ticket.aiSummary && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: '#F9F9F9', borderRadius: 8 }}>
              <div className="flex items-center gap-1.5" style={{ marginBottom: 6 }}>
                <AiGradientIcon />
                <span style={{ fontSize: 11, color: '#6D6E6F' }}>Asana IT summary of the ticket details</span>
                <span style={{ fontSize: 11, color: '#9ea0a2' }}>· 1d</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: '20px', color: '#1E1F21', margin: 0 }}>
                {ticket.aiSummary}
              </p>
            </div>
          )}

          {/* Attachments */}
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              onClick={() => setAttachmentsOpen(o => !o)}
              className="flex items-center gap-1.5 cursor-pointer border-0 bg-transparent"
              style={{ fontSize: 12, color: '#6D6E6F', marginBottom: attachmentsOpen ? 10 : 0 }}
            >
              <ChevronDownIcon open={attachmentsOpen} />
              <span style={{ fontWeight: 500, color: '#1E1F21' }}>Attachments</span>
              <span style={{ color: '#9ea0a2' }}>3</span>
              <span style={{ marginLeft: 4, color: '#9ea0a2' }}>
                <PlusIcon />
              </span>
            </button>
            {attachmentsOpen && (
              <div className="flex items-start gap-2">
                <FileCard name="IMG23.120" meta="TXT · Download" />
                <AddFileCard />
              </div>
            )}
          </div>
        </Section>

        {/* Suggested articles */}
        <Section title="Suggested articles" defaultOpen={false} />

        {/* Timeline */}
        <Section title="Timeline" defaultOpen={false} />

      </div>
      )}
    </div>
  );
}
