import { describe, it, expect, beforeEach } from "vitest"
import { useAuthStore } from "./auth.store"

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      access: null,
      refresh: null,
      isAuthenticated: false,
    })
  })

  it("estado inicial es no autenticado", () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.access).toBeNull()
    expect(state.refresh).toBeNull()
  })

  it("setTokens guarda tokens en store y localStorage", () => {
    useAuthStore.getState().setTokens("access123", "refresh456")

    const state = useAuthStore.getState()
    expect(state.access).toBe("access123")
    expect(state.refresh).toBe("refresh456")
    expect(state.isAuthenticated).toBe(true)

    expect(localStorage.getItem("access_token")).toBe("access123")
    expect(localStorage.getItem("refresh_token")).toBe("refresh456")
  })

  it("setAccess actualiza solo el access token", () => {
    useAuthStore.getState().setTokens("access123", "refresh456")
    useAuthStore.getState().setAccess("newAccess")

    const state = useAuthStore.getState()
    expect(state.access).toBe("newAccess")
    expect(state.refresh).toBe("refresh456")
  })

  it("logout limpia todo", () => {
    useAuthStore.getState().setTokens("access123", "refresh456")
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.access).toBeNull()
    expect(state.refresh).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(localStorage.getItem("access_token")).toBeNull()
    expect(localStorage.getItem("refresh_token")).toBeNull()
  })

  it("se inicializa autenticado si hay tokens en localStorage", () => {
    localStorage.setItem("access_token", "access123")
    localStorage.setItem("refresh_token", "refresh456")

    useAuthStore.setState({
      ...useAuthStore.getState(),
      access: null,
      refresh: null,
      isAuthenticated: false,
    })

    const access = localStorage.getItem("access_token")
    const refresh = localStorage.getItem("refresh_token")
    useAuthStore.setState({
      access,
      refresh,
      isAuthenticated: !!(access && refresh),
    })

    const state = useAuthStore.getState()
    expect(state.access).toBe("access123")
    expect(state.refresh).toBe("refresh456")
    expect(state.isAuthenticated).toBe(true)
  })

  it("se inicializa sin autenticar si no hay tokens en localStorage", () => {
    localStorage.clear()

    const access = localStorage.getItem("access_token")
    const refresh = localStorage.getItem("refresh_token")
    useAuthStore.setState({
      access,
      refresh,
      isAuthenticated: !!(access && refresh),
    })

    const state = useAuthStore.getState()
    expect(state.access).toBeNull()
    expect(state.refresh).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it("setTokens guarda user en store y localStorage", () => {
    const fakeUser = {
      id: 12,
      role: "CITIZEN" as const,
      first_name: "Ana",
      last_name: "Gomez",
      email: "ana@gmail.com",
    }
    useAuthStore.getState().setTokens("access123", "refresh456", fakeUser)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(fakeUser)
    expect(localStorage.getItem("user_info")).toBe(JSON.stringify(fakeUser))
  })
})
