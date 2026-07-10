import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import CitizenDashboardPage from "./CitizenDashboardPage"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { reportsService } from "../services/reports.service"
import type { ApiReport } from "../types/report-api.types"

vi.mock("@/features/auth/store/auth.store")
vi.mock("../services/reports.service")
vi.mock("@/shared/hooks/useDocumentTitle", () => ({
  default: vi.fn(),
}))
vi.mock("@/shared/theme/components/ThemeToggle", () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}))

describe("CitizenDashboardPage", () => {
  const mockUser = {
    id: 1,
    role: "CITIZEN" as const,
    first_name: "John",
    last_name: "Doe",
    email: "john@test.com",
  }

  const mockReports: ApiReport[] = [
    {
      id: 1,
      title: "Reporte 1",
      detail: "Detalle 1",
      status: "PENDING",
      category: { id: 1, name: "Vías" },
      created_at: "2024-01-01T10:00:00Z",
      latitude: 4.711,
      longitude: -74.0721,
    },
    {
      id: 2,
      title: "Reporte 2",
      detail: "Detalle 2",
      status: "IN_REVIEW",
      category: { id: 2, name: "Alumbrado" },
      created_at: "2024-01-02T10:00:00Z",
    },
    {
      id: 3,
      title: "Reporte 3",
      detail: "Detalle 3",
      status: "RESOLVED",
      category: { id: 3, name: "Parques" },
      created_at: "2024-01-03T10:00:00Z",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      access: null,
      refresh: null,
      isAuthenticated: true,
      initialized: true,
      setTokens: vi.fn(),
      setAccess: vi.fn(),
      logout: vi.fn(),
    })
  })

  it("renders user information", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue([])
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
      expect(screen.getByText("Ciudadano")).toBeInTheDocument()
    })
  })

  it("renders page title and description", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue([])
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("Mis Reportes Creados")).toBeInTheDocument()
      expect(screen.getByText("Monitorea el progreso de los reportes que has enviado a la municipalidad.")).toBeInTheDocument()
    })
  })

  it("renders navigation items", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue([])
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("Mis Reportes")).toBeInTheDocument()
      expect(screen.getByText("Nuevo Reporte")).toBeInTheDocument()
      expect(screen.getByText("Mapa de Reportes")).toBeInTheDocument()
    })
  })

  it("displays loading state initially", () => {
    vi.mocked(reportsService.listCitizenReports).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )
    render(<CitizenDashboardPage />)
    expect(screen.getByText("Cargando tus reportes...")).toBeInTheDocument()
  })

  it("displays reports list after loading", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue(mockReports)
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("Reporte 1")).toBeInTheDocument()
      expect(screen.getByText("Reporte 2")).toBeInTheDocument()
      expect(screen.getByText("Reporte 3")).toBeInTheDocument()
    })
  })

  it("displays empty state when no reports", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue([])
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("Aún no has creado ningún reporte. ¡Haz clic en \"Nuevo reporte\" para empezar!")).toBeInTheDocument()
    })
  })

  it("displays error state when API fails", async () => {
    vi.mocked(reportsService.listCitizenReports).mockRejectedValue(new Error("API Error"))
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("No se pudieron cargar tus reportes.")).toBeInTheDocument()
    })
  })

  it("calculates report statistics correctly", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue(mockReports)
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument() // Total
      expect(screen.getByText("1")).toBeInTheDocument() // Pending
      expect(screen.getAllByText("1").length).toBeGreaterThan(0) // In progress
    })
  })

  it("displays report status badges correctly", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue(mockReports)
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("Pendiente")).toBeInTheDocument()
      expect(screen.getByText("En revisión")).toBeInTheDocument()
      expect(screen.getByText("Resuelto")).toBeInTheDocument()
    })
  })

  it("displays coordinates when available", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue(mockReports)
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("4,7110,")).toBeInTheDocument()
      expect(screen.getByText("-74,0721")).toBeInTheDocument()
    })
  })

  it("displays 'Sin ubicación' when coordinates not available", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue([mockReports[1]])
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("Sin ubicación")).toBeInTheDocument()
    })
  })

  it("toggles profile menu when clicking profile button", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue([])
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })

    const profileButton = screen.getByLabelText("Abrir opciones de foto de perfil")
    fireEvent.click(profileButton)
    
    expect(screen.getByText("Subir foto")).toBeInTheDocument()
    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument()
  })

  it("displays user initials when no profile photo", async () => {
    vi.mocked(reportsService.listCitizenReports).mockResolvedValue([])
    render(<CitizenDashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText("JD")).toBeInTheDocument()
    })
  })
})