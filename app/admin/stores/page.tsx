import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { StoresList } from "@/components/admin/stores-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function StoresPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <AdminHeader title="Stores" />
        <Link href="/admin/stores/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Store
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
          <CardDescription>Manage all registered stores</CardDescription>
        </CardHeader>
        <CardContent>
          <StoresList />
        </CardContent>
      </Card>
    </div>
  )
}
