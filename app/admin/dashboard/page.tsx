"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminApplicationsTable } from "@/components/admin/admin-applications-table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Store,
  DollarSign,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  FileText,
  Plus,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminDashboardCharts } from "@/components/admin/admin-dashboard-charts"
import { RecentActivity } from "@/components/admin/recent-activity"
import { TopPerformingStores } from "@/components/admin/top-performing-stores"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Number of Applications",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: CreditCard,
      description: "vs last month",
      color: "blue",
    },
    {
      title: "Total Number of Approved Applications",
      value: "892",
      change: "+8.2%",
      trend: "up",
      icon: CheckCircle,
      description: "71.5% approval rate",
      color: "green",
    },
    {
      title: "Total Number of Pending Application",
      value: "234",
      change: "-5.1%",
      trend: "down",
      icon: Clock,
      description: "18.8% pending",
      color: "yellow",
    },
    {
      title: "Total Revenue",
      value: "BDT 45,2000",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      description: "vs last month",
      color: "purple",
    },
    {
      title: "Active Merchants",
      value: "28",
      change: "+2",
      trend: "up",
      icon: Store,
      description: "2 new this month",
      color: "indigo",
    },
    {
      title: "Total Users",
      value: "156",
      change: "+7",
      trend: "up",
      icon: Users,
      description: "merchants & admins",
      color: "pink",
    },
  ]

  const quickActions = [
    {
      title: "Review Pending Applications",
      count: 234,
      color: "yellow",
      action: "Review Now",
      href: "/admin/applications?status=pending",
      icon: AlertTriangle,
    },
    {
      title: "Approve High Priority",
      count: 12,
      color: "red",
      action: "Approve",
      href: "/admin/applications?priority=high",
      icon: CheckCircle,
    },
    {
      title: "Generate Reports",
      count: 0,
      color: "blue",
      action: "Generate",
      href: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Add New Store",
      count: 0,
      color: "green",
      action: "Add Store",
      href: "/admin/stores/new",
      icon: Plus,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <AdminHeader />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">Here's what's happening with your EMI applications today.</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-200">Today's Applications</p>
              <p className="text-2xl font-bold">47</p>
            </div>
            <div className="w-px h-12 bg-blue-400"></div>
            <div className="text-right">
              <p className="text-sm text-blue-200">Approval Rate</p>
              <p className="text-2xl font-bold">73%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.trend === "up"

          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`h-4 w-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
              <div
                className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`}
              ></div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Take immediate action on important tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20`}>
                      <Icon className={`h-4 w-4 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      {action.count > 0 && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {action.count} items
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Link href={action.href}>
                    <Button size="sm" variant="outline">
                      {action.action}
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminDashboardCharts />
            <TopPerformingStores />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
              <CardDescription>Breakdown of application statuses across all stores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Approved</span>
                  <span className="text-sm font-medium">71.5%</span>
                </div>
                <Progress value={71.5} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="text-sm font-medium">18.8%</span>
                </div>
                <Progress value={18.8} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Rejected</span>
                  <span className="text-sm font-medium">9.7%</span>
                </div>
                <Progress value={9.7} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest EMI applications across all stores</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] overflow-auto">
              <AdminApplicationsTable limit={15} hideDateFilter hideExport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  )
}
