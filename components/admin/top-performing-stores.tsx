"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Store } from "lucide-react"

const topStores = [
  {
    name: "Electronics Store",
    applications: 324,
    approvalRate: 78,
    revenue: "৳12.5M",
    growth: "+15%",
    trend: "up",
  },
  {
    name: "Home Appliances",
    applications: 298,
    approvalRate: 72,
    revenue: "৳11.2M",
    growth: "+12%",
    trend: "up",
  },
  {
    name: "Mobile Shop",
    applications: 256,
    approvalRate: 69,
    revenue: "৳9.8M",
    growth: "+8%",
    trend: "up",
  },
  {
    name: "Furniture Gallery",
    applications: 189,
    approvalRate: 65,
    revenue: "৳7.1M",
    growth: "+5%",
    trend: "up",
  },
]

export function TopPerformingStores() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Top Performing Stores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topStores.map((store, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.applications} applications</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{store.revenue}</p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    {store.growth}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Approval Rate</span>
                  <span>{store.approvalRate}%</span>
                </div>
                <Progress value={store.approvalRate} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
