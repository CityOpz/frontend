import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { mockReports } from "../data/reports.mock"
import { adminReportsService } from "../services/admin-reports.service"
import AdminDashboardPage from "./AdminDashboardPage"

vi.mock("../services/admin-reports.service", () => ({
  adminReportsService: {
    getReports: vi.fn(),
    updateStatus: vi.fn(),
  },
}))

describe("AdminDashboardPage", () => {
  beforeEach(() => {
    vi.mocked(adminReportsService.getReports).mockResolvedValue(mockReports)
    vi.mocked(adminReportsService.updateStatus).mockReset()

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:profile-photo"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
  })

  it("carga los reportes desde el backend", async () => {
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getAllByText("Cargando reportes...").length).toBeGreaterThan(0)

    await waitFor(() => {
      expect(adminReportsService.getReports).toHaveBeenCalled()
    })

    expect(screen.getByText("REP-001")).toBeInTheDocument()
    expect(screen.getByText("API backend")).toBeInTheDocument()
  })

  it("permite subir y quitar una foto de perfil desde el menú lateral", async () => {
    const { container } = render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    )

    await screen.findByText("REP-001")

    const profilePhotoInput = container.querySelector<HTMLInputElement>(
      'input[type="file"][accept="image/*"]',
    )
    const profilePhoto = new File(["profile"], "profile.png", {
      type: "image/png",
    })

    expect(profilePhotoInput).not.toBeNull()

    fireEvent.click(
      screen.getByRole("button", { name: "Abrir opciones de foto de perfil" }),
    )
    expect(screen.getByRole("button", { name: "Subir foto" })).toBeInTheDocument()

    fireEvent.change(profilePhotoInput!, { target: { files: [profilePhoto] } })

    expect(screen.getByAltText("Foto de perfil de Juan Toro")).toHaveAttribute(
      "src",
      "blob:profile-photo",
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Abrir opciones de foto de perfil" }),
    )
    fireEvent.click(screen.getByRole("button", { name: "Quitar foto" }))

    expect(screen.queryByAltText("Foto de perfil de Juan Toro")).not.toBeInTheDocument()
  })
})
