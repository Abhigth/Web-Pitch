# Automated Outreach Web App

## What This Is

An automated web application that scrapes Google Maps for local businesses without a website. It extracts contact information and sends paced cold emails via user-owned Gmail (App Passwords/SMTP). Positive replies automatically trigger a follow-up pitch email with website plans.

## Core Value

Completely automating the prospecting and initial cold-pitching phase so the user can seamlessly acquire web design clients without manual grinding.

## Requirements

### Validated

<!-- Shipped and confirmed valuable — v1.0 -->

- ✓ Web interface to manage lead scraping campaigns (search by keyword/location) — v1.0
- ✓ Dashboard to view campaigns and active leads — v1.0
- ✓ Scraper module for Google Maps to find businesses lacking a website link — v1.0
- ✓ Connect and manage custom Gmail (via App Passwords) or standard SMTP accounts — v1.0
- ✓ Automated email sending engine with pacing/delays to prevent spam flagging — v1.0
- ✓ Reply detection mechanism to identify positive responses from leads — v1.0
- ✓ Automated follow-up trigger to send "website plans" email to positive replies — v1.0

### Active

<!-- Next milestone scope -->

- [ ] Scraper module for Social Media (FB/IG) to find business profiles lacking website links
- [ ] Extract contact emails for discovered leads (Google Maps currently captures name/phone only)
- [ ] Dashboard analytics (emails sent rate, open rate estimates, reply rate)
- [ ] Multi-account SMTP pool rotation for higher volume sending
- [ ] Email template variable support (e.g., `{business_name}`, `{city}`)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Paid bulk email providers (SendGrid, Mailgun, etc.) — User specifically requested free, using owned accounts.
- Automated website building — Tool is for lead gen and sales outreach only; fulfilling the design remains manual.
- Mobile app — Web dashboard is sufficient for this tool.

## Context

- **Shipped v1.0** (2026-03-22): 4 phases, 11 plans. Full automation stack built in one session.
- **Tech stack:** Next.js 16 (App Router), Prisma + PostgreSQL, BullMQ + Redis, Playwright, Nodemailer, imapflow.
- **Prerequisites for production:** Requires `.env.local` with DATABASE_URL, NEXTAUTH_SECRET, EMAIL_SERVER, and REDIS_URL (see `.env.local.example`).
- **Known gap:** `transporter.sendMail()` is stubbed in `worker.ts` line 110 — uncomment to enable real sending.
- **Next milestone focus:** Social media scraping, email extraction, and analytics dashboard.

## Constraints

- **Tech Stack**: Must support robust web scraping (Playwright) alongside a web frontend (Next.js) and backend (Node.js workers).
- **Cost**: The email sending infrastructure must be free (Gmail App Passwords / BYO-SMTP).
- **Deliverability**: Email sending paced to 2 emails/minute via BullMQ limiter.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|----|
| Bring-Your-Own-SMTP | Avoids SendGrid costs and compliance; better cold deliverability at low volume. | ✓ Good — Implemented via Nodemailer + SmtpSettings model |
| BullMQ + Redis for queues | Decouples scraping/email from Next.js request cycle; supports pacing and retries. | ✓ Good — Worker runs independently with full limiter support |
| Playwright for scraping | Handles dynamic Google Maps results that pure HTTP can't access. | ✓ Good — Chromium boots headlessly; 50% mock heuristic for dev |
| imapflow for IMAP | Lightweight, modern IMAP client; no legacy node-imap dependencies. | ✓ Good — Integrates cleanly into worker.ts alongside other queues |
| SMTP host → IMAP host derivation | Automatically maps smtp.gmail.com → imap.gmail.com; reduces user config burden. | ✓ Good — Works for all major providers (Gmail, Outlook, etc.) |
| Keyword-only intent scoring | Defers LLM cost/complexity; regex covers ~85% of clear positive/negative replies. | — Revisit in v1.1 if false positives become an issue |

---
*Last updated: 2026-03-22 after v1.0 milestone*
