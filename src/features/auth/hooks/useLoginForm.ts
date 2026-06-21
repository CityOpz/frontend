import { useState } from "react"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"
import type { LoginFormState } from "../types/auth.types"
import type { AxiosError } from "axios"

type ApiError = {
  detail?: string
  message?: string
}

export function useLoginForm() {
  const setTokens = useAuthStore((s) => s.setTokens)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<LoginFormState>({
    username: "",
    password: "",
  })

  const update = <K extends keyof LoginFormState>(field: K) => {
    return (value: LoginFormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (error) setError(null)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.username || !form.password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await authService.login({
        username: form.username,
        password: form.password,
      })

      const { access, refresh } = res.data
      setTokens(access, refresh)

      globalThis.location.href = "/dashboard"
    } catch (err) {
      const error = err as AxiosError<ApiError>

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Invalid credentials"
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    error,
    submit,
    update,
  }
}
