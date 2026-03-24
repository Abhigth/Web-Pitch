# Roadmap: Lead Generator & Cold Outreach Engine

## Milestones

- ✅ **v1.0 MVP** — Phases 1–4 (shipped 2026-03-22)
- 🚧 **v1.1** — Phases 5–8 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–4) — SHIPPED 2026-03-22</summary>

- [x] Phase 1: Foundation & Dashboard
- [x] Phase 2: Scraping Engine
- [x] Phase 3: Email Engine
- [x] Phase 4: Automation Flow

See: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v1.1 (In Progress)

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|-----------------|
| 5 | Email Extraction | Auto-extract contact emails from scraped lead sources | EXTR-01, EXTR-02, EXTR-03, EXTR-04 | 3 |
| 6 | Template Variables | Personalize outbound emails with merge variables at send time | TMPL-01, TMPL-02, TMPL-03, TMPL-04 | 3 |
| 7 | Multi-account SMTP Pool | Rotate across multiple Gmail accounts for higher-volume sending | SMTP-01, SMTP-02, SMTP-03, SMTP-04 | 3 |
| 8 | Analytics Dashboard | Visualize campaign performance and conversion funnel in real time | ANLX-01, ANLX-02, ANLX-03, ANLX-04 | 3 |

### Phase Details

### Phase 5: Email Extraction
Goal: Automatically extract contact emails from Google Maps listing pages and crawled business websites for scraped leads.
Requirements: EXTR-01, EXTR-02, EXTR-03, EXTR-04
Success criteria:
1. Scraper attempts to extract email from Google Maps listing and the business's website URL (mailto: links, contact pages).
2. Extracted emails are saved to the Lead record and appear in the Leads Hub table.
3. Leads with no extractable email are marked `NO_EMAIL` and filterable in the UI.

### Phase 6: Template Variables
Goal: Support merge variables in email templates so outreach is personalized to each lead at send time.
Requirements: TMPL-01, TMPL-02, TMPL-03, TMPL-04
Success criteria:
1. Templates support `{business_name}`, `{city}`, and `{first_name}` variables in both subject and body.
2. Variables are resolved at send time from the lead's stored fields; missing values fall back gracefully (e.g., "there" for `{first_name}`).
3. Template editor shows a live preview panel with sample variable values substituted.

### Phase 7: Multi-account SMTP Pool
Goal: Allow multiple Gmail/SMTP accounts to be added and automatically rotated to distribute sending load.
Requirements: SMTP-01, SMTP-02, SMTP-03, SMTP-04
Success criteria:
1. User can add, enable, and disable multiple SMTP credential sets from the Settings UI.
2. Campaign dispatch round-robins across all active SMTP accounts.
3. Each sent email is stored with the sending account ID for per-account tracking.

### Phase 8: Analytics Dashboard
Goal: Provide real-time visibility into campaign performance across all accounts.
Requirements: ANLX-01, ANLX-02, ANLX-03, ANLX-04
Success criteria:
1. Each campaign card shows total leads, emails sent, reply rate, and positive reply count.
2. A global summary stat bar shows project-wide outreach, reply, and conversion totals.
3. Dashboard auto-refreshes every 30 seconds; lead status breakdown (NEW/CONTACTED/REPLIED_POSITIVE/REPLIED_NEGATIVE/NO_EMAIL) is visible per campaign.
