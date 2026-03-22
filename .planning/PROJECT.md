# Automated Outreach Web App

## What This Is

An automated web application that scrapes Google Maps and social media (like Facebook/Instagram) for local businesses that do not have a website. It automatically extracts their contact information and sends bulk cold emails from the user's connected email accounts (using App Passwords/SMTP). If a lead replies positively, the system automatically sends a follow-up email presenting the user's custom website plans.

## Core Value

Completely automating the prospecting and initial cold-pitching phase so the user can seamlessly acquire web design clients without manual grinding.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- [x] Web interface to manage lead scraping campaigns (search by keyword/location)
- [x] Dashboard to view campaign metrics, active leads, and inbox replies

### Active

<!-- Current scope. Building toward these. -->

- [ ] Scraper module for Google Maps to find businesses lacking a website link
- [ ] Scraper module for Social Media (FB/IG) to find business profiles lacking website links
- [ ] Extract contact emails for the discovered leads
- [ ] Connect and manage custom Gmail (via App Passwords) or standard SMTP accounts
- [ ] Automated email sending engine with pacing/delays to prevent spam flagging
- [ ] Reply detection mechanism to identify positive responses from leads
- [ ] Automated follow-up trigger to send the "website plans" email to positive replies

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- [x] Paid bulk email providers (SendGrid, Mailgun, etc.) — User specifically requested a free, easy, and effective approach using their own accounts.
- [x] Automated website building — This tool is purely for lead generation and sales outreach; fulfilling the web design remains manual.

## Context

- The user is a web designer/developer aiming to automate client acquisition.
- Deliverability is a prime concern since standard cold emails often end up in spam; using real, paced Gmail/SMTP accounts solves this in an accessible and "free" way.
- The workflow requires web scraping, which may be vulnerable to rate limits or CAPTCHAs, so the solution will need robust scraping or API strategies.

## Constraints

- **Tech Stack**: Must support robust web scraping (e.g., Puppeteer/Playwright or specialized APIs) alongside a web frontend and backend.
- **Cost**: The email sending infrastructure must be free (e.g., using existing Gmail accounts).
- **Deliverability**: Email sending must be paced and randomized to mimic human behavior and avoid immediate IP/domain blacklisting.

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Bring-Your-Own-SMTP | Avoids the strict compliance and costs of platforms like SendGrid, while offering better initial deliverability for low-moderate volume. | — Pending |
| Multi-source scraping | Google Maps provides volume; social media catches newer/smaller businesses not yet on maps. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after initialization*
