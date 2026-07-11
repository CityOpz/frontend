
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { LoginForm } from "./LoginForm"
import { useLoginForm } from "../hooks/useLoginForm"

vi.mock("../hooks/useLoginForm")

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  )
}

describe("LoginForm", () => {
  const mockUpdate = vi.fn().mockReturnValue(vi.fn())
  const mockSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdate.mockReturnValue(vi.fn())
    
    vi.mocked(useLoginForm).mockReturnValue({
      form: {
        username: "",
        password: "",
      },
      loading: false,
      error: null,
      submit: mockSubmit,
      update: mockUpdate,
    })
  })

  it("renderiza el título y descripción", () => {
    renderWithRouter(<LoginForm />)
    
    expect(screen.getByText("Bienvenido de nuevo")).toBeInTheDocument()
    expect(screen.getByText("Identifícate para continuar al panel de control.")).toBeInTheDocument()
  })

  it("renderiza el logo de CityOps", () => {
    renderWithRouter(<LoginForm />)
    
    expect(screen.getByText("City")).toBeInTheDocument()
    expect(screen.getByText("Ops")).toBeInTheDocument()
    expect(screen.getByText("Portal GovTech")).toBeInTheDocument()
  })

  it("renderiza los campos de username y password", () => {
    renderWithRouter(<LoginForm />)
    
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it("renderiza el botón de submit", () => {
    renderWithRouter(<LoginForm />)
    
    const submitButton = screen.getByRole("button", { name: /acceder al sistema/i })
    expect(submitButton).toBeInTheDocument()
  })

  it("renderiza el link para crear cuenta", () => {
    renderWithRouter(<LoginForm />)
    
    expect(screen.getByText(/nuevo en cityops/i)).toBeInTheDocument()
    expect(screen.getByText(/crea tu cuenta/i)).toBeInTheDocument()
  })

  it("muestra error cuando existe", () => {
    vi.mocked(useLoginForm).mockReturnValue({
      form: { username: "", password: "" },
      loading: false,
      error: "Invalid credentials",
      submit: mockSubmit,
      update: mockUpdate,
    })

    renderWithRouter(<LoginForm />)
    
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
  })

  it("no muestra error cuando es null", () => {
    renderWithRouter(<LoginForm />)
    
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument()
  })

  it("muestra estado loading cuando está cargando", () => {
    vi.mocked(useLoginForm).mockReturnValue({
      form: { username: "", password: "" },
      loading: true,
      error: null,
      submit: mockSubmit,
      update: mockUpdate,
    })

    renderWithRouter(<LoginForm />)
    
    const submitButton = screen.getByRole("button", { name: /loading/i })
    expect(submitButton).toBeDisabled()
  })

  it("llama a update cuando se cambia el username", () => {
    renderWithRouter(<LoginForm />)
    
    const usernameInput = screen.getByLabelText(/nombre de usuario/i)
    fireEvent.change(usernameInput, { target: { value: "testuser" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("username")
  })

  it("llama a submit cuando se envía el formulario", async () => {
    renderWithRouter(<LoginForm />)
    
    const submitButton = screen.getByRole("button", { name: /acceder al sistema/i })
    const form = submitButton.closest("form")
    
    expect(form).not.toBeNull()
    
    if (form) {
      fireEvent.submit(form)
    }
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it("llama a update cuando se cambia el password", () => {
    renderWithRouter(<LoginForm />)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    expect(mockUpdate).toHaveBeenCalledWith("password")
  })
})