// ─── Tickets dashboard data ────────────────────────────────────────────────────

export const STATS = [
  { label: 'Total tickets',                    value: '51',  trend: '+4 from last week',      trendGood: true  },
  { label: 'AI-deflected tickets',             value: '14',  trend: '27% of total',           trendGood: true  },
  { label: 'AI deflection rate',               value: '99%', trend: '3% above last month',    trendGood: true  },
  { label: 'MTTA (Mean Time to Acknowledge)',  value: '4s',  trend: '18% faster than target', trendGood: true  },
  { label: 'SLA compliance',                   value: '67%', trend: '3% below target',        trendGood: false },
];

export const TABS = ['My Tickets', 'All Tickets', 'Unassigned', 'Open Tickets', 'SLA Urgent', 'Resolved'];

export const PEOPLE = {
  steve:  { name: 'Steve Smith',   initials: 'SS', bg: '6d8aad', fg: 'ffffff' },
  sarah:  { name: 'Sarah Smith',   initials: 'SS', bg: 'd4938a', fg: 'ffffff' },
  martin: { name: 'Martin Lud…',   initials: 'ML', bg: '7a9abf', fg: 'ffffff' },
  ang:    { name: 'Ang Lee',       initials: 'AL', bg: 'a08060', fg: 'ffffff' },
  pat:    { name: 'Patrick Tuckey', initials: 'PT', bg: '8b7ab5', fg: 'ffffff' },
  anj:    { name: 'Anjelica Silva', initials: 'AS', bg: 'b58a7a', fg: 'ffffff' },
  jordan: { name: 'Jordan Park',   initials: 'JP', bg: '5a8f6b', fg: 'ffffff' },
};

// Logged-in user — drives the "My Tickets" tab
export const CURRENT_USER = PEOPLE.steve;

export const TICKETS = [
  {
    id: 'TICKET-95',
    name: 'Salesforce Access Update — Department Transfer (Sarah Lee)',
    status: 'In Progress',
    priority: 'Critical',
    category: 'Access Management',
    subcategory: 'Role Update',
    date: 'Today',
    hasImage: false,
    updated: 'just now',
    sla: '45m remaining',
    slaPercent: 80,
    slaType: 'warning',
    requester: { name: 'Sarah Lee', email: 'sarah.lee@company.com', bg: '4573D2', fg: 'ffffff', initials: 'SL' },
    assignee: null,
    team: 'Service Desk',
    aiTag: 'AI Classified · 98%',
    initPublic: [
      { type: 'inbound', name: 'Sarah Lee', time: '8 min ago', bg: '4573D2', fg: 'ffffff', initials: 'SL',
        text: "Hi, I transferred to the Finance team last week but my Salesforce still shows my old Marketing role. I can't see the Finance pipeline reports I need — my manager is waiting on this." },
      { type: 'outbound', isAi: true, senderLabel: 'IT Bot', time: '7 min ago',
        text: "Hi Sarah! I've logged this as TICKET-95 (Critical) and kicked off parallel tasks — HR is confirming your transfer and your manager has been sent an approval request. We'll update your access as soon as both are confirmed." },
    ],
    initInternal: [],
    initTranscript: [],
    steps: [
      {
        id: 's1', type: 'agent',
        label: 'Intake & Task Distribution', team: 'IT Agent',
        status: 'active',
        body: 'Classified as Access Management → Salesforce role update post department transfer. Kicked off parallel HR verification and manager approval tasks.',
      },
      {
        id: 's2', type: 'linked',
        label: 'HR Employment Verification', team: 'HR',
        status: 'pending',
        parallelGroup: 'approval-check',
        linkedTicket: { id: 'HR-112', name: 'Confirm department transfer: Sarah Lee (Marketing → Finance)', status: 'Open' },
      },
      {
        id: 's3', type: 'linked',
        label: 'Manager Approval', team: 'Manager',
        status: 'pending',
        parallelGroup: 'approval-check',
        // CWM task — no IT ticket ID
        linkedTicket: { name: 'Manager approval: Salesforce access update for Sarah Lee', status: 'Open' },
      },
      {
        id: 's4', type: 'agent',
        label: 'Provision Updated Access', team: 'AI Provisioning Agent',
        status: 'pending',
        assignee: { type: 'ai', name: 'AI Provisioning Agent' },
        body: "AI agent updating Sarah's Salesforce profile to Finance role template with pipeline and revenue report permissions.",
      },
      {
        id: 's5', type: 'agent',
        label: 'Notify & Resolve', team: 'Communications Agent',
        status: 'pending',
        assignee: { type: 'ai', name: 'Communications Agent' },
      },
    ],
  },
  {
    id: 'TICKET-69', date: 'Feb 24, 2026', name: 'Wrong Microsoft 365 License After Department Transfer',
    hasImage: false, priority: 'Medium', status: 'Investigating', updated: '2 hours ago',
    sla: '1d', slaType: 'normal', assignee: PEOPLE.steve, requester: PEOPLE.jordan,
    submitter: { name: 'Jordan Park', email: 'j.park@acme.com', location: 'Austin', org: 'Finance', deviceId: 'MBP-7821' },
    category: 'Software Access',
    aiSummary: 'Jordan Park recently transferred from Marketing to Finance but their Microsoft 365 license was auto-downgraded from E3 to E1 by the identity management sync. They are blocked from Power BI and advanced Excel features required for Finance reporting. IT can apply the license correction but needs HR to formally confirm the department transfer before authorising the E3 tier upgrade.',
    initTranscript: [
      { type: 'outbound', isAi: true, text: "Hi Jordan! I'm the Asana IT Bot. How can I help you today?", senderLabel: 'IT Bot', time: 'Feb 24, 7:12am' },
      { type: 'inbound', text: "Hi — I transferred to the Finance team about 3 weeks ago but I can't access Power BI or use any of the advanced Excel features. My colleagues in Finance all have them but mine just shows a licence error.", name: 'Jordan Park', time: 'Feb 24, 7:14am', bg: '5a8f6b', fg: 'ffffff', initials: 'JP' },
      { type: 'outbound', isAi: true, text: "Thanks for flagging, Jordan. That sounds like a licence tier mismatch — your account may still be on the Marketing licence profile. I'll create a ticket so the IT team can investigate and get this sorted.", senderLabel: 'IT Bot', time: 'Feb 24, 7:14am' },
      { type: 'inbound', text: "Please make it quick if you can — I have a budget variance report due tomorrow and the data I need is all in Power BI. I literally can't do my job without it.", name: 'Jordan Park', time: 'Feb 24, 7:15am', bg: '5a8f6b', fg: 'ffffff', initials: 'JP' },
      { type: 'outbound', isAi: true, text: "Understood — flagged as Medium priority given the deadline. Your IT team will be in touch shortly. Reference: TICKET-69.", senderLabel: 'IT Bot', time: 'Feb 24, 7:15am' },
    ],
    initPublic: [
      { type: 'outbound', isAi: true, text: "Hi Jordan, we've picked up your ticket and are looking into the licence mismatch now. We'll update you as soon as we have a path forward.", senderLabel: 'IT Agent', time: '2 hours ago' },
      { type: 'system', text: 'Steve Smith has been assigned to this ticket' },
      { type: 'outbound', isAi: false, text: "Hi Jordan — I've looked into this. Your account is currently on an M365 Business Basic licence (E1), which doesn't include Power BI or the advanced Excel add-ins. Finance roles are on E3, which covers all of that.\n\nThe mismatch happened because the identity sync applied a Marketing licence template when your transfer came through — looks like the department change is still showing as pending in the HR system rather than confirmed. We need HR to formally close that out before we can authorise the licence upgrade with a proper audit trail. I'm getting that process started now so we can unblock you as quickly as possible.", senderLabel: 'You', time: '1 hour ago' },
      { type: 'inbound', text: "Thanks for the explanation. I transferred 3 weeks ago so I'm not sure why it's still showing as pending. Is there anything I can do to speed it up?", name: 'Jordan Park', time: '45 mins ago', bg: '5a8f6b', fg: 'ffffff', initials: 'JP' },
      { type: 'outbound', isAi: false, text: "You don't need to do anything on your end — I'm raising it directly with the HR team now. Once they confirm the transfer in Workday I can apply the licence straight away. I'll keep you posted and aim to have this sorted before your report deadline.", senderLabel: 'You', time: '30 mins ago' },
    ],
    initInternal: [
      { type: 'inbound', text: "Checked Jordan's account — currently assigned M365 Business Basic (E1). Finance entitlement should be M365 E3 based on the role catalogue. The identity sync last week auto-applied a Marketing template because the HR system still shows a pending department change rather than confirmed. We can push the E3 licence manually but our compliance policy requires HR sign-off on the org change first — otherwise we'd have no audit trail and Finance sign-off for the cost uplift.", name: 'Steve Smith', time: '45 mins ago', bg: '6d8aad', fg: 'ffffff', initials: 'SS' },
      { type: 'outbound', isAi: false, text: "Yeah this is a split — IT side is straightforward once HR confirms. Someone needs to chase HR to get the transfer status marked as complete in Workday. Creating an HR ticket makes sense here so both tracks move in parallel.", senderLabel: 'You', time: 'just now' },
    ],
  },
  {
    id: 'TICKET-68', date: 'Feb 24, 2026', name: 'Paycheck Short — Missing Overtime Pay for Feb',
    hasImage: false, priority: 'Medium', status: 'Not started', updated: 'just now',
    sla: '2d', slaType: 'normal', assignee: null, requester: PEOPLE.anj,
    submitter: { name: 'Anjelica Silva', email: 'a.silva@acme.com', location: 'San Francisco', org: 'Operations', deviceId: null },
    category: 'Payroll',
    aiSummary: 'Anjelica Silva from Operations has reported a payroll discrepancy — approximately $340 in overtime pay is missing from last week\'s paycheck. She has flagged this as urgent due to an upcoming rent payment and followed up once already without a response.',
  },
  { id: 'TICKET-67', date: 'Feb 23, 2026', name: 'Help Updating MacBook to Latest macOS',            hasImage: false, priority: 'Low',      status: 'Not started',   updated: '5 mins ago',  sla: '4d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.pat    },
  {
    id: 'TICKET-66', date: 'Feb 22, 2026', name: 'Urgent Request for SFDC License Access',
    hasImage: true, priority: 'Critical', status: 'On hold', updated: '1 day ago',
    sla: '15m', slaType: 'warning', assignee: PEOPLE.steve, requester: PEOPLE.martin,
    submitter: { name: 'Martin Ludington', email: 'm.ludington@acme.com', location: 'New York', org: 'RevOps', deviceId: 'SFX-3302' },
    category: 'Software Access',
    aiSummary: 'Martin Ludington from RevOps has submitted an urgent request for Salesforce Professional Edition access. He requires full reporting capabilities to prepare Q1 pipeline analysis for a board presentation scheduled for today at 3pm.',
    initTranscript: [
      { type: 'outbound', isAi: true,  text: "Hi Martin! I'm the Asana IT Bot. How can I help you today?", senderLabel: 'IT Bot', time: 'Feb 22, 9:04am' },
      { type: 'inbound',  text: "Hi, I need Salesforce Professional access. I'm in RevOps and need it for Q1 pipeline reporting.", name: 'Martin Ludington', time: 'Feb 22, 9:05am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: true,  text: "I can help with that. Let me check our records... I don't see an existing Salesforce account for you. Do you have manager approval for this license request?", senderLabel: 'IT Bot', time: 'Feb 22, 9:05am' },
      { type: 'inbound',  text: "Yes, my manager Jen approved it last week. This is really urgent — I have a board presentation at 3pm today and I need to pull the Q1 pipeline data.", name: 'Martin Ludington', time: 'Feb 22, 9:06am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: true,  text: "Understood. I'm checking our current Professional license inventory... we have limited availability. Given the urgency, I'm escalating this directly to the IT team as Critical priority.", senderLabel: 'IT Bot', time: 'Feb 22, 9:06am' },
      { type: 'inbound',  text: "Thank you. Please make it as fast as possible.", name: 'Martin Ludington', time: 'Feb 22, 9:07am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: true,  text: "Done — ticket created and assigned to our IT team. You'll hear back shortly. Your reference number is TICKET-66.", senderLabel: 'IT Bot', time: 'Feb 22, 9:07am' },
    ],
    initPublic: [
      { type: 'outbound', isAi: true,  text: "Thanks for reaching out! Your Salesforce license request has been logged as Critical priority. An IT agent will review it shortly.", senderLabel: 'IT Agent', time: '1 day ago' },
      { type: 'system',  text: 'Steve Smith has been assigned to this ticket' },
      { type: 'inbound', text: "Hi, I urgently need Salesforce Professional access. I have a board presentation this afternoon and need to pull Q1 pipeline reports.", name: 'Martin Ludington', time: '22 hours ago', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: false, text: "Hi Martin, I've reviewed your request. The Professional edition includes the full reporting suite you need for RevOps. Checking license availability with Finance now.", senderLabel: 'You', time: '20 hours ago' },
      { type: 'inbound', text: "Thanks! Is there any way to expedite this? I'm presenting to the board at 3pm today.", name: 'Martin Ludington', time: '18 hours ago', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: false, text: "Great news — Finance confirmed 2 available licenses to reassign. Your access is being provisioned now. Expect an email confirmation within 15 minutes.", senderLabel: 'You', time: '2 hours ago' },
    ],
    initInternal: [
      { type: 'inbound', text: "Hey Steve, picked up the SFDC license ticket. Do you know which tier Martin needs?", name: 'Liam Torres', time: '20 mins ago', bg: '7a9abf', fg: 'ffffff', initials: 'LT' },
      { type: 'outbound', isAi: false, text: "He needs the Professional edition — he's in RevOps and needs the full reporting suite.", senderLabel: 'You', time: '18 mins ago' },
      { type: 'system', text: 'Priya Singh has joined the internal chat' },
      { type: 'inbound', text: "Checked with Finance — we have 2 unused licenses we can reassign. Sending the provisioning request now.", name: 'Priya Singh', time: '12 mins ago', bg: 'b58a7a', fg: 'ffffff', initials: 'PS' },
      { type: 'outbound', isAi: false, text: "Thanks Priya. I'll update the ticket status and let Martin know to expect an access email shortly.", senderLabel: 'You', time: '10 mins ago' },
      { type: 'inbound', text: "Done — license provisioned. Martin should have access within 15 minutes.", name: 'Priya Singh', time: '5 mins ago', bg: 'b58a7a', fg: 'ffffff', initials: 'PS' },
    ],
  },
  { id: 'TICKET-65', date: 'Feb 20, 2026', name: 'Phone Not Connecting to WiFi in Vancouver Office',  hasImage: true,  priority: 'Medium',   status: 'Investigating', updated: '3 days ago',  sla: '−45m', slaType: 'overdue', assignee: PEOPLE.ang,    requester: PEOPLE.sarah  },
  { id: 'TICKET-64', date: 'Feb 19, 2026', name: 'Request View Access to Figma and FigJam',           hasImage: false, priority: 'Low',      status: 'Not started',   updated: '4 days ago',  sla: '2d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.anj    },
  { id: 'TICKET-63', date: 'Feb 18, 2026', name: 'Unable to Connect to WiFi After Troubleshooting',   hasImage: false, priority: 'Critical', status: 'On hold',       updated: '5 days ago',  sla: '−2d',  slaType: 'overdue', assignee: PEOPLE.martin, requester: PEOPLE.sarah  },
  { id: 'TICKET-62', date: 'Feb 12, 2026', name: 'Report Lost Laptop for Patrick Tuckey',             hasImage: true,  priority: 'Critical', status: 'Investigating', updated: '11 days ago', sla: '−5d',  slaType: 'overdue', assignee: PEOPLE.steve,  requester: PEOPLE.pat    },
  { id: 'TICKET-61', date: 'Feb 12, 2026', name: 'Help Migrating Files From Dropbox to Google Drive', hasImage: false, priority: 'Medium',   status: 'Not started',   updated: '11 days ago', sla: '1d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.ang    },
  { id: 'TICKET-60', date: 'Feb 12, 2026', name: 'Phone Unable to Connect to Office WiFi',            hasImage: false, priority: 'Medium',   status: 'On hold',       updated: '11 days ago', sla: '6h',   slaType: 'warning', assignee: PEOPLE.ang,    requester: PEOPLE.sarah  },
  { id: 'TICKET-58', date: 'Feb 10, 2026', name: 'Request for Tool to Test Tickets',                  hasImage: true,  priority: 'Low',      status: 'Resolved',      updated: '13 days ago', sla: '−1d',  slaType: 'overdue', assignee: PEOPLE.steve,  requester: PEOPLE.martin },
  { id: 'TICKET-57', date: 'Feb 10, 2026', name: 'Request for Tool to Test Tickets',                  hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '13 days ago', sla: '−1d',  slaType: 'overdue', assignee: PEOPLE.sarah,  requester: PEOPLE.ang    },
  { id: 'TICKET-56', date: 'Feb 9, 2026',  name: 'Zoom Not Working for Anjelica Silva',               hasImage: false, priority: 'Medium',   status: 'Closed',        updated: '14 days ago', sla: '2d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.anj    },
  { id: 'TICKET-55', date: 'Feb 9, 2026',  name: 'How to record screen on Mac',                       hasImage: false, priority: 'Low',      status: 'Closed',        updated: '14 days ago', sla: '3d',   slaType: 'normal',  assignee: PEOPLE.steve,  requester: PEOPLE.ang    },
  { id: 'TICKET-54', date: 'Feb 7, 2026',  name: 'Printer offline after Windows update',              hasImage: true,  priority: 'Medium',   status: 'Resolved',      updated: '16 days ago', sla: '−3d',  slaType: 'overdue', assignee: PEOPLE.martin, requester: PEOPLE.pat    },
  { id: 'TICKET-53', date: 'Feb 6, 2026',  name: 'Need access to Jira project for Q1 planning',       hasImage: false, priority: 'Low',      status: 'Closed',        updated: '17 days ago', sla: '1d',   slaType: 'normal',  assignee: PEOPLE.sarah,  requester: PEOPLE.martin },
  { id: 'TICKET-52', date: 'Feb 5, 2026',  name: 'Outlook calendar not syncing with mobile',          hasImage: false, priority: 'Medium',   status: 'Not started',   updated: '18 days ago', sla: '2d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.anj    },
  { id: 'TICKET-51', date: 'Feb 4, 2026',  name: 'Screen flickering on external monitor',             hasImage: true,  priority: 'Critical', status: 'Investigating', updated: '19 days ago', sla: '−6h',  slaType: 'overdue', assignee: PEOPLE.steve,  requester: PEOPLE.sarah  },
];

// ─── HR data ───────────────────────────────────────────────────────────────────

export const HR_PEOPLE = {
  sarah_hr: { name: 'Sarah Chen',    initials: 'SC', bg: 'a07abf', fg: 'ffffff' },
  james:    { name: 'James Walker',  initials: 'JW', bg: '7aabba', fg: 'ffffff' },
  priya_hr: { name: 'Priya Nair',    initials: 'PN', bg: 'b57a8a', fg: 'ffffff' },
  liam:     { name: 'Liam Torres',   initials: 'LT', bg: '7a9abf', fg: 'ffffff' },
  maya:     { name: 'Maya Johnson',  initials: 'MJ', bg: '8ab57a', fg: 'ffffff' },
  david:    { name: 'David Kim',     initials: 'DK', bg: 'bf9a7a', fg: 'ffffff' },
  emma:     { name: 'Emma Davis',    initials: 'ED', bg: '9ab57a', fg: 'ffffff' },
};

export const HR_STATS = [
  { label: 'Open Cases',          value: '8',     trend: '3% from last week',     trendGood: false },
  { label: 'Avg Resolution Time', value: '1d 4h', trend: '12% faster than target', trendGood: true  },
  { label: 'SLA Compliance',      value: '95%',   trend: '1% below target',        trendGood: false },
  { label: 'Escalated Cases',     value: '2',     trend: '1 fewer than last week',  trendGood: true  },
];

export const HR_TABS = ['All Cases', 'Open Cases', 'Pending', 'Resolved'];

export const HR_TICKETS = [
  { id: 'HR-014', date: 'Feb 24, 2026', name: 'Parental Leave Policy Clarification',  issueType: 'Leave',       priority: 'Medium',   status: 'Investigating', updated: 'just now',    sla: '3d',   slaType: 'normal',  assignee: HR_PEOPLE.sarah_hr, employee: HR_PEOPLE.maya   },
  { id: 'HR-013', date: 'Feb 23, 2026', name: 'Incorrect Payroll Deduction for Feb',  issueType: 'Payroll',     priority: 'Critical', status: 'On hold',       updated: '1 day ago',   sla: '4h',   slaType: 'warning', assignee: HR_PEOPLE.james,    employee: HR_PEOPLE.liam   },
  { id: 'HR-012', date: 'Feb 22, 2026', name: 'Benefits Enrollment — Missed Window',  issueType: 'Benefits',    priority: 'Critical', status: 'Not started',   updated: '2 days ago',  sla: '−1d',  slaType: 'overdue', assignee: null,               employee: HR_PEOPLE.david  },
  { id: 'HR-011', date: 'Feb 20, 2026', name: 'Onboarding Checklist Not Completed',   issueType: 'Onboarding',  priority: 'Low',      status: 'Investigating', updated: '4 days ago',  sla: '2d',   slaType: 'normal',  assignee: HR_PEOPLE.priya_hr, employee: HR_PEOPLE.emma   },
  { id: 'HR-010', date: 'Feb 18, 2026', name: 'Request for Performance Review Copy',  issueType: 'Performance', priority: 'Low',      status: 'Resolved',      updated: '6 days ago',  sla: '1d',   slaType: 'normal',  assignee: HR_PEOPLE.sarah_hr, employee: HR_PEOPLE.liam   },
  { id: 'HR-009', date: 'Feb 15, 2026', name: 'Remote Work Policy Exception Request', issueType: 'Policy',      priority: 'Medium',   status: 'On hold',       updated: '9 days ago',  sla: '−2d',  slaType: 'overdue', assignee: HR_PEOPLE.james,    employee: HR_PEOPLE.david  },
  { id: 'HR-008', date: 'Feb 12, 2026', name: 'Exit Interview Scheduling — Q1 Exits', issueType: 'Offboarding', priority: 'Medium',   status: 'Not started',   updated: '12 days ago', sla: '3d',   slaType: 'normal',  assignee: null,               employee: HR_PEOPLE.priya_hr },
];

export const KNOWLEDGE_ARTICLES = [
  { id: 'KB-001', title: 'How to Request Software Access', category: 'Software Access', summary: 'Step-by-step guide for requesting new application licences through the IT portal.' },
  { id: 'KB-002', title: 'Microsoft 365 License Tiers Explained', category: 'Software Access', summary: 'Overview of M365 E1, E3, and E5 licence tiers and which features each includes.' },
  { id: 'KB-003', title: 'Payroll Discrepancy — Who to Contact', category: 'Payroll', summary: 'How to report paycheck errors and what information HR needs to investigate a payroll discrepancy.' },
  { id: 'KB-004', title: 'WiFi Troubleshooting Guide', category: 'Network', summary: 'Common steps to resolve office WiFi connectivity issues on Mac, Windows, and mobile devices.' },
  { id: 'KB-005', title: 'macOS Update — IT Policy and Safe Upgrade Steps', category: 'Hardware', summary: 'IT policy on macOS updates and the recommended process for upgrading without data loss.' },
];

export const WORK_TASKS = [
  { id: 'TASK-201', name: 'Renew Adobe Creative Cloud licenses — Q2 2026', project: 'Software Asset Management', assignee: 'Steve Mills', status: 'In Progress', due: 'Mar 15' },
  { id: 'TASK-202', name: 'Audit software license usage across Engineering', project: 'Software Asset Management', assignee: 'Priya Nair', status: 'Not started', due: 'Mar 28' },
  { id: 'TASK-203', name: 'Review Microsoft 365 license allocation — over-provisioned seats', project: 'IT Cost Optimisation', assignee: 'Steve Mills', status: 'In Progress', due: 'Apr 2' },
  { id: 'TASK-204', name: 'Track license expiry dates for Figma, Miro, and Notion', project: 'Software Asset Management', assignee: 'Liam Torres', status: 'Not started', due: 'Apr 10' },
  { id: 'TASK-205', name: 'Reclaim unused Salesforce licenses from inactive accounts', project: 'IT Cost Optimisation', assignee: 'Priya Nair', status: 'Completed', due: 'Feb 28' },
];

export function filterHRTickets(tickets, tab, query) {
  let result = tickets;
  switch (tab) {
    case 'Open Cases':
      result = result.filter(t => ['Not started', 'On hold', 'Investigating'].includes(t.status));
      break;
    case 'Pending':
      result = result.filter(t => t.status === 'On hold');
      break;
    case 'Resolved':
      result = result.filter(t => t.status === 'Resolved');
      break;
    default:
      break;
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(t => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }
  return result;
}

// ─── Tab + search filter ───────────────────────────────────────────────────────

const OPEN_STATUSES   = new Set(['Not started', 'On hold', 'Investigating']);
const CLOSED_STATUSES = new Set(['Resolved', 'Closed']);

export function filterTickets(tickets, tab, query) {
  let result = tickets;

  switch (tab) {
    case 'My Tickets':
      result = result.filter(t => t.assignee === CURRENT_USER);
      break;
    case 'Unassigned':
      result = result.filter(t => !t.assignee);
      break;
    case 'Open Tickets':
      result = result.filter(t => OPEN_STATUSES.has(t.status));
      break;
    case 'SLA Urgent':
      result = result.filter(t => t.slaType === 'warning' || t.slaType === 'overdue');
      break;
    case 'Resolved':
      result = result.filter(t => CLOSED_STATUSES.has(t.status));
      break;
    default: // 'All Tickets'
      break;
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }

  return result;
}
