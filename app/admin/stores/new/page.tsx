import { StoreForm } from "@/components/admin/store-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"

export default function NewStorePage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="New Store" />
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Add a new store to the system by filling out the details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreForm />
        </CardContent>
      </Card>
    </div>
  )
}
