// src/features/auth/components/RegisterForm.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { RegisterForm } from "./RegisterForm"
import { useRegisterForm } from "../hooks/useRegisterForm"

vi.mock("../hooks/useRegisterForm")

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe("RegisterForm", () => {
  const mockUpdate = vi.fn().mockReturnValue(vi.fn())
  const mockSubmit = vi.fn()
  const mockValidateField = vi.fn()

  const defaultForm = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdate.mockReturnValue(vi.fn())
    
    vi.mocked(useRegisterForm).mockReturnValue({
      form: defaultForm,
      errors: {},
      termsError: null,
      submitError: null,
      loading: false,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })
  })

  it("renderiza el título y descripción", () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByText("Crear una cuenta")).toBeInTheDocument()
    expect(screen.getByText("Accede a la suite de gestión urbana.")).toBeInTheDocument()
  })

  it("renderiza todos los campos del formulario", () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
  })

  it("renderiza el checkbox de términos", () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
  })

  it("renderiza el botón de submit", () => {
    renderWithRouter(<RegisterForm />)
    
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i })
    expect(submitButton).toBeInTheDocument()
  })

  it("renderiza el link para login", () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByText(/ya tienes una cuenta/i)).toBeInTheDocument()
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument()
  })

  it("muestra errores de campos cuando existen", () => {
    vi.mocked(useRegisterForm).mockReturnValue({
      form: defaultForm,
      errors: {
        username: "El nombre de usuario es obligatorio",
        email: "Formato de correo electrónico no válido",
      },
      termsError: null,
      submitError: null,
      loading: false,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })

    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByText("El nombre de usuario es obligatorio")).toBeInTheDocument()
    expect(screen.getByText("Formato de correo electrónico no válido")).toBeInTheDocument()
  })

  it("muestra error de términos cuando existe", () => {
    vi.mocked(useRegisterForm).mockReturnValue({
      form: defaultForm,
      errors: {},
      termsError: "Debes aceptar los términos y condiciones",
      submitError: null,
      loading: false,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })

    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByText("Debes aceptar los términos y condiciones")).toBeInTheDocument()
  })

  it("muestra estado loading cuando está cargando", () => {
    vi.mocked(useRegisterForm).mockReturnValue({
      form: defaultForm,
      errors: {},
      termsError: null,
      submitError: null,
      loading: true,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })

    renderWithRouter(<RegisterForm />)
    
    const submitButton = screen.getByRole("button", { name: /loading/i })
    expect(submitButton).toBeDisabled()
  })

  it("muestra error general de envío cuando existe", () => {
    vi.mocked(useRegisterForm).mockReturnValue({
      form: defaultForm,
      errors: {},
      termsError: null,
      submitError: "No se pudo crear tu cuenta.",
      loading: false,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })

    renderWithRouter(<RegisterForm />)

    expect(screen.getByText("No se pudo crear tu cuenta.")).toBeInTheDocument()
  })

  it("llama a update cuando se cambia firstName", () => {
    renderWithRouter(<RegisterForm />)
    
    const firstNameInput = screen.getByLabelText(/nombre/i)
    fireEvent.change(firstNameInput, { target: { value: "John" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("firstName")
  })

  it("llama a update cuando se cambia lastName", () => {
    renderWithRouter(<RegisterForm />)
    
    const lastNameInput = screen.getByLabelText(/apellido/i)
    fireEvent.change(lastNameInput, { target: { value: "Doe" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("lastName")
  })

  it("llama a update cuando se cambia username", () => {
    renderWithRouter(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText(/nombre de usuario/i)
    fireEvent.change(usernameInput, { target: { value: "johndoe" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("username")
  })

  it("llama a update cuando se cambia email", () => {
    renderWithRouter(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    fireEvent.change(emailInput, { target: { value: "john@example.com" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("email")
  })

  it("convierte email a minúsculas al cambiar", () => {
    const updateFn = vi.fn()
    mockUpdate.mockImplementation((field: string) => {
      if (field === "email") {
        return updateFn
      }
      return vi.fn()
    })
    
    renderWithRouter(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    fireEvent.change(emailInput, { target: { value: "TEST@EMAIL.COM" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("email")
    expect(updateFn).toHaveBeenCalledWith("test@email.com")
  })

  it("llama a validateField cuando se hace blur en firstName", () => {
    renderWithRouter(<RegisterForm />)
    
    const firstNameInput = screen.getByLabelText(/nombre/i)
    fireEvent.blur(firstNameInput)
    
    expect(mockValidateField).toHaveBeenCalledWith("firstName", "")
  })

  it("llama a validateField cuando se hace blur en email", () => {
    renderWithRouter(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    fireEvent.blur(emailInput)
    
    expect(mockValidateField).toHaveBeenCalledWith("email", "")
  })

  it("llama a update cuando se cambia el checkbox de términos", () => {
    renderWithRouter(<RegisterForm />)
    
    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)
    
    expect(mockUpdate).toHaveBeenCalledWith("acceptTerms")
  })

  it("llama a submit cuando se envía el formulario", async () => {
    renderWithRouter(<RegisterForm />)
    
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i })
    const form = submitButton.closest("form")
    
    expect(form).not.toBeNull()
    
    if (form) {
      fireEvent.submit(form)
    }
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it("muestra los requisitos de password cuando el campo está enfocado", () => {
    renderWithRouter(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    fireEvent.focus(passwordInput)
    
    expect(screen.getByText("De 8 a 12 caracteres")).toBeInTheDocument()
    expect(screen.getByText("Al menos 1 letra mayúscula")).toBeInTheDocument()
    expect(screen.getByText("Al menos 1 letra minúscula")).toBeInTheDocument()
    expect(screen.getByText("Al menos 1 número")).toBeInTheDocument()
    expect(screen.getByText("Las contraseñas coinciden")).toBeInTheDocument()
  })

  it("oculta los requisitos de password cuando el campo pierde el foco", () => {
    renderWithRouter(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    fireEvent.focus(passwordInput)
    fireEvent.blur(passwordInput)
    
    expect(screen.queryByText("De 8 a 12 caracteres")).not.toBeInTheDocument()
  })

  it("llama a update cuando se cambia password", () => {
    renderWithRouter(<RegisterForm />)
    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    fireEvent.change(passwordInput, { target: { value: "Password1" } })
    expect(mockUpdate).toHaveBeenCalledWith("password")
  })

  it("llama a update cuando se cambia confirmPassword", () => {
    renderWithRouter(<RegisterForm />)
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
    fireEvent.change(confirmPasswordInput, { target: { value: "Password1" } })
    expect(mockUpdate).toHaveBeenCalledWith("confirmPassword")
  })

  it("llama a validateField cuando se hace blur en password", () => {
    renderWithRouter(<RegisterForm />)
    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    fireEvent.blur(passwordInput)
    expect(mockValidateField).toHaveBeenCalledWith("password", "")
  })

  it("llama a validateField cuando se hace blur en confirmPassword", () => {
    renderWithRouter(<RegisterForm />)
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i)
    fireEvent.blur(confirmPasswordInput)
    expect(mockValidateField).toHaveBeenCalledWith("confirmPassword", "")
  })
})