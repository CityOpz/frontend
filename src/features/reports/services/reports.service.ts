import { api } from "@/shared/lib/api/axios"
import type { AxiosResponse } from "axios"
import type { MapReport, MapReportStatus } from "../types/map-report.types"
import type {
  ApiReport,
  ApiReportStatus,
  CreateReportPayload,
  PaginatedReportsResponse,
  UpdateReportPayload,
} from "../types/report-api.types"

export const REPORT_CATEGORY_OPTIONS = [
  { id: 1, label: "Infraestructura vial", backendName: "Road Infrastructure" },
  { id: 2, label: "Alumbrado público", backendName: "Public Lighting" },
  { id: 3, label: "Mobiliario urbano", backendName: "Urban Furniture" },
  { id: 4, label: "Señalización vial", backendName: "Traffic Signage" },
  { id: 5, label: "Zonas verdes", backendName: "Green Areas" },
  { id: 6, label: "Aseo y residuos", backendName: "Waste and Debris" },
  { id: 7, label: "Drenaje y alcantarillado", backendName: "Drainage and Sewage" },
  { id: 8, label: "Riesgo estructural", backendName: "Structural Risk" },
  { id: 9, label: "Accesibilidad", backendName: "Accessibility" },
  { id: 10, label: "Otro", backendName: "Other" },
] as const

const statusLabels: Record<ApiReportStatus, MapReportStatus> = {
  PENDING: "Pendiente",
  IN_REVIEW: "En revisión",
  IN_REPAIR: "En reparación",
  RESOLVED: "Resuelto",
}

const categoryLabels = new Map(
  REPORT_CATEGORY_OPTIONS.flatMap(({ id, label, backendName }) => [
    [String(id), label],
    [backendName, label],
  ]),
)

function toReportFormData(payload: CreateReportPayload | UpdateReportPayload) {
  const formData = new FormData()

  if (payload.title !== undefined) {
    formData.append("title", payload.title)
  }

  if (payload.detail !== undefined) {
    formData.append("detail", payload.detail)
  }

  if ("categoryId" in payload) {
    formData.append("category_id", String(payload.categoryId))
  }

  if ("category" in payload && payload.category !== undefined) {
    formData.append("category", String(payload.category))
  }

  if (payload.latitude !== undefined) {
    formData.append("latitude", String(payload.latitude))
  }

  if (payload.longitude !== undefined) {
    formData.append("longitude", String(payload.longitude))
  }

  if (payload.photo) {
    formData.append("photo", payload.photo)
  }

  return formData
}

export function mapApiReportToMapReport(report: ApiReport): MapReport | null {
  if (report.latitude === undefined || report.longitude === undefined) {
    return null
  }

  const categoryKey = report.category?.name ?? String(report.category?.id ?? "")

  return {
    id: `REP-${String(report.id).padStart(3, "0")}`,
    title: report.title,
    category: categoryLabels.get(categoryKey) ?? report.category?.name ?? "Sin categoría",
    status: statusLabels[report.status],
    coordinates: [report.latitude, report.longitude],
  }
}

export const reportsService = {
  create: (payload: CreateReportPayload) =>
    api.post<ApiReport>("/reports/", toReportFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  list: () => api.get<PaginatedReportsResponse>("/reports/all/"),

  detail: (id: number) => api.get<ApiReport>(`/reports/${id}/`),

  update: (id: number, payload: UpdateReportPayload) =>
    api.patch<ApiReport>(`/reports/${id}/update/`, toReportFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: number) => api.delete(`/reports/${id}/`),

  updateStatus: (id: number, status: ApiReportStatus, updateDetail: string) =>
    api.patch<ApiReport>(`/reports/${id}/status/`, {
      status,
      update_detail: updateDetail,
    }),

  async listCitizenReports(): Promise<ApiReport[]> {
    const response = await api.get<PaginatedReportsResponse>("/reports/all/?my_reports=true")
    const details = await Promise.all(
      response.data.results.map((report) => reportsService.detail(report.id)),
    )
    return details.map(({ data }) => data)
  },

  async listMapReports() {
    const reports: ApiReport[] = []
    let url: string | null = "/reports/all/"

    while (url) {
      const response: AxiosResponse<PaginatedReportsResponse> = await api.get(url)
      reports.push(...response.data.results)
      url = response.data.next
    }

    const reportsWithLocation = await Promise.all(
      reports.map(async (report) => {
        if (report.latitude !== undefined && report.longitude !== undefined) {
          return report
        }

        try {
          const response = await reportsService.detail(report.id)
          return response.data
        } catch {
          // Un detalle no disponible no debe impedir mostrar el resto del mapa.
          return null
        }
      }),
    )

    return reportsWithLocation
      .map((report) => (report ? mapApiReportToMapReport(report) : null))
      .filter((report): report is MapReport => report !== null)
  },
}
