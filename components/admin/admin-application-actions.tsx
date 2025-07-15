"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, FileDown } from "lucide-react"
import Link from "next/link"
import type { Application } from "@/lib/types"

interface AdminApplicationActionsProps {
  application: Application
}

export function AdminApplicationActions({ application }: AdminApplicationActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const handleApprove = () => {
    setIsApproving(true)

    // Simulate API call
    setTimeout(() => {
      setIsApproving(false)
      setShowApproveDialog(false)

      toast({
        title: "Application approved",
        description: `Application #${application.id} has been approved successfully.`,
      })

      router.push("/admin/dashboard")
    }, 1500)
  }

  const handleReject = () => {
    setIsRejecting(true)

    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false)
      setShowRejectDialog(false)

      toast({
        title: "Application rejected",
        description: `Application #${application.id} has been rejected.`,
      })

      router.push("/admin/dashboard")
    }, 1500)
  }

  if (application.status !== "pending") {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setShowApproveDialog(true)}>
          <Button variant="default" className="flex items-center w-full">
            <Eye className="mr-2 h-4 w-4" />
            Approve Application
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setShowRejectDialog(true)}>
          <Button variant="destructive" className="flex items-center w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Reject Application
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/admin/applications/${application.id}`} className="flex items-center w-full">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit Application
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Application
        </DropdownMenuItem>

        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve this application? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApprove} disabled={isApproving}>
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject this application? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReject} disabled={isRejecting}>
                {isRejecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
