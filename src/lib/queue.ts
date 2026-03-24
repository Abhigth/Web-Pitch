import { Queue } from 'bullmq'

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
}

export const scrapeQueue = new Queue('scrape-campaigns', { connection })
export const emailQueue = new Queue('email-campaigns', { connection })
export const imapQueue = new Queue('imap-polling', { connection })

// Register recurring IMAP poll every 5 minutes on startup
imapQueue.add('poll', {}, { repeat: { every: 300000 } }).catch(() => {})
