// ─── Dashboard data ────────────────────────────────────────────────────────────

export const BUSINESS_IMPACT = {
  effortByDept: [
    { name: 'Engineering',     pct: 30 },
    { name: 'Product',         pct: 24 },
    { name: 'Marketing',       pct: 18 },
    { name: 'Sales',           pct: 15 },
    { name: 'HR / People Ops', pct: 13 },
  ],
  deptGoals: [
    { dept: 'Engineering',     effort: '30%', goal: 'Improve infrastructure scalability & reliability',        initiatives: 'Cloud modernization; CI/CD automation; developer self-service portal', outcomes: '40% faster build times; 99.9% uptime'             },
    { dept: 'Product',         effort: '24%', goal: 'Accelerate release velocity & improve feature quality',   initiatives: 'Workflow orchestration; release health dashboard',                  outcomes: '18% faster delivery; 30% fewer rollbacks'         },
    { dept: 'Marketing',       effort: '18%', goal: 'Automate campaigns & improve lead conversion insights',   initiatives: 'CRM + marketing automation; analytics pipelines',                  outcomes: '12% higher campaign throughput; 9% better lead quality' },
    { dept: 'Sales',           effort: '15%', goal: 'Increase pipeline visibility & streamline quoting',       initiatives: 'Salesforce sync reliability; deal desk automation',                 outcomes: '15% faster deal cycles; 10 hrs saved per rep/month' },
    { dept: 'HR / People Ops', effort: '13%', goal: 'Simplify onboarding & improve employee experience',       initiatives: 'Automated provisioning; AI helpdesk for HR requests',               outcomes: '620 hrs saved/quarter; +8 pt employee CSAT'       },
  ],
  strategicThemes: [
    { pct: '54%', name: 'Velocity & Delivery',          depts: 'Engineering + Product',  desc: 'Faster release cycles; improved reliability'         },
    { pct: '33%', name: 'Growth Enablement',            depts: 'Marketing + Sales',      desc: 'Higher campaign throughput; faster deal cycles'      },
    { pct: '13%', name: 'Employee Experience & Trust',  depts: 'HR + Security',          desc: 'Hours saved; higher satisfaction scores'             },
  ],
  predictiveTrends: [
    { week: 'Week 1', actual: 92,   predicted: 95  },
    { week: 'Week 2', actual: 88,   predicted: 100 },
    { week: 'Week 3', actual: null, predicted: 105 },
    { week: 'Week 4', actual: null, predicted: 112 },
  ],
  topTeams: [
    { name: 'Platform Engineering', hrs: 120 },
    { name: 'Customer Success',     hrs: 95  },
    { name: 'Product Development',  hrs: 87  },
    { name: 'Marketing Ops',        hrs: 68  },
    { name: 'Sales Engineering',    hrs: 52  },
  ],
  slaCompliance: 94,
  projectSuccessRate: 91,
};

export const TICKET_RESOLUTION_BY_TYPE = [
  {
    type: 'Access Management Inefficiency',
    insight: '4 departments consistently report access management delays since 6 weeks',
    total: 124,
    aiSelf:     { count: 12, pct: 10 },
    aiAssisted: { count: 89, pct: 72 },
    humanOnly:  { count: 23, pct: 19 },
    avgTime: '22.5 hrs', avgTimePct: 90,
    highlight: true, action: 'Create Project',
  },
  {
    type: 'Password Reset – Self-Service Portal',
    total: 87,
    aiSelf:     { count: 64, pct: 74 },
    aiAssisted: { count: 18, pct: 21 },
    humanOnly:  { count: 5,  pct: 6  },
    avgTime: '3 min', avgTimePct: 12,
  },
  {
    type: 'Software Install – Standard Desktop Applications',
    total: 56,
    aiSelf:     { count: 8,  pct: 14 },
    aiAssisted: { count: 32, pct: 57 },
    humanOnly:  { count: 16, pct: 29 },
    avgTime: '4.5 hrs', avgTimePct: 45,
  },
  {
    type: 'Hardware Issue – Laptop/Desktop Troubleshooting',
    total: 43,
    aiSelf:     { count: 2,  pct: 5  },
    aiAssisted: { count: 15, pct: 35 },
    humanOnly:  { count: 26, pct: 60 },
    avgTime: '6.8 hrs', avgTimePct: 68,
  },
  {
    type: 'Network Connectivity – VPN & WiFi Issues',
    total: 68,
    aiSelf:     { count: 28, pct: 41 },
    aiAssisted: { count: 31, pct: 46 },
    humanOnly:  { count: 9,  pct: 13 },
    avgTime: '1.2 hrs', avgTimePct: 24,
  },
  {
    type: 'Application Error – CRM & Business Tools',
    total: 92,
    aiSelf:     { count: 18, pct: 20 },
    aiAssisted: { count: 54, pct: 59 },
    humanOnly:  { count: 20, pct: 22 },
    avgTime: '3.4 hrs', avgTimePct: 34,
  },
];

export const KB_PERFORMANCE = {
  deflectionRate: 68,
  articlesPublished: 142,
  searchHitRate: 81,
  topArticles: [
    { title: 'Reset Your Password',          views: 1240, deflections: 892, pct: 72, rating: 4.8, trend: 'up',     optimization: 'Add a video walkthrough — high traffic article with room to improve deflection' },
    { title: 'VPN Setup & Troubleshooting',  views: 876,  deflections: 654, pct: 75, rating: 4.5, trend: 'up',     optimization: 'Update screenshots for latest VPN client — reported as outdated in 12 tickets' },
    { title: 'Request Software Access',      views: 732,  deflections: 521, pct: 71, rating: 4.3, trend: 'stable', optimization: 'Add approval timeline section — repeat follow-up tickets suggest missing context' },
    { title: 'Salesforce Login Issues',      views: 618,  deflections: 298, pct: 48, rating: 3.9, trend: 'down',   optimization: 'Low deflect rate — add SSO troubleshooting steps and MFA reset instructions' },
    { title: 'New Employee Onboarding Guide',views: 542,  deflections: 421, pct: 78, rating: 4.6, trend: 'up',     optimization: 'Consider splitting into role-specific guides to improve search relevance' },
  ],
  searchGaps: [
    { query: 'outlook calendar sync',    count: 47 },
    { query: 'printer setup mac',        count: 38 },
    { query: '2fa authenticator lost',   count: 31 },
  ],
};

export const QUEUE_OPTIONS = [
  { id: 'all', label: 'All Queues' },
  { id: 'it',  label: 'IT Tickets' },
  { id: 'hr',  label: 'HR Tickets' },
];

// 8-week date labels (working days, Jan 13 – Mar 7)
const WDAYS = [
  'Jan 13','Jan 14','Jan 15','Jan 16','Jan 17',
  'Jan 20','Jan 21','Jan 22','Jan 23','Jan 24',
  'Jan 27','Jan 28','Jan 29','Jan 30','Jan 31',
  'Feb 3','Feb 4','Feb 5','Feb 6','Feb 7',
  'Feb 10','Feb 11','Feb 12','Feb 13','Feb 14',
  'Feb 17','Feb 18','Feb 19','Feb 20','Feb 21',
  'Feb 24','Feb 25','Feb 26','Feb 27','Feb 28',
  'Mar 3','Mar 4','Mar 5','Mar 6','Mar 7',
];

export const TEAM_DATA = {
  todayIndex: 32,  // index into WDAYS = Mar 5 (today)
  dates: WDAYS,
  summary: { totalOpen: 142, avgCsat: 4.2, slaBreaches: 7, resolvedThisWeek: 141 },
  agents: [
    {
      id: 'a1', name: 'Marcus Rivera', initials: 'MR', color: '#D43D5D',
      daily: [22,24,25,23,26, 28,30,28,26,24, 26,28,36,38,30, 26,28,26,28,30, 28,36,38,40,36, 28,26,24,28,30, 28,30,28,36,38, 36,30,28,26,24],
      csat: 3.9, avgResolution: '4.2 hrs', resolvedThisWeek: 22, slaHealth: 72,
    },
    {
      id: 'a2', name: 'Jamie Chen', initials: 'JC', color: '#4273D1',
      daily: [18,16,15,14,12, 14,15,13,14,13, 16,14,12,11,13, 12,14,13,12,11, 10,35,13,11,10, 12,13,14,13,12, 14,14,14,13,12, 11,12,13,14,14],
      csat: 4.8, avgResolution: '1.4 hrs', resolvedThisWeek: 31, slaHealth: 96,
    },
    {
      id: 'a3', name: 'Priya Nair', initials: 'PN', color: '#5DA182',
      daily: [20,21,22,20,22, 23,24,22,24,25, 24,26,25,26,27, 26,28,36,28,26, 27,29,28,29,29, 28,30,29,28,29, 29,36,28,29,29, 28,27,28,28,29],
      csat: 4.3, avgResolution: '2.8 hrs', resolvedThisWeek: 27, slaHealth: 84,
    },
    {
      id: 'a4', name: 'Devon Walsh', initials: 'DW', color: '#7C5EA8',
      daily: [0,0,0,0,0, 0,0,0,0,0, 2,3,4,5,5, 5,6,5,6,6, 6,7,6,7,7, 6,7,7,6,6, 6,6,6,6,6, 5,6,6,6,6],
      csat: 4.6, avgResolution: '1.1 hrs', resolvedThisWeek: 18, slaHealth: 100,
    },
    {
      id: 'a5', name: 'Sana Okafor', initials: 'SO', color: '#7C5EA8',
      daily: [18,19,20,19,21, 20,22,21,22,21, 22,23,22,23,22, 22,24,23,22,23, 22,36,22,23,22, 21,22,22,23,22, 22,22,22,22,22, 21,22,21,22,22],
      csat: 4.1, avgResolution: '3.1 hrs', resolvedThisWeek: 24, slaHealth: 91,
    },
    {
      id: 'a6', name: 'Tom Reyes', initials: 'TR', color: '#ECBD85',
      daily: [14,15,16,16,18, 18,20,21,22,22, 23,24,24,25,26, 26,27,28,28,29, 29,30,31,30,31, 31,36,32,30,28, 30,30,36,38,30, 28,36,30,28,26],
      csat: 3.7, avgResolution: '5.0 hrs', resolvedThisWeek: 19, slaHealth: 79,
    },
  ],
};

// Hex values of Asana design tokens (used in SVG fill attributes)
const BLUE   = '#4273D1'; // --selected-background-strong
const GREEN  = '#5DA182'; // --success-background-strong
const AMBER  = '#ECBD85'; // --warning-background-strong
const ROSE   = '#D43D5D'; // --danger-background-strong
const PURPLE = '#7C5EA8'; // no token — muted purple for secondary series

export const DASHBOARD_DATA = {
  all: {
    kpis: [
      { label: 'SLA Compliance',        value: '94%',     trend: '+3% vs last month',  trendGood: true,  spark: [88,89,90,91,92,93,94] },
      { label: 'Automation Coverage',   value: '46%',     trend: '+12% vs last month', trendGood: true,  spark: [30,32,35,37,40,43,46] },
      { label: 'Avg. Resolution Time',  value: '2.4 hrs', trend: '-18% vs last month', trendGood: true,  spark: [4.2,3.9,3.6,3.2,2.9,2.6,2.4] },
      { label: 'Goal-Aligned Projects', value: '87%',     trend: '+5% vs last month',  trendGood: true,  spark: [78,80,81,83,84,86,87] },
    ],
    ticketsByCategory: [
      { name: 'Service Requests', value: 289, color: BLUE  },
      { name: 'Incidents',        value: 145, color: GREEN },
      { name: 'Changes',          value: 67,  color: AMBER },
    ],
    backlogTrend: [
      { month: 'Jan', count: 160 },
      { month: 'Feb', count: 145 },
      { month: 'Mar', count: 130 },
      { month: 'Apr', count: 110 },
      { month: 'May', count: 95  },
      { month: 'Jun', count: 80  },
    ],
    weeklyVolume: [
      { day: 'Mon', Deflected: 14, Resolved: 32 },
      { day: 'Tue', Deflected: 18, Resolved: 42 },
      { day: 'Wed', Deflected: 12, Resolved: 38 },
      { day: 'Thu', Deflected: 20, Resolved: 44 },
      { day: 'Fri', Deflected: 10, Resolved: 28 },
    ],
    automationCoverage: { total: 420, aiResolved: 231, ruleBased: 189 },
  },
  it: {
    kpis: [
      { label: 'SLA Compliance',        value: '91%',     trend: '+1% vs last month',  trendGood: true,  spark: [86,87,88,88,89,90,91] },
      { label: 'Automation Coverage',   value: '52%',     trend: '+8% vs last month',  trendGood: true,  spark: [40,42,44,46,48,50,52] },
      { label: 'Avg. Resolution Time',  value: '1.8 hrs', trend: '-22% vs last month', trendGood: true,  spark: [3.2,2.9,2.6,2.4,2.2,2.0,1.8] },
      { label: 'Goal-Aligned Projects', value: '78%',     trend: '-2% vs last month',  trendGood: false, spark: [82,81,81,80,79,79,78] },
    ],
    ticketsByCategory: [
      { name: 'Access Mgmt', value: 124, color: BLUE  },
      { name: 'Hardware',    value: 87,  color: GREEN },
      { name: 'Software',    value: 56,  color: AMBER },
      { name: 'Network',     value: 68,  color: ROSE  },
    ],
    backlogTrend: [
      { month: 'Jan', count: 80 },
      { month: 'Feb', count: 72 },
      { month: 'Mar', count: 65 },
      { month: 'Apr', count: 55 },
      { month: 'May', count: 48 },
      { month: 'Jun', count: 42 },
    ],
    weeklyVolume: [
      { day: 'Mon', Deflected: 8,  Resolved: 18 },
      { day: 'Tue', Deflected: 10, Resolved: 22 },
      { day: 'Wed', Deflected: 7,  Resolved: 20 },
      { day: 'Thu', Deflected: 12, Resolved: 24 },
      { day: 'Fri', Deflected: 5,  Resolved: 14 },
    ],
    automationCoverage: { total: 180, aiResolved: 94, ruleBased: 86 },
  },
  hr: {
    kpis: [
      { label: 'SLA Compliance',        value: '97%',     trend: '+5% vs last month',  trendGood: true,  spark: [88,90,92,93,95,96,97] },
      { label: 'Automation Coverage',   value: '38%',     trend: '+4% vs last month',  trendGood: true,  spark: [32,33,34,35,36,37,38] },
      { label: 'Avg. Resolution Time',  value: '3.2 hrs', trend: '+6% vs last month',  trendGood: false, spark: [2.8,2.9,3.0,3.0,3.1,3.1,3.2] },
      { label: 'Goal-Aligned Projects', value: '92%',     trend: '+8% vs last month',  trendGood: true,  spark: [80,82,84,86,88,90,92] },
    ],
    ticketsByCategory: [
      { name: 'Leave Requests', value: 68, color: BLUE   },
      { name: 'Benefits',       value: 45, color: GREEN  },
      { name: 'Onboarding',     value: 32, color: AMBER  },
      { name: 'Payroll',        value: 28, color: PURPLE },
    ],
    backlogTrend: [
      { month: 'Jan', count: 50 },
      { month: 'Feb', count: 45 },
      { month: 'Mar', count: 40 },
      { month: 'Apr', count: 35 },
      { month: 'May', count: 28 },
      { month: 'Jun', count: 22 },
    ],
    weeklyVolume: [
      { day: 'Mon', Deflected: 4, Resolved: 10 },
      { day: 'Tue', Deflected: 6, Resolved: 14 },
      { day: 'Wed', Deflected: 3, Resolved: 12 },
      { day: 'Thu', Deflected: 5, Resolved: 16 },
      { day: 'Fri', Deflected: 3, Resolved: 8  },
    ],
    automationCoverage: { total: 120, aiResolved: 45, ruleBased: 75 },
  },
};

// ─── Ticket topic volume data (for TopicVolumeCard) ────────────────────────────
// Sorted descending by count — index drives blue shade (0 = darkest)
export const TICKET_TOPICS = [
  { name: 'Access & Auth',  count: 247, sla: 71, spark: [28,32,35,41,38,44,29] },
  { name: 'Hardware',       count: 198, sla: 68, spark: [18,22,26,24,28,31,19] },
  { name: 'Network',        count: 183, sla: 74, spark: [22,19,24,28,25,22,23] },
  { name: 'Software',       count: 156, sla: 69, spark: [15,17,19,22,20,24,19] },
  { name: 'Onboarding',     count: 134, sla: 82, spark: [12,14,16,18,22,20,12] },
  { name: 'Email & Comms',  count: 112, sla: 66, spark: [14,12,16,18,14,16,12] },
  { name: 'Printing',       count:  87, sla: 73, spark: [8, 10,12, 9,11,10, 7] },
  { name: 'Other',          count:  64, sla: 78, spark: [6,  8, 7, 9, 8,10, 6] },
];
