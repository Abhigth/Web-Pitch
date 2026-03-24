import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { TemplateEditor } from "@/components/templates/TemplateEditor"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { revalidatePath } from "next/cache"

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions)
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email! } })
  
  const pitchTemplate = await prisma.template.findFirst({ where: { userId: user?.id, type: "PITCH" } })
  const followupTemplate = await prisma.template.findFirst({ where: { userId: user?.id, type: "FOLLOWUP" } })

  async function savePitchTemplate(data: FormData) {
    "use server"
    const subject = data.get("subject") as string
    const bodyPlain = data.get("bodyPlain") as string
    const id = data.get("id") as string
    
    if (id) {
      await prisma.template.update({ where: { id }, data: { subject, bodyPlain } })
    } else {
      await prisma.template.create({ data: { userId: user!.id, type: "PITCH", subject, bodyPlain } })
    }
    revalidatePath("/dashboard/templates")
  }

  async function saveFollowupTemplate(data: FormData) {
    "use server"
    const subject = data.get("subject") as string
    const bodyPlain = data.get("bodyPlain") as string
    const id = data.get("id") as string
    
    if (id) {
      await prisma.template.update({ where: { id }, data: { subject, bodyPlain } })
    } else {
      await prisma.template.create({ data: { userId: user!.id, type: "FOLLOWUP", subject, bodyPlain } })
    }
    revalidatePath("/dashboard/templates")
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground mt-2">Manage your plain-text cold outreach templates.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Initial Pitch</CardTitle>
            <CardDescription>Sent immediately to new leads.</CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateEditor action={savePitchTemplate} existing={pitchTemplate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-Up</CardTitle>
            <CardDescription>Sent on positive reply detection.</CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateEditor action={saveFollowupTemplate} existing={followupTemplate} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
