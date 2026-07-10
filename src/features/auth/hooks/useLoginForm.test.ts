import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { createElement, type ReactNode } from "react"
import { MemoryRouter } from "react-router"
import type { AxiosResponse, AxiosError } from "axios"
import type {  RegisterResponse } from "../types/auth.types"
import { useRegisterForm } from "./useRegisterForm"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"

vi.mock("../services/auth.service", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
  },
}))

interface LoginResponse {
  access: string
  refresh: string
}

interface RegisterErrorResponse {
  username?: string[]
  email?: string[]
  [key: string]: string[] | undefined
}

describe("useRegisterForm", () => {
  const wrapper = ({ children }: { readonly children: ReactNode }) =>
    createElement(MemoryRouter, null, children)

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      access: null,
      refresh: null,
      isAuthenticated: false,
    })
  })

  it("estado inicial es correcto", () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper })
    
    expect(result.current.loading).toBe(false)
    expect(result.current.termsError).toBeNull()
    expect(result.current.form.firstName).toBe("")
    expect(result.current.form.acceptTerms).toBe(false)
  })

  it("submit falla si no acepta términos", async () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper })
    
    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
    
    await act(async () => {
      await result.current.submit(fakeEvent)
    })
    
    expect(result.current.termsError).toBe("You must accept the terms and conditions")
  })

  it("submit falla si validaciones fallan", async () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper })
    
    await act(async () => {
      result.current.update("acceptTerms")(true)
      result.current.update("firstName")("")
    })

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
    
    await act(async () => {
      await result.current.submit(fakeEvent)
    })
    
    expect(result.current.errors.firstName).toBeDefined()
  })

  it("submit exitoso registra y hace auto-login", async () => {
    const mockRegister = vi.mocked(authService.register)
    const mockLogin = vi.mocked(authService.login)
    
    const registerResponse = {
      data: {
        id: 1,
        username: "johndoe",
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
      },
      status: 201,
      statusText: "Created",
      headers: {},
      config: {} as AxiosResponse<RegisterResponse>["config"],
    } as AxiosResponse<RegisterResponse>
    
    const loginResponse = {
      data: { access: "access123", refresh: "refresh456" },
    } as AxiosResponse<LoginResponse>
    
    mockRegister.mockResolvedValue(registerResponse)
    mockLogin.mockResolvedValue(loginResponse)

    const { result } = renderHook(() => useRegisterForm(), { wrapper })
    
    await act(async () => {
      result.current.update("firstName")("John")
      result.current.update("lastName")("Doe")
      result.current.update("username")("johndoe")
      result.current.update("email")("john@example.com")
      result.current.update("password")("Password1")
      result.current.update("confirmPassword")("Password1")
      result.current.update("acceptTerms")(true)
    })

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
    
    await act(async () => {
      await result.current.submit(fakeEvent)
    })

    expect(mockRegister).toHaveBeenCalled()
    expect(mockLogin).toHaveBeenCalled()
    expect(useAuthStore.getState().access).toBe("access123")

  })

  it("submit con error del backend mapea errores a campos", async () => {
    const mockRegister = vi.mocked(authService.register)
    const mockError = {
      response: {
        data: {
          username: ["A user with that username already exists."],
          email: ["This field must be unique."],
        },
      },
    } as AxiosError<RegisterErrorResponse>
    
    mockRegister.mockRejectedValue(mockError)

    const { result } = renderHook(() => useRegisterForm(), { wrapper })
    
    await act(async () => {
      result.current.update("firstName")("John")
      result.current.update("lastName")("Doe")
      result.current.update("username")("johndoe")
      result.current.update("email")("john@example.com")
      result.current.update("password")("Password1")
      result.current.update("confirmPassword")("Password1")
      result.current.update("acceptTerms")(true)
    })

    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
    
    await act(async () => {
      await result.current.submit(fakeEvent)
    })

    expect(result.current.errors.username).toBe("A user with that username already exists.")
    expect(result.current.errors.email).toBe("This field must be unique.")
  })
})
