# Phase 3: Email Engine - Research

## Goal
Connect and manage custom Gmail (via App Passwords) or standard SMTP accounts. Automated email sending engine with pacing/delays to prevent spam flagging.

## Domain
Backend infrastructure and worker queues.

## Key Decisions
1. **SMTP Storage:** Store connection credentials in PostgreSQL. Encrypting passwords in a real-world scenario is necessary; for this foundation, we'll store them as plain text/basic hash, but primarily focus on the UI flow.
2. **Pacing Engine:** We will utilize BullMQ's built-in `limiter` option on the Worker. By rate-limiting to 1 email every 60 seconds (or standard configurable rates), we prevent the SMTP provider from locking the account due to bulk-sending violations.
3. **Mailer Module:** `nodemailer` is the industry standard.
4. **Queue Lifecycle:** When a user clicks "Launch Campaign" from the UI, we extract all their `NEW` leads, interpolate their template string, and push a job into the `email-campaigns` BullMQ queue. The worker handles the actual transmission via SMTP and flips the lead to `CONTACTED` upon success.

## Validation Architecture
- Boot the worker module locally alongside Redis.
- Submit fake credentials or valid Gmail App Passwords to the settings UI.
- Initiate a campaign blast, watch the delayed log bursts (1 per minute) dispatching emails to `nodemailer`.
