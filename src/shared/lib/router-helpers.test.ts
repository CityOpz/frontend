import { describe, it, expect, beforeEach, vi } from "vitest"
import { requireAuth, requireGuest } from "./router-helpers"
import { useAuthStore } from "@/features/auth/store/auth.store"

vi.mock("react-router", () => ({
  redirect: vi.fn((url: string) => {
    const error = new Error(`Redirect to ${url}`) as Error & {
      type: string
      url: string
    }

    error.type = "redirect"
    error.url = url

    throw error
  }),
}))

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      access: null,
      refresh: null,
      isAuthenticated: false,
      initialized: false,
    })
  })

  it("redirige a /login si no está autenticado", () => {
    useAuthStore.setState({ isAuthenticated: false })

    expect(() => requireAuth()).toThrow("Redirect to /login")
  })

  it("no redirige si está autenticado", () => {
    useAuthStore.setState({ isAuthenticated: true })

    const result = requireAuth()
    expect(result).toBeNull()
  })
})

describe("requireGuest", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      access: null,
      refresh: null,
      isAuthenticated: false,
      initialized: false,
    })
  })

  it("redirige a /dashboard si está autenticado", () => {
    useAuthStore.setState({ isAuthenticated: true })

    expect(() => requireGuest()).toThrow("Redirect to /dashboard")
  })

  it("no redirige si no está autenticado", () => {
    useAuthStore.setState({ isAuthenticated: false })

    const result = requireGuest()
    expect(result).toBeNull()
  })
})
