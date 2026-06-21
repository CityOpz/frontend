export type ReportStatus = "Pendiente" | "En revisión" | "Resuelto"

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
