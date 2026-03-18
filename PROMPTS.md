# AsanaService — Build & Extension Prompts

## How to use this document

Each section is a discrete Claude Code session for adding a major feature or rebuilding a section of the app. Feed the prompt directly to Claude Code in the `/AsanaService` directory. Claude Code will read `CLAUDE.md` automatically.

Phases are ordered by dependency — later phases assume earlier ones exist.

---

## Phase 1: Add a new Service screen

**Goal**: Scaffold a new screen that fits the existing layout and nav conventions.

**Prompt**:

```
Add a new screen called [ScreenName] at the route /[route-name].

Read CLAUDE.md and SPEC.md first. Then:

1. Create `src/components/[ScreenName]View.jsx`
   - Full-width layout with `padding: '32px 32px 64px'`
   - Follow the page structure established in AssetsView.jsx as the reference pattern
   - Use inline styles throughout (no CSS modules)
   - Use CSS variables: var(--text), var(--text-weak), var(--border), var(--background-weak), var(--background-medium)

2. Register the route in `src/AsanaService.jsx`:
   - Add to `getRouteState()` mapping
   - Add to `SERVICE_NAV_URL` mapping
   - Add a `<Route path="/[route-name]" element={<[ScreenName]View />} />` in the Routes block

3. Add to `src/components/ServiceSecondaryNav.jsx`:
   - Add the nav item in the appropriate section
   - Match the existing `px-2 py-[2px]` wrapper pattern

4. Add any mock data to `src/data/[datafile].js`

Read CLAUDE.md for conventions before starting.
```

---

## Phase 2: Add a ticket detail side pane to a list view

**Goal**: Add a master-detail pattern where clicking a list row opens a side pane with ticket detail.

**Prompt**:

```
Add a ticket detail side pane to [ViewName] at /[route].

Read CLAUDE.md and SPEC.md. Look at EscalationsView.jsx as the reference implementation — it has the full pattern: list on left, TicketChatPanel side pane on right, hover-reveal more button on rows, close/route modals, and green confirmation banners.

Implement:
1. List view with hoverable rows — on hover, swap the rightmost column with a `⋯` more button (using the `hovered` state pattern from EscalationsView)
2. Click row → set `selectedId` state → render `<TicketChatPanel>` on the right
3. Pass `moreMenuItems` to TicketChatPanel with:
   - Request approval
   - Create ticket for HR
   - Route to HR (opens RouteToHRModal)
   - [divider]
   - Close ticket and move to Asana (opens CloseAndMoveModal)
4. After RouteToHR confirm: show yellow banner "Ticket routed to HR — [ticket title]"
5. After CloseAndMove confirm: show green banner "Ticket resolved — task created in IT Escalations — View in IT Escalations [link to /projects/it-escalations]"
6. Track `closedIds: Set` state to persist banner per ticket

Use existing components:
- `src/components/TicketChatPanel.jsx` (accepts moreMenuItems prop)
- `src/components/RouteToHRModal.jsx`
- `src/components/CloseAndMoveModal.jsx`

Read CLAUDE.md for conventions before starting.
```

---

## Phase 3: Add a new modal action

**Goal**: Add a new action to the ticket more menu with a modal confirmation and post-action banner.

**Prompt**:

```
Add a new ticket action: [ActionName].

Read CLAUDE.md and SPEC.md. Look at RouteToHRModal.jsx and CloseAndMoveModal.jsx as reference implementations — both follow the same Modal pattern.

1. Create `src/components/[ActionName]Modal.jsx`:
   - Import Modal, ModalButton from `src/components/ui/Modal.jsx`
   - Props: { open, ticket, onClose, onConfirm }
   - Use size="md" (520px)
   - Show ticket context block (id + title)
   - Include an info box explaining what the action does
   - Footer: Cancel + confirm button

2. Add the menu item to `TicketDetailHeader.jsx`:
   - In the more menu dropdown, add after existing items
   - Text color: `#1E1F21` (normal, not blue) unless it's a destructive action
   - Call `onNewAction?.()` on click

3. Wire up in `TicketDetailView.jsx`:
   - Add `showNewModal`, `actionDone` state
   - Pass `onNewAction={() => setShowNewModal(true)}` to TicketDetailHeader
   - Add banner when `actionDone` is true
   - Render `<[ActionName]Modal open={showNewModal} onConfirm={() => { setShowNewModal(false); setActionDone(true); }} />`

4. Add the same action to `TicketChatPanel`'s `moreMenuItems` in views that use it (EscalationsView, AgentMyTicketsView)

Read CLAUDE.md for conventions before starting.
```

---

## Phase 4: Add a new dashboard chart section

**Goal**: Add a new data visualization to the Dashboard.

**Prompt**:

```
Add a new chart section to DashboardView.jsx showing [metric].

Read CLAUDE.md. Look at the existing DashboardView.jsx chart sections as reference — they use Recharts, follow the shadow card style (borderRadius: 10, padding: 18px 20px, no border), and use 24px gaps between cards.

1. Add mock data to `src/data/dashboard.js`:
   - Export a new constant [DATA_CONST] with the shape needed for the chart

2. In `src/components/DashboardView.jsx`:
   - Import the new data
   - Add the chart inside the appropriate tab (Overview or Team or Insights)
   - Use Recharts components: ResponsiveContainer, BarChart/LineChart/PieChart as appropriate
   - Colors: use the BLUE/GREEN/AMBER/ROSE/PURPLE constants already defined in dashboard.js
   - Card style: `boxShadow: '0 1px 3px rgba(0,0,0,0.08)'`, `borderRadius: 10`, `padding: '18px 20px'`

3. If the chart needs a new section label:
   - Sentence case only
   - Font: 13px, fontWeight 500, color: var(--text), marginBottom: 16

Read CLAUDE.md for conventions before starting.
```

---

## Phase 5: Wire up a real AI planning agent

**Goal**: Add a real chat panel powered by the Anthropic Messages API with context-aware system prompt.

**Depends on**: A Node.js backend (add Express server — the current app has no backend).

**Prompt**:

```
Add an AI planning agent chat panel to the Service home and ticket views.

This requires adding an Express backend. Read SPEC.md (Future Vision: Phase 2) and CLAUDE.md first.

Backend (new /server directory):
1. Express server on port 3001, CORS for localhost:5173
2. POST /api/chat endpoint:
   - Accepts { messages, context: { screen, entityType, entityId } }
   - Assembles system prompt from context (screen name + entity summary)
   - Calls Anthropic Messages API (claude-sonnet-4-6) with tool use enabled
   - Tools: get_ticket(id), list_tickets(status?), search_kb(query), get_kb_article(id)
   - Each tool executor reads from the same mock data that the frontend uses (import the data files into the server)
   - Implements tool-use loop: call API → execute tool if tool_use → send tool_result → repeat → stream final text via SSE
3. Stream tool-use indicator events: `{ type: 'tool_use', tool: 'get_ticket', label: 'Reading ticket...' }`

Frontend:
1. Add a collapsible right-side chat panel (360px) to AsanaService.jsx layout
2. ChatPanel component:
   - Message list with streaming support (append tokens as they arrive from SSE)
   - Tool-use indicators: "Reading ticket..." muted text between user message and agent response
   - Text input with Cmd+Enter send
   - Context indicator at top: shows current screen/entity
3. On each send, include context from current route state

Keep the ANTHROPIC_API_KEY in .env on the server — never in frontend code.

Read CLAUDE.md for conventions before starting.
```

---

## Phase 6: Add KB article editor

**Goal**: Allow KB articles to be edited inline in the Knowledge Base view.

**Prompt**:

```
Add an article editor to KnowledgeBaseView.jsx at /knowledge-base/:articleId.

Read CLAUDE.md. Look at the existing ArticleDetailView.jsx as a starting point — it already renders article content. Extend it to support editing.

1. Add edit mode toggle button in the article header (pencil icon)
2. In edit mode:
   - Each content block (h2, p, li) becomes an editable field
   - Add block buttons: "+ Add paragraph", "+ Add heading", "+ Add list item"
   - Delete block (×) button appears on hover
3. Save button: writes back to the KB_ARTICLES array in memory (not persisted — prototype only)
4. Draft/Publish status toggle in the article header
5. KB Learnings panel: when editing, show the relevant learning (gap) for this article as a suggestion sidebar

When building the block editor, keep it simple — no rich text library needed. Plain textarea inputs for each block, auto-resizing to content height.

Read CLAUDE.md for conventions before starting.
```

---

## Rebuild from scratch

If rebuilding the entire app:

1. **Start with SPEC.md** — understand all screens, flows, and data model
2. **Start with CLAUDE.md** — all styling conventions, token names, component patterns
3. **Set up routing first** — `AsanaService.jsx` owns all routes; stub every screen with a placeholder
4. **Build NavBar + ModeSidebar first** — they appear on every screen
5. **Build ServiceSecondaryNav + WorkSecondaryNav** — drives navigation
6. **Build screens in order**: Tickets → KnowledgeBase → Dashboard → Optimize → Automations → Assets → Settings
7. **Add modals last** — RouteToHRModal, CloseAndMoveModal, SettingsModal follow the same pattern

Key invariants:
- All styles are inline — no CSS modules
- All icons are inline SVG paths
- All data is mock (src/data/)
- CSS variables for all colors (var(--text), var(--border), etc.)
- No icon library, no component library except shadcn/ui primitives in src/components/ui/
