"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EditApplicationNotesDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string
  currentNotes: string
  onSave: (applicationId: string, newNotes: string) => Promise<void>
}

export function EditApplicationNotesDialog({
  isOpen,
  onOpenChange,
  applicationId,
  currentNotes,
  onSave,
}: EditApplicationNotesDialogProps) {
  const [notes, setNotes] = useState(currentNotes)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setNotes(currentNotes)
    }
  }, [isOpen, currentNotes])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(applicationId, notes)
      toast({
        title: "Notes Updated",
        description: `Notes for application #${applicationId} have been updated.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save notes:", error)
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Notes for Application #{applicationId}</DialogTitle>
          <DialogDescription>
            Add or modify notes for this application. These notes are for internal use only.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter notes for this application..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Notes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
