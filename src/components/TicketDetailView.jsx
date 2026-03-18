import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/AppStore';
import TicketDetailHeader from './TicketDetailHeader';
import TicketChatPanel from './TicketChatPanel';
import TicketInfoSidebar from './TicketInfoSidebar';
import WorkflowStepsPanel from './WorkflowStepsPanel';
import RightPanelOverlay from './RightPanelOverlay';
import ApprovalTaskView from './ApprovalTaskView';
import CreateHRTicketModal from './CreateHRTicketModal';
import RouteToHRModal from './RouteToHRModal';
import CloseAndMoveModal from './CloseAndMoveModal';
// ─── Payroll ticket chat content (TICKET-68) ──────────────────────────────────

const PAYROLL_TRANSCRIPT = [
  { type: 'outbound', isAi: true,  text: "Hi Anjelica! I'm the Asana IT Bot. How can I help you today?", senderLabel: 'IT Bot', time: 'Feb 24, 8:51am' },
  { type: 'inbound',  text: "Hi, I think there might be an error with my paycheck — I'm missing about $340 in overtime pay from last week. I wasn't sure if it was a system issue so I'm reaching out here.", name: 'Anjelica Silva', time: 'Feb 24, 8:52am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
  { type: 'outbound', isAi: true,  text: "I understand, Anjelica. Paycheck discrepancies can definitely be stressful. This sounds like it may be a payroll matter rather than a technical issue, but I'll create a ticket so our team can review and make sure it gets to the right people.", senderLabel: 'IT Bot', time: 'Feb 24, 8:52am' },
  { type: 'inbound',  text: "Please, I've been waiting 3 days and really need this resolved — it's affecting my rent payment this week.", name: 'Anjelica Silva', time: 'Feb 24, 8:53am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
  { type: 'outbound', isAi: true,  text: "Got it — I've flagged this as Medium priority. You'll hear back shortly. Reference: TICKET-68.", senderLabel: 'IT Bot', time: 'Feb 24, 8:53am' },
];

const PAYROLL_PUBLIC = [
  { type: 'outbound', isAi: true, text: "Hi Anjelica, thanks for reaching out. Your ticket has been logged and our team will review it shortly. Reference: TICKET-68.", senderLabel: 'IT Agent', time: '2 hours ago' },
  { type: 'inbound',  text: "Hi — just following up. I submitted this 2 hours ago and haven't had any update. This is really urgent for me as I have rent due this week.", name: 'Anjelica Silva', time: '30 mins ago', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
];

const PAYROLL_INTERNAL = [
  { type: 'inbound', text: "Hey — just picked this up. This is a payroll discrepancy, not an IT issue. Missing $340 in overtime. We can't action this.", name: 'Liam Torres', time: '25 mins ago', bg: '7a9abf', fg: 'ffffff', initials: 'LT' },
  { type: 'outbound', isAi: false, text: "Yeah agreed, this needs to go to HR / Payroll. Anjelica's already chased once — let's route it and send her a note so she knows it's in the right hands.", senderLabel: 'You', time: 'just now' },
];

export default function TicketDetailView({ ticket, onBack, onRouteComplete, onCreateHRTicket, onAddLinkedHRTicket, hrLinkedTicket, onGoToLinkedITTicket, onGoToLinkedHRTicket, onHRStatusChange, onITStatusChange }) {
  const navigate = useNavigate();
  const { dispatch } = useAppStore();
  const [workflowLinkedTicket, setWorkflowLinkedTicket] = useState(null);
  const [approvalState, setApprovalState] = useState(null);
  const [chatEvents, setChatEvents] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [routedToHR, setRoutedToHR] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [hrCreateOpen, setHrCreateOpen] = useState(false);
  const [pendingHRCreate, setPendingHRCreate] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closedAndMoved, setClosedAndMoved] = useState(false);

  // Pills bar state
  const [localStatus,   setLocalStatus]   = useState(ticket.status);
  const [localPriority, setLocalPriority] = useState(ticket.priority);
  const [statusDropdownOpen,   setStatusDropdownOpen]   = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const statusRef   = useRef(null);
  const priorityRef = useRef(null);

  useEffect(() => {
    if (!statusDropdownOpen) return;
    function h(e) { if (statusRef.current && !statusRef.current.contains(e.target)) setStatusDropdownOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [statusDropdownOpen]);

  useEffect(() => {
    if (!priorityDropdownOpen) return;
    function h(e) { if (priorityRef.current && !priorityRef.current.contains(e.target)) setPriorityDropdownOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [priorityDropdownOpen]);

  // Inject system event once the newly-created HR case ID is known
  useEffect(() => {
    if (!pendingHRCreate || !hrLinkedTicket) return;
    setChatEvents(prev => [...prev, { type: 'system', text: `HR case ${hrLinkedTicket.id} created` }]);
    setPendingHRCreate(false);
  }, [hrLinkedTicket?.id, pendingHRCreate]);

  // Inject IT-side system event when the linked HR case is resolved
  useEffect(() => {
    if (!hrLinkedTicket || hrLinkedTicket.status !== 'Resolved') return;
    const firstName = ticket.requester?.name?.split(' ')[0] ?? 'the employee';
    const eventText = `HR case ${hrLinkedTicket.id} resolved — confirm outcome with ${firstName} and close this ticket`;
    setChatEvents(prev => {
      if (prev.some(e => e.type === 'system' && e.text === eventText)) return prev;
      return [...prev, { type: 'system', text: eventText }];
    });
  }, [hrLinkedTicket?.status, hrLinkedTicket?.id]);

  // Resolve initial chat content: ticket fields take priority, then id-based fallback
  const chatInitPublic     = ticket.initPublic    ?? (ticket.id === 'TICKET-68' ? PAYROLL_PUBLIC    : []);
  const chatInitInternal   = ticket.initInternal  ?? (ticket.id === 'TICKET-68' ? PAYROLL_INTERNAL  : []);
  const chatInitTranscript = ticket.initTranscript ?? (ticket.id === 'TICKET-68' ? PAYROLL_TRANSCRIPT : []);

  // Dynamic system event text shown after the transcript block
  const transcriptEventText = ticket.routedFromId
    ? `Routed from IT queue (${ticket.routedFromId})`
    : `Ticket ${ticket.id} created from live chat`;

  function handleRequestApproval() {
    setApprovalState('pending');
    setChatEvents([
      { type: 'system', text: "Approval requested from Jen Williams (Martin's manager)" },
      {
        type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'just now',
        text: "Hi Martin, we need your manager's approval before provisioning the license. We've sent a request to Jen Williams and will update you as soon as we hear back.",
      },
    ]);
  }

  function handleHRTicketCreate(notes) {
    const chatSnapshot = {
      public: [...(chatInitPublic ?? []), ...chatEvents],
      internal: chatInitInternal ?? [],
    };
    onCreateHRTicket?.(ticket, chatSnapshot, notes);
    setHrCreateOpen(false);
    setPendingHRCreate(true);
  }

  // Navigate to the right queue when a workflow linked ticket is clicked
  function handleWorkflowLinkedTicketClick(linkedTicket) {
    if (linkedTicket.id?.startsWith('HR-')) {
      navigate(`/hr-tickets/${linkedTicket.id}`);
    } else {
      setWorkflowLinkedTicket(linkedTicket);
    }
  }

  // Auto-triggered when a linked step activates — build and register the HR ticket
  function handleWorkflowStepCreateTask(stepId, step) {
    const stub = step?.linkedTicket;
    if (!stub?.id?.startsWith('HR-')) return;
    const hrTicket = {
      id: stub.id,
      date: 'Today',
      name: stub.name,
      issueType: ticket.category ?? 'Verification',
      priority: ticket.priority,
      status: 'Not started',
      updated: 'just now',
      sla: '1d',
      slaType: 'normal',
      assignee: null,
      employee: ticket.requester,
      requester: ticket.requester,
      category: ticket.category,
      aiSummary: `${stub.name}. Linked from IT ticket ${ticket.id}.`,
      initPublic: [],
      initInternal: [
        { type: 'inbound', name: 'IT Agent', time: 'just now',
          bg: '6d8aad', fg: 'ffffff', initials: 'IT',
          text: `Verification request from IT queue (${ticket.id}).\n\n${step.body ?? step.label}` },
        { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'just now',
          text: `I've reviewed this request. Here's the recommended approach:\n\n1. Check Workday to confirm Sarah Lee's department transfer (Marketing → Finance) and the effective date\n2. Verify with the Finance team lead that the role change is approved\n3. Once confirmed, update the employment record and reply to the IT queue\n\nEstimated turnaround: 1–2 hours\nPriority: High — Salesforce access is blocked pending this verification.` },
      ],
      initTranscript: [],
      linkedFromId: ticket.id,
    };
    onAddLinkedHRTicket?.(hrTicket);
  }

  function handleWorkflowStepComplete(stepId, step) {
    if (step?.team !== 'Communications Agent') return;
    const firstName = ticket.requester?.name?.split(' ')[0] ?? 'there';
    setChatEvents(prev => [...prev,
      {
        type: 'outbound', isAi: true, senderLabel: 'Communications Agent', time: 'just now',
        text: `Hi ${firstName}! Great news — your Salesforce access has been updated to reflect your new Finance role. You now have full access to the pipeline and revenue reports. Your request ${ticket.id} is now resolved. Let us know if you need anything else!`,
      },
      { type: 'system', text: 'Ticket resolved by Communications Agent' },
    ]);
    setLocalStatus('Resolved');
    onITStatusChange?.('Resolved');
    setTimeout(() => onBack?.(), 30000);
  }

  function handleConfirmRouteToHR(notes) {
    const firstName = ticket.requester?.name?.split(' ')[0] ?? 'there';
    const routingSystemMsg = { type: 'system', text: 'Ticket routed to HR queue — view only' };
    const autoMsg = {
      type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'just now',
      text: `Hi ${firstName}, your ticket has been reviewed and passed to our HR team, who are best placed to help with this. They'll be in touch shortly — your reference ${ticket.id} stays the same.`,
    };
    setRoutedToHR(true);
    setShowRouteModal(false);
    setChatEvents(prev => [...prev, routingSystemMsg, autoMsg]);

    const chatSnapshot = {
      public: [...(chatInitPublic ?? []), ...chatEvents, routingSystemMsg, autoMsg],
      transcript: chatInitTranscript ?? null,
    };
    onRouteComplete?.(ticket, chatSnapshot, notes);
  }

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] overflow-hidden" style={{ position: 'relative' }}>
      <TicketDetailHeader
        ticket={ticket}
        onBack={onBack}
        onRequestApproval={handleRequestApproval}
        onRouteToHR={() => setShowRouteModal(true)}
        onCreateTicketHR={() => setHrCreateOpen(true)}
        onCloseAndMove={() => setShowCloseModal(true)}
        readOnly={routedToHR}
      />

      {/* Banner: ticket routed to HR — IT ticket is now view-only */}
      {routedToHR && (
        <div
          className="shrink-0 flex items-center gap-1"
          style={{ height: 38, padding: '0 24px', background: '#FFFBEB', borderBottom: '1px solid #FDE68A', fontSize: 13, color: '#92400E' }}
        >
          <span>Ticket routed to HR queue</span>
          {hrLinkedTicket && (
            <>
              <span style={{ margin: '0 2px' }}>—</span>
              <button
                type="button"
                onClick={() => onGoToLinkedHRTicket?.(hrLinkedTicket.id)}
                style={{ background: 'none', border: 'none', padding: '0 2px', color: '#92400E', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}
              >
                {hrLinkedTicket.id}
              </button>
            </>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#B45309', fontWeight: 500 }}>View only</span>
        </div>
      )}

      {/* Banner: HR linked ticket — employee stays on IT ticket thread */}
      {ticket.linkedFromId && (
        <div
          className="shrink-0 flex items-center gap-1"
          style={{ height: 38, padding: '0 24px', background: '#FFFBEB', borderBottom: '1px solid #FDE68A', fontSize: 13, color: '#92400E' }}
        >
          <span>Employee is being updated via IT ticket</span>
          <button
            type="button"
            onClick={() => onGoToLinkedITTicket?.(ticket.linkedFromId)}
            style={{ background: 'none', border: 'none', padding: '0 2px', color: '#92400E', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}
          >
            {ticket.linkedFromId}
          </button>
          <span>— communicate with them there</span>
        </div>
      )}

      {/* Banner: ticket closed and moved to Asana */}
      {closedAndMoved && (
        <div
          className="shrink-0 flex items-center gap-1"
          style={{ height: 38, padding: '0 24px', background: '#F0FDF4', borderBottom: '1px solid #BBF7D0', fontSize: 13, color: '#15803D' }}
        >
          <span>Ticket resolved — task created in IT Escalations</span>
          <span style={{ margin: '0 2px' }}>—</span>
          <button
            type="button"
            onClick={() => navigate('/projects/it-escalations')}
            style={{ background: 'none', border: 'none', padding: '0 2px', color: '#15803D', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}
          >
            View in IT Escalations
          </button>
        </div>
      )}

      {/* Body: chat (flex-1) + optional workflow col (TICKET-95) + info sidebar */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-hidden">
          <TicketChatPanel
            ticket={ticket}
            externalEvents={chatEvents}
            commentOnly={routedToHR}
            notesMode={!!ticket.linkedFromId}
            transcriptEventText={transcriptEventText}
            initPublic={chatInitPublic}
            initInternal={chatInitInternal}
            initTranscript={chatInitTranscript}
          />
        </div>
        {ticket.id === 'TICKET-95' && (
          <div style={{ width: 280, flexShrink: 0, borderLeft: '1px solid var(--border)', overflow: 'hidden' }}>
            <WorkflowStepsPanel
              initialSteps={ticket.steps}
              onLinkedTicketClick={handleWorkflowLinkedTicketClick}
              onStepCreateTask={handleWorkflowStepCreateTask}
              onStepComplete={handleWorkflowStepComplete}
            />
          </div>
        )}
        <div style={{ width: '30%', maxWidth: 600, minWidth: 300, flexShrink: 0 }}>
          <TicketInfoSidebar
            ticket={ticket}
            approvalState={approvalState}
            onViewApproval={() => setPanelOpen(true)}
            hrLinkedTicket={hrLinkedTicket}
            onGoToLinkedHRTicket={onGoToLinkedHRTicket}
            localStatus={localStatus}
            localPriority={localPriority}
            statusRef={statusRef}
            priorityRef={priorityRef}
            statusDropdownOpen={statusDropdownOpen}
            setStatusDropdownOpen={setStatusDropdownOpen}
            priorityDropdownOpen={priorityDropdownOpen}
            setPriorityDropdownOpen={setPriorityDropdownOpen}
            onStatusChange={opt => {
              setLocalStatus(opt);
              const isResolved = opt === 'Resolved' || opt === 'Closed';
              dispatch({ type: 'UPDATE_TICKET', id: ticket.id, patch: {
                status: opt,
                ...(isResolved ? { resolvedAt: Date.now() } : {}),
              }});
              if (ticket.linkedFromId) onHRStatusChange?.(opt);
              else onITStatusChange?.(opt);
              setChatEvents(prev => [...prev, { type: 'system', text: `Status changed to ${opt}` }]);
              if (opt === 'Resolved') setTimeout(() => onBack?.(), 700);
            }}
            onPriorityChange={setLocalPriority}
            readOnly={routedToHR}
            steps={ticket.steps}
            onLinkedTicketClick={handleWorkflowLinkedTicketClick}
            onStepCreateTask={handleWorkflowStepCreateTask}
            onStepComplete={handleWorkflowStepComplete}
          />
        </div>
      </div>

      {/* Approval task panel overlay (sidebar-triggered) */}
      <RightPanelOverlay open={panelOpen} onClose={() => setPanelOpen(false)} width="min(660px, 72%)">
        <ApprovalTaskView
          approvalState={approvalState ?? 'pending'}
          onApprove={() => setApprovalState('approved')}
          onReject={() => setApprovalState('rejected')}
          onUndo={() => setApprovalState('pending')}
          onClose={() => setPanelOpen(false)}
        />
      </RightPanelOverlay>

      {/* Workflow step — IT-linked ticket overlay (HR tickets navigate directly) */}
      <RightPanelOverlay open={!!workflowLinkedTicket} onClose={() => setWorkflowLinkedTicket(null)} width="min(660px, 72%)">
        <ApprovalTaskView
          title={workflowLinkedTicket?.name ?? ''}
          ticketId={workflowLinkedTicket?.id ?? ''}
          approvalState="pending"
          onApprove={() => setWorkflowLinkedTicket(null)}
          onReject={() => setWorkflowLinkedTicket(null)}
          onUndo={() => {}}
          onClose={() => setWorkflowLinkedTicket(null)}
        />
      </RightPanelOverlay>

      <CreateHRTicketModal
        open={hrCreateOpen}
        ticket={ticket}
        onClose={() => setHrCreateOpen(false)}
        onCreate={handleHRTicketCreate}
      />

      <RouteToHRModal
        open={showRouteModal}
        ticket={ticket}
        onClose={() => setShowRouteModal(false)}
        onRoute={handleConfirmRouteToHR}
      />

      <CloseAndMoveModal
        open={showCloseModal}
        ticket={ticket}
        onClose={() => setShowCloseModal(false)}
        onConfirm={() => {
          setShowCloseModal(false);
          setClosedAndMoved(true);
          dispatch({ type: 'UPDATE_TICKET', id: ticket.id, patch: { status: 'Closed', resolvedAt: Date.now() } });
        }}
      />
    </div>
  );
}
