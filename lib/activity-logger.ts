import type { ActivityLog } from "./types"

export function generateLogId(): string {
  return `LOG${Date.now()}`
}

export function createActivityLog(
  user: string,
  action: string,
  details: string,
  applicationId?: string,
  type: ActivityLog["type"] = "update",
): ActivityLog {
  return {
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
    applicationId,
    type,
  }
}

export function logApplicationEdit(
  applicationId: string,
  user: string,
  changes: Record<string, { from: any; to: any }>,
): ActivityLog {
  const changeDetails = Object.entries(changes)
    .map(([field, { from, to }]) => `${field}: "${from}" → "${to}"`)
    .join(", ")

  return createActivityLog(
    user,
    "Application Edited",
    `Application ${applicationId} updated: ${changeDetails}`,
    applicationId,
    "edit",
  )
}

export function logStatusUpdate(
  applicationId: string,
  user: string,
  fromStatus: string,
  toStatus: string,
  note?: string,
): ActivityLog {
  const details = `Application ${applicationId} status changed from ${fromStatus} to ${toStatus}${
    note ? ` with note: "${note}"` : ""
  }`

  return createActivityLog(user, "Status Updated", details, applicationId, "status_update")
}

export function logNoteAdd(applicationId: string, user: string, note: string): ActivityLog {
  return createActivityLog(
    user,
    "Note Added",
    `Note added to application ${applicationId}: "${note}"`,
    applicationId,
    "note_add",
  )
}

export function logApplicationDelete(applicationId: string, user: string, customerName: string): ActivityLog {
  return createActivityLog(
    user,
    "Application Deleted",
    `Application ${applicationId} (${customerName}) was deleted`,
    applicationId,
    "delete",
  )
}
