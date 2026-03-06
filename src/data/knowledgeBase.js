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
  { id: 'it-001', projectId: 'it-kb', title: 'VPN Setup and Troubleshooting Guide',      status: 'Published',   category: 'Network',         author: 'James Carter', team: 'IT Team',          content: '', updatedAt: '2025-01-15', source: 'confluence' },
  { id: 'it-002', projectId: 'it-kb', title: 'How to Reset Your Password',               status: 'Published',   category: 'Account Access',  author: 'Sarah Lin',    team: 'IT Team',          content: '', updatedAt: '2025-02-03', source: 'confluence' },
  { id: 'it-003', projectId: 'it-kb', title: 'Printer Configuration for Remote Users',   status: 'Draft',       category: 'Hardware',        author: 'Marcus Webb',  team: 'IT Team',          content: '', updatedAt: '2025-03-20', source: 'confluence' },
  { id: 'it-004', projectId: 'it-kb', title: 'Software Installation Policy',             status: 'Archived',    category: 'Policy',          author: 'James Carter', team: 'IT Team',          content: '', updatedAt: '2024-11-01', source: 'internal'   },

  // HR — 3 synced from Slab, 1 internal
  { id: 'hr-001', projectId: 'hr-kb', title: 'Employee Benefits Overview',               status: 'Published',   category: 'Benefits',        author: 'Priya Nair',   team: 'HR Team',          content: '', updatedAt: '2025-01-10', source: 'slab'       },
  { id: 'hr-002', projectId: 'hr-kb', title: 'Leave of Absence Request Process',         status: 'Published',   category: 'Leave',           author: 'Dana Osei',    team: 'HR Team',          content: '', updatedAt: '2025-02-18', source: 'slab'       },
  { id: 'hr-003', projectId: 'hr-kb', title: 'Performance Review Cycle FAQ',             status: 'Draft',       category: 'Performance',     author: 'Priya Nair',   team: 'HR Team',          content: '', updatedAt: '2025-03-05', source: 'slab'       },
  { id: 'hr-004', projectId: 'hr-kb', title: 'Expense Reimbursement Policy',             status: 'Unpublished', category: 'Finance',         author: 'Tom Reyes',    team: 'HR Team',          content: '', updatedAt: '2025-03-28', source: 'internal'   },

  // Engineering — all synced from Notion
  { id: 'eng-001', projectId: 'eng-kb', title: 'Production Deployment Checklist',        status: 'Published',   category: 'Deployment',      author: 'Alex Rivera',  team: 'Engineering Team', content: '', updatedAt: '2025-01-22', source: 'notion'     },
  { id: 'eng-002', projectId: 'eng-kb', title: 'Database Backup and Restore Procedures', status: 'Published',   category: 'Database',        author: 'Nina Kowalski',team: 'Engineering Team', content: '', updatedAt: '2025-02-14', source: 'notion'     },
  { id: 'eng-003', projectId: 'eng-kb', title: 'On-Call Incident Response Runbook',      status: 'Published',   category: 'Incidents',       author: 'Alex Rivera',  team: 'Engineering Team', content: '', updatedAt: '2025-03-01', source: 'notion'     },
  { id: 'eng-004', projectId: 'eng-kb', title: 'Service Architecture Overview',          status: 'Draft',       category: 'Architecture',    author: 'Sam Chen',     team: 'Engineering Team', content: '', updatedAt: '2025-03-30', source: 'notion'     },

  // Onboarding — all internal
  { id: 'onb-001', projectId: 'onb-kb', title: 'Day 1 Checklist for New Hires',          status: 'Published',   category: 'Getting Started', author: 'Maya Torres',  team: 'People Ops',       content: '', updatedAt: '2025-01-05', source: 'internal'   },
  { id: 'onb-002', projectId: 'onb-kb', title: 'Setting Up Your Development Environment',status: 'Published',   category: 'Tools & Access',  author: 'Liam Okafor',  team: 'People Ops',       content: '', updatedAt: '2025-02-07', source: 'internal'   },
  { id: 'onb-003', projectId: 'onb-kb', title: 'Company Values and Culture Guide',       status: 'Published',   category: 'Culture',         author: 'Maya Torres',  team: 'People Ops',       content: '', updatedAt: '2025-01-28', source: 'internal'   },
  { id: 'onb-004', projectId: 'onb-kb', title: 'Benefits Enrollment Instructions',       status: 'Draft',       category: 'Benefits',        author: 'Liam Okafor',  team: 'People Ops',       content: '', updatedAt: '2025-03-15', source: 'internal'   },
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
    sourceTickets: [{ id: 'TICK-042', title: 'MFA not working after laptop swap' }, { id: 'TICK-051', title: 'Can\'t log in after device replacement' }],
    detectedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'learn-it-002', projectId: 'it-kb', status: 'new',
    type: 'update-article',
    linkedArticleId: 'it-001',
    gap: 'VPN article doesn\'t cover the split-tunnel configuration for the new AWS workspace',
    suggestion: 'Add a section on split-tunnel setup for AWS Workspaces',
    category: 'Network',
    sourceTickets: [{ id: 'TICK-038', title: 'VPN drops when connecting to AWS resources' }],
    detectedAt: '2026-03-02T08:30:00Z',
  },
  {
    id: 'learn-it-003', projectId: 'it-kb', status: 'new',
    type: 'new-article',
    gap: 'No guidance on requesting admin privileges for approved tools — users repeatedly ask',
    suggestion: 'How to Request Local Admin Access for Approved Software',
    category: 'Policy',
    sourceTickets: [{ id: 'TICK-029', title: 'Need admin access to install dev tools' }, { id: 'TICK-033', title: 'Can\'t install Figma without admin rights' }, { id: 'TICK-044', title: 'Software install blocked by policy' }],
    detectedAt: '2026-02-28T14:00:00Z',
  },
  {
    id: 'learn-it-004', projectId: 'it-kb', status: 'reviewed',
    type: 'update-article',
    linkedArticleId: 'it-003',
    gap: 'Printer article omits setup for the new Ricoh model deployed in London office',
    suggestion: 'Add Ricoh MP C4504 setup steps for the London office',
    category: 'Hardware',
    sourceTickets: [{ id: 'TICK-019', title: 'Can\'t add London printer' }],
    detectedAt: '2026-02-20T11:15:00Z',
  },
  {
    id: 'learn-it-005', projectId: 'it-kb', status: 'dismissed',
    type: 'new-article',
    gap: 'Several tickets asked about Zoom Rooms setup, not covered anywhere',
    suggestion: 'Zoom Rooms Setup and Troubleshooting Guide',
    category: 'Collaboration',
    sourceTickets: [{ id: 'TICK-011', title: 'Zoom Room won\'t connect in conf room B' }],
    detectedAt: '2026-02-15T09:00:00Z',
  },

  // HR KB
  {
    id: 'learn-hr-001', projectId: 'hr-kb', status: 'new',
    type: 'new-article',
    gap: 'No article explains how parental leave interacts with the performance review cycle',
    suggestion: 'Parental Leave and Performance Review — What to Expect',
    category: 'Leave',
    sourceTickets: [{ id: 'TICK-067', title: 'Will parental leave affect my review rating?' }, { id: 'TICK-071', title: 'Performance cycle during leave of absence' }],
    detectedAt: '2026-03-01T16:00:00Z',
  },
  {
    id: 'learn-hr-002', projectId: 'hr-kb', status: 'new',
    type: 'update-article',
    linkedArticleId: 'hr-004',
    gap: 'Expense policy doesn\'t address reimbursement limits for home office equipment',
    suggestion: 'Add a section covering home office equipment reimbursement limits',
    category: 'Finance',
    sourceTickets: [{ id: 'TICK-058', title: 'Can I expense a standing desk?' }, { id: 'TICK-062', title: 'Reimbursement limit for monitor purchase' }],
    detectedAt: '2026-02-27T12:00:00Z',
  },
  {
    id: 'learn-hr-003', projectId: 'hr-kb', status: 'reviewed',
    type: 'update-article',
    linkedArticleId: 'hr-001',
    gap: 'Benefits article doesn\'t mention the new dental network change effective April',
    suggestion: 'Add a note on the April 2026 dental network changes',
    category: 'Benefits',
    sourceTickets: [{ id: 'TICK-049', title: 'Is my dentist still in-network?' }],
    detectedAt: '2026-02-22T10:30:00Z',
  },
];

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
