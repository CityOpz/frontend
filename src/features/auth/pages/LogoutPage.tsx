import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthStore } from "../store/auth.store"

export default function LogoutPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    logout()
    navigate("/login", { replace: true })
  }, [logout, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-xl font-bold">Cerrando sesión...</h1>
        <p className="text-sm text-muted-foreground mt-2">Por favor espera un momento.</p>
      </div>
    </div>
  )
}
