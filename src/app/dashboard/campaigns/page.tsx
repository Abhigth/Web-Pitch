import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CampaignWizard } from "@/components/campaigns/CampaignWizard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { revalidatePath } from "next/cache"
import { scrapeQueue, emailQueue } from "@/lib/queue"
import { AutoRefresh } from "@/components/ui/AutoRefresh"

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email! } })
  
  const campaigns = await prisma.campaign.findMany({ 
    where: { userId: user?.id },
    include: { leads: true },
    orderBy: { createdAt: 'desc' } 
  })

  // Global Stats
  let totalLeads = 0
  let totalContacted = 0
  let totalPositive = 0
  let totalReplies = 0

  campaigns.forEach(c => {
    totalLeads += c.leads.length
    const contactedCount = c.leads.filter(l => ['CONTACTED', 'REPLIED_POSITIVE', 'REPLIED_NEGATIVE'].includes(l.status)).length
    const replPos = c.leads.filter(l => l.status === 'REPLIED_POSITIVE').length
    const replNeg = c.leads.filter(l => l.status === 'REPLIED_NEGATIVE').length
    
    totalContacted += contactedCount
    totalPositive += replPos
    totalReplies += (replPos + replNeg)
  })

  const globalReplyRate = totalContacted > 0 ? ((totalReplies / totalContacted) * 100).toFixed(1) : 0

  async function createCampaign(data: FormData) {
    "use server"
    const name = data.get("name") as string
    const location = data.get("location") as string
    const keywords = data.get("keywords") as string

    if (!name || !location || !keywords) return;

    const campaign = await prisma.campaign.create({
      data: { userId: user!.id, name, location, keywords, status: "SCRAPING" }
    })

    await scrapeQueue.add('scrape', { campaignId: campaign.id, location, keywords })
    revalidatePath("/dashboard/campaigns")
  }

  async function startSendingCampaign(campaignId: string) {
    "use server"
    const leads = await prisma.lead.findMany({ where: { campaignId, status: 'NEW' } })
    
    for (const l of leads) {
      if (l.email) {
         await emailQueue.add('sendEmail', { leadId: l.id, templateText: '' })
      }
    }
    
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'SENDING' }
    })
    
    revalidatePath("/dashboard/campaigns")
  }

  return (
    <div className="max-w-5xl space-y-8">
      <AutoRefresh interval={30000} />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics & Campaigns</h1>
        <p className="text-muted-foreground mb-6">Real-time performance across all scraping and outreach jobs.</p>
        
        {/* Global Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Total Leads</CardDescription>
              <CardTitle className="text-3xl">{totalLeads}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Emails Sent</CardDescription>
              <CardTitle className="text-3xl">{totalContacted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Reply Rate</CardDescription>
              <CardTitle className="text-3xl">{globalReplyRate}%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Positive Replies</CardDescription>
              <CardTitle className="text-3xl text-green-600">{totalPositive}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      <CampaignWizard action={createCampaign} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mt-8 mb-4">Campaign Overview</h2>
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-sm">No campaigns yet. Create one above.</p>
        ) : (
          campaigns.map((c) => {
            const counts = { NEW: 0, NO_EMAIL: 0, CONTACTED: 0, REPLIED_POSITIVE: 0, REPLIED_NEGATIVE: 0 }
            c.leads.forEach(l => {
              if (counts[l.status as keyof typeof counts] !== undefined) {
                counts[l.status as keyof typeof counts]++
              }
            })
            const total = c.leads.length
            const isSendable = counts.NEW > 0

            return (
              <Card key={c.id}>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <CardDescription>{c.location} • {c.keywords}</CardDescription>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {c.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2 text-center text-sm mb-4 bg-muted/30 p-4 rounded-lg">
                    <div><div className="text-2xl font-bold">{total}</div><div className="text-xs text-muted-foreground">Scraped</div></div>
                    <div><div className="text-2xl font-bold">{counts.NEW}</div><div className="text-xs text-muted-foreground">Ready to Email</div></div>
                    <div><div className="text-2xl font-bold text-slate-500">{counts.NO_EMAIL}</div><div className="text-xs text-muted-foreground">No Email</div></div>
                    <div><div className="text-2xl font-bold">{counts.CONTACTED}</div><div className="text-xs text-muted-foreground">Sent</div></div>
                    <div><div className="text-2xl font-bold text-green-600">{counts.REPLIED_POSITIVE}</div><div className="text-xs text-muted-foreground">Positive</div></div>
                  </div>

                  {c.status === 'COMPLETED' && isSendable && (
                    <form action={startSendingCampaign.bind(null, c.id)}>
                      <button type="submit" className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        Launch Email Sequence ({counts.NEW} leads)
                      </button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
