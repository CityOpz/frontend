import { beforeEach, describe, expect, it, vi } from "vitest"
import { api } from "@/shared/lib/api/axios"
import {
  mapApiReportToMapReport,
  reportsService,
} from "./reports.service"

vi.mock("@/shared/lib/api/axios", () => ({
  api: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}))

describe("reportsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("create llama al endpoint de creación con FormData", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })

    await reportsService.create({
      title: "Hueco en la vía",
      detail: "Está cerca al cruce.",
      categoryId: 1,
      latitude: 4.711,
      longitude: -74.0721,
      photo: null,
    })

    expect(api.post).toHaveBeenCalledWith(
      "/reports/",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } },
    )
  })

  it("list llama al endpoint paginado de reportes", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { results: [] } })

    await reportsService.list()

    expect(api.get).toHaveBeenCalledWith("/reports/all/")
  })

  it("detail llama al endpoint de detalle", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { id: 7 } })

    await reportsService.detail(7)

    expect(api.get).toHaveBeenCalledWith("/reports/7/")
  })

  it("updateStatus llama al endpoint administrativo", async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: { id: 7 } })

    await reportsService.updateStatus(7, "IN_REVIEW", "Revisión iniciada")

    expect(api.patch).toHaveBeenCalledWith("/reports/7/status/", {
      status: "IN_REVIEW",
      update_detail: "Revisión iniciada",
    })
  })

  it("convierte un reporte del backend en marcador de mapa", () => {
    expect(
      mapApiReportToMapReport({
        id: 12,
        title: "Luminaria dañada",
        detail: "No prende.",
        status: "IN_REPAIR",
        category: { id: 2, name: "Public Lighting" },
        latitude: 4.7,
        longitude: -74.08,
      }),
    ).toEqual({
      id: "REP-012",
      title: "Luminaria dañada",
      category: "Alumbrado público",
      status: "En reparación",
      coordinates: [4.7, -74.08],
    })
  })
})
