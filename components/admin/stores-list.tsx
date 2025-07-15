"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Search, FileDown, FileText, MapPin, Users, CreditCard, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for stores
const mockStores = [
  {
    id: "STORE001",
    name: "Electronics Store",
    location: "City Center Mall, Main Street",
    merchantCount: 3,
    applicationCount: 15,
    createdAt: "2023-01-15",
    status: "active",
    contactPerson: "John Smith",
    contactEmail: "john.smith@example.com",
    contactPhone: "+91 9876543210",
  },
  {
    id: "STORE002",
    name: "Home Appliances",
    location: "Downtown Plaza, 5th Avenue",
    merchantCount: 2,
    applicationCount: 8,
    createdAt: "2023-02-20",
    status: "active",
    contactPerson: "Jane Doe",
    contactEmail: "jane.doe@example.com",
    contactPhone: "+91 8765432109",
  },
  {
    id: "STORE003",
    name: "Mobile Shop",
    location: "Tech Hub, Innovation Street",
    merchantCount: 2,
    applicationCount: 12,
    createdAt: "2023-03-10",
    status: "inactive",
    contactPerson: "Robert Johnson",
    contactEmail: "robert.johnson@example.com",
    contactPhone: "+91 7654321098",
  },
  {
    id: "STORE004",
    name: "Furniture Gallery",
    location: "Home Center, Decor Boulevard",
    merchantCount: 1,
    applicationCount: 5,
    createdAt: "2023-04-05",
    status: "active",
    contactPerson: "Emily Davis",
    contactEmail: "emily.davis@example.com",
    contactPhone: "+91 6543210987",
  },
  {
    id: "STORE005",
    name: "Fashion Outlet",
    location: "Style Mall, Fashion Avenue",
    merchantCount: 2,
    applicationCount: 7,
    createdAt: "2023-05-12",
    status: "active",
    contactPerson: "Michael Wilson",
    contactEmail: "michael.wilson@example.com",
    contactPhone: "+91 5432109876",
  },
]

interface StoresListProps {
  limit?: number
}

export function StoresList({ limit }: StoresListProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Filter and sort stores
  const filteredStores = mockStores
    .filter(
      (store) =>
        (store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === "all" || store.status === statusFilter),
    )
    .sort((a, b) => {
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "location") {
        comparison = a.location.localeCompare(b.location)
      } else if (sortBy === "merchantCount") {
        comparison = a.merchantCount - b.merchantCount
      } else if (sortBy === "applicationCount") {
        comparison = a.applicationCount - b.applicationCount
      } else if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }

      return sortOrder === "asc" ? comparison : -comparison
    })
    .slice(0, limit || mockStores.length)

  // Export to PDF
  const exportToPdf = () => {
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Add title
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Stores Report", 150, 15, { align: "center" })

      // Add filters info
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      const filterText = `Status: ${statusFilter === "all" ? "All" : statusFilter}, Sort by: ${sortBy}, Order: ${sortOrder}`
      pdf.text(filterText, 15, 25)

      // Add date
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 250, 25, { align: "right" })

      // Table headers
      const headers = [
        "ID",
        "Name",
        "Location",
        "Contact Person",
        "Contact Email",
        "Contact Phone",
        "Merchants",
        "Applications",
        "Status",
        "Created At",
      ]
      let y = 35

      pdf.setFont("helvetica", "bold")
      pdf.setFillColor(240, 240, 240)
      pdf.rect(15, y - 5, 270, 10, "F")

      // Adjust column widths
      const colWidths = [20, 30, 40, 30, 40, 30, 20, 20, 20, 25]
      let xPos = 15

      headers.forEach((header, i) => {
        pdf.text(header, xPos, y)
        xPos += colWidths[i]
      })

      // Table rows
      pdf.setFont("helvetica", "normal")
      filteredStores.forEach((store, index) => {
        y += 10
        if (y > 180) {
          // Add a new page if we're near the bottom
          pdf.addPage()
          y = 35

          // Redraw header on new page
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
        pdf.text(store.id, xPos, y)
        xPos += colWidths[0]
        pdf.text(store.name, xPos, y)
        xPos += colWidths[1]
        pdf.text(store.location, xPos, y)
        xPos += colWidths[2]
        pdf.text(store.contactPerson, xPos, y)
        xPos += colWidths[3]
        pdf.text(store.contactEmail, xPos, y)
        xPos += colWidths[4]
        pdf.text(store.contactPhone, xPos, y)
        xPos += colWidths[5]
        pdf.text(store.merchantCount.toString(), xPos, y)
        xPos += colWidths[6]
        pdf.text(store.applicationCount.toString(), xPos, y)
        xPos += colWidths[7]
        pdf.text(store.status, xPos, y)
        xPos += colWidths[8]
        pdf.text(store.createdAt, xPos, y)

        // Add a light gray line after each row
        if (index < filteredStores.length - 1) {
          pdf.setDrawColor(220, 220, 220)
          pdf.line(15, y + 2, 285, y + 2)
        }
      })

      // Add footer
      pdf.setFontSize(8)
      pdf.text("Smart EMI Application System", 150, 200, { align: "center" })

      // Save the PDF
      pdf.save("stores-report.pdf")

      toast({
        title: "PDF Generated",
        description: `${filteredStores.length} stores exported to PDF.`,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Export to Excel (CSV)
  const exportToExcel = () => {
    try {
      // Create CSV content
      let csvContent =
        "ID,Name,Location,Contact Person,Contact Email,Contact Phone,Merchants,Applications,Status,Created At\n"

      filteredStores.forEach((store) => {
        csvContent += `${store.id},${store.name},${store.location},${store.contactPerson},${store.contactEmail},${store.contactPhone},${store.merchantCount},${store.applicationCount},${store.status},${store.createdAt}\n`
      })

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "stores-report.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Excel File Generated",
        description: `${filteredStores.length} stores exported to CSV.`,
      })
    } catch (error) {
      console.error("Error generating Excel:", error)
      toast({
        title: "Excel Generation Failed",
        description: "There was an error generating the Excel file. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search stores..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="merchantCount">Merchant Count</SelectItem>
            <SelectItem value="applicationCount">Application Count</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          className="w-full sm:w-[120px]"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={exportToPdf} className="flex items-center gap-2 bg-transparent">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
        <Button variant="outline" onClick={exportToExcel} className="flex items-center gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStores.length === 0 ? (
          <p className="col-span-full py-12 text-center text-muted-foreground">No stores found.</p>
        ) : (
          filteredStores.map((store) => (
            <Card key={store.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg hover:text-primary">
                      <Link href={`/admin/stores/${store.id}`}>{store.name}</Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {store.location}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/stores/${store.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/stores/${store.id}/edit`}>Edit store</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={store.status === "active" ? "text-destructive" : "text-green-600"}>
                      {store.status === "active" ? "Deactivate store" : "Activate store"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{store.contactPerson}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-bold">{store.merchantCount}</p>
                      <p className="text-xs text-muted-foreground">Merchants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-bold">{store.applicationCount}</p>
                      <p className="text-xs text-muted-foreground">Applications</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
                <Badge
                  variant={store.status === "active" ? "default" : "destructive"}
                  className={
                    store.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-transparent"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-transparent"
                  }
                >
                  {store.status === "active" ? "Active" : "Inactive"}
                </Badge>
                <span>Created: {store.createdAt}</span>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
