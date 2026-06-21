import { redirect } from "react-router"
import { useAuthStore } from "@/features/auth/store/auth.store"

export function requireAuth() {
  const state = useAuthStore.getState()
  console.log("[requireAuth] State:", state)

  if (!state.isAuthenticated) {
    console.log("[requireAuth] Redirecting to /login")
    throw redirect("/login")
  }

  return null
}

export function requireGuest() {
  const state = useAuthStore.getState()
  console.log("[requireGuest] State:", state)

  if (state.isAuthenticated) {
    console.log("[requireGuest] Redirecting to /dashboard")
    throw redirect("/dashboard")
  }

  return null
}
