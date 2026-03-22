# Domain Research Summary

## Key Findings

**Stack:**
*   **Next.js (App Router)** for unified Dashboard and API.
*   **PostgreSQL** for relational robust data tracking.
*   **Playwright** for high-fidelity scraping of Maps and Social media.
*   **Nodemailer & IMAP** libraries for the Bring-Your-Own-SMTP setup.
*   **Redis + BullMQ** for background task queuing (scraping and paced email sending).

**Table Stakes:**
*   Campaign and keyword management UI.
*   Headless extraction of local businesses explicitly without websites.
*   Paced and randomized email sending across a pool of connected SMTP accounts.
*   IMAP polling for reply detection.

**Differentiators:**
*   Intelligent follow-up automation triggering "website plans" *only* on positive response.
*   Multi-source fallback (Google Maps -> Facebook -> Instagram) to find contact info.

**Watch Out For:**
*   **Scraping blocks**: Prevent by using `playwright-stealth` and respectful randomized scrolling delays.
*   **Spam folders**: Prevent by strictly limiting sending volume per account (<50/day) and randomizing delays (8-15 mins) and email templates. Always use an async background queue to detach these delays from the web UI.
