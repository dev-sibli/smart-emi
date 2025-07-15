"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, FileDown, FileText, Trash2 } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { jsPDF } from "jspdf"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { initialApplications, stores, initialActivityLogs } from "@/lib/mock-data"
import { logApplicationDelete } from "@/lib/activity-logger"
import { formatCurrency } from "@/lib/utils"
import { APPLICATION_STATUSES } from "@/lib/constants"

interface AdminApplicationsTableProps {
  limit?: number
  statusFilter?: string
  hideDateFilter?: boolean
  hideExport?: boolean
}

export function AdminApplicationsTable({
  limit,
  statusFilter,
  hideDateFilter = false,
  hideExport = false,
}: AdminApplicationsTableProps) {
  const { toast } = useToast()
  const [applications, setApplications] = useLocalStorage("applications", initialApplications)
  const [activityLogs, setActivityLogs] = useLocalStorage("activityLogs", initialActivityLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [storeFilter, setStoreFilter] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || "all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [applicationsToDelete, setApplicationsToDelete] = useState<string[]>([])

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300)

  const getDateFromString = useCallback((dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }, [])

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          app.customerName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          app.phoneNumber.includes(debouncedSearchQuery) ||
          app.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          app.notes.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

        const matchesStore = storeFilter === "all" || app.store === storeFilter
        const matchesStatus = selectedStatus === "all" || app.status === selectedStatus

        let matchesDate = true
        if (dateRange.from || dateRange.to) {
          const appDate = getDateFromString(app.date)

          if (dateRange.from && dateRange.to) {
            matchesDate = appDate >= dateRange.from && appDate <= dateRange.to
          } else if (dateRange.from) {
            matchesDate = appDate >= dateRange.from
          } else if (dateRange.to) {
            matchesDate = appDate <= dateRange.to
          }
        }

        return matchesSearch && matchesStore && matchesStatus && matchesDate
      })
      .slice(0, limit || applications.length)
  }, [applications, debouncedSearchQuery, storeFilter, selectedStatus, dateRange, limit, getDateFromString])

  const handleCheckboxChange = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedApplicationIds((prev) => [...prev, id])
    } else {
      setSelectedApplicationIds((prev) => prev.filter((appId) => appId !== id))
    }
  }, [])

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedApplicationIds(filteredApplications.map((app) => app.id))
      } else {
        setSelectedApplicationIds([])
      }
    },
    [filteredApplications],
  )

  const handleDeleteApplications = useCallback(
    async (idsToDelete: string[]) => {
      setIsDeleting(true)
      try {
        const appsToDelete = applications.filter((app) => idsToDelete.includes(app.id))

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            setApplications((prevApps) => prevApps.filter((app) => !idsToDelete.includes(app.id)))
            setSelectedApplicationIds([])
            resolve()
          }, 1000)
        })

        const deletionLogs = appsToDelete.map((app) =>
          logApplicationDelete(app.id, "Admin User (Current)", app.customerName),
        )
        setActivityLogs((prevLogs) => [...deletionLogs, ...prevLogs])

        toast({
          title: "Applications Deleted",
          description: `${idsToDelete.length} application(s) deleted successfully.`,
        })
      } catch (error) {
        console.error("Failed to delete applications:", error)
        toast({
          title: "Error",
          description: "Failed to delete applications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
        setShowDeleteDialog(false)
      }
    },
    [applications, setApplications, setActivityLogs, toast],
  )

  const initiateDelete = useCallback((idsToDelete: string[]) => {
    setApplicationsToDelete(idsToDelete)
    setShowDeleteDialog(true)
  }, [])

  const exportToPdf = useCallback(() => {
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Applications Report", 150, 15, { align: "center" })

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      let filterText = `Status: ${selectedStatus === "all" ? "All" : selectedStatus}, Store: ${storeFilter === "all" ? "All Stores" : storeFilter}`
      if (dateRange.from || dateRange.to) {
        filterText += `, Date: ${dateRange.from ? dateRange.from.toLocaleDateString() : "Any"} to ${dateRange.to ? dateRange.to.toLocaleDateString() : "Any"}`
      }
      pdf.text(filterText, 15, 25)

      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 250, 25, { align: "right" })

      const headers = [
        "ID",
        "Customer",
        "Phone",
        "Email",
        "Card Number",
        "Client ID",
        "Amount (BDT)",
        "Tenure",
        "Date",
        "Status",
        "Store",
        "Merchant",
        "Approval Code",
        "Notes",
      ]
      let y = 35

      pdf.setFont("helvetica", "bold")
      pdf.setFillColor(240, 240, 240)
      pdf.rect(15, y - 5, 270, 10, "F")

      const colWidths = [15, 20, 20, 30, 25, 20, 20, 15, 20, 20, 20, 20, 20, 30]
      let xPos = 15

      headers.forEach((header, i) => {
        pdf.text(header, xPos, y)
        xPos += colWidths[i]
      })

      pdf.setFont("helvetica", "normal")
      filteredApplications.forEach((app, index) => {
        y += 10
        if (y > 180) {
          pdf.addPage()
          y = 35

          pdf.setFont("helvetica", "bold")
          pdf.setFillColor(240, 240, 240)
          pdf.rect(15, y - 5, 270, 10, "F")

          xPos = 15
          headers.forEach((header, i) => {
            pdf.text(header, xPos, y)
            xPos += colWidths[i]
          })

          pdf.setFont("helvetica", "normal")
          y += 10
        }

        xPos = 15
        const values = [
          app.id,
          app.customerName,
          app.phoneNumber,
          app.email,
          app.cardNumber,
          app.clientId,
          app.amount.toLocaleString(),
          `${app.tenure} months`,
          app.date,
          app.status,
          app.store,
          app.merchant,
          app.approvalCode,
          app.notes,
        ]

        values.forEach((value, i) => {
          pdf.text(value, xPos, y)
          xPos += colWidths[i]
        })

        if (index < filteredApplications.length - 1) {
          pdf.setDrawColor(220, 220, 220)
          pdf.line(15, y + 2, 285, y + 2)
        }
      })

      pdf.setFontSize(8)
      pdf.text("Smart EMI Application System", 150, 200, { align: "center" })

      pdf.save("applications-report.pdf")

      toast({
        title: "PDF Generated",
        description: `${filteredApplications.length} applications exported to PDF.`,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      })
    }
  }, [filteredApplications, selectedStatus, storeFilter, dateRange, toast])

  const exportToExcel = useCallback(() => {
    try {
      let csvContent =
        "ID,Customer,Phone,Email,Card Number,Client ID,Amount (BDT),Tenure (months),Date,Status,Store,Merchant,Approval Code,Notes\n"

      filteredApplications.forEach((app) => {
        csvContent += `${app.id},${app.customerName},${app.phoneNumber},${app.email},${app.cardNumber},${app.clientId},${app.amount},${app.tenure},${app.date},${app.status},${app.store},${app.merchant},${app.approvalCode},"${app.notes}"\n`
      })

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "applications-report.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Excel File Generated",
        description: `${filteredApplications.length} applications exported to CSV.`,
      })
    } catch (error) {
      console.error("Error generating Excel:", error)
      toast({
        title: "Excel Generation Failed",
        description: "There was an error generating the Excel file. Please try again.",
        variant: "destructive",
      })
    }
  }, [filteredApplications, toast])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {APPLICATION_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={storeFilter} onValueChange={setStoreFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.name}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hideDateFilter && (
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <DatePicker
              selected={dateRange.from}
              onSelect={(date) => setDateRange({ ...dateRange, from: date })}
              placeholder="From Date"
            />
          </div>
          <div className="flex-1">
            <DatePicker
              selected={dateRange.to}
              onSelect={(date) => setDateRange({ ...dateRange, to: date })}
              placeholder="To Date"
            />
          </div>
          {!hideExport && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToPdf} className="flex items-center gap-2 bg-transparent">
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={exportToExcel} className="flex items-center gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          )}
        </div>
      )}

      {selectedApplicationIds.length > 0 && (
        <div className="flex justify-end">
          <Button variant="destructive" disabled={isDeleting} onClick={() => initiateDelete(selectedApplicationIds)}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedApplicationIds.length})
              </>
            )}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selectedApplicationIds.length === filteredApplications.length && filteredApplications.length > 0
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Amount (BDT)</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval Code</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedApplicationIds.includes(application.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(application.id, !!checked)}
                      aria-label={`Select application ${application.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{application.id}</TableCell>
                  <TableCell>{application.customerName}</TableCell>
                  <TableCell>{application.store}</TableCell>
                  <TableCell>{formatCurrency(application.amount)}</TableCell>
                  <TableCell>{application.tenure} months</TableCell>
                  <TableCell>{application.date}</TableCell>
                  <TableCell>
                    <ApplicationStatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{application.approvalCode}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                    {application.notes}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/admin/applications/${application.id}`} className="w-full">
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => initiateDelete([application.id])}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Application
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {applicationsToDelete.length} selected application(s)? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteApplications(applicationsToDelete)} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
