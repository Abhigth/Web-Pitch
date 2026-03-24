import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addSmtpAccount, toggleSmtpAccount, deleteSmtpAccount } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  })

  const accounts = await prisma.smtpSettings.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "asc" }
  })

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      {/* ── Existing Accounts ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>SMTP Account Pool</CardTitle>
          <CardDescription>
            All active accounts are used in round-robin rotation when dispatching emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {accounts.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No accounts yet. Add one below.</p>
          )}
          {accounts.map((acct) => (
            <div
              key={acct.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-opacity ${acct.isActive ? "" : "opacity-50"}`}
            >
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{acct.label}</p>
                <p className="text-xs text-muted-foreground truncate">{acct.userString} · {acct.host}:{acct.port}</p>
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                {/* Toggle */}
                <form action={toggleSmtpAccount}>
                  <input type="hidden" name="id" value={acct.id} />
                  <Button variant="outline" size="sm" type="submit">
                    {acct.isActive ? "Disable" : "Enable"}
                  </Button>
                </form>
                {/* Delete */}
                <form action={deleteSmtpAccount}>
                  <input type="hidden" name="id" value={acct.id} />
                  <Button variant="destructive" size="sm" type="submit">Remove</Button>
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Add New Account ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Add SMTP Account</CardTitle>
          <CardDescription>
            Use a Gmail App Password for best results. Go to Google Account → Security → App Passwords to generate one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addSmtpAccount} className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="label">Account Label</Label>
              <Input id="label" name="label" placeholder="Work Gmail" defaultValue="" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="host">SMTP Host</Label>
                <Input id="host" name="host" placeholder="smtp.gmail.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" name="port" type="number" placeholder="465" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userString">Username (Email)</Label>
              <Input id="userString" name="userString" placeholder="you@gmail.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passString">App Password</Label>
              <Input id="passString" name="passString" type="password" placeholder="xxxx xxxx xxxx xxxx" required />
            </div>
            <Button type="submit">Add Account</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
