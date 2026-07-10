import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useLoginForm } from "./useLoginForm"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"
import type { AxiosError } from "axios"
import type { UserInfo } from "../types/auth.types"

const navigateMock = vi.fn()

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}))

vi.mock("../services/auth.service", () => ({
  authService: {
    login: vi.fn(),
  },
}))

vi.mock("../store/auth.store", () => ({
  useAuthStore: vi.fn(),
}))

const setTokensMock = vi.fn()


interface AuthStoreState {
  access: string | null
  refresh: string | null
  isAuthenticated: boolean
  initialized: boolean
  setTokens: (access: string, refresh: string, user?: UserInfo) => void  // ✅ UserInfo
  setAccess: (access: string) => void
  logout: () => void
}

const fakeAuthState: AuthStoreState = {
  access: null,
  refresh: null,
  isAuthenticated: false,
  initialized: false,
  setTokens: setTokensMock,
  setAccess: vi.fn(),
  logout: vi.fn(),
}

function selectFromAuthStore<T>(selector: (state: AuthStoreState) => T): T {
  return selector(fakeAuthState)
}

function buildAxiosError(data?: Record<string, unknown>, withResponse = true): AxiosError {
  return {
    isAxiosError: true,
    response: withResponse ? { data, status: 400 } : undefined,
    name: "AxiosError",
    message: "Request failed",
    toJSON: () => ({}),
  } as unknown as AxiosError
}

function buildFormEvent() {
  return { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>
}

describe("useLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockImplementation(selectFromAuthStore as typeof useAuthStore)
  })

  it("inicializa con form vacío, sin loading ni error", () => {
    const { result } = renderHook(() => useLoginForm())
    expect(result.current.form).toEqual({ username: "", password: "" })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("update() actualiza el campo indicado", () => {
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("nueva-persona")
    })
    expect(result.current.form.username).toBe("nueva-persona")
  })

  it("update() limpia el error existente al escribir", () => {
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("")
      result.current.update("password")("")
    })
    act(() => {
      result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Please fill in all fields")

    act(() => {
      result.current.update("username")("algo")
    })
    expect(result.current.error).toBeNull()
  })

  it("update() no falla si no había error previo (rama error=null)", () => {
    const { result } = renderHook(() => useLoginForm())
    expect(result.current.error).toBeNull()
    act(() => {
      result.current.update("password")("1234")
    })
    expect(result.current.error).toBeNull()
    expect(result.current.form.password).toBe("1234")
  })

  it("submit muestra error si falta username", async () => {
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("password")("secreto")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Please fill in all fields")
    expect(authService.login).not.toHaveBeenCalled()
  })

  it("submit muestra error si falta password", async () => {
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("usuario")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Please fill in all fields")
    expect(authService.login).not.toHaveBeenCalled()
  })

  it("submit muestra error si faltan ambos campos", async () => {
    const { result } = renderHook(() => useLoginForm())
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Please fill in all fields")
    expect(authService.login).not.toHaveBeenCalled()
  })

  it("login exitoso: guarda tokens y navega a /dashboard", async () => {
    const fakeUser = { id: 1, role: "ADMIN", first_name: "Juan", last_name: "Toro", email: "juan@example.com" }
    vi.mocked(authService.login).mockResolvedValue({
      data: { access: "access-token", refresh: "refresh-token", user: fakeUser },
    } as Awaited<ReturnType<typeof authService.login>>)

    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("usuario")
      result.current.update("password")("secreto")
    })

    await act(async () => {
      await result.current.submit(buildFormEvent())
    })

    expect(authService.login).toHaveBeenCalledWith({
      username: "usuario",
      password: "secreto",
    })
    expect(setTokensMock).toHaveBeenCalledWith("access-token", "refresh-token", fakeUser)
    expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true })
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it("error con 'detail' en la respuesta usa ese mensaje", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      buildAxiosError({ detail: "Cuenta bloqueada" }),
    )
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Cuenta bloqueada")
    expect(result.current.loading).toBe(false)
  })

  it("sin 'detail', usa 'message' de la respuesta", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      buildAxiosError({ message: "Servicio no disponible" }),
    )
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Servicio no disponible")
  })

  it("sin detail/message, usa el primer mensaje de 'username' cuando es array", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      buildAxiosError({ username: ["Este usuario no existe", "otro error"] }),
    )
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Este usuario no existe")
  })

  it("sin detail/message, usa 'username' directo cuando es string", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      buildAxiosError({ username: "Usuario inválido" }),
    )
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Usuario inválido")
  })

  it("sin detail/message/username, usa el primer mensaje de 'password' cuando es array", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      buildAxiosError({ password: ["Contraseña muy corta"] }),
    )
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Contraseña muy corta")
  })

  it("sin detail/message/username, usa 'password' directo cuando es string", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      buildAxiosError({ password: "Contraseña incorrecta" }),
    )
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Contraseña incorrecta")
  })

  it("sin ningún campo reconocible en la respuesta, cae al mensaje genérico", async () => {
    vi.mocked(authService.login).mockRejectedValue(buildAxiosError({}))
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Invalid credentials")
  })

  it("sin response en el error (network error), cae al mensaje genérico", async () => {
    vi.mocked(authService.login).mockRejectedValue(buildAxiosError(undefined, false))
    const { result } = renderHook(() => useLoginForm())
    act(() => {
      result.current.update("username")("u")
      result.current.update("password")("p")
    })
    await act(async () => {
      await result.current.submit(buildFormEvent())
    })
    expect(result.current.error).toBe("Invalid credentials")
    expect(setTokensMock).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})