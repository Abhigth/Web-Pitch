# Retrospective

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-22
**Phases:** 4 | **Plans:** 11

### What Was Built

- Full-stack Next.js 16 dashboard with magic link auth (NextAuth), Prisma ORM schema, and campaign wizard UI
- BullMQ + Redis background workers decoupled from the Next.js request cycle for non-blocking execution
- Playwright-powered Google Maps scraper that identifies businesses without websites and stores them as leads
- Nodemailer pacing engine (rate-limited to ~2 emails/min via BullMQ limiter) using user-owned Gmail/SMTP accounts
- IMAP inbox polling via imapflow with keyword-based reply intent detection and automatic follow-up dispatch

### What Worked

- **Wave-based parallel planning** significantly accelerated execution — each plan could be worked independently without blocking others.
- **BullMQ limiter** solved the deliverability pacing problem elegantly without custom scheduling code.
- **Deriving IMAP host from SMTP host** (smtp.* → imap.*) reduced user configuration to a single credential set.
- **Worker.ts as a unified process** — running all 3 workers (scraper + email + IMAP) in a single `npm run worker` command simplified local dev substantially.

### What Was Inefficient

- Phases 2-4 executed without SUMMARY.md generation, so UAT tests had to be derived from PLAN.md objectives rather than actual summaries.
- The missing `middleware.ts` was only caught during UAT — should have been included in Phase 1's plan.
- Redis/PostgreSQL not being pre-configured meant blocking a large number of E2E tests during UAT.

### Patterns Established

- `worker.ts` as a monorepo-style single entry point for all background workers
- `src/lib/queue.ts` as the single source of truth for all BullMQ queue instances
- `.env.local.example` as a required artifact alongside any new infrastructure dependency

### Key Lessons

1. Always include `middleware.ts` in auth phase plans — it is essential for route protection.
2. For local-first projects, add a "Infrastructure Setup" pre-phase checklist covering Redis + Postgres + env vars.
3. `sendMail` should be stubbed by default in development and require explicit opt-in for production sending.
4. IMAP polling is simple to implement but complex to test without a real inbox — consider an integration test strategy for v1.1.

### Cost Observations

- Sessions: 1 long session (full milestone in one context)
- Model mix: Gemini 2.5 Pro / Flash balanced profile
- Notable: Entire MVP — 4 phases, 11 plans, full automation pipeline — built in a single conversation session.

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Issues Found in UAT | Fixed During UAT |
|-----------|--------|-------|---------------------|-----------------|
| v1.0 MVP | 4 | 11 | 1 (middleware) | 1 |
