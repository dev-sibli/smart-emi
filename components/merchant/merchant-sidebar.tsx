"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, CreditCard, Home, LogOut, PlusCircle, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MerchantSidebar() {
  const pathname = usePathname()

  return (
    <div className="group flex flex-col gap-4 py-4 data-[collapsed=true]:py-4 border-r min-h-screen">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        <Link
          href="/merchant/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/merchant/dashboard" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/merchant/applications/new"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/merchant/applications/new" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Application</span>
        </Link>
        <Link
          href="/merchant/applications"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname.includes("/merchant/applications") && pathname !== "/merchant/applications/new"
              ? "bg-accent text-accent-foreground"
              : "transparent",
          )}
        >
          <CreditCard className="h-4 w-4" />
          <span>Applications</span>
        </Link>
        <Link
          href="/merchant/emi-calculator"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/merchant/emi-calculator" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <Calculator className="h-4 w-4" />
          <span>EMI Calculator</span>
        </Link>
        <Link
          href="/merchant/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/merchant/profile" ? "bg-accent text-accent-foreground" : "transparent",
          )}
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </Link>
        <Link
          href="/merchant/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === "/merchant/settings" ? "bg-accent text-accent-foreground" : "transparent",
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
