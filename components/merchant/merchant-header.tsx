"use client"

import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"

interface MerchantHeaderProps {
  title: string
}

export function MerchantHeader({ title }: MerchantHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
