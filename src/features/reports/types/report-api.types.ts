export type ApiReportStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "IN_REPAIR"
  | "RESOLVED"

export interface ApiReportCategory {
  readonly id: number
  readonly name: string
  readonly description?: string | null
}

export interface ApiReport {
  readonly id: number
  readonly category?: ApiReportCategory
  readonly category_id?: number
  readonly title: string
  readonly detail: string
  readonly status: ApiReportStatus
  readonly photo?: string | null
  readonly latitude?: number
  readonly longitude?: number
  readonly created_at?: string
  readonly updated_at?: string
  readonly created_by?: {
    id: number
    first_name: string
    last_name: string
    email?: string
  }
}

export interface PaginatedReportsResponse {
  readonly count: number
  readonly next: string | null
  readonly previous: string | null
  readonly results: readonly ApiReport[]
}

export interface CreateReportPayload {
  readonly title: string
  readonly detail: string
  readonly categoryId: number
  readonly latitude: number
  readonly longitude: number
  readonly photo?: File | null
}

export interface UpdateReportPayload {
  readonly title?: string
  readonly detail?: string
  readonly category?: number
  readonly latitude?: number
  readonly longitude?: number
  readonly photo?: File | null
}
