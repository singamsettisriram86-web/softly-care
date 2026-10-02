# Elderly Care Coordinator ("Softly") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first "Softly" themed web app & PWA that helps sole earners managing aging parents from another city coordinate medications, doctor appointments, WhatsApp reminders, and local helper tasks with Cashfree payments.

**Architecture:** Next.js 14 App Router, TypeScript, Tailwind CSS, Google Fonts (`Outfit` + `Reenie Beanie`), SVG grain texture overlay, modular service adapters for Cashfree PG and Twilio WhatsApp with local mock fallbacks, Supabase schema and mock storage repository, and PWA offline service worker.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Cashfree Payments API / SDK, Twilio WhatsApp API, Supabase Client, Jest + React Testing Library.

**Spec:** [docs/superpowers/specs/2026-10-02-elderly-care-coordinator-design.md](../../docs/superpowers/specs/2026-10-02-elderly-care-coordinator-design.md)

## Global Constraints
- Primary background: `#FDFCF8`, Text: `#292524`, Muted: `#78716C`, Accent Coral: `#FFB7B2`, Sage: `#E8EFE8`, Lavender: `#EFEDF4`
- Fonts: `Outfit` for body/headings, `Reenie Beanie` for handwritten accent notes
- 35% opacity SVG grain overlay across the application
- Cashfree Payments for INR (₹) helper transactions
- Interactive mock modes for Cashfree and Twilio so the full flow is verifiable without requiring live paid credentials upfront
- Mobile-first responsive layout (Chrome on Android friendly)

---

### Task 1: Scaffolding Next.js 14, Tailwind, Fonts & Softly Theme

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `components/GrainOverlay.tsx`
- Test: `tests/theme.test.tsx`

**Interfaces:**
- Produces: Base responsive layout with `GrainOverlay` and Softly color tokens configured in Tailwind.

- [ ] **Step 1: Write test for theme tokens and GrainOverlay**
```tsx
// tests/theme.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import GrainOverlay from '../components/GrainOverlay';

describe('GrainOverlay', () => {
  it('renders the SVG turbulence noise grain overlay', () => {
    const { container } = render(<GrainOverlay />);
    const filter = container.querySelector('feTurbulence');
    expect(filter).not.toBeNull();
    expect(filter?.getAttribute('baseFrequency')).toBe('0.65');
  });
});
```

- [ ] **Step 2: Run test to verify failure**
Run: `npm test tests/theme.test.tsx` (Expected: failure / missing module)

- [ ] **Step 3: Implement project configuration and GrainOverlay**
```tsx
// components/GrainOverlay.tsx
import React from 'react';

export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-35 mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
```

- [ ] **Step 4: Run test to verify pass**
Run: `npm test tests/theme.test.tsx` (Expected: PASS)

- [ ] **Step 5: Commit**
```bash
git add package.json tsconfig.json tailwind.config.js app/ components/ tests/
git commit -m "feat: scaffold Next.js 14 project with Softly design tokens and grain overlay"
```

---

### Task 2: Data Models & Service Repository Adapter

**Files:**
- Create: `lib/types.ts`
- Create: `lib/data-repository.ts`
- Create: `supabase/migrations/001_init.sql`
- Test: `tests/data-repository.test.ts`

**Interfaces:**
- Produces: `IDataRepository` interface with `getMedications`, `addMedication`, `logMedication`, `getAppointments`, `addAppointment`, `getTasks`, `addTask`, `updateTask`, `createPaymentRecord`, `updatePaymentRecord`.

- [ ] **Step 1: Write test for DataRepository CRUD**
```typescript
// tests/data-repository.test.ts
import { memoryDataRepository } from '../lib/data-repository';

describe('DataRepository', () => {
  it('adds and retrieves medications', async () => {
    const med = await memoryDataRepository.addMedication({
      family_id: 'fam-1',
      name: 'Metformin',
      dosage: '500mg',
      schedule: ['08:00', '20:00'],
      instructions: 'Take after food',
      active: true,
    });
    expect(med.id).toBeDefined();

    const list = await memoryDataRepository.getMedications('fam-1');
    expect(list.some(m => m.name === 'Metformin')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**
Run: `npx jest tests/data-repository.test.ts`

- [ ] **Step 3: Implement data models and in-memory fallback repository**
Define all TypeScript entities (`Family`, `Medication`, `MedicationLog`, `Appointment`, `HelperTask`, `HelperPayment`) and provide the in-memory store synchronized with Supabase schema.

- [ ] **Step 4: Run test to verify pass**
Run: `npx jest tests/data-repository.test.ts` (Expected: PASS)

- [ ] **Step 5: Commit**
```bash
git add lib/ tests/ supabase/
git commit -m "feat: add data models and repository adapter with in-memory fallback"
```

---

### Task 3: "Softly" Public Landing Page (`/`)

**Files:**
- Create: `components/landing/FloatingNav.tsx`
- Create: `components/landing/HeroSection.tsx`
- Create: `components/landing/ScenarioScroll.tsx`
- Create: `components/landing/AppPreviewMockup.tsx`
- Create: `components/landing/DiaryTestimonials.tsx`
- Create: `components/landing/FaqAccordion.tsx`
- Create: `components/landing/WaitlistSection.tsx`
- Create: `app/page.tsx`
- Test: `tests/landing-page.test.tsx`

**Interfaces:**
- Produces: Complete Softly landing page adhering to the exact spec (floating nav, cursive emphasis, 288x160 scenario cards, 3-phone cascading preview with pulsing coral button, tilted diary notes, interactive FAQ, waitlist form).

- [ ] **Step 1: Write test for landing page sections**
```tsx
// tests/landing-page.test.tsx
import { render, screen } from '@testing-library/react';
import LandingPage from '../app/page';

describe('Landing Page', () => {
  it('renders headline with cursive accent and CTAs', () => {
    render(<LandingPage />);
    expect(screen.getByText(/care coordination/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /launch care hub/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /helper access/i })).toHaveAttribute('href', '/helper');
  });
});
```

- [ ] **Step 2: Run test to verify failure**
Run: `npx jest tests/landing-page.test.tsx`

- [ ] **Step 3: Implement landing page components and assembly in `app/page.tsx`**

- [ ] **Step 4: Run test to verify pass**
Run: `npx jest tests/landing-page.test.tsx` (Expected: PASS)

- [ ] **Step 5: Commit**
```bash
git add components/landing/ app/page.tsx tests/landing-page.test.tsx
git commit -m "feat: complete Softly landing page with all 7 sections and fluid aesthetic"
```

---

### Task 4: Caregiver Dashboard & Medication Tracker (`/dashboard`)

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `components/dashboard/MedicationCard.tsx`
- Create: `components/dashboard/AddMedicationModal.tsx`
- Create: `components/dashboard/MedicationAdherence.tsx`
- Create: `app/api/medications/route.ts`
- Create: `app/api/medications/log/route.ts`
- Test: `tests/medications.test.ts`

**Interfaces:**
- Produces: `GET /api/medications`, `POST /api/medications`, `POST /api/medications/log`. Interactive dashboard listing medicines, dosage, schedule badges, adherence progress bar, and add modal.

- [ ] **Step 1: Write test for medication API routes**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement medication components and API endpoints**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit**
```bash
git add app/dashboard/ components/dashboard/ app/api/medications/ tests/
git commit -m "feat: caregiver dashboard medication tracker and adherence log"
```

---

### Task 5: WhatsApp Reminders & Interactive Webhook Simulator

**Files:**
- Create: `lib/whatsapp-service.ts`
- Create: `app/api/reminders/trigger/route.ts`
- Create: `app/api/reminders/webhook/route.ts`
- Create: `components/dashboard/WhatsAppSimulatorDrawer.tsx`
- Test: `tests/whatsapp.test.ts`

**Interfaces:**
- Consumes: Medication schedule times and phone numbers.
- Produces: WhatsApp trigger service, inbound webhook handler for `"DONE"`, and interactive drawer UI for immediate testing.

- [ ] **Step 1: Write test for WhatsApp trigger and "DONE" webhook parser**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement WhatsApp service, API routes, and interactive drawer**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit**
```bash
git add lib/whatsapp-service.ts app/api/reminders/ components/dashboard/WhatsAppSimulatorDrawer.tsx tests/
git commit -m "feat: two-way WhatsApp reminder flow with simulator drawer and webhook"
```

---

### Task 6: Doctor Appointments & Google Calendar / ICS Sync

**Files:**
- Create: `components/dashboard/AppointmentCard.tsx`
- Create: `components/dashboard/AddAppointmentModal.tsx`
- Create: `lib/calendar.ts`
- Create: `app/api/appointments/route.ts`
- Test: `tests/appointments.test.ts`

**Interfaces:**
- Produces: Appointment management with Google Calendar deep links and `.ics` iCalendar download generator.

- [ ] **Step 1: Write test for appointment creation and `.ics` generation**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement appointment components and calendar generator**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit**
```bash
git add components/dashboard/Appointment* lib/calendar.ts app/api/appointments/ tests/
git commit -m "feat: doctor appointments manager with Google Calendar and ICS sync"
```

---

### Task 7: Helper Tasks & Cashfree Payments Integration

**Files:**
- Create: `lib/cashfree-service.ts`
- Create: `app/api/payments/cashfree-order/route.ts`
- Create: `app/api/payments/cashfree-verify/route.ts`
- Create: `components/dashboard/HelperTaskList.tsx`
- Create: `components/dashboard/CashfreePayModal.tsx`
- Test: `tests/cashfree.test.ts`

**Interfaces:**
- Produces: Helper task checklist and Cashfree Order creation returning `order_id` & `payment_session_id`, supporting both Cashfree PG Sandbox and interactive test payment simulation.

- [ ] **Step 1: Write test for Cashfree order creation and payment verification**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement Cashfree service, routes, and payment modal**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit**
```bash
git add lib/cashfree-service.ts app/api/payments/ components/dashboard/Cashfree* tests/
git commit -m "feat: helper task coordination with Cashfree payment gateway order flow"
```

---

### Task 8: Dedicated Helper Mobile Checklist (`/helper`)

**Files:**
- Create: `app/helper/page.tsx`
- Create: `components/helper/HelperDailyChecklist.tsx`
- Test: `tests/helper-view.test.tsx`

**Interfaces:**
- Produces: Standalone, mobile-first touch-friendly checklist for local helpers with 1-tap "Mark Given" and "Attended" actions.

- [ ] **Step 1: Write test for helper mobile checklist view**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `/helper` page and touch controls**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit**
```bash
git add app/helper/ components/helper/ tests/
git commit -m "feat: mobile helper daily checklist with 1-tap status updates"
```

---

### Task 9: PWA Service Worker & Offline Shell

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js`
- Create: `components/PwaRegister.tsx`
- Test: `tests/pwa.test.ts`

**Interfaces:**
- Produces: Valid Web App Manifest, Service Worker caching, and install prompt support.

- [ ] **Step 1: Write test validating manifest and service worker file existence**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement manifest, service worker caching, and registration**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit**
```bash
git add public/ components/PwaRegister.tsx tests/
git commit -m "feat: PWA manifest and service worker for mobile installation and offline caching"
```

---

### Task 10: Full End-to-End Verification & Walkthrough

**Files:**
- Create: `tests/e2e-flow.test.ts`
- Create: `walkthrough.md`

- [ ] **Step 1: Run complete test suite across all modules**
Run: `npm test`
- [ ] **Step 2: Run build to ensure 0 TypeScript or bundling errors**
Run: `npm run build`
- [ ] **Step 3: Generate detailed walkthrough documentation**
- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: complete test suite and verification walkthrough"
```
