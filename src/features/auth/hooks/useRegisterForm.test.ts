import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import type { AxiosResponse, AxiosError } from "axios"
import { useLoginForm } from "./useLoginForm"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"

vi.mock("../services/auth.service", () => ({
  authService: {
    login: vi.fn(),
  },
}))

interface LoginResponse {
  access: string
  refresh: string
}

interface ErrorResponse {
  detail?: string
  message?: string
}

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
    
    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
    
    await act(async () => {
      await result.current.submit(fakeEvent)
    })
    
    expect(result.current.error).toBe("Please fill in all fields")
  })

  it("submit exitoso guarda tokens", async () => {
    const mockLogin = vi.mocked(authService.login)
    const mockResponse = {
      data: { access: "access123", refresh: "refresh456" },
    } as AxiosResponse<LoginResponse>
    
    mockLogin.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLoginForm())
    
    await act(async () => {
      result.current.update("username")("testuser")
      result.current.update("password")("password123")
    })

    const originalLocation = globalThis.location
    Object.defineProperty(globalThis, "location", {
      value: { href: "" },
      writable: true,
    })

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
    
    await act(async () => {
      await result.current.submit(fakeEvent)
    })

    expect(mockLogin).toHaveBeenCalledWith({
      username: "testuser",
      password: "password123",
    })

    expect(useAuthStore.getState().access).toBe("access123")
    expect(useAuthStore.getState().isAuthenticated).toBe(true)

    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      writable: true,
    })
  })

  it("submit con error muestra mensaje", async () => {
    const mockLogin = vi.mocked(authService.login)
    const mockError = {
      response: { data: { detail: "Invalid credentials" } },
    } as AxiosError<ErrorResponse>
    
    mockLogin.mockRejectedValue(mockError)

    const { result } = renderHook(() => useLoginForm())
    
    await act(async () => {
      result.current.update("username")("testuser")
      result.current.update("password")("wrongpass")
    })

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
    
    await act(async () => {
      await result.current.submit(fakeEvent)
    })

    expect(result.current.error).toBe("Invalid credentials")
  })
})