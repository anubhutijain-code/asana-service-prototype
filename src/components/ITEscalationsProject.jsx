// ─── ITEscalationsProject — Project list view for IT Escalations Inbox ─────────
// Tasks created when service-mode agents escalate tickets requiring cross-team
// investigation. Source ticket closes; task carries full context.

import { useState } from 'react';
import Toolbar from './Toolbar';
import BasicTaskView from './BasicTaskView';
import RightPanelOverlay from './RightPanelOverlay';
import { SFT, SFD, LIGA } from '../constants/typography';

// ── Placeholder data ───────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'new',
    label: 'Inbox',
    tasks: [
      {
        id: 'ESC-001',
        name: 'Contractor fleet not enrolled in MDM: 43 unmanaged devices with production access',
        ticket: 'IT-4917', assignee: null,
        reporter: { name: 'David Park', bg: '#4573D2', dept: 'Security' },
        escalatedBy: { name: 'Jordan Ellis', bg: '#F1BD6C' },
        escalationType: 'Access',
        dueDate: null, dueDateColor: 'var(--text-weak)', status: 'Needs review', priority: 'High',
        description: 'Q1 security audit found 43 contractor MacBooks never enrolled in Jamf Pro. Devices run outdated macOS versions with no endpoint protection, yet hold active Okta sessions with access to GitHub, Slack, and GCP production environments. Resolving this requires coordinating a new device trust policy, contractor manager notifications, and an updated onboarding runbook. Estimated 2-3 weeks across IT, Security, and HR.',
        nextSteps: [
          'Work with Security to draft an Okta device trust policy that blocks unmanaged devices from production apps. Target enforcement date: Mar 28',
          'Coordinate with HR and Procurement to notify contractor managers: devices must enroll in Jamf within 5 business days or access will be suspended',
          'Author a contractor MDM onboarding runbook and get IT leadership sign-off before enforcement begins',
        ],
      },
      {
        id: 'ESC-002',
        name: 'Okta to Snowflake SCIM sync broken since Dec 15: 18 former employees retain warehouse access',
        ticket: 'IT-4851', assignee: null,
        reporter: { name: 'Lisa Nakamura', bg: '#4ECBC4', dept: 'Data Platform' },
        escalatedBy: { name: 'Riya Desai', bg: '#B3DF97' },
        escalationType: 'Access',
        dueDate: null, dueDateColor: 'var(--text-weak)', status: 'Needs review', priority: 'Critical',
        description: 'SCIM deprovisioning between Okta and Snowflake silently broke during the December IdP migration. 18 terminated employees still have read/write access to finance, revenue, and customer datasets. Compliance has been notified. Manual removal is a short-term patch; the SCIM integration must be rebuilt, and Snowflake needs to be added to the formal quarterly access review process. Estimated 3-4 weeks with Data Platform and Security involvement.',
        nextSteps: [
          'Data Platform to manually revoke all 18 accounts today and confirm removal to Compliance in writing',
          'Run architecture review with Data Platform lead: SCIM rebuild vs. Terraform-managed roles vs. Okta SAML groups. Document recommendation and get sign-off',
          'Implement approved provisioning approach; add Snowflake to quarterly access review scope in Vanta by end of Q1',
        ],
      },
      {
        id: 'ESC-003',
        name: 'Shadow AI usage: 29 employees sending company data to personal ChatGPT and Claude accounts',
        ticket: 'IT-4783', assignee: null,
        reporter: { name: 'Rachel Kim', bg: '#F06A6A', dept: 'Legal' },
        escalatedBy: { name: 'Jordan Ellis', bg: '#F1BD6C' },
        escalationType: 'Software',
        dueDate: null, dueDateColor: 'var(--text-weak)', status: 'Needs review', priority: 'High',
        description: 'A 60-day DLP scan flagged 29 employees copying customer PII and internal financial projections into personal ChatGPT and Claude.ai accounts. No approved enterprise AI tool exists, leaving the company exposed. Legal requires a formal AI acceptable-use policy before this can be closed. Full remediation involves Legal, IT, Security (Zscaler), and L&D. Estimated 2-3 weeks.',
        nextSteps: [
          'Legal and IT to co-draft an AI acceptable-use policy covering approved tools (Claude for Work, Microsoft Copilot), data classification rules, and consequences. Target draft by Mar 17',
          'Zscaler team to immediately block consumer AI endpoints (chat.openai.com, claude.ai) on all corporate devices pending policy rollout',
          'Coordinate company-wide training session with L&D; tie completion to policy enforcement go-live date',
        ],
      },
    ],
  },
  {
    id: 'investigating',
    label: 'Under Investigation',
    tasks: [
      {
        id: 'ESC-004',
        name: 'Legacy Cisco AnyConnect conflicts blocking Zscaler ZIA rollout at Austin, London, Singapore',
        ticket: 'IT-4902', assignee: { name: 'Marcus Rivera', bg: '#4ECBC4' },
        reporter: { name: 'Tom Bradley', bg: '#8D84E8', dept: 'IT Infrastructure' },
        escalatedBy: { name: 'Marcus Rivera', bg: '#4ECBC4' },
        escalationType: 'Network',
        dueDate: 'Mar 28', dueDateColor: 'var(--text-weak)', status: 'In progress', priority: 'High',
        description: 'The Zscaler ZIA rollout is stalled at three regional offices (~180 users) due to split-tunnel conflicts between legacy Cisco AnyConnect configurations and ZIA\'s DNS interception layer. Network team has mapped 14 conflicting routes. Resolution requires coordinating change windows with Cisco TAC, Zscaler professional services, and local ISPs. London and Singapore circuits have a 4-week lead time for changes.',
        nextSteps: [
          'Engage Zscaler TAM for a per-office migration guide; schedule Cisco TAC session to reconfigure split-tunnel policy without breaking existing connectivity',
          'Initiate ISP circuit change requests for London and Singapore immediately given 4-week lead time; Austin can be done in-house',
          'Draft user communication plan for the 180 affected employees; schedule change windows to minimize business-hours disruption',
        ],
      },
      {
        id: 'ESC-005',
        name: 'GitHub Actions self-hosted runner pool exhausted: 12+ hour CI queue blocking all of Engineering',
        ticket: 'IT-4869', assignee: { name: 'Ajeet Cyrus', bg: '#4573D2' },
        reporter: { name: 'Priya Kapoor', bg: '#F1BD6C', dept: 'Engineering' },
        escalatedBy: { name: 'Ajeet Cyrus', bg: '#4573D2' },
        escalationType: 'Software',
        dueDate: 'Mar 18', dueDateColor: 'var(--danger-text)', status: 'Blocked', priority: 'Critical',
        description: 'The self-hosted GitHub Actions runner pool (32 EC2 instances) hit capacity after the monorepo migration completed last week. CI queue times now average 12+ hours and Engineering has soft-frozen merges. Scaling the fleet requires VP Finance approval for ~$8k/mo additional EC2 spend, plus designing and owning a new auto-scaling runner architecture. Currently blocked on Finance sign-off.',
        nextSteps: [
          'Present cost-benefit analysis to VP Finance: $8k/mo vs. estimated $40k/mo lost engineering productivity. Target approval by Mar 14',
          'Design auto-scaling runner architecture: 8–64 runners on demand using EC2 Spot instances with on-demand fallback; target 70% cost reduction vs. static fleet',
          'Build new hardened runner AMI, implement auto-scaling policy, and document IT runbook for ongoing ownership',
        ],
      },
    ],
  },
  {
    id: 'resolved',
    label: 'Resolved',
    tasks: [
      {
        id: 'ESC-006',
        name: 'SaaS identity sprawl: 47 orphaned admin accounts removed across 12 tools',
        ticket: 'IT-4721', assignee: { name: 'Zoe Wong', bg: '#5DA283' },
        reporter: { name: 'Marcus Webb', bg: '#F06A6A', dept: 'Revenue Ops' },
        escalatedBy: { name: 'Zoe Wong', bg: '#5DA283' },
        escalationType: 'Access',
        dueDate: 'Mar 5', dueDateColor: 'var(--success-text)', status: 'Resolved', priority: 'Medium',
        description: 'Annual SaaS audit found 47 accounts with admin-level access in Salesforce, HubSpot, Looker, Mixpanel, and 8 other tools belonging to employees who left over 12 months ago. No SCIM integration existed for these tools and manual offboarding had missed them. Resolution required 3 weeks of coordination with 12 tool admins, legal sign-off on data access logs, and removal of all accounts.',
        nextSteps: [
          '✓ All 47 accounts deactivated and removal documented for legal records',
          '✓ Quarterly SaaS access review workflow created and added to IT calendar (next review: June 1)',
          'SCIM integrations for HubSpot and Looker scoped and scheduled for Q2 to prevent recurrence',
        ],
      },
    ],
  },
];

const TOTAL_TASKS = SECTIONS.reduce((n, s) => n + s.tasks.length, 0);

const STATUS_STYLE = {
  'Needs review': { bg: 'var(--warning-background)',  color: 'var(--warning-text)'  },
  'In progress':  { bg: 'var(--selected-background)', color: 'var(--selected-text)' },
  'Blocked':      { bg: 'var(--danger-background)',   color: 'var(--danger-text)'   },
  'Resolved':     { bg: 'var(--success-background)',  color: 'var(--success-text)'  },
};

const ESCALATION_TYPE_STYLE = {
  Hardware: { bg: 'var(--warning-background)',  color: 'var(--warning-text)'  },
  Software: { bg: 'var(--priority-medium-bg)',  color: 'var(--priority-medium-text)' },
  Access:   { bg: 'var(--selected-background)', color: 'var(--selected-text)' },
  Network:  { bg: 'var(--danger-background)',   color: 'var(--danger-text)'   },
};

const PRIORITY_STYLE = {
  Critical: { bg: 'var(--priority-critical-bg)', color: 'var(--priority-critical-text)' },
  High:     { bg: 'var(--priority-high-bg)',     color: 'var(--priority-high-text)'     },
  Medium:   { bg: 'var(--priority-medium-bg)',   color: 'var(--priority-medium-text)'   },
  Low:      { bg: 'var(--priority-low-bg)',      color: 'var(--priority-low-text)'      },
};

const TEAM = [
  { name: 'Jordan Ellis',  bg: '#F1BD6C' },
  { name: 'Riya Desai',    bg: '#B3DF97' },
  { name: 'Marcus Rivera', bg: '#4ECBC4' },
  { name: 'Ajeet Cyrus',   bg: '#4573D2' },
];

// ── Real icons from icon library ──────────────────────────────────────────────

// Icon (16px).svg — star
function StarIcon({ style }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M4.09998 15C3.89998 15 3.74998 14.95 3.59998 14.85C3.34998 14.65 3.19998 14.35 3.24998 14L3.89998 10.1L1.04998 7.35C0.799984 7.1 0.749984 6.75 0.849984 6.45C0.949984 6.15 1.19998 5.9 1.54998 5.85L5.44998 5.3L7.19998 1.75C7.34998 1.45 7.64998 1.25 7.99998 1.25C8.34998 1.25 8.64998 1.45 8.79998 1.75L10.55 5.3L14.45 5.85C14.8 5.9 15.05 6.15 15.15 6.45C15.25 6.75 15.15 7.1 14.95 7.35L12.1 10.1L12.75 14C12.8 14.35 12.65 14.65 12.4 14.85C12.15 15.05 11.8 15.05 11.5 14.9L7.99998 13.05L4.49998 14.9C4.39998 15 4.24998 15 4.09998 15ZM7.99998 11.95L11.75 13.9L11.05 9.75L14.1 6.8L9.89998 6.2L7.99998 2.4L6.14998 6.2L1.94998 6.8L4.99998 9.75L4.29998 13.9L7.99998 11.95Z" fill="currentColor"/>
    </svg>
  );
}

// Icon (12px).svg — status dot (green circle)
function StatusDot() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10 6C10 8.21 8.21 10 6 10C3.79 10 2 8.21 2 6C2 3.79 3.79 2 6 2C8.21 2 10 3.79 10 6Z" fill="var(--success-text)"/>
    </svg>
  );
}

// Icon (16px)-1.svg — chevron down
function ChevronDownIcon({ style }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <path d="M7.99999 11.25C7.84999 11.25 7.64999 11.2 7.54999 11.1L2.04999 6.59999C1.74999 6.34999 1.69999 5.84999 1.94999 5.54999C2.19999 5.24999 2.69999 5.19999 2.99999 5.44999L7.99999 9.54999L13 5.44999C13.3 5.19999 13.8 5.24999 14.05 5.54999C14.3 5.84999 14.25 6.34999 13.95 6.59999L8.44999 11.1C8.34999 11.2 8.14999 11.25 7.99999 11.25Z" fill="currentColor"/>
    </svg>
  );
}

// LockFillMiniIcon (12px).svg — used in Share button
function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10 5H9V3C9 1.35 7.65 0 6 0C4.35 0 3 1.35 3 3V5H2C1.45 5 1 5.45 1 6V10C1 10.55 1.45 11 2 11H10C10.55 11 11 10.55 11 10V6C11 5.45 10.55 5 10 5ZM4.5 3C4.5 2.15 5.15 1.5 6 1.5C6.85 1.5 7.5 2.15 7.5 3V5H4.5V3Z" fill="currentColor"/>
    </svg>
  );
}

// Frame 6300756.svg — customize icon (4-color grid)
function CustomizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" fill="#F06A6A"/>
      <rect x="2" y="9" width="5" height="5" rx="1" fill="#5DA283"/>
      <rect x="9" y="2" width="5" height="5" rx="1" fill="#F1BD6C"/>
      <rect x="9.5" y="9.5" width="4" height="4" rx="0.5" stroke="var(--selected-background-strong)"/>
    </svg>
  );
}

// PlusIcon (16px).svg
function PlusIcon({ color = 'var(--icon)' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M7.99902 2C7.73381 2 7.47945 2.10536 7.29192 2.29289C7.10438 2.48043 6.99902 2.73478 6.99902 3V7H2.99902C2.73381 7 2.47945 7.10536 2.29192 7.29289C2.10438 7.48043 1.99902 7.73478 1.99902 8C1.99902 8.26522 2.10438 8.51957 2.29192 8.70711C2.47945 8.89464 2.73381 9 2.99902 9H6.99902V13C6.99902 13.2652 7.10438 13.5196 7.29192 13.7071C7.47945 13.8946 7.73381 14 7.99902 14C8.26424 14 8.51859 13.8946 8.70613 13.7071C8.89367 13.5196 8.99902 13.2652 8.99902 13V9H12.999C13.2642 9 13.5186 8.89464 13.7061 8.70711C13.8937 8.51957 13.999 8.26522 13.999 8C13.999 7.73478 13.8937 7.48043 13.7061 7.29289C13.5186 7.10536 13.2642 7 12.999 7H8.99902V3C8.99902 2.73478 8.89367 2.48043 8.70613 2.29289C8.51859 2.10536 8.26424 2 7.99902 2Z" fill={color}/>
    </svg>
  );
}

// Vector 2.svg — breadcrumb slash separator
function BreadcrumbSep() {
  return (
    <svg width="5" height="11" viewBox="0 0 5 11" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.46423 0.185699L0.464233 10.1857" stroke="var(--icon)"/>
    </svg>
  );
}

// Tab icons — real icon paths from icon library
function TabIcon({ tab }) {
  if (tab === 'Overview') return (
    // ProjectMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M0.999512 10C0.999512 11.103 1.89651 12 2.99951 12H8.99951C10.1025 12 10.9995 11.103 10.9995 10V3C10.9995 1.897 10.1025 1 8.99951 1H7.99951C7.99951 0.4485 7.55051 0 6.99951 0H4.99951C4.44801 0 3.99951 0.4485 3.99951 1H2.99951C1.89651 1 0.999512 1.897 0.999512 3V10ZM4.99951 1H6.99951V2H4.99951V1ZM1.99951 3C1.99951 2.4485 2.44801 2 2.99951 2H3.99951C3.99951 2.5515 4.44801 3 4.99951 3H6.99951C7.55051 3 7.99951 2.5515 7.99951 2H8.99951C9.55101 2 9.99951 2.4485 9.99951 3V10C9.99951 10.5515 9.55101 11 8.99951 11H2.99951C2.44801 11 1.99951 10.5515 1.99951 10V3ZM5.74951 5.5C5.74951 5.36739 5.80219 5.24021 5.89596 5.14645C5.98973 5.05268 6.1169 5 6.24951 5H7.99951C8.13212 5 8.2593 5.05268 8.35307 5.14645C8.44683 5.24021 8.49951 5.36739 8.49951 5.5C8.49951 5.63261 8.44683 5.75979 8.35307 5.85355C8.2593 5.94732 8.13212 6 7.99951 6H6.24951C6.1169 6 5.98973 5.94732 5.89596 5.85355C5.80219 5.75979 5.74951 5.63261 5.74951 5.5ZM5.74951 7.5C5.74951 7.36739 5.80219 7.24021 5.89596 7.14645C5.98973 7.05268 6.1169 7 6.24951 7H7.99951C8.13212 7 8.2593 7.05268 8.35307 7.14645C8.44683 7.24021 8.49951 7.36739 8.49951 7.5C8.49951 7.63261 8.44683 7.75979 8.35307 7.85355C8.2593 7.94732 8.13212 8 7.99951 8H6.24951C6.1169 8 5.98973 7.94732 5.89596 7.85355C5.80219 7.75979 5.74951 7.63261 5.74951 7.5ZM3.49951 5.5C3.49954 5.40151 3.51898 5.30399 3.5567 5.21301C3.59442 5.12203 3.64969 5.03936 3.71936 4.96974C3.78903 4.90012 3.87172 4.84491 3.96273 4.80724C4.05374 4.76958 4.15127 4.75022 4.24976 4.75025C4.44532 4.75032 4.62312 4.82676 4.76313 4.9633C4.90314 5.09983 4.9844 5.28564 4.98951 5.5C4.98954 5.59849 4.97018 5.69601 4.93252 5.787C4.89486 5.87799 4.83964 5.96024 4.77002 6.0299C4.7004 6.09957 4.61774 6.15484 4.52676 6.19256C4.43577 6.23028 4.33825 6.24972 4.23976 6.24975C4.14127 6.24978 4.04374 6.23049 3.95273 6.19283C3.86172 6.15517 3.77902 6.09998 3.70936 6.03038C3.6397 5.96078 3.58444 5.87813 3.5467 5.78716C3.50896 5.69618 3.4895 5.59865 3.48948 5.50016L3.49951 5.5ZM3.49951 7.5C3.49954 7.40151 3.51898 7.30399 3.5567 7.21301C3.59442 7.12203 3.64969 7.03936 3.71936 6.96974C3.78903 6.90012 3.87172 6.84491 3.96273 6.80724C4.05374 6.76958 4.15127 6.75022 4.24976 6.75025C4.44532 6.75032 4.62312 6.82676 4.76313 6.9633C4.90314 7.09983 4.9844 7.28564 4.98951 7.5C4.98954 7.59849 4.97018 7.69601 4.93252 7.787C4.89486 7.87799 4.83964 7.96024 4.77002 8.0299C4.7004 8.09957 4.61774 8.15484 4.52676 8.19256C4.43577 8.23028 4.33825 8.24972 4.23976 8.24975C4.04419 8.24969 3.85637 8.17325 3.71636 8.03671C3.57635 7.90017 3.4951 7.71435 3.49001 7.5H3.49951Z" fill="currentColor"/>
    </svg>
  );
  if (tab === 'List') return (
    // ViewListMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 1H1.5C0.673 1 0 1.673 0 2.5V3.5C0 4.327 0.673 5 1.5 5H2.5C3.327 5 4 4.327 4 3.5V2.5C4 1.673 3.327 1 2.5 1ZM3 3.5C3 3.7755 2.776 4 2.5 4H1.5C1.224 4 1 3.7755 1 3.5V2.5C1 2.2245 1.224 2 1.5 2H2.5C2.776 2 3 2.2245 3 2.5V3.5ZM2.5 7H1.5C0.673 7 0 7.673 0 8.5V9.5C0 10.327 0.673 11 1.5 11H2.5C3.327 11 4 10.327 4 9.5V8.5C4 7.673 3.327 7 2.5 7ZM3 9.5C3 9.7755 2.776 10 2.5 10H1.5C1.224 10 1 9.7755 1 9.5V8.5C1 8.2245 1.224 8 1.5 8H2.5C2.776 8 3 8.2245 3 8.5V9.5ZM5 3C5 2.86739 5.05268 2.74021 5.14645 2.64645C5.24021 2.55268 5.36739 2.5 5.5 2.5H11.5C11.6326 2.5 11.7598 2.55268 11.8536 2.64645C11.9473 2.74021 12 2.86739 12 3C12 3.13261 11.9473 3.25979 11.8536 3.35355C11.7598 3.44732 11.6326 3.5 11.5 3.5H5.5C5.36739 3.5 5.24021 3.44732 5.14645 3.35355C5.05268 3.25979 5 3.13261 5 3ZM12 9C12 9.13261 11.9473 9.25979 11.8536 9.35355C11.7598 9.44732 11.6326 9.5 11.5 9.5H5.5C5.36739 9.5 5.24021 9.44732 5.14645 9.35355C5.05268 9.25979 5 9.13261 5 9C5 8.86739 5.05268 8.74021 5.14645 8.64645C5.24021 8.55268 5.36739 8.5 5.5 8.5H11.5C11.6326 8.5 11.7598 8.55268 11.8536 8.64645C11.9473 8.74021 12 8.86739 12 9Z" fill="currentColor"/>
    </svg>
  );
  if (tab === 'Board') return (
    // BoardMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10.5 1H1.5C0.673 1 0 1.673 0 2.5V7.5C0 8.327 0.673 9 1.5 9H3.5V9.5C3.5 10.327 4.173 11 5 11H7C7.827 11 8.5 10.327 8.5 9.5V8H10.5C11.327 8 12 7.327 12 6.5V2.5C12 1.673 11.327 1 10.5 1ZM3.5 8H1.5C1.2245 8 1 7.7755 1 7.5V2.5C1 2.2245 1.2245 2 1.5 2H3.5V8ZM7.5 9.5C7.5 9.7755 7.2755 10 7 10H5C4.7245 10 4.5 9.7755 4.5 9.5V2H7.5V9.5ZM11 6.5C11 6.7755 10.7755 7 10.5 7H8.5V2H10.5C10.7755 2 11 2.2245 11 2.5V6.5Z" fill="currentColor"/>
    </svg>
  );
  if (tab === 'Timeline') return (
    // TimelineMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 4V5H1.5C0.673 5 0 4.327 0 3.5V2.5C0 1.673 0.673 1 1.5 1H5V2H1.5C1.224 2 1 2.2245 1 2.5V3.5C1 3.775 1.224 4 1.5 4H5ZM3.5 10C3.224 10 3 9.775 3 9.5V8.5C3 8.2245 3.224 8 3.5 8H5V7H3.5C2.673 7 2 7.673 2 8.5V9.5C2 10.327 2.673 11 3.5 11H5V10H3.5ZM12 8.5V9.5C12 10.327 11.327 11 10.5 11H7V11.5C7 11.6326 6.94732 11.7598 6.85355 11.8536C6.75979 11.9473 6.63261 12 6.5 12C6.36739 12 6.24021 11.9473 6.14645 11.8536C6.05268 11.7598 6 11.6326 6 11.5V0.5C6 0.367392 6.05268 0.240215 6.14645 0.146447C6.24021 0.0526784 6.36739 0 6.5 0C6.63261 0 6.75979 0.0526784 6.85355 0.146447C6.94732 0.240215 7 0.367392 7 0.5V1H8.5C9.327 1 10 1.673 10 2.5V3.5C10 4.327 9.327 5 8.5 5H7V7H10.5C11.327 7 12 7.673 12 8.5ZM7 4H8.5C8.776 4 9 3.775 9 3.5V2.5C9 2.2245 8.776 2 8.5 2H7V4ZM11 8.5C11 8.2245 10.776 8 10.5 8H7V10H10.5C10.776 10 11 9.775 11 9.5V8.5Z" fill="currentColor"/>
    </svg>
  );
  if (tab === 'Calendar') return (
    // CalendarMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9.49902 1H8.99902V0.5C8.99902 0.367392 8.94635 0.240215 8.85258 0.146447C8.75881 0.0526784 8.63163 0 8.49902 0C8.36642 0 8.23924 0.0526784 8.14547 0.146447C8.0517 0.240215 7.99902 0.367392 7.99902 0.5V1H3.99902V0.5C3.99902 0.367392 3.94634 0.240215 3.85258 0.146447C3.75881 0.0526784 3.63163 0 3.49902 0C3.36642 0 3.23924 0.0526784 3.14547 0.146447C3.0517 0.240215 2.99902 0.367392 2.99902 0.5V1H2.49902C1.12052 1 -0.000976562 2.1215 -0.000976562 3.5V9.5C-0.000976562 10.8785 1.12052 12 2.49902 12H9.49902C10.8775 12 11.999 10.8785 11.999 9.5V3.5C11.999 2.1215 10.8775 1 9.49902 1ZM10.999 9.5C10.999 10.327 10.326 11 9.49902 11H2.49902C1.67202 11 0.999023 10.327 0.999023 9.5V5H10.999V9.5ZM10.999 4H0.999023V3.5C0.999023 2.673 1.67202 2 2.49902 2H2.99902V2.5C2.99902 2.63261 3.0517 2.75979 3.14547 2.85355C3.23924 2.94732 3.36642 3 3.49902 3C3.63163 3 3.75881 2.94732 3.85258 2.85355C3.94634 2.75979 3.99902 2.63261 3.99902 2.5V2H7.99902V2.5C7.99902 2.63261 8.0517 2.75979 8.14547 2.85355C8.23924 2.94732 8.36642 3 8.49902 3C8.63163 3 8.75881 2.94732 8.85258 2.85355C8.94635 2.75979 8.99902 2.63261 8.99902 2.5V2H9.49902C10.326 2 10.999 2.673 10.999 3.5V4Z" fill="currentColor"/>
    </svg>
  );
  if (tab === 'Dashboard') return (
    // ReportsMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9.99897 0.0599976C9.4835 0.0606593 8.98935 0.265754 8.62491 0.63029C8.26046 0.994825 8.0555 1.48903 8.05497 2.0045C8.05497 2.6405 8.36697 3.2015 8.83997 3.5565L8.22947 5.0835C8.15297 5.0745 8.07847 5.0605 7.99947 5.0605C7.72488 5.06133 7.45362 5.12067 7.20377 5.23456C6.95392 5.34845 6.7312 5.51428 6.55047 5.721L5.90397 5.3975C5.96213 5.11466 5.95663 4.82243 5.88785 4.54198C5.81907 4.26154 5.68874 3.99991 5.50632 3.77608C5.32389 3.55225 5.09394 3.37182 4.83314 3.24788C4.57234 3.12394 4.28722 3.05959 3.99847 3.0595C3.48283 3.06003 2.98847 3.26513 2.62391 3.62979C2.25934 3.99445 2.05436 4.48886 2.05397 5.0045C2.05397 5.6405 2.36597 6.2015 2.83897 6.5565L2.22847 8.0835C2.15197 8.0745 2.07747 8.0605 1.99847 8.0605C1.48283 8.06089 0.988417 8.26587 0.623759 8.63044C0.259102 8.995 0.0539965 9.48936 0.0534668 10.005C0.0539965 10.5206 0.259102 11.015 0.623759 11.3796C0.988417 11.7441 1.48283 11.9491 1.99847 11.9495C2.51414 11.9491 3.00858 11.744 3.37317 11.3794C3.73777 11.0147 3.9427 10.5202 3.94297 10.0045C3.94208 9.70253 3.87064 9.40495 3.73435 9.13549C3.59805 8.86603 3.40068 8.63215 3.15797 8.4525L3.76847 6.9255C3.84497 6.9345 3.91997 6.9485 3.99847 6.9485C4.2731 6.94783 4.54444 6.88862 4.79439 6.77481C5.04434 6.661 5.26715 6.49521 5.44797 6.2885L6.09397 6.6115C5.97799 7.17425 6.07962 7.74635 6.49191 8.23219C6.67426 8.45593 6.90407 8.63632 7.16472 8.7603C7.42538 8.88427 7.71033 8.94873 7.99897 8.949C8.51456 8.9486 9.00892 8.74361 9.3735 8.37903C9.73808 8.01445 9.94307 7.52009 9.94347 7.0045C9.94258 6.70253 9.87114 6.40495 9.73485 6.13549C9.59855 5.86603 9.40118 5.63215 9.15847 5.4525L9.76947 3.9255C9.84597 3.9345 9.91997 3.9485 9.99947 3.9485C10.5148 3.94784 11.0089 3.74281 11.3734 3.37838C11.7378 3.01396 11.9428 2.51988 11.9435 2.0045C11.9429 1.48886 11.7378 0.994501 11.3732 0.629937C11.0085 0.265373 10.5146 0.0603946 9.99897 0.0599976ZM1.99897 11.06C1.71929 11.0595 1.45123 10.9481 1.25355 10.7502C1.05588 10.5523 0.944731 10.2842 0.944467 10.0045C0.944467 9.4225 1.41797 8.949 1.99947 8.949C2.58197 8.949 3.05497 9.4225 3.05497 10.0045C3.0547 10.2843 2.94348 10.5525 2.7457 10.7504C2.54792 10.9483 2.27973 11.0596 1.99997 11.06H1.99897ZM3.99897 6.06C3.71929 6.05947 3.45123 5.94806 3.25355 5.7502C3.05588 5.55234 2.94473 5.28418 2.94447 5.0045C2.94447 4.4225 3.41797 3.949 3.99947 3.949C4.58197 3.949 5.05547 4.4225 5.05547 5.0045C5.0552 5.28435 4.94391 5.55267 4.74603 5.75056C4.54814 5.94844 4.27982 6.05973 3.99997 6.06H3.99897ZM7.99897 8.06C7.71929 8.05947 7.45123 7.94806 7.25355 7.7502C7.05588 7.55234 6.94473 7.28418 6.94447 7.0045C6.94447 6.4225 7.41797 5.949 7.99947 5.949C8.58197 5.949 9.05547 6.4225 9.05547 7.0045C9.0552 7.28435 8.94391 7.55267 8.74603 7.75056C8.54814 7.94844 8.27982 8.05973 7.99997 8.06H7.99897ZM9.99897 3.06C9.71929 3.05947 9.45122 2.94806 9.25355 2.7502C9.05588 2.55235 8.94473 2.28418 8.94447 2.0045C8.94447 1.4225 9.41747 0.948998 9.99947 0.948998C10.582 0.948998 11.055 1.4225 11.055 2.0045C11.0547 2.28427 10.9435 2.55251 10.7457 2.75038C10.5479 2.94825 10.2797 3.0596 9.99997 3.06H9.99897Z" fill="currentColor"/>
    </svg>
  );
  if (tab === 'Messages') return (
    // CommentMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 11C9.757 11 12 8.757 12 6C12 3.243 9.757 1 7 1H5C2.243 1 0 3.243 0 6C-0.000227741 6.73922 0.163574 7.46929 0.479594 8.13756C0.795615 8.80583 1.25598 9.39565 1.8275 9.8645L2.01 11.1415C2.03621 11.3253 2.11308 11.4982 2.23199 11.6408C2.35089 11.7833 2.50715 11.89 2.68325 11.9488C2.85935 12.0076 3.04835 12.0162 3.22907 11.9737C3.4098 11.9312 3.57511 11.8392 3.7065 11.708L4.415 11.0015L7.0005 11H7ZM4 10.0025L3 11L2.759 9.313C2.04991 8.83326 1.51345 8.13867 1.2285 7.33135C0.943546 6.52403 0.925137 5.64659 1.17598 4.82803C1.42682 4.00947 1.93367 3.29299 2.62201 2.78393C3.31036 2.27487 4.14387 2.00009 5 2H7C8.06087 2 9.07828 2.42143 9.82843 3.17157C10.5786 3.92172 11 4.93913 11 6C11 7.06087 10.5786 8.07828 9.82843 8.82843C9.07828 9.57857 8.06087 10 7 10L4 10.0025Z" fill="currentColor"/>
    </svg>
  );
  if (tab === 'Files') return (
    // AttachVerticalMiniIcon (12px)
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 0C3.7945 0 2 1.7945 2 4V6.5C2 6.63261 2.05268 6.75979 2.14645 6.85355C2.24021 6.94732 2.36739 7 2.5 7C2.63261 7 2.75979 6.94732 2.85355 6.85355C2.94732 6.75979 3 6.63261 3 6.5V4C3 2.3455 4.3455 1 6 1C7.6545 1 9 2.3455 9 4V9C9 10.103 8.103 11 7 11C5.897 11 5 10.103 5 9V4C5 3.4485 5.4485 3 6 3C6.5515 3 7 3.4485 7 4V8.427C7 8.55961 7.05268 8.68679 7.14645 8.78055C7.24021 8.87432 7.36739 8.927 7.5 8.927C7.63261 8.927 7.75979 8.87432 7.85355 8.78055C7.94732 8.68679 8 8.55961 8 8.427V4C8 2.897 7.103 2 6 2C4.897 2 4 2.897 4 4V9C4 10.6545 5.3455 12 7 12C8.6545 12 10 10.6545 10 9V4C10 1.7945 8.2055 0 6 0Z" fill="currentColor"/>
    </svg>
  );
  return null;
}

// ── Primitives ────────────────────────────────────────────────────────────────

function Avi({ name, size = 24, bg = 'var(--icon)', border = false }) {
  const ini = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, border: border ? '2px solid var(--surface)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.37), fontWeight: 700, color: 'white', flexShrink: 0, fontFamily: SFT, letterSpacing: '0.02em', boxSizing: 'border-box' }}>
      {ini}
    </div>
  );
}

function Checkbox({ done, onToggle }) {
  return (
    <button type="button" onClick={onToggle} style={{ flexShrink: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16 }}>
      {done ? (
        /* TaskCompletionCompoundIcon — filled green circle + white checkmark */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clipPath="url(#tcc)">
            <path d="M15.5 8C15.5 12.15 12.15 15.5 8 15.5C3.85 15.5 0.5 12.15 0.5 8C0.5 3.85 3.85 0.5 8 0.5C12.15 0.5 15.5 3.85 15.5 8Z" fill="#5DA182" stroke="white"/>
            <path d="M6.7 11.05C6.55 11.05 6.45 11 6.35 10.9L4.4 8.94998C4.2 8.74998 4.2 8.44998 4.4 8.24998C4.6 8.04998 4.9 8.04998 5.1 8.24998L6.65 9.79998L10.7 5.74998C10.9 5.54998 11.2 5.54998 11.4 5.74998C11.6 5.94998 11.6 6.24998 11.4 6.44998L6.95 10.9C6.95 11 6.85 11.05 6.7 11.05Z" fill="white"/>
          </g>
          <defs><clipPath id="tcc"><rect width="16" height="16" fill="white"/></clipPath></defs>
        </svg>
      ) : (
        /* CheckCircleIcon — outline circle */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--icon)' }}>
          <g clipPath="url(#ccicon)">
            <path d="M7.99951 0.003479C3.58851 0.003479 -0.000488281 3.55748 -0.000488281 7.96848C-0.000488281 12.3795 3.58851 15.9685 7.99951 15.9685C12.4105 15.9685 15.9995 12.3795 15.9995 7.96848C15.9995 3.55748 12.4105 0.003479 7.99951 0.003479ZM7.99951 14.9685C4.13951 14.9685 0.999512 11.8285 0.999512 7.96848C0.999512 4.10848 4.13951 0.968479 7.99951 0.968479C11.8595 0.968479 14.9995 4.10848 14.9995 7.96848C14.9995 11.8285 11.8595 14.9685 7.99951 14.9685ZM11.35 5.72348C11.4444 5.81642 11.498 5.94303 11.4992 6.07549C11.5003 6.20795 11.4488 6.33544 11.356 6.42998L6.75251 11.106C6.70594 11.1532 6.65045 11.1908 6.58924 11.2164C6.52804 11.242 6.46236 11.2552 6.39601 11.2552C6.32967 11.2552 6.26398 11.242 6.20278 11.2164C6.14158 11.1908 6.08608 11.1532 6.03951 11.106L4.14301 9.17898C4.09698 9.13216 4.06063 9.07674 4.03602 9.01587C4.01141 8.955 3.99903 8.88989 3.99959 8.82424C4.00014 8.75858 4.01363 8.69369 4.03927 8.63325C4.0649 8.57281 4.1022 8.51801 4.14901 8.47198C4.19583 8.42595 4.25125 8.38959 4.31212 8.36499C4.37299 8.34038 4.4381 8.328 4.50375 8.32855C4.56941 8.32911 4.6343 8.34259 4.69474 8.36823C4.75519 8.39387 4.80998 8.43116 4.85601 8.47798L6.39601 10.043L10.643 5.72898C10.736 5.63444 10.8627 5.5807 10.9953 5.57958C11.1279 5.57845 11.2555 5.63053 11.35 5.72348Z" fill="currentColor"/>
          </g>
          <defs><clipPath id="ccicon"><rect width="16" height="16" fill="white"/></clipPath></defs>
        </svg>
      )}
    </button>
  );
}

// ── Typography constants (matches TicketsDashboard) ───────────────────────────
const COL_TEXT = { fontFamily: SFT, fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: '22px', letterSpacing: '-0.15px', color: 'var(--text)', ...LIGA };

// Column widths (px)
const CW = { name: 'flex-1', assignee: 120, reporter: 130, dept: 110, escalationType: 100, dueDate: 120, status: 120, priority: 120 };

// ── Inset row divider (24px from left and right) ──────────────────────────────
const InsetLine = () => (
  <div style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 1, background: 'var(--border)', pointerEvents: 'none' }} />
);

// ── Table header — matches TicketsDashboard ───────────────────────────────────
// padding: 9px 8px 9px 0 per cell; 24px left padding on container

const COL_LABEL_BASE = { fontFamily: SFT, fontSize: 12, fontStyle: 'normal', fontWeight: 400, lineHeight: '18px', color: 'var(--text-weak)', ...LIGA, whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center' };
const COL_LABEL_1 = { ...COL_LABEL_BASE, flex: 1, padding: '8px 8px 8px 0' };
const COL_LABEL_N = { ...COL_LABEL_BASE, padding: '8px', borderLeft: '1px solid var(--border)' };

function ProjectTableHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', flexShrink: 0, paddingLeft: 24, paddingRight: 24, background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 2 }}>
      <div style={COL_LABEL_1}>Task name</div>
      <div style={{ ...COL_LABEL_N, width: CW.assignee }}>Assignee</div>
      <div style={{ ...COL_LABEL_N, width: CW.reporter }}>Customer</div>
      <div style={{ ...COL_LABEL_N, width: CW.dept }}>Department</div>
      <div style={{ ...COL_LABEL_N, width: CW.escalationType }}>Type</div>
      <div style={{ ...COL_LABEL_N, width: CW.dueDate }}>Due date</div>
      <div style={{ ...COL_LABEL_N, width: CW.status }}>Status</div>
      <div style={{ ...COL_LABEL_N, width: CW.priority }}>Priority</div>
      {/* Add column */}
      <div style={{ ...COL_LABEL_N, width: 40, justifyContent: 'center', padding: '8px 0' }}>
        <button title="Add column" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 5, background: 'none', border: '1px dashed var(--border-strong)', cursor: 'pointer' }}>
          <PlusIcon color="var(--text-disabled)" />
        </button>
      </div>
      <InsetLine />
    </div>
  );
}

// ── Task row — matches TicketsDashboard row style ─────────────────────────────

function TaskRow({ task, onClick, selected }) {
  const [hov, setHov] = useState(false);
  const [done, setDone] = useState(task.status === 'Resolved');
  const ss = STATUS_STYLE[task.status] ?? {};
  const ps = PRIORITY_STYLE[task.priority] ?? {};
  const ts = ESCALATION_TYPE_STYLE[task.escalationType] ?? { bg: 'var(--priority-low-bg)', color: 'var(--priority-low-text)' };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ position: 'relative', display: 'flex', alignItems: 'stretch', height: 38, background: selected ? 'var(--background-medium)' : hov ? 'var(--background-medium)' : 'var(--background-weak)', transition: 'background 0.08s', cursor: 'pointer', paddingLeft: 48, paddingRight: 24, boxSizing: 'border-box' }}
    >
      {/* Task name col */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8, paddingBottom: 8 }}>
        <Checkbox done={done} onToggle={() => setDone(d => !d)} />
        <span style={{ ...COL_TEXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: done ? 'var(--text-disabled)' : 'var(--text)' }}>
          {task.name}
        </span>
      </div>

      {/* Assignee */}
      <div style={{ width: CW.assignee, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {task.assignee
          ? <>
              <Avi name={task.assignee.name} size={20} bg={task.assignee.bg} />
              <span style={{ ...COL_TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {task.assignee.name.split(' ')[0]}
              </span>
            </>
          : <span style={{ ...COL_TEXT, color: 'var(--text-disabled)' }}>—</span>
        }
      </div>

      {/* Customer */}
      <div style={{ width: CW.reporter, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Avi name={task.reporter.name} size={20} bg={task.reporter.bg} />
        <span style={{ ...COL_TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.reporter.name}
        </span>
      </div>

      {/* Department */}
      <div style={{ width: CW.dept, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ ...COL_TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.reporter.dept}
        </span>
      </div>

      {/* Escalation type */}
      <div style={{ width: CW.escalationType, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 7px', borderRadius: 4, lineHeight: '16px', background: ts.bg, color: ts.color, whiteSpace: 'nowrap', ...LIGA }}>{task.escalationType}</span>
      </div>

      {/* Due date */}
      <div style={{ width: CW.dueDate, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        {task.dueDate
          ? <span style={{ ...COL_TEXT, color: task.dueDateColor }}>{task.dueDate}</span>
          : <span style={{ ...COL_TEXT, color: 'var(--text-disabled)' }}>—</span>
        }
      </div>

      {/* Status */}
      <div style={{ width: CW.status, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 8px', borderRadius: 4, lineHeight: '16px', background: ss.bg, color: ss.color, whiteSpace: 'nowrap', ...LIGA }}>{task.status}</span>
      </div>

      {/* Priority */}
      <div style={{ width: CW.priority, flexShrink: 0, padding: '0 8px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, fontFamily: SFT, padding: '2px 8px', borderRadius: 4, lineHeight: '16px', background: ps.bg, color: ps.color, whiteSpace: 'nowrap', ...LIGA }}>{task.priority}</span>
      </div>

      {/* Add-col spacer */}
      <div style={{ width: 40, flexShrink: 0, borderLeft: '1px solid var(--border)', alignItems: 'center' }} />
      <InsetLine />
    </div>
  );
}

// ── Section group ─────────────────────────────────────────────────────────────

function Section({ s, onSelectTask, selectedTaskId }) {
  const [open, setOpen] = useState(s.id !== 'resolved');

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'stretch', height: 50, paddingLeft: 24, paddingRight: 24, background: 'var(--background-weak)', userSelect: 'none' }}>
        {/* Left: caret + label + count — fills task name column */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--icon)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.12s', flexShrink: 0 }}>
              <path d="M10.249 4H1.74904C1.65016 4.00002 1.55351 4.02936 1.47131 4.0843C1.3891 4.13924 1.32504 4.21732 1.2872 4.30867C1.24936 4.40002 1.23946 4.50054 1.25875 4.59752C1.27803 4.69449 1.32563 4.78357 1.39554 4.8535L5.64554 9.1035C5.69187 9.15009 5.74695 9.18707 5.80761 9.2123C5.86828 9.23753 5.93334 9.25052 5.99904 9.25052C6.06474 9.25052 6.1298 9.23753 6.19047 9.2123C6.25113 9.18707 6.30621 9.15009 6.35254 9.1035L10.6025 4.8535C10.6724 4.78357 10.72 4.69449 10.7393 4.59752C10.7586 4.50054 10.7487 4.40002 10.7109 4.30867C10.673 4.21732 10.609 4.13924 10.5268 4.0843C10.4446 4.02936 10.3479 4.00002 10.249 4Z" fill="currentColor"/>
            </svg>
          </button>
          <span style={{ fontFamily: SFT, fontSize: 16, fontStyle: 'normal', fontWeight: 500, lineHeight: '20px', letterSpacing: '-0.32px', color: 'var(--text)', fontFeatureSettings: "'liga' off, 'clig' off" }}>{s.label}</span>
          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-disabled)', fontFamily: SFT }}>{s.tasks.length}</span>
        </div>
      </div>
      {open && <div style={{ marginLeft: 24, marginRight: 24, height: 1, background: 'var(--border)', flexShrink: 0 }} />}

      {open && (
        <>
          {s.tasks.map(t => <TaskRow key={t.id} task={t} selected={t.id === selectedTaskId} onClick={() => onSelectTask(t)} />)}
          {/* Add task row */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'stretch', height: 44, paddingLeft: 48, paddingRight: 24, background: 'var(--background-weak)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-disabled)', fontFamily: SFT, padding: '4px 0', marginLeft: 24 }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-weak)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; }}
              >
                Add task...
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'List', 'Board', 'Timeline', 'Calendar', 'Dashboard', 'Messages', 'Files'];

export default function ITEscalationsProject() {
  const [activeTab, setActiveTab] = useState('List');
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background-weak)', position: 'relative' }}>

      {/* ── Project header ──────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: '16px 24px 0', borderBottom: '1px solid var(--border)' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          {['Service', 'IT Support', 'IT Escalations Inbox'].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, fontFamily: SFT, color: i === arr.length - 1 ? 'var(--text-weak)' : 'var(--text-disabled)', cursor: i < arr.length - 1 ? 'pointer' : 'default' }}>
                {crumb}
              </span>
              {i < arr.length - 1 && <BreadcrumbSep />}
            </span>
          ))}
        </div>

        {/* Title row — project name aligned with share/avatars */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, minHeight: 28 }}>

          {/* Left: squircle icon + name + chevron + star + status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#A69FF3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Vector.svg — folder/project icon */}
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.5 2C11.3285 2 12 2.67158 12 3.5V8.5C12 9.32845 11.3285 10 10.5 10H1.5C0.671575 10 0 9.32845 0 8.5V0.5C0 0.22386 0.223857 0 0.5 0H4.8L5.85435 1.75725C5.9447 1.90785 6.10745 2 6.2831 2H10.5ZM11 3.5V8.5C11 8.77615 10.7761 9 10.5 9H1.5C1.22386 9 1 8.77615 1 8.5V3H10.5C10.7761 3 11 3.22386 11 3.5ZM4.83381 2L4.23381 1H1V2H4.83381Z" fill="white"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: SFD, fontSize: 20, fontWeight: 500, color: 'var(--text)', letterSpacing: '0.38px', lineHeight: '28px', margin: 0, whiteSpace: 'nowrap', fontStyle: 'normal', fontFeatureSettings: "'liga' off, 'clig' off" }}>
              IT Escalations Inbox
            </h2>
            {/* Chevron down */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--text-disabled)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-weak)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; }}>
              <ChevronDownIcon style={{ width: 14, height: 14 }} />
            </button>
            {/* Star */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: 'var(--text-disabled)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--warning-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; }}>
              <StarIcon style={{ width: 14, height: 14 }} />
            </button>
            {/* Status badge — using Icon (12px).svg dot */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontFamily: SFT, color: 'var(--success-text)', background: 'var(--success-background)', borderRadius: 100, padding: '3px 10px 3px 7px', lineHeight: '18px' }}>
              <StatusDot />
              On track
            </span>
          </div>

          {/* Right: stacked avatars (26px, 2px white border) + "+N" pill + Share + Customize */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Stacked avatars — 26px with 2px white border, -10px overlap */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {TEAM.map((m, i) => (
                <div
                  key={m.name}
                  title={m.name}
                  style={{ width: 26, height: 26, borderRadius: '50%', background: m.bg, border: '2px solid var(--surface)', marginLeft: i === 0 ? 0 : -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', flexShrink: 0, fontFamily: SFT, position: 'relative', zIndex: TEAM.length - i, boxSizing: 'border-box' }}
                >
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>
              ))}
              {/* +N pill — matches Header top.svg: 36×23, rx=11.5, fill=#F9F8F8, stroke=#EDEAE9 */}
              <div style={{ height: 23, minWidth: 36, borderRadius: 11.5, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -10, padding: '0 8px', fontSize: 11, fontWeight: 500, fontFamily: SFT, color: 'var(--icon)', zIndex: 0, position: 'relative', flexShrink: 0 }}>
                +{TOTAL_TASKS}
              </div>
            </div>

            {/* Share button — 65×28, rx=6, blue, LockIcon */}
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28, padding: '0 14px', background: 'var(--selected-background-strong)', border: 'none', borderRadius: 6, fontSize: 13, fontFamily: SFT, fontWeight: 500, color: 'var(--selected-text-strong)', cursor: 'pointer', flexShrink: 0 }}>
              <LockIcon />
              Share
            </button>

            {/* Customize button */}
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, height: 27, padding: '0 12px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 5.5, fontSize: 13, fontFamily: SFT, fontWeight: 500, color: 'var(--text)', cursor: 'pointer', flexShrink: 0 }}>
              <CustomizeIcon />
              Customize
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            return (
              <button
                key={tab} type="button"
                onClick={() => setActiveTab(tab)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, padding: '0 10px', fontSize: 13, fontFamily: SFT, fontWeight: active ? 500 : 400, cursor: 'pointer', background: 'transparent', border: 'none', color: active ? 'var(--text)' : 'var(--text-weak)', borderBottom: active ? '2px solid var(--icon)' : '2px solid transparent', marginBottom: -1, transition: 'color 0.1s', borderRadius: '4px 4px 0 0' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--background-medium)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-weak)'; e.currentTarget.style.background = 'transparent'; } }}
              >
                <TabIcon tab={tab} />
                {tab}
              </button>
            );
          })}
          {/* Add tab — PlusIcon */}
          <button
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', marginLeft: 2 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            <PlusIcon color="var(--text-disabled)" />
          </button>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <Toolbar
        left={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, height: 28, paddingLeft: 10, paddingRight: 10, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRight: 'none', borderRadius: '6px 0 0 6px', fontFamily: SFT, fontSize: 12, fontWeight: 400, fontStyle: 'normal', lineHeight: '18px', fontFeatureSettings: "'liga' off, 'clig' off", color: 'var(--text)', cursor: 'pointer' }}>
              <PlusIcon color="var(--icon)" />
              Add task
            </button>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 28, width: 24, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '0 6px 6px 0', cursor: 'pointer', color: 'var(--icon)' }}>
              <ChevronDownIcon style={{ width: 12, height: 12 }} />
            </button>
          </div>
        }
        right={[
          { label: 'Filter', icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 2.5H12M3 6H10M5.5 9.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
          { label: 'Sort',   icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 4H8M1 6.5H6M1 9H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10.5 2.5V10.5M10.5 10.5L8.5 8.5M10.5 10.5L12.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { label: 'Group',  icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="3" rx="1" stroke="currentColor" strokeWidth="1.1"/><rect x="1" y="8" width="11" height="3" rx="1" stroke="currentColor" strokeWidth="1.1"/></svg> },
          { label: 'Options',icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="10.5" cy="6.5" r="1" fill="currentColor"/><circle cx="2.5" cy="6.5" r="1" fill="currentColor"/></svg> },
        ].map(a => (
          <button
            key={a.label}
            style={{ display: 'flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', background: 'transparent', border: 'none', fontSize: 13, fontFamily: SFT, color: 'var(--text-weak)', cursor: 'pointer', borderRadius: 6 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--background-medium)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-weak)'; }}
          >
            {a.icon}{a.label}
          </button>
        ))}
      />

      {/* ── Table ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', overscrollBehavior: 'none' }}>
          <ProjectTableHeader />
          {SECTIONS.map(s => <Section key={s.id} s={s} onSelectTask={setSelectedTask} selectedTaskId={selectedTask?.id} />)}
          {/* Add section */}
          <div style={{ padding: '12px 24px', background: 'var(--background-weak)' }}>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-disabled)', fontFamily: SFT, padding: '4px 0' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-weak)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)'; }}
            >
              <PlusIcon color="currentColor" />
              Add section
            </button>
          </div>
        </div>
      </div>

      {/* Task detail panel — full project height, no scrim */}
      <RightPanelOverlay open={!!selectedTask} onClose={() => setSelectedTask(null)} width="min(660px, 72%)" noScrim>
        {selectedTask && (
          <BasicTaskView
            key={selectedTask.id}
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </RightPanelOverlay>
    </div>
  );
}
