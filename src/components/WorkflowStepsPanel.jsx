import { useState, useEffect, useRef } from 'react';

const BASE_URL = import.meta.env.BASE_URL;

// ─── Shadow tokens ─────────────────────────────────────────────────────────────
const SHADOW_ACTIVE  = 'var(--elevation-md)';
const SHADOW_DEFAULT = 'var(--elevation-sm)';
const SHADOW_DONE    = 'var(--shadow-sm)';

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" style={{ color: 'var(--success-text)' }}>
      <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 12 12" width="12" height="12" fill="currentColor"
      style={{ flexShrink: 0, color: 'var(--border-strong)', transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
    >
      <path d="M9.09 3.93L6 6.52 2.91 3.93a.75.75 0 00-1.06 1.07l3.58 3a.75.75 0 001.06 0l3.57-3A.75.75 0 009.09 3.93z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4.5 1.5H2a1 1 0 00-1 1v5.5a1 1 0 001 1h5.5a1 1 0 001-1V5.5M6.5 1h2.5m0 0v2.5m0-2.5L4.5 5.5" />
    </svg>
  );
}

function ParallelIcon() {
  return (
    <svg viewBox="0 0 8 12" width="8" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 1v10M6 1v10" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" viewBox="0 0 10 10" width="12" height="12" style={{ flexShrink: 0 }}>
      <circle cx="5" cy="5" r="3.5" stroke="var(--border)" strokeWidth="1.5" fill="none" />
      <path d="M5 1.5A3.5 3.5 0 0 1 8.5 5" stroke="var(--selected-background-strong)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Auto-run animation (AI agent steps) ─────────────────────────────────────

const PROVISION_STEPS = [
  'Connecting to Salesforce admin...',
  'Locating available guest seat...',
  'Assigning license to Sarah Lee...',
  'Configuring access permissions...',
  'Access provisioned',
];

const COMM_STEPS = [
  'Drafting resolution message...',
  'Sending to Sarah Lee...',
  'Message delivered',
  'Marking ticket resolved...',
  'Done',
];

function AutoRunAnimation({ animSteps, onComplete }) {
  const [visibleCount, setVisibleCount] = useState(1);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (visibleCount < animSteps.length) {
      const t = setTimeout(() => setVisibleCount(c => c + 1), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => onCompleteRef.current?.(), 700);
    return () => clearTimeout(t);
  }, [visibleCount, animSteps.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '2px 0' }}>
      {animSteps.map((text, i) => {
        if (i >= visibleCount) return null;
        const isRunning = i === visibleCount - 1 && visibleCount < animSteps.length;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: isRunning ? 'var(--text)' : 'var(--icon)' }}>
            {isRunning ? <SpinnerIcon /> : (
              <svg viewBox="0 0 10 10" width="12" height="12" fill="none" style={{ flexShrink: 0, color: 'var(--success-text)' }}>
                <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {text}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step badge ───────────────────────────────────────────────────────────────

function StepBadge({ status, number }) {
  if (status === 'completed') {
    return (
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--success-background)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckIcon />
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--selected-background-strong)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--selected-text-strong)' }}>
        {number}
      </div>
    );
  }
  return (
    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--background-strong)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: 'var(--text-disabled)' }}>
      {number}
    </div>
  );
}

// ─── Linked ticket card (clickable) ──────────────────────────────────────────
// Matches LinkedHRTicketCard in TicketInfoSidebar.

function LinkedTicketCard({ ticket, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isResolved = ticket.status === 'Resolved';
  const clickable = !!onClick;

  return (
    <div
      onClick={clickable ? e => { e.stopPropagation(); onClick(ticket); } : undefined}
      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid var(--border)', borderRadius: 7,
        padding: '8px 10px', background: 'var(--surface)',
        cursor: clickable ? 'pointer' : 'default',
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <span style={{
          padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 500,
          background: isResolved ? 'var(--success-background)' : 'var(--background-medium)',
          color: isResolved ? 'var(--success-text)' : 'var(--icon)',
        }}>
          {ticket.status}
        </span>
        {ticket.id && <span style={{ fontSize: 11, color: 'var(--text-disabled)' }}>{ticket.id}</span>}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', lineHeight: '16px' }}>
        {ticket.name}
      </div>
    </div>
  );
}

// ─── Inline pill for completed linked steps ───────────────────────────────────

function LinkedPill({ ticket, onClick }) {
  const isResolved = ticket.status === 'Resolved';
  const clickable = !!onClick;
  return (
    <span
      onClick={clickable ? e => { e.stopPropagation(); onClick(ticket); } : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '1px 7px', borderRadius: 4, fontSize: 11,
        background: isResolved ? 'var(--success-background)' : 'var(--background-medium)',
        color: isResolved ? 'var(--success-text)' : 'var(--icon)',
        fontWeight: 500, marginTop: 3,
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      {ticket.id} · {ticket.status}
      {clickable && <ExternalIcon />}
    </span>
  );
}

// ─── Action buttons ───────────────────────────────────────────────────────────

const SECONDARY_BTN = { height: 28, padding: '0 12px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' };

function MarkDoneBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={SECONDARY_BTN}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      Mark done
    </button>
  );
}

function CreateTaskBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{ ...SECONDARY_BTN, display: 'inline-flex', alignItems: 'center', gap: 6 }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--background-medium)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      {label} <ExternalIcon />
    </button>
  );
}

// ─── Assignee avatar (tiny, inline with team label) ──────────────────────────

function AssigneeAvatar({ person }) {
  if (person.type === 'ai') {
    const avatar = person.name === 'Communications Agent' ? 'Teammate-2.svg' : 'Teammate-1.svg';
    return (
      <img
        src={`${BASE_URL}avatars/${avatar}`}
        width={16} height={16}
        style={{ borderRadius: '50%', flexShrink: 0 }}
        alt="AI agent"
      />
    );
  }
  return (
    <div style={{
      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
      background: person.bg ? `#${person.bg}` : '#6d8aad',
      color: `#${person.fg ?? 'ffffff'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 8, fontWeight: 700,
    }}>
      {(person.initials ?? person.name?.slice(0, 2) ?? '?')[0]}
    </div>
  );
}

// ─── Single step card ─────────────────────────────────────────────────────────
//
// Collapsed (completed / pending): single header row + chevron, click to expand.
// Active: always expanded, no toggle.
// Expanded (completed / pending): shows body / outcome / linked ticket below header.

function StepCard({ step, stepNumber, expanded, onToggle, onDone, onCreateTask, taskCreated, onLinkedTicketClick, nested = false }) {
  const isCompleted = step.status === 'completed';
  const isActive    = step.status === 'active';
  const isPending   = step.status === 'pending';
  const isLinked    = step.type === 'linked';
  const isApproval  = isLinked && step.label.toLowerCase().includes('approval');

  // Active cards are always fully expanded; non-active toggle via click
  const showExpanded = isActive || expanded;

  return (
    <div
      onClick={!isActive ? e => { e.stopPropagation(); onToggle(); } : undefined}
      style={{
        background: 'var(--surface)',
        borderRadius: nested ? 0 : 8,
        border: nested ? 'none' : '1px solid var(--border)',
        boxShadow: nested ? 'none' : isActive ? SHADOW_ACTIVE : isCompleted ? SHADOW_DONE : SHADOW_DEFAULT,
        padding: '10px 14px',
        opacity: isPending ? 0.55 : 1,
        transition: 'box-shadow 0.15s, opacity 0.2s',
        cursor: !isActive ? 'pointer' : 'default',
      }}
    >
      {/* ── Header row — always visible ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <StepBadge status={step.status} number={stepNumber} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: isActive ? 600 : 500,
            color: isCompleted ? 'var(--icon)' : 'var(--text)',
            lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {step.label}
          </div>
          {/* Team line — always show for non-completed, hide when completed (saves space) */}
          {!isCompleted && (
            <div style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              {step.assignee && <AssigneeAvatar person={step.assignee} />}
              {step.team}
            </div>
          )}
          {/* Completed linked: pill inline (collapsed view) */}
          {isCompleted && !expanded && step.linkedTicket && (
            <LinkedPill ticket={step.linkedTicket} onClick={onLinkedTicketClick ? () => onLinkedTicketClick(step.linkedTicket) : undefined} />
          )}
        </div>
        {isCompleted && step.completedAt && !expanded && (
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', flexShrink: 0, marginRight: 4 }}>{step.completedAt}</span>
        )}
        {/* Expand chevron for non-active */}
        {!isActive && <ChevronIcon open={showExpanded} />}
      </div>

      {/* ── Expanded section ── */}
      {showExpanded && (
        // stopPropagation so clicks inside don't re-collapse the card
        <div onClick={e => e.stopPropagation()} style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>

          {/* COMPLETED ──────────────────────────── */}
          {isCompleted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {step.completedAt && (
                <div style={{ fontSize: 11, color: 'var(--text-disabled)' }}>Completed at {step.completedAt} · {step.team}</div>
              )}
              {step.outcomeNote && (
                <p style={{ fontSize: 12, color: 'var(--icon)', lineHeight: '18px', margin: 0 }}>{step.outcomeNote}</p>
              )}
              {step.linkedTicket && (
                <LinkedTicketCard ticket={step.linkedTicket} onClick={onLinkedTicketClick ? () => onLinkedTicketClick(step.linkedTicket) : undefined} />
              )}
            </div>
          )}

          {/* PENDING ────────────────────────────── */}
          {isPending && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {step.body && <p style={{ fontSize: 12, color: 'var(--icon)', lineHeight: '18px', margin: 0 }}>{step.body}</p>}
              {isLinked && step.linkedTicket && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-disabled)', marginBottom: 5 }}>Will create a task in:</div>
                  <LinkedTicketCard ticket={{ ...step.linkedTicket, status: 'Not created yet' }} />
                </div>
              )}
            </div>
          )}

          {/* ACTIVE — agent step ─────────────────── */}
          {isActive && !isLinked && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {step.assignee?.type === 'ai' ? (
                <AutoRunAnimation
                  animSteps={step.animSteps ?? (step.team === 'Communications Agent' ? COMM_STEPS : PROVISION_STEPS)}
                  onComplete={() => onDone(step.id)}
                />
              ) : (
                <>
                  {step.body && <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: '20px', margin: 0 }}>{step.body}</p>}
                  <MarkDoneBtn onClick={() => onDone(step.id)} />
                </>
              )}
            </div>
          )}

          {/* ACTIVE — linked step: create task → then show ticket + mark done */}
          {isActive && isLinked && !taskCreated && (
            <CreateTaskBtn
              label={isApproval ? 'Create approval task' : 'Create task'}
              onClick={() => onCreateTask(step.id)}
            />
          )}

          {isActive && isLinked && taskCreated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <LinkedTicketCard
                ticket={step.linkedTicket}
                onClick={onLinkedTicketClick ? () => onLinkedTicketClick(step.linkedTicket) : undefined}
              />
              <MarkDoneBtn onClick={() => onDone(step.id)} />
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Parallel group card ──────────────────────────────────────────────────────

function ParallelGroup({ groupSteps, startIndex, expandedIds, onToggle, onDone, onCreateTask, taskCreatedIds, onLinkedTicketClick }) {
  const completedInGroup = groupSteps.filter(s => s.status === 'completed').length;
  const anyActive        = groupSteps.some(s => s.status === 'active');

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      boxShadow: anyActive ? SHADOW_ACTIVE : SHADOW_DEFAULT,
      transition: 'box-shadow 0.15s',
    }}>
      <div style={{
        padding: '7px 14px',
        background: 'var(--background-weak)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: 'var(--icon)',
        borderRadius: '8px 8px 0 0',
      }}>
        <ParallelIcon />
        <span style={{ fontWeight: 500 }}>Parallel — both must complete</span>
        <span style={{ marginLeft: 'auto', fontWeight: 500, color: 'var(--text-disabled)' }}>{completedInGroup}/{groupSteps.length}</span>
      </div>
      {groupSteps.map((step, i) => (
        <div key={step.id} style={i > 0 ? { borderTop: '1px solid var(--border)' } : {}}>
          <StepCard
            step={step}
            stepNumber={startIndex + i + 1}
            expanded={expandedIds.has(step.id)}
            onToggle={() => onToggle(step.id)}
            onDone={onDone}
            onCreateTask={onCreateTask}
            taskCreated={taskCreatedIds.has(step.id)}
            onLinkedTicketClick={onLinkedTicketClick}
            nested
          />
        </div>
      ))}
    </div>
  );
}

// ─── State machine ─────────────────────────────────────────────────────────────

function activateNext(steps, completedId) {
  const completingStep = steps.find(s => s.id === completedId);
  const updated = steps.map(s =>
    s.id === completedId
      ? { ...s, status: 'completed', completedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
      : s
  );

  if (completingStep.parallelGroup) {
    const allGroupDone = updated
      .filter(s => s.parallelGroup === completingStep.parallelGroup)
      .every(s => s.status === 'completed');
    if (!allGroupDone) return updated;
    const next = updated.find(s => s.status === 'pending' && !s.parallelGroup);
    if (next) return updated.map(s => s.id === next.id ? { ...s, status: 'active' } : s);
  } else {
    const firstPending = updated.find(s => s.status === 'pending');
    if (!firstPending) return updated;
    if (firstPending.parallelGroup) {
      const groupId = firstPending.parallelGroup;
      return updated.map(s => s.parallelGroup === groupId ? { ...s, status: 'active' } : s);
    }
    return updated.map(s => s.id === firstPending.id ? { ...s, status: 'active' } : s);
  }
  return updated;
}

// ─── WorkflowStepsPanel ───────────────────────────────────────────────────────
//
// Props:
//   initialSteps       — step array from ticket data
//   onLinkedTicketClick — (linkedTicket) => void — called when a cross-team
//                         ticket/task card is clicked; host handles overlay/nav

export default function WorkflowStepsPanel({ initialSteps, onLinkedTicketClick, onStepCreateTask, onStepComplete }) {
  const [steps, setSteps] = useState(initialSteps);
  // IDs of non-active cards the user has manually expanded
  const [expandedIds, setExpandedIds] = useState(new Set());
  // IDs of linked steps where task has been created (auto-populate for already-active linked steps)
  const [taskCreatedIds, setTaskCreatedIds] = useState(
    () => new Set(initialSteps.filter(s => s.status === 'active' && s.type === 'linked').map(s => s.id))
  );

  // Notify parent about already-active linked steps on mount so HR tickets get registered
  const onStepCreateTaskRef = useRef(onStepCreateTask);
  onStepCreateTaskRef.current = onStepCreateTask;
  useEffect(() => {
    initialSteps.forEach(s => {
      if (s.status === 'active' && s.type === 'linked') {
        onStepCreateTaskRef.current?.(s.id, s);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = completedCount / steps.length * 100;

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleDone(id) {
    const completedStep = steps.find(s => s.id === id);
    setSteps(prev => {
      const newSteps = activateNext(prev, id);
      // Auto-create any newly-activated linked steps (no manual "Create task" needed)
      const prevActiveIds = new Set(prev.filter(s => s.status === 'active').map(s => s.id));
      const autoCreated = [];
      newSteps.forEach(step => {
        if (step.status === 'active' && !prevActiveIds.has(step.id) && step.type === 'linked') {
          autoCreated.push(step);
        }
      });
      if (autoCreated.length) {
        setTaskCreatedIds(c => new Set([...c, ...autoCreated.map(s => s.id)]));
        autoCreated.forEach(step => onStepCreateTask?.(step.id, step));
      }
      return newSteps;
    });
    setExpandedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    onStepComplete?.(id, completedStep);
  }

  function handleCreateTask(id) {
    setTaskCreatedIds(prev => new Set([...prev, id]));
    onStepCreateTask?.(id, steps.find(s => s.id === id));
  }

  // Build render items (single cards + parallel groups)
  const renderItems = [];
  let i = 0, absIdx = 0;
  while (i < steps.length) {
    const step = steps[i];
    if (step.parallelGroup) {
      const groupId = step.parallelGroup;
      const groupSteps = [];
      const startIndex = absIdx;
      while (i < steps.length && steps[i].parallelGroup === groupId) {
        groupSteps.push(steps[i]);
        absIdx++; i++;
      }
      renderItems.push({ type: 'parallel', groupId, steps: groupSteps, startIndex });
    } else {
      renderItems.push({ type: 'single', step, stepNumber: absIdx + 1 });
      absIdx++; i++;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--background-medium)' }}>

      {/* Header — white strip, 44px to align with ChatTabBar */}
      <div style={{ background: 'var(--surface)', height: 44, padding: '0 20px', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Workflow steps</span>
          <span style={{ fontSize: 11, fontWeight: 500, padding: '1px 7px', borderRadius: 999, background: 'var(--background-strong)', color: 'var(--icon)' }}>
            {completedCount}/{steps.length}
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: 'var(--background-strong)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--selected-background-strong)', borderRadius: 2, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Steps tray */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {renderItems.map(item => {
          if (item.type === 'parallel') {
            return (
              <ParallelGroup
                key={item.groupId}
                groupSteps={item.steps}
                startIndex={item.startIndex}
                expandedIds={expandedIds}
                onToggle={toggleExpand}
                onDone={handleDone}
                onCreateTask={handleCreateTask}
                taskCreatedIds={taskCreatedIds}
                onLinkedTicketClick={onLinkedTicketClick}
              />
            );
          }
          return (
            <StepCard
              key={item.step.id}
              step={item.step}
              stepNumber={item.stepNumber}
              expanded={expandedIds.has(item.step.id)}
              onToggle={() => toggleExpand(item.step.id)}
              onDone={handleDone}
              onCreateTask={handleCreateTask}
              taskCreated={taskCreatedIds.has(item.step.id)}
              onLinkedTicketClick={onLinkedTicketClick}
            />
          );
        })}
      </div>
    </div>
  );
}
