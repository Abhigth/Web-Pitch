"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Megaphone, Users, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Templates', href: '/dashboard/templates', icon: FileText },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-muted/40 text-foreground">
      <div className="w-64 border-r bg-background">
        <div className="flex h-16 items-center px-6 border-b">
          <span className="text-xl font-bold tracking-tight">Outreach</span>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
