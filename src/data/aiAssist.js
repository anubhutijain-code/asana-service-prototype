// ─── AI Assist data — static copilot signals keyed by ticket id / category ─────

// Per-ticket intent signals
export const AI_INTENT = {
  'TICKET-95': {
    intent: 'Role access update after department transfer',
    confidence: 94,
    sentiment: 'Urgent',
    urgency: 'SLA at risk',
    tags: ['Salesforce', 'Dept Transfer'],
  },
  'TICKET-69': {
    intent: 'License tier mismatch post-transfer',
    confidence: 89,
    sentiment: 'Concerned',
    urgency: 'Deadline-driven',
    tags: ['M365', 'Power BI'],
  },
  'TICKET-68': {
    intent: 'Payroll discrepancy — missing overtime pay',
    confidence: 97,
    sentiment: 'Frustrated',
    urgency: 'High impact',
    tags: ['Overtime', 'Missing pay'],
  },
  'TICKET-66': {
    intent: 'Software license request — time-sensitive',
    confidence: 91,
    sentiment: 'Urgent',
    urgency: 'Time-sensitive',
    tags: ['Salesforce', 'Board deadline'],
  },
  'TICKET-65': {
    intent: 'WiFi connectivity failure — office device',
    confidence: 88,
    sentiment: 'Neutral',
    urgency: 'SLA overdue',
    tags: ['WiFi', 'Vancouver'],
  },
  'TICKET-63': {
    intent: 'Persistent WiFi failure after troubleshooting',
    confidence: 85,
    sentiment: 'Frustrated',
    urgency: 'SLA overdue',
    tags: ['WiFi', 'Recurring'],
  },
  'TICKET-62': {
    intent: 'Lost device — data risk + replacement needed',
    confidence: 99,
    sentiment: 'Anxious',
    urgency: 'SLA overdue',
    tags: ['Lost laptop', 'Data risk'],
  },
};

// Per-category resolution steps
export const AI_RESOLUTION_STEPS = {
  'Access Management': [
    'Verify identity: confirm employee ID and email match HR records',
    'Confirm department transfer is reflected in HR system (Workday)',
    'Check current role and permissions in Okta / Active Directory',
    'Update role and provision access in target system (Salesforce, etc.)',
    'Confirm resolution with employee and log outcome in ticket',
  ],
  'Software Access': [
    'Verify requester identity and confirm manager approval on file',
    'Check available license inventory and confirm correct tier',
    'Confirm HR records reflect correct role / department for the user',
    'Provision license using the IT provisioning workflow',
    'Send confirmation to requester and update ticket status to Resolved',
  ],
  'Network': [
    'Gather device type, OS version, and office location from requester',
    'Check network infrastructure status and any known active incidents',
    'Walk requester through standard WiFi troubleshooting steps',
    'If hardware or infrastructure issue confirmed, escalate to network team',
    'Confirm connectivity is restored and close ticket',
  ],
  'Hardware': [
    'Verify asset details and confirm device ownership in CMDB',
    'Assess severity: data loss risk, loan device needed, or repair only',
    'Initiate data recovery steps if there is any risk of data exposure',
    'Coordinate with facilities or vendor for replacement or repair',
    'Update asset records and confirm resolution with employee',
  ],
  'Payroll': [
    'Gather discrepancy details: amount, pay period, and overtime records',
    'Verify no IT system errors are contributing to the discrepancy',
    'Route ticket to HR Payroll team with all collected evidence attached',
    'Send acknowledgement to employee with expected resolution timeline',
    'Follow up to confirm HR has resolved and employee is satisfied',
  ],
  'General': [
    'Acknowledge request and gather any missing details from requester',
    'Classify issue and route to correct team or queue if needed',
    'Investigate root cause and document findings in internal chat',
    'Implement resolution or agree a workaround with requester',
    'Confirm fix with requester and close ticket',
  ],
};

// Per-ticket suggested reply drafts — contextual to the last message in each thread
export const AI_SUGGESTED_REPLY = {
  // Last message: Sarah's initial report that Salesforce still shows Marketing role
  'TICKET-95': "Hi Sarah, I've picked this up — HR verification and manager approval are already running in parallel. Once both come back I'll update your Salesforce role to Finance straight away. Should be resolved shortly.",
  // Last message: Jordan asking if there's anything they can do to speed up the HR confirmation
  'TICKET-69': "Nothing needed from you, Jordan — I'm chasing HR directly to close out the transfer in Workday. The moment they confirm I can flip the licence across to E3 and you'll have Power BI and the full Excel suite. I'll update you well before your report deadline.",
  // Last message: Anjelica's follow-up flagging she still hasn't heard back and rent is due
  'TICKET-68': "Hi Anjelica, thanks for following up — I completely understand the urgency. I'm routing this to HR Payroll right now with everything flagged as urgent, including your rent deadline. You should hear from them very shortly.",
  // Last message: agent confirmed licence provisioned, no reply from Martin yet
  'TICKET-66': "Hi Martin, just checking in — your Salesforce Professional access should be active now. Let us know if you hit any issues pulling the Q1 pipeline data for the presentation.",
};

// Per-category KB article refs — mix of article IDs (strings) and web sources (objects)
export const AI_KB_REFS = {
  'Access Management': [
    'it-002',
    'it-001',
    { type: 'web', id: 'web-okta-mfa',   title: 'Okta MFA enrollment guide',          domain: 'help.okta.com',       url: 'https://help.okta.com/en-us/content/topics/security/mfa-enrollment.htm' },
  ],
  'Software Access': [
    'it-004',
    { type: 'web', id: 'web-ms-m365',    title: 'Assign Microsoft 365 licences',       domain: 'learn.microsoft.com', url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/assign-licenses-to-users' },
  ],
  'Network': [
    'it-001',
    { type: 'web', id: 'web-gw-vpn',     title: 'GlobalProtect VPN client setup',      domain: 'support.google.com',  url: 'https://support.google.com/a/answer/9176866' },
  ],
  'Hardware':  ['it-003'],
  'Payroll':   [],
  'General':   [],
};

// Ask AI simulated responses — matched on input keywords, fallback last
export const AI_CHAT_RESPONSES = [
  {
    keywords: ['mfa', 'authenticator', 'two-factor', '2fa'],
    response: 'For MFA issues, first check whether the employee uses Okta Verify or Microsoft Authenticator. If the device was replaced, the MFA token needs re-enrollment — this requires identity verification first. Use the Okta admin console to reset the MFA factor, then guide the employee through re-enrollment.',
  },
  {
    keywords: ['escalate', 'manager', 'escalation'],
    response: "To escalate: update the ticket priority to Critical, add the manager as a watcher, and post an internal note explaining the escalation reason. If SLA has already been breached, use the 'Route to manager' option in ticket actions and flag it in your team stand-up.",
  },
  {
    keywords: ['sla', 'breach', 'overdue'],
    response: "SLA is calculated from ticket creation time. If SLA is at risk: (1) prioritise an immediate response to the requester, (2) add an internal note with your action plan, (3) notify your team lead. A breach can be logged as 'extenuating circumstances' in ticket metadata if the delay was caused by a third party.",
  },
  {
    keywords: ['salesforce', 'sfdc'],
    response: "For Salesforce access issues: check the user's profile and permission sets in the SFDC admin console. Department transfers often require updating the role hierarchy. Confirm the correct licence tier (Professional vs Enterprise) based on the user's role catalogue entry before provisioning.",
  },
  {
    keywords: ['payroll', 'salary', 'overtime', 'paycheck'],
    response: "Payroll discrepancies must be routed to the HR Payroll team — IT cannot directly action payroll corrections. Collect the pay period, the discrepancy amount, and any overtime records from the employee, then use 'Route to HR' to transfer the ticket with all context attached.",
  },
  {
    keywords: ['license', 'licence', 'm365', 'microsoft'],
    response: "For M365 licence issues: check the user's current assignment in the Microsoft 365 admin centre. Department transfers often cause licence mismatches if the HR system sync hasn't completed. Always get HR confirmation of the org change before upgrading a licence tier — this is required for the compliance audit trail.",
  },
  {
    keywords: ['okta', 'sso', 'login', 'password'],
    response: "For Okta / SSO issues: check the user's account status in the Okta admin dashboard (active, locked, or deactivated). If the account is locked, use the unlock tool after identity verification. For password resets, follow the approved self-service flow unless the employee is fully locked out.",
  },
  {
    keywords: ['vpn', 'remote', 'network'],
    response: "For VPN issues: confirm the employee is using the approved VPN client (Cisco AnyConnect or Palo Alto GlobalProtect depending on location). Check if there are any active VPN incidents on the status page first. Common fixes: reinstall the client, reset credentials, or check split-tunnel config for AWS workspaces.",
  },
  {
    // fallback — matched when no keyword hits (must be last)
    keywords: [],
    response: "I don't have specific guidance for that query. Try searching the Knowledge Base for related articles, or escalate to a senior agent if this is blocking the employee. Make sure to document what you've already tried in an internal note.",
  },
];
