import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useLoginForm } from "./useLoginForm"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"

vi.mock("../services/auth.service", () => ({
  authService: {
    login: vi.fn(),
  },
}))

describe("useLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      access: null,
      refresh: null,
      isAuthenticated: false,
    })
  })

  it("estado inicial es correcto", () => {
    const { result } = renderHook(() => useLoginForm())
    
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.form.username).toBe("")
    expect(result.current.form.password).toBe("")
  })

  it("update actualiza el campo del formulario", () => {
    const { result } = renderHook(() => useLoginForm())
    
    act(() => {
      result.current.update("username")("testuser")
    })
    
    expect(result.current.form.username).toBe("testuser")
  })

  it("submit falla si faltan campos", async () => {
    const { result } = renderHook(() => useLoginForm())
    
    await act(async () => {
      await result.current.submit({ preventDefault: vi.fn() } as any)
    })
    
    expect(result.current.error).toBe("Please fill in all fields")
  })

  it("submit exitoso guarda tokens", async () => {
    const mockLogin = vi.mocked(authService.login)
    mockLogin.mockResolvedValue({
      data: { access: "access123", refresh: "refresh456" },
    } as any)

    const { result } = renderHook(() => useLoginForm())
    
    await act(async () => {
      result.current.update("username")("testuser")
      result.current.update("password")("password123")
    })

    // Mock window.location
    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, "location", {
      value: { href: "" },
      writable: true,
    })

    await act(async () => {
      await result.current.submit({ preventDefault: vi.fn() } as any)
    })

    expect(mockLogin).toHaveBeenCalledWith({
      username: "testuser",
      password: "password123",
    })

    expect(useAuthStore.getState().access).toBe("access123")
    expect(useAuthStore.getState().isAuthenticated).toBe(true)

    // Restaurar location
    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      writable: true,
    })
  })

  it("submit con error muestra mensaje", async () => {
    const mockLogin = vi.mocked(authService.login)
    mockLogin.mockRejectedValue({
      response: { data: { detail: "Invalid credentials" } },
    })

    const { result } = renderHook(() => useLoginForm())
    
    await act(async () => {
      result.current.update("username")("testuser")
      result.current.update("password")("wrongpass")
    })

    await act(async () => {
      await result.current.submit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.error).toBe("Invalid credentials")
  })
})
