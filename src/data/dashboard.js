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
    { title: 'Reset Your Password',          views: 1240, deflections: 892, pct: 72, rating: 4.8, trend: 'up',     optimization: 'Add a video walkthrough — high traffic article with room to improve deflection',     helpSignal: { helping: 72, notHelping: 18, noSignal: 10 }, signalCategory: null },
    { title: 'VPN Setup & Troubleshooting',  views: 876,  deflections: 654, pct: 75, rating: 4.5, trend: 'up',     optimization: 'Update screenshots for latest VPN client — reported as outdated in 12 tickets',       helpSignal: { helping: 75, notHelping: 15, noSignal: 10 }, signalCategory: 'content'   },
    { title: 'Request Software Access',      views: 732,  deflections: 521, pct: 71, rating: 4.3, trend: 'stable', optimization: 'Add approval timeline section — repeat follow-up tickets suggest missing context',    helpSignal: { helping: 71, notHelping: 19, noSignal: 10 }, signalCategory: null },
    { title: 'Salesforce Login Issues',      views: 618,  deflections: 298, pct: 48, rating: 3.9, trend: 'down',   optimization: 'Low deflect rate — add SSO troubleshooting steps and MFA reset instructions',        helpSignal: { helping: 48, notHelping: 42, noSignal: 10 }, signalCategory: 'content'   },
    { title: 'New Employee Onboarding Guide',views: 542,  deflections: 421, pct: 78, rating: 4.6, trend: 'up',     optimization: 'Consider splitting into role-specific guides to improve search relevance',           helpSignal: { helping: 78, notHelping: 12, noSignal: 10 }, signalCategory: 'retrieval' },
    { title: 'Okta SSO Configuration',       views: 389,  deflections: 175, pct: 45, rating: 3.7, trend: 'down',   optimization: 'AI citing Okta v2 steps for v3 tenants — update KB to v3 or add version selector', helpSignal: { helping: 45, notHelping: 44, noSignal: 11 }, signalCategory: 'model'     },
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
      trends: {
        csat:      { week: [3.7,3.8,3.9,3.8,4.0,3.9,3.9],   month: [3.5,3.6,3.8,3.9],   quarter: [3.2,3.5,3.7,3.9]   },
        slaHealth: { week: [68,70,72,71,74,72,72],            month: [65,68,70,72],        quarter: [60,64,69,72]       },
        resolved:  { week: [19,20,18,21,22,20,22],            month: [74,80,84,88],        quarter: [210,240,260,284]   },
      },
    },
    {
      id: 'a2', name: 'Jamie Chen', initials: 'JC', color: '#4273D1',
      daily: [18,16,15,14,12, 14,15,13,14,13, 16,14,12,11,13, 12,14,13,12,11, 10,35,13,11,10, 12,13,14,13,12, 14,14,14,13,12, 11,12,13,14,14],
      csat: 4.8, avgResolution: '1.4 hrs', resolvedThisWeek: 31, slaHealth: 96,
      trends: {
        csat:      { week: [4.6,4.7,4.8,4.7,4.8,4.8,4.8],   month: [4.4,4.5,4.7,4.8],   quarter: [4.2,4.4,4.6,4.8]   },
        slaHealth: { week: [94,95,96,95,96,96,96],            month: [92,94,95,96],        quarter: [90,92,94,96]       },
        resolved:  { week: [28,30,29,31,32,30,31],            month: [114,122,126,131],    quarter: [340,370,400,431]   },
      },
    },
    {
      id: 'a3', name: 'Priya Nair', initials: 'PN', color: '#5DA182',
      daily: [20,21,22,20,22, 23,24,22,24,25, 24,26,25,26,27, 26,28,36,28,26, 27,29,28,29,29, 28,30,29,28,29, 29,36,28,29,29, 28,27,28,28,29],
      csat: 4.3, avgResolution: '2.8 hrs', resolvedThisWeek: 27, slaHealth: 84,
      trends: {
        csat:      { week: [4.1,4.2,4.3,4.2,4.4,4.3,4.3],   month: [3.9,4.0,4.1,4.3],   quarter: [3.7,3.9,4.1,4.3]   },
        slaHealth: { week: [80,82,84,83,85,84,84],            month: [78,80,82,84],        quarter: [74,78,81,84]       },
        resolved:  { week: [24,25,26,24,27,26,27],            month: [96,102,108,116],     quarter: [290,320,350,386]   },
      },
    },
    {
      id: 'a4', name: 'Devon Walsh', initials: 'DW', color: '#7C5EA8',
      daily: [0,0,0,0,0, 0,0,0,0,0, 2,3,4,5,5, 5,6,5,6,6, 6,7,6,7,7, 6,7,7,6,6, 6,6,6,6,6, 5,6,6,6,6],
      csat: 4.6, avgResolution: '1.1 hrs', resolvedThisWeek: 18, slaHealth: 100,
      trends: {
        csat:      { week: [4.5,4.6,4.6,4.6,4.7,4.6,4.6],   month: [4.4,4.5,4.5,4.6],   quarter: [4.2,4.4,4.5,4.6]   },
        slaHealth: { week: [100,100,100,100,100,100,100],     month: [100,100,100,100],    quarter: [98,99,100,100]     },
        resolved:  { week: [16,17,18,16,19,18,18],            month: [60,68,72,78],        quarter: [160,200,240,278]   },
      },
    },
    {
      id: 'a5', name: 'Sana Okafor', initials: 'SO', color: '#7C5EA8',
      daily: [18,19,20,19,21, 20,22,21,22,21, 22,23,22,23,22, 22,24,23,22,23, 22,36,22,23,22, 21,22,22,23,22, 22,22,22,22,22, 21,22,21,22,22],
      csat: 4.1, avgResolution: '3.1 hrs', resolvedThisWeek: 24, slaHealth: 91,
      trends: {
        csat:      { week: [3.9,4.0,4.1,4.0,4.2,4.1,4.1],   month: [3.7,3.8,4.0,4.1],   quarter: [3.5,3.7,3.9,4.1]   },
        slaHealth: { week: [88,89,91,90,92,91,91],            month: [86,88,90,91],        quarter: [82,86,89,91]       },
        resolved:  { week: [22,23,24,22,25,24,24],            month: [88,94,98,104],       quarter: [260,290,310,342]   },
      },
    },
    {
      id: 'a6', name: 'Tom Reyes', initials: 'TR', color: '#ECBD85',
      daily: [14,15,16,16,18, 18,20,21,22,22, 23,24,24,25,26, 26,27,28,28,29, 29,30,31,30,31, 31,36,32,30,28, 30,30,36,38,30, 28,36,30,28,26],
      csat: 3.7, avgResolution: '5.0 hrs', resolvedThisWeek: 19, slaHealth: 79,
      trends: {
        csat:      { week: [3.5,3.6,3.7,3.6,3.8,3.7,3.7],   month: [3.3,3.4,3.6,3.7],   quarter: [3.0,3.3,3.5,3.7]   },
        slaHealth: { week: [75,77,79,78,80,79,79],            month: [72,75,77,79],        quarter: [68,72,76,79]       },
        resolved:  { week: [17,18,19,17,20,18,19],            month: [68,72,76,82],        quarter: [200,225,248,274]   },
      },
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
      { label: 'SLA Compliance',       value: '94%',     trend: '+3% vs last month',  trendGood: true,  spark: [88,89,90,91,92,93,94] },
      { label: 'Deflection Rate',      value: '46%',     trend: '+12% vs last month', trendGood: true,  spark: [30,32,35,37,40,43,46] },
      { label: 'Avg. Resolution Time', value: '2.4 hrs', trend: '-18% vs last month', trendGood: true,  spark: [4.2,3.9,3.6,3.2,2.9,2.6,2.4] },
      { label: 'CSAT Score',           value: '4.2 / 5', trend: '+0.3 vs last month', trendGood: true,  spark: [3.7,3.8,3.9,4.0,4.0,4.1,4.2] },
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
      { day: 'Mon', Deflected: 14, Escalated: 6,  Resolved: 32 },
      { day: 'Tue', Deflected: 18, Escalated: 8,  Resolved: 42 },
      { day: 'Wed', Deflected: 12, Escalated: 5,  Resolved: 38 },
      { day: 'Thu', Deflected: 20, Escalated: 9,  Resolved: 44 },
      { day: 'Fri', Deflected: 10, Escalated: 4,  Resolved: 28 },
    ],
    channelDist: [
      { channel: 'Slack',  count: 187, pct: 37, color: PURPLE },
      { channel: 'Email',  count: 152, pct: 30, color: BLUE   },
      { channel: 'Portal', count: 168, pct: 33, color: GREEN  },
    ],
    deflection: { deflected: 230, escalated: 43, selfServed: 113, total: 507 },
    automationCoverage: { total: 420, aiResolved: 231, ruleBased: 189 },
  },
  it: {
    kpis: [
      { label: 'SLA Compliance',       value: '91%',     trend: '+1% vs last month',  trendGood: true,  spark: [86,87,88,88,89,90,91] },
      { label: 'Deflection Rate',      value: '52%',     trend: '+8% vs last month',  trendGood: true,  spark: [40,42,44,46,48,50,52] },
      { label: 'Avg. Resolution Time', value: '1.8 hrs', trend: '-22% vs last month', trendGood: true,  spark: [3.2,2.9,2.6,2.4,2.2,2.0,1.8] },
      { label: 'CSAT Score',           value: '4.1 / 5', trend: '+0.2 vs last month', trendGood: true,  spark: [3.6,3.7,3.8,3.9,3.9,4.0,4.1] },
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
      { day: 'Mon', Deflected: 8,  Escalated: 3, Resolved: 18 },
      { day: 'Tue', Deflected: 10, Escalated: 4, Resolved: 22 },
      { day: 'Wed', Deflected: 7,  Escalated: 2, Resolved: 20 },
      { day: 'Thu', Deflected: 12, Escalated: 5, Resolved: 24 },
      { day: 'Fri', Deflected: 5,  Escalated: 2, Resolved: 14 },
    ],
    channelDist: [
      { channel: 'Slack',  count: 98, pct: 54, color: PURPLE },
      { channel: 'Email',  count: 47, pct: 26, color: BLUE   },
      { channel: 'Portal', count: 35, pct: 20, color: GREEN  },
    ],
    deflection: { deflected: 94, escalated: 18, selfServed: 42, total: 180 },
    automationCoverage: { total: 180, aiResolved: 94, ruleBased: 86 },
  },
  hr: {
    kpis: [
      { label: 'SLA Compliance',       value: '97%',     trend: '+5% vs last month',  trendGood: true,  spark: [88,90,92,93,95,96,97] },
      { label: 'Deflection Rate',      value: '38%',     trend: '+4% vs last month',  trendGood: true,  spark: [32,33,34,35,36,37,38] },
      { label: 'Avg. Resolution Time', value: '3.2 hrs', trend: '+6% vs last month',  trendGood: false, spark: [2.8,2.9,3.0,3.0,3.1,3.1,3.2] },
      { label: 'CSAT Score',           value: '4.5 / 5', trend: '+0.4 vs last month', trendGood: true,  spark: [3.8,3.9,4.0,4.1,4.2,4.4,4.5] },
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
      { day: 'Mon', Deflected: 4, Escalated: 1, Resolved: 10 },
      { day: 'Tue', Deflected: 6, Escalated: 2, Resolved: 14 },
      { day: 'Wed', Deflected: 3, Escalated: 1, Resolved: 12 },
      { day: 'Thu', Deflected: 5, Escalated: 2, Resolved: 16 },
      { day: 'Fri', Deflected: 3, Escalated: 1, Resolved: 8  },
    ],
    channelDist: [
      { channel: 'Slack',  count: 42, pct: 24, color: PURPLE },
      { channel: 'Email',  count: 68, pct: 39, color: BLUE   },
      { channel: 'Portal', count: 63, pct: 37, color: GREEN  },
    ],
    deflection: { deflected: 46, escalated: 8, selfServed: 19, total: 120 },
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

// ─── AI handling over time — 30 working days (stacked area) ───────────────────
// Each day: AI deflected, rule-based auto-resolved, agent-handled
const AI_DAYS = [
  'Jan 27','Jan 28','Jan 29','Jan 30','Jan 31',
  'Feb 3','Feb 4','Feb 5','Feb 6','Feb 7',
  'Feb 10','Feb 11','Feb 12','Feb 13','Feb 14',
  'Feb 17','Feb 18','Feb 19','Feb 20','Feb 21',
  'Feb 24','Feb 25','Feb 26','Feb 27','Feb 28',
  'Mar 3','Mar 4','Mar 5','Mar 6','Mar 7',
];
export const AI_HANDLING_30D = {
  dates: AI_DAYS,
  aiDeflected:   [18,20,22,19,17, 22,24,25,23,21, 26,28,30,27,25, 29,31,33,30,28, 32,34,36,33,31, 35,37,39,36,34],
  ruleBased:     [12,13,14,13,12, 14,15,16,15,14, 16,17,18,17,16, 18,19,20,19,18, 20,21,22,21,20, 22,23,24,23,22],
  agentHandled:  [28,26,25,27,29, 25,23,22,24,26, 22,20,19,21,23, 20,18,17,19,21, 18,16,15,17,19, 16,14,13,15,17],
};

// ─── Today's hourly AI activity (for Admin Home) ──────────────────────────────
export const TODAY_HOURLY = {
  hours:       ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','Now'],
  aiDeflected: [2,    4,    7,    14,   12,    10,    8,     13,   9,    7,    5,    3   ],
  agentHandled:[1,    2,    3,    5,    6,     5,     4,     4,    3,    3,    2,    2   ],
};

// ─── Resolution time by category — AI vs agent (minutes) ─────────────────────
export const RESOLUTION_BY_CATEGORY = [
  { name: 'How-to / FAQ',     ai:  3, agent: 28  },
  { name: 'Password / MFA',   ai:  4, agent: 35  },
  { name: 'Software access',  ai: 12, agent: 142 },
  { name: 'License mgmt',     ai: 18, agent: 187 },
  { name: 'Network / VPN',    ai: 22, agent: 95  },
  { name: 'Hardware',         ai: null, agent: 312 },
  { name: 'HR policy',        ai:  6, agent: 54  },
  { name: 'Payroll',          ai: null, agent: 480 },
];
