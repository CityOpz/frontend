import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useRegisterForm } from "./useRegisterForm"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"

vi.mock("../services/auth.service", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
  },
}))

describe("useRegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      access: null,
      refresh: null,
      isAuthenticated: false,
    })
  })

  it("estado inicial es correcto", () => {
    const { result } = renderHook(() => useRegisterForm())
    
    expect(result.current.loading).toBe(false)
    expect(result.current.termsError).toBeNull()
    expect(result.current.form.firstName).toBe("")
    expect(result.current.form.acceptTerms).toBe(false)
  })

  it("submit falla si no acepta términos", async () => {
    const { result } = renderHook(() => useRegisterForm())
    
    await act(async () => {
      await result.current.submit({ preventDefault: vi.fn() } as any)
    })
    
    expect(result.current.termsError).toBe("You must accept the terms and conditions")
  })

  it("submit falla si validaciones fallan", async () => {
    const { result } = renderHook(() => useRegisterForm())
    
    await act(async () => {
      result.current.update("acceptTerms")(true)
      result.current.update("firstName")("") // Campo vacío
    })

    await act(async () => {
      await result.current.submit({ preventDefault: vi.fn() } as any)
    })
    
    expect(result.current.errors.firstName).toBeDefined()
  })

  it("submit exitoso registra y hace auto-login", async () => {
    const mockRegister = vi.mocked(authService.register)
    const mockLogin = vi.mocked(authService.login)
    
    mockRegister.mockResolvedValue({} as any)
    mockLogin.mockResolvedValue({
      data: { access: "access123", refresh: "refresh456" },
    } as any)

    const { result } = renderHook(() => useRegisterForm())
    
    await act(async () => {
      result.current.update("firstName")("John")
      result.current.update("lastName")("Doe")
      result.current.update("username")("johndoe")
      result.current.update("email")("john@example.com")
      result.current.update("password")("Password1")
      result.current.update("confirmPassword")("Password1")
      result.current.update("acceptTerms")(true)
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

    expect(mockRegister).toHaveBeenCalled()
    expect(mockLogin).toHaveBeenCalled()
    expect(useAuthStore.getState().access).toBe("access123")

    // Restaurar location
    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      writable: true,
    })
  })

  it("submit con error del backend mapea errores a campos", async () => {
    const mockRegister = vi.mocked(authService.register)
    mockRegister.mockRejectedValue({
      response: {
        data: {
          username: ["A user with that username already exists."],
          email: ["This field must be unique."],
        },
      },
    })

    const { result } = renderHook(() => useRegisterForm())
    
    await act(async () => {
      result.current.update("firstName")("John")
      result.current.update("lastName")("Doe")
      result.current.update("username")("johndoe")
      result.current.update("email")("john@example.com")
      result.current.update("password")("Password1")
      result.current.update("confirmPassword")("Password1")
      result.current.update("acceptTerms")(true)
    })

    await act(async () => {
      await result.current.submit({ preventDefault: vi.fn() } as any)
    })

    expect(result.current.errors.username).toBe("A user with that username already exists.")
    expect(result.current.errors.email).toBe("This field must be unique.")
  })
})
