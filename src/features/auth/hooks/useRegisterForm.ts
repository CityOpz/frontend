import { useState } from "react"
import { useNavigate } from "react-router"
import type { AxiosError } from "axios"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"
import type { FormErrors, RegisterFormState } from "../types/auth.types"
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
} from "../utils/validators"

type BackendError = Partial<
  Record<keyof FormErrors | "first_name" | "last_name" | "detail" | "non_field_errors", string | string[]>
>

export function useRegisterForm() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [termsError, setTermsError] = useState<string | null>(null)

  const [form, setForm] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const update = <K extends keyof RegisterFormState>(field: K) => {
    return (value: RegisterFormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))

      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }

      if (submitError) {
        setSubmitError(null)
      }

      if (field === "acceptTerms" && value === true) {
        setTermsError(null)
      }
    }
  }

  const validateField = (field: keyof FormErrors, value: string) => {
    let result

    switch (field) {
      case "firstName":
        result = validateFirstName(value)
        break
      case "lastName":
        result = validateLastName(value)
        break
      case "username":
        result = validateUsername(value)
        break
      case "email":
        result = validateEmail(value.toLowerCase())
        break
      case "password":
        result = validatePassword(value)
        break
      case "confirmPassword":
        result = validateConfirmPassword(form.password, value)
        break
      default:
        result = { valid: true }
    }

    if (result.valid === false) {
      setErrors((prev) => ({ ...prev, [field]: result.error }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    return result.valid
  }

  const validateAll = (): boolean => {
    let isValid = true

    const checks: Array<[keyof FormErrors, string]> = [
      ["firstName", form.firstName],
      ["lastName", form.lastName],
      ["username", form.username],
      ["email", form.email.toLowerCase()],
      ["password", form.password],
      ["confirmPassword", form.confirmPassword],
    ]

    for (const [field, value] of checks) {
      const result = validateField(field, value)
      if (result === false) isValid = false
    }

    return isValid
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.acceptTerms) {
      setTermsError("You must accept the terms and conditions")
      return
    }

    if (!validateAll()) return

    setLoading(true)
    setSubmitError(null)

    try {
      await registerAndLogin(form, setTokens)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      const error = err as AxiosError<BackendError>
      const backendErrors = error.response?.data

      if (!backendErrors) {
        setSubmitError("We could not create your account. Please try again.")
        return
      }

      const newErrors = mapBackendErrors(backendErrors)

      setErrors((prev) => ({ ...prev, ...newErrors }))

      const generalError =
        getBackendMessage(backendErrors.detail) ??
        getBackendMessage(backendErrors.non_field_errors)

      if (generalError) {
        setSubmitError(generalError)
      } else if (Object.keys(newErrors).length === 0) {
        setSubmitError("We could not create your account. Please review the form.")
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    errors,
    termsError,
    submitError,
    loading,
    submit,
    update,
    validateField,
  }
}

function getBackendMessage(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function mapBackendErrors(backendErrors: BackendError): Partial<FormErrors> {
  const newErrors: Partial<FormErrors> = {}

  if (backendErrors.username) {
    newErrors.username = getBackendMessage(backendErrors.username)
  }

  if (backendErrors.first_name) {
    newErrors.firstName = getBackendMessage(backendErrors.first_name)
  }

  if (backendErrors.last_name) {
    newErrors.lastName = getBackendMessage(backendErrors.last_name)
  }

  if (backendErrors.email) {
    newErrors.email = getBackendMessage(backendErrors.email)
  }

  if (backendErrors.password) {
    newErrors.password = getBackendMessage(backendErrors.password)
  }

  return newErrors
}

async function registerAndLogin(
  form: RegisterFormState,
  setTokens: (access: string, refresh: string, user?: any) => void,
) {
  await authService.register({
    username: form.username,
    email: form.email.toLowerCase(),
    first_name: form.firstName,
    last_name: form.lastName,
    password: form.password,
  })

  const loginRes = await authService.login({
    username: form.username,
    password: form.password,
  })

  const { access, refresh, user } = loginRes.data
  setTokens(access, refresh, user)
}