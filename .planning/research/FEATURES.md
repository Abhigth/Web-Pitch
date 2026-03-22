# Features Analysis

## Table Stakes (Must-Haves)

To be minimally viable, an automated cold-outreach system must have:

*   **Campaign Management**: Create campaigns, define search keywords/locations (e.g., "Plumbers in Austin, TX").
*   **Automated Scraping Engine**: Extract names, business URLs, and email addresses. Most critically, identify businesses *without* an existing website.
*   **Email Template Builder**: Ability to draft initial pitch emails and follow-up emails, using variables like `{{Business_Name}}`.
*   **SMTP Connection Management**: Add standard IMAP/SMTP credentials or Gmail App Passwords to an account pool.
*   **Paced Sending**: Send emails with randomized delays (e.g., wait 5-12 minutes between sends) to simulate human behavior and avoid rate limits.
*   **Reply Tracking**: Periodically check connected inboxes for replies to sent emails.

## Differentiators (Competitive Advantage)

*   **Intelligent Follow-Up Automation**: Automatically detecting positive intent vs. "unsubscribe" replies and triggering the "website plans" email *only* on positive replies.
*   **Social Media Fallback**: If Google Maps fails to yield an email, fallback to searching the business name on Facebook/Instagram to locate contact info.
*   **Multi-Inbox Rotation (Inbox Spintax)**: Distributing the email load across 5-10 different Gmail accounts automatically to keep sending limits low per account.

## Anti-Features (What we deliberately WILL NOT build)

*   **A Built-in Website Builder/CMS**: The tool sells websites; the user acts as the agency implementing them. We will not build Wix inside this app.
*   **Automated Cold Calling / SMS**: Scope creep. Stick to email outreach.
*   **Advanced AI Email Writing**: Drafting highly personalized AI text for each business is complex and slow; utilizing standard, effective templating with basic variable substitution is more reliable for MVP.
