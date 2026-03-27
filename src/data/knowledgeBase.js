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
      { type: 'image', alt: 'GlobalProtect login screen showing the gateway address field', caption: 'Enter vpn.acmecorp.com in the gateway field and click Connect.' },
      { type: 'h2', text: 'Troubleshooting common issues' },
      { type: 'p', text: 'If the VPN fails to connect, first check that your internet connection is active and that you are not already on the office network. Corporate Wi-Fi automatically routes through the VPN — connecting manually while on-site will cause conflicts.' },
      { type: 'table',
        headers: ['Error message', 'Likely cause', 'Fix'],
        rows: [
          ['Authentication failed', 'Expired SSO password', 'Reset at accounts.acmecorp.com'],
          ['Cannot connect to gateway', 'On office network already', 'Disconnect from corporate Wi-Fi first'],
          ['Client crashes on startup', 'Corrupted app data', 'Uninstall, clear app data folder, reinstall'],
          ['Slow or dropping connection', 'Wrong regional gateway', 'Switch to nearest gateway in portal settings'],
          ['Certificate error', 'Outdated client version', 'Download the latest version from it.acmecorp.com/vpn'],
        ],
      },
      { type: 'callout', variant: 'info', text: 'Corporate Wi-Fi (AcmeCorp-Internal) automatically routes through the VPN. Do not run the VPN client manually while connected to office Wi-Fi.' },
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
  {
    id: 'it-003', projectId: 'it-kb', title: 'Printer Configuration for Remote Users',
    status: 'Draft', category: 'Hardware', author: 'Marcus Webb', team: 'IT Team',
    updatedAt: '2025-03-20', source: 'confluence',
    content: [
      { type: 'h2', text: 'Overview 🖨️' },
      { type: 'p', text: 'This guide covers adding network printers available in Acme Corp offices. Printers are added manually by IP address — they are not auto-discovered over the network.' },
      { type: 'h2', text: 'Office printers quick reference' },
      { type: 'table',
        headers: ['Office', 'Model', 'IP address', 'Driver name'],
        rows: [
          ['San Francisco (HQ)', 'HP LaserJet Pro M404', '10.1.4.10', 'HP LaserJet Pro M404'],
          ['New York', 'Canon imageRUNNER 1643', '10.2.4.10', 'Canon iR 1643'],
          ['London', 'Ricoh MP C4504', '192.168.10.52', 'Ricoh MP C4504'],
          ['Vancouver', 'Xerox VersaLink C405', '10.4.4.10', 'Xerox VersaLink C405'],
        ],
      },
      { type: 'callout', variant: 'warning', text: 'The London Ricoh MP C4504 moved to a new IP (192.168.10.52) in January 2026. If you set it up before then, delete the old printer and re-add it with the new address.' },
      { type: 'h2', text: 'Adding a printer on Mac' },
      { type: 'li', text: 'Open System Settings → Printers & Scanners, then click the + button.' },
      { type: 'li', text: 'Select "Add Printer or Scanner" and click the IP tab at the top of the dialog.' },
      { type: 'li', text: 'Protocol: IPP. Enter the IP address from the table above.' },
      { type: 'li', text: 'Leave Queue blank. Give the printer a recognisable name.' },
      { type: 'li', text: 'For Use / Driver, click "Select Software" and search for the driver name from the table.' },
      { type: 'image', alt: 'Mac Add Printer dialog showing IP tab with IPP protocol and address field filled in', caption: 'Use the IP tab in the Add Printer dialog. Select IPP as the protocol.' },
      { type: 'h2', text: 'Adding a printer on Windows' },
      { type: 'li', text: 'Open Settings → Bluetooth & devices → Printers & scanners → Add device.' },
      { type: 'li', text: 'If your printer does not appear, click "The printer that I want isn\'t listed."' },
      { type: 'li', text: 'Select "Add a printer using a TCP/IP address or hostname" and enter the IP from the table.' },
      { type: 'li', text: 'Windows will attempt to detect the driver automatically. If it fails, download the driver from the IT portal.' },
      { type: 'link', text: 'Download printer drivers from the IT portal' },
    ],
  },
  { id: 'it-004', projectId: 'it-kb', title: 'Software Installation Policy',             status: 'Archived',    category: 'Policy',          author: 'James Carter', team: 'IT Team',          content: [], updatedAt: '2024-11-01', source: 'internal'   },

  // HR — 3 synced from Slab, 1 internal
  {
    id: 'hr-001', projectId: 'hr-kb', title: 'Employee Benefits Overview',
    status: 'Published', category: 'Benefits', author: 'Priya Nair', team: 'HR Team',
    updatedAt: '2025-01-10', source: 'slab',
    content: [
      { type: 'h2', text: 'Overview 🌿' },
      { type: 'p', text: 'Acme Corp offers a comprehensive benefits package available to all full-time employees starting on their first day. Part-time employees working 20+ hours per week are eligible for medical and dental coverage.' },
      { type: 'h2', text: 'Medical plans' },
      { type: 'p', text: 'We offer three medical plan tiers through Aetna. The company covers 80% of the Premium plan premium for employees and 60% for dependents.' },
      { type: 'table',
        headers: ['Plan', 'Deductible', 'Out-of-pocket max', 'HSA eligible', 'Best for'],
        rows: [
          ['High Deductible (HDHP)', '$1,500 / $3,000 family', '$5,000 / $10,000', 'Yes', 'Healthy individuals, tax savings'],
          ['Select', '$500 / $1,000 family', '$3,000 / $6,000', 'No', 'Moderate healthcare needs'],
          ['Premium', '$200 / $400 family', '$1,500 / $3,000', 'No', 'Frequent medical visits, families'],
        ],
      },
      { type: 'h2', text: 'Dental & Vision' },
      { type: 'p', text: 'Dental coverage is through Cigna DPPO (effective April 1, 2026, replacing Delta Dental). Vision is through VSP. Both are fully employer-paid for employees; dependents can be added at cost.' },
      { type: 'callout', variant: 'warning', text: 'Dental network change effective April 1, 2026: Acme is switching from Delta Dental to Cigna DPPO. Check that your provider is in the Cigna network before scheduling appointments after April 1.' },
      { type: 'h2', text: '401(k) & Equity' },
      { type: 'li', text: '401(k) with 4% employer match, vesting immediately.' },
      { type: 'li', text: 'RSU grants for levels L4 and above, vesting over 4 years with a 1-year cliff.' },
      { type: 'h2', text: 'Additional perks' },
      { type: 'table',
        headers: ['Benefit', 'Amount', 'How to use'],
        rows: [
          ['Wellness stipend', '$500/year', 'Submit via Expensify, category: Wellness'],
          ['Learning & development', '$1,000/year', 'Submit via Expensify, category: L&D, manager approval required'],
          ['Parental leave', '16 weeks fully paid (primary), 8 weeks (secondary)', 'Request through Workday ≥ 30 days before start'],
          ['PTO', 'Unlimited (2-week min encouraged)', 'Request in Workday, manager approval'],
        ],
      },
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
      { type: 'h2', text: 'Leave types at a glance' },
      { type: 'table',
        headers: ['Leave type', 'Duration', 'Paid?', 'Approval required'],
        rows: [
          ['Parental (primary caregiver)', '16 weeks', 'Fully paid', 'Manager + HR'],
          ['Parental (secondary caregiver)', '8 weeks', 'Fully paid', 'Manager + HR'],
          ['Medical (FMLA)', 'Up to 12 weeks', 'Paid (STD after day 7)', 'Manager + HR + documentation'],
          ['Bereavement (immediate family)', '5 business days', 'Fully paid', 'Manager notification'],
          ['Bereavement (extended family)', '3 business days', 'Fully paid', 'Manager notification'],
          ['Personal leave', 'Up to 4 weeks', 'Unpaid', 'Manager + HR'],
        ],
      },
      { type: 'h2', text: 'How to submit a leave request' },
      { type: 'li', text: 'Log in to Workday and navigate to Time Off > Leave of Absence > Request Leave.' },
      { type: 'li', text: 'Select the leave type, enter start and end dates, and attach any supporting documentation required.' },
      { type: 'li', text: 'Your manager will be notified automatically. Leave exceeding 5 business days also routes to HR for review.' },
      { type: 'li', text: 'Approval SLA is 2 business days for standard requests and same-day for medical emergencies.' },
      { type: 'image', alt: 'Workday leave request form showing leave type dropdown and date fields', caption: 'Navigate to Time Off → Leave of Absence → Request Leave to submit your request.' },
      { type: 'callout', variant: 'info', text: 'Submit parental leave requests at least 30 days before your planned start date so HR can coordinate coverage and benefits continuity.' },
      { type: 'link', text: 'Open Workday to request leave' },
    ],
  },
  { id: 'hr-003', projectId: 'hr-kb', title: 'Performance Review Cycle FAQ',             status: 'Draft',       category: 'Performance',     author: 'Priya Nair',   team: 'HR Team',          content: [], updatedAt: '2025-03-05', source: 'slab'       },
  {
    id: 'hr-004', projectId: 'hr-kb', title: 'Expense Reimbursement Policy',
    status: 'Unpublished', category: 'Finance', author: 'Tom Reyes', team: 'HR Team',
    updatedAt: '2025-03-28', source: 'internal',
    content: [
      { type: 'h2', text: 'Overview 💳' },
      { type: 'p', text: 'This policy covers what expenses Acme Corp reimburses, how to submit claims, and the timelines involved. All reimbursements are processed via Expensify and paid out with the next payroll cycle.' },
      { type: 'h2', text: 'Expense categories and limits' },
      { type: 'table',
        headers: ['Category', 'Annual limit', 'Expensify category', 'Approval required'],
        rows: [
          ['Business travel', 'No cap (reasonable)', 'Travel', 'Manager (auto if < $500)'],
          ['Business meals', '$75/person', 'Meals & Entertainment', 'Manager'],
          ['Wellness stipend', '$500/year', 'Wellness', 'None (self-approve)'],
          ['Learning & development', '$1,000/year', 'Learning & Development', 'Manager'],
          ['Home office equipment', '$500/year', 'Home Office Equipment', 'None (auto if < $500)'],
          ['Phone/data (remote employees)', '$50/month', 'Phone & Internet', 'None (self-approve)'],
        ],
      },
      { type: 'h2', text: 'How to submit an expense' },
      { type: 'li', text: 'Open Expensify and create a new expense report.' },
      { type: 'li', text: 'Upload a photo of the receipt (required for all amounts over $25).' },
      { type: 'li', text: 'Select the correct category from the table above — this determines the approval routing.' },
      { type: 'li', text: 'Add a short business justification in the memo field.' },
      { type: 'li', text: 'Submit the report. You will receive an email confirmation when it is approved.' },
      { type: 'callout', variant: 'info', text: 'Submit expense reports within 30 days of purchase. Late submissions (30–90 days) require manager and Finance approval. Reports older than 90 days cannot be reimbursed.' },
      { type: 'h2', text: 'What is not reimbursable' },
      { type: 'li', text: 'Personal computing devices (laptops, phones) — covered separately by IT under the device program.' },
      { type: 'li', text: 'Software subscriptions not pre-approved by IT.' },
      { type: 'li', text: 'Alcohol (unless part of a client entertainment meal with prior approval).' },
      { type: 'li', text: 'Parking tickets, traffic fines, or other personal penalties.' },
      { type: 'link', text: 'Open Expensify to submit an expense' },
    ],
  },

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
// Maps ticket ID → learning ID (for tickets that are KB learning sources)
export const TICKET_LEARNING_MAP = {
  'TICKET-38': 'learn-it-002',
  'TICKET-42': 'learn-it-001',
  'TICKET-70': 'learn-it-001',
  'TICKET-19': 'learn-it-004',
  'TICKET-29': 'learn-it-003',
  'TICKET-33': 'learn-it-003',
  'TICKET-44': 'learn-it-003',
  'TICKET-11': 'learn-it-005',
  'TICKET-49': 'learn-hr-003',
  'TICKET-71': 'learn-hr-001',
  'TICKET-72': 'learn-hr-001',
  'TICKET-73': 'learn-hr-002',
  'TICKET-74': 'learn-hr-002',
};

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
