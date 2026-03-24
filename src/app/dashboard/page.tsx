import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email! } })

  const campaignsCount = await prisma.campaign.count({ where: { userId: user?.id } })
  const leadsCount = await prisma.lead.count({ where: { campaign: { userId: user?.id } } })
  const positiveReplies = await prisma.lead.count({ where: { campaign: { userId: user?.id }, status: 'REPLIED_POSITIVE' } })

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground border-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{positiveReplies}</div>
            <p className="text-xs text-primary-foreground/80 mt-1">High intent prospects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Sourced from campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Running outreach</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
