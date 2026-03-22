# Roadmap: Lead Generator & Cold Outreach Engine

## Phases

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Dashboard | Setup DB, auth, and web UI for campaign management. | CORE-01, CORE-02, CORE-03, CORE-04 | 3 |
| 2 | Scraping Engine | Build background workers to scrape Maps and Social Media. | SCRP-01, SCRP-02, SCRP-03, SCRP-04, SCRP-05 | 4 |
| 3 | Email Engine | Implement SMTP pools and automated paced sending. | MAIL-01, MAIL-02, MAIL-03, MAIL-04 | 3 |
| 4 | Automation Flow | Implement IMAP polling and automated follow-ups. | AUTO-01, AUTO-02, AUTO-03, AUTO-04 | 3 |

### Phase Details

### Phase 1: Foundation & Dashboard
Goal: Setup DB, auth, and web UI for campaign management.
Requirements: CORE-01, CORE-02, CORE-03, CORE-04
Success criteria:
1. User can create a campaign in the UI that saves to the DB.
2. User can view an empty list of Leads.
3. User can save an Initial Pitch template and Follow-Up template.

### Phase 2: Scraping Engine
Goal: Build background workers to scrape Maps and Social Media.
Requirements: SCRP-01, SCRP-02, SCRP-03, SCRP-04, SCRP-05
Success criteria:
1. A job can be dispatched to the background worker to scrape Maps.
2. The worker correctly skips businesses that already have a website.
3. The worker finds Facebook pages for businesses without websites to scrape emails.
4. Extracted emails populate in the UI's Leads list.

### Phase 3: Email Engine
Goal: Implement SMTP pools and automated paced sending.
Requirements: MAIL-01, MAIL-02, MAIL-03, MAIL-04
Success criteria:
1. User can securely add a Gmail App Password to the DB.
2. System can send a test Initial Pitch using the configured template.
3. Pacing scheduler ensures emails are staggered by at least 8 minutes.

### Phase 4: Automation Flow
Goal: Implement IMAP polling and automated follow-ups.
Requirements: AUTO-01, AUTO-02, AUTO-03, AUTO-04
Success criteria:
1. A scheduled job checks connected inboxes for replies to previous pitches.
2. System reliably distinguishes positive vs negative/bounce replies via keywords/NLP.
3. Positive replies automatically trigger the Follow-Up template.
