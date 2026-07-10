import { describe, it, expect, vi, beforeEach } from "vitest"
import { api } from "@/shared/lib/api/axios"
import {
  reportsService,
  mapApiReportToMapReport,
  REPORT_CATEGORY_OPTIONS,
} from "./reports.service"
import type { ApiReport } from "../types/report-api.types"

vi.mock("@/shared/lib/api/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

function buildApiReport(overrides: Partial<ApiReport> = {}): ApiReport {
  return {
    id: 5,
    title: "Bache en la vía",
    detail: "Hay un hueco grande",
    category: { id: 1, name: "Road Infrastructure" },
    latitude: 3.45,
    longitude: -76.53,
    status: "PENDING",
    ...overrides,
  } as ApiReport
}

describe("mapApiReportToMapReport", () => {
  it("retorna null si falta latitude", () => {
    const report = buildApiReport({ latitude: undefined })
    expect(mapApiReportToMapReport(report)).toBeNull()
  })

  it("retorna null si falta longitude", () => {
    const report = buildApiReport({ longitude: undefined })
    expect(mapApiReportToMapReport(report)).toBeNull()
  })

  it("mapea usando el backendName de la categoría cuando existe category.name", () => {
    const report = buildApiReport({ category: { id: 1, name: "Road Infrastructure" } })
    const result = mapApiReportToMapReport(report)
    expect(result?.category).toBe("Infraestructura vial")
  })

  it("mapea usando el id de la categoría cuando category.name no está en el mapa", () => {
    const report = buildApiReport({
      category: { id: 2, name: "Unknown Backend Label" },
    })
    const result = mapApiReportToMapReport(report)
    expect(result?.category).toBe("Unknown Backend Label")
  })

  it("usa el id como categoryKey cuando category no tiene name", () => {
    const report = buildApiReport({
      category: { id: 3 } as unknown as ApiReport["category"],
    })
    const result = mapApiReportToMapReport(report)
    expect(result?.category).toBe("Mobiliario urbano")
  })

  it("retorna 'Sin categoría' cuando no hay category ni coincidencia", () => {
    const report = buildApiReport({ category: undefined })
    const result = mapApiReportToMapReport(report)
    expect(result?.category).toBe("Sin categoría")
  })

  it("aplica padStart al id (ids cortos)", () => {
    const report = buildApiReport({ id: 7 })
    const result = mapApiReportToMapReport(report)
    expect(result?.id).toBe("REP-007")
  })

  it("aplica padStart al id (ids largos, sin recortar)", () => {
    const report = buildApiReport({ id: 1234 })
    const result = mapApiReportToMapReport(report)
    expect(result?.id).toBe("REP-1234")
  })

  it.each([
    ["PENDING", "Pendiente"],
    ["IN_REVIEW", "En revisión"],
    ["IN_REPAIR", "En reparación"],
    ["RESOLVED", "Resuelto"],
  ] as const)("mapea status %s a %s", (status, label) => {
    const report = buildApiReport({ status })
    const result = mapApiReportToMapReport(report)
    expect(result?.status).toBe(label)
  })
})

describe("REPORT_CATEGORY_OPTIONS", () => {
  it("tiene 10 categorías definidas", () => {
    expect(REPORT_CATEGORY_OPTIONS).toHaveLength(10)
  })
})

describe("reportsService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("create arma un FormData completo (title, detail, categoryId, coords, photo) y llama a POST", async () => {
    const photo = new File(["dummy"], "foto.jpg", { type: "image/jpeg" })
    vi.mocked(api.post).mockResolvedValue({ data: buildApiReport() })

    await reportsService.create({
      title: "Bache",
      detail: "Grande",
      categoryId: 1,
      latitude: 3.1,
      longitude: -76.1,
      photo,
    } as unknown as Parameters<typeof reportsService.create>[0])

    expect(api.post).toHaveBeenCalledTimes(1)
    const [url, formData, config] = vi.mocked(api.post).mock.calls[0]
    expect(url).toBe("/reports/")
    expect(config).toEqual({ headers: { "Content-Type": "multipart/form-data" } })
    expect(formData).toBeInstanceOf(FormData)
    const fd = formData as FormData
    expect(fd.get("title")).toBe("Bache")
    expect(fd.get("detail")).toBe("Grande")
    expect(fd.get("category_id")).toBe("1")
    expect(fd.get("latitude")).toBe("3.1")
    expect(fd.get("longitude")).toBe("-76.1")
    expect(fd.get("photo")).toBeInstanceOf(File)
  })

  it("create omite campos undefined y no agrega photo si no viene", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: buildApiReport() })

    await reportsService.create({
      categoryId: 2,
    } as unknown as Parameters<typeof reportsService.create>[0])

    const [, formData] = vi.mocked(api.post).mock.calls[0]
    const fd = formData as FormData
    expect(fd.has("title")).toBe(false)
    expect(fd.has("detail")).toBe(false)
    expect(fd.has("photo")).toBe(false)
    expect(fd.get("category_id")).toBe("2")
  })

  it("update usa 'category' (no categoryId) cuando el payload lo trae", async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: buildApiReport() })

    await reportsService.update(9, {
      category: "Green Areas",
    } as unknown as Parameters<typeof reportsService.update>[1])

    const [url, formData, config] = vi.mocked(api.patch).mock.calls[0]
    expect(url).toBe("/reports/9/update/")
    expect(config).toEqual({ headers: { "Content-Type": "multipart/form-data" } })
    const fd = formData as FormData
    expect(fd.get("category")).toBe("Green Areas")
    expect(fd.has("category_id")).toBe(false)
  })

  it("list llama a GET /reports/all/", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { results: [] } })
    await reportsService.list()
    expect(api.get).toHaveBeenCalledWith("/reports/all/")
  })

  it("detail llama a GET /reports/:id/", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: buildApiReport() })
    await reportsService.detail(42)
    expect(api.get).toHaveBeenCalledWith("/reports/42/")
  })

  it("delete llama a DELETE /reports/:id/", async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: null })
    await reportsService.delete(3)
    expect(api.delete).toHaveBeenCalledWith("/reports/3/")
  })

  it("updateStatus llama a PATCH con status y update_detail", async () => {
    vi.mocked(api.patch).mockResolvedValue({ data: buildApiReport() })
    await reportsService.updateStatus(8, "IN_REVIEW", "Se revisó el caso")
    expect(api.patch).toHaveBeenCalledWith("/reports/8/status/", {
      status: "IN_REVIEW",
      update_detail: "Se revisó el caso",
    })
  })

  it("listCitizenReports llama a GET /reports/all/?my_reports=true", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { results: [] } })
    await reportsService.listCitizenReports()
    expect(api.get).toHaveBeenCalledWith("/reports/all/?my_reports=true")
  })

  it("maneja error en listCitizenReports", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Network error"))
    await expect(reportsService.listCitizenReports()).rejects.toThrow("Network error")
  })

  it("maneja error en detail", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Not found"))
    await expect(reportsService.detail(999)).rejects.toThrow("Not found")
  })

  it("maneja error en delete", async () => {
    vi.mocked(api.delete).mockRejectedValue(new Error("Forbidden"))
    await expect(reportsService.delete(1)).rejects.toThrow("Forbidden")
  })

  describe("listMapReports", () => {
    it("obtiene la lista, pide el detalle de cada reporte y descarta los que retornan null", async () => {
      vi.mocked(api.get).mockImplementation((url: string) => {
        if (url === "/reports/all/") {
          return Promise.resolve({
            data: { results: [{ id: 1 }, { id: 2 }] },
          })
        }
        if (url === "/reports/1/") {
          return Promise.resolve({ data: buildApiReport({ id: 1 }) })
        }
        if (url === "/reports/2/") {
          return Promise.resolve({
            data: buildApiReport({ id: 2, latitude: undefined, longitude: undefined }),
          })
        }
        return Promise.reject(new Error(`URL inesperada: ${url}`))
      })

      const result = await reportsService.listMapReports()

      expect(api.get).toHaveBeenCalledWith("/reports/all/")
      expect(api.get).toHaveBeenCalledWith("/reports/1/")
      expect(api.get).toHaveBeenCalledWith("/reports/2/")
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe("REP-001")
    })

    it("retorna arreglo vacío cuando no hay resultados", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { results: [] } })
      const result = await reportsService.listMapReports()
      expect(result).toEqual([])
    })
  })
})