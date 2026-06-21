import { useState } from "react"
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

type BackendError = Partial<Record<keyof FormErrors, string | string[]>>

export function useRegisterForm() {
  const setTokens = useAuthStore((s) => s.setTokens)

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
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
      if (result === false) isValid = false // ✅ Sin negación
    }

    return isValid
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.acceptTerms) {
      setTermsError("You must accept the terms and conditions")
      return
    }

    if (!validateAll()) return

    setLoading(true)

    try {
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

      const { access, refresh } = loginRes.data

      setTokens(access, refresh)

      globalThis.location.href = "/dashboard" // ✅ globalThis
    } catch (err) {
      const error = err as AxiosError<BackendError>
      const backendErrors = error.response?.data

      if (!backendErrors) return

      const newErrors: Partial<FormErrors> = {}

      if (backendErrors.username) {
        newErrors.username = Array.isArray(backendErrors.username)
          ? backendErrors.username[0]
          : backendErrors.username
      }

      if (backendErrors.email) {
        newErrors.email = Array.isArray(backendErrors.email)
          ? backendErrors.email[0]
          : backendErrors.email
      }

      setErrors((prev) => ({ ...prev, ...newErrors }))
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    errors,
    termsError,
    loading,
    submit,
    update,
    validateField,
  }
}
