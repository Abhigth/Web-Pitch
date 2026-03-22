# Phase 1: Foundation & Dashboard - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Establishing the core Next.js web application, database schema (PostgreSQL), user authentication, and the fundamental dashboard interface necessary before scraping and emailing engines can be integrated.

</domain>

<decisions>
## Implementation Decisions

### Authentication UX
- **D-01:** Implement authentication strictly using Magic Links (e.g. NextAuth/Auth.js with an email provider). No password creation is required.

### Dashboard Metrics
- **D-02:** At a top level, the dashboard should strongly highlight "Replies" (specifically positive ones if applicable later) as the primary KPI of the system.

### Template Editor
- **D-03:** The email template builder must be a plain-text editor, avoiding HTML/WYSIWYG complexity, to ensure maximum raw deliverability for cold outreach. It will support basic template variables (e.g. `{{Name}}`).

### Campaign Setup Flow
- **D-04:** The campaign creation process will utilize a multi-step wizard UI (Step 1: Configuration, Step 2: Templates, etc.) as recommended to keep complex setup processes manageable.

### The agent's Discretion
- The dashboard layout, navigation structure, and specific styling decisions are left to the agent, leveraging Shadcn UI components and Tailwind.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope
- `.planning/PROJECT.md` — Project context and vision
- `.planning/REQUIREMENTS.md` — Phase 1 specific requirements
- `.planning/ROADMAP.md` — Goal and success criteria for Phase 1

</canonical_refs>
