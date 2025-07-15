import { Badge } from "@/components/ui/badge"

interface ApplicationStatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "verified"
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { variant: "default" as const, className: "bg-green-100 text-green-800 hover:bg-green-100" }
      case "pending":
        return { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" }
      case "rejected":
        return { variant: "destructive" as const, className: "bg-red-100 text-red-800 hover:bg-red-100" }
      case "verified":
        return { variant: "default" as const, className: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
      default:
        return { variant: "outline" as const, className: "" }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={config.className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
