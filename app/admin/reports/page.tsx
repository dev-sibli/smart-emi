"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { PieChart, BarChart, LineChart } from "@/components/admin/charts"
import { FileDown } from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  })
  const [storeFilter, setStoreFilter] = useState("all")
  const [reportType, setReportType] = useState("applications")

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="Reports & Analytics" />

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
            <CardDescription>Select parameters to generate reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applications">Applications</SelectItem>
                    <SelectItem value="stores">Stores</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Store</label>
                <Select value={storeFilter} onValueChange={setStoreFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    <SelectItem value="store1">Electronics Store</SelectItem>
                    <SelectItem value="store2">Home Appliances</SelectItem>
                    <SelectItem value="store3">Mobile Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <DatePicker selected={dateRange.from} onSelect={(date) => setDateRange({ ...dateRange, from: date })} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <DatePicker selected={dateRange.to} onSelect={(date) => setDateRange({ ...dateRange, to: date })} />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="charts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Application Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Applications by Store</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Application Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary Report</CardTitle>
                <CardDescription>
                  {reportType === "applications" && "Summary of applications by status and store"}
                  {reportType === "stores" && "Summary of stores and their performance"}
                  {reportType === "users" && "Summary of users and their activity"}
                  {reportType === "revenue" && "Summary of revenue by store and period"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Total Applications</div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs text-muted-foreground">+12 from previous period</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Approved</div>
                    <div className="text-2xl font-bold">28</div>
                    <div className="text-xs text-green-500">62.2% approval rate</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Pending</div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-yellow-500">26.7% pending rate</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Rejected</div>
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-xs text-red-500">11.1% rejection rate</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Top Performing Stores</h3>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left font-medium">Store</th>
                          <th className="px-4 py-2 text-left font-medium">Applications</th>
                          <th className="px-4 py-2 text-left font-medium">Approval Rate</th>
                          <th className="px-4 py-2 text-left font-medium">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2">Electronics Store</td>
                          <td className="px-4 py-2">18</td>
                          <td className="px-4 py-2">72%</td>
                          <td className="px-4 py-2">8,50,000</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2">Home Appliances</td>
                          <td className="px-4 py-2">15</td>
                          <td className="px-4 py-2">60%</td>
                          <td className="px-4 py-2">6,75,000</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Mobile Shop</td>
                          <td className="px-4 py-2">12</td>
                          <td className="px-4 py-2">50%</td>
                          <td className="px-4 py-2">4,20,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Report</CardTitle>
                <CardDescription>Detailed breakdown of all data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left font-medium">ID</th>
                        <th className="px-4 py-2 text-left font-medium">Customer</th>
                        <th className="px-4 py-2 text-left font-medium">Store</th>
                        <th className="px-4 py-2 text-left font-medium">Amount</th>
                        <th className="px-4 py-2 text-left font-medium">Date</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">APP{(index + 1).toString().padStart(3, "0")}</td>
                          <td className="px-4 py-2">Customer {index + 1}</td>
                          <td className="px-4 py-2">
                            {index % 3 === 0
                              ? "Electronics Store"
                              : index % 3 === 1
                                ? "Home Appliances"
                                : "Mobile Shop"}
                          </td>
                          <td className="px-4 py-2">{(Math.floor(Math.random() * 90000) + 10000).toLocaleString()}</td>
                          <td className="px-4 py-2">
                            {new Date(
                              new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30)),
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            {index % 5 === 0 || index % 5 === 1 || index % 5 === 2
                              ? "approved"
                              : index % 5 === 3
                                ? "pending"
                                : "rejected"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
