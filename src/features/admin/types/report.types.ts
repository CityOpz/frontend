export type ApiReportStatus = "PENDING" | "IN_REVIEW" | "IN_REPAIR" | "RESOLVED"

export type ReportStatus =
  | "Pendiente"
  | "En revisión"
  | "En reparación"
  | "Resuelto"

export interface Report {
  id: string
  title: string
  category: string
  status: ReportStatus
  coordinates: {
    latitude: number
    longitude: number
  }
}

export interface ApiReportCategory {
  id: number
  name: string
  description?: string | null
}

export interface ApiReport {
  id: number
  title: string
  detail: string
  status: ApiReportStatus
  category?: ApiReportCategory
  latitude?: number
  longitude?: number
}

export interface PaginatedApiReports {
  count: number
  next: string | null
  previous: string | null
  results: ApiReport[]
}
