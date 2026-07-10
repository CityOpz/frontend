export type MapReportStatus =
  | "Pendiente"
  | "En revisión"
  | "En reparación"
  | "Resuelto"

export interface MapReport {
  readonly id: string
  readonly title: string
  readonly category: string
  readonly status: MapReportStatus
  readonly coordinates: readonly [latitude: number, longitude: number]
}
