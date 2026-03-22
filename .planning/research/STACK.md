# Domain Stack Analysis

## Current Standard Stack

For a cold-outreach and lead-generation web application in 2026, the standard modern stack optimizes for rapid frontend development and a robust backend capable of managing headless browsers (for scraping) and SMTP/IMAP connections.

*   **Frontend**: Next.js with React (or Vue.js with Nuxt). Next.js provides a great foundation for dashboard interfaces and API routes if a standalone backend isn't desired.
*   **Backend**: Node.js (often using Express or Fastify). Node has the richest ecosystem for scraping tools and SMTP handling.
*   **Scraping**: Playwright or Puppeteer. Playwright is currently favored for resilience against anti-bot measures, handling dynamic Maps and Social pages reliably.
*   **Database**: PostgreSQL (via an ORM like Prisma or Drizzle). Reliable for relational data (users, campaigns, leads, templates).
*   **Email Handling**:
    *   Sending: `nodemailer` for SMTP connections via Gmail App Passwords.
    *   Receiving (Reply Detection): `imap` or `node-imap` to poll inboxes and detect replies.
*   **Job Queue**: Redis with BullMQ. Background scraping and paced email sending require robust task queues so the web interface doesn't block.

## Recommended Choices for This Project

*   **Next.js (App Router)**: Fast, full-stack framework allowing dashboard UI and backend APIs in one repository.
*   **Playwright**: Best-in-class headless browser for navigating Google Maps and Facebook to scrape non-API-accessible data.
*   **Nodemailer & IMAP library**: The industry standard for BYO-SMTP setups in Node.
*   **PostgreSQL**: Handles the complex relations between Campaigns, Leads, Sent Emails, and Replies effectively.
*   **Tailwind CSS + Shadcn UI**: For rapidly building a beautiful, professional, and dark-themed dashboard.

## Anti-Patterns (What NOT to use)

*   **Pure Client-Side Scraping**: Do not attempt to scrape Google Maps or LinkedIn/Facebook from the browser directly via `fetch` or CORS proxies. You will get blocked instantly. Scraping must happen server-side via Playwright/Puppeteer.
*   **Synchronous Email Sending**: Never send bulk emails synchronously in an API request. This blocks the server and crashes on timeouts. Always use a Background Queue (BullMQ).
*   **Third-party Managed Email Services for Cold Email (Unless Dedicated IP)**: Standard Mailgun/Sendgrid shared IPs are often pre-burned for cold email deliverability. Since the strategy is "free and effective", BYO-SMTP/Gmail is preferred initially.
