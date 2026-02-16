# ServicePro Codebase Cleanup Plan

## Overview

This document outlines the phased approach to cleaning up the ServicePro codebase, fixing critical issues, and ensuring all features work correctly.

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Customers API | **BROKEN** | Database missing columns |
| Jobs API | Partially Working | Dispatch works, but schema mismatch |
| Estimates API | Working | Minor issues |
| Invoices API | Working | Minor issues |
| Dispatch Board | Working | Recent improvements made |
| Dashboard | Working | Customer count shows error |
| Sales/Leads | **BROKEN** | Depends on customer status columns |

---

## Phase 1: Database Schema Fixes (CRITICAL)

### Priority: IMMEDIATE

The database schema doesn't match what the API routes expect. A migration file has been created:

**File:** `supabase/migrations/002_add_missing_columns.sql`

### Steps to Apply:

1. **Option A - Supabase Dashboard:**
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `002_add_missing_columns.sql`
   - Run the migration

2. **Option B - Supabase CLI:**
   ```bash
   npx supabase db push
   ```

### Columns Being Added:

| Table | New Columns |
|-------|-------------|
| customers | status, lead_status, source, estimated_value, service_type, service_date, last_contact_date, assigned_to, address, custom_fields |
| jobs | scheduled_date, scheduled_time, estimated_duration, address, custom_fields |
| estimates | line_items, issue_date, expiry_date, address |
| invoices | line_items, payments, amount_due, address |

---

## Phase 2: API Route Cleanup

### Priority: HIGH

After database migration is applied:

### 2.1 Customers API (`/api/customers/`)
- [x] Fields align with database
- [ ] Add input validation for status enums
- [ ] Add proper error codes
- [ ] Remove console.log statements in production

### 2.2 Jobs API (`/api/jobs/`)
- [x] Basic CRUD working
- [ ] Validate status values
- [ ] Add scheduled_date/scheduled_time handling

### 2.3 Dispatch API (`/api/dispatch/`)
- [x] PATCH working for drag-drop
- [x] 15-minute time granularity
- [x] Optimistic updates
- [ ] Add validation

### 2.4 Estimates API (`/api/estimates/`)
- [x] Basic CRUD working
- [ ] Add line_items validation
- [ ] Validate status transitions

### 2.5 Invoices API (`/api/invoices/`)
- [x] Basic CRUD working
- [ ] Add payments tracking
- [ ] Calculate amount_due automatically

---

## Phase 3: Feature Folder Restructuring

### Priority: MEDIUM

Current issues with feature organization:

### 3.1 Leads Feature (`/features/leads/`)
```
Current:
├── components/
├── hooks/
├── actions/
├── types.ts
└── index.ts

Missing:
├── queries/  ← Need to extract from hooks
```

### 3.2 Customer Detail Feature (`/features/customer-detail/`)
- Review for compliance with file limits
- Extract queries if embedded in hooks

### 3.3 Other Features to Audit:
- [ ] `/features/reports/`
- [ ] `/features/calendar/`
- [ ] `/features/dispatch/` (in components folder, should be feature)

---

## Phase 4: Code Quality

### Priority: MEDIUM

### 4.1 Remove Dead Code
- [ ] `/app/api/customers/data.ts` - Mock data file (unused)
- [ ] `/app/api/jobs/data.ts` - Mock data file (unused)
- [ ] `/app/api/estimates/data.ts` - Mock data file (unused)
- [ ] Any other unused mock data files

### 4.2 Fix Type Safety Issues
- [ ] Supabase join typing (already partially fixed)
- [ ] Add proper return types to all API routes
- [ ] Remove `any` types where possible

### 4.3 Console Logging
- [ ] Replace `console.error` with proper logging service
- [ ] Remove debug `console.log` statements

---

## Phase 5: UI/UX Improvements

### Priority: LOW (after functionality is fixed)

### 5.1 Dispatch Board
- [x] 15-minute drop zones
- [x] Map toggle button
- [x] No auto-refresh (manual only)
- [ ] Improve job card design (ongoing)
- [ ] Add current time indicator line

### 5.2 Customer Pages
- [ ] Fix loading states
- [ ] Add error boundaries
- [ ] Improve search performance

### 5.3 Forms
- [ ] Add client-side validation
- [ ] Improve error messages
- [ ] Add loading indicators during submit

---

## Phase 6: Testing & Documentation

### Priority: LOW (after all fixes)

### 6.1 Testing
- [ ] Add API route tests
- [ ] Add component tests for critical flows
- [ ] Add E2E tests for main user journeys

### 6.2 Documentation
- [ ] Update README
- [ ] Add API documentation
- [ ] Document environment setup

---

## File Limits Reference

Per CLAUDE.md guidelines:

| File Type | Max Lines |
|-----------|-----------|
| Page | 50 |
| Component | 150 |
| Hook | 100 |
| Query | 80 |
| Action | 80 |
| types.ts | 150 |
| index.ts | 30 |

---

## Quick Fixes Completed

1. ✅ Disabled auto-refresh on dispatch (was 30s, now 0)
2. ✅ Added 15-minute drop zone granularity
3. ✅ Fixed Map import conflict in TimelineView
4. ✅ Added map toggle button
5. ✅ Fixed Supabase join typing in multiple API routes
6. ✅ Fixed AddLeadModal useCreate hook typing

---

## Next Steps

1. **Run the database migration** (Phase 1)
2. **Test customers page** after migration
3. **Test leads/sales page** after migration
4. **Proceed with Phase 2-6** as needed

---

## Contact

For questions about this cleanup plan, refer to:
- `CLAUDE.md` - Development guidelines
- `~/.claude/guides/` - Reference guides
