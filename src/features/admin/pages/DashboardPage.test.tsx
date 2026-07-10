import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import DashboardPage from "./DashboardPage"
import { useAuthStore } from "@/features/auth/store/auth.store"

vi.mock("@/features/auth/store/auth.store")
vi.mock("./AdminDashboardPage", () => ({
  default: () => <div data-testid="admin-dashboard">Admin Dashboard</div>,
}))
vi.mock("@/features/reports/pages/CitizenDashboardPage", () => ({
  default: () => <div data-testid="citizen-dashboard">Citizen Dashboard</div>,
}))

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders AdminDashboardPage when user role is ADMIN", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: 1, role: "ADMIN", first_name: "Admin", last_name: "User", email: "admin@test.com" },
      access: null,
      refresh: null,
      isAuthenticated: true,
      initialized: true,
      setTokens: vi.fn(),
      setAccess: vi.fn(),
      logout: vi.fn(),
    })

    render(<DashboardPage />)
    expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument()
  })

  it("renders CitizenDashboardPage when user role is CITIZEN", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: 2, role: "CITIZEN", first_name: "John", last_name: "Doe", email: "john@test.com" },
      access: null,
      refresh: null,
      isAuthenticated: true,
      initialized: true,
      setTokens: vi.fn(),
      setAccess: vi.fn(),
      logout: vi.fn(),
    })

    render(<DashboardPage />)
    expect(screen.getByTestId("citizen-dashboard")).toBeInTheDocument()
  })

  it("renders CitizenDashboardPage when user is null", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      access: null,
      refresh: null,
      isAuthenticated: false,
      initialized: true,
      setTokens: vi.fn(),
      setAccess: vi.fn(),
      logout: vi.fn(),
    })

    render(<DashboardPage />)
    expect(screen.getByTestId("citizen-dashboard")).toBeInTheDocument()
  })
})