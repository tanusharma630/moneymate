# MoneyMate

MoneyMate is the frontend for a personal finance operating system —
dashboard, income, expenses, budget planning, savings goals, borrow & lend,
reports, an AI-styled financial coach, and settings.

This repo is the **frontend only**. It's built to plug into a future
Node/Express + MongoDB + JWT backend without any structural changes — see
[Backend integration](#backend-integration) below.

## Tech stack

- **React 19** + **Vite** — app shell and build tooling
- **Tailwind CSS** — styling, with a project-specific design system (see
  `tailwind.config.js`)
- **React Router DOM** — routing
- **Recharts** — the analytics chart
- **Lucide React** — icons
- **Framer Motion** — subtle entrance/hover/drawer animations
- **React Hook Form + Zod** — the Settings form
- **TanStack Query** — data fetching layer (see `src/services` /
  `src/hooks/useTransactionsQuery.js` for the pattern)
- **Axios** — HTTP client, pre-wired for JWT auth headers
- **Context API** — app-wide UI state (`src/context/AppContext.jsx`)

## Getting started

```bash
npm install
npm run dev      # starts the dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint      # eslint
```

Copy `.env.example` to `.env.local` if you want to point `VITE_API_BASE_URL`
somewhere other than `http://localhost:4000/api`.

## Project structure

```
src/
  assets/            static assets
  components/
    layout/          Sidebar, Navbar, MobileNav, Layout — the app shell
    dashboard/        section components that compose cards + data for the dashboard
    charts/            AnalyticsChart, Sparkline
    forms/             ProfileSettingsForm, FormField
    tables/             TransactionsList
    cards/              SummaryCard, StatCard, BudgetCard, GoalCard, TransactionCard, LendCard, CoachCard
    ui/                 Card, Button, Badge, ProgressRing, ProgressBar, Skeleton — base primitives
    common/             SectionTitle, PageHeader, SearchBar, EmptyState, LogoMark
  pages/                one folder per route (Dashboard, Income, Expenses, Budget,
                         Goals, BorrowLend, Reports, Settings), each with an index.jsx
  hooks/                useCountUp, useMediaQuery, useDisclosure, useInitialLoad,
                         useTransactionsQuery
  context/              AppContext (Context API)
  services/             apiClient (Axios), queryClient (TanStack Query),
                         transactionsService (mock-now/real-later pattern)
  utils/                cn, formatters, status, iconMap, monogram,
                         transactionSelectors, schemas/
  constants/            routes, nav, theme
  data/                 mock data, one file per domain
  types/                JSDoc type index (project is JS, not TS)
  routes/               AppRoutes.jsx
  App.jsx
  main.jsx
```

## Design system

Colors, radii, and fonts are defined once in `tailwind.config.js` and again
as literal hex values in `src/constants/theme.js` (`THEME`) — Tailwind
classes can't be used inside Recharts/SVG props, so `THEME` is the source of
truth wherever a raw color string is required. Keep both in sync if the
palette changes.

- Border radius: `rounded-card` (14px) for cards/widgets, `rounded-chip`
  (10px) for icon tiles/inputs, `rounded-full` for pills.
- Type: Inter for UI text, JetBrains Mono (`.mono` utility class) for every
  number, so figures read as data rather than decoration.

## Backend integration

`src/services/apiClient.js` is a configured Axios instance that already
attaches a JWT from `localStorage` to every request. `src/services/
transactionsService.js` shows the intended pattern: a `USE_MOCK` flag that
currently resolves local mock data and, once flipped to `false`, calls the
real endpoint instead — no changes needed in the hook or component that
consumes it (`useTransactionsQuery`). Repeat that pattern for income,
expenses, budget, goals, and borrow/lend as those endpoints come online.

## Mock data

Every page reads from `src/data/*.js` — nothing is hardcoded inside a
component. Replacing a data file's contents (or wiring its consumer through
a service + query hook, per the pattern above) is enough to swap mock data
for real data.
