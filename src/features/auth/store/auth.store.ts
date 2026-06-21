// src/features/auth/store/auth.store.ts
import { create } from "zustand"

type AuthState = {
  access: string | null
  refresh: string | null
  isAuthenticated: boolean,
  initialized?: boolean

  setTokens: (access: string, refresh: string) => void
  setAccess: (access: string) => void
  logout: () => void
}

// Extraemos la lógica a una función pura que se ejecuta al crear el store
const getInitialState = () => {
  const access = localStorage.getItem("access_token")
  const refresh = localStorage.getItem("refresh_token")
  return {
    access,
    refresh,
    isAuthenticated: !!(access && refresh),
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(), // Se inicializa con los valores correctos de inmediato

  setTokens: (access, refresh) => {
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    set({ access, refresh, isAuthenticated: true })
  },

  setAccess: (access) => {
    localStorage.setItem("access_token", access)
    set({ access, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    set({ access: null, refresh: null, isAuthenticated: false })
  },
}))
