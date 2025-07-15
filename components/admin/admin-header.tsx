import { Button } from "@/components/ui/button"
import { Bell, User, Settings } from "lucide-react"

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between pb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
