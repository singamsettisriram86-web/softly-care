---
description: Permanent Softly Care project context, business rules, and architectural invariants
alwaysApply: true
---

# Softly Care — Permanent Project Rules & Context

1. **Free Trial Invariant**: The free trial period is strictly **3 Days** (NOT 14 days) to prevent depleting WhatsApp message credits.
2. **WhatsApp Production Config**:
   - Registered SIM: `+91 83282 66020`
   - Phone Number ID: `1398469693347235`
   - Production WABA ID: `1046131975139891` (`Softly care`)
   - Production Domain: `https://softlys.online`
3. **Database & Credits**: Never send automated outbound WhatsApp messages to unverified or dummy phone numbers.
4. **Master Context Reference**: For complete technical, legal, and operational specifications, always refer to `PROJECT_CONTEXT.md` in the project root.
