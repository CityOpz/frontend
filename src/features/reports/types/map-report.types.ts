export interface MapReport {
  readonly id: string
  readonly title: string
  readonly category: string
  readonly status: "Pendiente" | "En revisión" | "Resuelto"
  readonly coordinates: readonly [latitude: number, longitude: number]
}
