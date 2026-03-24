import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const STATUS_STYLES: Record<string, string> = {
  NEW:              "bg-blue-100 text-blue-800",
  CONTACTED:        "bg-yellow-100 text-yellow-800",
  REPLIED_POSITIVE: "bg-green-100 text-green-800",
  REPLIED_NEGATIVE: "bg-red-100 text-red-800",
  NO_EMAIL:         "bg-slate-100 text-slate-500",
}

export function LeadTable({ leads }: { leads: any[] }) {
  if (leads.length === 0) {
    return <p className="text-sm text-muted-foreground mt-4">No leads found. Create a campaign to start sourcing.</p>
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Campaign</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell className="max-w-[220px] truncate text-sm">
                {lead.email
                  ? <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                  : <span className="text-xs text-muted-foreground italic">none</span>}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{lead.phone ?? "-"}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[lead.status] ?? "bg-slate-100 text-slate-800"}`}>
                  {lead.status === "NO_EMAIL" ? "No Email" : lead.status}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{lead.campaign?.name || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
