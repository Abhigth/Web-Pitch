# Phase 4: Reply Detection & Follow-up - Research

## Goal
Implement a reply detection mechanism to identify responses from leads and an automated trigger to send the "website plans" email to positive replies.

## Domain
Background polling workers and basic natural language evaluation.

## Key Decisions
1. **Inbox Integration:** To maintain the "free and effective" mandate using Gmail/SMTP App Passwords, we will connect to the user's IMAP server using the `imapflow` library. 
2. **Polling Queue:** A BullMQ recurring job (every 5-10 minutes) will wake up, connect to IMAP, and search for UNSEEN emails.
3. **Lead Matching:** Incoming emails will be matched against the `Lead.email` field in the database. 
4. **Intent Parsing:** To keep it simple and free, a basic regex/keyword scanner will be used to detect positive intent (e.g., "yes", "interested", "sure", "send", "pricing") vs negative ("no", "stop", "unsubscribe"). A later iteration could integrate a free LLM tier.
5. **Follow-Up Automation:** If a positive reply is detected, the lead's status becomes `REPLIED_POSITIVE`, and the worker automatically pushes a follow-up email job to the existing `emailQueue` containing the Follow-Up Template.

## Validation Architecture
- Boot the worker locally.
- Send a test email from a known lead's email address to the configured SMTP account.
- Observe the IMAP worker picking it up on the next poll, parsing the text, and triggering the follow-up.
