# Estimate Process Redesign - Design Document

## Executive Summary

This document outlines the redesign of the estimate process to create a powerful yet simple experience that works across any service type (moving, HVAC, plumbing, cleaning, etc.). The design emphasizes:

- **Universal flexibility** - Works for any service business
- **Mobile-first** - Fully responsive on all devices
- **Customer-facing preview** - Professional PDF-like preview with e-signature
- **Three-column layout** - Quote Info | Job Details | Pricing (collapses on mobile)
- **Seamless conversion** - Estimate → Job → Invoice flow

---

## Research Findings

### Industry Best Practices (Sources)

From analyzing leading service software ([MoveitPro](https://blog.moveitpro.com/best-moving-company-software-in-2025-features-pricing-and-comparisons), [Supermove](https://www.supermove.com/), [Movegistics](https://movegistics.com)):

1. **Instant Quoting** - Real-time price calculation as items are added
2. **Visual Estimating** - Mobile tablet support for on-site estimates
3. **Digital Signatures** - E-signature with [legally valid workflows](https://www.onespan.com/blog/best-practices-building-your-e-signature-workflow)
4. **Customer Portal** - Shareable links for approval without login
5. **Automated Workflows** - SMS/email reminders, status updates
6. **Multi-stop Support** - For moving/delivery services
7. **Custom Fields** - Configurable per service type

---

## Core Architecture

### Data Model Enhancement

```typescript
// Enhanced Estimate Types
interface Estimate {
  id: string;
  companyId: string;
  customerId: string;
  estimateNumber: string;

  // Status & Workflow
  status: 'draft' | 'sent' | 'viewed' | 'approved' | 'declined' | 'expired' | 'converted';
  convertedToJobId?: string;

  // Quote Info (Left Column)
  type: 'hourly' | 'flat' | 'per_unit';
  bindingType: 'binding' | 'non_binding';
  source: string;           // How lead came in
  salesPersonId?: string;
  estimatorId?: string;
  branchId?: string;
  tags: string[];
  leadStatus: string;

  // Service Details (Middle Column)
  serviceType: string;      // Moving, HVAC, Cleaning, etc.
  locations: EstimateLocation[];
  scheduledDate?: string;
  scheduledTime?: string;

  // Custom Fields (Universal)
  customFields: Record<string, any>;

  // Pricing (Right Column)
  lineItems: EstimateLineItem[];
  laborDetails?: LaborDetails;
  discounts: Discount[];
  fees: Fee[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;

  // Notes (Multiple Types)
  internalNotes: string;    // Office only
  customerNotes: string;    // Visible to customer
  crewNotes: string;        // For field team

  // Tasks
  tasks: EstimateTask[];

  // Preview & Approval
  previewToken: string;     // Unique shareable link
  previewUrl: string;
  viewedAt?: string;
  approvedAt?: string;
  signatureData?: string;   // E-signature image

  // Timestamps
  issueDate: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

interface EstimateLocation {
  id: string;
  type: 'origin' | 'destination' | 'stop' | 'service_location';
  label: string;            // "Office", "Origin", "Destination"
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType?: string;    // House, Apartment, Office
  accessNotes?: string;     // Stairs, elevator, etc.
  coordinates?: { lat: number; lng: number };
}

interface LaborDetails {
  truckCount: number;
  crewSize: number;
  estimatedHours: number;
  hourlyRate: number;
}

interface EstimateTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: string;
}

interface Discount {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
  reason: string;
}

interface Fee {
  id: string;
  name: string;
  amount: number;
  taxable: boolean;
}
```

---

## Template Designs

### Template 1: Classic Three-Column (Desktop-First)
*Best for: Office staff, detailed estimates*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Estimate - #67550                    [🕐] [📋] [🔄] [ Send Estimate ▾ ]      │
├─────────────────┬───────────────────────────────────┬───────────────────────┤
│ ⓘ Quote Info    │ 🚛 Jobs                      [+]  │ [ Recalculate ]  [≡] │
│ ● Opportunity   │                                   │                      │
│                 │ ┌─────────────────────────────┐   │ 1 Bed Apt (600 SQFT) │
│ Number   67550  │ │ Job 67550-1                 │   │ 432 CuFT  3024 lb    │
│ Type     Local  │ │ ✓ Moving  Feb 1, 2026      │   │ + Add rooms          │
│ Source   Equate │ │           $425.00           │   │                      │
│ Sales    Dan... │ └─────────────────────────────┘   │ ─────────────────── │
│ Estimator ...   │                                   │ Inventory is Empty   │
│ Branch   ARM    │ 📍 Stops  Map                     │ Add your first item  │
│ Region   None   │                                   │                      │
│ Tags     [+]    │ ● Office  1237 S Val Vista Dr    │ 🚛1  👥2  2h  $150/hr │
│ Lead Status ... │ ● Origin  Chandler, AZ  House    │                      │
│                 │ ● Dest    Phoenix, AZ   Town     │ ESTIMATE TYPE         │
│ ─────────────── │ ● Office  1237 S Val Vista Dr    │ Hourly ▾  Non-Binding│
│ ☰ Tasks    [+]  │                                   │                      │
│ No Tasks Added  │ ─────────────────────────────     │ Moving Services $300 │
│ Add your first  │ [Internal][Customer*][Crew][📝]  │ Materials        -   │
│                 │ Note (Visible to office only)     │ Additional       -   │
│ ─────────────── │ ┌───────────────────────────┐    │ Trip Fee       $125  │
│ 📄 Estimates [+]│ │ Please click to edit      │    │ Valuation        -   │
│ No Events Added │ │                           │    │ ─────────────────── │
│ Add your first  │ │                           │    │ Subtotal      $425   │
│                 │ │                           │    │ Discount (15%)  -$64 │
│                 │ └───────────────────────────┘    │ Sales Tax        -   │
│                 │                                   │ CC Fee        $25.35 │
│                 │                                   │ ─────────────────── │
│                 │                                   │ Est. Total    $425   │
│                 │                                   │ Payments      $0     │
│                 │                                   │ Balance       $425   │
│                 │                                   │                      │
│                 │                                   │ ████████████████████ │
│                 │                                   │ Moving       $425.00 │
│                 │                                   │ Est. Price:  $425.00 │
└─────────────────┴───────────────────────────────────┴───────────────────────┘
```

**Key Features:**
- Collapsible left sidebar on smaller screens
- Sticky pricing summary on scroll
- Quick-action buttons in header
- Tab-based notes system
- Real-time price recalculation

---

### Template 2: Mobile-First Card Stack
*Best for: On-site estimating, tablet use*

```
┌─────────────────────────────────┐
│ ← Estimate #67550   ● Pending   │
│     for John Smith              │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 💰 TOTAL                    │ │
│ │                             │ │
│ │    $425.00                  │ │
│ │                             │ │
│ │ [ Send to Customer ]        │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📍 SERVICE LOCATION             │
│ ┌─────────────────────────────┐ │
│ │ Origin: Chandler, AZ 85225  │ │
│ │ Dest: Phoenix, AZ 85044     │ │
│ │ [View on Map]               │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📅 SCHEDULE                     │
│ ┌─────────────────────────────┐ │
│ │ Feb 1, 2026  •  8am - 12pm  │ │
│ │ 🚛 1 Truck  👥 2 Crew  ⏱ 2h │ │
│ └─────────────────────────────┘ │
│                                 │
│ 💵 PRICING                      │
│ ┌─────────────────────────────┐ │
│ │ Moving Services    $300.00  │ │
│ │ Trip Fee           $125.00  │ │
│ │ ─────────────────────────── │ │
│ │ Subtotal           $425.00  │ │
│ │ Tax (0%)              $0.00 │ │
│ │ ─────────────────────────── │ │
│ │ TOTAL              $425.00  │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📝 NOTES                        │
│ ┌─────────────────────────────┐ │
│ │ [Internal] [Customer] [Crew]│ │
│ │                             │ │
│ │ Customer has a piano on 2nd │ │
│ │ floor. Will need specialty  │ │
│ │ equipment.                  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ☰ MORE OPTIONS                  │
│   ├─ Quote Info                 │
│   ├─ Tasks (0)                  │
│   ├─ Inventory                  │
│   └─ History                    │
│                                 │
│ [  Edit Estimate  ]             │
│ [  Convert to Job ]             │
└─────────────────────────────────┘
```

**Key Features:**
- Card-based progressive disclosure
- Swipe gestures for actions
- Expandable sections
- Bottom action buttons (thumb-friendly)
- Quick total visibility at top

---

### Template 3: Universal Service Template
*Best for: Non-moving services (HVAC, plumbing, cleaning)*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Estimate - #12345                              [ Preview ] [ Send ] [ ⋮ ]  │
├─────────────────┬───────────────────────────────────────────────────────────┤
│ Customer Info   │                                                           │
│                 │  SERVICE DETAILS                                          │
│ 👤 John Smith   │  ┌─────────────────────────────────────────────────────┐ │
│ 📞 (555) 123-..│  │ Service Type: HVAC Repair                           │ │
│ 📧 john@...    │  │ Scheduled: Feb 15, 2026 at 9:00 AM                  │ │
│                 │  │                                                     │ │
│ Service Address │  │ 📍 123 Main Street, Phoenix, AZ 85001               │ │
│ 123 Main St    │  │    [View on Map]                                    │ │
│ Phoenix, AZ    │  │                                                     │ │
│ [View Map]     │  │ Property: Single Family Home                        │ │
│                 │  │ Access: Front door, code #1234                      │ │
│ ─────────────── │  └─────────────────────────────────────────────────────┘ │
│ Quote Details   │                                                           │
│                 │  CUSTOM FIELDS                                            │
│ Type: Flat Rate │  ┌─────────────────────────────────────────────────────┐ │
│ Source: Website │  │ Unit Make/Model: Carrier 24ACC636A003              │ │
│ Assigned: Mike  │  │ Issue Reported: AC not cooling, making noise       │ │
│                 │  │ Warranty Status: Out of warranty                   │ │
│ ─────────────── │  │ Last Service: June 2024                            │ │
│ Previous Jobs   │  └─────────────────────────────────────────────────────┘ │
│                 │                                                           │
│ • Jun 2024 - AC │  WORK TO BE PERFORMED                                    │
│   Maintenance   │  ┌─────────────────────────────────────────────────────┐ │
│   $150          │  │ □ Diagnose AC issue              $89.00             │ │
│ • Mar 2023 -    │  │ □ Replace capacitor (if needed)  $185.00            │ │
│   Installation  │  │ □ Refrigerant recharge (est)     $250.00            │ │
│   $4,500        │  │ □ Labor (2 hours est.)           $180.00            │ │
│                 │  │ ─────────────────────────────────────────────────── │ │
│ ─────────────── │  │ Subtotal                         $704.00            │ │
│ Tasks           │  │ Tax (8.6%)                        $60.54            │ │
│                 │  │ ═══════════════════════════════════════════════════ │ │
│ ☐ Schedule tech │  │ ESTIMATED TOTAL                  $764.54            │ │
│ ☐ Order parts   │  │                                                     │ │
│ ☑ Send estimate │  │ * Final price may vary based on diagnostic findings │ │
│                 │  └─────────────────────────────────────────────────────┘ │
│                 │                                                           │
│                 │  NOTES                                                    │
│                 │  ┌─────────────────────────────────────────────────────┐ │
│                 │  │ [Internal] [Customer] [Tech Notes]                  │ │
│                 │  │                                                     │ │
│                 │  │ Customer mentioned unit is 12 years old. May need   │ │
│                 │  │ to discuss replacement options if repair costs      │ │
│                 │  │ exceed $500.                                        │ │
│                 │  └─────────────────────────────────────────────────────┘ │
└─────────────────┴───────────────────────────────────────────────────────────┘
```

**Key Features:**
- Previous job history visible
- Custom fields section (configurable per service type)
- Task checklist integration
- Variable pricing with disclaimers
- Single location focus

---

### Template 4: Quick Quote (Minimal)
*Best for: Simple services, fast quoting*

```
┌───────────────────────────────────────────────────────┐
│ Quick Quote                           [ Full View ]   │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Customer: John Smith          Status: ● Draft       │
│  Service:  House Cleaning                            │
│  Date:     Feb 20, 2026                              │
│  Address:  456 Oak Ave, Mesa, AZ 85201               │
│                                                       │
│  ─────────────────────────────────────────────────── │
│                                                       │
│  SERVICES                                             │
│                                                       │
│  ┌─────────────────────────────────┬─────────────┐   │
│  │ Deep cleaning - 3BR/2BA         │    $250.00  │   │
│  │ Window cleaning (interior)      │     $75.00  │   │
│  │ Carpet shampooing               │    $150.00  │   │
│  └─────────────────────────────────┴─────────────┘   │
│                                          ─────────── │
│                              Subtotal:      $475.00  │
│                              Tax (0%):        $0.00  │
│                              ═══════════════════════ │
│                              TOTAL:         $475.00  │
│                                                       │
│  Notes: First-time customer discount applied         │
│                                                       │
│  ─────────────────────────────────────────────────── │
│                                                       │
│  [ Edit ] [ Duplicate ] [ Send to Customer ] [ ⋮ ]  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**Key Features:**
- Single-screen view
- Essential info only
- Quick actions at bottom
- "Full View" link for details
- Fast for high-volume quoting

---

### Template 5: Customer Preview (Shareable Link)
*Best for: Customer-facing approval*

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     [ COMPANY LOGO ]                            │
│                    ABC Moving Company                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                         ESTIMATE                                │
│                         #67550                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Prepared for:                    Estimate Date: Jan 15, 2026   │
│  John Smith                       Valid Until: Feb 14, 2026     │
│  123 Main Street                                                │
│  Chandler, AZ 85225                                             │
│  (555) 123-4567                                                 │
│  john.smith@email.com                                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SERVICE DETAILS                                                │
│                                                                 │
│  Move Type: Local Residential                                   │
│  Scheduled Date: February 1, 2026                               │
│  Estimated Time: 8:00 AM - 12:00 PM                             │
│                                                                 │
│  📍 From: 123 Main Street, Chandler, AZ 85225                   │
│     Property: 1 Bedroom Apartment                               │
│                                                                 │
│  📍 To: 456 Oak Avenue, Phoenix, AZ 85044                       │
│     Property: Townhouse                                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  PRICING BREAKDOWN                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  🚛 1 Truck  •  👥 2 Movers  •  ⏱ Est. 2 hours            │ │
│  │                                                            │ │
│  │  Moving Services (2 hrs @ $150/hr)            $300.00     │ │
│  │  Trip Fee                                      $125.00     │ │
│  │  ──────────────────────────────────────────────────────── │ │
│  │  Subtotal                                      $425.00     │ │
│  │  Sales Tax (0%)                                  $0.00     │ │
│  │  ══════════════════════════════════════════════════════   │ │
│  │  ESTIMATED TOTAL                              $425.00      │ │
│  │                                                            │ │
│  │  * Hourly rate - final price based on actual time         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TERMS & CONDITIONS                                             │
│                                                                 │
│  • Payment due upon completion of services                      │
│  • 48-hour cancellation notice required                         │
│  • Estimate valid for 30 days                                   │
│  • Additional charges may apply for stairs, long carry, etc.    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  By signing below, I agree to the terms and conditions     │ │
│  │  outlined in this estimate.                                │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                                                      │ │ │
│  │  │              [ Sign Here ]                           │ │ │
│  │  │                                                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  [ ✓ Approve Estimate ]        [ ✗ Decline ]              │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Questions? Contact us:                                         │
│  📞 (555) 123-4567  •  📧 info@abcmoving.com                   │
│                                                                 │
│  Powered by ServicePro                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Professional, branded appearance
- Clear pricing breakdown
- E-signature integration
- Mobile-responsive
- No login required for customer
- Decline option with reason capture
- Contact information prominent

---

## Mobile Responsive Behavior

### Breakpoints

```css
/* Mobile: < 640px */
- Single column stack
- Collapsible sections
- Bottom sticky actions
- Swipe gestures

/* Tablet: 640px - 1024px */
- Two columns (Info + Details merged | Pricing)
- Floating action button
- Touch-optimized inputs

/* Desktop: > 1024px */
- Full three-column layout
- Hover states
- Keyboard shortcuts
```

### Mobile Navigation Pattern

```
┌─────────────────────────────────┐
│ ← #67550         ● Draft    ⋮  │
├─────────────────────────────────┤
│                                 │
│  [Info] [Details] [Pricing]     │  ← Tab navigation
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │    Active Tab Content       ││
│  │                             ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  ─────────────────────────────  │
│  │ $425.00    [ Send ▾ ]      │ │ ← Sticky footer
│  ─────────────────────────────  │
└─────────────────────────────────┘
```

---

## Payment Integration

### Payment View (Side Panel)

```
┌─────────────────────────────────┐
│ Customer Payments           ✕  │
├─────────────────────────────────┤
│                                 │
│         [ $ Icon ]              │
│                                 │
│   There are no payments yet.    │
│                                 │
│  ┌─────────────────────────────┐│
│  │    + New Payment            ││
│  └─────────────────────────────┘│
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Payment History                │
│  (Empty state)                  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Accepted Methods:              │
│  💳 Card  🏦 Bank  💵 Cash     │
│                                 │
│           [ Close ]             │
│                                 │
└─────────────────────────────────┘
```

### Recording Payment

```
┌─────────────────────────────────┐
│ Record Payment              ✕  │
├─────────────────────────────────┤
│                                 │
│  Amount Due: $425.00            │
│                                 │
│  Amount *                       │
│  ┌─────────────────────────────┐│
│  │ $                     425.00││
│  └─────────────────────────────┘│
│                                 │
│  Payment Method *               │
│  ┌─────────────────────────────┐│
│  │ Credit Card              ▾ ││
│  └─────────────────────────────┘│
│                                 │
│  Date *                         │
│  ┌─────────────────────────────┐│
│  │ 📅 02/01/2026              ││
│  └─────────────────────────────┘│
│                                 │
│  Reference #                    │
│  ┌─────────────────────────────┐│
│  │ Transaction ID...          ││
│  └─────────────────────────────┘│
│                                 │
│  Notes                          │
│  ┌─────────────────────────────┐│
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  [ Cancel ]    [ Record Payment]│
│                                 │
└─────────────────────────────────┘
```

---

## Customer Approval Workflow

### Flow Diagram

```
                    ┌─────────────┐
                    │   DRAFT     │
                    └──────┬──────┘
                           │
                    [ Send Estimate ]
                           │
                           ▼
                    ┌─────────────┐
                    │    SENT     │◄────────────────┐
                    └──────┬──────┘                 │
                           │                        │
              Customer opens link                   │
                           │                        │
                           ▼                        │
                    ┌─────────────┐                 │
                    │   VIEWED    │                 │
                    └──────┬──────┘                 │
                           │                        │
              ┌────────────┼────────────┐          │
              │            │            │          │
              ▼            ▼            ▼          │
       ┌──────────┐ ┌──────────┐ ┌──────────┐     │
       │ APPROVED │ │ DECLINED │ │  EXPIRED │     │
       └────┬─────┘ └────┬─────┘ └────┬─────┘     │
            │            │            │           │
            │            │     [ Resend ]─────────┘
            │            │
     [ Convert to Job ]  │
            │            │
            ▼            │
       ┌──────────┐      │
       │ CONVERTED│      │
       └──────────┘      │
                         │
              [ Create New Estimate ]
```

### Preview URL Structure

```
https://app.servicepro.com/preview/estimate/{previewToken}

Example:
https://app.servicepro.com/preview/estimate/abc123xyz789
```

### Notification System

1. **On Send**: Email + SMS to customer with preview link
2. **On View**: Notify office that customer viewed
3. **Reminder**: Auto-send if no action after 3 days
4. **On Approve/Decline**: Notify sales person
5. **Expiry Warning**: 3 days before expiry

---

## Implementation Priority

### Phase 1: Core Estimate View
1. Three-column responsive layout
2. Enhanced data model
3. Notes tabs (Internal, Customer, Crew)
4. Basic pricing section

### Phase 2: Location & Map
1. Multi-stop support for moving
2. Single location for other services
3. Google Maps integration
4. Distance/time calculation

### Phase 3: Customer Preview
1. Shareable preview URL
2. E-signature integration
3. Approve/Decline workflow
4. Notification system

### Phase 4: Payment & Conversion
1. Payment recording
2. Estimate → Job conversion
3. Job → Invoice flow
4. Payment tracking

### Phase 5: Advanced Features
1. Custom fields per service type
2. Task management
3. Inventory (for moving)
4. Templates and duplication

---

## Technical Considerations

### API Routes Needed

```
GET    /api/estimates/:id          - Get estimate details
POST   /api/estimates              - Create estimate
PATCH  /api/estimates/:id          - Update estimate
DELETE /api/estimates/:id          - Delete estimate
POST   /api/estimates/:id/send     - Send to customer
POST   /api/estimates/:id/convert  - Convert to job
GET    /api/preview/estimate/:token - Public preview (no auth)
POST   /api/preview/estimate/:token/approve - Customer approve
POST   /api/preview/estimate/:token/decline - Customer decline
POST   /api/estimates/:id/payment  - Record payment
```

### Database Tables

```sql
-- Enhanced estimates table
ALTER TABLE estimates ADD COLUMN
  type VARCHAR(20) DEFAULT 'hourly',
  binding_type VARCHAR(20) DEFAULT 'non_binding',
  source VARCHAR(100),
  sales_person_id UUID REFERENCES users(id),
  estimator_id UUID REFERENCES users(id),
  branch_id UUID,
  tags TEXT[],
  lead_status VARCHAR(50),
  service_type VARCHAR(100),
  scheduled_date DATE,
  scheduled_time TIME,
  custom_fields JSONB DEFAULT '{}',
  internal_notes TEXT,
  customer_notes TEXT,
  crew_notes TEXT,
  preview_token VARCHAR(64) UNIQUE,
  viewed_at TIMESTAMP,
  approved_at TIMESTAMP,
  signature_data TEXT,
  converted_to_job_id UUID REFERENCES jobs(id);

-- Estimate locations
CREATE TABLE estimate_locations (
  id UUID PRIMARY KEY,
  estimate_id UUID REFERENCES estimates(id),
  type VARCHAR(20), -- origin, destination, stop, service_location
  label VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),
  property_type VARCHAR(50),
  access_notes TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Estimate tasks
CREATE TABLE estimate_tasks (
  id UUID PRIMARY KEY,
  estimate_id UUID REFERENCES estimates(id),
  title VARCHAR(200),
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Recommended Template Selection

Based on your requirements:

| Use Case | Recommended Template |
|----------|---------------------|
| Office staff detailed work | Template 1 (Classic Three-Column) |
| On-site mobile estimating | Template 2 (Mobile-First Cards) |
| Non-moving services | Template 3 (Universal Service) |
| Quick high-volume quotes | Template 4 (Quick Quote) |
| Customer approval | Template 5 (Customer Preview) |

**Primary Implementation**: Combine Templates 1 + 2 + 5
- Template 1 for desktop office view
- Template 2 responsive behavior for mobile
- Template 5 for customer-facing preview

---

## Next Steps

1. **Review & Approve** - Select which templates to implement
2. **Create Components** - Build reusable UI components
3. **Database Migration** - Enhance estimate schema
4. **API Development** - Build required endpoints
5. **Customer Preview** - Build public preview page
6. **Testing** - Test across devices

Would you like me to proceed with implementing any of these templates?
