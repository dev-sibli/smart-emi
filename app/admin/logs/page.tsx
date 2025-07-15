"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock log data
const mockLogs = Array.from({ length: 20 }, (_, i) => ({
  id: `LOG${(i + 1).toString().padStart(3, "0")}`,
  applicationId: `APP${(Math.floor(Math.random() * 10) + 1).toString().padStart(3, "0")}`,
  action: i % 3 === 0 ? "Application Created" : i % 3 === 1 ? "Application Edited" : "Review Requested",
  user: `Merchant User ${Math.floor(Math.random() * 3) + 1}`,
  store: i % 3 === 0 ? "Electronics Store" : i % 3 === 1 ? "Home Appliances" : "Mobile Shop",
  timestamp: new Date(new Date().setDate(new Date().getDate() - i)).toLocaleString(),
  details:
    i % 3 === 0
      ? "New application submitted"
      : i % 3 === 1
        ? "Customer details updated"
        : "Requested review for urgent approval",
}))

export default function LogsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [storeFilter, setStoreFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  })
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Filter logs based on search and filters
  const filteredLogs = mockLogs.filter(
    (log) =>
      (log.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (storeFilter === "all" || log.store === storeFilter) &&
      (actionFilter === "all" || log.action === actionFilter),
  )

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLogs([])
    } else {
      setSelectedLogs(filteredLogs.map((log) => log.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectLog = (logId: string) => {
    if (selectedLogs.includes(logId)) {
      setSelectedLogs(selectedLogs.filter((id) => id !== logId))
    } else {
      setSelectedLogs([...selectedLogs, logId])
    }
  }

  const handleClearLogs = () => {
    if (selectedLogs.length === 0) {
      toast({
        title: "No logs selected",
        description: "Please select logs to clear.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Logs cleared",
      description: `${selectedLogs.length} logs have been cleared.`,
    })

    setSelectedLogs([])
    setSelectAll(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="System Logs" />

      <Card>
        <CardHeader>
          <CardTitle>Application Activity Logs</CardTitle>
          <CardDescription>View and manage system activity logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  <SelectItem value="Electronics Store">Electronics Store</SelectItem>
                  <SelectItem value="Home Appliances">Home Appliances</SelectItem>
                  <SelectItem value="Mobile Shop">Mobile Shop</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Application Created">Created</SelectItem>
                  <SelectItem value="Application Edited">Edited</SelectItem>
                  <SelectItem value="Review Requested">Review Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <DatePicker selected={dateRange.from} onSelect={(date) => setDateRange({ ...dateRange, from: date })} />
              </div>
              <div className="flex-1">
                <DatePicker selected={dateRange.to} onSelect={(date) => setDateRange({ ...dateRange, to: date })} />
              </div>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={handleClearLogs}
                disabled={selectedLogs.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Clear Selected Logs
              </Button>
            </div>

            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">
                      <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                    </th>
                    <th className="px-4 py-2 text-left font-medium">ID</th>
                    <th className="px-4 py-2 text-left font-medium">Application</th>
                    <th className="px-4 py-2 text-left font-medium">Action</th>
                    <th className="px-4 py-2 text-left font-medium">User</th>
                    <th className="px-4 py-2 text-left font-medium">Store</th>
                    <th className="px-4 py-2 text-left font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No logs found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="px-4 py-2">
                          <Checkbox
                            checked={selectedLogs.includes(log.id)}
                            onCheckedChange={() => handleSelectLog(log.id)}
                          />
                        </td>
                        <td className="px-4 py-2 font-medium">{log.id}</td>
                        <td className="px-4 py-2">{log.applicationId}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              log.action === "Application Created"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : log.action === "Application Edited"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-2">{log.user}</td>
                        <td className="px-4 py-2">{log.store}</td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">{log.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Log Details</TabsTrigger>
                  <TabsTrigger value="stats">Log Statistics</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  {selectedLogs.length === 1 ? (
                    <div className="rounded-md border p-4">
                      <h3 className="text-lg font-medium mb-2">Log Details</h3>
                      {(() => {
                        const selectedLog = mockLogs.find((log) => log.id === selectedLogs[0])
                        if (!selectedLog) return null
                        return (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Log ID</p>
                                <p>{selectedLog.id}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Application ID</p>
                                <p>{selectedLog.applicationId}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Action</p>
                                <p>{selectedLog.action}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">User</p>
                                <p>{selectedLog.user}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Store</p>
                                <p>{selectedLog.store}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                                <p>{selectedLog.timestamp}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Details</p>
                              <p>{selectedLog.details}</p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="rounded-md border p-4 text-center text-muted-foreground">
                      {selectedLogs.length === 0
                        ? "Select a log to view details"
                        : "Multiple logs selected. Select a single log to view details."}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="stats" className="mt-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium mb-4">Log Statistics</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Total Logs</div>
                        <div className="text-2xl font-bold">{mockLogs.length}</div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Applications Created</div>
                        <div className="text-2xl font-bold">
                          {mockLogs.filter((log) => log.action === "Application Created").length}
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">Applications Edited</div>
                        <div className="text-2xl font-bold">
                          {mockLogs.filter((log) => log.action === "Application Edited").length}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
