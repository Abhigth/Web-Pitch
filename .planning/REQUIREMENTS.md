# Requirements: Lead Generator & Cold Outreach Engine

**Defined:** 2026-03-22
**Core Value:** Automating the prospecting and initial cold-pitching phase so the user can easily acquire web design clients without manual grinding.

## v1 Requirements

### Foundation & Dashboard (CORE)

- [ ] **CORE-01**: User can view a dashboard summary of Campaigns, active Leads, Sent Emails, and Replies
- [ ] **CORE-02**: User can create, edit, and manage Campaigns (defining keywords and locations)
- [ ] **CORE-03**: User can view and filter the list of Leads associated with a Campaign
- [ ] **CORE-04**: User can configure an Initial Pitch email template and a Follow-Up email template

### Scraping Engine (SCRP)

- [ ] **SCRP-01**: System can scrape Google Maps for businesses matching a Campaign's parameters
- [ ] **SCRP-02**: System detects if a business listing lacks a website link
- [ ] **SCRP-03**: System uses fallback search on Facebook/Instagram to locate missing contact info
- [ ] **SCRP-04**: System extracts available email addresses for the target businesses
- [ ] **SCRP-05**: System securely queues scraping jobs without blocking the web UI

### Email Outreach (MAIL)

- [ ] **MAIL-01**: User can add and manage multiple SMTP/IMAP accounts (e.g., Gmail with App Passwords)
- [ ] **MAIL-02**: System can dispatch the Initial Pitch template to a batch of Leads
- [ ] **MAIL-03**: System rotates through available active SMTP accounts for sending
- [ ] **MAIL-04**: System enforces pacing (e.g., random 8-15 minute delays) between emails to protect sender reputation

### Automation & Reply Handling (AUTO)

- [ ] **AUTO-01**: System periodically polls connected IMAP accounts for replies
- [ ] **AUTO-02**: System categorizes incoming replies to detect positive intent
- [ ] **AUTO-03**: System automatically dispatches the Follow-Up template when a positive reply is detected
- [ ] **AUTO-04**: System marks Leads as "Unsubscribed" or "Failed" and halts further outreach based on negative replies or bounces

## v2 Requirements

### Analytics & AI
- **ANLT-01**: Advanced dashboard charts showing conversion rates by SMTP account
- **AI-01**: AI-generated highly personalized first lines for the cold emails

## Out of Scope

| Feature | Reason |
|---------|--------|
| Paid Email Service Integrations | User wants connection to free Gmail/SMTP to keep costs down and initial deliverability high. |
| Automatic Website Generation | We only pitch the service; the user performs the actual web design work manually. |
| In-browser realtime scraping | Must be done server-side via Playwright to avoid CORS/IP blocks and browser freezing. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| CORE-03 | Phase 1 | Pending |
| CORE-04 | Phase 1 | Pending |
| SCRP-01 | Phase 2 | Pending |
| SCRP-02 | Phase 2 | Pending |
| SCRP-03 | Phase 2 | Pending |
| SCRP-04 | Phase 2 | Pending |
| SCRP-05 | Phase 2 | Pending |
| MAIL-01 | Phase 3 | Pending |
| MAIL-02 | Phase 3 | Pending |
| MAIL-03 | Phase 3 | Pending |
| MAIL-04 | Phase 3 | Pending |
| AUTO-01 | Phase 4 | Pending |
| AUTO-02 | Phase 4 | Pending |
| AUTO-03 | Phase 4 | Pending |
| AUTO-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after initial definition*
