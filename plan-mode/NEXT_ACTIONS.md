# Next Actions - ServicePro

## IMMEDIATE ACTION REQUIRED

### Step 1: Apply Database Migration

The customers page is broken because the database is missing columns.

**Run this SQL in Supabase Dashboard → SQL Editor:**

```sql
-- Add status and lead tracking to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS lead_status TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10,2);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS service_date DATE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS assigned_to UUID;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- Add scheduling fields to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS scheduled_time TIME;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 60;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- Add line_items to estimates
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]';
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS expiry_date DATE;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS address TEXT;

-- Add line_items and payments to invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payments JSONB DEFAULT '[]';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS amount_due DECIMAL(10,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS address TEXT;
```

---

## After Migration - Verify These Pages Work:

1. [ ] `/customers` - Customer list should load
2. [ ] `/customers/new` - Should be able to create customer
3. [ ] `/sales` - Leads page should load
4. [ ] `/jobs/dispatch` - Already working
5. [ ] `/dashboard` - Customer count should show

---

## Known Issues Still to Fix

### High Priority
1. **Delete unused mock data files:**
   - `app/api/customers/data.ts`
   - `app/api/jobs/data.ts`
   - `app/api/estimates/data.ts`

2. **Leads feature needs queries folder**

### Medium Priority
1. Add input validation to API routes
2. Add proper error handling with codes
3. Review all files against line limits

### Low Priority
1. Add tests
2. Update documentation
3. UI polish

---

## Files Changed Today

| File | Change |
|------|--------|
| `hooks/use-dispatch-data.ts` | Removed auto-refetch after job update |
| `hooks/use-timeline-dnd.ts` | 15-minute time parsing |
| `components/dispatch/views/timeline/constants.ts` | Added TIME_SLOTS, SLOT_WIDTH |
| `components/dispatch/views/timeline/TechnicianRow.tsx` | 15-minute drop zones |
| `components/dispatch/views/timeline/UnassignedRow.tsx` | 15-minute drop zones |
| `components/dispatch/views/timeline/TimelineView.tsx` | Map toggle button |
| `components/dispatch/views/timeline/TimelineHeader.tsx` | Simplified (no sidebar) |
| `types/dispatch.ts` | refreshInterval default: 0 |
| `features/leads/components/AddLeadModal.tsx` | Fixed useCreate hook |
| Multiple API routes | Fixed Supabase join typing |

---

## How to Continue Development

1. Always check `plan-mode/CLEANUP_PLAN.md` for phase status
2. Update this file as tasks are completed
3. Follow file limits in CLAUDE.md
4. Run build before committing: `npm run build`
