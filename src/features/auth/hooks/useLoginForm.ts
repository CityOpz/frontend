import { useState } from "react"
import { useNavigate } from "react-router"
import { authService } from "../services/auth.service"
import { useAuthStore } from "../store/auth.store"
import type { LoginFormState } from "../types/auth.types"
import type { AxiosError } from "axios"

type ApiError = {
  detail?: string
  message?: string
  username?: string | string[]
  password?: string | string[]
}

export function useLoginForm() {
  const navigate = useNavigate()
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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const { access, refresh, user } = res.data
      setTokens(access, refresh, user)

      navigate("/dashboard", { replace: true })
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const data = error.response?.data

      setError(
        data?.detail ||
        data?.message ||
        firstBackendMessage(data?.username) ||
        firstBackendMessage(data?.password) ||
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

function firstBackendMessage(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}
