# Softly — Elderly Care Coordinator: Master Project Context & Knowledge Base

> **CONFIDENTIAL & PERMANENT PROJECT RECORD**  
> This file serves as the definitive single source of truth for the Softly project architecture, business credentials, integrations, and operational policies. Any agent or developer joining this workspace must read this document first.

---

## 1. Executive Summary & Brand Identity
- **Application Name:** Softly — Elderly Care Coordinator
- **Production URL:** [https://softlys.online](https://softlys.online)
- **Primary Purpose:** A digital living room for coordinating elderly parent care, daily medication reminders via WhatsApp, doctor appointments, and local verified helper accompaniment for families living remotely.
- **Brand Visuals:** Softly Sprout & Heart logo (`/public/logo.png`, warm coral `#FFB7B2`, sage green `#E8EFE8`, ivory `#FDFCF8`).

---

## 2. Business & Legal Identity (Meta Verified)
- **Legal Entity:** Sole Proprietorship (India)
- **Enterprise Name:** Softly care
- **Proprietor:** Singamsetti Sri Ram
- **Government MSME / Udyam Registration:** `UDYAM-AP-18-0060209`
- **Registered Address:** Brahmin street, gangalakurru agraharam, Amalapuram, Andhra Pradesh 533221
- **NIC Activity Code:** `88100` (Social work activities without accommodation for the elderly and disabled)
- **Meta Business Verification:** 🟢 **Verified**
- **Meta Business Portfolio ID:** `1893540518693179` (`Softly care`)

---

## 3. Production Infrastructure & Custom Domain
- **Domain Registrar:** GoDaddy (`softlys.online`)
- **Hosting Platform:** Vercel (Project: `prj_uCvCtueUj7RNlxTEwcjkTgXBwSDo`, `softly-care`)
- **DNS Records:**
  - `A @ 76.76.21.21`
  - `CNAME www cname.vercel-dns.com`
- **SSL Status:** Issued & Active (`cert_XjpIojrVSpERPRDcu0Ta76rS`)
- **Meta Domain Verification:** HTML meta-tag verified:
  `<meta name="facebook-domain-verification" content="yc45a7jtiwpd6rlhjn9l65qtalwpii" />`

---

## 4. WhatsApp Cloud API Infrastructure
- **Dedicated Business SIM:** `+91 83282 66020`
- **Meta App ID:** `3720039924817733` (`Softly`)
- **Phone Number ID:** `1398469693347235` (Status: `CONNECTED`, Code Verification: `VERIFIED`)
- **Production WABA ID:** `1046131975139891` (`Softly care`, Asia/Kolkata timezone)
- **Test WABA ID (Legacy):** `1831224254570053`
- **Access Token:** Permanent System User Token (`expires_at: 0`, user ID: `122095709259529249`, System User: `Employee`)
- **Webhook Endpoint:** `https://softlys.online/api/reminders/webhook` (also mirrors on Vercel preview)
- **Webhook Verify Token:** `softly_care_meta_verify_2026`
- **Message Templates:**
  1. `softly_welcome` (Approved, Utility/Marketing)
  2. `softly_med_reminder` (Utility reminder with parameters: `[ElderName, Medication, Time]`)
  3. `softly_caregiver_welcome` (Utility welcome to Son/Caregiver: `[CaregiverName, ParentsList]`)
  4. `softly_elder_welcome` (Utility welcome to Parent: `[ParentName, RegisteredBy]`)
- **WhatsApp Profile:**
  - About: *Softly — Elderly Care Coordinator*
  - Category: `HEALTH`
  - Website: `https://softlys.online/`
  - DP: Sprout-heart logo synced to Meta CDN (`560x560` px)

---

## 5. Subscription & Business Rules
- **Free Trial Policy:** **3-Day Free Trial** (STRICT: Never 14 days to preserve WhatsApp credits).
- **Trial Quota:** 150 WhatsApp reminders max per family space during trial.
- **Doctor Calendar Sync:**
  - 1-Click Google Calendar export (`getGoogleCalendarUrl`) prefilling doctor name, clinic address, notes, and accompanying helper.
  - Standard RFC 5545 `.ics` export (`generateIcsContent`) for Apple Calendar, Outlook, and native phone calendars.
  - Automated WhatsApp alerts with 1-tap Google Calendar sync link whenever a doctor visit is scheduled.
- **Post-Trial Paywall:** At day 4, reminders pause until upgraded to a paid plan.
- **Pricing Tiers:**
  - **Starter:** ₹499 / month
  - **Plus:** ₹999 / month
  - **Family Care:** ₹1,499 / month
- **Payment Gateway:** Cashfree Payments (Cards, UPI, Netbanking).
- **Refund Policy:** 3-Day free trial cancellation + 5-7 days turnaround.

---

## 6. Database & Persistence Layer
- **Provider:** Supabase Postgres (`https://tvhfborktuqtavuxaied.supabase.co`)
- **Project Ref:** `tvhfborktuqtavuxaied`
- **Key Tables:**
  - `families`: ID, name, invite_code, user_id, trial_ends_at, subscription_status, whatsapp_quota_used, whatsapp_quota_limit
  - `family_members`: ID, family_id, role (`caregiver` | `elder` | `helper`), name, phone, city, relation_type, helper_type
  - `medications`: ID, family_id, name, dosage, schedule, active, for_member_name
  - `medication_logs`: ID, medication_id, family_id, taken_at, taken_by_name, status, channel
  - `appointments`: ID, family_id, title, date, time, doctor, location, notes
  - `helper_tasks`: ID, family_id, title, status, date, helper_id
- **Baseline Rule:** The demo baseline family (`fam-sharma`) maintains empty phone numbers to guarantee zero accidental automated WhatsApp dispatches.
