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
    { title: 'Reset Your Password',                  views: 1240, deflections: 892, pct: 72, rating: 4.8, trend: 'up'     },
    { title: 'VPN Setup & Troubleshooting',           views: 876,  deflections: 654, pct: 75, rating: 4.5, trend: 'up'     },
    { title: 'Request Software Access',               views: 732,  deflections: 521, pct: 71, rating: 4.3, trend: 'stable' },
    { title: 'Salesforce Login Issues',               views: 618,  deflections: 298, pct: 48, rating: 3.9, trend: 'down'   },
    { title: 'New Employee Onboarding Guide',         views: 542,  deflections: 421, pct: 78, rating: 4.6, trend: 'up'     },
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

// Hex values of Asana design tokens (used in SVG fill attributes)
const BLUE   = '#4273D1'; // --selected-background-strong
const GREEN  = '#5DA182'; // --success-background-strong
const AMBER  = '#ECBD85'; // --warning-background-strong
const ROSE   = '#D43D5D'; // --danger-background-strong
const PURPLE = '#7C5EA8'; // no token — muted purple for secondary series

export const DASHBOARD_DATA = {
  all: {
    kpis: [
      { label: 'SLA Compliance',        value: '94%',     trend: '+3% vs last month',  trendGood: true  },
      { label: 'Automation Coverage',   value: '46%',     trend: '+12% vs last month', trendGood: true  },
      { label: 'Avg. Resolution Time',  value: '2.4 hrs', trend: '-18% vs last month', trendGood: true  },
      { label: 'Goal-Aligned Projects', value: '87%',     trend: '+5% vs last month',  trendGood: true  },
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
      { label: 'SLA Compliance',        value: '91%',     trend: '+1% vs last month',  trendGood: true  },
      { label: 'Automation Coverage',   value: '52%',     trend: '+8% vs last month',  trendGood: true  },
      { label: 'Avg. Resolution Time',  value: '1.8 hrs', trend: '-22% vs last month', trendGood: true  },
      { label: 'Goal-Aligned Projects', value: '78%',     trend: '-2% vs last month',  trendGood: false },
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
      { label: 'SLA Compliance',        value: '97%',     trend: '+5% vs last month',  trendGood: true  },
      { label: 'Automation Coverage',   value: '38%',     trend: '+4% vs last month',  trendGood: true  },
      { label: 'Avg. Resolution Time',  value: '3.2 hrs', trend: '+6% vs last month',  trendGood: false },
      { label: 'Goal-Aligned Projects', value: '92%',     trend: '+8% vs last month',  trendGood: true  },
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
