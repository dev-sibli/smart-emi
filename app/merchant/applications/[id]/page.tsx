import { SmartEmiForm } from "@/components/merchant/smart-emi-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MerchantHeader } from "@/components/merchant/merchant-header"
import { ApplicationStatusBadge } from "@/components/application-status-badge"

export default function EditApplicationPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the application data based on the ID
  const mockApplication = {
    id: params.id,
    status: "pending",
    editsRemaining: 1,
    customerName: "John Doe",
    clientId: "CL123456",
    phoneNumber: "9876543210",
    email: "john.doe@example.com",
    cardNumber: "4111 1111 1111 1111",
    approvalCode: "AP123456",
    transactionAmount: 50000,
    merchantName: "Electronics Store",
    emiTenure: 6,
    transactionDate: "2023-05-15",
  }

  return (
    <div className="flex flex-col gap-6">
      <MerchantHeader title={`Application #${params.id}`} />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Edit Application</h2>
          <p className="text-sm text-muted-foreground">You have {mockApplication.editsRemaining} edits remaining</p>
        </div>
        <ApplicationStatusBadge status={mockApplication.status} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Smart EMI Application Form</CardTitle>
          <CardDescription>Update the application details</CardDescription>
        </CardHeader>
        <CardContent>
          <SmartEmiForm initialData={mockApplication} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}
