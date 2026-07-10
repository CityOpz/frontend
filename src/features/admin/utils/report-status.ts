import type { ApiReportStatus, ReportStatus } from "../types/report.types"

export const REPORT_STATUSES: ReportStatus[] = [
  "Pendiente",
  "En revisión",
  "En reparación",
  "Resuelto",
]

export const API_TO_REPORT_STATUS: Record<ApiReportStatus, ReportStatus> = {
  PENDING: "Pendiente",
  IN_REVIEW: "En revisión",
  IN_REPAIR: "En reparación",
  RESOLVED: "Resuelto",
}

export const REPORT_STATUS_TO_API: Record<ReportStatus, ApiReportStatus> = {
  Pendiente: "PENDING",
  "En revisión": "IN_REVIEW",
  "En reparación": "IN_REPAIR",
  Resuelto: "RESOLVED",
}

export function canTransitionReportStatus(
  currentStatus: ReportStatus,
  nextStatus: ReportStatus,
) {
  const currentIndex = REPORT_STATUSES.indexOf(currentStatus)
  const nextIndex = REPORT_STATUSES.indexOf(nextStatus)

  return nextIndex === currentIndex || nextIndex === currentIndex + 1
}
