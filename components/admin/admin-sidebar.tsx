"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calculator, CreditCard, FileText, Home, LogOut, Settings, Store, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="group flex flex-col gap-4 py-4 data-[collapsed=true]:py-4 border-r min-h-screen">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Dashboard</h2>
      </div>
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/admin/dashboard" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/applications"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname.includes("/admin/applications") ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <CreditCard className="h-4 w-4" />
          <span>Applications</span>
        </Link>
        <Link
          href="/admin/emi-calculator"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/admin/emi-calculator" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Calculator className="h-4 w-4" />
          <span>EMI Calculator</span>
        </Link>
        <Link
          href="/admin/stores"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname.includes("/admin/stores") ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Store className="h-4 w-4" />
          <span>Stores</span>
        </Link>
        <Link
          href="/admin/users"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname.includes("/admin/users") ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Users className="h-4 w-4" />
          <span>Users</span>
        </Link>
        <Link
          href="/admin/reports"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname.includes("/admin/reports") ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Reports</span>
        </Link>
        <Link
          href="/admin/logs"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname.includes("/admin/logs") ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Logs</span>
        </Link>
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/admin/settings" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </nav>
      <div className="mt-auto px-2">
        <Link href="/login">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}
