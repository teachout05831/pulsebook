# Sales Lead Detail Page - Design Mockups

## Purpose
These mockups are design concepts for the **Sales Lead Detail Page** - the main CRM view when viewing/managing an individual sales lead or customer record.

## What This Page Does
- View and manage a single lead/customer
- Communication center: Notes, Email, Call, Text
- Activity timeline showing all interactions
- Lead information sidebar (customizable per service type)
- Pipeline status tracking
- Follow-up creation

## Design Concepts

| File | Concept Name | Description |
|------|--------------|-------------|
| `sales-designs-index.html` | **Index** | Start here - overview of all designs with previews |
| `sales-concept-a.html` | **Communication-First** | Message composer at top, timeline feed below, right sidebar |
| `sales-concept-b.html` | **Action-Oriented** | Horizontal pipeline, prominent action buttons, vertical timeline |
| `sales-concept-c.html` | **Split Panel** | 50/50 split - chat-style left, dark details panel right |
| `sales-concept-d.html` | **Dashboard Cards** | Modern card-based design with gradient accents |
| `sales-concept-e.html` | **Compact CRM** | Closest to original design, clean minimal with improved UX |

## How to View
Open any `.html` file directly in your browser. Start with `sales-designs-index.html` to see all options.

## Key Features in All Designs
- ✅ Communication tabs (Note, Email, Call, Text)
- ✅ Generic info sidebar (works for Moving, Cleaning, any service)
- ✅ Custom fields section (configurable per service type)
- ✅ Activity timeline with filters
- ✅ Follow-up creation button
- ✅ Send Estimate action
- ✅ Lead pipeline/status tracking

## Related Files
- Route: `/sales` or `/customers/[id]?tab=sales`
- Components: `features/customer-detail/components/tabs/SalesTab.tsx`
- Types: `features/leads/types.ts`
