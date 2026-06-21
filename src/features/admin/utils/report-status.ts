import type { ReportStatus } from "../types/report.types"

export const REPORT_STATUSES: ReportStatus[] = [
  "Pendiente",
  "En revisión",
  "Resuelto",
]

export function canTransitionReportStatus(
  currentStatus: ReportStatus,
  nextStatus: ReportStatus,
) {
  const currentIndex = REPORT_STATUSES.indexOf(currentStatus)
  const nextIndex = REPORT_STATUSES.indexOf(nextStatus)

  return nextIndex === currentIndex || nextIndex === currentIndex + 1
}
