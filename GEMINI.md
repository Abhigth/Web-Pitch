<!-- GSD:project-start source:PROJECT.md -->
## Project

**Automated Outreach Web App**

An automated web application that scrapes Google Maps and social media (like Facebook/Instagram) for local businesses that do not have a website. It automatically extracts their contact information and sends bulk cold emails from the user's connected email accounts (using App Passwords/SMTP). If a lead replies positively, the system automatically sends a follow-up email presenting the user's custom website plans.

**Core Value:** Completely automating the prospecting and initial cold-pitching phase so the user can seamlessly acquire web design clients without manual grinding.

### Constraints

- **Tech Stack**: Must support robust web scraping (e.g., Puppeteer/Playwright or specialized APIs) alongside a web frontend and backend.
- **Cost**: The email sending infrastructure must be free (e.g., using existing Gmail accounts).
- **Deliverability**: Email sending must be paced and randomized to mimic human behavior and avoid immediate IP/domain blacklisting.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Current Standard Stack
*   **Frontend**: Next.js with React (or Vue.js with Nuxt). Next.js provides a great foundation for dashboard interfaces and API routes if a standalone backend isn't desired.
*   **Backend**: Node.js (often using Express or Fastify). Node has the richest ecosystem for scraping tools and SMTP handling.
*   **Scraping**: Playwright or Puppeteer. Playwright is currently favored for resilience against anti-bot measures, handling dynamic Maps and Social pages reliably.
*   **Database**: PostgreSQL (via an ORM like Prisma or Drizzle). Reliable for relational data (users, campaigns, leads, templates).
*   **Email Handling**:
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
