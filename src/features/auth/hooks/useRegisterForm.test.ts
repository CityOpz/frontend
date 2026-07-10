import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useRegisterForm } from "./useRegisterForm"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
} from "../utils/validators"
import type { AxiosError } from "axios"

const navigateMock = vi.fn()
const setTokensMock = vi.fn()

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}))

vi.mock("../services/auth.service", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
  },
}))

vi.mock("../store/auth.store", () => ({
  useAuthStore: vi.fn(),
}))

vi.mock("../utils/validators", () => ({
  validateUsername: vi.fn(),
  validateEmail: vi.fn(),
  validatePassword: vi.fn(),
  validateConfirmPassword: vi.fn(),
  validateFirstName: vi.fn(),
  validateLastName: vi.fn(),
}))

interface AuthStoreState {
  access: string | null
  refresh: string | null
  isAuthenticated: boolean
  initialized: boolean
  setTokens: (access: string, refresh: string, user?: any) => void
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

function fillValidForm(result: ReturnType<typeof renderHook<ReturnType<typeof useRegisterForm>, unknown>>["result"]) {
  act(() => {
    result.current.update("firstName")("Ana")
    result.current.update("lastName")("Gómez")
    result.current.update("username")("anagomez")
    result.current.update("email")("ana@test.com")
    result.current.update("password")("Secreta123")
    result.current.update("confirmPassword")("Secreta123")
    result.current.update("acceptTerms")(true)
  })
}

describe("useRegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockImplementation(selectFromAuthStore as typeof useAuthStore)
    vi.mocked(validateFirstName).mockReturnValue({ valid: true })
    vi.mocked(validateLastName).mockReturnValue({ valid: true })
    vi.mocked(validateUsername).mockReturnValue({ valid: true })
    vi.mocked(validateEmail).mockReturnValue({ valid: true })
    vi.mocked(validatePassword).mockReturnValue({ valid: true })
    vi.mocked(validateConfirmPassword).mockReturnValue({ valid: true })
  })

  describe("update()", () => {
    it("actualiza el campo y limpia su error existente", () => {
      vi.mocked(validateUsername).mockReturnValue({ valid: false, error: "Muy corto" })
      const { result } = renderHook(() => useRegisterForm())
      act(() => {
        result.current.validateField("username", "ab")
      })
      expect(result.current.errors.username).toBe("Muy corto")

      act(() => {
        result.current.update("username")("abcdef")
      })
      expect(result.current.errors.username).toBeUndefined()
      expect(result.current.form.username).toBe("abcdef")
    })

    it("no toca errors si el campo no tenía error previo", () => {
      const { result } = renderHook(() => useRegisterForm())
      act(() => {
        result.current.update("email")("nuevo@test.com")
      })
      expect(result.current.errors.email).toBeUndefined()
    })

    it("limpia submitError existente al escribir en cualquier campo", async () => {
      vi.mocked(authService.register).mockRejectedValue(buildAxiosError(undefined, false))
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)
      await act(async () => {
        await result.current.submit(buildFormEvent())
      })
      expect(result.current.submitError).toBe(
        "We could not create your account. Please try again.",
      )

      act(() => {
        result.current.update("firstName")("Otro")
      })
      expect(result.current.submitError).toBeNull()
    })

    it("no falla si submitError ya era null", () => {
      const { result } = renderHook(() => useRegisterForm())
      act(() => {
        result.current.update("lastName")("X")
      })
      expect(result.current.submitError).toBeNull()
    })

    it("acceptTerms=true limpia termsError", async () => {
      const { result } = renderHook(() => useRegisterForm())
      await act(async () => {
        await result.current.submit(buildFormEvent())
      })
      expect(result.current.termsError).toBe("You must accept the terms and conditions")

      act(() => {
        result.current.update("acceptTerms")(true)
      })
      expect(result.current.termsError).toBeNull()
    })

    it("acceptTerms=false NO limpia termsError", async () => {
      const { result } = renderHook(() => useRegisterForm())
      await act(async () => {
        await result.current.submit(buildFormEvent())
      })
      expect(result.current.termsError).toBe("You must accept the terms and conditions")

      act(() => {
        result.current.update("acceptTerms")(false)
      })
      expect(result.current.termsError).toBe("You must accept the terms and conditions")
    })

    it("un campo distinto a acceptTerms no limpia termsError", async () => {
      const { result } = renderHook(() => useRegisterForm())
      await act(async () => {
        await result.current.submit(buildFormEvent())
      })
      expect(result.current.termsError).toBe("You must accept the terms and conditions")

      act(() => {
        result.current.update("username")("otro")
      })
      expect(result.current.termsError).toBe("You must accept the terms and conditions")
    })
  })

  describe("validateField()", () => {
    it("marca error cuando el validador retorna valid=false", () => {
      vi.mocked(validateEmail).mockReturnValue({ valid: false, error: "Email inválido" })
      const { result } = renderHook(() => useRegisterForm())
      act(() => {
        result.current.validateField("email", "malo")
      })
      expect(result.current.errors.email).toBe("Email inválido")
    })

    it("usa el caso default cuando el campo no coincide con ningún case", () => {
      const { result } = renderHook(() => useRegisterForm())
      let isValid: boolean | undefined
      act(() => {
        isValid = result.current.validateField(
          "campoDesconocido" as unknown as Parameters<typeof result.current.validateField>[0],
          "cualquier valor",
        )
      })
      expect(isValid).toBe(true)
      expect((result.current.errors as Record<string, unknown>).campoDesconocido).toBeUndefined()
    })
  })

  describe("submit()", () => {
    it("no envía si no se aceptan los términos", async () => {
      const { result } = renderHook(() => useRegisterForm())
      await act(async () => {
        await result.current.submit(buildFormEvent())
      })
      expect(result.current.termsError).toBe("You must accept the terms and conditions")
      expect(authService.register).not.toHaveBeenCalled()
    })

    it("no envía si la validación de campos falla", async () => {
      vi.mocked(validateUsername).mockReturnValue({ valid: false, error: "Requerido" })
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)
      await act(async () => {
        await result.current.submit(buildFormEvent())
      })
      expect(authService.register).not.toHaveBeenCalled()
      expect(result.current.errors.username).toBe("Requerido")
      expect(result.current.loading).toBe(false)
    })

    it("registro exitoso: registra, hace login y navega", async () => {
      const fakeUser = { id: 2, role: "CITIZEN", first_name: "Ana", last_name: "Gómez", email: "ana@test.com" }
      vi.mocked(authService.register).mockResolvedValue(
        {} as Awaited<ReturnType<typeof authService.register>>,
      )
      vi.mocked(authService.login).mockResolvedValue({
        data: { access: "tok-a", refresh: "tok-r", user: fakeUser },
      } as Awaited<ReturnType<typeof authService.login>>)

      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)

      await act(async () => {
        await result.current.submit(buildFormEvent())
      })

      expect(authService.register).toHaveBeenCalledWith({
        username: "anagomez",
        email: "ana@test.com",
        first_name: "Ana",
        last_name: "Gómez",
        password: "Secreta123",
      })
      expect(authService.login).toHaveBeenCalledWith({
        username: "anagomez",
        password: "Secreta123",
      })
      expect(setTokensMock).toHaveBeenCalledWith("tok-a", "tok-r", fakeUser)
      expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true })
      expect(result.current.loading).toBe(false)
      expect(result.current.submitError).toBeNull()
    })

    it("sin data en la respuesta del error, usa mensaje genérico y no toca 'errors'", async () => {
      vi.mocked(authService.register).mockRejectedValue(buildAxiosError(undefined, false))
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)

      await act(async () => {
        await result.current.submit(buildFormEvent())
      })

      expect(result.current.submitError).toBe(
        "We could not create your account. Please try again.",
      )
      expect(result.current.errors).toEqual({})
      expect(result.current.loading).toBe(false)
    })

    it("usa 'detail' del backend como generalError", async () => {
      vi.mocked(authService.register).mockRejectedValue(
        buildAxiosError({ detail: "El usuario ya existe" }),
      )
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)

      await act(async () => {
        await result.current.submit(buildFormEvent())
      })

      expect(result.current.submitError).toBe("El usuario ya existe")
    })

    it("sin 'detail', usa 'non_field_errors' (array) como generalError", async () => {
      vi.mocked(authService.register).mockRejectedValue(
        buildAxiosError({ non_field_errors: ["Error general del servidor"] }),
      )
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)

      await act(async () => {
        await result.current.submit(buildFormEvent())
      })

      expect(result.current.submitError).toBe("Error general del servidor")
    })

    it("mapea first_name, last_name y password del backend a errors correspondientes", async () => {
      vi.mocked(authService.register).mockRejectedValue(
        buildAxiosError({
          first_name: ["El nombre es requerido"],
          last_name: "El apellido es requerido",
          password: ["La contraseña es muy débil"],
        }),
      )
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)

      await act(async () => {
        await result.current.submit(buildFormEvent())
      })

      expect(result.current.errors.firstName).toBe("El nombre es requerido")
      expect(result.current.errors.lastName).toBe("El apellido es requerido")
      expect(result.current.errors.password).toBe("La contraseña es muy débil")
      // hay errores de campo mapeados y no hay detail/non_field_errors -> no submitError genérico
      expect(result.current.submitError).toBeNull()
    })

    it("mapea username y email del backend a errors correspondientes", async () => {
      vi.mocked(authService.register).mockRejectedValue(
        buildAxiosError({
          username: "Este nombre de usuario ya está en uso",
          email: ["Este correo ya está registrado"],
        }),
      )
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)

      await act(async () => {
        await result.current.submit(buildFormEvent())
      })

      expect(result.current.errors.username).toBe("Este nombre de usuario ya está en uso")
      expect(result.current.errors.email).toBe("Este correo ya está registrado")
    })

    it("backend con data pero sin ningún campo reconocido cae al mensaje de fallback", async () => {
      vi.mocked(authService.register).mockRejectedValue(buildAxiosError({}))
      const { result } = renderHook(() => useRegisterForm())
      fillValidForm(result)

      await act(async () => {
        await result.current.submit(buildFormEvent())
      })

      expect(result.current.submitError).toBe(
        "We could not create your account. Please review the form.",
      )
      expect(result.current.errors).toEqual({})
    })
  })
})