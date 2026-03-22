# Roadmap: Lead Generator & Cold Outreach Engine

## Milestones

- ✅ **v1.0 MVP** — Phases 1–4 (shipped 2026-03-22)
- 📋 **v1.1** — Social scraping, email extraction, analytics (planned)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–4) — SHIPPED 2026-03-22</summary>

- [x] Phase 1: Foundation & Dashboard — DB, auth, campaign UI, leads table, templates
- [x] Phase 2: Scraping Engine — BullMQ + Redis, Playwright Google Maps scraper, AutoRefresh
- [x] Phase 3: Email Engine — SmtpSettings model, Nodemailer paced worker, dispatch button
- [x] Phase 4: Automation Flow — IMAP polling, keyword intent detection, auto follow-up

See: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 📋 v1.1 (Planned)

- [ ] Phase 5: Social Media Scraper (Facebook/Instagram business profiles)
- [ ] Phase 6: Email Extraction (from scraped profiles and Google Maps listing pages)
- [ ] Phase 7: Analytics Dashboard (send rate, reply rate, conversion funnel)
- [ ] Phase 8: Multi-account SMTP Pool Rotation
