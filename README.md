# FinBoard — Finance Dashboard

> Frontend developer internship assignment for **Zorvyn** · Built by Bhavesh Lakhwani

[Live Demo](https://finboard-zorvyn.netlify.app/)

---

## What I Built

A personal finance dashboard that lets users track transactions, understand spending patterns, and manage financial activity through a clean, responsive, and user-friendly dashboard experience.

The project goes beyond the stated requirements in three ways:
- Every feature decision was made with a real user in mind, not a checklist
- All state, styles, and components are hand-rolled — no UI libraries

---

## Quick Start

```bash
git clone https://github.com/yourusername/FinBoard
cd FinBoard
npm install
npm run dev
```

Opens at **http://localhost:5173**

---

## Feature Walkthrough

### Dashboard Overview

The first thing a user sees — designed to answer the three questions anyone has about their finances at a glance.

| Card | What it tells you |
|---|---|
| Total Balance | Net of all income minus all expenses |
| Monthly Income | Income this period with % change vs last month |
| Monthly Expenses | Spend this period with % change vs last month |
| Savings Rate | % of income saved, with a health indicator |

Below the cards: an **income vs expense area chart** over time, and a **category donut chart** showing where money is going. The layout was intentionally designed so the left chart answers "how am I trending?" and the right chart answers "where is it going?" — two distinct questions, side by side.

---

### Transactions

A full-featured transaction table with:

- **Live search** across description and category
- **Type filter** — All / Income / Expense pill switcher
- **Category dropdown** — all 12 categories
- **Date range** — from/to date picker
- **Sort** — newest, oldest, highest amount, lowest amount
- **CSV export** — exports the currently filtered view, not all data

Admin role unlocks inline add, edit, and delete actions on every transaction row.

---

### Insights

Three things most dashboards skip but users actually want:

- **Top spending category** with total amount and percentage of all expenses
- **Savings rate analysis** with contextual feedback ("Healthy" vs "Try to aim for 20%+")
- **Month-over-month comparison** — bar chart showing income vs expense per month
- **Category breakdown** — horizontal bar chart ordered by spend, colored per category

---

### Role-Based UI

Switchable via sidebar dropdown. Persisted to localStorage.

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard, charts, insights | ✅ | ✅ |
| Browse and filter transactions | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

---

## Tech Stack

| Tool | Why I chose it |
|---|---|
| **React 18** | Component model and hooks are the right fit for this state shape |
| **Vite** | Fastest dev server, minimal config |
| **Recharts** | Composable chart primitives that don't fight CSS |
| **Lucide React** | Consistent, lightweight icon set |
| **CSS Modules** | Scoped styles without a runtime, no className conflicts |
| **Context + useReducer** | Predictable state without Redux overhead for this scale |

**Zero UI component libraries.** Every card, modal, badge, table, and input is written from scratch — a deliberate choice to demonstrate that I can build production-quality UI components, not just assemble them.

---

## Architecture Decisions

**Why Context + useReducer instead of Zustand or Redux?**

The state shape here is a single flat store with clear action types. Zustand would be appropriate if the app grew to multiple independent feature slices. Redux would be overkill. useReducer gives the same predictability without the dependency.

**Why CSS Modules instead of Tailwind?**

Tailwind is excellent for rapid prototyping. CSS Modules were chosen here to demonstrate that I can write clean, maintainable styles from first principles. The design system is defined entirely in CSS variables on `:root`, making theme switching a one-attribute change on the document element.

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx          # Global state — transactions, role, theme, filters
│                               # useReducer with 8 action types, localStorage sync
├── data/
│   └── transactions.js         # 64 mock transactions · 5 months · 12 categories
├── utils/
│   └── helpers.js              # Pure functions: formatCurrency, groupByMonth,
│                               # groupByCategory, applyFilters, computeSummary
└── components/
    ├── ui/
    │   ├── Badge.jsx            # Income / expense type pill
    │   ├── Card.jsx             # Base surface component
    │   └── Modal.jsx            # Add / edit transaction dialog
    ├── dashboard/
    │   ├── Sidebar.jsx          # Desktop nav, role switcher, theme toggle
    │   ├── MobileNav.jsx        # Fixed bottom tab bar (mobile)
    │   ├── MobileHeader.jsx     # Sticky top bar (mobile)
    │   ├── DashboardView.jsx    # Main overview tab
    │   ├── SummaryCards.jsx     # 4 KPI cards with MoM delta
    │   ├── BalanceTrend.jsx     # Recharts AreaChart
    │   └── SpendingBreakdown.jsx# Recharts PieChart
    ├── transactions/
    │   ├── TransactionList.jsx  # Full table — search, filter, sort, export, CRUD
    └── insights/
        └── InsightsPanel.jsx    # Stat cards + BarCharts
```

---

## State Shape

```js
{
  transactions: Transaction[],   // persisted to localStorage
  role: 'viewer' | 'admin',      // persisted
  theme: 'dark' | 'light',       // persisted
  filters: {
    search: string,
    type: 'all' | 'income' | 'expense',
    category: string,
    dateFrom: string,
    dateTo: string,
    sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
  },
  activeTab: 'dashboard' | 'transactions' | 'insights',
  nextId: number                 // persisted
}
```

Actions: `SET_ROLE` · `TOGGLE_THEME` · `SET_TAB` · `SET_FILTER` · `RESET_FILTERS` · `ADD_TRANSACTION` · `UPDATE_TRANSACTION` · `DELETE_TRANSACTION`

---

## Responsiveness

| Breakpoint | Layout |
|---|---|
| ≥ 769px | Sidebar on left, scrollable main content |
| ≤ 768px | Sidebar hidden, sticky top header, fixed bottom nav |
| ≤ 480px | Summary cards 2-column, charts stack vertically |

---

## Mock Data

64 transactions from **November 2025 – March 2026** across 12 categories: Salary, Freelance, Rent, Food & Dining, Transport, Shopping, Entertainment, Healthcare, Utilities, Investment, Education, Travel. Intentionally varied to produce meaningful chart patterns.

---

## What I Would Add With More Time

- **Budget goals** — set a monthly limit per category, show progress bar and alert when close
- **Recurring transaction detection** — flag transactions that appear monthly at similar amounts
- **MSW mock API** to simulate network latency and loading states more realistically
- **E2E tests** with Playwright covering the critical user paths

---

*Built with care for the Zorvyn frontend internship assignment.*
