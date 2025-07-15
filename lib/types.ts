export interface Application {
  id: string
  customerName: string
  phoneNumber: string
  email: string
  cardNumber: string
  clientId: string
  amount: number
  tenure: number
  date: string
  status: "pending" | "verified" | "approved" | "rejected"
  store: string
  merchant: string
  approvalCode: string
  notes: string
  timeline: TimelineEntry[]
}

export interface TimelineEntry {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
  status?: string
}

export interface ActivityLog {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  applicationId?: string
  type: "create" | "update" | "delete" | "status_update" | "note_add" | "edit"
}

export interface Store {
  id: string
  name: string
  address: string
  phone: string
  email: string
  manager: string
  status: "active" | "inactive"
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "merchant"
  store?: string
  status: "active" | "inactive"
}
