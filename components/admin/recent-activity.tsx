"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, UserPlus, Store, FileText } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "application_approved",
    title: "Application APP001 approved",
    description: "John Doe's application for ৳50,000 has been approved",
    user: "Admin User",
    time: "2 minutes ago",
    icon: CheckCircle,
    color: "green",
  },
  {
    id: 2,
    type: "store_added",
    title: "New store registered",
    description: "Fashion Outlet has been added to the system",
    user: "System",
    time: "15 minutes ago",
    icon: Store,
    color: "blue",
  },
  {
    id: 3,
    type: "application_rejected",
    title: "Application APP045 rejected",
    description: "Insufficient documentation provided",
    user: "Admin User",
    time: "1 hour ago",
    icon: XCircle,
    color: "red",
  },
  {
    id: 4,
    type: "user_added",
    title: "New merchant user created",
    description: "Sarah Wilson added to Electronics Store",
    user: "Admin User",
    time: "2 hours ago",
    icon: UserPlus,
    color: "purple",
  },
  {
    id: 5,
    type: "application_pending",
    title: "Review requested",
    description: "APP067 marked for urgent review",
    user: "Merchant User",
    time: "3 hours ago",
    icon: Clock,
    color: "yellow",
  },
  {
    id: 6,
    type: "report_generated",
    title: "Monthly report generated",
    description: "May 2023 performance report is ready",
    user: "System",
    time: "4 hours ago",
    icon: FileText,
    color: "indigo",
  },
]

export function RecentActivity() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 6).map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-2 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
                    <Icon className={`h-4 w-4 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.user}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Performance</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Health</span>
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "88%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium text-yellow-600">Average</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">1.2s</p>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
