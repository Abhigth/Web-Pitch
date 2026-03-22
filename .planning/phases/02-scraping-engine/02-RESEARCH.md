# Phase 2: Scraping Engine - Research

## Goal
Implement a robust background scraping architecture using Playwright and BullMQ (Redis) to extract Google Maps leads and Social Media links without blocking the Next.js web application.

## Domain
Backend workers and scraping infrastructure.

## Key Decisions
1. **Queue Setup**: We will initialize a BullMQ worker process that runs independently of Next.js, connecting to a local or external Redis instance via `REDIS_URL`. We will execute the standalone TS script via `tsx` or `ts-node` during production to process jobs.
2. **Scraper Tech**: Playwright in headless Chromium mode. It navigates dynamically, handles DOM rendering, and is much harder to block than raw fetch scraping.
3. **Storage**: We already established Prisma schemas in Phase 1. The worker will upsert leads linked to their campaigns, ensuring we target primarily businesses *without* a website.
4. **Resilience**: The queue will manage retries. The scraper will simulate light human behavior (basic scrolling) to bypass simple captchas.

## Validation Architecture
- Run the worker script alongside the dev server.
- Instantiate a campaign targeting a specific city.
- Observe job triggering in Redis and Playwright scraping the Maps DOM.
