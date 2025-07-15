"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MerchantHeader } from "@/components/merchant/merchant-header"
import { ApplicationsTable } from "@/components/merchant/applications-table"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { initialApplications } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Users, TrendingUp, Clock } from "lucide-react"

export default function MerchantDashboard() {
  const [applications] = useLocalStorage("applications", initialApplications)

  const stats = {
    totalApplications: applications.length,
    approvedApplications: applications.filter((app) => app.status === "approved").length,
    pendingApplications: applications.filter((app) => app.status === "pending").length,
    totalAmount: applications.reduce((sum, app) => sum + app.amount, 0),
  }

  return (
    <div className="flex flex-col gap-6">
      <MerchantHeader title="Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <ApplicationsTable applications={applications} />
    </div>
  )
}
