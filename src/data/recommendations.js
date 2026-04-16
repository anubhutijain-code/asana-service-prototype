// ─── AI Recommendations — derived from ticket pattern analysis ─────────────────
// Each recommendation is an AI-synthesized insight from ≥2 related tickets.
// Impact figures are estimated monthly values based on trailing 90-day patterns.

export const RECOMMENDATION_CATEGORIES = {
  kb_gap:        { label: 'KB gap',      bg: 'var(--selected-background)',  color: 'var(--selected-text)'  },
  process:       { label: 'Process gap', bg: 'var(--warning-background)',   color: 'var(--warning-text)'   },
  automation:    { label: 'Automation',  bg: '#e8f5e9',                     color: '#2e7d32'               },
  routing:       { label: 'Routing',     bg: '#f3e5f5',                     color: '#7b1fa2'               },
  infrastructure:{ label: 'Infra',       bg: 'var(--danger-background)',    color: 'var(--danger-text)'    },
  workload:      { label: 'Workload',    bg: 'var(--background-medium)',    color: 'var(--text-weak)'      },
};

export const RECOMMENDATIONS = [
  {
    id: 'R1',
    title: 'Employees don\'t know Managed Software Center exists — same ticket, every time',
    category: 'kb_gap',
    priority: 'High',
    impact: {
      ticketsPerMonth: 8,
      hoursSaved: 7,
      effortLabel: '~2 hrs',
      effortLevel: 'low',
      costSaved: '$560/mo',
    },
    confidence: 97,
    aiSummary: 'Three consecutive tickets — TICKET-29, TICKET-33, TICKET-44 — were submitted by different employees requesting admin access or manual installs for fully-approved software (Node.js, Figma, Postman). All three resolved identically: the agent pointed the user to Managed Software Center (MSC). No self-service was attempted because users didn\'t know MSC existed. At the current rate, ~8 similar tickets/month consume ~7 hours of Tier-1 capacity with zero diagnostic value.',
    detail: 'The pattern is conclusive: employees believe installing software requires IT intervention. The resolution is always the same — MSC for approved tools, a request form for unlisted tools. A single KB article and one proactive IT communication campaign would eliminate this ticket class entirely. The deflection opportunity is immediate — no tooling or system changes required.',
    agentQuotes: [
      {
        text: '3rd "software blocked" ticket this month (TICKET-29, TICKET-33, TICKET-44). All three resolved the same way: use Managed Software Center. Employees don\'t know it exists. Need a KB article explaining: why installs are blocked, what MSC is, how to use it, and what to do if software isn\'t listed.',
        author: 'Sarah Smith',
        ticket: 'TICKET-44',
        time: 'Feb 5',
      },
      {
        text: 'Second "can\'t install approved software" ticket in 3 days. Same root cause as TICKET-29. Pattern is clear. Documenting for KB gap.',
        author: 'Sarah Smith',
        ticket: 'TICKET-33',
        time: 'Jan 28',
      },
    ],
    sourceTickets: [
      { id: 'TICKET-44', name: 'Software Install Blocked by Company Policy', status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-33', name: "Can't Install Figma Without Admin Rights", status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-29', name: 'Need Admin Access to Install Dev Tools', status: 'Resolved', priority: 'Medium' },
    ],
    actions: [
      { label: 'Create KB article', primary: true, type: 'kb' },
      { label: 'Create automation rule', primary: false, type: 'automation' },
      { label: 'Dismiss', primary: false, type: 'dismiss' },
    ],
  },

  {
    id: 'R2',
    title: 'MFA lockouts after device handoffs are 100% preventable — update the checklist',
    category: 'process',
    priority: 'High',
    impact: {
      ticketsPerMonth: 4,
      hoursSaved: 5,
      effortLabel: '~1 hr',
      effortLevel: 'low',
      costSaved: '$400/mo',
    },
    confidence: 94,
    aiSummary: 'TICKET-42, TICKET-70, and TICKET-62 all stem from the same gap: IT hands off a new or replacement device without pre-enrolling MFA, leaving users locked out of every company application on their first login. Lockouts typically occur outside business hours (new device pickup, end of day swap), meaning users wait hours for resolution. Each incident takes 20–30 minutes to resolve and generates detectable employee frustration in the transcript.',
    detail: 'The fix requires one change to the device handoff checklist: reset and pre-enroll Okta MFA factors before handing the device to the user. TICKET-42\'s resolution note explicitly recommends this. An additional quick-win: KB article on MFA re-enrollment would give users a self-service path for the OS-update variant (TICKET-67), which triggers the same symptom from a different cause.',
    agentQuotes: [
      {
        text: 'User confirmed full access restored. Ticket closed. Process note: IT should proactively reset MFA before device handoffs — this is the second ticket this month from the same preventable cause.',
        author: 'AI Agent (auto-note)',
        ticket: 'TICKET-42',
        time: 'Feb 3',
      },
      {
        text: 'Along with TICKET-62 and TICKET-69 this is the 3rd MFA re-enrollment ticket in 2 weeks from different triggers (lost device, dept transfer, OS update). We don\'t have a KB article on MFA re-enrollment at all — users are panicking and wasting time.',
        author: 'Martin Ludington',
        ticket: 'TICKET-67',
        time: 'Feb 23',
      },
    ],
    sourceTickets: [
      { id: 'TICKET-42', name: 'MFA Not Working After Laptop Swap', status: 'Resolved', priority: 'Critical' },
      { id: 'TICKET-70', name: "Can't Log In After Device Replacement", status: 'Resolved', priority: 'Critical' },
      { id: 'TICKET-62', name: 'Report Lost Laptop for Patrick Tuckey', status: 'Investigating', priority: 'Critical' },
      { id: 'TICKET-67', name: 'Help Updating MacBook to Latest macOS', status: 'Not started', priority: 'Low' },
    ],
    actions: [
      { label: 'Update device handoff checklist', primary: true, type: 'process' },
      { label: 'Create MFA re-enrollment KB article', primary: false, type: 'kb' },
      { label: 'Dismiss', primary: false, type: 'dismiss' },
    ],
  },

  {
    id: 'R3',
    title: 'Department transfers don\'t trigger license updates — build a Workday automation',
    category: 'automation',
    priority: 'High',
    impact: {
      ticketsPerMonth: 3,
      hoursSaved: 6,
      effortLabel: '~3 days',
      effortLevel: 'medium',
      costSaved: '$480/mo',
    },
    confidence: 91,
    aiSummary: 'TICKET-95 and TICKET-69 both resulted from the same system gap: when HR processes a department transfer in Workday, the identity management sync applies the old department\'s software licence template — or leaves it unchanged — rather than triggering a licence audit. In TICKET-69, Jordan Park transferred from Marketing to Finance but retained an M365 E1 licence, blocking Power BI and advanced Excel. In TICKET-95, Sarah Lee\'s Salesforce role was not updated to the Finance profile. Both tickets required manual HR verification before IT could act, averaging 3 hours each.',
    detail: 'A Workday → IT integration that fires a licence review task on confirmed department transfer would eliminate this ticket class and dramatically reduce time-to-access for transferred employees. Short-term: an automated daily audit comparing HR department data to licence assignments would catch mismatches before employees report them. This also reduces audit/compliance risk from employees holding licences above their current entitlement.',
    agentQuotes: [
      {
        text: 'Checked Jordan\'s account — currently assigned M365 Business Basic (E1). Finance entitlement should be E3 based on the role catalogue. The identity sync last week auto-applied a Marketing template because the HR system still shows a pending department change rather than confirmed. We can push the E3 licence manually but our compliance policy requires HR sign-off first.',
        author: 'Steve Smith',
        ticket: 'TICKET-69',
        time: 'Feb 24',
      },
    ],
    sourceTickets: [
      { id: 'TICKET-95', name: 'Salesforce Access Update — Department Transfer (Sarah Lee)', status: 'In Progress', priority: 'Critical' },
      { id: 'TICKET-69', name: 'Wrong Microsoft 365 License After Department Transfer', status: 'Investigating', priority: 'Medium' },
    ],
    actions: [
      { label: 'Build Workday integration', primary: true, type: 'automation' },
      { label: 'Create daily licence audit rule', primary: false, type: 'automation' },
      { label: 'Dismiss', primary: false, type: 'dismiss' },
    ],
  },

  {
    id: 'R4',
    title: '7 HR policy tickets/month are landing in the IT queue — route them at intake',
    category: 'routing',
    priority: 'Medium',
    impact: {
      ticketsPerMonth: 7,
      hoursSaved: 4,
      effortLabel: '~30 min',
      effortLevel: 'low',
      costSaved: '$320/mo',
    },
    confidence: 96,
    aiSummary: 'TICKET-58, TICKET-71, TICKET-72, TICKET-73, TICKET-74, TICKET-49, and TICKET-68 all involved HR policy questions (parental leave impact on bonus, performance ratings during leave, expense reimbursement limits, benefits coverage, payroll discrepancies) that were routed to IT agents who then had to manually reassign or loop in People Ops. None required IT tooling or access. The average time-in-IT-queue before re-routing was 38 minutes.',
    detail: 'The AI triage classifier is correctly identifying these as non-technical requests, but the routing rule defaults to IT rather than a dedicated HR/People Ops queue. Adding intent signals — "parental leave", "bonus", "payroll", "expense", "benefits" — to the HR routing rule would redirect these at submission, reducing IT queue noise and improving response time for actual IT tickets. Two of these also flagged KB gaps: no article covers leave → performance/bonus impact, and the expense policy article is incomplete.',
    agentQuotes: [
      {
        text: 'Resolved. 2nd parental leave + performance/bonus question this month (TICKET-68 was the other). HR KB has no article covering the leave → performance impact. Every time it comes up we\'re answering from scratch. Flagging for KB draft alongside TICKET-68.',
        author: 'Steve Smith',
        ticket: 'TICKET-72',
        time: 'Feb 10',
      },
      {
        text: 'Resolved. This has come up 3 times in 2 months. Employees don\'t know what counts as an approvable home-office expense vs what\'s out of pocket. We need a clear, current expense policy article — the one in the KB is from 2023 and references the old $300 limit.',
        author: 'Martin Ludington',
        ticket: 'TICKET-73',
        time: 'Feb 28',
      },
    ],
    sourceTickets: [
      { id: 'TICKET-68', name: 'Paycheck Short — Missing Overtime Pay for Feb', status: 'Not started', priority: 'Medium' },
      { id: 'TICKET-72', name: 'Will Parental Leave Affect My Review Rating?', status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-71', name: 'Performance Cycle During Leave of Absence', status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-58', name: 'Will My Parental Leave Affect My Bonus Calculation?', status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-49', name: "Is My Dentist Still In-Network After Plan Change?", status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-73', name: 'Can I Expense a Standing Desk for Home Office?', status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-74', name: 'Reimbursement Limit for Monitor Purchase', status: 'Resolved', priority: 'Low' },
    ],
    actions: [
      { label: 'Update routing rule', primary: true, type: 'automation' },
      { label: 'Create HR KB articles', primary: false, type: 'kb' },
      { label: 'Dismiss', primary: false, type: 'dismiss' },
    ],
  },

  {
    id: 'R5',
    title: 'L1 deflection works — 3 more "How-to" clusters are ready to automate',
    category: 'kb_gap',
    priority: 'Medium',
    impact: {
      ticketsPerMonth: 6,
      hoursSaved: 4,
      effortLabel: '~3 hrs',
      effortLevel: 'low',
      costSaved: '$320/mo',
    },
    confidence: 93,
    aiSummary: 'TICKET-96 proved the deflection flywheel: a manual resolution in TICKET-55 generated a KB article, and the next identical "how to record screen on Mac" request was deflected automatically at 96% confidence with no agent time. The same pattern is visible in three other active clusters: Outlook out-of-office setup (TICKET-57, similar questions in last 60 days), macOS update + Okta re-enrollment (TICKET-67, 2 tickets same week), and Jira self-service access requests (TICKET-53, recurring monthly). Each cluster has a known resolution and a clear trigger phrase.',
    detail: 'The marginal cost of creating these three articles is low — resolutions already exist in closed tickets and just need to be structured into KB format. Once published, the AI deflection engine will match on intake and close qualifying tickets within minutes. The compounding effect matters: each deflected ticket also trains the intent classifier, improving deflection accuracy across all future similar requests.',
    agentQuotes: [
      {
        text: 'This is exactly the deflection we were waiting for. TICKET-55 was the same question — I answered it manually and flagged it for KB. Once the article went live, the next identical request deflected automatically with zero agent time. The learning loop worked.',
        author: 'Steve Smith',
        ticket: 'TICKET-96',
        time: 'Mar 2',
      },
      {
        text: 'Resolved. User didn\'t know the in-app request flow existed. We see this every week — employees don\'t know which tools are self-serve vs IT-managed. Jira, Figma, Notion are all self-serve; Salesforce, GitHub, AWS need IT. No KB article explains this distinction.',
        author: 'Sarah Smith',
        ticket: 'TICKET-53',
        time: 'Feb 6',
      },
    ],
    sourceTickets: [
      { id: 'TICKET-96', name: 'How do I record my screen on Mac?', status: 'AI Deflected', priority: 'Low' },
      { id: 'TICKET-55', name: 'How to record screen on Mac', status: 'Closed', priority: 'Low' },
      { id: 'TICKET-57', name: 'How to set up out-of-office in Outlook', status: 'Resolved', priority: 'Low' },
      { id: 'TICKET-67', name: 'Help Updating MacBook to Latest macOS', status: 'Not started', priority: 'Low' },
      { id: 'TICKET-53', name: 'Need access to Jira project for Q1 planning', status: 'Closed', priority: 'Low' },
    ],
    actions: [
      { label: 'Create 3 KB articles', primary: true, type: 'kb' },
      { label: 'View deflection report', primary: false, type: 'report' },
      { label: 'Dismiss', primary: false, type: 'dismiss' },
    ],
  },

  {
    id: 'R6',
    title: 'Vancouver office WiFi has 3 unresolved tickets — this is an infrastructure issue',
    category: 'infrastructure',
    priority: 'Medium',
    impact: {
      ticketsPerMonth: 3,
      hoursSaved: 3,
      effortLabel: '~1 day',
      effortLevel: 'medium',
      costSaved: 'SLA risk',
    },
    confidence: 88,
    aiSummary: 'TICKET-60, TICKET-63, and TICKET-65 all involve WiFi connectivity issues. TICKET-60 and TICKET-65 both mention the Vancouver office specifically; TICKET-63 describes the same symptom (dropped connection, device-specific) at what appears to be the same physical location. All three are either unresolved or on hold. TICKET-63 has been open for 5 days and is already breaching SLA by 2 days. The devices involved span iPhone, MacBook, and multiple users — ruling out a single device issue.',
    detail: 'The breadth of affected devices and the location overlap strongly suggest a shared infrastructure problem: access point firmware, VLAN configuration, or DHCP pool exhaustion in the Vancouver office. Continuing to work these as individual tickets creates redundant effort and masks the true scope. Consolidating into a single P1 infrastructure investigation and looping in the network team would resolve all three simultaneously and prevent the fourth ticket.',
    agentQuotes: [
      {
        text: 'TICKET-65 is the second WiFi complaint from the Vancouver office in 10 days. The previous one (TICKET-60) is still on hold. User can connect to the corporate guest network but not the main SSID. This pattern — guest works, corporate doesn\'t — usually means a RADIUS auth issue or a device certificate problem. But two users on different devices having the same problem points to the AP.',
        author: 'Ang Lee',
        ticket: 'TICKET-65',
        time: 'Feb 20',
      },
    ],
    sourceTickets: [
      { id: 'TICKET-65', name: 'Phone Not Connecting to WiFi in Vancouver Office', status: 'Investigating', priority: 'Medium' },
      { id: 'TICKET-63', name: 'Unable to Connect to WiFi After Troubleshooting', status: 'On hold', priority: 'Critical' },
      { id: 'TICKET-60', name: 'Phone Unable to Connect to Office WiFi', status: 'On hold', priority: 'Medium' },
    ],
    actions: [
      { label: 'Create infrastructure ticket', primary: true, type: 'escalate' },
      { label: 'Assign to network team', primary: false, type: 'assign' },
      { label: 'Dismiss', primary: false, type: 'dismiss' },
    ],
  },

  {
    id: 'R7',
    title: 'SLA compliance at 67% — 4 critical tickets breaching, workload concentrated on one agent',
    category: 'workload',
    priority: 'High',
    impact: {
      ticketsPerMonth: null,
      hoursSaved: null,
      effortLabel: 'Immediate',
      effortLevel: 'low',
      costSaved: 'SLA target',
    },
    confidence: 99,
    aiSummary: 'SLA compliance has trended down from 74% to 67% over the past 4 weeks — 3 points below the 70% target. Four tickets are currently breaching: TICKET-62 (Critical, 5 days overdue), TICKET-63 (Critical, 2 days overdue), TICKET-51 (Critical, 6 hours overdue), and TICKET-57 (Low, 1 day overdue). Of the 4 breached critical tickets, 3 are assigned to Steve Smith — the only agent currently handling Critical-priority work. Sarah Smith and Martin Ludington both have capacity.',
    detail: 'The SLA trajectory is worsening, not stabilizing. Redistributing TICKET-51 and TICKET-63 to Martin would immediately reduce the breach count and bring Steve\'s queue back to a manageable load. Longer term: the team lacks a defined escalation path for Criticals that breach 50% SLA — automatic reassignment or a manager alert at the 50% mark would catch these before they breach. TICKET-62 (lost laptop) is additionally at risk because the 24-hour remote wipe window may expire without a human decision on the replacement device.',
    agentQuotes: [
      {
        text: 'TICKET-62, TICKET-63, and TICKET-51 are all breaching SLA and all assigned to Steve. He\'s handling the lost laptop investigation on top of two other overdue Criticals. Martin and Sarah both have bandwidth — suggest redistributing at standup.',
        author: 'AI Workload Monitor',
        ticket: 'System',
        time: 'Today',
      },
    ],
    sourceTickets: [
      { id: 'TICKET-62', name: 'Report Lost Laptop for Patrick Tuckey', status: 'Investigating', priority: 'Critical' },
      { id: 'TICKET-63', name: 'Unable to Connect to WiFi After Troubleshooting', status: 'On hold', priority: 'Critical' },
      { id: 'TICKET-51', name: 'Screen flickering on external monitor', status: 'Investigating', priority: 'Critical' },
    ],
    actions: [
      { label: 'Reassign overdue tickets', primary: true, type: 'assign' },
      { label: 'Set up SLA alert rule', primary: false, type: 'automation' },
      { label: 'Dismiss', primary: false, type: 'dismiss' },
    ],
  },
];

// Hero summary across all recommendations
export const RECOMMENDATIONS_SUMMARY = {
  totalOpportunities: RECOMMENDATIONS.length,
  ticketsEliminatedPerMonth: RECOMMENDATIONS.reduce((s, r) => s + (r.impact.ticketsPerMonth || 0), 0),
  hoursSavedPerMonth: RECOMMENDATIONS.reduce((s, r) => s + (r.impact.hoursSaved || 0), 0),
  highPriority: RECOMMENDATIONS.filter(r => r.priority === 'High').length,
  lowEffort: RECOMMENDATIONS.filter(r => r.impact.effortLevel === 'low').length,
};
