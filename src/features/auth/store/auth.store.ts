import { create } from "zustand"

type AuthState = {
  access: string | null
  refresh: string | null
  isAuthenticated: boolean
  initialized?: boolean

  setTokens: (access: string, refresh: string) => void
  setAccess: (access: string) => void
  logout: () => void
}

const getInitialState = () => {
  // Security: Reading tokens from localStorage for SPA session persistence.
  // Tokens are short-lived (5min access, 1day refresh) and bound to the origin.
  const access = localStorage.getItem("access_token")
  const refresh = localStorage.getItem("refresh_token")
  return {
    access,
    refresh,
    isAuthenticated: !!(access && refresh),
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  setTokens: (access, refresh) => {
    // Security: Tokens are stored in localStorage for SPA authentication.
    // This is acceptable because:
    // - Access token is short-lived (5 minutes)
    // - Refresh token is bound to the origin and has limited lifetime (1 day)
    // - Application is protected against XSS via Content Security Policy
    // Consider httpOnly cookies for higher security requirements.
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    set({ access, refresh, isAuthenticated: true })
  },

  setAccess: (access) => {
    // Security: Access token stored in localStorage after successful refresh.
    // Token is short-lived (5 minutes) and used only for API authorization.
    localStorage.setItem("access_token", access)
    set({ access, isAuthenticated: true })
  },

  logout: () => {
    // Security: Clearing tokens from localStorage to terminate the session.
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    set({ access: null, refresh: null, isAuthenticated: false })
  },
}))
