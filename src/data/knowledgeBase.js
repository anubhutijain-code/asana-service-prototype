// ─── Integration source config ────────────────────────────────────────────────
export const INTEGRATION_CONFIG = {
  confluence: { label: 'Confluence', color: '#0052CC', bg: '#E8F0FF' },
  slab:       { label: 'Slab',       color: '#7C3AED', bg: '#EDE9FE' },
  notion:     { label: 'Notion',     color: '#1E1F21', bg: '#F0F0F0' },
};

export const KB_PROJECTS = [
  {
    id: 'it-kb', name: 'IT Knowledge Base', team: 'IT Team',
    source: {
      type: 'confluence', workspace: 'Acme Corp', space: 'IT Team Space',
      syncedAt: '2026-03-02T08:00:00Z', syncStatus: 'synced',
      autoSync: true, syncInterval: '6 hours',
    },
  },
  {
    id: 'hr-kb', name: 'HR Knowledge Base', team: 'HR Team',
    source: {
      type: 'slab', workspace: 'Acme Corp', space: 'People & HR',
      syncedAt: '2026-03-01T14:30:00Z', syncStatus: 'synced',
      autoSync: true, syncInterval: '12 hours',
    },
  },
  {
    id: 'eng-kb', name: 'Engineering Runbook', team: 'Engineering Team',
    source: {
      type: 'notion', workspace: 'Engineering', space: 'Eng Runbooks',
      syncedAt: '2026-02-28T09:15:00Z', syncStatus: 'synced',
      autoSync: false, syncInterval: '24 hours',
    },
  },
  {
    id: 'onb-kb', name: 'Onboarding Guide', team: 'People Ops',
    source: null,
  },
];

export const KB_ARTICLES = [
  // IT — 3 synced from Confluence, 1 internal
  {
    id: 'it-001', projectId: 'it-kb', title: 'VPN Setup and Troubleshooting Guide',
    status: 'Published', category: 'Network', author: 'James Carter', team: 'IT Team',
    updatedAt: '2025-01-15', source: 'confluence',
    content: [
      { type: 'h2', text: 'Overview 🔐' },
      { type: 'p', text: 'This guide walks you through setting up the Acme Corp VPN client on your device and resolving the most common connectivity issues. All employees are required to connect via VPN when accessing internal systems from outside the office network.' },
      { type: 'h2', text: 'Installation' },
      { type: 'li', text: 'Download the GlobalProtect client from the IT portal at it.acmecorp.com/vpn.' },
      { type: 'li', text: 'Run the installer and follow the on-screen prompts. No admin rights are required.' },
      { type: 'li', text: 'When prompted, enter the gateway address: vpn.acmecorp.com' },
      { type: 'li', text: 'Sign in with your Acme SSO credentials (same as your email login).' },
      { type: 'h2', text: 'Troubleshooting common issues' },
      { type: 'p', text: 'If the VPN fails to connect, first check that your internet connection is active and that you are not already on the office network. Corporate Wi-Fi automatically routes through the VPN — connecting manually while on-site will cause conflicts.' },
      { type: 'li', text: 'Authentication failure: Confirm your SSO password has not expired. Reset it at accounts.acmecorp.com if needed.' },
      { type: 'li', text: 'Slow connection: Try switching to the nearest regional gateway. A full list is available in the IT portal.' },
      { type: 'li', text: 'Client crashes on startup: Uninstall, clear the GlobalProtect app data folder, and reinstall.' },
      { type: 'link', text: 'Submit a VPN support ticket' },
    ],
  },
  {
    id: 'it-002', projectId: 'it-kb', title: 'How to Reset Your Password',
    status: 'Published', category: 'Account Access', author: 'Sarah Lin', team: 'IT Team',
    updatedAt: '2025-02-03', source: 'confluence',
    content: [
      { type: 'h2', text: 'Overview 🔑' },
      { type: 'p', text: 'Acme Corp uses a unified SSO identity system powered by Okta. Your single password grants access to email, Slack, the IT portal, Confluence, and all connected SaaS tools. Passwords expire every 90 days.' },
      { type: 'h2', text: 'Self-service reset' },
      { type: 'li', text: 'Go to accounts.acmecorp.com and click "Forgot password".' },
      { type: 'li', text: 'Enter your work email address and complete the MFA challenge (Okta Verify or SMS).' },
      { type: 'li', text: 'Choose a new password that meets the complexity requirements: 12+ characters, one uppercase, one number, one symbol.' },
      { type: 'li', text: 'Your new password takes effect immediately across all connected applications.' },
      { type: 'h2', text: 'Locked out completely?' },
      { type: 'p', text: 'If you cannot access your email or Okta Verify and are locked out, contact IT Support directly via Slack (#it-help) or call the IT helpdesk. A member of the team can issue a temporary access code after verifying your identity.' },
      { type: 'link', text: 'Go to accounts.acmecorp.com' },
    ],
  },
  { id: 'it-003', projectId: 'it-kb', title: 'Printer Configuration for Remote Users',   status: 'Draft',       category: 'Hardware',        author: 'Marcus Webb',  team: 'IT Team',          content: [], updatedAt: '2025-03-20', source: 'confluence' },
  { id: 'it-004', projectId: 'it-kb', title: 'Software Installation Policy',             status: 'Archived',    category: 'Policy',          author: 'James Carter', team: 'IT Team',          content: [], updatedAt: '2024-11-01', source: 'internal'   },

  // HR — 3 synced from Slab, 1 internal
  {
    id: 'hr-001', projectId: 'hr-kb', title: 'Employee Benefits Overview',
    status: 'Published', category: 'Benefits', author: 'Priya Nair', team: 'HR Team',
    updatedAt: '2025-01-10', source: 'slab',
    content: [
      { type: 'h2', text: 'Overview 🌿' },
      { type: 'p', text: 'Acme Corp offers a comprehensive benefits package available to all full-time employees starting on their first day. Part-time employees working 20+ hours per week are eligible for medical and dental coverage.' },
      { type: 'h2', text: 'Health & Dental' },
      { type: 'p', text: 'We offer three medical plan tiers through Aetna: High Deductible (HSA-eligible), Select, and Premium. The company covers 80% of the Premium plan premium for employees and 60% for dependents. Dental and vision are fully employer-paid for employees.' },
      { type: 'h2', text: '401(k) & Equity' },
      { type: 'li', text: '401(k) with 4% employer match, vesting immediately.' },
      { type: 'li', text: 'RSU grants for levels L4 and above, vesting over 4 years with a 1-year cliff.' },
      { type: 'h2', text: 'Additional perks' },
      { type: 'li', text: '$500 annual wellness stipend (gym, mental health apps, ergonomic equipment).' },
      { type: 'li', text: '$1,000 annual learning & development budget.' },
      { type: 'li', text: '16 weeks fully paid parental leave for all parents.' },
      { type: 'li', text: 'Unlimited PTO with a 2-week minimum encouraged.' },
      { type: 'link', text: 'Enroll or update benefits at benefits.acmecorp.com' },
    ],
  },
  {
    id: 'hr-002', projectId: 'hr-kb', title: 'Leave of Absence Request Process',
    status: 'Published', category: 'Leave', author: 'Dana Osei', team: 'HR Team',
    updatedAt: '2025-02-18', source: 'slab',
    content: [
      { type: 'h2', text: 'Overview 📋' },
      { type: 'p', text: 'This article covers how to request a planned or unplanned leave of absence at Acme Corp, including medical leave, family leave, personal leave, and bereavement. All leave requests are managed through Workday.' },
      { type: 'h2', text: 'How to submit a leave request' },
      { type: 'li', text: 'Log in to Workday and navigate to Time Off > Leave of Absence > Request Leave.' },
      { type: 'li', text: 'Select the leave type, enter start and end dates, and attach any supporting documentation required.' },
      { type: 'li', text: 'Your manager will be notified automatically. Leave exceeding 5 business days also routes to HR for review.' },
      { type: 'li', text: 'Approval SLA is 2 business days for standard requests and same-day for medical emergencies.' },
      { type: 'h2', text: 'Leave types and durations' },
      { type: 'li', text: 'Medical leave: Up to 12 weeks paid under FMLA; short-term disability kicks in after day 7.' },
      { type: 'li', text: 'Parental leave: 16 weeks fully paid for primary caregivers, 8 weeks for secondary.' },
      { type: 'li', text: 'Bereavement: 5 days for immediate family, 3 days for extended family.' },
      { type: 'li', text: 'Personal leave: Up to 4 weeks unpaid with manager and HR approval.' },
      { type: 'link', text: 'Open Workday to request leave' },
    ],
  },
  { id: 'hr-003', projectId: 'hr-kb', title: 'Performance Review Cycle FAQ',             status: 'Draft',       category: 'Performance',     author: 'Priya Nair',   team: 'HR Team',          content: [], updatedAt: '2025-03-05', source: 'slab'       },
  { id: 'hr-004', projectId: 'hr-kb', title: 'Expense Reimbursement Policy',             status: 'Unpublished', category: 'Finance',         author: 'Tom Reyes',    team: 'HR Team',          content: [], updatedAt: '2025-03-28', source: 'internal'   },

  // Engineering — all synced from Notion
  {
    id: 'eng-001', projectId: 'eng-kb', title: 'Production Deployment Checklist',
    status: 'Published', category: 'Deployment', author: 'Alex Rivera', team: 'Engineering Team',
    updatedAt: '2025-01-22', source: 'notion',
    content: [
      { type: 'h2', text: 'Pre-deployment 🚀' },
      { type: 'li', text: 'All feature flags for the release are confirmed with the PM.' },
      { type: 'li', text: 'Staging environment smoke tests have passed (link to test run in PR).' },
      { type: 'li', text: 'Migration scripts have been dry-run on a staging DB snapshot.' },
      { type: 'li', text: 'Rollback plan is documented and the on-call engineer is briefed.' },
      { type: 'h2', text: 'Deployment window' },
      { type: 'p', text: 'Production deploys happen Tuesday–Thursday between 10am–2pm PT. Emergency hotfixes can go out any time with on-call approval. Avoid deploying on Fridays or the day before a company holiday.' },
      { type: 'h2', text: 'Post-deployment' },
      { type: 'li', text: 'Monitor error rates in Datadog for 30 minutes post-deploy.' },
      { type: 'li', text: 'Verify key user journeys via the synthetic monitor dashboard.' },
      { type: 'li', text: 'Update the #deployments Slack channel with the release summary.' },
      { type: 'link', text: 'View deployment runbook in Notion' },
    ],
  },
  { id: 'eng-002', projectId: 'eng-kb', title: 'Database Backup and Restore Procedures', status: 'Published',   category: 'Database',        author: 'Nina Kowalski',team: 'Engineering Team', content: [], updatedAt: '2025-02-14', source: 'notion'     },
  { id: 'eng-003', projectId: 'eng-kb', title: 'On-Call Incident Response Runbook',      status: 'Published',   category: 'Incidents',       author: 'Alex Rivera',  team: 'Engineering Team', content: [], updatedAt: '2025-03-01', source: 'notion'     },
  { id: 'eng-004', projectId: 'eng-kb', title: 'Service Architecture Overview',          status: 'Draft',       category: 'Architecture',    author: 'Sam Chen',     team: 'Engineering Team', content: [], updatedAt: '2025-03-30', source: 'notion'     },

  // Onboarding — all internal
  { id: 'onb-001', projectId: 'onb-kb', title: 'Day 1 Checklist for New Hires',          status: 'Published',   category: 'Getting Started', author: 'Maya Torres',  team: 'People Ops',       content: [], updatedAt: '2025-01-05', source: 'internal'   },
  { id: 'onb-002', projectId: 'onb-kb', title: 'Setting Up Your Development Environment',status: 'Published',   category: 'Tools & Access',  author: 'Liam Okafor',  team: 'People Ops',       content: [], updatedAt: '2025-02-07', source: 'internal'   },
  { id: 'onb-003', projectId: 'onb-kb', title: 'Company Values and Culture Guide',       status: 'Published',   category: 'Culture',         author: 'Maya Torres',  team: 'People Ops',       content: [], updatedAt: '2025-01-28', source: 'internal'   },
  { id: 'onb-004', projectId: 'onb-kb', title: 'Benefits Enrollment Instructions',       status: 'Draft',       category: 'Benefits',        author: 'Liam Okafor',  team: 'People Ops',       content: [], updatedAt: '2025-03-15', source: 'internal'   },
];

// ─── KB Learnings — AI-detected knowledge gaps ─────────────────────────────────
// status: 'new' | 'reviewed' | 'dismissed'
// type:   'new-article' | 'update-article'
export const KB_LEARNINGS = [
  // IT KB
  {
    id: 'learn-it-001', projectId: 'it-kb', status: 'new',
    type: 'new-article',
    gap: 'No article covers setting up MFA on a new device after hardware replacement',
    suggestion: 'MFA Device Re-enrollment After Hardware Replacement',
    category: 'Account Access',
    sourceTickets: [{ id: 'TICKET-42', title: 'MFA Not Working After Laptop Swap' }, { id: 'TICKET-70', title: 'Can\'t Log In After Device Replacement' }],
    detectedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'learn-it-002', projectId: 'it-kb', status: 'new',
    type: 'update-article',
    linkedArticleId: 'it-001',
    gap: 'VPN article doesn\'t cover the split-tunnel configuration for the new AWS workspace',
    suggestion: 'Add a section on split-tunnel setup for AWS Workspaces',
    category: 'Network',
    sourceTickets: [{ id: 'TICKET-38', title: 'VPN Drops When Connecting to AWS Resources' }],
    detectedAt: '2026-03-02T08:30:00Z',
    suggestedBlocks: [
      { type: 'h2', text: 'AWS Workspaces: Split-Tunnel Configuration' },
      { type: 'p', text: 'If you use AWS Workspaces, split-tunnel mode may be required to route traffic correctly. By default, all traffic is sent through the VPN (full-tunnel), which can degrade performance for AWS-hosted applications.' },
      { type: 'li', text: 'Open the GlobalProtect client and go to Settings → Advanced.' },
      { type: 'li', text: 'Check "Enable split tunneling" and save.' },
      { type: 'li', text: 'Disconnect and reconnect to the VPN for the change to take effect.' },
      { type: 'p', text: 'If the option is greyed out, your GlobalProtect profile may need to be updated by an IT admin — submit a ticket referencing this guide.' },
    ],
  },
  {
    id: 'learn-it-003', projectId: 'it-kb', status: 'new',
    type: 'new-article',
    gap: 'No guidance on requesting admin privileges for approved tools — users repeatedly ask',
    suggestion: 'How to Request Local Admin Access for Approved Software',
    category: 'Policy',
    sourceTickets: [{ id: 'TICKET-29', title: 'Need Admin Access to Install Dev Tools' }, { id: 'TICKET-33', title: 'Can\'t Install Figma Without Admin Rights' }, { id: 'TICKET-44', title: 'Software Install Blocked by Company Policy' }],
    detectedAt: '2026-02-28T14:00:00Z',
  },
  {
    id: 'learn-it-004', projectId: 'it-kb', status: 'reviewed',
    type: 'update-article',
    linkedArticleId: 'it-003',
    gap: 'Printer article omits setup for the new Ricoh model deployed in London office',
    suggestion: 'Add Ricoh MP C4504 setup steps for the London office',
    category: 'Hardware',
    sourceTickets: [{ id: 'TICKET-19', title: 'Can\'t Add London Office Printer (Ricoh MP C4504)' }],
    detectedAt: '2026-02-20T11:15:00Z',
    suggestedBlocks: [
      { type: 'h2', text: 'Ricoh MP C4504 — London Office' },
      { type: 'p', text: 'The London office uses the Ricoh MP C4504 multifunction printer. Follow these steps to add it to your Mac or Windows device.' },
      { type: 'li', text: 'Mac: Go to System Settings → Printers & Scanners → click +.' },
      { type: 'li', text: 'Select "Add Printer or Scanner" and wait for the Ricoh MP C4504 to appear.' },
      { type: 'li', text: 'If it doesn\'t appear automatically, click "IP" and enter 10.8.4.22 as the address.' },
      { type: 'li', text: 'Choose "PCL 6" from the driver dropdown, then click Add.' },
      { type: 'li', text: 'Windows: Open Devices → Add a printer → enter \\\\print-lon\\ricoh-c4504.' },
    ],
  },
  {
    id: 'learn-it-005', projectId: 'it-kb', status: 'dismissed',
    type: 'new-article',
    gap: 'Several tickets asked about Zoom Rooms setup, not covered anywhere',
    suggestion: 'Zoom Rooms Setup and Troubleshooting Guide',
    category: 'Collaboration',
    sourceTickets: [{ id: 'TICKET-11', title: 'Zoom Room Won\'t Connect in Conference Room B' }],
    detectedAt: '2026-02-15T09:00:00Z',
  },

  // HR KB
  {
    id: 'learn-hr-001', projectId: 'hr-kb', status: 'new',
    type: 'new-article',
    gap: 'No article explains how parental leave interacts with the performance review cycle',
    suggestion: 'Parental Leave and Performance Review — What to Expect',
    category: 'Leave',
    sourceTickets: [{ id: 'TICKET-72', title: 'Will Parental Leave Affect My Review Rating?' }, { id: 'TICKET-71', title: 'Performance Cycle During Leave of Absence' }],
    detectedAt: '2026-03-01T16:00:00Z',
  },
  {
    id: 'learn-hr-002', projectId: 'hr-kb', status: 'new',
    type: 'update-article',
    linkedArticleId: 'hr-004',
    gap: 'Expense policy doesn\'t address reimbursement limits for home office equipment',
    suggestion: 'Add a section covering home office equipment reimbursement limits',
    category: 'Finance',
    sourceTickets: [{ id: 'TICKET-73', title: 'Can I Expense a Standing Desk for Home Office?' }, { id: 'TICKET-74', title: 'Reimbursement Limit for Monitor Purchase' }],
    detectedAt: '2026-02-27T12:00:00Z',
    suggestedBlocks: [
      { type: 'h2', text: 'Home Office Equipment Allowance' },
      { type: 'p', text: 'Full-time remote employees are eligible for a one-time home office equipment allowance of up to $500 per calendar year.' },
      { type: 'li', text: 'Eligible: monitors, keyboards, mice, webcams, ergonomic chairs.' },
      { type: 'li', text: 'Desks and standing desks: up to $300 with manager approval.' },
      { type: 'li', text: 'Submit receipts via Expensify within 30 days of purchase using category "Home Office."' },
      { type: 'p', text: 'The allowance does not roll over — unused balance resets January 1 each year.' },
    ],
  },
  {
    id: 'learn-hr-003', projectId: 'hr-kb', status: 'reviewed',
    type: 'update-article',
    linkedArticleId: 'hr-001',
    gap: 'Benefits article doesn\'t mention the new dental network change effective April',
    suggestion: 'Add a note on the April 2026 dental network changes',
    category: 'Benefits',
    sourceTickets: [{ id: 'TICKET-49', title: 'Is My Dentist Still In-Network After Plan Change?' }],
    detectedAt: '2026-02-22T10:30:00Z',
    suggestedBlocks: [
      { type: 'h2', text: 'April 2026 Dental Network Change' },
      { type: 'p', text: 'Effective April 1, 2026, Bright Smiles Dental Network replaces Delta Dental for in-network providers. Most previously in-network dentists have opted in, but verify yours before your next appointment.' },
      { type: 'li', text: 'Search in-network providers at the Bright Smiles portal (link in benefits portal).' },
      { type: 'li', text: 'Deductibles and out-of-pocket maximums reset on April 1 if you switch to a new provider.' },
      { type: 'li', text: 'Contact HR Benefits at benefits@company.com with any questions.' },
    ],
  },
];

// ─── KB Drafts — AI-generated articles from resolved tickets ──────────────────
// confidence: 'high' | 'medium' | 'low'
// status: 'draft' | 'agent_verified' | 'published' | 'dismissed'
export const KB_DRAFTS = [
  {
    id: 'draft-it-001', projectId: 'it-kb',
    title: 'MFA Re-enrollment After Device Replacement',
    category: 'Account Access', status: 'draft', confidence: 'high',
    generatedAt: '2026-03-24T11:20:00Z',
    triggerReason: 'AI failed to deflect 3 tickets on the same topic — no existing article covers MFA re-enrollment after a hardware swap',
    sourceTickets: [
      { id: 'TICKET-62', title: 'Report Lost Laptop for Patrick Tuckey' },
      { id: 'TICKET-67', title: 'Help Updating MacBook to Latest macOS' },
      { id: 'TICKET-69', title: 'Wrong Microsoft 365 License After Department Transfer' },
    ],
    content: [
      { type: 'h2', text: 'Overview' },
      { type: 'p',  text: 'When an employee receives a new device, their existing MFA token (Okta Verify or Microsoft Authenticator) does not transfer automatically. Re-enrollment is required before the employee can access any SSO-protected application.' },
      { type: 'h2', text: 'Steps to re-enroll' },
      { type: 'li', text: 'IT admin navigates to the Okta Admin Console → Directory → People, and searches for the affected user.' },
      { type: 'li', text: "Click the user's name → Security tab → Reset MFA. This clears all enrolled factors." },
      { type: 'li', text: 'Notify the employee. They will be prompted to enroll a new factor on next login.' },
      { type: 'li', text: 'Employee opens accounts.acmecorp.com, signs in with password only, and follows the Okta Verify setup flow on their new device.' },
      { type: 'li', text: 'If the employee cannot complete the MFA challenge at all (no phone access), issue a temporary bypass code from the Okta console valid for 15 minutes.' },
      { type: 'h2', text: 'Prevention tip' },
      { type: 'p',  text: 'When processing a device replacement request, proactively reset the MFA factor and notify the employee before the old device is wiped. This avoids a lockout on day one of the new device.' },
      { type: 'link', text: 'Open Okta Admin Console' },
    ],
  },
  {
    id: 'draft-it-002', projectId: 'it-kb',
    title: 'How to Request Local Admin Access for Approved Software',
    category: 'Policy', status: 'draft', confidence: 'high',
    generatedAt: '2026-03-23T09:05:00Z',
    triggerReason: 'AI failed to deflect 4 tickets asking about local admin access — existing policy article does not cover the request process',
    sourceTickets: [
      { id: 'TICKET-64', title: 'Request View Access to Figma and FigJam' },
      { id: 'TICKET-53', title: 'Need access to Jira project for Q1 planning' },
      { id: 'TICKET-66', title: 'Urgent Request for SFDC License Access' },
    ],
    content: [
      { type: 'h2', text: 'Overview' },
      { type: 'p',  text: "Acme Corp devices are managed by IT and do not grant local admin rights by default. Employees who need to install approved software can request temporary elevated access through the IT portal — no ticket required for tools on the approved software list." },
      { type: 'h2', text: 'Approved software list' },
      { type: 'p',  text: 'Check the IT portal (it.acmecorp.com/software) to confirm whether the tool you need is pre-approved. If it is, access can be granted same-day.' },
      { type: 'h2', text: 'Requesting access' },
      { type: 'li', text: 'Submit a request at it.acmecorp.com/admin-access. Select the software name, provide a brief business justification, and specify the duration needed (max 4 hours).' },
      { type: 'li', text: 'Your manager will receive an email to approve the request. Approval is typically instant for approved software.' },
      { type: 'li', text: 'Once approved, IT will push a temporary admin token to your device. You will receive a Slack notification when it is active.' },
      { type: 'li', text: 'Complete your installation within the window. Admin rights are automatically revoked after the approved period.' },
      { type: 'h2', text: 'Requesting unlisted software' },
      { type: 'p',  text: 'Software not on the approved list requires a security review. Submit a request and expect 3–5 business days. IT may request a vendor security questionnaire.' },
    ],
  },
  {
    id: 'draft-it-003', projectId: 'it-kb',
    title: 'VPN Split-Tunnel Configuration for AWS Workspaces',
    category: 'Network', status: 'agent_verified', confidence: 'medium',
    generatedAt: '2026-03-20T14:45:00Z',
    triggerReason: 'Existing VPN article was cited in 2 tickets but did not resolve them — gap detected in AWS Workspaces coverage',
    sourceTickets: [
      { id: 'TICKET-65', title: 'Phone Not Connecting to WiFi in Vancouver Office' },
      { id: 'TICKET-63', title: 'Unable to Connect to WiFi After Troubleshooting' },
    ],
    content: [
      { type: 'h2', text: 'Overview' },
      { type: 'p',  text: 'The standard GlobalProtect VPN routes all traffic through the corporate gateway, which causes conflicts with AWS Workspaces. Users accessing AWS Workspaces must use split-tunnel mode so that AWS traffic bypasses the VPN tunnel.' },
      { type: 'h2', text: 'Enabling split-tunnel mode' },
      { type: 'li', text: 'Open GlobalProtect and click the settings gear → Advanced.' },
      { type: 'li', text: "Toggle 'Split tunnel' to On. The gateway field should auto-populate with vpn.acmecorp.com." },
      { type: 'li', text: 'Disconnect and reconnect. AWS Workspaces traffic will now route directly.' },
      { type: 'h2', text: 'If the split-tunnel option is not visible' },
      { type: 'p',  text: 'Split-tunnel must be enabled by IT for your device profile. Submit a request via the IT portal and include your AWS Workspaces region. IT will update your VPN profile within 1 business day.' },
    ],
  },
  {
    id: 'draft-hr-001', projectId: 'hr-kb',
    title: 'Parental Leave and the Performance Review Cycle',
    category: 'Leave', status: 'draft', confidence: 'medium',
    generatedAt: '2026-03-22T16:30:00Z',
    triggerReason: 'AI failed to deflect 2 tickets asking how parental leave affects performance reviews — no existing article addresses this',
    sourceTickets: [
      { id: 'TICKET-68', title: 'Paycheck Short — Missing Overtime Pay for Feb' },
      { id: 'TICKET-58', title: 'Request for Tool to Test Tickets' },
    ],
    content: [
      { type: 'h2', text: 'Overview' },
      { type: 'p',  text: 'Employees on parental leave are not disadvantaged in the performance review process. Acme Corp policy ensures that leave periods are excluded from performance calculations and that returning employees receive a fair assessment window.' },
      { type: 'h2', text: 'How it works' },
      { type: 'li', text: "If you are on leave during a review cycle, your manager will note this and your review will be deferred until you have been back for at least 60 days." },
      { type: 'li', text: "Your performance rating will be based only on the period you were actively working. Leave months are excluded from goal attainment calculations." },
      { type: 'li', text: "Equity vesting and merit increase eligibility are not affected by parental leave." },
      { type: 'h2', text: 'What to expect on return' },
      { type: 'p',  text: "Within your first two weeks back, your manager will schedule a re-onboarding check-in. A formal performance review will be scheduled no earlier than 60 days after your return date. You will not be asked to catch up on missed goals from the leave period." },
    ],
  },
];

// ─── Ticket → Draft mapping (which tickets contributed to a draft) ────────────
export const TICKET_DRAFT_MAP = {
  'TICKET-62': 'draft-it-001',
  'TICKET-67': 'draft-it-001',
  'TICKET-69': 'draft-it-001',
  'TICKET-64': 'draft-it-002',
  'TICKET-53': 'draft-it-002',
  'TICKET-66': 'draft-it-002',
  'TICKET-65': 'draft-it-003',
  'TICKET-63': 'draft-it-003',
  'TICKET-68': 'draft-hr-001',
  'TICKET-58': 'draft-hr-001',
};

export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeTime(isoZ) {
  const diff = Date.now() - new Date(isoZ).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
