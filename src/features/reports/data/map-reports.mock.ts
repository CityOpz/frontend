import type { MapReport } from "../types/map-report.types"

export const mapReportsMock: readonly MapReport[] = [
  {
    id: "REP-001",
    title: "Hueco de gran tamaño en la vía",
    category: "Infraestructura vial",
    status: "Pendiente",
    coordinates: [4.711, -74.0721],
  },
  {
    id: "REP-002",
    title: "Luminaria pública fuera de servicio",
    category: "Alumbrado público",
    status: "En revisión",
    coordinates: [4.6533, -74.0837],
  },
  {
    id: "REP-003",
    title: "Acumulación de residuos en el parque",
    category: "Aseo y residuos",
    status: "Resuelto",
    coordinates: [4.6766, -74.0488],
  },
]
