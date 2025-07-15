"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Pencil, CheckCircle2, Save, X, Loader2, PlusCircle } from "lucide-react"
import { jsPDF } from "jspdf"
import { useState, useMemo, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { initialApplications, stores, initialActivityLogs } from "@/lib/mock-data"
import { logApplicationEdit, logStatusUpdate } from "@/lib/activity-logger"

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [applications, setApplications] = useLocalStorage("applications", initialApplications)
  const [activityLogs, setActivityLogs] = useLocalStorage("activityLogs", initialActivityLogs)
  const [isEditing, setIsEditing] = useState(false)
  const [editableApplication, setEditableApplication] = useState<any>(null)
  const [newStatusNote, setNewStatusNote] = useState("")
  const [currentStatusForNote, setCurrentStatusForNote] = useState("")

  const application = useMemo(() => {
    return applications.find((app) => app.id === params.id)
  }, [applications, params.id])

  useEffect(() => {
    if (application) {
      setEditableApplication(JSON.parse(JSON.stringify(application)))
      setCurrentStatusForNote(application.status)
    }
  }, [application])

  if (!application) {
    return (
      <div className="flex flex-col gap-6">
        <AdminHeader title={`Application #${params.id}`} />
        <div className="text-center text-muted-foreground">Application not found.</div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditableApplication({ ...editableApplication, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditableApplication({ ...editableApplication, [name]: value })
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Track changes for activity log
    const changes: Record<string, { from: any; to: any }> = {}
    Object.keys(editableApplication).forEach((key) => {
      if (application[key] !== editableApplication[key] && key !== "statusHistory") {
        changes[key] = { from: application[key], to: editableApplication[key] }
      }
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setApplications((prevApps) => prevApps.map((app) => (app.id === params.id ? editableApplication : app)))

    // Log the changes
    if (Object.keys(changes).length > 0) {
      const activityLog = logApplicationEdit(params.id, "Admin User (Current)", changes)
      setActivityLogs((prevLogs) => [activityLog, ...prevLogs])
    }

    setIsSaving(false)
    setIsEditing(false)
    toast({
      title: "Application Updated",
      description: "The application details have been saved successfully.",
    })
  }

  const handleCancel = () => {
    setEditableApplication(JSON.parse(JSON.stringify(application)))
    setIsEditing(false)
  }

  const handleAddStatusNote = async () => {
    if (!newStatusNote.trim()) {
      toast({
        title: "Note Required",
        description: "Please enter a note for the status update.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const previousStatus = application.status
    const newStatusEntry = {
      status: currentStatusForNote,
      timestamp: new Date().toISOString(),
      by: "Admin User (Current)",
      note: newStatusNote.trim(),
    }

    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === params.id
          ? {
              ...app,
              status: currentStatusForNote,
              statusHistory: [...(app.statusHistory || []), newStatusEntry],
            }
          : app,
      ),
    )

    // Log the status update
    const statusLog = logStatusUpdate(
      params.id,
      "Admin User (Current)",
      previousStatus,
      currentStatusForNote,
      newStatusNote.trim(),
    )
    setActivityLogs((prevLogs) => [statusLog, ...prevLogs])

    setNewStatusNote("") // Clear the textbox
    setIsSaving(false)
    toast({
      title: "Status Note Added",
      description: "The status and note have been updated successfully.",
    })
  }

  const generatePDF = () => {
    setIsGeneratingPdf(true)

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text("Application Details", 105, 20, { align: "center" })

      pdf.setFontSize(12)
      pdf.text(`Application #${application.id}`, 105, 30, { align: "center" })

      pdf.setFillColor(240, 240, 240)
      pdf.rect(10, 40, 40, 15, "F")
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.text("STATUS:", 15, 47)

      if (application.status === "approved") {
        pdf.setTextColor(0, 128, 0)
      } else if (application.status === "rejected") {
        pdf.setTextColor(220, 0, 0)
      } else if (application.status === "verified") {
        pdf.setTextColor(0, 0, 200)
      } else {
        pdf.setTextColor(255, 140, 0)
      }

      pdf.text(application.status.toUpperCase(), 15, 52)
      pdf.setTextColor(0, 0, 0)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Submitted by: ${application.submittedBy}`, 60, 47)
      pdf.text(`Date: ${new Date(application.submittedAt).toLocaleString()}`, 60, 52)

      pdf.setDrawColor(200, 200, 200)
      pdf.line(10, 60, 200, 60)

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Customer Information", 10, 70)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")

      const customerInfo = [
        { label: "Name", value: application.customerName },
        { label: "Client ID", value: application.clientId },
        { label: "Phone", value: application.phoneNumber },
        { label: "Email", value: application.email },
        { label: "Card Number", value: application.cardNumber },
      ]

      let y = 80
      customerInfo.forEach((item) => {
        pdf.setFont("helvetica", "bold")
        pdf.text(`${item.label}:`, 15, y)
        pdf.setFont("helvetica", "normal")
        pdf.text(item.value, 50, y)
        y += 8
      })

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Transaction Details", 10, 130)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")

      const transactionInfo = [
        { label: "Amount", value: `BDT ${application.amount.toLocaleString()}` },
        { label: "EMI Tenure", value: `${application.tenure} months` },
        { label: "Approval Code", value: application.approvalCode },
        { label: "Transaction Date", value: application.transactionDate },
        { label: "Store", value: application.store },
        { label: "Merchant", value: application.merchant },
      ]

      y = 140
      transactionInfo.forEach((item) => {
        pdf.setFont("helvetica", "bold")
        pdf.text(`${item.label}:`, 15, y)
        pdf.setFont("helvetica", "normal")
        pdf.text(item.value, 50, y)
        y += 8
      })

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Notes", 10, y + 10)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text(application.notes || "No notes available.", 15, y + 20, { maxWidth: 180 })

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Status History", 10, y + 40)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")

      let historyY = y + 50
      if (application.statusHistory && application.statusHistory.length > 0) {
        application.statusHistory.forEach((entry) => {
          const formattedTime = format(new Date(entry.timestamp), "MMM dd, yyyy HH:mm")
          pdf.text(`${formattedTime} - ${entry.status.toUpperCase()} by ${entry.by}`, 15, historyY)
          if (entry.note) {
            pdf.text(`  Note: ${entry.note}`, 20, historyY + 5, { maxWidth: 170 })
            historyY += 5
          }
          historyY += 8
        })
      } else {
        pdf.text("No status history available.", 15, historyY)
      }

      pdf.setFontSize(8)
      pdf.text("Smart EMI Application System", 105, 280, { align: "center" })
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: "center" })

      pdf.save(`application-${application.id}.pdf`)

      toast({
        title: "PDF Generated",
        description: "Application details have been saved as PDF.",
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
      <AdminHeader title={`Application #${params.id}`} />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Application Details</h2>
          <p className="text-sm text-muted-foreground">
            Submitted by {application.submittedBy} on {new Date(application.submittedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                onClick={generatePDF}
                disabled={isGeneratingPdf}
              >
                <FileDown className="h-4 w-4" />
                {isGeneratingPdf ? "Generating..." : "Save as PDF"}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit Application
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name</Label>
                {isEditing ? (
                  <Input
                    id="customerName"
                    name="customerName"
                    value={editableApplication.customerName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.customerName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                {isEditing ? (
                  <Input
                    id="clientId"
                    name="clientId"
                    value={editableApplication.clientId}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.clientId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editableApplication.phoneNumber}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.phoneNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editableApplication.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                {isEditing ? (
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={editableApplication.cardNumber}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.cardNumber}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (BDT)</Label>
                {isEditing ? (
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={editableApplication.amount}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.amount.toLocaleString()}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenure">EMI Tenure (Months)</Label>
                {isEditing ? (
                  <Input
                    id="tenure"
                    name="tenure"
                    type="number"
                    value={editableApplication.tenure}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.tenure} months</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="approvalCode">Approval Code</Label>
                {isEditing ? (
                  <Input
                    id="approvalCode"
                    name="approvalCode"
                    value={editableApplication.approvalCode}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.approvalCode}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionDate">Transaction Date</Label>
                {isEditing ? (
                  <Input
                    id="transactionDate"
                    name="transactionDate"
                    type="date"
                    value={editableApplication.transactionDate}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.transactionDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="store">Store</Label>
                {isEditing ? (
                  <Select
                    name="store"
                    value={editableApplication.store}
                    onValueChange={(value) => handleSelectChange("store", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.name}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{application.store}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant</Label>
                {isEditing ? (
                  <Input
                    id="merchant"
                    name="merchant"
                    value={editableApplication.merchant}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{application.merchant}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Application Notes</CardTitle>
            <CardDescription>General internal notes for this application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              {isEditing ? (
                <Textarea
                  id="notes"
                  name="notes"
                  value={editableApplication.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{application.notes || "No notes available."}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Update Status & Add Note</CardTitle>
            <CardDescription>
              Change the application status and add a corresponding note to the timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status-update-select">New Status</Label>
                <Select value={currentStatusForNote} onValueChange={setCurrentStatusForNote}>
                  <SelectTrigger id="status-update-select">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status-note">Note for Status Update</Label>
                <Textarea
                  id="new-status-note"
                  placeholder="Add a note for this status change..."
                  value={newStatusNote}
                  onChange={(e) => setNewStatusNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddStatusNote} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Note...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Status Update
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
            <CardDescription>A history of status changes for this application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.statusHistory && application.statusHistory.length > 0 ? (
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-4">
                  {application.statusHistory.map((entry, index) => (
                    <li key={index} className="mb-6 ml-6">
                      <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
                        <CheckCircle2 className="h-4 w-4 text-blue-800 dark:text-blue-300" />
                      </span>
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </h3>
                      <time className="block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        {format(new Date(entry.timestamp), "MMM dd, yyyy HH:mm:ss")} by {entry.by}
                      </time>
                      {entry.note && (
                        <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                          Note: {entry.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">No status history available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
