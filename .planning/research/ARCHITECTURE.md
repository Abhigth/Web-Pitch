# Architecture Analysis

## Core Component Boundaries

A reliable bulk email and scraping system must be decoupled to prevent bottlenecks. The web UI should never "wait" for an email to send or a scrape to finish.

1.  **Frontend Dashboard (Next.js)**: The interface for creating campaigns, viewing leads, and configuring connected email accounts. It communicates exclusively with the API.
2.  **API Backend (Node.js/Next.js API)**: Handles CRUD operations for the database. Manages the assignment of tasks to the Queue.
3.  **Database (PostgreSQL)**: Stores Campaigns, Leads, Templates, Email Accounts, Sent Logs, and Reply Logs.
4.  **Job Queue / Worker Layer (Redis/BullMQ)**:
    *   **Scraping Worker**: Receives a query, spins up Playwright, navigates Google Maps/Social Media, extracts data, and saves to the DB.
    *   **Outreach Worker**: Receives a batch of leads, selects an available connected SMTP account, formats the template, connects to the SMTP server, and dispatches the email. Records the "Sent" status.
    *   **Inbox Polling Worker**: Runs on a cron schedule (e.g., every 15 mins). Connects to each active IMAP account, checks for new replies to tracked sent emails, updates the lead status, and triggers the follow-up.

## Data Flow

1.  **User -> Dashboard**: Configures "Plumbers in NYC" campaign.
2.  **Dashboard -> API**: Creates campaign in DB. Dispatches `ScrapeJob` to queue.
3.  **Queue -> Scraping Worker**: Scrapes leads, inserts them into DB as "Pending".
4.  **Dashboard -> API**: User reviews leads, clicks "Start Campaign". API dispatches `OutreachJob` to queue for each lead (with calculated delays).
5.  **Queue -> Outreach Worker**: Sends email via SMTP pool.
6.  **Cron -> Polling Worker**: Checks IMAP. If a positive reply is found, inserts a `FollowUpJob` to the queue.

## Build Order Dependencies

1.  **Phase 1: Foundation**: Database schema, Next.js dashboard scaffolding, basic CRUD for Campaigns/Leads.
2.  **Phase 2: Scraping Engine**: Implement the Playwright workers for Google Maps extraction and integrate with the queue.
3.  **Phase 3: Email Engine**: Implement the SMTP/IMAP worker for pacing, sending, and tracking email accounts.
4.  **Phase 4: Automation/Reply Flow**: Connect the reply detector to the follow-up trigger logic.
