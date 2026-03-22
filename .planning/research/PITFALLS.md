# Pitfalls Analysis

## Common Failure Modes & Prevention

1.  **Anti-Bot Blocks (Scraping)**:
    *   *Warning Sign*: Maps extraction returns 0 results or Captcha challenges.
    *   *Prevention Strategy*: Use randomized delays, realistic user agents, proxy rotation, and the `playwright-stealth` plugin. Do not scrape aggressively; simulate human scrolling speeds.
    *   *Phase addresed*: Phase 2 (Scraping Engine).

2.  **Email Domain Burn (Spam Blacklisting)**:
    *   *Warning Sign*: Open rates plummet to near zero, or emails bounce with Google "Spam Policy" blocks.
    *   *Prevention Strategy*: Never send >50 cold emails per day per connected account. Introduce random `Sleep()` delays between sends (8-15 minutes). Implement Spintax (randomizing subject lines and greetings) so the exact same string isn't blasted out.
    *   *Phase addressed*: Phase 3 (Email Engine).

3.  **Server Timeout / Queue Blocking**:
    *   *Warning Sign*: Dashboard API requests 504 Gateway Timeout while scraping runs.
    *   *Prevention Strategy*: Strictly decouple synchronous web API requests from asynchronous background heavy lifting. Next.js API handles the request, inserts to BullMQ, and returns HTTP 202.
    *   *Phase addressed*: Phase 1 (Foundation/Architecture).

4.  **IMAP Reply Detection Failure**:
    *   *Warning Sign*: A lead replies affirmatively, but the system doesn't know and doesn't send the website plans.
    *   *Prevention Strategy*: Inject custom `Message-ID` headers or hidden tracking tokens into the initial email. When polling the inbox via IMAP, use robust regex or NLP to classify intent (e.g., identify "unsubscribe" vs "send me info").
    *   *Phase addressed*: Phase 4 (Automation/Reply Flow).
