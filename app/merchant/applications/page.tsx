"use client"

import { MerchantHeader } from "@/components/merchant/merchant-header"
import { ApplicationsTable } from "@/components/merchant/applications-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { initialApplications } from "@/lib/mock-data"

export default function ApplicationsPage() {
  const [applications] = useLocalStorage("applications", initialApplications)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <MerchantHeader title="Applications" />
        <Link href="/merchant/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>
      <ApplicationsTable applications={applications} />
    </div>
  )
}
