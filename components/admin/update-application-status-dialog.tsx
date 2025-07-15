"use client"

import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UpdateApplicationStatusDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string
  currentStatus: string
  onSave: (applicationId: string, newStatus: string, note?: string) => Promise<void>
}

export function UpdateApplicationStatusDialog({
  isOpen,
  onOpenChange,
  applicationId,
  currentStatus,
  onSave,
}: UpdateApplicationStatusDialogProps) {
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [statusNote, setStatusNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setNewStatus(currentStatus)
      setStatusNote("") // Clear note on open
    }
  }, [isOpen, currentStatus])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(applicationId, newStatus, statusNote)
      toast({
        title: "Status Updated",
        description: `Application #${applicationId} status changed to ${newStatus.toUpperCase()}.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Status for Application #{applicationId}</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new status for this application and add an optional note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger id="status-select">
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
          <div>
            <label htmlFor="status-note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <Textarea
              id="status-note"
              placeholder="Add a note for this status change..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
