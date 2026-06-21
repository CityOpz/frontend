import type { Report } from "../types/report.types"

export const mockReports: Report[] = [
  {
    id: "REP-001",
    title: "Hueco de gran tamaño en la vía",
    category: "Infraestructura vial",
    status: "Pendiente",
    coordinates: { latitude: 4.711, longitude: -74.0721 },
  },
  {
    id: "REP-002",
    title: "Luminaria pública fuera de servicio",
    category: "Alumbrado público",
    status: "En revisión",
    coordinates: { latitude: 4.6533, longitude: -74.0837 },
  },
  {
    id: "REP-003",
    title: "Acumulación de residuos en el parque",
    category: "Aseo y residuos",
    status: "Resuelto",
    coordinates: { latitude: 4.6766, longitude: -74.0488 },
  },
  {
    id: "REP-004",
    title: "Semáforo intermitente en avenida principal",
    category: "Movilidad",
    status: "En revisión",
    coordinates: { latitude: 4.6981, longitude: -74.0909 },
  },
  {
    id: "REP-005",
    title: "Árbol con riesgo de caída",
    category: "Espacio público",
    status: "Pendiente",
    coordinates: { latitude: 4.6243, longitude: -74.0634 },
  },
  {
    id: "REP-006",
    title: "Fuga de agua sobre el andén",
    category: "Servicios públicos",
    status: "Resuelto",
    coordinates: { latitude: 4.7325, longitude: -74.0618 },
  },
]
