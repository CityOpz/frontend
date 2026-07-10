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
    
    expect(screen.getByText("Create an account")).toBeInTheDocument()
    expect(screen.getByText("Access the urban management suite.")).toBeInTheDocument()
  })

  it("renderiza todos los campos del formulario", () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it("renderiza el checkbox de términos", () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
  })

  it("renderiza el botón de submit", () => {
    renderWithRouter(<RegisterForm />)
    
    const submitButton = screen.getByRole("button", { name: /create account/i })
    expect(submitButton).toBeInTheDocument()
  })

  it("renderiza el link para login", () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })

  it("muestra errores de campos cuando existen", () => {
    vi.mocked(useRegisterForm).mockReturnValue({
      form: defaultForm,
      errors: {
        username: "Username is required",
        email: "Invalid email format",
      },
      termsError: null,
      submitError: null,
      loading: false,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })

    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByText("Username is required")).toBeInTheDocument()
    expect(screen.getByText("Invalid email format")).toBeInTheDocument()
  })

  it("muestra error de términos cuando existe", () => {
    vi.mocked(useRegisterForm).mockReturnValue({
      form: defaultForm,
      errors: {},
      termsError: "You must accept the terms and conditions",
      submitError: null,
      loading: false,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })

    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByText("You must accept the terms and conditions")).toBeInTheDocument()
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
      submitError: "We could not create your account.",
      loading: false,
      submit: mockSubmit,
      update: mockUpdate,
      validateField: mockValidateField,
    })

    renderWithRouter(<RegisterForm />)

    expect(screen.getByText("We could not create your account.")).toBeInTheDocument()
  })

  it("llama a update cuando se cambia firstName", () => {
    renderWithRouter(<RegisterForm />)
    
    const firstNameInput = screen.getByLabelText(/first name/i)
    fireEvent.change(firstNameInput, { target: { value: "John" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("firstName")
  })

  it("llama a update cuando se cambia lastName", () => {
    renderWithRouter(<RegisterForm />)
    
    const lastNameInput = screen.getByLabelText(/last name/i)
    fireEvent.change(lastNameInput, { target: { value: "Doe" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("lastName")
  })

  it("llama a update cuando se cambia username", () => {
    renderWithRouter(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    fireEvent.change(usernameInput, { target: { value: "johndoe" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("username")
  })

  it("llama a update cuando se cambia email", () => {
    renderWithRouter(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
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
    
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: "TEST@EMAIL.COM" } })
    
    expect(mockUpdate).toHaveBeenCalledWith("email")
    expect(updateFn).toHaveBeenCalledWith("test@email.com")
  })

  it("llama a validateField cuando se hace blur en firstName", () => {
    renderWithRouter(<RegisterForm />)
    
    const firstNameInput = screen.getByLabelText(/first name/i)
    fireEvent.blur(firstNameInput)
    
    expect(mockValidateField).toHaveBeenCalledWith("firstName", "")
  })

  it("llama a validateField cuando se hace blur en email", () => {
    renderWithRouter(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
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
    
    const submitButton = screen.getByRole("button", { name: /create account/i })
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
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    fireEvent.focus(passwordInput)
    
    expect(screen.getByText("8-12 characters")).toBeInTheDocument()
    expect(screen.getByText("At least 1 uppercase letter")).toBeInTheDocument()
    expect(screen.getByText("At least 1 lowercase letter")).toBeInTheDocument()
    expect(screen.getByText("At least 1 number")).toBeInTheDocument()
    expect(screen.getByText("Passwords match")).toBeInTheDocument()
  })

  it("oculta los requisitos de password cuando el campo pierde el foco", () => {
    renderWithRouter(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    fireEvent.focus(passwordInput)
    fireEvent.blur(passwordInput)
    
    expect(screen.queryByText("8-12 characters")).not.toBeInTheDocument()
  })

  it("llama a update cuando se cambia password", () => {
    renderWithRouter(<RegisterForm />)
    const passwordInput = screen.getByLabelText(/^password$/i)
    fireEvent.change(passwordInput, { target: { value: "Password1" } })
    expect(mockUpdate).toHaveBeenCalledWith("password")
  })

  it("llama a update cuando se cambia confirmPassword", () => {
    renderWithRouter(<RegisterForm />)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    fireEvent.change(confirmPasswordInput, { target: { value: "Password1" } })
    expect(mockUpdate).toHaveBeenCalledWith("confirmPassword")
  })

  it("llama a validateField cuando se hace blur en password", () => {
    renderWithRouter(<RegisterForm />)
    const passwordInput = screen.getByLabelText(/^password$/i)
    fireEvent.blur(passwordInput)
    expect(mockValidateField).toHaveBeenCalledWith("password", "")
  })

  it("llama a validateField cuando se hace blur en confirmPassword", () => {
    renderWithRouter(<RegisterForm />)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    fireEvent.blur(confirmPasswordInput)
    expect(mockValidateField).toHaveBeenCalledWith("confirmPassword", "")
  })
})