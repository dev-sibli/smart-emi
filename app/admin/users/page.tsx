import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Mock user data
const mockUsers = [
  {
    id: "USR001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Merchant",
    store: "Electronics Store",
    status: "Active",
    lastLogin: "2023-05-15 10:30 AM",
  },
  {
    id: "USR002",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Merchant",
    store: "Home Appliances",
    status: "Active",
    lastLogin: "2023-05-14 02:15 PM",
  },
  {
    id: "USR003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Merchant",
    store: "Mobile Shop",
    status: "Inactive",
    lastLogin: "2023-05-10 09:45 AM",
  },
  {
    id: "USR004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Admin",
    store: "N/A",
    status: "Active",
    lastLogin: "2023-05-15 11:20 AM",
  },
  {
    id: "USR005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Merchant",
    store: "Electronics Store",
    status: "Active",
    lastLogin: "2023-05-13 03:40 PM",
  },
]

export default function UsersPage() {
  const adminUsers = mockUsers.filter((user) => user.role === "Admin")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <AdminHeader title="User Management" />
        <Link href="/admin/users/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Admin
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>Manage administrator accounts for the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search users..." className="pl-8" />
              </div>
            </div>

            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Last Login</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{user.id}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{user.lastLogin}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/users/${user.id}`}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
