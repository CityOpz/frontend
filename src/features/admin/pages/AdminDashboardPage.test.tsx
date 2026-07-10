import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import DashboardPage from "./DashboardPage"
import { useAuthStore } from "@/features/auth/store/auth.store"
import type { UserInfo } from "@/features/auth/types/auth.types"

type AuthStoreSelector = Parameters<typeof useAuthStore>[0]

vi.mock("@/features/auth/store/auth.store")
vi.mock("./AdminDashboardPage", () => ({
  default: () => <div data-testid="admin-dashboard">Admin Dashboard</div>,
}))
vi.mock("@/features/reports/pages/CitizenDashboardPage", () => ({
  default: () => <div data-testid="citizen-dashboard">Citizen Dashboard</div>,
}))

const mockStore = {
  user: null as UserInfo | null,
  access: null as string | null,
  refresh: null as string | null,
  isAuthenticated: false,
  initialized: true,
  setTokens: vi.fn(),
  setAccess: vi.fn(),
  logout: vi.fn(),
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockImplementation((selector: AuthStoreSelector) => selector(mockStore))
  })

  it("renders AdminDashboardPage when user role is ADMIN", () => {
    mockStore.user = {
      id: 1,
      role: "ADMIN" as const,
      first_name: "Admin",
      last_name: "User",
      email: "admin@test.com",
    }

    render(<DashboardPage />)
    expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument()
  })

  it("renders CitizenDashboardPage when user role is CITIZEN", () => {
    mockStore.user = {
      id: 2,
      role: "CITIZEN" as const,
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
    }

    render(<DashboardPage />)
    expect(screen.getByTestId("citizen-dashboard")).toBeInTheDocument()
  })

  it("renders CitizenDashboardPage when user is null", () => {
    mockStore.user = null

    render(<DashboardPage />)
    expect(screen.getByTestId("citizen-dashboard")).toBeInTheDocument()
  })
})