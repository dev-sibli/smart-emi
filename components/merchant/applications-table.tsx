"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Search, Filter } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { initialApplications } from "@/lib/mock-data"
import type { Application } from "@/lib/types"

interface ApplicationsTableProps {
  applications?: Application[]
}

export function ApplicationsTable({ applications = initialApplications }: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)

  const filteredApplications = useMemo(() => {
    if (!applications || !Array.isArray(applications)) {
      return []
    }

    return applications.filter((app) => {
      const matchesSearch =
        app.customerName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        app.phoneNumber.includes(debouncedSearchTerm) ||
        app.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || app.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [applications, debouncedSearchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "destructive" as const, variant: "destructive" as const },
      processing: { label: "Processing", variant: "outline" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.customerName}</div>
                    <div className="text-sm text-muted-foreground">{application.phoneNumber}</div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(application.amount)}</TableCell>
                <TableCell>{application.tenure} months</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>{formatDate(application.date)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No applications found matching your criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
