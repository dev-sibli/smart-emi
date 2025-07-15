import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, MapPin, Phone, Mail, Calendar } from "lucide-react"

export function StoreProfile() {
  const storeData = {
    name: "Electronics Hub",
    status: "Active",
    location: "123 Main Street, Dhaka, Bangladesh",
    phone: "+880 1712-345678",
    email: "contact@electronicshub.com",
    registeredDate: "January 15, 2022",
    totalApplications: 45,
    approvedApplications: 32,
    pendingApplications: 8,
    rejectedApplications: 5,
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{storeData.name}</CardTitle>
            <CardDescription>Store Information</CardDescription>
          </div>
          <Badge variant={storeData.status === "Active" ? "default" : "secondary"}>{storeData.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{storeData.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{storeData.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{storeData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Registered: {storeData.registeredDate}</span>
          </div>
          <Button className="w-full mt-4">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Statistics</CardTitle>
          <CardDescription>Overview of your application performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Applications</span>
            <span className="text-2xl font-bold">{storeData.totalApplications}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-600">Approved</span>
            <span className="text-lg font-semibold text-green-600">{storeData.approvedApplications}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-yellow-600">Pending</span>
            <span className="text-lg font-semibold text-yellow-600">{storeData.pendingApplications}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-red-600">Rejected</span>
            <span className="text-lg font-semibold text-red-600">{storeData.rejectedApplications}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
