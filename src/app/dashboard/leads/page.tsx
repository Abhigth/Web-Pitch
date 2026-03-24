import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LeadTable } from "@/components/leads/LeadTable"
import { AutoRefresh } from "@/components/ui/AutoRefresh"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email! } })

  // Build filter clause based on query param
  const filter = searchParams.filter
  const emailFilter =
    filter === "email"
      ? { email: { not: null as any } }
      : filter === "noemail"
      ? { OR: [{ email: null }, { status: "NO_EMAIL" }] }
      : {}

  const leads = await prisma.lead.findMany({
    where: { campaign: { userId: user?.id }, ...emailFilter },
    include: { campaign: true },
    orderBy: { status: "asc" },
  })

  // Counts for filter pills (always unfiltered)
  const allLeads = await prisma.lead.findMany({
    where: { campaign: { userId: user?.id } },
    select: { email: true, status: true },
  })
  const withEmail = allLeads.filter((l) => l.email).length
  const noEmail = allLeads.filter((l) => !l.email || l.status === "NO_EMAIL").length

  const pills = [
    { label: `All (${allLeads.length})`, href: "/dashboard/leads", key: undefined },
    { label: `Has Email (${withEmail})`, href: "/dashboard/leads?filter=email", key: "email" },
    { label: `No Email (${noEmail})`, href: "/dashboard/leads?filter=noemail", key: "noemail" },
  ]

  return (
    <div className="max-w-6xl">
      <AutoRefresh interval={15000} />
      <h1 className="text-3xl font-bold tracking-tight mb-6">Leads Hub</h1>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {pills.map((pill) => {
          const active = filter === pill.key
          return (
            <a
              key={pill.href}
              href={pill.href}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {pill.label}
            </a>
          )
        })}
      </div>

      <LeadTable leads={leads} />
    </div>
  )
}
