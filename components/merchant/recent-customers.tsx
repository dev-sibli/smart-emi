"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, CreditCard } from "lucide-react"

const recentCustomers = [
  {
    id: "1",
    name: "John Doe",
    phone: "9876543210",
    email: "john@example.com",
    totalApplications: 3,
    approvedApplications: 2,
    lastActivity: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "8765432109",
    email: "jane@example.com",
    totalApplications: 1,
    approvedApplications: 1,
    lastActivity: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    phone: "7654321098",
    email: "robert@example.com",
    totalApplications: 2,
    approvedApplications: 0,
    lastActivity: "3 days ago",
    status: "inactive",
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "6543210987",
    email: "emily@example.com",
    totalApplications: 4,
    approvedApplications: 3,
    lastActivity: "5 hours ago",
    status: "active",
  },
]

export function RecentCustomers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>Your most recent customer interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{customer.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  {customer.approvedApplications}/{customer.totalApplications} approved
                </div>
                <p className="text-xs text-muted-foreground">Last activity: {customer.lastActivity}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
