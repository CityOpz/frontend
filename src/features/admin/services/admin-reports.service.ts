import { api } from "@/shared/lib/api/axios"
import type {
  ApiReport,
  PaginatedApiReports,
  Report,
  ReportStatus,
} from "../types/report.types"
import {
  API_TO_REPORT_STATUS,
  REPORT_STATUS_TO_API,
} from "../utils/report-status"

const DEFAULT_STATUS_UPDATE_DETAIL =
  "Actualización realizada desde el panel administrativo."

function getReportRows(data: PaginatedApiReports | ApiReport[]) {
  return Array.isArray(data) ? data : data.results
}

function mapApiReportToReport(report: ApiReport): Report {
  return {
    id: String(report.id),
    title: report.title,
    category: report.category?.name ?? "Sin categoría",
    status: API_TO_REPORT_STATUS[report.status],
    coordinates: {
      latitude: report.latitude ?? 0,
      longitude: report.longitude ?? 0,
    },
  }
}

export const adminReportsService = {
  async getReports(): Promise<Report[]> {
    const response = await api.get<PaginatedApiReports | ApiReport[]>(
      "/reports/all/",
    )
    const rows = getReportRows(response.data)

    const detailedReports = await Promise.all(
      rows.map(async (report) => {
        if (report.category && report.latitude !== undefined) {
          return report
        }

        const detailResponse = await api.get<ApiReport>(`/reports/${report.id}/`)
        return detailResponse.data
      }),
    )

    return detailedReports.map(mapApiReportToReport)
  },

  async updateStatus(
    reportId: string,
    status: ReportStatus,
    updateDetail = DEFAULT_STATUS_UPDATE_DETAIL,
  ): Promise<Report> {
    const response = await api.patch<ApiReport>(`/reports/${reportId}/status/`, {
      status: REPORT_STATUS_TO_API[status],
      update_detail: updateDetail,
    })

    return mapApiReportToReport(response.data)
  },
}
