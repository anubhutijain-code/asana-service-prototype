// ─── Optimize / diagnostic gap data ───────────────────────────────────────────
// Surfaced for service managers to understand what's blocking resolution quality.
// Three buckets: content gaps, action gaps, data gaps.

export const OPTIMIZE_GAPS = {

  // Questions agents can't answer — no article or knowledge covers it
  content: [
    {
      id: 'c-001',
      gap: 'No guidance on MFA re-enrollment after device replacement',
      detail: 'Agents manually walk users through re-enrollment every time — no article exists. Affects hardware swap tickets disproportionately and adds 30+ minutes per case.',
      ticketCount: 8,
      impact: 'high',
      sourceTickets: [
        { id: 'TICKET-62', name: 'Report Lost Laptop for Patrick Tuckey' },
        { id: 'TICKET-67', name: 'Help Updating MacBook to Latest macOS' },
      ],
      suggestion: 'Create article: MFA Device Re-enrollment After Hardware Replacement',
      summary: 'Covers the step-by-step process to re-enroll MFA after a device swap — including Okta Verify, Microsoft Authenticator, and hardware token options. Includes what agents should tell users before the swap and what to do if the old device is unavailable.',
    },
    {
      id: 'c-002',
      gap: 'No documented process for access changes when an employee transfers teams',
      detail: 'Agents handle Salesforce and M365 transfer tickets ad hoc with no reference. No article explains what systems need updating, in what order, or who needs to sign off.',
      ticketCount: 5,
      impact: 'high',
      sourceTickets: [
        { id: 'TICKET-95', name: 'Salesforce Access Update — Department Transfer (Sarah Lee)' },
        { id: 'TICKET-69', name: 'Wrong Microsoft 365 License After Department Transfer' },
      ],
      suggestion: 'Create article: Access Changes Required When an Employee Transfers Teams',
      summary: 'Documents which systems require access updates on a team transfer (Salesforce, M365, Jira, Slack channels), the order of operations, required approvals, and who is responsible at each step. Includes a checklist agents can follow.',
    },
    {
      id: 'c-003',
      gap: 'VPN article doesn\'t cover split-tunnel configuration for AWS Workspaces',
      detail: 'Three tickets this week hit this exact gap. Agents are giving inconsistent advice and resolution times are 2–3× longer than standard WiFi tickets.',
      ticketCount: 3,
      impact: 'medium',
      sourceTickets: [
        { id: 'TICKET-65', name: 'Phone Not Connecting to WiFi in Vancouver Office' },
        { id: 'TICKET-63', name: 'Unable to Connect to WiFi After Troubleshooting' },
        { id: 'TICKET-60', name: 'Phone Unable to Connect to Office WiFi' },
      ],
      suggestion: 'Update VPN Setup Guide: add split-tunnel section for AWS Workspaces',
      summary: 'Adds a new section to the VPN Setup Guide covering split-tunnel configuration for AWS Workspaces on macOS and Windows. Includes network adapter settings, common error codes, and when to escalate to network ops.',
    },
  ],

  // Steps agents get stuck on — missing tools, access, or process
  action: [
    {
      id: 'a-001',
      gap: 'Agents can\'t unlock Okta accounts directly — every case requires escalation',
      detail: 'L1 agents lack Okta unlock permissions. Simple account locks that should resolve in under 5 minutes are escalated to L2, adding an average of 2+ hours to resolution.',
      ticketCount: 12,
      impact: 'high',
      sourceTickets: [
        { id: 'TICKET-95', name: 'Salesforce Access Update — Department Transfer (Sarah Lee)' },
        { id: 'TICKET-66', name: 'Urgent Request for SFDC License Access' },
      ],
      suggestion: 'Grant L1 agents read + unlock permission in Okta admin console',
      summary: 'L1 agents get read and unlock-only access in Okta — no ability to modify groups, reset MFA, or change user attributes. Covers the permission scope, approval process, and an audit log requirement for all unlock actions.',
      integrations: ['Okta'],
    },
    {
      id: 'a-002',
      gap: 'No automated path to update licenses after department transfers',
      detail: 'Agents manually chase HR for confirmation, then manually update licenses across systems. Each case takes 1–2 days that could be automated with an identity sync trigger on HR-confirmed org changes.',
      ticketCount: 5,
      impact: 'high',
      sourceTickets: [
        { id: 'TICKET-95', name: 'Salesforce Access Update — Department Transfer (Sarah Lee)' },
        { id: 'TICKET-69', name: 'Wrong Microsoft 365 License After Department Transfer' },
      ],
      suggestion: 'Automate: trigger license sync when HR marks a department change as confirmed',
      summary: 'When HR sets a transfer as confirmed in Workday, an automation triggers a license review across M365, Salesforce, and Jira. Agents receive a pre-filled update task with the recommended changes for one-click approval rather than manual lookup.',
      integrations: ['Workday', 'Microsoft 365', 'Salesforce', 'Jira'],
    },
    {
      id: 'a-003',
      gap: 'Payroll tickets landed in IT have no formal handoff path to HR',
      detail: 'Agents email HR or use an informal Slack channel. No routing rule exists, so there\'s no SLA, no audit trail, and no visibility into whether the handoff happened.',
      ticketCount: 4,
      impact: 'medium',
      sourceTickets: [
        { id: 'TICKET-68', name: 'Paycheck Short — Missing Overtime Pay for Feb' },
      ],
      suggestion: 'Add a formal HR Payroll routing rule to the IT intake workflow',
      summary: 'A routing rule automatically assigns payroll-category tickets to the HR queue with a 2-hour SLA, sends an acknowledgement to the requester, and creates a linked ticket in the HR system with full context from the original submission.',
      integrations: ['Workday'],
    },
  ],

  // AI deflections that received poor customer satisfaction ratings
  cx: [
    {
      id: 'cx-001',
      gap: 'AI gave generic password reset steps instead of Okta-specific flow',
      detail: 'When users reported Okta login failures, the AI responded with standard "reset your password" instructions. The Okta portal requires a different reset path, leaving users more confused than before. 9 of 11 users reopened or escalated the ticket.',
      cxScore: 2.3,
      ticketCount: 11,
      impact: 'high',
      sourceTickets: [
        { id: 'TICKET-95', name: 'Salesforce Access Update — Department Transfer (Sarah Lee)' },
        { id: 'TICKET-66', name: 'Urgent Request for SFDC License Access' },
      ],
      suggestion: 'Update the "Account Access" KB article with Okta-specific login and reset steps so the AI has accurate grounding for these requests.',
      summary: 'Revises the Account Access article to include Okta-specific login troubleshooting: the difference between a locked account and an expired password, the correct reset URL, and step-by-step MFA re-verification. This directly grounds the AI response for the most common failure pattern.',
    },
    {
      id: 'cx-002',
      gap: 'AI auto-closed tickets before the user confirmed resolution',
      detail: 'The deflection automation marks tickets as Resolved after sending a response, even when the user has not replied. Users found their ticket closed while the issue persisted, leading to frustrated re-opens and negative ratings.',
      cxScore: 1.8,
      ticketCount: 7,
      impact: 'high',
      sourceTickets: [
        { id: 'TICKET-63', name: 'Unable to Connect to WiFi After Troubleshooting' },
        { id: 'TICKET-60', name: 'Phone Unable to Connect to Office WiFi' },
      ],
      suggestion: 'Update the auto-close rule to require a confirmation reply from the user before setting status to Resolved.',
      summary: 'Changes the deflection automation to set status to "Pending user confirmation" after the AI response, with a 48-hour window for the user to confirm or reopen. Only moves to Resolved after a positive reply or expiry with no further activity.',
    },
    {
      id: 'cx-003',
      gap: 'AI escalated VPN split-tunnel requests to L2 when L1 could resolve',
      detail: 'Split-tunnel configuration was not included in the L1 scope definition, so the AI defaulted to L2 routing. Users waited 4–6 hours on issues resolvable in under 15 minutes. All 5 users rated the experience negatively.',
      cxScore: 2.7,
      ticketCount: 5,
      impact: 'medium',
      sourceTickets: [
        { id: 'TICKET-65', name: 'Phone Not Connecting to WiFi in Vancouver Office' },
        { id: 'TICKET-63', name: 'Unable to Connect to WiFi After Troubleshooting' },
      ],
      suggestion: 'Add split-tunnel VPN configuration to the L1 routing scope in the AI playbook so it stops escalating these unnecessarily.',
      summary: 'Updates the AI routing playbook to classify split-tunnel VPN requests as L1-resolvable. Adds a decision rule: if the ticket contains "split-tunnel" or "AWS Workspaces" and no hardware fault is mentioned, route to L1 with the VPN Setup Guide attached.',
    },
    {
      id: 'cx-004',
      gap: 'AI used standard IT language on payroll tickets — users felt unheard',
      detail: 'Payroll issues are high-stress. The AI responded with generic status messages ("Your ticket has been logged") rather than acknowledging urgency. Average time-to-human on payroll tickets was 3.2 hours.',
      cxScore: 2.1,
      ticketCount: 4,
      impact: 'medium',
      sourceTickets: [
        { id: 'TICKET-68', name: 'Paycheck Short — Missing Overtime Pay for Feb' },
      ],
      suggestion: 'Update the AI response template for payroll-category tickets to acknowledge urgency and escalate to a human within 30 minutes.',
      summary: 'Replaces the generic acknowledgement with a payroll-specific response that names the issue type, confirms it\'s been flagged as urgent, and sets a 30-minute human escalation timer. Removes AI self-resolution attempts for payroll — always routes to a human.',
    },
  ],

  // Tickets where missing data at intake delayed or blocked resolution
  data: [
    {
      id: 'd-001',
      gap: 'Hardware tickets submitted without device ID — agents send a follow-up before doing any work',
      detail: 'Device ID is required to look up warranty status and check specs. Without it, every hardware ticket starts with a round-trip to the requester, adding hours to time-to-first-action.',
      ticketCount: 6,
      impact: 'medium',
      sourceTickets: [
        { id: 'TICKET-67', name: 'Help Updating MacBook to Latest macOS' },
        { id: 'TICKET-62', name: 'Report Lost Laptop for Patrick Tuckey' },
      ],
      suggestion: 'Make Device ID a required field on the Hardware ticket intake form',
      summary: 'Adds Device ID as a mandatory field on the Hardware intake form with a helper link to "How to find your Device ID" for macOS, Windows, and iOS. Form cannot be submitted without it, eliminating the follow-up round-trip.',
    },
    {
      id: 'd-002',
      gap: 'Access requests missing department and current role — agents verify manually',
      detail: 'Without role context, agents can\'t confirm whether the requested access level is appropriate without a separate HR lookup or internal message. Adds 1–3 hours to access tickets.',
      ticketCount: 9,
      impact: 'high',
      sourceTickets: [
        { id: 'TICKET-66', name: 'Urgent Request for SFDC License Access' },
        { id: 'TICKET-64', name: 'Request View Access to Figma and FigJam' },
        { id: 'TICKET-53', name: 'Need access to Jira project for Q1 planning' },
      ],
      suggestion: 'Add Department and Current Role as required fields on the Access Request form',
      summary: 'Adds Department and Current Role as required fields, auto-populated from the HRIS where available. Agents can immediately validate whether the requested access level is appropriate without a separate HR lookup.',
    },
    {
      id: 'd-003',
      gap: 'Network tickets missing OS version and device type at intake',
      detail: 'Troubleshooting steps differ significantly between macOS, Windows, iOS, and Android. Without this upfront, agents give generic guidance and often need a follow-up to get the right information.',
      ticketCount: 5,
      impact: 'medium',
      sourceTickets: [
        { id: 'TICKET-65', name: 'Phone Not Connecting to WiFi in Vancouver Office' },
        { id: 'TICKET-60', name: 'Phone Unable to Connect to Office WiFi' },
      ],
      suggestion: 'Add OS Version and Device Type to the Network ticket intake form',
      summary: 'Adds OS Version and Device Type as required fields on the Network form, with dropdowns for common values. The intake form uses device type to pre-attach the relevant troubleshooting guide so agents start with the right context.',
    },
  ],
};
