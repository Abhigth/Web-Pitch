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
  
  const campaigns = await prisma.campaign.findMany({ where: { userId: user?.id }, orderBy: { createdAt: 'desc' } })

  async function createCampaign(data: FormData) {
    "use server"
    const name = data.get("name") as string
    const location = data.get("location") as string
    const keywords = data.get("keywords") as string

    if (!name || !location || !keywords) return;

    const campaign = await prisma.campaign.create({
      data: {
        userId: user!.id,
        name,
        location,
        keywords,
        status: "SCRAPING"
      }
    })

    await scrapeQueue.add('scrape', { campaignId: campaign.id, location, keywords })
    
    revalidatePath("/dashboard/campaigns")
  }

  async function startSendingCampaign(campaignId: string) {
    "use server"
    
    const leads = await prisma.lead.findMany({ where: { campaignId, status: 'NEW' } })
    
    const templateText = "Hi {name},\n\nI noticed you don't have a website at this google maps location. I build fast, SEO-optimized sites. Let's talk.\n\nBest, \nLocalWebDesign"
    
    for (const l of leads) {
      await emailQueue.add('sendEmail', { leadId: l.id, templateText })
    }
    
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'SENDING' }
    })
    
    revalidatePath("/dashboard/campaigns")
  }

  return (
    <div className="max-w-4xl">
      <AutoRefresh interval={5000} />
      <h1 className="text-3xl font-bold tracking-tight mb-8">Campaigns</h1>
      <CampaignWizard action={createCampaign} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mt-8 mb-4">Existing Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-sm">No campaigns yet. Create one above.</p>
        ) : (
          campaigns.map((c: any) => (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <CardDescription>{c.location} • {c.keywords}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {c.status}
                </span>
                {c.status === 'COMPLETED' && (
                  <form action={startSendingCampaign.bind(null, c.id)} className="inline-block ml-4">
                    <button type="submit" className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded">Start Sending Emails</button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
