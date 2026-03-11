# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run lint       # ESLint
npm run deploy     # Build + publish to gh-pages branch
```

Deploy always goes to the `gh-pages` branch of `https://github.com/anubhutijain-code/asana-service-prototype`.

## Architecture

**Stack**: Vite + React 19, Tailwind CSS v4, React Router v7, Recharts. No test framework.

**Entry**: `src/main.jsx` → `src/App.jsx` → `src/AsanaService.jsx`

### Layout (`src/AsanaService.jsx`)
Single root component that owns all routing and layout. Uses `position: fixed; inset: 0` with absolute-positioned layers:
- NavBar: `top-0, h-12, z-50`
- ModeSidebar: `left-0, w-16` (icon-only mode switcher)
- ServiceSecondaryNav / WorkSecondaryNav: `left-16, w-[182px]`
- Main content: fills remaining space, adjusts `left` based on sidebar state

**Role system**: `role` state in AsanaService controls which secondary nav and home route to use. Roles: `agent`, `agent2`, `agent3`, `admin`, `admin2`. Default: `admin2`. On mount, `useEffect` navigates to the role's home route.

**Routing**: URL-to-state mapping via `getRouteState()`. Navigation via `useNavigate`. The `/home` route (admin2) renders `UnifiedHomeView` with Service + CWM tabs. All other roles use plain `HomeView` at `/`.

### Data (`src/data/`)
All mock data lives here — no API calls. Key files:
- `tickets.js` — TICKETS array, STATS, filterTickets()
- `dashboard.js` — TEAM_DATA, TICKET_TOPICS
- `optimize.js` — OPTIMIZE_GAPS keyed by tab id: `content | action | data | cx`

### Styling conventions
- **Design tokens** in `src/styles/tokens.css`, consumed as CSS vars (`var(--text)`, `var(--border)`, etc.)
- **Tailwind v4** via `@import "tailwindcss"` — used mainly for layout utilities in AsanaService.jsx; most component styles are inline
- **All inline styles** for component-level CSS — no CSS modules or styled-components
- **No icons library** — all icons are inline SVG paths
- **SVG viewBox trick**: set viewBox to the path's actual coordinate region to clip/scale without translation
- **`fill="currentColor"`** on nav icons so active/hover text color applies

### KPI card design (consistent across all pages)
Shadow card (no border), `borderRadius: 10`, `padding: 18px 20px`. Big numbers: SF Pro Display, `fontSize: 48`, `fontWeight: 400`, `lineHeight: 56px`, `letterSpacing: 0.35px`, `color: var(--neutrals-lm-text, var(--Default-text, #1E1F21))`. Label: 12px text-weak above. Sub/trend: 12px below.

### Selected state pattern
Use `background: var(--background-medium)` for selected list items — no blue border or blue background. (Matches EscalationsView pattern.)

### Section labels
Sentence case only — never uppercase, no `textTransform` or `letterSpacing` on labels.

### Card spacing
24px gap between cards and between grid sections across all dashboard/home pages.

### UI primitives (`src/components/ui/`)
`Modal.jsx` — sizes: `sm=400, md=520, lg=640, xl=800`. `Button.jsx`, `Badge.Badge`, `Avatar.jsx`, `FilterPanel.jsx`.

---

## Product philosophy

This is a prototype of an AI-powered IT service management tool — think Asana meets a help desk. The product sits inside Asana's navigation shell (NavBar + ModeSidebar) and adds a **Service mode** for IT/HR operations teams.

**Core premise**: AI handles the routine (triage, routing, KB deflection, automation), humans handle judgment calls. The UI should make the AI's work visible and auditable, not hide it.

**Audience**: IT admins and agents inside companies already using Asana for work management. They expect Asana-quality polish.

---

## Design decisions (established)

### Layout philosophy
- **Left-aligned, full-width content** — no max-width centering on content pages. Use `padding: '32px 32px 64px'` as the standard page inset. Content (grids, charts, tables) scales to fill available width. This matches AssetsView as the reference pattern.
- **Exception**: modals and side panels have fixed widths.

### Secondary nav
- **Consistent item spacing**: `px-2 py-[2px]` on every nav item wrapper — both `ServiceSecondaryNav` and `WorkSecondaryNav`. This gives 4px gaps between items.
- Nav width: `w-[182px]`, background: `bg-background-medium`.

### KPI cards
- Shadow card style (no border): `borderRadius: 10`, `padding: 18px 20px`, `boxShadow` with hover lift.
- Big number: SF Pro Display, `fontSize: 48`, `fontWeight: 400`.
- Trend/sub-label: 12px, below the number.
- All KPI cards across pages (Overview, Team, Assets) should use this same pattern for visual consistency.

### List views vs card views
- **Prefer list rows over cards** for browsable content (gaps, tickets, automations). Cards are for summary/stat content only.
- List row standard: `height: 48px`, `display: flex, alignItems: center`, metadata pills on the left, title flex-1 truncated, secondary info + chevron on the right.
- The **Optimize page** uses list rows (not cards) for gap items.

### Dashboard
- Two tabs: **Overview** (metrics, charts) and **Team** (workload timeline).
- The `DashboardView` component accepts `hideTabs` + `initialTab` props so it can be embedded in other pages (e.g. the unified home renders Team tab inline).
- Chart grid uses 24px gaps.

### Dark mode readiness
- All colors are CSS variables in `src/styles/tokens.css`. Dark mode = add `[data-theme="dark"]` block with dark values. No component changes needed except ~15 hardcoded hex values (`#1E1F21`, `#9ea0a2`, `#9CA3AF`, etc.) scattered across components that would need to become tokens.

### Settings page
- Two-panel layout: list of settings on the left (55% when panel open, 100% otherwise), detail/edit panel on the right. Sections use `Section` + `InlineRow` / `SettingRow` primitives.
- Five tabs: General, Integrations, Knowledge Base, AI, Automations.

### Optimize page
- Four tabs: Content gaps, Action gaps, Data gaps, AI CX ratings.
- Master-detail layout: 380px list pane on left, detail panel fills right.
- First item auto-selected on tab change.
- Gap items are **list rows**, not cards (see list views rule above).

### Automations page
- Card grid for browsing. Toggle switches for enable/disable.
- Sections: Featured, IT Queue, Cross-team, HR Queue.

### Workflow for shipping
```
git add . && git commit -m "short date or description" && npm run deploy
```
Commits go to `gh-pages` branch. Deploy runs `vite build && gh-pages -d dist`.
