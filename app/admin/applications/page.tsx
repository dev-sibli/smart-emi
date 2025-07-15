import { AdminHeader } from "@/components/admin/admin-header"
import { AdminApplicationsTable } from "@/components/admin/admin-applications-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="Applications" />

      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Application Management</h2>
          <p className="text-muted-foreground">Manage and review all EMI applications from merchants.</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>View and manage all EMI applications across all statuses.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApplicationsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Applications awaiting review and processing.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApplicationsTable statusFilter="pending" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verified" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Verified Applications</CardTitle>
                <CardDescription>
                  Applications that have been verified and are ready for final approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApplicationsTable statusFilter="verified" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Applications</CardTitle>
                <CardDescription>Applications that have been approved and processed.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApplicationsTable statusFilter="approved" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>Applications that have been rejected with reasons.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApplicationsTable statusFilter="rejected" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
