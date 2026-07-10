import { describe, expect, it, vi } from "vitest"
import { api } from "@/shared/lib/api/axios"
import { adminReportsService } from "./admin-reports.service"

vi.mock("@/shared/lib/api/axios", () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

describe("adminReportsService", () => {
  it("carga el listado y completa los datos desde el detalle", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 7,
              title: "Hueco en la vía",
              detail: "Detalle",
              status: "PENDING",
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 7,
          title: "Hueco en la vía",
          detail: "Detalle",
          status: "PENDING",
          category: { id: 1, name: "Infraestructura vial" },
          latitude: 4.711,
          longitude: -74.0721,
        },
      })

    await expect(adminReportsService.getReports()).resolves.toEqual([
      {
        id: "7",
        title: "Hueco en la vía",
        category: "Infraestructura vial",
        status: "Pendiente",
        coordinates: { latitude: 4.711, longitude: -74.0721 },
      },
    ])

    expect(api.get).toHaveBeenNthCalledWith(1, "/reports/all/")
    expect(api.get).toHaveBeenNthCalledWith(2, "/reports/7/")
  })

  it("actualiza el estado usando el payload esperado por el backend", async () => {
    vi.mocked(api.patch).mockResolvedValue({
      data: {
        id: 7,
        title: "Hueco en la vía",
        detail: "Detalle",
        status: "IN_REVIEW",
        category: { id: 1, name: "Infraestructura vial" },
        latitude: 4.711,
        longitude: -74.0721,
      },
    })

    await adminReportsService.updateStatus("7", "En revisión")

    expect(api.patch).toHaveBeenCalledWith("/reports/7/status/", {
      status: "IN_REVIEW",
      update_detail: "Actualización realizada desde el panel administrativo.",
    })
  })
})
