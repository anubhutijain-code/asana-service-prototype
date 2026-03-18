# AsanaService — Product Spec

## Overview

AsanaService is a prototype of an AI-powered IT service management tool built inside Asana's navigation shell. It demonstrates what a native "Service mode" could look like for IT and HR operations teams who already use Asana for work management.

The core premise: AI handles the routine work — ticket triage, KB deflection, routing, automation coverage — while humans handle judgment calls. Every AI action is visible and auditable in the UI.

The product has two modes that coexist in the same shell:

- **Service mode** — Help desk for IT and HR: ticket queues, knowledge base, automation, optimize, assets, dashboard
- **Work mode** — CWM-style project work: projects, goals, portfolios, reporting

The two modes share the same NavBar and ModeSidebar but have different secondary navs and home screens. The `/home` route now renders a unified home with tabs to switch between Service and Work contexts.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 + inline styles |
| Charts | Recharts |
| Icons | Inline SVG paths (no icon library) |
| Data | All mock data in `src/data/` — no backend, no API calls |
| Deploy | `npm run deploy` → gh-pages branch |

Fully local, fully static. The entire app is `npm run dev`.

---

## Roles

The app simulates multiple user personas via a role switcher in the ModeSidebar avatar flyout.

| Role ID | Name | Title | Home Route | Nav set |
|---------|------|-------|------------|---------|
| `admin2` | Anubhuti Jain | IT Admin | `/home` | Full admin nav |
| `admin` | Priya Sharma | Analytics Admin | `/dashboard` | Full admin nav |
| `agent` | Marcus Lee | IT Agent | `/my-tickets` | Agent workbench |
| `agent3` | Jordan Kim | Support Agent | `/agent-home` | Agent workbench |

Role changes are instant (no login). On mount, the app navigates to the role's home route. The role system drives which secondary nav is shown and which features are accessible.

---

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│  NavBar (h-44px, z-50)                                         │
├──────┬────────────┬───────────────────────────────────────────┤
│  MS  │ Secondary  │                                           │
│  64px│  Nav       │        Main Content Area                  │
│      │  182px     │        (fills remaining width)            │
│      │            │                                           │
└──────┴────────────┴───────────────────────────────────────────┘
```

- **NavBar**: Asana brand bar with search, notifications, profile
- **ModeSidebar (MS)**: Icon-only vertical mode switcher — Service, Work, Plan, Workflow, Company
- **ServiceSecondaryNav / WorkSecondaryNav**: Context-specific second-level nav at 182px
- **Main content**: Fills remaining space, page inset `padding: 32px 32px 64px`

---

## Data Model

All data is mock, defined in `src/data/`. There is no persistence — state resets on page refresh.

### Tickets (`src/data/tickets.js`)

Core entity. Used by IT Tickets, HR Tickets, Escalations, My Tickets views.

Fields: `id`, `title`, `type` (incident | service-request | change | problem), `priority` (urgent | high | medium | low), `status` (open | in-progress | pending | resolved | closed), `requester`, `requesterAvatar`, `assignee`, `assigneeAvatar`, `team`, `created`, `updated`, `sla`, `slaType`, `tags[]`, `satisfaction` (csat score + label), `source` (email | slack | portal | phone), `workflowStep`, `steps[]` (approval workflow), `comments[]`, `attachments[]`

Stats exported: `STATS` (KPI cards), `TABS` (filter tabs with counts). Filter function: `filterTickets(tickets, tab, search)`.

### Knowledge Base (`src/data/knowledgeBase.js`)

KB articles synced from external sources + internally authored.

**KB Projects** (knowledge bases): `id`, `name`, `team`, `source` (type: confluence|slab|notion|null, workspace, space, syncedAt, syncStatus, autoSync, syncInterval)

**KB Articles**: `id`, `projectId`, `title`, `status` (Published|Draft|Archived|Unpublished), `category`, `author`, `team`, `updatedAt`, `source` (confluence|slab|notion|internal), `content[]` (structured blocks: h2, p, li, link)

**KB Learnings** (AI-detected gaps): `id`, `projectId`, `status` (new|reviewed|dismissed), `type` (new-article|update-article), `gap` (problem description), `suggestion` (proposed article title), `category`, `sourceTickets[]`, `detectedAt`

### Dashboard (`src/data/dashboard.js`)

**DASHBOARD_DATA**: KPIs (SLA compliance, automation coverage, avg resolution time, goal-aligned projects) + ticket distribution + backlog trend + weekly volume + automation coverage split (AI vs rule-based). Keyed by queue: `all` | `it` | `hr`.

**TEAM_DATA**: Per-agent daily ticket volumes over 8 weeks, CSAT, avg resolution time, SLA health. 6 agents.

**TICKET_RESOLUTION_BY_TYPE**: Resolution breakdown by issue type (AI self-served | AI-assisted | human-only) + avg time.

**KB_PERFORMANCE**: Deflection rate, top articles with views/deflection/rating, search gap queries.

**BUSINESS_IMPACT**: IT effort by department, strategic themes, predictive trends.

**TICKET_TOPICS**: Ticket volume by topic with SLA hit rate + sparkline data.

### Optimize (`src/data/optimize.js`)

Four gap categories, each an array of gap items:

- `content` — Knowledge content gaps (missing/outdated articles)
- `action` — Workflow automation opportunities
- `data` — Data quality / enrichment gaps
- `cx` — AI customer experience ratings + improvement suggestions

### Assets (`src/data/assets.js`)

Hardware, software license, and infrastructure asset records. Fields vary by asset type.

---

## Screens

### Service Mode

#### Unified Home (`/home`)
Two tabs: **Service** (default for admin2) and **Work** (CWM tasks). Service tab shows: greeting (date + "Good [time], Name"), key metrics row, top tickets, AI insights panel. Work tab embeds the CWM home view.

#### IT Tickets (`/tickets`)
Master-detail layout. Left: stat cards (total open, urgent, breached SLA, resolved today) + tab bar (All, Urgent, Unassigned, In Progress, Resolved) + filterable ticket table. Right: ticket detail side pane with full ticket context, activity feed, approval workflow steps, and more actions menu (Route to HR, Close and move to Asana, etc.).

#### HR Tickets (`/hr-tickets`)
Same layout as IT Tickets but filtered to HR-type tickets. Separate stat cards for HR metrics.

#### Escalations (`/escalations`)
Priority inbox for flagged/escalated tickets. Three sections: Urgent (SLA breached or critical), High priority, All escalations. Each row shows requester, issue summary, SLA status. Side pane opens ticket detail with chat panel.

#### My Tickets (`/my-tickets`)
Agent workbench view. Shows only tickets assigned to the current agent. Groups by status. Same side pane as Escalations.

#### Knowledge Base (`/knowledge-base`, `/knowledge-base/:articleId`)
Two-panel layout: left = list of KB projects + articles with status filters. Right = article reader with structured content blocks. AI Learnings section shows detected gaps with status (new | reviewed | dismissed) and source tickets. Agent can accept gap and create/update an article.

#### Optimize (`/optimize`)
AI-surfaced improvement opportunities across four tabs:
- **Content gaps** — KB articles that need updating based on ticket patterns
- **Action gaps** — Workflows that could be automated
- **Data gaps** — Missing or low-quality data fields
- **AI CX ratings** — AI interaction quality scores + improvement suggestions

Master-detail: 380px list pane (gap items as rows) + detail panel.

#### Automations (`/automations`)
Card grid of automation rules organized by section: Featured, IT Queue, Cross-team, HR Queue. Each card has enable/disable toggle, description, trigger summary, and run count.

#### Assets (`/assets`)
Asset inventory: hardware (laptops, monitors, phones), software licenses, infrastructure. Filterable table with status badges.

#### Dashboard (`/dashboard`)
Two tabs: **Overview** (KPIs, ticket distribution donut, backlog trend, weekly volume chart, automation coverage) and **Team** (per-agent workload timeline heatmap over 8 weeks, team summary stats).

Also includes an Insights tab with Ticket Resolution by Type (AI self-serve vs assisted vs human) and Business Impact (effort by department, strategic themes, predictive trends).

Dashboard can be embedded in other pages via `hideTabs` + `initialTab` props.

#### Settings (`/settings`)
Five tabs: General, Integrations (Confluence/Slab/Notion sync), Knowledge Base (AI gap detection config), AI (model, behavior, trust settings), Automations. Two-panel layout: settings list (left) + edit panel (right).

### Work Mode

#### Work Home (`/`)
Greeting (date + "Good [time], Name"), recent projects, due items, goal progress. Same structure as Service home but Work-oriented content.

#### IT Escalations Project (`/projects/it-escalations`)
Full Asana-style project view: header with member avatars + share + customize bar, view switcher (List, Board, Timeline, Calendar, Reports, Comments, Attachments), mock task list. Demonstrates handoff from Service mode (when a ticket is "closed and moved to Asana").

---

## Key User Flows

### Flow 1: Ticket triage and resolution
1. Agent opens IT Tickets — sees stat cards and tab filters
2. Clicks a ticket row → side pane opens with full detail
3. Reviews AI-suggested routing or KB article deflection
4. Takes action: Route to HR (opens modal → banner confirmation), or resolves directly
5. Optional: "Close ticket and move to Asana" → CloseAndMoveModal → green banner with link to IT Escalations project

### Flow 2: KB gap remediation
1. Admin opens Knowledge Base → AI Learnings section
2. Sees AI-detected gap with source tickets cited
3. Clicks to expand → accepts gap → draft article scaffold created
4. (Future) AI drafts article content; admin reviews and publishes

### Flow 3: Optimize
1. Admin opens Optimize → Content Gaps tab
2. Sees ranked list of KB content issues
3. Selects a gap → detail panel shows affected ticket count, example tickets, suggested fix
4. Takes action: Create article, Update article, Dismiss

### Flow 4: Role switching
1. User opens ModeSidebar avatar flyout
2. Selects a persona (Recommended: Anubhuti / Marcus; Others: Priya / Jordan)
3. App navigates to that role's home and adjusts nav accordingly

---

## AI Capabilities (Prototype)

These are demonstrated in the UI with mock data — no real AI calls in the prototype.

### Ticket Triage
- **Suggested routing**: AI recommends "Route to HR" or "Assign to specialist" based on ticket content
- **Confidence indicators**: Shown as percentage with reasoning tooltip
- **Auto-classification**: Type, priority, and team assignment shown as AI-suggested fields

### KB Deflection
- **Search-before-submit**: AI checks KB before ticket is created; suggests relevant articles
- **Deflection tracking**: Dashboard shows AI-deflected vs agent-resolved split
- **Search gap detection**: Tracks queries with no KB match → surfaces as Optimize → Content gaps

### Gap Detection (Optimize)
- Analyzes ticket patterns to surface systemic issues
- Content gaps: articles missing or outdated based on repeat ticket topics
- Action gaps: manual workflows that could be automated (identified by pattern frequency)
- Data gaps: fields consistently empty or inaccurate
- CX ratings: AI interaction quality scores with improvement suggestions

### Activity Feed AI Events
- Ticket detail activity shows AI agent actions: "Suggested routing to HR", "KB article matched", "Auto-classified as incident"
- Coding agent events (future): file writes, bash outputs, commits streamed in real-time

---

## Future Vision

### Phase 2: Live AI planning agent
Add an in-app planning agent (right-side chat panel, always visible). Powered by Anthropic Messages API. Context-aware: knows which screen the user is on, has access to ticket data, KB, team workload. Can:
- Draft KB articles from ticket patterns
- Suggest automation rules
- Answer operational questions with real data

### Phase 3: Coding agent for automations
Extend automation rules using Claude Code SDK. When an admin designs a new automation workflow in the UI, a coding agent can:
- Read the existing automation engine
- Write new rule implementations
- Test against historical ticket data
- Deploy with approval

### Phase 4: Multi-queue and multi-team
- Support for multiple service teams (IT, HR, Legal, Finance) in the same instance
- Cross-team routing with handoff tracking
- Shared KB with team-scoped visibility

### Phase 5: Real integrations
- Live Confluence/Slab/Notion sync for KB
- Webhook ingestion from email, Slack, Jira
- GitHub/GitLab integration for engineering incident tickets
- Workday integration for HR tickets

---

## Open Questions

- **AI trust levels**: How much should the AI do autonomously vs. require approval? Current prototype always shows AI suggestions but requires human confirmation. Should there be trust-level settings per team?
- **Routing complexity**: The Route to HR flow is one-directional. What does bidirectional handoff look like when HR needs to involve IT mid-ticket?
- **KB edit flow**: The gap detection flow surfaces issues but the edit/publish workflow is placeholder. How much of article drafting should AI own?
- **Work mode depth**: Currently Work mode is mostly shell navigation. How much of Asana's CWM feature set needs to be demonstrated for the prototype to be credible?
- **Agent persona vs admin persona**: The agent and admin views diverge significantly. Should they share more UI surface (same ticket detail component) or maintain separate optimized views?
