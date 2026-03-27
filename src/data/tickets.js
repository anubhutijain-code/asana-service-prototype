// ─── Tickets dashboard data ────────────────────────────────────────────────────

export const STATS = [
  { label: 'Total tickets',     value: '51',  trend: '+4 from last week',      trendGood: true,  spark: [32,36,31,39,42,45,51] },
  { label: 'AI deflected',      value: '14',  trend: '27% of total',           trendGood: true,  spark: [7,9,8,11,10,13,14]   },
  { label: 'AI deflection rate',value: '99%', trend: '3% above last month',    trendGood: true,  spark: [88,90,91,93,95,97,99] },
  { label: 'MTTA',              value: '4s',  trend: '18% faster than target', trendGood: true,  spark: [18,15,14,12,10,8,4]  },
  { label: 'SLA compliance',    value: '67%', trend: '3% below target',        trendGood: false, spark: [74,72,71,70,69,68,67] },
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

// ─── Reusable workflow step sets ───────────────────────────────────────────────
const S_ACCESS_ACTIVE = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',               status: 'completed', completedAt: 'today' },
  { id: 's2', type: 'agent', label: 'Verify approval',       team: 'IT Agent',             status: 'active'    },
  { id: 's3', type: 'agent', label: 'Provision access',      team: 'AI Provisioning Agent', status: 'pending'   },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'Communications Agent',  status: 'pending'   },
];
const S_ACCESS_DONE = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',                status: 'completed', completedAt: 'completed' },
  { id: 's2', type: 'agent', label: 'Verify approval',       team: 'IT Agent',              status: 'completed', completedAt: 'completed' },
  { id: 's3', type: 'agent', label: 'Provision access',      team: 'AI Provisioning Agent', status: 'completed', completedAt: 'completed' },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'Communications Agent',  status: 'completed', completedAt: 'completed' },
];
const S_HARDWARE_ACTIVE = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',    status: 'completed', completedAt: 'today' },
  { id: 's2', type: 'agent', label: 'Diagnosis',             team: 'IT Agent',  status: 'active'    },
  { id: 's3', type: 'agent', label: 'Resolution / repair',   team: 'IT Agent',  status: 'pending'   },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'IT Agent',  status: 'pending'   },
];
const S_HARDWARE_DONE = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',    status: 'completed', completedAt: 'completed' },
  { id: 's2', type: 'agent', label: 'Diagnosis',             team: 'IT Agent',  status: 'completed', completedAt: 'completed' },
  { id: 's3', type: 'agent', label: 'Resolution / repair',   team: 'IT Agent',  status: 'completed', completedAt: 'completed' },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'IT Agent',  status: 'completed', completedAt: 'completed' },
];
const S_GENERAL_NOTSTARTED = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',    status: 'active'  },
  { id: 's2', type: 'agent', label: 'Investigation',         team: 'IT Agent',  status: 'pending' },
  { id: 's3', type: 'agent', label: 'Resolution',            team: 'IT Agent',  status: 'pending' },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'IT Agent',  status: 'pending' },
];
const S_GENERAL_ACTIVE = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',    status: 'completed', completedAt: 'today' },
  { id: 's2', type: 'agent', label: 'Investigation',         team: 'IT Agent',  status: 'active'    },
  { id: 's3', type: 'agent', label: 'Resolution',            team: 'IT Agent',  status: 'pending'   },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'IT Agent',  status: 'pending'   },
];
const S_GENERAL_ONHOLD = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',    status: 'completed', completedAt: 'completed' },
  { id: 's2', type: 'agent', label: 'Investigation',         team: 'IT Agent',  status: 'completed', completedAt: 'completed' },
  { id: 's3', type: 'agent', label: 'Pending action',        team: 'IT Agent',  status: 'active'    },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'IT Agent',  status: 'pending'   },
];
const S_GENERAL_DONE = [
  { id: 's1', type: 'agent', label: 'Intake & triage',       team: 'IT Bot',    status: 'completed', completedAt: 'completed' },
  { id: 's2', type: 'agent', label: 'Investigation',         team: 'IT Agent',  status: 'completed', completedAt: 'completed' },
  { id: 's3', type: 'agent', label: 'Resolution',            team: 'IT Agent',  status: 'completed', completedAt: 'completed' },
  { id: 's4', type: 'agent', label: 'Notify & resolve',      team: 'IT Agent',  status: 'completed', completedAt: 'completed' },
];

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
        status: 'completed',
        completedAt: '7 min ago',
        outcomeNote: 'Classified as Access Management → Salesforce role update following department transfer. HR employment verification task created.',
      },
      {
        id: 's2', type: 'linked',
        label: 'HR Employment Verification', team: 'HR',
        status: 'active',
        linkedTicket: { id: 'HR-112', name: 'Confirm department transfer: Sarah Lee (Marketing → Finance)', status: 'Open' },
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
    steps: [
      { id: 's1', type: 'agent',  label: 'Intake & triage',              team: 'IT Bot',    status: 'completed', completedAt: 'Feb 24, 7:15am', outcomeNote: 'Classified as Software Access — M365 licence tier mismatch post-department transfer. Assigned to Steve Smith.' },
      { id: 's2', type: 'agent',  label: 'Investigate licence mismatch', team: 'Steve Smith', status: 'completed', completedAt: '1 hour ago', outcomeNote: 'Confirmed E1 vs E3 mismatch. Root cause: identity sync applied Marketing template. HR confirmation required before upgrade.' },
      { id: 's3', type: 'linked', label: 'HR: confirm department transfer', team: 'HR',       status: 'active',    linkedTicket: { id: 'HR-118', name: 'Confirm department transfer: Jordan Park (Marketing → Finance)', status: 'Open' } },
      { id: 's4', type: 'agent',  label: 'Apply E3 licence upgrade',     team: 'AI Provisioning Agent', status: 'pending', assignee: { type: 'ai', name: 'AI Provisioning Agent' } },
      { id: 's5', type: 'agent',  label: 'Notify & resolve',             team: 'Communications Agent',  status: 'pending', assignee: { type: 'ai', name: 'Communications Agent' } },
    ],
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
    steps: [
      { id: 's1', type: 'agent',  label: 'Intake & triage',         team: 'IT Bot',   status: 'completed', completedAt: 'just now', outcomeNote: 'Classified as Payroll discrepancy. Routing to HR team.' },
      { id: 's2', type: 'linked', label: 'HR: review overtime hours', team: 'HR',       status: 'active',    linkedTicket: { id: 'HR-119', name: 'Payroll discrepancy — overtime pay missing: Anjelica Silva', status: 'Open' } },
      { id: 's3', type: 'agent',  label: 'Payroll correction',       team: 'Payroll',  status: 'pending' },
      { id: 's4', type: 'agent',  label: 'Confirm & close',          team: 'IT Agent', status: 'pending' },
    ],
    aiSummary: 'Anjelica Silva from Operations has reported a payroll discrepancy — approximately $340 in overtime pay is missing from last week\'s paycheck. She has flagged this as urgent due to an upcoming rent payment and followed up once already without a response.',
  },
  { id: 'TICKET-67', date: 'Feb 23, 2026', name: 'Help Updating MacBook to Latest macOS',            hasImage: false, priority: 'Low',      status: 'Not started',   updated: '5 mins ago',  sla: '4d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.pat,    steps: S_GENERAL_NOTSTARTED,
    initPublic: [
      { type: 'inbound', text: "Hi — IT pushed a notification to update to macOS 15.3. I ran the update and now I can't log in to any of the company apps. Okta Verify is asking me to set up MFA again but when I scan the QR code it just says 'enrollment failed'. Tried three times.", name: 'Patrick Tuckey', time: 'Feb 23, 2:14pm', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 23, 2:31pm', text: "Hi Patrick, this is a known issue with the macOS 15.3 update — it resets certain Keychain permissions that Okta Verify depends on for device binding. Your existing MFA enrollment is still valid but the app can't read its stored token.\n\nFix:\n1. Delete the Okta Verify app entirely from your Mac\n2. Download fresh from it.acmecorp.com/downloads (use the managed version, not the App Store)\n3. Open accounts.acmecorp.com in Safari — don't use Chrome for this step\n4. Log in with your password, and when prompted for MFA click 'Set up authenticator'\n5. Scan the new QR code with your iPhone's Okta Verify app if your phone is already enrolled — that gets you in without needing to re-enroll the Mac\n\nLet me know if you don't have Okta on your phone and we'll do a bypass code instead." },
      { type: 'inbound', text: "I do have it on my phone. Followed the steps — got in! The Mac Okta app is showing enrolled now too. Thank you, that was stressful.", name: 'Patrick Tuckey', time: 'Feb 23, 2:48pm', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 23, 2:25pm', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "This is the 2nd macOS 15.3 + Okta Verify ticket today. Root cause: macOS 15.3 resets Keychain access entitlements on update, breaking Okta device binding. Fix is delete + reinstall managed Okta Verify. The key is using the managed download (not App Store) and Safari for initial enrollment." },
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 23, 2:52pm', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Resolved. Along with TICKET-62 and TICKET-69 this is the 3rd MFA re-enrollment ticket in 2 weeks from different triggers (lost device, dept transfer, OS update). We don't have a KB article on MFA re-enrollment at all — users are panicking and wasting time. Need a consolidated article covering all re-enrollment scenarios. Flagging for KB draft." },
    ],
  },
  {
    id: 'TICKET-66', date: 'Feb 22, 2026', name: 'Urgent Request for SFDC License Access',
    hasImage: true, priority: 'Critical', status: 'On hold', updated: '1 day ago',
    sla: '15m', slaType: 'warning', assignee: PEOPLE.steve, requester: PEOPLE.martin,
    submitter: { name: 'Martin Ludington', email: 'm.ludington@acme.com', location: 'New York', org: 'RevOps', deviceId: 'SFX-3302' },
    category: 'Software Access',
    steps: [
      {
        id: 's1', type: 'agent',
        label: 'Intake & Triage', team: 'IT Agent',
        status: 'completed',
        completedAt: 'Feb 22, 9:08am',
        outcomeNote: 'Classified as Software Access — Salesforce Professional Edition request. Escalated Critical, assigned to Steve Smith.',
      },
      {
        id: 's2', type: 'agent',
        label: 'Verify Manager Approval', team: 'IT Agent',
        status: 'completed',
        completedAt: 'Feb 22, 10:00am',
        outcomeNote: "Martin confirmed Jen Williams approved the license last week. Verbal approval recorded.",
      },
      {
        id: 's3', type: 'agent',
        label: 'Check License Availability', team: 'Finance Agent',
        status: 'completed',
        completedAt: 'Feb 22, 10:30am',
        outcomeNote: 'Finance confirmed 2 unused Professional Edition licenses available for reassignment.',
      },
      {
        id: 's4', type: 'agent',
        label: 'Provision Salesforce Access', team: 'AI Provisioning Agent',
        status: 'completed',
        completedAt: 'Feb 22, 12:45pm',
        assignee: { type: 'ai', name: 'AI Provisioning Agent' },
        outcomeNote: "Professional Edition license assigned to Martin Ludington's account. Access active within 15 minutes.",
      },
      {
        id: 's5', type: 'agent',
        label: 'Notify & Resolve', team: 'Communications Agent',
        status: 'active',
        assignee: { type: 'ai', name: 'Communications Agent' },
        body: "Send Martin access confirmation and close TICKET-66.",
      },
    ],
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
  { id: 'TICKET-65', date: 'Feb 20, 2026', name: 'Phone Not Connecting to WiFi in Vancouver Office',  hasImage: true,  priority: 'Medium',   status: 'Investigating', updated: '3 days ago',  sla: '−45m', slaType: 'overdue', assignee: PEOPLE.ang,    requester: PEOPLE.sarah,  steps: S_GENERAL_ACTIVE,
    initPublic: [
      { type: 'inbound', text: "My phone (iPhone 15, iOS 17.4) won't connect to the Vancouver office WiFi. It connects to my home network and other networks fine. The office network shows up, I enter the password, it spins and then says 'Unable to join the network'. This started today when I came in.", name: 'Sarah Smith', time: 'Feb 20, 9:08am', bg: 'd4938a', fg: 'ffffff', initials: 'SS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 20, 9:25am', text: "Hi Sarah, a few quick things to try first:\n\n1. Forget the network: Settings → WiFi → tap the (i) next to the network → Forget This Network, then reconnect\n2. Toggle Airplane mode on for 10 seconds, then off\n3. Check if Private WiFi Address is on for this network — if so, turn it off (Settings → WiFi → (i) → Private WiFi Address)\n\nAlso — is this the 'AcmeCorp-Employee' network or 'AcmeCorp-Guest'? They require different credentials." },
      { type: 'inbound', text: "Tried all three steps, still failing. It's the AcmeCorp-Employee network. My laptop connects to it fine, just not the phone.", name: 'Sarah Smith', time: 'Feb 20, 9:34am', bg: 'd4938a', fg: 'ffffff', initials: 'SS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 20, 10:02am', text: "Thanks — the fact your laptop connects narrows it down. Our AcmeCorp-Employee network uses certificate-based authentication (802.1X) which phones need to have a profile installed for. iOS 17.4 changed how it handles 802.1X certificates and your phone may not have the updated corp cert profile.\n\nI'm flagging this for our network team — they need to push an updated MDM profile to your device. Can you confirm your phone is enrolled in Jamf? You should see a 'Jamf MDM Profile' under Settings → General → VPN & Device Management." },
    ],
    initInternal: [
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 20, 9:50am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "iOS 17.4 broke 802.1X cert handling — corp WiFi cert profile needs to be re-pushed via Jamf for affected iPhones. Similar issue to TICKET-63 (Zscaler/WPA3 on Mac). Both are symptoms of client security software conflicting with our network auth changes. Investigating if a single MDM profile push resolves both." },
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 20, 10:15am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "This is the 2nd WiFi ticket this week with the same client/network auth pattern (TICKET-63 was macOS, this is iOS). We have no troubleshooting guide for WiFi connectivity — agents are diagnosing from scratch each time. Need a KB article with: basic checks, device vs network diagnosis, certificate/VPN profile issues by OS version, escalation path. Flagging for KB draft alongside TICKET-63." },
    ],
  },
  { id: 'TICKET-64', date: 'Feb 19, 2026', name: 'Request View Access to Figma and FigJam',           hasImage: false, priority: 'Low',      status: 'Not started',   updated: '4 days ago',  sla: '2d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.anj,    steps: S_ACCESS_ACTIVE,
    initPublic: [
      { type: 'inbound', text: "Hi — the design team shared a Figma file with me but when I click the link it says I need to request access. I'm a PM and just need view-only access to review mockups, not edit. I tried logging in with my work Google account but it won't let me in.", name: 'Anjelica Silva', time: 'Feb 19, 11:05am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 19, 11:22am', text: "Hi Anjelica, Figma access is provisioned through Okta — you should have been added when you joined, but viewer seats occasionally fall through during onboarding.\n\nI can see your account isn't in our Figma org yet. I'm adding you now as a viewer. You should get an email invite within 5 minutes to join the Acme Corp Figma workspace — accept it with your work Google account and you'll have view access to all shared files." },
      { type: 'inbound', text: "Got the invite, accepted it. I can see the file now. Is there anything I need to do for FigJam as well? Someone mentioned it's separate.", name: 'Anjelica Silva', time: 'Feb 19, 11:29am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 19, 11:33am', text: "Good news — FigJam is included in the same Figma workspace. You'll see a 'FigJam' tab in the left sidebar when you're in Figma. No separate login needed. If someone shares a FigJam link directly, the same invite you just accepted covers it." },
    ],
    initInternal: [
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 19, 11:15am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "User wasn't in Figma org — added as viewer via Okta push. Happens when onboarding checklist item gets missed. FigJam is same seat, no extra provisioning needed." },
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 19, 11:40am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "Resolved. Similar to TICKET-53 (Jira) and TICKET-66 (SFDC) — employees don't know the access request process or what's provisioned by default vs what needs a request. We keep explaining the same thing. There's no KB article on how to request tool access. Need one that covers: what's auto-provisioned at onboarding, how to request access to specific tools (Figma, Jira, Salesforce, etc.), approval flow, and typical turnaround. Flagging for KB." },
    ],
  },
  { id: 'TICKET-63', date: 'Feb 18, 2026', name: 'Unable to Connect to WiFi After Troubleshooting',   hasImage: false, priority: 'Critical', status: 'On hold',       updated: '5 days ago',  sla: '−2d',  slaType: 'overdue', assignee: PEOPLE.martin, requester: PEOPLE.sarah,  steps: S_GENERAL_ONHOLD,
    initPublic: [
      { type: 'inbound', text: "Still can't connect to the Vancouver office WiFi. I've tried forgetting the network, restarting, and the steps from the previous ticket (TICKET-60) but nothing worked. My iPhone connects fine on the same network.", name: 'Sarah Smith', time: 'Feb 18, 10:02am', bg: 'd4938a', fg: 'ffffff', initials: 'SS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 18, 10:24am', text: "Hi Sarah, since your phone connects fine this is likely a device-level issue rather than the network. Let's go deeper:\n\n1. What macOS version are you on? (Apple menu → About This Mac)\n2. Open Terminal and run: `networksetup -listallnetworkservices` — paste the output here\n3. Has IT pushed any new security profiles recently? Check: System Settings → Privacy & Security → Profiles" },
      { type: 'inbound', text: "macOS 14.2.1. Terminal output shows Wi-Fi, Bluetooth PAN, Thunderbolt Bridge. There are 2 profiles installed — 'Corp WiFi' and 'Zscaler Client Connector'.", name: 'Sarah Smith', time: 'Feb 18, 10:31am', bg: 'd4938a', fg: 'ffffff', initials: 'SS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 18, 11:05am', text: "That's the issue — the Zscaler Client Connector profile we pushed last week is intercepting the WiFi authentication handshake in certain office configurations. Vancouver uses WPA3-Enterprise which has a known conflict with Zscaler 4.1 on macOS 14.x.\n\nI'm putting this on hold while we work on a fix. In the meantime: connect via Ethernet if possible, or use your phone hotspot. I'll notify you as soon as we have the Zscaler config patch ready — estimated 2–3 days." },
    ],
    initInternal: [
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 18, 10:50am', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Root cause: Zscaler 4.1 + WPA3-Enterprise conflict on macOS 14.x. Affects all Vancouver office users on the new Zscaler rollout. Confirmed with 4 other users. Workaround: ethernet or hotspot. Fix: Zscaler config patch pending — will update TICKET-63 and TICKET-65 together when ready." },
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 18, 11:10am', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Flagging for KB: we have no documented troubleshooting guide for WiFi connectivity issues. Every time this comes up agents are re-diagnosing from scratch. Need a systematic guide: check device vs network, common causes by OS version, Zscaler conflict patterns, escalation path. This is the 4th WiFi ticket in 2 weeks." },
    ],
  },
  { id: 'TICKET-62', date: 'Feb 12, 2026', name: 'Report Lost Laptop for Patrick Tuckey',             hasImage: true,  priority: 'Critical', status: 'Investigating', updated: '11 days ago', sla: '−5d',  slaType: 'overdue', assignee: PEOPLE.steve,  requester: PEOPLE.pat,    steps: S_HARDWARE_ACTIVE,
    initPublic: [
      { type: 'inbound', text: "Hi — I left my MacBook Pro on the train this morning (Feb 12, Caltrain 7:42am San Francisco → San Jose). It has the company MDM profile installed. I need to report it lost and get a replacement as soon as possible.", name: 'Patrick Tuckey', time: 'Feb 12, 8:55am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 12, 9:08am', text: "Hi Patrick, I've flagged this as urgent. Here's what we're doing right now:\n\n1. Remote lock initiated — your device is now locked via MDM. Any user will see a lock screen with your IT contact number.\n2. Remote wipe scheduled — will trigger automatically in 24 hours if the device isn't recovered. We can cancel this if you find it.\n3. Replacement laptop — I've submitted a request from our spare pool. You'll have a loaner by end of day.\n\nCan you confirm: was FileVault disk encryption enabled? (You'd have set this up during onboarding.)" },
      { type: 'inbound', text: "Yes, FileVault was on — I remember setting it up. I've also filed a report with Caltrain lost and found. Will the remote wipe affect my work if I get it back?", name: 'Patrick Tuckey', time: 'Feb 12, 9:14am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 12, 9:21am', text: "Good — FileVault means data is encrypted even if someone bypasses the lock screen, so you're protected regardless. If you recover the device before the 24-hour wipe window, let us know immediately and we'll cancel the wipe and verify it's clean before returning it to you.\n\nYour loaner will be pre-configured with your apps via our MDM profile — allow about 2 hours for everything to install after you first log in. I'll send you a pickup notification when it's ready." },
    ],
    initInternal: [
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 12, 9:05am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Remote lock sent via Jamf — confirmed receipt. FileVault confirmed by user. Wipe timer set for Feb 13, 9am. Pulling loaner from spare pool (MBP-SPARE-04, already enrolled in MDM)." },
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 12, 11:30am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Loaner ready for pickup. This is the 3rd lost/stolen device this quarter. Our KB has nothing on the lost device procedure — users don't know about the 24h wipe window, FileVault, or how to handle Caltrain/transit lost and found. We should document the full process: reporting steps, what IT does, the wipe timeline, and what the user needs to do to get back up and running. Flagging for KB draft." },
    ],
  },
  { id: 'TICKET-61', date: 'Feb 12, 2026', name: 'Help Migrating Files From Dropbox to Google Drive', hasImage: false, priority: 'Medium',   status: 'Not started',   updated: '11 days ago', sla: '1d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.ang,    steps: S_GENERAL_NOTSTARTED  },
  { id: 'TICKET-60', date: 'Feb 12, 2026', name: 'Phone Unable to Connect to Office WiFi',            hasImage: false, priority: 'Medium',   status: 'On hold',       updated: '11 days ago', sla: '6h',   slaType: 'warning', assignee: PEOPLE.ang,    requester: PEOPLE.sarah,  steps: S_GENERAL_ONHOLD      },
  { id: 'TICKET-58', date: 'Feb 10, 2026', name: 'Will My Parental Leave Affect My Bonus Calculation?', hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '13 days ago', sla: '−1d',  slaType: 'overdue', assignee: PEOPLE.steve,  requester: PEOPLE.martin, steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound',  text: "Hi — I'm planning to take 3 months of parental leave starting in May and I'm worried about how it affects my annual bonus. Our bonuses are based on performance ratings and I don't know if leave months count against me or are excluded from the calculation.", name: 'Martin Ludington', time: 'Feb 10, 11:15am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 10, 11:42am', text: "Hi Martin, thanks for asking ahead of your leave — this is an important one to clarify.\n\nParental leave months are **excluded** from bonus and performance calculations. The policy works as follows:\n\n• Your performance is assessed only for the months you were actively working\n• The bonus is prorated to your active months, then calculated at your full target percentage — leave months don't drag down the denominator\n• If your leave straddles two review periods, each period is assessed independently on active time\n\nIn practice: 3 months of leave from May means your full-year bonus is based on 9 months of active work, assessed at your normal target rate. You won't be penalised for taking leave.\n\nFor bonus specifically, I'd recommend confirming the exact proration formula with your manager or People Ops before your leave starts, as there can be nuances for variable comp plans." },
      { type: 'inbound',  text: "That's a relief — I was worried they'd just rate me lower because I wasn't around for part of the year. Thanks for the clear breakdown.", name: 'Martin Ludington', time: 'Feb 10, 11:49am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 10, 11:35am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Confirmed with People Ops: parental leave is excluded from bonus denominator. Full target % applied to active months only. This also applies to performance ratings — consistent with TICKET-68 and the policy Anjelica asked about last month." },
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 10, 11:55am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Resolved. 2nd parental leave + performance/bonus question this month (TICKET-68 was the other). HR KB has no article covering the leave → performance impact. Every time it comes up we're answering from scratch. Flagging for KB draft alongside TICKET-68." },
    ],
  },
  { id: 'TICKET-57', date: 'Feb 10, 2026', name: 'Request for Tool to Test Tickets',                  hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '13 days ago', sla: '−1d',  slaType: 'overdue', assignee: PEOPLE.sarah,  requester: PEOPLE.ang,    steps: S_GENERAL_DONE        },
  { id: 'TICKET-56', date: 'Feb 9, 2026',  name: 'Zoom Not Working for Anjelica Silva',               hasImage: false, priority: 'Medium',   status: 'Closed',        updated: '14 days ago', sla: '2d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.anj,    steps: S_HARDWARE_DONE       },
  { id: 'TICKET-55', date: 'Feb 9, 2026',  name: 'How to record screen on Mac',                       hasImage: false, priority: 'Low',      status: 'Closed',        updated: '14 days ago', sla: '3d',   slaType: 'normal',  assignee: PEOPLE.steve,  requester: PEOPLE.ang,    steps: S_GENERAL_DONE        },
  { id: 'TICKET-54', date: 'Feb 7, 2026',  name: 'Printer offline after Windows update',              hasImage: true,  priority: 'Medium',   status: 'Resolved',      updated: '16 days ago', sla: '−3d',  slaType: 'overdue', assignee: PEOPLE.martin, requester: PEOPLE.pat,    steps: S_HARDWARE_DONE       },
  { id: 'TICKET-53', date: 'Feb 6, 2026',  name: 'Need access to Jira project for Q1 planning',       hasImage: false, priority: 'Low',      status: 'Closed',        updated: '17 days ago', sla: '1d',   slaType: 'normal',  assignee: PEOPLE.sarah,  requester: PEOPLE.martin, steps: S_ACCESS_DONE,
    initPublic: [
      { type: 'inbound', text: "I need access to the Q1 planning Jira project — my manager added me to the planning meetings but when I open the Jira link it says I don't have permission to view the project. The project is called PLAN-Q1-2026.", name: 'Martin Ludington', time: 'Feb 6, 9:50am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 6, 10:05am', text: "Hi Martin, Jira project access is managed by the project owner, not IT — I can't add you directly. Here's the quickest path:\n\n1. In Jira, open the PLAN-Q1-2026 project\n2. Click 'Request access' on the permission denied screen — this sends a notification to the project admin\n3. Alternatively, ask your manager or whoever runs the project to add you directly via Project Settings → People\n\nDo you know who owns the project? If you're not sure, I can look it up in our Jira admin panel." },
      { type: 'inbound', text: "I didn't know there was a 'Request access' button — I just saw the error message. I tried it and the project admin (looks like it's Jordan) approved it within 2 minutes. I'm in now, thanks.", name: 'Martin Ludington', time: 'Feb 6, 10:12am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Sarah Smith', time: 'Feb 6, 10:00am', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Jira project access is self-serve via the 'Request access' flow or project admin. IT doesn't manage individual project permissions. Guided user to use the in-app request button." },
      { type: 'inbound', name: 'Sarah Smith', time: 'Feb 6, 10:18am', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Resolved. User didn't know the in-app request flow existed. We see this every week — employees don't know which tools are self-serve vs IT-managed. Jira, Figma, Notion are all self-serve; Salesforce, GitHub, AWS need IT. No KB article explains this distinction. Flagging alongside TICKET-64 and TICKET-66 for a consolidated access request KB article." },
    ],
  },
  { id: 'TICKET-52', date: 'Feb 5, 2026',  name: 'Outlook calendar not syncing with mobile',          hasImage: false, priority: 'Medium',   status: 'Not started',   updated: '18 days ago', sla: '2d',   slaType: 'normal',  assignee: null,          requester: PEOPLE.anj,    steps: S_GENERAL_NOTSTARTED  },
  { id: 'TICKET-51', date: 'Feb 4, 2026',  name: 'Screen flickering on external monitor',             hasImage: true,  priority: 'Critical', status: 'Investigating', updated: '19 days ago', sla: '−6h',  slaType: 'overdue', assignee: PEOPLE.steve,  requester: PEOPLE.sarah,  steps: S_HARDWARE_ACTIVE     },

  // ── Tickets referenced in KB learning gaps ───────────────────────────────────
  { id: 'TICKET-11', date: 'Jan 15, 2026', name: 'Zoom Room Won\'t Connect in Conference Room B',        hasImage: false, priority: 'Medium',   status: 'Resolved',      updated: '2 months ago', sla: '1d',   slaType: 'normal',  assignee: PEOPLE.ang,    requester: PEOPLE.anj,    steps: S_HARDWARE_DONE,
    initPublic: [
      { type: 'inbound',  text: "Hi — Conference Room B's Zoom Room isn't connecting this morning. The TV screen just shows 'Connecting…' indefinitely and the Zoom Rooms controller on the iPad is stuck on 'Starting Zoom Rooms'. We have a call in 30 minutes.", name: 'Anjelica Silva', time: 'Jan 15, 9:05am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Jan 15, 9:18am', text: "Hi Anjelica, let's get this sorted before your call. A few quick things to try:\n\n1. On the iPad controller, press and hold the Home button for 5 seconds to force-quit Zoom Rooms, then reopen it\n2. If that doesn't work, unplug the Zoom Rooms PC (the small black box behind the TV) from power, wait 10 seconds, and plug it back in\n3. Make sure the room TV is set to the correct HDMI input (should be HDMI 2 — Zoom PC)\n\nCan you try step 1 first and let me know what happens?" },
      { type: 'inbound',  text: "Tried force-quitting on the iPad — it restarted but still stuck on 'Connecting…'. Going to try unplugging the PC.", name: 'Anjelica Silva', time: 'Jan 15, 9:22am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Jan 15, 9:24am', text: "While you do that: if you have an urgent call in 30 minutes, you can also join via your laptop directly (regular Zoom meeting link) using the room's Bluetooth speaker (Jabra on the shelf) as audio. That's a reliable backup for today." },
      { type: 'inbound',  text: "Unplugging the PC worked! It came back up and connected. We're good for the call. Thank you!", name: 'Anjelica Silva', time: 'Jan 15, 9:29am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Ang Lee', time: 'Jan 15, 9:15am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "Picking this up. Conference Room B Zoom Room PC had an overnight Windows update that didn't fully complete. Zoom Rooms service was stuck waiting for a system restart. Power cycle fixes it. Will advise user." },
      { type: 'inbound', name: 'Ang Lee', time: 'Jan 15, 9:35am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "Resolved via power cycle. This is the 3rd Zoom Room ticket this quarter — we have no KB article on Zoom Rooms setup or troubleshooting. Users don't know the power cycle step, the backup Jabra speaker, or what to do if the HDMI input is wrong. Conference Room B also isn't in the auto-reboot schedule — adding it now, but we should document the basics. Flagging for KB." },
    ],
  },
  { id: 'TICKET-19', date: 'Jan 20, 2026', name: 'Can\'t Add London Office Printer (Ricoh MP C4504)',    hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '2 months ago', sla: '2d',   slaType: 'normal',  assignee: PEOPLE.martin, requester: PEOPLE.pat,    steps: S_HARDWARE_DONE,
    initPublic: [
      { type: 'inbound',  text: "Hi, I'm trying to add the office printer in London (Ricoh MP C4504) to my Mac but can't find it anywhere. I've tried System Settings > Printers but it just doesn't appear.", name: 'Patrick Tuckey', time: 'Jan 20, 9:12am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Jan 20, 9:28am', text: "Hi Patrick, happy to help with this. The London printer (Ricoh MP C4504) isn't set up for auto-discovery on Mac — you'll need to add it manually by IP address.\n\n1. Open System Settings → Printers & Scanners\n2. Click the + button → Add Printer or Scanner\n3. Select the IP tab at the top\n4. Protocol: IPP, Address: 192.168.10.45\n5. Leave Queue blank, Name it 'London Office - Ricoh C4504'\n6. Driver: Select Software → search 'Ricoh' → pick Ricoh MP C4504\n\nLet me know if the driver doesn't show up and I can send you the package." },
      { type: 'inbound',  text: "Got the IP tab, filled everything in but I'm getting 'Unable to verify the printer on the network'. Is the IP right?", name: 'Patrick Tuckey', time: 'Jan 20, 9:34am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Jan 20, 9:41am', text: "Sorry about that — the London office printer moved to a new IP last week after the network reconfigure. Updated address is 192.168.10.52. Try that one.\n\nAlso double-check you're on the LondonOffice-Internal WiFi network, not the guest network, otherwise the printer subnet won't be reachable." },
      { type: 'inbound',  text: "That worked! Print job went through. Thanks so much.", name: 'Patrick Tuckey', time: 'Jan 20, 9:47am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Martin Lud…', time: 'Jan 20, 9:25am', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Picking this up. The London Ricoh wasn't added to the auto-discovery list because it was moved to a new subnet when they upgraded the London office switch last week. Manual IP add required." },
      { type: 'inbound', name: 'Martin Lud…', time: 'Jan 20, 9:50am', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Resolved — IP was wrong in my first reply (old address). Corrected to 192.168.10.52. This is the 3rd ticket this month about the London Ricoh. The KB article on printer setup is Mac-agnostic — it only covers Windows. We need a Mac-specific section with the correct IP and driver steps. Also should note the WiFi subnet requirement. Flagging for KB update." },
    ],
  },
  { id: 'TICKET-29', date: 'Jan 25, 2026', name: 'Need Admin Access to Install Dev Tools',               hasImage: false, priority: 'Medium',   status: 'Resolved',      updated: '1 month ago',  sla: '1d',   slaType: 'normal',  assignee: PEOPLE.steve,  requester: PEOPLE.ang,    steps: S_ACCESS_DONE,
    initPublic: [
      { type: 'inbound',  text: "I'm trying to install Node.js and nvm on my Mac for a new project but getting blocked: 'You do not have admin rights to install software on this device.' I'm a developer and need these tools. Can you grant me admin access?", name: 'Ang Lee', time: 'Jan 25, 10:20am', bg: 'a08060', fg: 'ffffff', initials: 'AL' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Jan 25, 10:35am', text: "Hi Ang, thanks for reaching out. We can't grant full admin access to individual devices under our security policy — but you don't need it here. Node.js and nvm are on our approved software list and are available through two routes:\n\n1. **Managed Software Center** (quickest): Open the app in your Applications folder, search for 'Node.js' or 'nvm' — you can install without admin rights\n2. **Self-service via Homebrew**: If you have Homebrew already, `brew install node` works because Homebrew installs to your user directory\n\nIf neither of these work, I can push the package directly to your device. Give the Managed Software Center a try first and let me know." },
      { type: 'inbound',  text: "Found Node.js in Managed Software Center — didn't know that existed. Installed fine. I've been using a personal laptop for dev work because I thought I'd never be able to install anything on this one. Good to know!", name: 'Ang Lee', time: 'Jan 25, 10:44am', bg: 'a08060', fg: 'ffffff', initials: 'AL' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Steve Smith', time: 'Jan 25, 10:28am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Standard admin-rights request. Node.js is in MSC. User wasn't aware of Managed Software Center." },
      { type: 'inbound', name: 'Steve Smith', time: 'Jan 25, 10:50am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Resolved. User using personal laptop because they thought work machine was locked down. This is a real problem — developers especially don't know the self-serve install path. Same root cause as TICKET-33 and TICKET-44 (all three this month). We need a KB article explaining the policy: why installs are blocked, what Managed Software Center is, what's on the approved list, what to do if your tool isn't there. Flagging." },
    ],
  },
  { id: 'TICKET-33', date: 'Jan 28, 2026', name: 'Can\'t Install Figma Without Admin Rights',            hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '1 month ago',  sla: '2d',   slaType: 'normal',  assignee: PEOPLE.sarah,  requester: PEOPLE.anj,    steps: S_ACCESS_DONE,
    initPublic: [
      { type: 'inbound',  text: "I need to install Figma for design work but when I try to run the installer it says 'This action requires administrator privileges'. My manager approved me for a Figma seat last week — can someone help me get it installed?", name: 'Anjelica Silva', time: 'Jan 28, 2:10pm', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Jan 28, 2:22pm', text: "Hi Anjelica, great news — you don't actually need admin rights to install Figma. The block happens when you try to install via the web download (the .dmg file). Instead:\n\n1. Open **Managed Software Center** on your Mac (search in Spotlight)\n2. Search for 'Figma'\n3. Click Install — it should take about 2 minutes\n\nThe Figma seat your manager approved is already provisioned, so once it's installed you should be able to log in with your Acme email address and access your team's workspace immediately." },
      { type: 'inbound',  text: "That worked — Figma is installed and I can see my team's projects. That app has so much useful software in it, I had no idea.", name: 'Anjelica Silva', time: 'Jan 28, 2:30pm', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Sarah Smith', time: 'Jan 28, 2:18pm', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Figma is in Managed Software Center. User tried the web installer instead. Access was pre-provisioned via Okta — no action needed on IT side." },
      { type: 'inbound', name: 'Sarah Smith', time: 'Jan 28, 2:35pm', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Resolved. This is the second 'can't install approved software' ticket in 3 days after TICKET-29. Same root cause: employees don't know Managed Software Center exists. Coming back as TICKET-44 too — pattern is clear. Documenting for KB gap." },
    ],
  },
  { id: 'TICKET-38', date: 'Feb 2, 2026',  name: 'VPN Drops When Connecting to AWS Resources',           hasImage: false, priority: 'High',     status: 'Resolved',      updated: '3 weeks ago',  sla: '4h',   slaType: 'normal',  assignee: PEOPLE.martin, requester: PEOPLE.ang,    steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound',  text: "My VPN keeps dropping every time I try to connect to our AWS resources (us-east-1). Regular internet works fine but as soon as I hit anything in AWS — RDS, S3, the internal tooling — the connection drops within 30 seconds. This has been happening all week and I have a release tonight.", name: 'Ang Lee', time: 'Feb 2, 2:05pm', bg: 'a08060', fg: 'ffffff', initials: 'AL' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 2, 2:18pm', text: "Hi Ang, I can see why this is urgent. A few quick questions:\n1. Which VPN client version are you on? (Cisco AnyConnect → Help → About)\n2. Does it disconnect only when accessing AWS, or also other internal resources like the dev servers?\n3. Are you on home WiFi or a wired connection?" },
      { type: 'inbound',  text: "AnyConnect 4.10.06079. It's only AWS — internal dev servers and Slack are fine. I'm on home WiFi, fibre connection, no issues otherwise.", name: 'Ang Lee', time: 'Feb 2, 2:22pm', bg: 'a08060', fg: 'ffffff', initials: 'AL' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 2, 2:41pm', text: "That's the tell — AWS traffic routes through a different gateway than our internal servers. The issue is that your VPN profile is set to 'full tunnel' mode, which sends all traffic (including AWS) through our corporate VPN gateway. AWS requests are then hitting a NAT timeout because the gateway isn't optimised for high-volume cloud traffic.\n\nFix: I'm going to push a split-tunnel VPN profile to your device. This keeps corporate traffic through the VPN but routes AWS traffic directly over your internet connection. Give me 5 minutes." },
      { type: 'inbound',  text: "That fixed it. AWS is solid now and the VPN is staying connected. Thank you!", name: 'Ang Lee', time: 'Feb 2, 3:02pm', bg: 'a08060', fg: 'ffffff', initials: 'AL' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 2, 2:15pm', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "This is the 4th AWS/VPN ticket in 3 weeks. Same pattern every time — engineering team members on full-tunnel VPN hitting AWS NAT timeouts. Root cause: default VPN profile is full-tunnel which doesn't work well with AWS us-east-1 latency and connection pooling." },
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 2, 3:05pm', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Resolution: pushed split-tunnel profile (aws-split-v2) via Cisco ISE. AWS subnets (10.0.0.0/8, 172.16.0.0/12 and all *.amazonaws.com) now bypass VPN. Verified with Ang — stable.\n\nThe VPN knowledge base article has nothing on split-tunnel configuration or when to use it. This is the fix for any AWS connectivity issue. Need to add a section explaining when to request the split-tunnel profile. Flagging for KB." },
    ],
  },
  { id: 'TICKET-42', date: 'Feb 3, 2026',  name: 'MFA Not Working After Laptop Swap',                   hasImage: false, priority: 'Critical', status: 'Resolved',      updated: '3 weeks ago',  sla: '2h',   slaType: 'normal',  assignee: PEOPLE.steve,  requester: PEOPLE.pat,    steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound', text: "I just got my replacement laptop from IT and now I can't log in to anything. Okta is asking me to verify with MFA but my old phone is gone — it was stolen with the old laptop. I have a new phone but I never set up Okta on it. I'm completely locked out.", name: 'Patrick Tuckey', time: 'Feb 3, 8:42am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 3, 8:51am', text: "Hi Patrick — I can get you unblocked quickly. Since you've lost access to your enrolled MFA device I'll issue a temporary bypass code right now.\n\nBypass code: 847-291 (valid for 15 minutes)\n\nSteps:\n1. Go to accounts.acmecorp.com\n2. Enter your username and password\n3. When prompted for MFA, click 'Use a bypass code' and enter the code above\n4. Once you're in, immediately go to Settings → Security → Set up Okta Verify on your new phone before the code expires\n\nStand by — I'll stay on this ticket until you confirm you're in." },
      { type: 'inbound', text: "The bypass code worked. I'm in and just enrolled Okta Verify on my new phone. Really appreciate the fast response.", name: 'Patrick Tuckey', time: 'Feb 3, 9:04am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 3, 8:48am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Classic device swap + lost MFA scenario. Issued bypass code from Okta console. User re-enrolled successfully. Note: IT should proactively reset and re-enroll MFA BEFORE handing over a replacement device — this is the 2nd ticket this month where the handoff created a lockout." },
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 3, 9:10am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Resolved. This is becoming a pattern — TICKET-70 and TICKET-67 both involved MFA failing after a device change. Agents keep solving it ad hoc with bypass codes but there's no documented process. Need KB article: what happens to MFA on device replacement, how IT should handle proactively, what employees should do if locked out. Flagging." },
    ],
  },
  { id: 'TICKET-44', date: 'Feb 5, 2026',  name: 'Software Install Blocked by Company Policy',          hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '3 weeks ago',  sla: '2d',   slaType: 'normal',  assignee: PEOPLE.sarah,  requester: PEOPLE.martin, steps: S_ACCESS_DONE,
    initPublic: [
      { type: 'inbound', text: "Trying to install Postman for API testing but getting a message: 'Installation blocked by company security policy'. I need this for my work — my whole team uses it. Why is it blocked and how do I get it?", name: 'Martin Ludington', time: 'Feb 5, 3:20pm', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 5, 3:38pm', text: "Hi Martin, Postman is on our approved software list so this is straightforward to sort out. The block message appears because our Jamf policy requires installs to go through the IT-managed channel rather than directly from the web.\n\nHere's how to get it:\n1. Open the Managed Software Center app on your Mac (search in Spotlight)\n2. Search for 'Postman' — it should appear with an Install button\n3. Click Install — no admin rights needed, no approval required for approved software\n\nIf it doesn't appear in Managed Software Center, let me know and I can push it directly to your device." },
      { type: 'inbound', text: "Found it in Managed Software Center, installed in about 2 minutes. Wish I'd known about that app sooner — there's a lot of useful stuff in there.", name: 'Martin Ludington', time: 'Feb 5, 3:45pm', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Sarah Smith', time: 'Feb 5, 3:30pm', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Postman is in our Managed Software Center — user just didn't know. This is the same issue as TICKET-29 and TICKET-33 (Node.js and Figma). Everyone hits the block message and opens a ticket instead of checking Managed Software Center first." },
      { type: 'inbound', name: 'Sarah Smith', time: 'Feb 5, 3:50pm', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Resolved. 3rd 'software blocked' ticket this month (TICKET-29, TICKET-33, TICKET-44). All three resolved the same way: use Managed Software Center. Employees don't know it exists. Need a KB article explaining: why installs are blocked, what Managed Software Center is, how to use it, what to do if software isn't listed (request process). Flagging." },
    ],
  },
  { id: 'TICKET-49', date: 'Feb 8, 2026',  name: 'Is My Dentist Still In-Network After Plan Change?',   hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '2 weeks ago',  sla: '3d',   slaType: 'normal',  assignee: PEOPLE.ang,    requester: PEOPLE.anj,    steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound',  text: "Hi — with the dental plan switching from Delta Dental to Cigna in April, I want to make sure my dentist (Dr. Patel at ClearSmile Dental, downtown) is still in-network. I have a cleaning scheduled for April 15 and don't want to be surprised with an out-of-network bill.", name: 'Anjelica Silva', time: 'Feb 8, 11:02am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 8, 11:34am', text: "Hi Anjelica, great question to ask ahead of time. I checked the Cigna DPPO network list that HR received from benefits administration this week.\n\nUnfortunately ClearSmile Dental (all downtown locations) is not included in the Cigna DPPO network as of April 1, 2026. Dr. Patel's practice is currently in-network with Delta Dental but did not contract with Cigna.\n\nOptions:\n• Reschedule your April 15 appointment to before April 1 while Delta Dental is still active\n• Find a new Cigna DPPO dentist using the provider finder at cigna.com/find-a-doctor\n• Keep the appointment but expect out-of-network cost-sharing (typically 50% coinsurance after deductible)\n\nHR is sending a full communication to all staff next week with the provider list and transition guide." },
      { type: 'inbound',  text: "Thanks for checking. I'll move the appointment to March. Could you also send me the link to find Cigna dentists?", name: 'Anjelica Silva', time: 'Feb 8, 11:41am', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 8, 11:44am', text: "Of course — Cigna provider search: cigna.com/find-a-doctor (select 'Dental' and plan type 'DPPO'). Your employee ID is on your benefits card and you can use it to verify coverage. I'll mark this ticket as resolved — let me know if you have any other questions before the April transition." },
    ],
    initInternal: [
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 8, 11:20am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "Confirmed with HR benefits team: ClearSmile Dental is not in Cigna DPPO network. Got the network transition list from Sarah Chen. Key affected providers: ClearSmile (downtown), Family Dentistry on Broad St, and Smile Studio. All three are in-network with Delta but not Cigna." },
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 8, 11:50am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "Resolved. This is the 2nd ticket this week about the April dental transition. The HR knowledge base article on dental benefits is outdated — it still references Delta Dental and has no mention of the Cigna switch or which providers are affected. Need to update with: new provider network, transition date, cost-sharing for out-of-network, and link to Cigna provider finder. Flagging for KB update." },
    ],
  },
  { id: 'TICKET-70', date: 'Feb 25, 2026', name: 'Can\'t Log In After Device Replacement',               hasImage: false, priority: 'Critical', status: 'Resolved',      updated: '1 week ago',   sla: '2h',   slaType: 'normal',  assignee: PEOPLE.steve,  requester: PEOPLE.sarah,  steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound', text: "I received my new MacBook today from IT. I can log in to the Mac itself but when I try to open any company app — Google Workspace, Slack, even the IT portal — I get redirected to Okta and then it just says 'authentication failed'. I've been unable to work for 2 hours.", name: 'Sarah Smith', time: 'Feb 25, 11:08am', bg: 'd4938a', fg: 'ffffff', initials: 'SS' },
      { type: 'outbound', isAi: true, senderLabel: 'IT Agent', time: 'Feb 25, 11:17am', text: "Hi Sarah, this is an MFA re-enrollment issue — your new device isn't registered with Okta yet so it can't complete the authentication flow. I'm resetting your MFA factors in the Okta console right now.\n\nOnce I've done that (30 seconds), go to accounts.acmecorp.com in Safari, log in with your password — you'll be prompted to set up a new MFA factor. Use your phone to scan the Okta Verify QR code. After that's done, all your apps should work normally." },
      { type: 'inbound', text: "Done — Okta Verify is set up and I can access everything now. This should have been part of the device handoff, I had no idea I'd need to re-do MFA.", name: 'Sarah Smith', time: 'Feb 25, 11:28am', bg: 'd4938a', fg: 'ffffff', initials: 'SS' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 25, 11:12am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "MFA reset done in Okta — user re-enrolled successfully. New device wasn't pre-enrolled before handoff, which caused the lockout. This is the exact same scenario as TICKET-42 and TICKET-67." },
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 25, 11:35am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Resolved. Third MFA lockout after device replacement in 3 weeks. The root issue is our device handoff checklist doesn't include proactive MFA re-enrollment. Employees are landing on new devices completely locked out. KB article + IT process change needed: pre-enroll MFA before handing over device, or at minimum warn the employee. This resolution, TICKET-42, and TICKET-67 are the source for that KB draft." },
    ],
  },
  { id: 'TICKET-71', date: 'Feb 26, 2026', name: 'Performance Cycle During Leave of Absence',            hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '1 week ago',   sla: '3d',   slaType: 'normal',  assignee: PEOPLE.ang,    requester: PEOPLE.pat,    steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound',  text: "Hi — I'm starting parental leave in March and the Q2 performance review cycle runs April-May. Will I still be evaluated during that cycle, or will I be deferred? And will being on leave affect my rating in any way?", name: 'Patrick Tuckey', time: 'Feb 26, 10:15am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 26, 10:52am', text: "Hi Patrick, great that you're planning ahead. Here's how performance reviews work during protected leave:\n\n• Employees on parental, medical, or other protected leave during an active review cycle are automatically deferred to the next cycle.\n• Your review will take place in Q3 (July-August) instead of Q2.\n• Being on leave has zero impact on your rating — the evaluation is based on your contributions before the leave period. Your manager will assess work completed up to your leave start date.\n• Compensation increases tied to the review will be applied retroactively to the Q2 effective date once your review is complete.\n\nYou don't need to do anything — People Ops will notify your manager automatically when your deferral is processed." },
      { type: 'inbound',  text: "That's a relief, thank you. Will my manager know this automatically or should I tell them?", name: 'Patrick Tuckey', time: 'Feb 26, 10:58am', bg: '8b7ab5', fg: 'ffffff', initials: 'PT' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 26, 11:03am', text: "People Ops sends a notification to your manager when the deferral is processed, usually 2 weeks before the cycle opens. That said, it's always a good idea to mention it to your manager as part of your pre-leave handoff conversation — it helps set expectations and avoids any confusion during the cycle." },
    ],
    initInternal: [
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 26, 10:40am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "Confirmed the deferral policy with People Ops (Sarah Chen). Protected leave = automatic deferral, no exceptions. Comp increases retroactive to Q2 date. Manager notification sent by People Ops at cycle open minus 2 weeks." },
      { type: 'inbound', name: 'Ang Lee', time: 'Feb 26, 11:10am', bg: 'a08060', fg: 'ffffff', initials: 'AL', text: "Resolved. This is the 3rd leave + performance question this month. The current HR KB has a general 'Leave of Absence' article but nothing specific about how performance cycles interact with leave — this is clearly a gap. Should create a dedicated article covering: deferral policy, rating impact, comp treatment, and manager communication. Flagging for KB." },
    ],
  },
  { id: 'TICKET-72', date: 'Feb 27, 2026', name: 'Will Parental Leave Affect My Review Rating?',         hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '1 week ago',   sla: '3d',   slaType: 'normal',  assignee: PEOPLE.sarah,  requester: PEOPLE.anj,    steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound', text: "Hi — I'm going on parental leave in April and I'm worried about my performance review. My manager told me the review cycle runs May-June. Will I get a rating even though I'll be on leave? Could it hurt my promotion chances?", name: 'Anjelica Silva', time: 'Feb 27, 2:05pm', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 27, 2:34pm', text: "Hi Anjelica, completely understandable concern — let me put your mind at ease.\n\nParental leave cannot negatively affect your performance rating. Our policy (and the law in most jurisdictions) protects employees on protected leave:\n\n• Your review is deferred — you won't be evaluated during the cycle while you're on leave\n• When you return, you'll have a 60-day re-onboarding window before your formal review is scheduled\n• Your rating is based only on time actively worked — leave months are excluded from goal calculations\n• Merit increases and equity vesting are not impacted by the leave period\n• Promotion eligibility: a leave period cannot be used as a factor in a promotion decision. If you were on track before leave, that standing is preserved.\n\nI'd recommend having a quick conversation with your manager before you leave to align on what your review period will cover — that protects both of you." },
      { type: 'inbound', text: "That's really reassuring, thank you. I didn't realise there was a formal 60-day window after returning — that's helpful to know for planning.", name: 'Anjelica Silva', time: 'Feb 27, 2:41pm', bg: 'b58a7a', fg: 'ffffff', initials: 'AS' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Sarah Smith', time: 'Feb 27, 2:20pm', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Confirmed with People Ops: 60-day post-return window before formal review, protected leave cannot be used in promotion decisions, merit/equity unaffected. This is the 2nd leave + performance question this week (TICKET-71 was similar)." },
      { type: 'inbound', name: 'Sarah Smith', time: 'Feb 27, 2:48pm', bg: 'd4938a', fg: 'ffffff', initials: 'SS', text: "Resolved. TICKET-71 and this ticket both asking the same questions about performance during leave from different angles — one about review deferral, one about ratings/promotion impact. Both resolutions point to the same policy gap: no KB article explains how the review cycle works during leave. Flagging both for KB draft." },
    ],
  },
  { id: 'TICKET-73', date: 'Feb 28, 2026', name: 'Can I Expense a Standing Desk for Home Office?',       hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '6 days ago',   sla: '3d',   slaType: 'normal',  assignee: PEOPLE.martin, requester: PEOPLE.ang,    steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound',  text: "I work from home 4 days a week and my back has been a mess — I want to get a standing desk. Is that something I can expense under the home office policy? I couldn't find a clear answer in the current guidelines.", name: 'Ang Lee', time: 'Feb 28, 9:04am', bg: 'a08060', fg: 'ffffff', initials: 'AL' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 28, 9:31am', text: "Hi Ang, yes — standing desks qualify under the Home Office Equipment Allowance policy. Here's what you need to know:\n\n• Allowance: $500 per employee per fiscal year (resets July 1)\n• Eligible items: desks (including standing/sit-stand), chairs, monitors, keyboards, lighting\n• Not eligible: consumables, personal computing devices (covered separately), or non-work items\n\nTo claim:\n1. Purchase the item and keep the receipt\n2. Submit via Expensify with category: 'Home Office Equipment'\n3. Add a note confirming it's for your primary work-from-home setup\n4. Manager approval is automatic for amounts under $500\n\nIf the desk costs over $500, you'd need to cover the difference — the allowance doesn't roll over or stack." },
      { type: 'inbound',  text: "Great, the one I'm looking at is $340 so within budget. I didn't realise the allowance existed — I've been using the same $25 IKEA chair for 3 years. Thanks!", name: 'Ang Lee', time: 'Feb 28, 9:37am', bg: 'a08060', fg: 'ffffff', initials: 'AL' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 28, 9:20am', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Confirmed with Finance: $500 home office allowance is active, includes ergonomic furniture (desks, chairs). Fiscal year resets July 1. No rollover. Items must be documented as primary work-from-home use." },
      { type: 'inbound', name: 'Martin Lud…', time: 'Feb 28, 9:45am', bg: '7a9abf', fg: 'ffffff', initials: 'ML', text: "Resolved. The Expenses KB article mentions 'home office setup' in passing but doesn't spell out the $500 cap, eligible items, or how to categorise in Expensify. This is the 5th expense question this quarter and every time we're re-explaining the same policy. Need a dedicated Home Office Expenses section with the full details. Flagging for KB update." },
    ],
  },
  { id: 'TICKET-74', date: 'Feb 28, 2026', name: 'Reimbursement Limit for Monitor Purchase',             hasImage: false, priority: 'Low',      status: 'Resolved',      updated: '6 days ago',   sla: '3d',   slaType: 'normal',  assignee: PEOPLE.steve,  requester: PEOPLE.martin, steps: S_GENERAL_DONE,
    initPublic: [
      { type: 'inbound',  text: "Hi — I want to buy an external monitor for home use ($420). Is that covered under the home office allowance, and is there a reimbursement cap I should know about? I don't want to buy it and then find out I can only get $200 back.", name: 'Martin Ludington', time: 'Feb 28, 10:05am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
      { type: 'outbound', isAi: true, senderLabel: 'HR Agent', time: 'Feb 28, 10:28am', text: "Hi Martin, good question. Monitors are covered under the Home Office Equipment Allowance. Here are the key details:\n\n• **Cap**: $500 per employee per fiscal year (July 1 – June 30)\n• **Eligible items**: monitors, keyboards, mice, desks, chairs, lighting — anything that supports your primary work-from-home setup\n• **How to claim**: Submit via Expensify, category: 'Home Office Equipment'. Add a note confirming it's for your WFH setup\n• **Approval**: Automatic for amounts under $500 (manager doesn't need to manually approve)\n\nYour $420 monitor is fully within the allowance — you'd have $80 remaining for the rest of the fiscal year. Just keep the receipt and expense it within 30 days of purchase." },
      { type: 'inbound',  text: "Perfect — I had no idea the cap was $500, I assumed it was lower. Going to order today. Thanks!", name: 'Martin Ludington', time: 'Feb 28, 10:34am', bg: '7a9abf', fg: 'ffffff', initials: 'ML' },
    ],
    initInternal: [
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 28, 10:20am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Confirmed: $500 cap, fiscal year July 1. Monitors are included. Same policy as TICKET-73 (standing desk)." },
      { type: 'inbound', name: 'Steve Smith', time: 'Feb 28, 10:40am', bg: '6d8aad', fg: 'ffffff', initials: 'SS', text: "Resolved. 2nd home office equipment question this week (TICKET-73 was standing desk). The Expenses KB article mentions 'home office' but doesn't state the $500 cap clearly, doesn't list eligible items, and doesn't explain the Expensify category. Each ticket we're re-explaining the same thing. Flagging for KB article update — the Expenses article needs a dedicated home office section." },
    ],
  },
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
  { label: 'Total cases',        value: '8',      trend: '+1 from last week',      trendGood: false, spark: [5, 6, 5, 7, 6, 7, 8]          },
  { label: 'AI-handled cases',   value: '3',      trend: '38% of total',           trendGood: true,  spark: [1, 1, 2, 2, 2, 3, 3]          },
  { label: 'AI deflection rate', value: '38%',    trend: '5% above last month',    trendGood: true,  spark: [28, 30, 31, 33, 34, 36, 38]   },
  { label: 'MTTA',               value: '2h 15m', trend: '12% faster than target', trendGood: true,  spark: [195, 180, 172, 165, 158, 148, 135] },
  { label: 'SLA compliance',     value: '95%',    trend: '1% below target',        trendGood: false, spark: [97, 96, 97, 96, 95, 96, 95]   },
];

export const HR_TABS = ['All Cases', 'Unassigned', 'Open Cases', 'Pending', 'Resolved'];

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
    case 'Unassigned':
      result = result.filter(t => !t.assignee);
      break;
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
