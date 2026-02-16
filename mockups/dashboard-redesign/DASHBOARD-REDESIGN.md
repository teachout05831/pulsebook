# Dashboard Redesign - Game Plan

## Vision

Replace the current stats-only dashboard with an **activity-driven, card-based command center** that gives business owners a real-time glimpse of everything happening in their company — without clicking into separate pages. Mobile-friendly, universal for any service company.

---

## Current State (What Exists)

- 4 stat cards (Customers, Active Jobs, Pending Estimates, Unpaid Invoices)
- Quick Actions buttons (New Job, New Estimate, Add Customer)
- 2 summary text cards (Customers count, Jobs count)
- **Problem**: Numbers-only, no context, requires clicking away to understand anything

---

## New Dashboard Requirements

### Top Stats Strip (compact)
| Stat | Description |
|------|-------------|
| Jobs This Month | Total booked jobs count + revenue |
| Jobs Today | Today's scheduled jobs count |
| Avg Job Value | Average job value this month |
| Revenue This Month | Total revenue from completed/paid jobs |

### Core Sections

#### 1. Booked Jobs (Card-Based)
- Shows recent booked jobs as **customer cards**
- Each card shows: customer name, service type, scheduled date, price, assigned tech
- Click card → popup with full job details
- "View All" link to jobs page

#### 2. Lead Pipeline Flow
- Visual flow showing leads at each stage: New → Contacted → Qualified → Proposal → Won/Lost
- Each stage shows customer cards (name, source, value)
- Click card → popup with lead details and history
- Shows where each lead is in the sales cycle at a glance

#### 3. Quotes/Estimates
- Recent estimates sent and their status
- Cards: customer name, estimate amount, status (draft/sent/approved/declined)
- Click → popup with estimate details

#### 4. Cancellations
- Recent cancelled jobs with reason
- Cards: customer name, job, cancellation date, reason
- Quick visibility into churn

#### 5. Sales Leaders (This Month)
- Ranked list of team members by performance
- Shows: name, jobs booked count, total revenue
- Click name → popup showing their individual leads/jobs
- Progress bar visualization

#### 6. Top Referral Sources
- Ranked by volume this month
- Shows: source name, lead count, booked count, revenue
- Bar chart or horizontal progress bars

#### 7. Revenue Chart
- 12-month bar chart of monthly revenue
- Toggle: 12 months vs 30 days
- Clean, minimal design

---

## Mobile-First Approach

### Mobile Layout (< 768px)
- Single column, scrollable feed
- Stats strip becomes 2x2 grid
- Sections stack vertically
- Cards are full-width, swipeable within sections
- Popups become bottom sheets
- Collapsible sections with chevron toggle

### Tablet Layout (768px - 1024px)
- 2-column grid for main sections
- Stats strip remains horizontal
- Cards in 2-column grid within sections

### Desktop Layout (> 1024px)
- Full dashboard grid layout
- Stats strip horizontal
- Main content in 2-3 column bento grid
- Popups are centered modals

---

## Popup/Detail Experience

When clicking any card, a modal/sheet opens showing:

### Lead Popup
- Customer name, contact info
- Lead source
- Current stage in pipeline
- Activity timeline (calls, emails, notes)
- Assigned salesperson
- Actions: Update status, Add follow-up, Convert to job

### Job Popup
- Customer name, contact info
- Job details (service, date, time, address)
- Assigned technician
- Price/estimate
- Job status
- Actions: View full job, Reschedule, Update status

### Sales Leader Popup
- Team member name
- Stats: leads claimed, jobs booked, revenue, conversion rate
- List of their recent leads with statuses
- List of their booked jobs

---

## 5 Design Concepts

### Design 1: "Activity Feed"
- Hero: scrollable activity feed of recent events (customer cards)
- Side: stats + sales leaders
- Feel: Social media feed meets business dashboard

### Design 2: "Pipeline & Cards"
- Hero: horizontal pipeline with draggable stages
- Below: booked jobs cards + revenue chart
- Feel: CRM-forward, sales-focused

### Design 3: "Bento Grid"
- Modular grid of widgets, each section a tile
- Cards within tiles, compact but informative
- Feel: Modern SaaS dashboard, iOS widget-like

### Design 4: "Mobile-First Timeline"
- Vertical timeline of today's activity
- Customer cards inline with timeline
- Stats floating at top
- Feel: Chat app meets dashboard, great on mobile

### Design 5: "Command Center"
- Split: left panel (live activity), right panel (metrics + charts)
- Dense information, everything visible
- Feel: Dispatch/operations center

---

## Data Sources (Tables)

| Section | Primary Table | Joins |
|---------|--------------|-------|
| Booked Jobs | `jobs` (status=scheduled/in_progress) | `customers` for name/details |
| Lead Pipeline | `customers` (status=lead) | `team_members` for assigned |
| Quotes | `estimates` | `customers` for name |
| Cancellations | `jobs` (status=cancelled) | `customers` for name |
| Sales Leaders | `team_members` + `jobs` + `customers` | Aggregate by team member |
| Top Referrals | `customers` (lead_source field) | Aggregate by source |
| Revenue | `invoices` (status=paid) or `jobs` (completed) | Aggregate by month |
| Stats | Various aggregates | - |

---

## Implementation Phases

### Phase 1: API + Data Layer
- Create dashboard-specific API route (`/api/dashboard`)
- Single endpoint that returns all dashboard data in one call
- Aggregations computed server-side for performance

### Phase 2: Core Components
- DashboardStatsStrip
- CustomerCard (reusable across all sections)
- JobCard
- LeadCard
- SectionContainer (collapsible on mobile)
- DetailPopup (modal/bottom sheet)

### Phase 3: Dashboard Sections
- BookedJobsSection
- LeadPipelineSection
- QuotesSection
- CancellationsSection
- SalesLeadersSection
- TopReferralsSection
- RevenueChartSection

### Phase 4: Interactivity
- Popup/modal system for card details
- Section collapse/expand on mobile
- Pull-to-refresh
- Auto-refresh interval (30s or 60s)

---

## Files to Create

```
features/dashboard/
├── components/
│   ├── DashboardPage.tsx          # Main dashboard layout
│   ├── StatsStrip.tsx             # Top stats (4 metrics)
│   ├── BookedJobsSection.tsx      # Booked jobs cards
│   ├── LeadPipelineSection.tsx    # Lead flow visualization
│   ├── QuotesSection.tsx          # Recent estimates
│   ├── CancellationsSection.tsx   # Cancelled jobs
│   ├── SalesLeadersSection.tsx    # Team performance
│   ├── TopReferralsSection.tsx    # Referral sources
│   ├── RevenueChart.tsx           # Revenue bar chart
│   ├── CustomerCard.tsx           # Reusable customer card
│   ├── JobCard.tsx                # Reusable job card
│   ├── DetailPopup.tsx            # Modal for card details
│   └── SectionContainer.tsx       # Collapsible section wrapper
├── hooks/
│   ├── useDashboardData.ts        # Fetch all dashboard data
│   └── useDashboardRefresh.ts     # Auto-refresh logic
├── queries/
│   └── getDashboardData.ts        # Server query for dashboard
├── types.ts
└── index.ts
```
