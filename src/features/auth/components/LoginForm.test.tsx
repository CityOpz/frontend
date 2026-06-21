// src/features/auth/components/LoginForm.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "./LoginForm"
import { useLoginForm } from "../hooks/useLoginForm"

vi.mock("../hooks/useLoginForm")

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
    render(<LoginForm />)
    
    expect(screen.getByText("Welcome Back")).toBeInTheDocument()
    expect(screen.getByText("Identify yourself to continue to the dashboard.")).toBeInTheDocument()
  })

  it("renderiza el logo de CityOps", () => {
    render(<LoginForm />)
    
    expect(screen.getByText("City")).toBeInTheDocument()
    expect(screen.getByText("Ops")).toBeInTheDocument()
    expect(screen.getByText("GovTech Portal")).toBeInTheDocument()
  })

  it("renderiza los campos de username y password", () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it("renderiza el botón de submit", () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole("button", { name: /access system/i })
    expect(submitButton).toBeInTheDocument()
  })

  it("renderiza el link para crear cuenta", () => {
    render(<LoginForm />)
    
    expect(screen.getByText(/new to cityops/i)).toBeInTheDocument()
    expect(screen.getByText(/create your account/i)).toBeInTheDocument()
  })

  it("muestra error cuando existe", () => {
    vi.mocked(useLoginForm).mockReturnValue({
      form: { username: "", password: "" },
      loading: false,
      error: "Invalid credentials",
      submit: mockSubmit,
      update: mockUpdate,
    })

    render(<LoginForm />)
    
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
  })

  it("no muestra error cuando es null", () => {
    render(<LoginForm />)
    
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

    render(<LoginForm />)
    
    const submitButton = screen.getByRole("button", { name: /loading/i })
    expect(submitButton).toBeDisabled()
  })

  it("llama a update cuando se cambia el username", () => {
    render(<LoginForm />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    fireEvent.change(usernameInput, { target: { value: "testuser" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("username")
  })

  it("llama a submit cuando se envía el formulario", async () => {
    render(<LoginForm />)
    
    // ✅ Obtener el formulario usando el botón submit
    const submitButton = screen.getByRole("button", { name: /access system/i })
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
    render(<LoginForm />)
    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    expect(mockUpdate).toHaveBeenCalledWith("password")
  })
})