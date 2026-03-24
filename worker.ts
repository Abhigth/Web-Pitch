import { Worker } from 'bullmq'
import { PrismaClient } from '@prisma/client'
import { chromium, type Page } from 'playwright'
import * as nodemailer from 'nodemailer'

const prisma = new PrismaClient()

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
}

// ─── EMAIL EXTRACTION HELPER ─────────────────────────────────────────────────

async function extractEmailFromWebsite(page: Page, websiteUrl: string | null): Promise<string | null> {
  if (!websiteUrl) return null
  try {
    await page.goto(websiteUrl, { waitUntil: 'load', timeout: 15000 })
    const mailtoLinks = await page.locator('a[href^="mailto:"]').all()
    for (const link of mailtoLinks) {
      const href = await link.getAttribute('href')
      if (href) return href.replace('mailto:', '').split('?')[0].trim()
    }

    // Try /contact page
    const base = websiteUrl.replace(/\/$/, '')
    await page.goto(`${base}/contact`, { waitUntil: 'load', timeout: 10000 })
    const contactLinks = await page.locator('a[href^="mailto:"]').all()
    for (const link of contactLinks) {
      const href = await link.getAttribute('href')
      if (href) return href.replace('mailto:', '').split('?')[0].trim()
    }
  } catch {
    // Network error or timeout — fail silently
  }
  return null
}

// ─── SCRAPE WORKER ────────────────────────────────────────────────────────────

const worker = new Worker('scrape-campaigns', async job => {
  console.log('[SCRAPER] Processing job for campaign:', job.data.campaignId)

  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage()

    // Navigate to Google Maps search
    const query = encodeURIComponent(`${job.data.keywords} in ${job.data.location}`)
    await page.goto(`https://www.google.com/maps/search/${query}`, { waitUntil: 'load', timeout: 60000 })
    await page.waitForTimeout(4000)

    const listings = await page.locator('.hfpxzc').all()
    const maxResults = Math.min(listings.length, 10)

    for (let i = 0; i < maxResults; i++) {
      try {
        // Click the listing to open the info panel
        await listings[i].click()
        await page.waitForTimeout(2500)

        // Extract business name from detail panel heading
        const name = await page.locator('h1.DUwDvf').textContent().catch(() => null)
          ?? await listings[i].getAttribute('aria-label')
        if (!name) continue

        // Extract website URL — Maps shows it with data-item-id="authority"
        const websiteUrl = await page.locator('a[data-item-id="authority"]').getAttribute('href').catch(() => null)

        // Extract phone number
        const phoneEl = await page.locator('[data-item-id^="phone:tel:"]').first()
        const phone = await phoneEl.getAttribute('data-item-id').catch(() => null)
        const phoneNumber = phone ? phone.replace('phone:tel:', '') : null

        // Only save leads WITHOUT a website — these are our target prospects
        if (!websiteUrl) {
          await prisma.lead.create({
            data: {
              campaignId: job.data.campaignId,
              name: name.trim(),
              phone: phoneNumber,
              website: null,
              email: null,
              source: 'GOOGLE_MAPS',
              status: 'NEW'
            }
          })
          console.log(`[SCRAPER] Saved lead (no website): ${name.trim()}`)
        } else {
          console.log(`[SCRAPER] Skipped (has website): ${name.trim()}`)
        }
      } catch (listingErr) {
        console.warn('[SCRAPER] Error processing listing, skipping:', listingErr)
      }
    }

    // ── Email crawl pass ─────────────────────────────────────────────────────
    // For all NEW leads in this campaign without an email, crawl their website
    // Note: since we only save leads WITHOUT websites, this pass is a safety net
    // for cases where a website was later found or for prospects with partial data.
    const leadsNeedingEmail = await prisma.lead.findMany({
      where: { campaignId: job.data.campaignId, email: null, status: 'NEW' }
    })

    if (leadsNeedingEmail.length > 0) {
      console.log(`[SCRAPER] Starting email extraction for ${leadsNeedingEmail.length} leads...`)
      const emailPage = await browser.newPage()

      for (const lead of leadsNeedingEmail) {
        const email = await extractEmailFromWebsite(emailPage, lead.website)
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            email: email ?? null,
            status: email ? 'NEW' : 'NO_EMAIL'
          }
        })
        console.log(`[SCRAPER] Lead ${lead.name}: email = ${email ?? 'not found → NO_EMAIL'}`)
      }

      await emailPage.close()
    }

  } catch (error) {
    console.error('[SCRAPER] Fatal error:', error)
    throw error
  } finally {
    await browser.close()
  }

  await prisma.campaign.update({
    where: { id: job.data.campaignId },
    data: { status: 'COMPLETED' }
  })
  console.log(`[SCRAPER] Campaign ${job.data.campaignId} completed.`)
}, { connection })

worker.on('completed', job => { console.log(`[SCRAPER] Job ${job.id} done`) })
worker.on('failed', (job, err) => { console.log(`[SCRAPER] Job ${job?.id} failed: ${err.message}`) })

// ─── TEMPLATE VARIABLE RESOLVER ───────────────────────────────────────────────

/**
 * Resolves merge variables in a template string using lead data.
 * Supported variables:
 *   {business_name}  → lead.name
 *   {first_name}     → first word of lead.name (best-effort)
 *   {city}           → last word of campaign.location OR campaign.location
 *   {phone}          → lead.phone
 * Missing values fall back to sensible defaults.
 */
function resolveTemplate(
  template: string,
  lead: { name: string; phone?: string | null },
  campaign: { location: string }
): string {
  const businessName = lead.name || 'Business'
  const firstName = businessName.split(' ')[0] || 'there'
  const city = campaign.location
    ? campaign.location.split(',').pop()?.trim() ?? campaign.location
    : 'your area'
  const phone = lead.phone || ''

  return template
    .replace(/\{business_name\}/gi, businessName)
    .replace(/\{first_name\}/gi, firstName)
    .replace(/\{city\}/gi, city)
    .replace(/\{phone\}/gi, phone)
    // Legacy variable support (from editor hint labels)
    .replace(/\{\{BusinessName\}\}/gi, businessName)
    .replace(/\{\{Location\}\}/gi, city)
    .replace(/\{name\}/gi, firstName) // backward-compat with old worker code
}

// ─── EMAIL WORKER ─────────────────────────────────────────────────────────────

const emailWorker = new Worker('email-campaigns', async job => {
  console.log('[EMAIL] Processing job for lead:', job.data.leadId)

  const lead = await prisma.lead.findUnique({
    where: { id: job.data.leadId },
    include: { campaign: true }
  })

  if (!lead) return

  // Round-robin across all ACTIVE SMTP accounts for this user
  const smtpAccounts = await prisma.smtpSettings.findMany({
    where: { userId: lead.campaign.userId, isActive: true },
    orderBy: { createdAt: 'asc' }
  })

  if (smtpAccounts.length === 0) {
    console.error('[EMAIL] No active SMTP accounts for user', lead.campaign.userId)
    return
  }

  // Use job.attemptsMade (0-indexed) to rotate through accounts
  const attempt = (job.attemptsMade ?? 0)
  const smtp = smtpAccounts[attempt % smtpAccounts.length]
  console.log(`[EMAIL] Using account "${smtp.label}" (${smtp.userString}) [${attempt % smtpAccounts.length + 1}/${smtpAccounts.length}]`)

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.userString, pass: smtp.passString }
  })

  const rawTemplate = job.data.templateText || 'Hi {first_name}, I noticed {business_name} in {city} does not have a website...'
  const resolvedSubject = resolveTemplate('Website Growth for {business_name}', lead, lead.campaign)
  const resolvedBody = resolveTemplate(rawTemplate, lead, lead.campaign)

  const mailOptions = {
    from: `${lead.campaign.name} <${smtp.userString}>`,
    to: lead.email || 'test@example.com',
    subject: resolvedSubject,
    text: resolvedBody
  }

  try {
    // await transporter.sendMail(mailOptions) // uncomment for real sending
    console.log(`[EMAIL] Stub sent to ${mailOptions.to} via ${smtp.label} | subject: ${mailOptions.subject}`)
    await prisma.lead.update({ where: { id: lead.id }, data: { status: 'CONTACTED' } })
  } catch (error) {
    console.error('[EMAIL] Failed to send:', error)
    throw error
  }
}, { connection, limiter: { max: 2, duration: 60000 } })

emailWorker.on('completed', job => { console.log(`[EMAIL] Job ${job.id} done`) })
emailWorker.on('failed', (job, err) => { console.log(`[EMAIL] Job ${job?.id} failed: ${err.message}`) })

console.log("Scraper and Email Pace workers started and listening for jobs...")

// ─── IMAP POLLING WORKER ────────────────────────────────────────────────────

import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import { emailQueue as _emailQueue } from './src/lib/queue'

const POSITIVE_REGEX = /\b(yes|sure|interested|send|pricing|details|sounds good|love to|how much|let's talk|tell me more)\b/i
const NEGATIVE_REGEX = /\b(no|stop|unsubscribe|not interested|remove me|opt.?out)\b/i

const imapWorker = new Worker('imap-polling', async _job => {
  console.log('[IMAP] Polling inbox for replies...')

  const allSmtp = await prisma.smtpSettings.findMany()

  for (const smtp of allSmtp) {
    const imapHost = smtp.host.replace(/^smtp\./, 'imap.')

    const client = new ImapFlow({
      host: imapHost,
      port: 993,
      secure: true,
      auth: { user: smtp.userString, pass: smtp.passString },
      logger: false
    })

    try {
      await client.connect()

      const lock = await client.getMailboxLock('INBOX')
      try {
        // Search for unseen messages only
        const unseenUids = await client.search({ seen: false }, { uid: true })

        for (const uid of Array.isArray(unseenUids) ? unseenUids : []) {
          for await (const msg of client.fetch(String(uid), { envelope: true, source: true }, { uid: true })) {
            const senderEmail = msg.envelope?.from?.[0]?.address?.toLowerCase()
            if (!senderEmail || !msg.source) continue

            const parsed = await simpleParser(msg.source)
            const bodyText = parsed.text || ''

            const lead = await prisma.lead.findFirst({ where: { email: senderEmail } })

            if (!lead) {
              console.log(`[IMAP] No lead matched for ${senderEmail}`)
              continue
            }

            let newStatus: string | null = null

            if (POSITIVE_REGEX.test(bodyText)) {
              newStatus = 'REPLIED_POSITIVE'
              const followUpText = `Hi ${lead.name || 'there'},\n\nGreat to hear from you! Here is a link to my website plans: https://my-portfolio.com\n\nLet me know which package suits your needs!\n\nBest regards`
              await _emailQueue.add('sendEmail', { leadId: lead.id, templateText: followUpText })
              console.log(`[IMAP] Positive reply from ${senderEmail} — follow-up queued`)
            } else if (NEGATIVE_REGEX.test(bodyText)) {
              newStatus = 'REPLIED_NEGATIVE'
              console.log(`[IMAP] Negative reply from ${senderEmail} — marked opted out`)
            } else {
              console.log(`[IMAP] Neutral reply from ${senderEmail} — no action`)
            }

            if (newStatus) {
              await prisma.lead.update({ where: { id: lead.id }, data: { status: newStatus } })
            }

            await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true })
          }
        }
      } finally {
        lock.release()
      }

      await client.logout()
    } catch (err: any) {
      console.error(`[IMAP] Connection error for ${smtp.userString}:`, err.message)
    }
  }

  console.log('[IMAP] Poll complete.')
}, { connection })

imapWorker.on('completed', job => { console.log(`[IMAP] Job ${job.id} done`) })
imapWorker.on('failed', (job, err) => { console.error(`[IMAP] Job ${job?.id} failed: ${err.message}`) })


