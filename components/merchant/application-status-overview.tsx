"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, XCircle } from "lucide-react"

const statusData = [
  {
    status: "Approved",
    count: 34,
    percentage: 72.3,
    icon: CheckCircle,
    color: "green",
  },
  {
    status: "Pending",
    count: 8,
    percentage: 17.0,
    icon: Clock,
    color: "yellow",
  },
  {
    status: "Rejected",
    count: 5,
    percentage: 10.7,
    icon: XCircle,
    color: "red",
  },
]

export function ApplicationStatusOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statusData.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/20`}>
                      <Icon className={`h-4 w-4 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.status}</p>
                      <p className="text-sm text-muted-foreground">{item.count} applications</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.percentage}%</p>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
