"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Building2, Mail, MapPin, Phone, User, FileDown, Edit, UserPlus } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"
import { useToast } from "@/hooks/use-toast"

// Mock store data
const mockStoreData = {
  id: "STORE001",
  name: "Electronics Store",
  location: "City Center Mall, Main Street",
  address: "123 Main Street, City Center Mall, Floor 2, Shop #45, Cityville, 12345",
  contactPerson: "John Smith",
  contactEmail: "john.smith@electronics-store.com",
  contactPhone: "+91 9876543210",
  logo: "/abstract-geometric-es.png",
  description: "A premier electronics store offering the latest gadgets and home appliances with EMI options.",
  merchantCount: 3,
  applicationCount: 15,
  createdAt: "2023-01-15",
  status: "active",
  merchants: [
    {
      id: "USR001",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Manager",
      status: "active",
      avatar: "/placeholder.svg?width=40&height=40",
    },
    {
      id: "USR002",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "Sales",
      status: "active",
      avatar: "/placeholder.svg?width=40&height=40",
    },
    {
      id: "USR003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Sales",
      status: "inactive",
      avatar: "/placeholder.svg?width=40&height=40",
    },
  ],
  recentApplications: [
    { id: "APP001", customerName: "Alice Brown", amount: 50000, date: "2023-05-15", status: "approved" },
    { id: "APP002", customerName: "Bob White", amount: 75000, date: "2023-05-20", status: "pending" },
    { id: "APP003", customerName: "Charlie Green", amount: 30000, date: "2023-05-25", status: "rejected" },
  ],
}

export default function StoreDetailsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const store = mockStoreData // In a real app, you would fetch the store data based on the ID

  const generatePDF = () => {
    setIsGeneratingPdf(true)

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add title and store ID
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text("Store Details", 105, 20, { align: "center" })

      pdf.setFontSize(12)
      pdf.text(`Store ID: ${store.id}`, 105, 30, { align: "center" })

      // Add status in the top sidebar
      pdf.setFillColor(240, 240, 240)
      pdf.rect(10, 40, 40, 15, "F")
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.text("STATUS:", 15, 47)

      // Set status color based on status
      if (store.status === "active") {
        pdf.setTextColor(0, 128, 0) // Green for active
      } else {
        pdf.setTextColor(220, 0, 0) // Red for inactive
      }

      pdf.text(store.status.toUpperCase(), 15, 52)
      pdf.setTextColor(0, 0, 0) // Reset text color to black

      // Add creation info
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Created on: ${store.createdAt}`, 60, 47)

      // Add a separator line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(10, 60, 200, 60)

      // Store Information Section
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Store Information", 10, 70)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")

      const storeInfo = [
        { label: "Name", value: store.name },
        { label: "Location", value: store.location },
        { label: "Address", value: store.address },
        { label: "Description", value: store.description },
      ]

      let y = 80
      storeInfo.forEach((item) => {
        pdf.setFont("helvetica", "bold")
        pdf.text(`${item.label}:`, 15, y)
        pdf.setFont("helvetica", "normal")

        // Handle multi-line text for long values
        if (item.value.length > 70) {
          const lines = pdf.splitTextToSize(item.value, 150)
          pdf.text(lines, 50, y)
          y += 8 * lines.length
        } else {
          pdf.text(item.value, 50, y)
          y += 8
        }
      })

      // Contact Information Section
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Contact Information", 10, y + 10)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")

      const contactInfo = [
        { label: "Contact Person", value: store.contactPerson },
        { label: "Email", value: store.contactEmail },
        { label: "Phone", value: store.contactPhone },
      ]

      y += 20
      contactInfo.forEach((item) => {
        pdf.setFont("helvetica", "bold")
        pdf.text(`${item.label}:`, 15, y)
        pdf.setFont("helvetica", "normal")
        pdf.text(item.value, 50, y)
        y += 8
      })

      // Statistics Section
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Statistics", 10, y + 10)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")

      const statistics = [
        { label: "Merchant Count", value: store.merchantCount.toString() },
        { label: "Application Count", value: store.applicationCount.toString() },
      ]

      y += 20
      statistics.forEach((item) => {
        pdf.setFont("helvetica", "bold")
        pdf.text(`${item.label}:`, 15, y)
        pdf.setFont("helvetica", "normal")
        pdf.text(item.value, 50, y)
        y += 8
      })

      // Add footer
      pdf.setFontSize(8)
      pdf.text("Smart EMI Application System", 105, 280, { align: "center" })
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: "center" })

      // Save the PDF
      pdf.save(`store-${store.id}.pdf`)

      toast({
        title: "PDF Generated",
        description: "Store details have been saved as PDF.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title={`Store: ${store.name}`} />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Store Details</h2>
          <p className="text-sm text-muted-foreground">
            ID: {store.id} | Created on: {store.createdAt}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={generatePDF}
            disabled={isGeneratingPdf}
          >
            <FileDown className="h-4 w-4" />
            {isGeneratingPdf ? "Generating PDF..." : "Save as PDF"}
          </Button>
          <Link href={`/admin/stores/${store.id}/edit`}>
            <Button className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Store
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Avatar className="h-24 w-24">
          <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
          <AvatarFallback>{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{store.name}</h2>
          <div className="flex items-center justify-center gap-1 text-muted-foreground md:justify-start">
            <MapPin className="h-4 w-4" />
            <span>{store.location}</span>
          </div>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              store.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {store.status}
          </span>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Store Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Store ID</p>
                        <p>{store.id}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Address</p>
                        <p>{store.address}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p>{store.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <p className="font-medium ml-auto">{store.contactPerson}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                    <p className="font-medium ml-auto">{store.contactPhone}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    <p className="font-medium ml-auto">{store.contactEmail}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Merchant Count</p>
                    <p className="font-medium ml-auto">{store.merchantCount}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">Created On</p>
                    <p className="font-medium ml-auto">{store.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Store Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                  <div className="text-2xl font-bold">{store.applicationCount}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">Approved</div>
                  <div className="text-2xl font-bold">8</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold">5</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm text-muted-foreground">Rejected</div>
                  <div className="text-2xl font-bold">2</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchants" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Store Merchants</CardTitle>
                <CardDescription>Manage merchants associated with this store</CardDescription>
              </div>
              <Link href={`/admin/stores/${store.id}/merchants/new`}>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Merchant
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">User</th>
                      <th className="px-4 py-3 text-left font-medium">Role</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.merchants.map((merchant) => (
                      <tr key={merchant.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={merchant.avatar || "/placeholder.svg"} alt={merchant.name} />
                              <AvatarFallback>{merchant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{merchant.name}</p>
                              <p className="text-sm text-muted-foreground">{merchant.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{merchant.role}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              merchant.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {merchant.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/admin/users/${merchant.id}`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Recent EMI applications from this store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Customer</th>
                      <th className="px-4 py-3 text-left font-medium">Amount</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.recentApplications.map((app) => (
                      <tr key={app.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{app.id}</td>
                        <td className="px-4 py-3">{app.customerName}</td>
                        <td className="px-4 py-3">BDT {app.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">{app.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              app.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : app.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/admin/applications/${app.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={`/admin/applications?store=${store.id}`}>
                  <Button variant="outline">View All Applications</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
