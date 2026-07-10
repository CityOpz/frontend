import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import LogoutPage from "./LogoutPage"
import { useAuthStore } from "../store/auth.store"
import { useNavigate } from "react-router"

type AuthStoreSelector = Parameters<typeof useAuthStore>[0]

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}))

vi.mock("../store/auth.store")

const mockLogout = vi.fn()
const mockNavigate = vi.fn()

const mockStore = {
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
  initialized: true,
  setTokens: vi.fn(),
  setAccess: vi.fn(),
  logout: mockLogout,
}

describe("LogoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockImplementation((selector: AuthStoreSelector) => selector(mockStore))
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it("renders logout message", () => {
    render(<LogoutPage />)
    expect(screen.getByText("Cerrando sesión...")).toBeInTheDocument()
    expect(screen.getByText("Por favor espera un momento.")).toBeInTheDocument()
  })

  it("calls logout on mount", () => {
    render(<LogoutPage />)
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it("navigates to login after logout", () => {
    render(<LogoutPage />)
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true })
  })
})